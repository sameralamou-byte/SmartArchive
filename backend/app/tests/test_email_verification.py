import uuid
from datetime import UTC, datetime, timedelta

import pytest
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.core.config import settings
from app.mailer.sender import get_memory_sender
from app.mailer.templates import locale_from_accept_language
from app.security.email_verification import generate_raw_token, hash_token
from app.security.jwt import TokenType, create_token
from app.tests.conftest import requires_test_db
from app.tests.verification_helpers import raw_token_from_mailbox


def test_hash_token_is_not_the_raw_value():
    raw = generate_raw_token()
    digest = hash_token(raw, "unit-secret")
    assert digest != raw.encode()
    assert len(digest) == 32
    assert hash_token(raw, "unit-secret") == digest
    assert hash_token(raw, "other-secret") != digest


def test_locale_from_accept_language():
    assert locale_from_accept_language(None) == "en"
    assert locale_from_accept_language("de-DE,en;q=0.8") == "de"
    assert locale_from_accept_language("ar") == "ar"


@pytest.mark.asyncio
async def test_verify_email_get_is_not_allowed(client):
    response = await client.get("/api/v1/auth/verify-email")
    assert response.status_code in {404, 405}


@pytest.mark.asyncio
@requires_test_db
async def test_register_stores_hash_not_raw_token(client, integration_engine):
    unique = uuid.uuid4().hex[:8]
    email = f"hash-{unique}@example.com"
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "password": "a-strong-password-123",
            "full_name": "Hash User",
            "organization_name": f"Org {unique}",
        },
    )
    assert response.status_code == 201
    assert response.json()["email_verified"] is False
    raw = raw_token_from_mailbox(email)

    session_factory = async_sessionmaker(integration_engine, expire_on_commit=False, class_=AsyncSession)
    async with session_factory() as session:
        account = (
            await session.execute(
                text(
                    "SELECT id, email_verified_at, is_active FROM accounts WHERE email = :email"
                ),
                {"email": email},
            )
        ).one()
        rows = (
            await session.execute(
                text(
                    "SELECT token_hash, consumed_at FROM account_email_verification_tokens "
                    "WHERE account_id = :aid"
                ),
                {"aid": account.id},
            )
        ).all()
        org_cols = (
            await session.execute(
                text(
                    """
                    SELECT column_name FROM information_schema.columns
                    WHERE table_name = 'account_email_verification_tokens'
                    """
                )
            )
        ).scalars().all()

    assert account.email_verified_at is None
    assert account.is_active is True
    assert len(rows) == 1
    assert rows[0].consumed_at is None
    assert bytes(rows[0].token_hash) == hash_token(raw)
    assert raw.encode() not in bytes(rows[0].token_hash)
    assert "organization_id" not in org_cols


@pytest.mark.asyncio
@requires_test_db
async def test_login_unverified_correct_password_is_403(client):
    unique = uuid.uuid4().hex[:8]
    email = f"unverified-{unique}@example.com"
    password = "a-strong-password-123"
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "password": password,
            "full_name": "Unverified",
            "organization_name": f"Org {unique}",
        },
    )
    login = await client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert login.status_code == 403
    body = login.json()
    assert body["code"] == "email_not_verified"
    assert "access_token" not in body
    assert login.json()["detail"] == "Confirm your email before signing in."


@pytest.mark.asyncio
@requires_test_db
async def test_verify_expired_unknown_replay_and_wrong_account(client, integration_engine):
    unique = uuid.uuid4().hex[:8]
    email_a = f"a-{unique}@example.com"
    email_b = f"b-{unique}@example.com"
    payload_a = {
        "email": email_a,
        "password": "a-strong-password-123",
        "full_name": "A",
        "organization_name": f"Org A {unique}",
    }
    payload_b = {
        "email": email_b,
        "password": "a-strong-password-123",
        "full_name": "B",
        "organization_name": f"Org B {unique}",
    }
    await client.post("/api/v1/auth/register", json=payload_a)
    await client.post("/api/v1/auth/register", json=payload_b)
    token_a = raw_token_from_mailbox(email_a)

    unknown = await client.post("/api/v1/auth/verify-email", json={"token": "not-a-real-token"})
    assert unknown.status_code == 400

    session_factory = async_sessionmaker(integration_engine, expire_on_commit=False, class_=AsyncSession)
    async with session_factory() as session:
        await session.execute(
            text(
                "UPDATE account_email_verification_tokens SET expires_at = :exp "
                "WHERE consumed_at IS NULL AND account_id = "
                "(SELECT id FROM accounts WHERE email = :email)"
            ),
            {"exp": datetime.now(UTC) - timedelta(minutes=1), "email": email_b},
        )
        await session.commit()
    token_b = raw_token_from_mailbox(email_b)
    expired = await client.post("/api/v1/auth/verify-email", json={"token": token_b})
    assert expired.status_code == 400

    first = await client.post("/api/v1/auth/verify-email", json={"token": token_a})
    assert first.status_code == 200
    replay = await client.post("/api/v1/auth/verify-email", json={"token": token_a})
    assert replay.status_code == 200
    assert replay.json()["email_verified"] is True

    session_factory = async_sessionmaker(integration_engine, expire_on_commit=False, class_=AsyncSession)
    async with session_factory() as session:
        verified = (
            await session.execute(
                text("SELECT email, email_verified_at FROM accounts WHERE email IN (:a, :b)"),
                {"a": email_a, "b": email_b},
            )
        ).all()
    by_email = {row.email: row.email_verified_at for row in verified}
    assert by_email[email_a] is not None
    assert by_email[email_b] is None


