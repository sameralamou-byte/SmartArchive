"""SA-OCR-MVP — persist extracted text on existing ocr_jobs.

Revision ID: 0005_ocr_job_result
Revises: 0004_auth002_sessions
Create Date: 2026-08-24

Additive only. Does not replace ocr_jobs. Does not touch unrelated tables.
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql as pg

revision: str = "0005_ocr_job_result"
down_revision: str | None = "0004_auth002_sessions"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    columns = {column["name"] for column in inspector.get_columns("ocr_jobs")}
    if "extracted_text" not in columns:
        op.add_column("ocr_jobs", sa.Column("extracted_text", sa.Text(), nullable=True))
    if "detected_language" not in columns:
        op.add_column("ocr_jobs", sa.Column("detected_language", sa.String(length=32), nullable=True))
    if "mean_confidence" not in columns:
        op.add_column("ocr_jobs", sa.Column("mean_confidence", sa.Float(), nullable=True))
    if "pages_json" not in columns:
        op.add_column("ocr_jobs", sa.Column("pages_json", pg.JSONB(astext_type=sa.Text()), nullable=True))
    if "engine_name" not in columns:
        op.add_column("ocr_jobs", sa.Column("engine_name", sa.String(length=64), nullable=True))
    if "engine_version" not in columns:
        op.add_column("ocr_jobs", sa.Column("engine_version", sa.String(length=64), nullable=True))
    if "paddle_lang_used" not in columns:
        op.add_column("ocr_jobs", sa.Column("paddle_lang_used", sa.String(length=32), nullable=True))


def downgrade() -> None:
    op.drop_column("ocr_jobs", "paddle_lang_used")
    op.drop_column("ocr_jobs", "engine_version")
    op.drop_column("ocr_jobs", "engine_name")
    op.drop_column("ocr_jobs", "pages_json")
    op.drop_column("ocr_jobs", "mean_confidence")
    op.drop_column("ocr_jobs", "detected_language")
    op.drop_column("ocr_jobs", "extracted_text")
