"""
Integration test -- proves PostgreSQL RLS actually blocks cross-tenant reads,
not just that application code happens to filter correctly. Skipped unless
TEST_DATABASE_URL is set; see conftest.py.

This deliberately queries the database directly (bypassing the API) so a
bug in a future endpoint's WHERE clause cannot hide an RLS failure -- the
database itself is the thing under test.
"""
import uuid

import pytest
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.tests.conftest import requires_test_db


@pytest.mark.asyncio
@requires_test_db
async def test_rls_blocks_cross_tenant_document_reads(integration_engine):
    session_factory = async_sessionmaker(integration_engine, expire_on_commit=False, class_=AsyncSession)

    org_a = uuid.uuid4()
    org_b = uuid.uuid4()
    user_a = uuid.uuid4()
    doc_a = uuid.uuid4()

    async with session_factory() as setup_session:
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
                "(id, organization_id, title, original_filename, mime_type, size_bytes, storage_key, owner_id) "
                "VALUES (:id, :org_id, 'Doc A', 'a.pdf', 'application/pdf', 10, 'key/a.pdf', :owner_id)"
            ),
            {"id": str(doc_a), "org_id": str(org_a), "owner_id": str(user_a)},
        )
        await setup_session.commit()

    # Now read as tenant B's context -- org A's document must be invisible.
    async with session_factory() as tenant_b_session:
        await tenant_b_session.execute(
            text("SELECT set_config('app.current_org_id', :org_id, true)"), {"org_id": str(org_b)}
        )
        result = await tenant_b_session.execute(
            text("SELECT id FROM documents WHERE id = :doc_id"), {"doc_id": str(doc_a)}
        )
        assert result.scalar_one_or_none() is None, "RLS FAILED: tenant B could read tenant A's document"

    # Sanity check: tenant A's own context can still see it.
    async with session_factory() as tenant_a_session:
        await tenant_a_session.execute(
            text("SELECT set_config('app.current_org_id', :org_id, true)"), {"org_id": str(org_a)}
        )
        result = await tenant_a_session.execute(
            text("SELECT id FROM documents WHERE id = :doc_id"), {"doc_id": str(doc_a)}
        )
        assert result.scalar_one_or_none() is not None, "Tenant A could not read its own document"
