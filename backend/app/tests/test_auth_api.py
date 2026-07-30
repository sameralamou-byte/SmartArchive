"""
Integration tests -- exercise register/login/refresh through the real app
against a real Postgres database (with migrations applied). Skipped unless
TEST_DATABASE_URL is set; see conftest.py.

Run locally:
  export TEST_DATABASE_URL=postgresql+asyncpg://smartarchive:smartarchive_dev_password@localhost:5432/smartarchive_test
  createdb smartarchive_test   # once
  alembic upgrade head          # against the test database
  pytest app/tests/test_auth_api.py
"""
import uuid

import pytest

from app.tests.conftest import requires_test_db


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
    org_slug = f"org-{unique}"

    login_response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": register_payload["email"],
            "password": register_payload["password"],
            "organization_slug": org_slug,
        },
    )
    assert login_response.status_code == 200
    tokens = login_response.json()
    assert tokens["access_token"]
    assert tokens["refresh_token"]

    me_response = await client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {tokens['access_token']}"},
    )
    assert me_response.status_code == 200
    assert me_response.json()["email"] == register_payload["email"]

    refresh_response = await client.post(
        "/api/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]}
    )
    assert refresh_response.status_code == 200
    assert refresh_response.json()["access_token"]


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
