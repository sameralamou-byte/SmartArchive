import logging
import uuid
from datetime import UTC, datetime, timedelta

from sqlalchemy import delete, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import EmailNotVerifiedError
from app.core.tenancy import set_tenant_context
from app.mailer.sender import get_email_sender
from app.mailer.templates import (
    locale_from_accept_language,
    render_password_reset_email,
    render_verification_email,
)
from app.models.account import Account
from app.models.account_email_verification_token import AccountEmailVerificationToken
from app.models.account_password_reset_token import AccountPasswordResetToken
from app.models.account_session import AccountSession
from app.models.organization import Organization
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import ChangePasswordRequest, LoginRequest, RegisterRequest, ResetPasswordRequest
from app.security.email_verification import generate_raw_token, hash_token
from app.security.jwt import TokenType, create_token, hash_password, verify_password
from app.security.password_policy import require_password_policy
from app.services.auth_exceptions import (
    AuthenticationError,
    PasswordPolicyError,
    PasswordResetInvalidError,
    RefreshReuseError,
    VerifyEmailError,
)

logger = logging.getLogger("smartarchive.auth")

VERIFY_TOKEN_TTL = timedelta(hours=24)
RESET_TOKEN_TTL = timedelta(hours=1)
SESSION_ABSOLUTE_CAP = timedelta(hours=24)
PERSISTENT_SESSION_TTL = timedelta(days=7)
VERIFY_INVALID_DETAIL = "This confirmation link is invalid or has expired."
RESET_INVALID_DETAIL = "This reset link is invalid or has expired."
PASSWORD_CONFIRM_DETAIL = "Passwords do not match."
PASSWORD_REUSE_DETAIL = "New password must be different from the current password."
GENERIC_CREDENTIALS = "Invalid credentials"

__all__ = [
    "AuthService",
    "AuthenticationError",
    "PasswordPolicyError",
    "PasswordResetInvalidError",
    "RefreshReuseError",
    "VerifyEmailError",
]


