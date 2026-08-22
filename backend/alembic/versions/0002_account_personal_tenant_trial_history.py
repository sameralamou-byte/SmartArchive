"""Slice 1 — Account, Personal Tenant binding, TrialHistory ledger.

Revision ID: 0002_account_tenant_trial
Revises: 0001_initial_schema
Create Date: 2026-08-16

Does not enable tenant RLS on accounts or trial_history.
Does not merge, delete, move documents, or change organization_id.
"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql as pg

from app.core.slice1_legacy_preflight import assert_slice1_legacy_mapping_is_deterministic

revision: str = "0002_account_tenant_trial"
down_revision: str | None = "0001_initial_schema"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "accounts",
        sa.Column("id", pg.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("email", sa.String(320), nullable=False),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default=sa.true()),
        sa.Column(
            "personal_organization_id",
            pg.UUID(as_uuid=True),
            sa.ForeignKey("organizations.id", ondelete="RESTRICT"),
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("email", name="uq_accounts_email"),
        sa.UniqueConstraint("personal_organization_id", name="uq_accounts_personal_organization_id"),
        sa.UniqueConstraint(
            "id", "personal_organization_id", name="uq_accounts_id_personal_organization_id"
        ),
    )
    op.create_index("ix_accounts_email", "accounts", ["email"])

    op.add_column(
        "users",
        sa.Column("account_id", pg.UUID(as_uuid=True), nullable=True),
    )

    bind = op.get_bind()
    assert_slice1_legacy_mapping_is_deterministic(bind)

    bind.execute(
        sa.text(
            """
            INSERT INTO accounts (id, email, is_active, personal_organization_id, created_at, updated_at)
            SELECT gen_random_uuid(), u.email, true, u.organization_id, now(), now()
            FROM users u
            """
        )
    )
    bind.execute(
        sa.text(
            """
            UPDATE users AS u
            SET account_id = a.id
            FROM accounts AS a
            WHERE a.personal_organization_id = u.organization_id
            """
        )
    )

    op.alter_column("users", "account_id", existing_type=pg.UUID(as_uuid=True), nullable=False)
    op.create_foreign_key(
        "fk_users_account_id",
        "users",
        "accounts",
        ["account_id"],
        ["id"],
        ondelete="RESTRICT",
    )
    op.create_index("ix_users_account_id", "users", ["account_id"])
    op.create_unique_constraint("uq_users_account_id", "users", ["account_id"])
    op.create_foreign_key(
        "fk_users_account_personal_tenant",
        "users",
        "accounts",
        ["account_id", "organization_id"],
        ["id", "personal_organization_id"],
    )

    op.create_table(
        "trial_history",
        sa.Column("id", pg.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column(
            "account_id",
            pg.UUID(as_uuid=True),
            sa.ForeignKey("accounts.id", ondelete="RESTRICT"),
            nullable=False,
        ),
        sa.Column("event_type", sa.String(32), nullable=False),
        sa.Column("occurred_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("metadata_json", pg.JSONB, nullable=True),
        sa.CheckConstraint(
            "event_type IN ('trial_started', 'trial_ended')",
            name="ck_trial_history_event_type",
        ),
    )
    op.create_index("ix_trial_history_account_id", "trial_history", ["account_id"])


def downgrade() -> None:
    op.drop_index("ix_trial_history_account_id", table_name="trial_history")
    op.drop_table("trial_history")
    op.drop_constraint("fk_users_account_personal_tenant", "users", type_="foreignkey")
    op.drop_constraint("uq_users_account_id", "users", type_="unique")
    op.drop_index("ix_users_account_id", table_name="users")
    op.drop_constraint("fk_users_account_id", "users", type_="foreignkey")
    op.drop_column("users", "account_id")
    op.drop_index("ix_accounts_email", table_name="accounts")
    op.drop_table("accounts")
