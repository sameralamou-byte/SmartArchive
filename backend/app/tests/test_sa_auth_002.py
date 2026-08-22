"""SA-AUTH-002 v1.2 — password recovery, sessions, Origin CSRF, refresh cookie."""
import uuid
from datetime import UTC, datetime, timedelta

import pytest
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.core.config import settings
from app.mailer.sender import get_memory_sender
from app.models.user import User
from app.schemas.auth import ChangePasswordRequest, ResetPasswordRequest
from app.security.email_verification import hash_token
from app.security.jwt import TokenType, create_token
from app.services.auth_service import AuthService
from app.tests.conftest import requires_test_db
from app.tests.verification_helpers import (
    assert_sa_refresh_cookie_attributes,
    raw_token_from_mailbox,
    sa_refresh_from,
)

ORIGIN = "http://localhost:5174"
FORGOT_DETAIL = "If this email can be reset, a message is on its way."
RESET_INVALID = "This reset link is invalid or has expired."
PASSWORD = "a-strong-password-123"


def _register_payload(unique: str, email: str | None = None) -> dict:
    return {
        "email": email or f"user-{unique}@example.com",
        "password": PASSWORD,
        "full_name": "Test User",
        "organization_name": f"Org {unique}",
    }


async def _register_and_verify(client, unique: str | None = None) -> tuple[str, str]:
    unique = unique or uuid.uuid4().hex[:8]
    payload = _register_payload(unique)
    register = await client.post("/api/v1/auth/register", json=payload)
    assert register.status_code == 201
    token = raw_token_from_mailbox(payload["email"])
    verify = await client.post("/api/v1/auth/verify-email", json={"token": token})
    assert verify.status_code == 200
    return payload["email"], payload["password"]


def test_auth002_secrets_are_dedicated():
    assert settings.password_reset_secret != settings.jwt_secret_key
    assert settings.session_refresh_secret != settings.jwt_secret_key
    assert settings.password_reset_secret != settings.email_verification_secret
    assert settings.session_refresh_secret != settings.email_verification_secret
    assert settings.session_refresh_secret != settings.password_reset_secret


def test_refresh_hash_is_hmac_sha256_not_raw():
    raw = "opaque-refresh-secret"
    digest = hash_token(raw, settings.session_refresh_secret)
    assert digest != raw.encode()
    assert len(digest) == 32
    assert hash_token(raw, settings.session_refresh_secret) == digest
    assert hash_token(raw, settings.password_reset_secret) != digest


@pytest.mark.asyncio
async def test_reset_password_get_is_not_allowed(client):
    response = await client.get("/api/v1/auth/reset-password")
    assert response.status_code in {404, 405}


@pytest.mark.asyncio
@requires_test_db
async def test_login_sets_refresh_cookie_not_json_refresh(client):
    email, password = await _register_and_verify(client)
    login = await client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert login.status_code == 200
    body = login.json()
    assert body["access_token"]
    assert body["token_type"] == "bearer"
    assert "refresh_token" not in body
    assert "csrf_token" not in body
    cookie = sa_refresh_from(login)
    assert cookie
    header = assert_sa_refresh_cookie_attributes(login).lower()
    assert "max-age" not in header


@pytest.mark.asyncio
@requires_test_db
async def test_remember_me_sets_persistent_cookie(client):
    email, password = await _register_and_verify(client)
    login = await client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password, "remember_me": True},
    )
    assert login.status_code == 200
    header = assert_sa_refresh_cookie_attributes(login).lower()
    assert "max-age=604800" in header
    assert sa_refresh_from(login)


@pytest.mark.asyncio
@requires_test_db
async def test_unverified_login_does_not_set_cookie(client):
    unique = uuid.uuid4().hex[:8]
    payload = _register_payload(unique)
    await client.post("/api/v1/auth/register", json=payload)
    login = await client.post(
        "/api/v1/auth/login",
        json={"email": payload["email"], "password": payload["password"]},
    )
    assert login.status_code == 403
    assert login.json()["code"] == "email_not_verified"
    assert sa_refresh_from(login) in {None, ""}


