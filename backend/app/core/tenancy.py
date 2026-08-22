"""
Multi-tenancy context.

Locked decision: shared database + PostgreSQL Row-Level Security (RLS).
Every tenant-owned table carries an `organization_id` column, and Postgres
enforces isolation on every query -- not the application code.

This module sets the current tenant (`organization_id`) as a Postgres
session variable (`app.current_org_id`) at the start of every request, which
the RLS policies (see backend/alembic/versions/0001_initial_schema.py) read via
`current_setting('app.current_org_id')`.
"""
from contextvars import ContextVar

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

current_organization_id: ContextVar[str | None] = ContextVar(
    "current_organization_id", default=None
)


async def set_tenant_context(session: AsyncSession, organization_id: str) -> None:
    """Set the Postgres session variable read by every RLS policy."""
    await session.execute(
        text("SELECT set_config('app.current_org_id', :org_id, true)"),
        {"org_id": organization_id},
    )
    current_organization_id.set(organization_id)