class AuthService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.users = UserRepository(session)

    async def register(self, data: RegisterRequest, accept_language: str | None = None) -> User:
        require_password_policy(data.password)
        existing_account = await self.session.execute(select(Account).where(Account.email == data.email))
        if existing_account.scalar_one_or_none() is not None:
            raise AuthenticationError("A user with this email already exists")

        slug = data.organization_name.strip().lower().replace(" ", "-")
        org = Organization(name=data.organization_name, slug=slug)
        self.session.add(org)
        await self.session.flush()

        account = Account(email=data.email, personal_organization_id=org.id)
        self.session.add(account)
        await self.session.flush()

        user = User(
            email=data.email,
            hashed_password=hash_password(data.password),
            full_name=data.full_name,
            organization_id=org.id,
            account_id=account.id,
            is_superuser=True,  # admin of this Personal Tenant only
        )
        await self.users.create(user)
        if settings.allows_dev_email_auto_verify():
            self._auto_verify_for_local_dev(account)
        raw_token = await self._replace_unconsumed_token(account.id)
        await self.session.commit()
        self._send_verification_email(str(data.email), raw_token, accept_language)
        return user

    async def authenticate(self, data: LoginRequest) -> tuple[str, str, bool]:
        account_result = await self.session.execute(select(Account).where(Account.email == data.email))
        account = account_result.scalar_one_or_none()
        if account is None or not account.is_active:
            raise AuthenticationError(GENERIC_CREDENTIALS)

        org_result = await self.session.execute(
            select(Organization).where(Organization.id == account.personal_organization_id)
        )
        org = org_result.scalar_one_or_none()
        if org is None:
            raise AuthenticationError(GENERIC_CREDENTIALS)

        if data.organization_slug is not None and data.organization_slug != "":
            if org.slug != data.organization_slug:
                raise AuthenticationError(GENERIC_CREDENTIALS)

        user = await self.users.get_by_account_and_organization(account.id, org.id)
        if user is None or not verify_password(data.password, user.hashed_password):
            raise AuthenticationError(GENERIC_CREDENTIALS)
        if not user.is_active:
            raise AuthenticationError("User is inactive")
        if account.email_verified_at is None:
            raise EmailNotVerifiedError("Confirm your email before signing in.")

        remember_me = bool(data.remember_me)
        raw_refresh = await self._create_session(account.id, remember_me)
        access = create_token(user.id, user.organization_id, TokenType.access, user.account_id)
        await self.session.commit()
        return access, raw_refresh, remember_me

    async def refresh_from_cookie(self, raw_secret: str) -> tuple[str, str, bool]:
        if not raw_secret:
            raise AuthenticationError(GENERIC_CREDENTIALS)

        digest = hash_token(raw_secret, settings.session_refresh_secret)
        result = await self.session.execute(
            select(AccountSession).where(AccountSession.refresh_hash == digest)
        )
        row = result.scalar_one_or_none()
        if row is None:
            raise AuthenticationError(GENERIC_CREDENTIALS)

        if row.revoked_at is not None:
            await self._revoke_all_sessions(row.account_id)
            await self.session.commit()
            raise RefreshReuseError(GENERIC_CREDENTIALS)

        now = datetime.now(UTC)
        if row.expires_at <= now:
            raise AuthenticationError(GENERIC_CREDENTIALS)

        account = await self.session.get(Account, row.account_id)
        if account is None or not account.is_active or account.email_verified_at is None:
            raise AuthenticationError(GENERIC_CREDENTIALS)

        user = await self.users.get_by_account_and_organization(account.id, account.personal_organization_id)
        if user is None or not user.is_active:
            raise AuthenticationError(GENERIC_CREDENTIALS)

        new_raw = await self._rotate_session(row)
        access = create_token(user.id, user.organization_id, TokenType.access, user.account_id)
        await self.session.commit()
        return access, new_raw, row.remember_me

    async def logout_from_cookie(self, raw_secret: str | None) -> None:
        if not raw_secret:
            return
        digest = hash_token(raw_secret, settings.session_refresh_secret)
        result = await self.session.execute(
            select(AccountSession).where(AccountSession.refresh_hash == digest)
        )
        row = result.scalar_one_or_none()
        if row is None or row.revoked_at is not None:
            return
        row.revoked_at = datetime.now(UTC)
        await self.session.commit()

    async def forgot_password(self, email: str) -> None:
        account_result = await self.session.execute(select(Account).where(Account.email == email))
        account = account_result.scalar_one_or_none()
        if account is None or not account.is_active:
            return
        raw_token = await self._replace_unconsumed_reset_token(account.id)
        await self.session.commit()
        self._send_password_reset_email(str(account.email), raw_token)

    async def reset_password(self, data: ResetPasswordRequest) -> None:
        if not data.token.strip():
            raise PasswordResetInvalidError(RESET_INVALID_DETAIL)

        token_hash = hash_token(data.token, settings.password_reset_secret)
        result = await self.session.execute(
            select(AccountPasswordResetToken).where(AccountPasswordResetToken.token_hash == token_hash)
        )
        row = result.scalar_one_or_none()
        now = datetime.now(UTC)
        if row is None or row.consumed_at is not None or row.expires_at <= now:
            raise PasswordResetInvalidError(RESET_INVALID_DETAIL)

        account = await self.session.get(Account, row.account_id)
        if account is None or not account.is_active:
            raise PasswordResetInvalidError(RESET_INVALID_DETAIL)

        await set_tenant_context(self.session, str(account.personal_organization_id))
        user = await self.users.get_by_account_and_organization(account.id, account.personal_organization_id)
        if user is None or not user.is_active:
            raise PasswordResetInvalidError(RESET_INVALID_DETAIL)

        if data.password != data.password_confirm:
            raise PasswordPolicyError(PASSWORD_CONFIRM_DETAIL)
        require_password_policy(data.password)
        if verify_password(data.password, user.hashed_password):
            raise PasswordPolicyError(PASSWORD_REUSE_DETAIL)

        user.hashed_password = hash_password(data.password)
        row.consumed_at = now
        await self.session.execute(
            update(AccountPasswordResetToken)
            .where(
                AccountPasswordResetToken.account_id == account.id,
                AccountPasswordResetToken.consumed_at.is_(None),
                AccountPasswordResetToken.id != row.id,
            )
            .values(consumed_at=now)
        )
        await self._revoke_all_sessions(account.id)
        await self.session.commit()

    async def change_password(self, user: User, data: ChangePasswordRequest) -> None:
        if not verify_password(data.current_password, user.hashed_password):
            raise AuthenticationError(GENERIC_CREDENTIALS)
        if data.new_password != data.new_password_confirm:
            raise PasswordPolicyError(PASSWORD_CONFIRM_DETAIL)
        require_password_policy(data.new_password)
        if verify_password(data.new_password, user.hashed_password):
            raise PasswordPolicyError(PASSWORD_REUSE_DETAIL)

        user.hashed_password = hash_password(data.new_password)
        now = datetime.now(UTC)
        await self.session.execute(
            update(AccountPasswordResetToken)
            .where(
                AccountPasswordResetToken.account_id == user.account_id,
                AccountPasswordResetToken.consumed_at.is_(None),
            )
            .values(consumed_at=now)
        )
        await self._revoke_all_sessions(user.account_id)
        await self.session.commit()

    async def verify_email(self, raw_token: str) -> bool:
        if not raw_token.strip():
            raise VerifyEmailError(VERIFY_INVALID_DETAIL)

        token_hash = hash_token(raw_token)
        result = await self.session.execute(
            select(AccountEmailVerificationToken).where(
                AccountEmailVerificationToken.token_hash == token_hash
            )
        )
        row = result.scalar_one_or_none()
        if row is None:
            raise VerifyEmailError(VERIFY_INVALID_DETAIL)

        account_result = await self.session.execute(select(Account).where(Account.id == row.account_id))
        account = account_result.scalar_one_or_none()
        if account is None:
            raise VerifyEmailError(VERIFY_INVALID_DETAIL)

        now = datetime.now(UTC)
        if row.consumed_at is not None:
            if account.email_verified_at is not None:
                return True
            raise VerifyEmailError(VERIFY_INVALID_DETAIL)

        if row.expires_at <= now:
            raise VerifyEmailError(VERIFY_INVALID_DETAIL)

        row.consumed_at = now
        if account.email_verified_at is None:
            account.email_verified_at = now
        await self.session.commit()
        return True

    async def resend_verification(self, email: str, accept_language: str | None = None) -> None:
        account_result = await self.session.execute(select(Account).where(Account.email == email))
        account = account_result.scalar_one_or_none()
        if account is None or not account.is_active or account.email_verified_at is not None:
            return
        raw_token = await self._replace_unconsumed_token(account.id)
        await self.session.commit()
        self._send_verification_email(str(account.email), raw_token, accept_language)

    async def _replace_unconsumed_token(self, account_id: uuid.UUID) -> str:
        await self.session.execute(
            delete(AccountEmailVerificationToken).where(
                AccountEmailVerificationToken.account_id == account_id,
                AccountEmailVerificationToken.consumed_at.is_(None),
            )
        )
        raw = generate_raw_token()
        now = datetime.now(UTC)
        self.session.add(
            AccountEmailVerificationToken(
                account_id=account_id,
                token_hash=hash_token(raw),
                expires_at=now + VERIFY_TOKEN_TTL,
            )
        )
        await self.session.flush()
        return raw

    async def _replace_unconsumed_reset_token(self, account_id: uuid.UUID) -> str:
        await self.session.execute(
            delete(AccountPasswordResetToken).where(
                AccountPasswordResetToken.account_id == account_id,
                AccountPasswordResetToken.consumed_at.is_(None),
            )
        )
        raw = generate_raw_token()
        now = datetime.now(UTC)
        self.session.add(
            AccountPasswordResetToken(
                account_id=account_id,
                token_hash=hash_token(raw, settings.password_reset_secret),
                expires_at=now + RESET_TOKEN_TTL,
            )
        )
        await self.session.flush()
        return raw

    async def _create_session(self, account_id: uuid.UUID, remember_me: bool) -> str:
        raw = generate_raw_token()
        now = datetime.now(UTC)
        ttl = PERSISTENT_SESSION_TTL if remember_me else SESSION_ABSOLUTE_CAP
        self.session.add(
            AccountSession(
                account_id=account_id,
                refresh_hash=hash_token(raw, settings.session_refresh_secret),
                expires_at=now + ttl,
                remember_me=remember_me,
            )
        )
        await self.session.flush()
        return raw

    async def _rotate_session(self, current: AccountSession) -> str:
        """Revoke the current row and insert a new one. Never overwrite refresh_hash."""
        now = datetime.now(UTC)
        current.revoked_at = now
        raw = generate_raw_token()
        self.session.add(
            AccountSession(
                account_id=current.account_id,
                refresh_hash=hash_token(raw, settings.session_refresh_secret),
                expires_at=current.expires_at,
                remember_me=current.remember_me,
            )
        )
        await self.session.flush()
        return raw

    async def _revoke_all_sessions(self, account_id: uuid.UUID) -> None:
        now = datetime.now(UTC)
        await self.session.execute(
            update(AccountSession)
            .where(AccountSession.account_id == account_id, AccountSession.revoked_at.is_(None))
            .values(revoked_at=now)
        )

    def _auto_verify_for_local_dev(self, account: Account) -> None:
        """Fail-closed: production-shaped settings never skip mailbox proof."""
        if not settings.allows_dev_email_auto_verify():
            return
        account.email_verified_at = datetime.now(UTC)

    def _send_verification_email(self, to: str, raw_token: str, accept_language: str | None) -> None:
        verify_url = f"{settings.public_app_origin.rstrip('/')}/verify-email?token={raw_token}"
        locale = locale_from_accept_language(accept_language)
        subject, text_body = render_verification_email(locale, verify_url)
        try:
            get_email_sender().send(to, subject, text_body, None)
        except Exception:
            logger.exception("verification email send failed to=%s", to)

    def _send_password_reset_email(self, to: str, raw_token: str) -> None:
        reset_url = f"{settings.public_app_origin.rstrip('/')}/reset-password?token={raw_token}"
        subject, text_body = render_password_reset_email(reset_url)
        try:
            get_email_sender().send(to, subject, text_body, None)
        except Exception:
            logger.exception("password reset email send failed to=%s", to)