@pytest.mark.asyncio
@requires_test_db
async def test_legacy_json_refresh_token_is_rejected(client):
    email, password = await _register_and_verify(client)
    login = await client.post("/api/v1/auth/login", json={"email": email, "password": password})
    cookie = sa_refresh_from(login)
    jwt_refresh = create_token(uuid.uuid4(), uuid.uuid4(), TokenType.refresh, uuid.uuid4())
    rejected = await client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": jwt_refresh},
        cookies={"sa_refresh": cookie},
        headers={"Origin": ORIGIN},
    )
    assert rejected.status_code == 401


@pytest.mark.asyncio
@requires_test_db
async def test_refresh_requires_origin_and_not_csrf_header(client):
    email, password = await _register_and_verify(client)
    login = await client.post("/api/v1/auth/login", json={"email": email, "password": password})
    cookie = sa_refresh_from(login)

    missing = await client.post("/api/v1/auth/refresh", cookies={"sa_refresh": cookie})
    assert missing.status_code == 403

    invalid = await client.post(
        "/api/v1/auth/refresh",
        cookies={"sa_refresh": cookie},
        headers={"Origin": "https://evil.example"},
    )
    assert invalid.status_code == 403

    ok = await client.post(
        "/api/v1/auth/refresh",
        cookies={"sa_refresh": cookie},
        headers={"Origin": ORIGIN},
    )
    assert ok.status_code == 200
    assert ok.json()["access_token"]
    assert "csrf_token" not in ok.json()


@pytest.mark.asyncio
@requires_test_db
async def test_refresh_rotation_retains_old_hash_and_reuse_revokes_all(client, integration_engine):
    email, password = await _register_and_verify(client)
    login = await client.post("/api/v1/auth/login", json={"email": email, "password": password})
    first_cookie = sa_refresh_from(login)
    first_hash = hash_token(first_cookie, settings.session_refresh_secret)

    rotated = await client.post(
        "/api/v1/auth/refresh",
        cookies={"sa_refresh": first_cookie},
        headers={"Origin": ORIGIN},
    )
    assert rotated.status_code == 200
    second_cookie = sa_refresh_from(rotated)
    assert second_cookie
    assert second_cookie != first_cookie
    assert_sa_refresh_cookie_attributes(rotated)

    session_factory = async_sessionmaker(integration_engine, expire_on_commit=False, class_=AsyncSession)
    async with session_factory() as session:
        rows = (
            await session.execute(
                text(
                    "SELECT refresh_hash, revoked_at FROM account_sessions "
                    "WHERE account_id = (SELECT id FROM accounts WHERE email = :email) "
                    "ORDER BY created_at"
                ),
                {"email": email},
            )
        ).all()
        cols = (
            await session.execute(
                text(
                    """
                    SELECT column_name FROM information_schema.columns
                    WHERE table_name = 'account_sessions'
                    """
                )
            )
        ).scalars().all()
    assert "organization_id" not in cols
    assert len(rows) == 2
    assert bytes(rows[0].refresh_hash) == first_hash
    assert rows[0].revoked_at is not None
    assert rows[1].revoked_at is None

    second_ok = await client.post(
        "/api/v1/auth/refresh",
        cookies={"sa_refresh": second_cookie},
        headers={"Origin": ORIGIN},
    )
    assert second_ok.status_code == 200
    third_cookie = sa_refresh_from(second_ok)
    assert third_cookie
    assert third_cookie != second_cookie

    reuse = await client.post(
        "/api/v1/auth/refresh",
        cookies={"sa_refresh": first_cookie},
        headers={"Origin": ORIGIN},
    )
    assert reuse.status_code == 401

    third = await client.post(
        "/api/v1/auth/refresh",
        cookies={"sa_refresh": third_cookie},
        headers={"Origin": ORIGIN},
    )
    assert third.status_code == 401


