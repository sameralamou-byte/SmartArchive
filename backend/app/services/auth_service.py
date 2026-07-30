import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.organization import Organization
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import LoginRequest, RegisterRequest
from app.security.jwt import TokenType, create_token, hash_password, verify_password


class AuthenticationError(Exception):
    pass


class AuthService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.users = UserRepository(session)

    async def register(self, data: RegisterRequest) -> User:
        """
        Phase 1 registration also creates the organization (bootstrap flow).
        A real invite-based multi-user-per-org flow is a Phase 2 refinement.
        """
        slug = data.organization_name.strip().lower().replace(" ", "-")
        org = Organization(name=data.organization_name, slug=slug)
        self.session.add(org)
        await self.session.flush()

        existing = await self.users.get_by_email(data.email, org.id)
        if existing:
            raise AuthenticationError("A user with this email already exists in this organization")

        user = User(
            email=data.email,
            hashed_password=hash_password(data.password),
            full_name=data.full_name,
            organization_id=org.id,
            is_superuser=True,  # first user of a new org is its admin
        )
        await self.users.create(user)
        await self.session.commit()
        return user

    async def authenticate(self, data: LoginRequest) -> tuple[str, str]:
        stmt = select(Organization).where(Organization.slug == data.organization_slug)
        result = await self.session.execute(stmt)
        org = result.scalar_one_or_none()
        if org is None:
            raise AuthenticationError("Invalid credentials")

        user = await self.users.get_by_email(data.email, org.id)
        if user is None or not verify_password(data.password, user.hashed_password):
            raise AuthenticationError("Invalid credentials")
        if not user.is_active:
            raise AuthenticationError("User is inactive")

        access = create_token(user.id, user.organization_id, TokenType.access)
        refresh = create_token(user.id, user.organization_id, TokenType.refresh)
        return access, refresh

    async def refresh(self, refresh_token: str) -> tuple[str, str]:
        from app.security.jwt import decode_token

        payload = decode_token(refresh_token)
        if payload.get("type") != TokenType.refresh.value:
            raise AuthenticationError("Not a refresh token")

        user_id = uuid.UUID(payload["sub"])
        org_id = uuid.UUID(payload["org_id"])
        user = await self.users.get_by_id(user_id)
        if user is None or not user.is_active:
            raise AuthenticationError("Invalid refresh token")

        access = create_token(user.id, org_id, TokenType.access)
        new_refresh = create_token(user.id, org_id, TokenType.refresh)
        return access, new_refresh
