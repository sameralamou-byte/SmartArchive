"""
Integration tests -- exercise register/login/refresh through the real app
against a real Postgres database (with migrations applied). Skipped unless
TEST_DATABASE_URL is set; see conftest.py.
"""
import uuid

import pytest

from app.tests.conftest import requires_test_db
from app.tests.verification_helpers import raw_token_from_mailbox, sa_refresh_from


@pytest.mark.asyncio
@requires_test_db
async def test_register_then_login_then_refresh(client):
    unique = uuid.uuid4().hex[:8]
    register_payload = {
        "email": f"user-{unique}@example.com",
        "password": "a-strong-password-123",
        "full_name": "Test User",
        "organization_name": f"Org {unique}",
    }
    register_response = await client.post("/api/v1/auth/register", json=register_payload)
    assert register_response.status_code == 201
    assert register_response.json()["email_verified"] is False

    token = raw_token_from_mailbox(register_payload["email"])
    verify_response = await client.post("/api/v1/auth/verify-email", json={"token": token})
    assert verify_response.status_code == 200
    assert verify_response.json()["email_verified"] is True

    login_response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": register_payload["email"],
            "password": register_payload["password"],
            "organization_slug": f"org-{unique}",
        },
    )
    assert login_response.status_code == 200
    tokens = login_response.json()
    assert tokens["access_token"]
    assert "refresh_token" not in tokens
    assert "csrf_token" not in tokens
    refresh_cookie = sa_refresh_from(login_response)
    assert refresh_cookie

    me_response = await client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {tokens['access_token']}"},
    )
    assert me_response.status_code == 200
    assert me_response.json()["email"] == register_payload["email"]
    assert me_response.json()["email_verified"] is True

    refresh_response = await client.post(
        "/api/v1/auth/refresh",
        cookies={"sa_refresh": refresh_cookie},
        headers={"Origin": "http://localhost:5174"},
    )
    assert refresh_response.status_code == 200
    assert refresh_response.json()["access_token"]
    assert "refresh_token" not in refresh_response.json()


@pytest.mark.asyncio
@requires_test_db
async def test_login_with_wrong_password_is_rejected(client):
    unique = uuid.uuid4().hex[:8]
    register_payload = {
        "email": f"user-{unique}@example.com",
        "password": "a-strong-password-123",
        "full_name": "Test User",
        "organization_name": f"Org {unique}",
    }
    await client.post("/api/v1/auth/register", json=register_payload)

    login_response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": register_payload["email"],
            "password": "wrong-password",
            "organization_slug": f"org-{unique}",
        },
    )
    assert login_response.status_code == 401