@pytest.mark.asyncio
@requires_test_db
async def test_logout_is_204_origin_protected_and_idempotent(client):
    email, password = await _register_and_verify(client)
    login = await client.post("/api/v1/auth/login", json={"email": email, "password": password})
    cookie = sa_refresh_from(login)

    missing_origin = await client.post("/api/v1/auth/logout", cookies={"sa_refresh": cookie})
    assert missing_origin.status_code == 403

    logout = await client.post(
        "/api/v1/auth/logout",
        cookies={"sa_refresh": cookie},
        headers={"Origin": ORIGIN},
    )
    assert logout.status_code == 204
    assert logout.content == b""
    assert_sa_refresh_cookie_attributes(logout)

    again = await client.post(
        "/api/v1/auth/logout",
        headers={"Origin": ORIGIN},
    )
    assert again.status_code == 204

    refresh = await client.post(
        "/api/v1/auth/refresh",
        cookies={"sa_refresh": cookie},
        headers={"Origin": ORIGIN},
    )
    assert refresh.status_code == 401


@pytest.mark.asyncio
@requires_test_db
async def test_forgot_password_is_non_enumerating(client, integration_engine):
    email, _password = await _register_and_verify(client)
    unique = uuid.uuid4().hex[:8]
    get_memory_sender().clear()

    existing = await client.post("/api/v1/auth/forgot-password", json={"email": email})
    missing = await client.post(
        "/api/v1/auth/forgot-password", json={"email": f"missing-{unique}@example.com"}
    )
    assert existing.status_code == 202
    assert missing.status_code == 202
    assert existing.json() == missing.json()
    assert existing.json()["detail"] == FORGOT_DETAIL
    assert existing.json() == {"detail": FORGOT_DETAIL}

    session_factory = async_sessionmaker(integration_engine, expire_on_commit=False, class_=AsyncSession)
    async with session_factory() as session:
        cols = (
            await session.execute(
                text(
                    """
                    SELECT column_name FROM information_schema.columns
                    WHERE table_name = 'account_password_reset_tokens'
                    """
                )
            )
        ).scalars().all()
        hashes = (
            await session.execute(
                text(
                    "SELECT token_hash FROM account_password_reset_tokens "
                    "WHERE account_id = (SELECT id FROM accounts WHERE email = :email)"
                ),
                {"email": email},
            )
        ).all()
    assert "organization_id" not in cols
    raw = raw_token_from_mailbox(email)
    assert bytes(hashes[0].token_hash) == hash_token(raw, settings.password_reset_secret)
    assert raw.encode() not in bytes(hashes[0].token_hash)


@pytest.mark.asyncio
@requires_test_db
async def test_forgot_password_unverified_sends_and_does_not_verify(client, integration_engine):
    unique = uuid.uuid4().hex[:8]
    payload = _register_payload(unique)
    await client.post("/api/v1/auth/register", json=payload)
    get_memory_sender().clear()
    forgot = await client.post("/api/v1/auth/forgot-password", json={"email": payload["email"]})
    assert forgot.status_code == 202
    assert forgot.json()["detail"] == FORGOT_DETAIL
    assert raw_token_from_mailbox(payload["email"])
    session_factory = async_sessionmaker(integration_engine, expire_on_commit=False, class_=AsyncSession)
    async with session_factory() as session:
        verified = (
            await session.execute(
                text("SELECT email_verified_at FROM accounts WHERE email = :email"),
                {"email": payload["email"]},
            )
        ).scalar_one()
    assert verified is None


@pytest.mark.asyncio
@requires_test_db
async def test_forgot_password_inactive_does_not_send(client, integration_engine):
    email, _password = await _register_and_verify(client)
    session_factory = async_sessionmaker(integration_engine, expire_on_commit=False, class_=AsyncSession)
    async with session_factory() as session:
        await session.execute(
            text("UPDATE accounts SET is_active = false WHERE email = :email"),
            {"email": email},
        )
        await session.commit()
    get_memory_sender().clear()
    forgot = await client.post("/api/v1/auth/forgot-password", json={"email": email})
    assert forgot.status_code == 202
    assert forgot.json()["detail"] == FORGOT_DETAIL
    assert get_memory_sender().messages == []


