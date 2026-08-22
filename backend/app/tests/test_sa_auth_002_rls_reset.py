"""SA-AUTH-002 — password-reset RLS fail-closed under NOSUPERUSER.

Does not modify production RLS policies. Skipped unless TEST_DATABASE_URL is set.
"""
import uuid

import pytest
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.core.tenancy import set_tenant_context as real_set_tenant_context
from app.mailer.sender import get_memory_sender
from app.repositories.user_repository import UserRepository
from app.schemas.auth import ResetPasswordRequest
from app.services.auth_service import AuthService, PasswordResetInvalidError
from app.tests.conftest import requires_test_db
from app.tests.test_sa_auth_002 import PASSWORD, _register_and_verify
from app.tests.verification_helpers import raw_token_from_mailbox

RLS_TEST_ROLE = "rls_test_role"


async def _ensure_rls_role(session: AsyncSession) -> None:
    await session.execute(
        text(
            f"""
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '{RLS_TEST_ROLE}') THEN
                    CREATE ROLE {RLS_TEST_ROLE} NOSUPERUSER NOBYPASSRLS;
                END IF;
            END
            $$;
            """
        )
    )
    await session.execute(text(f"GRANT USAGE ON SCHEMA public TO {RLS_TEST_ROLE}"))
    await session.execute(
        text(
            f"GRANT SELECT, UPDATE ON users, account_password_reset_tokens, account_sessions "
            f"TO {RLS_TEST_ROLE}"
        )
    )
    await session.execute(text(f"GRANT SELECT ON accounts, organizations TO {RLS_TEST_ROLE}"))
    await session.commit()


@pytest.mark.asyncio
@requires_test_db
async def test_password_reset_rls_uses_personal_tenant_same_session(
    client, integration_engine, monkeypatch
):
    email, _password = await _register_and_verify(client)
    get_memory_sender().clear()
    await client.post("/api/v1/auth/forgot-password", json={"email": email})
    token = raw_token_from_mailbox(email)
    new_password = "a-new-password-456"
    wrong_org = uuid.uuid4()

    session_factory = async_sessionmaker(integration_engine, expire_on_commit=False, class_=AsyncSession)
    async with session_factory() as setup:
        await _ensure_rls_role(setup)
        role = (
            await setup.execute(
                text("SELECT rolsuper, rolbypassrls FROM pg_roles WHERE rolname = :name"),
                {"name": RLS_TEST_ROLE},
            )
        ).one()
        assert role.rolsuper is False
        assert role.rolbypassrls is False
        users_rls = (
            await setup.execute(
                text(
                    "SELECT relrowsecurity, relforcerowsecurity FROM pg_class "
                    "WHERE relname = 'users'"
                )
            )
        ).one()
        assert users_rls.relrowsecurity is True
        assert users_rls.relforcerowsecurity is True
        auth_tables = (
            await setup.execute(
                text(
                    "SELECT relname, relrowsecurity FROM pg_class "
                    "WHERE relname IN ('account_password_reset_tokens', 'account_sessions') "
                    "ORDER BY relname"
                )
            )
        ).all()
        assert [row.relname for row in auth_tables] == [
            "account_password_reset_tokens",
            "account_sessions",
        ]
        assert all(row.relrowsecurity is False for row in auth_tables)

        account = (
            await setup.execute(
                text(
                    "SELECT a.id, a.personal_organization_id, u.id AS user_id, u.hashed_password "
                    "FROM accounts a JOIN users u ON u.account_id = a.id WHERE a.email = :email"
                ),
                {"email": email},
            )
        ).one()
        await setup.execute(
            text("INSERT INTO organizations (id, name, slug) VALUES (:id, :name, :slug)"),
            {"id": str(wrong_org), "name": "Wrong Org", "slug": f"wrong-{wrong_org.hex[:8]}"},
        )
        await setup.commit()
        original_hash = account.hashed_password
        personal_org = str(account.personal_organization_id)
        user_id = str(account.user_id)

    async def wrong_set(session, organization_id: str) -> None:
        await session.execute(
            text("SELECT set_config('app.current_org_id', :org_id, true)"),
            {"org_id": str(wrong_org)},
        )

    monkeypatch.setattr("app.services.auth_service.set_tenant_context", wrong_set)
    async with session_factory() as blocked:
        await blocked.execute(text(f"SET ROLE {RLS_TEST_ROLE}"))
        service = AuthService(blocked)
        with pytest.raises(PasswordResetInvalidError):
            await service.reset_password(
                ResetPasswordRequest(token=token, password=new_password, password_confirm=new_password)
            )
        await blocked.execute(text("RESET ROLE"))

    async with session_factory() as verify:
        still_hash = (
            await verify.execute(
                text("SELECT hashed_password FROM users WHERE id = :id"),
                {"id": user_id},
            )
        ).scalar_one()
        assert still_hash == original_hash
        await verify.execute(text(f"SET ROLE {RLS_TEST_ROLE}"))
        await verify.execute(
            text("SELECT set_config('app.current_org_id', :org_id, true)"),
            {"org_id": str(wrong_org)},
        )
        tamper = await verify.execute(
            text("UPDATE users SET hashed_password = 'tampered' WHERE id = :id RETURNING id"),
            {"id": user_id},
        )
        assert tamper.first() is None
        await verify.rollback()

    seen: dict = {}
    real_get = UserRepository.get_by_account_and_organization

    async def tracking_set(session, organization_id: str) -> None:
        seen["set_session"] = session
        seen["set_org"] = organization_id
        seen["set_txn"] = session.in_transaction()
        await real_set_tenant_context(session, organization_id)

    async def tracking_get(self, account_id, organization_id):
        seen["get_session"] = self.session
        seen["get_org"] = str(organization_id)
        seen["get_txn"] = self.session.in_transaction()
        return await real_get(self, account_id, organization_id)

    monkeypatch.setattr("app.services.auth_service.set_tenant_context", tracking_set)
    monkeypatch.setattr(UserRepository, "get_by_account_and_organization", tracking_get)

    async with session_factory() as allowed:
        await allowed.execute(text(f"SET ROLE {RLS_TEST_ROLE}"))
        service = AuthService(allowed)
        await service.reset_password(
            ResetPasswordRequest(token=token, password=new_password, password_confirm=new_password)
        )
        await allowed.execute(text("RESET ROLE"))

    assert seen["set_session"] is seen["get_session"]
    assert seen["set_txn"] is True
    assert seen["get_txn"] is True
    assert seen["set_org"] == personal_org
    assert seen["get_org"] == personal_org

    login = await client.post("/api/v1/auth/login", json={"email": email, "password": new_password})
    assert login.status_code == 200
    old_login = await client.post("/api/v1/auth/login", json={"email": email, "password": PASSWORD})
    assert old_login.status_code == 401
