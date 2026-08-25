"""RLS isolation for ocr_jobs. Skipped unless TEST_DATABASE_URL is a disposable database."""

import uuid

import pytest
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.tests.conftest import requires_test_db

RLS_TEST_ROLE = "rls_test_role"


@pytest.mark.asyncio
@requires_test_db
async def test_rls_blocks_cross_tenant_ocr_job_reads(integration_engine):
    session_factory = async_sessionmaker(integration_engine, expire_on_commit=False, class_=AsyncSession)
    org_a = uuid.uuid4()
    org_b = uuid.uuid4()
    account_a = uuid.uuid4()
    user_a = uuid.uuid4()
    doc_a = uuid.uuid4()
    job_a = uuid.uuid4()
    email_a = f"ocr-a-{org_a.hex[:8]}@example.com"

    async with session_factory() as setup_session:
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
            text(
                f"GRANT SELECT, INSERT ON organizations, users, documents, ocr_jobs TO {RLS_TEST_ROLE}"
            )
        )
        await setup_session.commit()
        await setup_session.execute(
            text("INSERT INTO organizations (id, name, slug) VALUES (:id, :name, :slug)"),
            {"id": str(org_a), "name": "OCR Org A", "slug": f"ocr-a-{org_a.hex[:8]}"},
        )
        await setup_session.execute(
            text("INSERT INTO organizations (id, name, slug) VALUES (:id, :name, :slug)"),
            {"id": str(org_b), "name": "OCR Org B", "slug": f"ocr-b-{org_b.hex[:8]}"},
        )
        await setup_session.execute(
            text(
                "INSERT INTO accounts (id, email, is_active, personal_organization_id) "
                "VALUES (:id, :email, true, :org)"
            ),
            {"id": str(account_a), "email": email_a, "org": str(org_a)},
        )
        await setup_session.execute(
            text(
                "INSERT INTO users (id, organization_id, email, hashed_password, full_name, account_id) "
                "VALUES (:id, :org, :email, 'x', 'OCR A', :account)"
            ),
            {"id": str(user_a), "org": str(org_a), "email": email_a, "account": str(account_a)},
        )
        await setup_session.execute(
            text(
                "INSERT INTO documents (id, organization_id, title, original_filename, mime_type, "
                "size_bytes, storage_key, status, owner_id) "
                "VALUES (:id, :org, 'a.png', 'a.png', 'image/png', 1, 'a/key', 'uploaded', :owner)"
            ),
            {"id": str(doc_a), "org": str(org_a), "owner": str(user_a)},
        )
        await setup_session.execute(
            text(
                "INSERT INTO ocr_jobs (id, organization_id, document_id, status, extracted_text) "
                "VALUES (:id, :org, :doc, 'completed', 'secret-a')"
            ),
            {"id": str(job_a), "org": str(org_a), "doc": str(doc_a)},
        )
        await setup_session.commit()

        await setup_session.execute(text(f"SET ROLE {RLS_TEST_ROLE}"))
        await setup_session.execute(
            text("SELECT set_config('app.current_org_id', :org, true)"),
            {"org": str(org_b)},
        )
        hidden = await setup_session.execute(
            text("SELECT extracted_text FROM ocr_jobs WHERE id = :id"),
            {"id": str(job_a)},
        )
        assert hidden.first() is None
        await setup_session.execute(text("RESET ROLE"))