@pytest.mark.asyncio
@requires_test_db
async def test_forgot_password_rate_limit_still_returns_202(client):
    email, _password = await _register_and_verify(client)
    get_memory_sender().clear()
    statuses = []
    for _ in range(6):
        response = await client.post("/api/v1/auth/forgot-password", json={"email": email})
        statuses.append(response.status_code)
        assert response.json()["detail"] == FORGOT_DETAIL
    assert all(code == 202 for code in statuses)
    assert all(code != 429 for code in statuses)
    assert len(get_memory_sender().messages) <= 3


@pytest.mark.asyncio
@requires_test_db
async def test_reset_password_success_revokes_sessions_and_does_not_login(client, integration_engine):
    email, password = await _register_and_verify(client)
    login = await client.post("/api/v1/auth/login", json={"email": email, "password": password})
    old_cookie = sa_refresh_from(login)
    get_memory_sender().clear()
    await client.post("/api/v1/auth/forgot-password", json={"email": email})
    token = raw_token_from_mailbox(email)
    new_password = "a-new-password-456"
    reset = await client.post(
        "/api/v1/auth/reset-password",
        json={"token": token, "password": new_password, "password_confirm": new_password},
    )
    assert reset.status_code == 200
    assert "access_token" not in reset.json()
    assert sa_refresh_from(reset) in {None, ""}

    stale = await client.post(
        "/api/v1/auth/refresh",
        cookies={"sa_refresh": old_cookie},
        headers={"Origin": ORIGIN},
    )
    assert stale.status_code == 401

    session_factory = async_sessionmaker(integration_engine, expire_on_commit=False, class_=AsyncSession)
    async with session_factory() as session:
        verified = (
            await session.execute(
                text("SELECT email_verified_at FROM accounts WHERE email = :email"),
                {"email": email},
            )
        ).scalar_one()
        open_sessions = (
            await session.execute(
                text(
                    "SELECT count(*) FROM account_sessions WHERE account_id = "
                    "(SELECT id FROM accounts WHERE email = :email) AND revoked_at IS NULL"
                ),
                {"email": email},
            )
        ).scalar_one()
    assert verified is not None
    assert open_sessions == 0

    old_login = await client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert old_login.status_code == 401
    new_login = await client.post("/api/v1/auth/login", json={"email": email, "password": new_password})
    assert new_login.status_code == 200


@pytest.mark.asyncio
@requires_test_db
async def test_reset_password_unverified_does_not_verify(client, integration_engine):
    unique = uuid.uuid4().hex[:8]
    payload = _register_payload(unique)
    await client.post("/api/v1/auth/register", json=payload)
    get_memory_sender().clear()
    await client.post("/api/v1/auth/forgot-password", json={"email": payload["email"]})
    token = raw_token_from_mailbox(payload["email"])
    new_password = "a-new-password-456"
    reset = await client.post(
        "/api/v1/auth/reset-password",
        json={"token": token, "password": new_password, "password_confirm": new_password},
    )
    assert reset.status_code == 200
    login = await client.post(
        "/api/v1/auth/login", json={"email": payload["email"], "password": new_password}
    )
    assert login.status_code == 403
    assert login.json()["code"] == "email_not_verified"
    session_factory = async_sessionmaker(integration_engine, expire_on_commit=False, class_=AsyncSession)
    async with session_factory() as session:
        verified = (
            await session.execute(
                text("SELECT email_verified_at FROM accounts WHERE email = :email"),
                {"email": payload["email"]},
            )
        ).scalar_one()
    assert verified is None


