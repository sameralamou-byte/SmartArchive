"""
Slice 1 tests: Account ↔ Personal Tenant ↔ User, TrialHistory ledger, fail-closed preflight.

Integration tests require TEST_DATABASE_URL (see conftest.py).
"""
import uuid
from datetime import UTC, datetime

import pytest
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.core.slice1_legacy_preflight import (
    Slice1LegacyMappingError,
    assert_slice1_legacy_mapping_is_deterministic,
    collect_slice1_mapping_ambiguities,
)
from app.security.jwt import decode_token
from app.tests.conftest import requires_test_db


@pytest.mark.asyncio
@requires_test_db
async def test_register_creates_one_account_one_org_one_user(client, integration_engine):
    unique = uuid.uuid4().hex[:8]
    email = f"slice1-{unique}@example.com"
    payload = {
        "email": email,
        "password": "a-strong-password-123",
        "full_name": "Slice One",
        "organization_name": f"Archive {unique}",
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    body = response.json()

    session_factory = async_sessionmaker(integration_engine, expire_on_commit=False, class_=AsyncSession)
    async with session_factory() as session:
        account = (
            await session.execute(
                text(
                    "SELECT id, email, personal_organization_id FROM accounts "
                    "WHERE email = :email"
                ),
                {"email": email},
            )
        ).one()
        users = (
            await session.execute(
                text("SELECT id, account_id, organization_id FROM users WHERE email = :email"),
                {"email": email},
            )
        ).all()
        history = (
            await session.execute(
                text("SELECT COUNT(*) FROM trial_history WHERE account_id = :aid"),
                {"aid": account.id},
            )
        ).scalar_one()

    assert len(users) == 1
    assert users[0].account_id == account.id
    assert users[0].organization_id == account.personal_organization_id
    assert body["organization_id"] == str(account.personal_organization_id)
    assert history == 0


@pytest.mark.asyncio
@requires_test_db
async def test_second_register_same_email_is_rejected(client):
    unique = uuid.uuid4().hex[:8]
    payload = {
        "email": f"dup-{unique}@example.com",
        "password": "a-strong-password-123",
        "full_name": "First",
        "organization_name": f"Org A {unique}",
    }
    first = await client.post("/api/v1/auth/register", json=payload)
    assert first.status_code == 201
    second = await client.post(
        "/api/v1/auth/register",
        json={**payload, "full_name": "Second", "organization_name": f"Org B {unique}"},
    )
    assert second.status_code == 409


@pytest.mark.asyncio
@requires_test_db
async def test_login_without_slug_and_jwt_claims(client):
    unique = uuid.uuid4().hex[:8]
    email = f"login-{unique}@example.com"
    password = "a-strong-password-123"
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "password": password,
            "full_name": "Login User",
            "organization_name": f"Org {unique}",
        },
    )
    login = await client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert login.status_code == 403
    assert login.json()["code"] == "email_not_verified"

    from app.tests.verification_helpers import raw_token_from_mailbox

    verify = await client.post(
        "/api/v1/auth/verify-email", json={"token": raw_token_from_mailbox(email)}
    )
    assert verify.status_code == 200
    login = await client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert login.status_code == 200
    payload = decode_token(login.json()["access_token"])
    assert payload["org_id"]
    assert payload["account_id"]
    assert payload["sub"]
    assert payload["org_id"] != payload["account_id"]
    assert "email_verified" not in payload


@pytest.mark.asyncio
@requires_test_db
async def test_login_wrong_slug_is_rejected(client):
    unique = uuid.uuid4().hex[:8]
    email = f"slug-{unique}@example.com"
    password = "a-strong-password-123"
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "password": password,
            "full_name": "Slug User",
            "organization_name": f"Org {unique}",
        },
    )
    login = await client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password, "organization_slug": "not-this-org"},
    )
    assert login.status_code == 401


@pytest.mark.asyncio
@requires_test_db
async def test_trial_history_insert_does_not_block_login(client, integration_engine):
    unique = uuid.uuid4().hex[:8]
    email = f"ledger-{unique}@example.com"
    password = "a-strong-password-123"
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "password": password,
            "full_name": "Ledger User",
            "organization_name": f"Org {unique}",
        },
    )
    session_factory = async_sessionmaker(integration_engine, expire_on_commit=False, class_=AsyncSession)
    async with session_factory() as session:
        account_id = (
            await session.execute(text("SELECT id FROM accounts WHERE email = :email"), {"email": email})
        ).scalar_one()
        await session.execute(
            text(
                """
                INSERT INTO trial_history (id, account_id, event_type, occurred_at)
                VALUES (:id, :account_id, 'trial_started', :occurred_at)
                """
            ),
            {"id": uuid.uuid4(), "account_id": account_id, "occurred_at": datetime.now(UTC)},
        )
        await session.commit()

    from app.tests.verification_helpers import raw_token_from_mailbox

    verify = await client.post(
        "/api/v1/auth/verify-email", json={"token": raw_token_from_mailbox(email)}
    )
    assert verify.status_code == 200
    login = await client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert login.status_code == 200


