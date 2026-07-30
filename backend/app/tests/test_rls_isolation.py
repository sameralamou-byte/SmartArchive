"""
Integration test -- proves PostgreSQL RLS actually blocks cross-tenant reads,
not just that application code happens to filter correctly. Skipped unless
TEST_DATABASE_URL is set; see conftest.py.

This deliberately queries the database directly (bypassing the API) so a
bug in a future endpoint's WHERE clause cannot hide an RLS failure -- the
database itself is the thing under test.

IMPORTANT: PostgreSQL superusers -- which is what POSTGRES_USER becomes in
the stock postgres Docker image used here and in CI -- always bypass RLS,
even on tables with FORCE ROW LEVEL SECURITY. Running the read checks on
the plain connection would therefore "pass" even if RLS were completely
broken. `SET ROLE` to a dedicated NOSUPERUSER/NOBYPASSRLS role before each
read makes this test actually exercise enforcement, not just app.
"""
import uuid

import pytest
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.tests.conftest import requires_test_db

RLS_TEST_ROLE = "rls_test_role"


@pytest.mark.asyncio
@requires_test_db
async def test_rls_blocks_cross_tenant_document_reads(integration_engine):
    session_factory = async_sessionmaker(integration_engine, expire_on_commit=False, class_=AsyncSession)

    org_a = uuid.uuid4()
    org_b = uuid.uuid4()
    user_a = uuid.uuid4()
    doc_a = uuid.uuid4()

    async with session_factory() as setup_session:
        # Ensure a restricted, non-superuser role exists to actually test
        # RLS against (see module docstring for why this matters). A
        # superuser can always SET ROLE to any role without membership
        # grants, so no GRANT <role> TO <superuser> is needed here.
        #
        # RLS_TEST_ROLE is interpolated directly rather than bound as a
        # parameter: PostgreSQL's DO block doesn't accept bind parameters at
        # all (only plain EXECUTE ... USING does, inside the block), and
        # RLS_TEST_ROLE is a fixed developer constant, not external input,
        # so there's no injection risk here.
        await setup_session.execute(
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
        await setup_session.execute(
            text(f"GRANT SELECT, INSERT ON organizations, users, documents TO {RLS_TEST_ROLE}")
        )
        await setup_session.commit()

        # Superuser-equivalent setup connection has no tenant context set,
        # so writes here happen as the table owner (RLS doesn't apply to
        # BYPASSRLS roles / the migration-owning role in most setups).
        await setup_session.execute(
            text("INSERT INTO organizations (id, name, slug) VALUES (:id, :name, :slug)"),
            {"id": str(org_a), "name": "Org A", "slug": f"org-a-{org_a.hex[:8]}"},
        )
        await setup_session.execute(
            text("INSERT INTO organizations (id, name, slug) VALUES (:id, :name, :slug)"),
            {"id": str(org_b), "name": "Org B", "slug": f"org-b-{org_b.hex[:8]}"},
        )
        await setup_session.execute(
            text(
                "INSERT INTO users (id, organization_id, email, hashed_password, full_name) "
                "VALUES (:id, :org_id, :email, 'x', 'A User')"
            ),
            {"id": str(user_a), "org_id": str(org_a), "email": "a@example.com"},
        )
        await setup_session.execute(
            text(
                "INSERT INTO documents "
                "(id, organization_id, title, original_filename, mime_type, "
                "size_bytes, storage_key, owner_id) "
                "VALUES (:id, :org_id, 'Doc A', 'a.pdf', 'application/pdf', 10, 'key/a.pdf', :owner_id)"
            ),
            {"id": str(doc_a), "org_id": str(org_a), "owner_id": str(user_a)},
        )
        await setup_session.commit()

    # Now read as tenant B's context, under the restricted role -- org A's
    # document must be invisible. Without SET ROLE this connection would
    # still be the superuser and would bypass RLS regardless of org context.
    async with session_factory() as tenant_b_session:
        await tenant_b_session.execute(text(f"SET ROLE {RLS_TEST_ROLE}"))
        await tenant_b_session.execute(
            text("SELECT set_config('app.current_org_id', :org_id, true)"), {"org_id": str(org_b)}
        )
        result = await tenant_b_session.execute(
            text("SELECT id FROM documents WHERE id = :doc_id"), {"doc_id": str(doc_a)}
        )
        assert result.scalar_one_or_none() is None, "RLS FAILED: tenant B could read tenant A's document"
        await tenant_b_session.execute(text("RESET ROLE"))

    # Sanity check: tenant A's own context, under the same restricted role,
    # can still see it -- proves the policy allows the right tenant through
    # rather than just blocking everyone.
    async with session_factory() as tenant_a_session:
        await tenant_a_session.execute(text(f"SET ROLE {RLS_TEST_ROLE}"))
        await tenant_a_session.execute(
            text("SELECT set_config('app.current_org_id', :org_id, true)"), {"org_id": str(org_a)}
        )
        result = await tenant_a_session.execute(
            text("SELECT id FROM documents WHERE id = :doc_id"), {"doc_id": str(doc_a)}
        )
        assert result.scalar_one_or_none() is not None, "Tenant A could not read its own document"
        await tenant_a_session.execute(text("RESET ROLE"))