@pytest.mark.asyncio
@requires_test_db
async def test_reset_password_policy_and_invalid_token(client, integration_engine):
    email, password = await _register_and_verify(client)
    get_memory_sender().clear()
    await client.post("/api/v1/auth/forgot-password", json={"email": email})
    token = raw_token_from_mailbox(email)

    mismatch = await client.post(
        "/api/v1/auth/reset-password",
        json={"token": token, "password": "a-new-password-456", "password_confirm": "other-password-456"},
    )
    assert mismatch.status_code == 422

    reuse = await client.post(
        "/api/v1/auth/reset-password",
        json={"token": token, "password": password, "password_confirm": password},
    )
    assert reuse.status_code == 422

    unknown = await client.post(
        "/api/v1/auth/reset-password",
        json={
            "token": "not-a-real-token",
            "password": "a-new-password-456",
            "password_confirm": "a-new-password-456",
        },
    )
    assert unknown.status_code == 400
    assert unknown.json()["detail"] == RESET_INVALID

    session_factory = async_sessionmaker(integration_engine, expire_on_commit=False, class_=AsyncSession)
    async with session_factory() as session:
        await session.execute(
            text("UPDATE accounts SET is_active = false WHERE email = :email"),
            {"email": email},
        )
        await session.commit()
    leftover = await client.post(
        "/api/v1/auth/reset-password",
        json={"token": token, "password": "a-new-password-456", "password_confirm": "a-new-password-456"},
    )
    assert leftover.status_code == 400
    assert leftover.json()["detail"] == RESET_INVALID


@pytest.mark.asyncio
@requires_test_db
async def test_change_password_revokes_sessions_and_clears_cookie(client):
    email, password = await _register_and_verify(client)
    login = await client.post("/api/v1/auth/login", json={"email": email, "password": password})
    access = login.json()["access_token"]
    cookie = sa_refresh_from(login)
    new_password = "a-new-password-456"
    changed = await client.post(
        "/api/v1/auth/change-password",
        json={
            "current_password": password,
            "new_password": new_password,
            "new_password_confirm": new_password,
        },
        headers={"Authorization": f"Bearer {access}", "Origin": ORIGIN},
        cookies={"sa_refresh": cookie},
    )
    assert changed.status_code == 200
    assert_sa_refresh_cookie_attributes(changed)

    stale = await client.post(
        "/api/v1/auth/refresh",
        cookies={"sa_refresh": cookie},
        headers={"Origin": ORIGIN},
    )
    assert stale.status_code == 401

    old_login = await client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert old_login.status_code == 401
    new_login = await client.post("/api/v1/auth/login", json={"email": email, "password": new_password})
    assert new_login.status_code == 200


@pytest.mark.asyncio
@requires_test_db
async def test_change_password_wrong_current_and_reuse(client):
    email, password = await _register_and_verify(client)
    login = await client.post("/api/v1/auth/login", json={"email": email, "password": password})
    access = login.json()["access_token"]
    wrong = await client.post(
        "/api/v1/auth/change-password",
        json={
            "current_password": "wrong-password-123",
            "new_password": "a-new-password-456",
            "new_password_confirm": "a-new-password-456",
        },
        headers={"Authorization": f"Bearer {access}"},
    )
    assert wrong.status_code == 401
    reuse = await client.post(
        "/api/v1/auth/change-password",
        json={
            "current_password": password,
            "new_password": password,
            "new_password_confirm": password,
        },
        headers={"Authorization": f"Bearer {access}"},
    )
    assert reuse.status_code == 422


@pytest.mark.asyncio
@requires_test_db
async def test_change_password_invalidates_reset_tokens(client):
    email, password = await _register_and_verify(client)
    get_memory_sender().clear()
    await client.post("/api/v1/auth/forgot-password", json={"email": email})
    token = raw_token_from_mailbox(email)
    login = await client.post("/api/v1/auth/login", json={"email": email, "password": password})
    access = login.json()["access_token"]
    await client.post(
        "/api/v1/auth/change-password",
        json={
            "current_password": password,
            "new_password": "a-new-password-456",
            "new_password_confirm": "a-new-password-456",
        },
        headers={"Authorization": f"Bearer {access}"},
    )
    leftover = await client.post(
        "/api/v1/auth/reset-password",
        json={"token": token, "password": "another-password-789", "password_confirm": "another-password-789"},
    )
    assert leftover.status_code == 400
    assert leftover.json()["detail"] == RESET_INVALID


