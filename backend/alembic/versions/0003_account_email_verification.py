"""SA-AUTH-001 — Account email verification foundation.

Revision ID: 0003_account_email_verification
Revises: 0002_account_tenant_trial
Create Date: 2026-08-16

Additive only. Does not enable RLS. Does not backfill email_verified_at.
Does not store raw verification tokens.
"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql as pg

revision: str = "0003_account_email_verification"
down_revision: str | None = "0002_account_tenant_trial"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "accounts",
        sa.Column("email_verified_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_table(
        "account_email_verification_tokens",
        sa.Column("id", pg.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column(
            "account_id",
            pg.UUID(as_uuid=True),
            sa.ForeignKey("accounts.id", ondelete="RESTRICT"),
            nullable=False,
        ),
        sa.Column("token_hash", sa.LargeBinary, nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("consumed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("token_hash", name="uq_account_email_verification_tokens_token_hash"),
    )
    op.create_index(
        "ix_account_email_verification_tokens_account_id",
        "account_email_verification_tokens",
        ["account_id"],
    )
    op.create_index(
        "uq_account_email_verification_tokens_account_unconsumed",
        "account_email_verification_tokens",
        ["account_id"],
        unique=True,
        postgresql_where=sa.text("consumed_at IS NULL"),
    )


def downgrade() -> None:
    op.drop_index(
        "uq_account_email_verification_tokens_account_unconsumed",
        table_name="account_email_verification_tokens",
    )
    op.drop_index(
        "ix_account_email_verification_tokens_account_id",
        table_name="account_email_verification_tokens",
    )
    op.drop_table("account_email_verification_tokens")
    op.drop_column("accounts", "email_verified_at")