@pytest.mark.asyncio
@requires_test_db
async def test_accounts_and_trial_history_have_no_tenant_rls_policy(integration_engine):
    session_factory = async_sessionmaker(integration_engine, expire_on_commit=False, class_=AsyncSession)
    async with session_factory() as session:
        rows = (
            await session.execute(
                text(
                    """
                    SELECT tablename, policyname
                    FROM pg_policies
                    WHERE tablename IN ('accounts', 'trial_history', 'account_email_verification_tokens')
                    """
                )
            )
        ).all()
    assert rows == []


@pytest.mark.asyncio
@requires_test_db
async def test_second_user_same_account_is_rejected(client, integration_engine):
    unique = uuid.uuid4().hex[:8]
    email = f"oneuser-{unique}@example.com"
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "password": "a-strong-password-123",
            "full_name": "One User",
            "organization_name": f"Org {unique}",
        },
    )
    session_factory = async_sessionmaker(integration_engine, expire_on_commit=False, class_=AsyncSession)
    async with session_factory() as session:
        row = (
            await session.execute(
                text("SELECT account_id, organization_id, hashed_password FROM users WHERE email = :email"),
                {"email": email},
            )
        ).one()
        with pytest.raises(IntegrityError):
            await session.execute(
                text(
                    """
                    INSERT INTO users (id, organization_id, email, hashed_password, full_name, account_id)
                    VALUES (:id, :organization_id, :email, :hashed_password, 'Other', :account_id)
                    """
                ),
                {
                    "id": uuid.uuid4(),
                    "organization_id": row.organization_id,
                    "email": f"other-{unique}@example.com",
                    "hashed_password": row.hashed_password,
                    "account_id": row.account_id,
                },
            )
            await session.commit()
        await session.rollback()


@pytest.mark.asyncio
@requires_test_db
async def test_user_cannot_attach_to_another_organization(client, integration_engine):
    unique = uuid.uuid4().hex[:8]
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": f"a-{unique}@example.com",
            "password": "a-strong-password-123",
            "full_name": "A",
            "organization_name": f"OrgA {unique}",
        },
    )
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": f"b-{unique}@example.com",
            "password": "a-strong-password-123",
            "full_name": "B",
            "organization_name": f"OrgB {unique}",
        },
    )
    session_factory = async_sessionmaker(integration_engine, expire_on_commit=False, class_=AsyncSession)
    async with session_factory() as session:
        a = (
            await session.execute(
                text("SELECT id, organization_id FROM users WHERE email = :email"),
                {"email": f"a-{unique}@example.com"},
            )
        ).one()
        b_org = (
            await session.execute(
                text("SELECT organization_id FROM users WHERE email = :email"),
                {"email": f"b-{unique}@example.com"},
            )
        ).scalar_one()
        with pytest.raises(IntegrityError):
            await session.execute(
                text("UPDATE users SET organization_id = :org WHERE id = :id"),
                {"org": b_org, "id": a.id},
            )
            await session.commit()
        await session.rollback()


@pytest.mark.asyncio
@requires_test_db
async def test_fail_closed_preflight_detects_duplicate_emails_across_orgs(client, integration_engine):
    unique = uuid.uuid4().hex[:8]
    email_a = f"a-{unique}@example.com"
    email_b = f"b-{unique}@example.com"
    password = "a-strong-password-123"
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": email_a,
            "password": password,
            "full_name": "A",
            "organization_name": f"OrgA {unique}",
        },
    )
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": email_b,
            "password": password,
            "full_name": "B",
            "organization_name": f"OrgB {unique}",
        },
    )
    session_factory = async_sessionmaker(integration_engine, expire_on_commit=False, class_=AsyncSession)
    async with session_factory() as session:
        trans = await session.begin()
        try:
            await session.execute(
                text("UPDATE users SET email = :email WHERE email = :other"),
                {"email": email_a, "other": email_b},
            )
            conn = await session.connection()
            issues = await conn.run_sync(collect_slice1_mapping_ambiguities)
            assert any("duplicate email across organizations" in i and email_a in i for i in issues)
            with pytest.raises(Slice1LegacyMappingError, match="fail-closed"):
                await conn.run_sync(assert_slice1_legacy_mapping_is_deterministic)
        finally:
            await trans.rollback()


@pytest.mark.asyncio
@requires_test_db
async def test_fail_closed_preflight_detects_zero_user_and_multi_user_orgs(integration_engine):
    session_factory = async_sessionmaker(integration_engine, expire_on_commit=False, class_=AsyncSession)
    org_id = uuid.uuid4()
    async with session_factory() as session:
        trans = await session.begin()
        try:
            await session.execute(
                text("INSERT INTO organizations (id, name, slug) VALUES (:id, 'Empty', :slug)"),
                {"id": org_id, "slug": f"empty-{org_id.hex[:8]}"},
            )
            conn = await session.connection()
            issues = await conn.run_sync(collect_slice1_mapping_ambiguities)
            assert any(f"organization has zero users: organization_id={org_id}" in i for i in issues)
            with pytest.raises(Slice1LegacyMappingError, match="fail-closed"):
                await conn.run_sync(assert_slice1_legacy_mapping_is_deterministic)
        finally:
            await trans.rollback()