@pytest.mark.asyncio
@requires_test_db
async def test_expired_reset_token_is_generic_400(client, integration_engine):
    email, _password = await _register_and_verify(client)
    get_memory_sender().clear()
    await client.post("/api/v1/auth/forgot-password", json={"email": email})
    token = raw_token_from_mailbox(email)
    session_factory = async_sessionmaker(integration_engine, expire_on_commit=False, class_=AsyncSession)
    async with session_factory() as session:
        await session.execute(
            text(
                "UPDATE account_password_reset_tokens SET expires_at = :exp "
                "WHERE consumed_at IS NULL AND account_id = (SELECT id FROM accounts WHERE email = :email)"
            ),
            {"exp": datetime.now(UTC) - timedelta(minutes=1), "email": email},
        )
        await session.commit()
    expired = await client.post(
        "/api/v1/auth/reset-password",
        json={"token": token, "password": "a-new-password-456", "password_confirm": "a-new-password-456"},
    )
    assert expired.status_code == 400
    assert expired.json()["detail"] == RESET_INVALID


@pytest.mark.asyncio
@requires_test_db
async def test_forgot_password_limiter_runs_before_account_lookup(client, monkeypatch):
    order: list[tuple[str, str]] = []

    async def fake_suppress(email: str, client_ip: str) -> bool:
        order.append(("limiter", email.lower()))
        return False

    async def fake_forgot(self, email: str) -> None:
        order.append(("lookup", email.lower()))

    monkeypatch.setattr("app.routers.v1.auth.forgot_password_should_suppress", fake_suppress)
    monkeypatch.setattr(AuthService, "forgot_password", fake_forgot)

    existing, _password = await _register_and_verify(client)
    missing = f"missing-{uuid.uuid4().hex[:8]}@example.com"

    existing_resp = await client.post("/api/v1/auth/forgot-password", json={"email": existing})
    missing_resp = await client.post("/api/v1/auth/forgot-password", json={"email": missing})
    assert existing_resp.status_code == 202
    assert missing_resp.status_code == 202
    assert existing_resp.json() == missing_resp.json() == {"detail": FORGOT_DETAIL}
    assert order == [
        ("limiter", existing.lower()),
        ("lookup", existing.lower()),
        ("limiter", missing.lower()),
        ("lookup", missing.lower()),
    ]


@pytest.mark.asyncio
@requires_test_db
async def test_forgot_password_limiter_skips_lookup_when_suppressing(client, monkeypatch):
    lookups: list[str] = []

    async def suppress_all(email: str, client_ip: str) -> bool:
        return True

    async def fake_forgot(self, email: str) -> None:
        lookups.append(email)

    monkeypatch.setattr("app.routers.v1.auth.forgot_password_should_suppress", suppress_all)
    monkeypatch.setattr(AuthService, "forgot_password", fake_forgot)

    existing, _password = await _register_and_verify(client)
    missing = f"missing-{uuid.uuid4().hex[:8]}@example.com"
    existing_resp = await client.post("/api/v1/auth/forgot-password", json={"email": existing})
    missing_resp = await client.post("/api/v1/auth/forgot-password", json={"email": missing})
    assert existing_resp.status_code == 202
    assert missing_resp.status_code == 202
    assert existing_resp.json() == missing_resp.json() == {"detail": FORGOT_DETAIL}
    assert lookups == []


