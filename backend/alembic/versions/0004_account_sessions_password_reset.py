"""SA-AUTH-002 — Account sessions and password-reset tokens.

Revision ID: 0004_auth002_sessions
Revises: 0003_account_email_verification
Create Date: 2026-08-16

Additive only. No TenantMixin. No organization_id. No RLS policies.
Does not store raw refresh secrets or reset tokens.
"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql as pg

revision: str = "0004_auth002_sessions"
down_revision: str | None = "0003_account_email_verification"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    existing = set(sa.inspect(op.get_bind()).get_table_names())
    if "account_password_reset_tokens" not in existing:
        op.create_table(
            "account_password_reset_tokens",
            sa.Column(
                "id",
                pg.UUID(as_uuid=True),
                primary_key=True,
                server_default=sa.text("gen_random_uuid()"),
            ),
            sa.Column(
                "account_id",
                pg.UUID(as_uuid=True),
                sa.ForeignKey("accounts.id", ondelete="RESTRICT"),
                nullable=False,
            ),
            sa.Column("token_hash", sa.LargeBinary, nullable=False),
            sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("consumed_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                server_default=sa.func.now(),
                nullable=False,
            ),
            sa.UniqueConstraint("token_hash", name="uq_account_password_reset_tokens_token_hash"),
        )
        op.create_index(
            "ix_account_password_reset_tokens_account_id",
            "account_password_reset_tokens",
            ["account_id"],
        )
        op.create_index(
            "uq_account_password_reset_tokens_account_unconsumed",
            "account_password_reset_tokens",
            ["account_id"],
            unique=True,
            postgresql_where=sa.text("consumed_at IS NULL"),
        )

    if "account_sessions" not in existing:
        op.create_table(
            "account_sessions",
            sa.Column(
                "id",
                pg.UUID(as_uuid=True),
                primary_key=True,
                server_default=sa.text("gen_random_uuid()"),
            ),
            sa.Column(
                "account_id",
                pg.UUID(as_uuid=True),
                sa.ForeignKey("accounts.id", ondelete="RESTRICT"),
                nullable=False,
            ),
            sa.Column("refresh_hash", sa.LargeBinary, nullable=False),
            sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("revoked_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("remember_me", sa.Boolean, nullable=False),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                server_default=sa.func.now(),
                nullable=False,
            ),
            sa.UniqueConstraint("refresh_hash", name="uq_account_sessions_refresh_hash"),
        )
        op.create_index("ix_account_sessions_account_id", "account_sessions", ["account_id"])


def downgrade() -> None:
    op.drop_index("ix_account_sessions_account_id", table_name="account_sessions")
    op.drop_table("account_sessions")
    op.drop_index(
        "uq_account_password_reset_tokens_account_unconsumed",
        table_name="account_password_reset_tokens",
    )
    op.drop_index(
        "ix_account_password_reset_tokens_account_id",
        table_name="account_password_reset_tokens",
    )
    op.drop_table("account_password_reset_tokens")