@pytest.mark.asyncio
@requires_test_db
async def test_resend_is_non_enumerating_and_rotates_token(client):
    unique = uuid.uuid4().hex[:8]
    email = f"resend-{unique}@example.com"
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "password": "a-strong-password-123",
            "full_name": "Resend",
            "organization_name": f"Org {unique}",
        },
    )
    old_token = raw_token_from_mailbox(email)
    get_memory_sender().clear()

    existing = await client.post("/api/v1/auth/resend-verification", json={"email": email})
    missing = await client.post(
        "/api/v1/auth/resend-verification", json={"email": f"missing-{unique}@example.com"}
    )
    assert existing.status_code == 202
    assert missing.status_code == 202
    assert existing.json() == missing.json()
    assert existing.json()["detail"] == "If this email can be confirmed, a new message is on its way."

    new_token = raw_token_from_mailbox(email)
    assert new_token != old_token
    old = await client.post("/api/v1/auth/verify-email", json={"token": old_token})
    assert old.status_code == 400
    new = await client.post("/api/v1/auth/verify-email", json={"token": new_token})
    assert new.status_code == 200

    get_memory_sender().clear()
    already = await client.post("/api/v1/auth/resend-verification", json={"email": email})
    assert already.status_code == 202
    assert already.json()["detail"] == "If this email can be confirmed, a new message is on its way."
    assert get_memory_sender().messages == []


@pytest.mark.asyncio
@requires_test_db
async def test_resend_rate_limit_still_returns_202(client):
    unique = uuid.uuid4().hex[:8]
    email = f"limit-{unique}@example.com"
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "password": "a-strong-password-123",
            "full_name": "Limit",
            "organization_name": f"Org {unique}",
        },
    )
    get_memory_sender().clear()
    statuses = []
    for _ in range(5):
        response = await client.post("/api/v1/auth/resend-verification", json={"email": email})
        statuses.append(response.status_code)
        assert response.json()["detail"] == "If this email can be confirmed, a new message is on its way."
    assert statuses == [202, 202, 202, 202, 202]
    assert all(code != 429 for code in statuses)
    assert len(get_memory_sender().messages) <= 3


@pytest.mark.asyncio
@requires_test_db
async def test_unverified_helper_jwt_cannot_use_product_api(client, integration_engine):
    unique = uuid.uuid4().hex[:8]
    email = f"gate-{unique}@example.com"
    register = await client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "password": "a-strong-password-123",
            "full_name": "Gate",
            "organization_name": f"Org {unique}",
        },
    )
    user_id = register.json()["id"]
    org_id = register.json()["organization_id"]
    session_factory = async_sessionmaker(integration_engine, expire_on_commit=False, class_=AsyncSession)
    async with session_factory() as session:
        account_id = (
            await session.execute(text("SELECT id FROM accounts WHERE email = :email"), {"email": email})
        ).scalar_one()
    access = create_token(uuid.UUID(user_id), uuid.UUID(org_id), TokenType.access, account_id)
    me = await client.get("/api/v1/users/me", headers={"Authorization": f"Bearer {access}"})
    assert me.status_code == 403
    assert me.json()["code"] == "email_not_verified"
    files = await client.get(
        f"/api/v1/files/{uuid.uuid4()}/download-url",
        headers={"Authorization": f"Bearer {access}"},
    )
    assert files.status_code == 403
    assert files.json()["code"] == "email_not_verified"


@pytest.mark.asyncio
@requires_test_db
async def test_register_succeeds_when_mail_send_raises(client, monkeypatch):
    unique = uuid.uuid4().hex[:8]

    class Boom:
        def send(self, to, subject, text_body, html_body):
            raise RuntimeError("smtp down")

    monkeypatch.setattr("app.services.auth_service.get_email_sender", lambda: Boom())
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": f"boom-{unique}@example.com",
            "password": "a-strong-password-123",
            "full_name": "Boom",
            "organization_name": f"Org {unique}",
        },
    )
    assert response.status_code == 201
    assert response.json()["email_verified"] is False


def test_email_verification_secret_is_not_jwt_secret():
    assert settings.email_verification_secret != settings.jwt_secret_key