@pytest.mark.asyncio
@requires_test_db
async def test_reset_token_replay_and_replacement_are_generic_400(client):
    email, password = await _register_and_verify(client)
    get_memory_sender().clear()
    first_forgot = await client.post("/api/v1/auth/forgot-password", json={"email": email})
    first_token = raw_token_from_mailbox(email)
    get_memory_sender().clear()
    second_forgot = await client.post("/api/v1/auth/forgot-password", json={"email": email})
    second_token = raw_token_from_mailbox(email)
    assert first_token != second_token
    assert first_forgot.json() == second_forgot.json() == {"detail": FORGOT_DETAIL}

    new_password = "a-new-password-456"
    replaced = await client.post(
        "/api/v1/auth/reset-password",
        json={"token": first_token, "password": new_password, "password_confirm": new_password},
    )
    current = await client.post(
        "/api/v1/auth/reset-password",
        json={"token": second_token, "password": new_password, "password_confirm": new_password},
    )
    replay = await client.post(
        "/api/v1/auth/reset-password",
        json={
            "token": second_token,
            "password": "another-password-789",
            "password_confirm": "another-password-789",
        },
    )
    unknown = await client.post(
        "/api/v1/auth/reset-password",
        json={"token": "not-a-real-token", "password": new_password, "password_confirm": new_password},
    )
    assert replaced.status_code == 400
    assert current.status_code == 200
    assert replay.status_code == 400
    assert unknown.status_code == 400
    assert replaced.json() == replay.json() == unknown.json() == {"detail": RESET_INVALID}

    old_login = await client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert old_login.status_code == 401
    new_login = await client.post("/api/v1/auth/login", json={"email": email, "password": new_password})
    assert new_login.status_code == 200


@pytest.mark.asyncio
@requires_test_db
async def test_unverified_change_password_is_forbidden_and_hash_unchanged(client, integration_engine):
    unique = uuid.uuid4().hex[:8]
    payload = _register_payload(unique)
    register = await client.post("/api/v1/auth/register", json=payload)
    assert register.status_code == 201
    user_id = register.json()["id"]
    org_id = register.json()["organization_id"]
    session_factory = async_sessionmaker(integration_engine, expire_on_commit=False, class_=AsyncSession)
    async with session_factory() as session:
        row = (
            await session.execute(
                text(
                    "SELECT a.id, u.hashed_password FROM accounts a "
                    "JOIN users u ON u.account_id = a.id WHERE a.email = :email"
                ),
                {"email": payload["email"]},
            )
        ).one()
        account_id = row.id
        original_hash = row.hashed_password
    access = create_token(uuid.UUID(user_id), uuid.UUID(org_id), TokenType.access, account_id)
    changed = await client.post(
        "/api/v1/auth/change-password",
        json={
            "current_password": payload["password"],
            "new_password": "a-new-password-456",
            "new_password_confirm": "a-new-password-456",
        },
        headers={"Authorization": f"Bearer {access}"},
    )
    assert changed.status_code == 403
    assert changed.json()["code"] == "email_not_verified"
    async with session_factory() as session:
        current_hash = (
            await session.execute(
                text("SELECT hashed_password FROM users WHERE id = :id"),
                {"id": user_id},
            )
        ).scalar_one()
    assert current_hash == original_hash


@pytest.mark.asyncio
@requires_test_db
async def test_unchecked_remember_me_server_cap_is_24_hours(client, integration_engine):
    email, password = await _register_and_verify(client)
    before = datetime.now(UTC)
    login = await client.post("/api/v1/auth/login", json={"email": email, "password": password})
    after = datetime.now(UTC)
    assert login.status_code == 200
    session_factory = async_sessionmaker(integration_engine, expire_on_commit=False, class_=AsyncSession)
    async with session_factory() as session:
        row = (
            await session.execute(
                text(
                    "SELECT remember_me, created_at, expires_at FROM account_sessions "
                    "WHERE account_id = (SELECT id FROM accounts WHERE email = :email) "
                    "AND revoked_at IS NULL"
                ),
                {"email": email},
            )
        ).one()
    assert row.remember_me is False
    lifetime = row.expires_at - row.created_at
    assert timedelta(hours=23, minutes=59) <= lifetime <= timedelta(hours=24, seconds=5)
    assert before + timedelta(hours=24) - timedelta(seconds=5) <= row.expires_at
    assert row.expires_at <= after + timedelta(hours=24) + timedelta(seconds=5)


@pytest.mark.asyncio
@requires_test_db
async def test_reset_password_side_effects_roll_back_together(client, integration_engine, monkeypatch):
    email, password = await _register_and_verify(client)
    login = await client.post("/api/v1/auth/login", json={"email": email, "password": password})
    cookie = sa_refresh_from(login)
    get_memory_sender().clear()
    await client.post("/api/v1/auth/forgot-password", json={"email": email})
    token = raw_token_from_mailbox(email)

    original = AuthService._revoke_all_sessions

    async def boom(self, account_id):
        raise RuntimeError("forced failure before commit")

    monkeypatch.setattr(AuthService, "_revoke_all_sessions", boom)
    session_factory = async_sessionmaker(integration_engine, expire_on_commit=False, class_=AsyncSession)
    async with session_factory() as session:
        service = AuthService(session)
        with pytest.raises(RuntimeError, match="forced failure before commit"):
            await service.reset_password(
                ResetPasswordRequest(
                    token=token,
                    password="a-new-password-456",
                    password_confirm="a-new-password-456",
                )
            )
        await session.rollback()

    still_old = await client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert still_old.status_code == 200
    refresh = await client.post(
        "/api/v1/auth/refresh",
        cookies={"sa_refresh": cookie},
        headers={"Origin": ORIGIN},
    )
    assert refresh.status_code == 200

    monkeypatch.setattr(AuthService, "_revoke_all_sessions", original)
    retry = await client.post(
        "/api/v1/auth/reset-password",
        json={"token": token, "password": "a-new-password-456", "password_confirm": "a-new-password-456"},
    )
    assert retry.status_code == 200
    new_login = await client.post(
        "/api/v1/auth/login", json={"email": email, "password": "a-new-password-456"}
    )
    assert new_login.status_code == 200


@pytest.mark.asyncio
@requires_test_db
async def test_change_password_side_effects_roll_back_together(client, integration_engine, monkeypatch):
    email, password = await _register_and_verify(client)
    login = await client.post("/api/v1/auth/login", json={"email": email, "password": password})
    cookie = sa_refresh_from(login)

    original = AuthService._revoke_all_sessions

    async def boom(self, account_id):
        raise RuntimeError("forced failure before commit")

    monkeypatch.setattr(AuthService, "_revoke_all_sessions", boom)
    session_factory = async_sessionmaker(integration_engine, expire_on_commit=False, class_=AsyncSession)
    async with session_factory() as session:
        user_id = (
            await session.execute(
                text("SELECT id FROM users WHERE email = :email"),
                {"email": email},
            )
        ).scalar_one()
        user = await session.get(User, user_id)
        assert user is not None
        service = AuthService(session)
        with pytest.raises(RuntimeError, match="forced failure before commit"):
            await service.change_password(
                user,
                ChangePasswordRequest(
                    current_password=password,
                    new_password="a-new-password-456",
                    new_password_confirm="a-new-password-456",
                ),
            )
        await session.rollback()

    still_old = await client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert still_old.status_code == 200
    refresh = await client.post(
        "/api/v1/auth/refresh",
        cookies={"sa_refresh": cookie},
        headers={"Origin": ORIGIN},
    )
    assert refresh.status_code == 200

    monkeypatch.setattr(AuthService, "_revoke_all_sessions", original)
    access = still_old.json()["access_token"]
    retry = await client.post(
        "/api/v1/auth/change-password",
        json={
            "current_password": password,
            "new_password": "a-new-password-456",
            "new_password_confirm": "a-new-password-456",
        },
        headers={"Authorization": f"Bearer {access}"},
    )
    assert retry.status_code == 200
    new_login = await client.post(
        "/api/v1/auth/login", json={"email": email, "password": "a-new-password-456"}
    )
    assert new_login.status_code == 200
