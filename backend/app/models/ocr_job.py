import enum
import uuid
from typing import Any

from sqlalchemy import Enum, Float, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import TenantMixin, TimestampMixin, UUIDPKMixin


class JobStatus(str, enum.Enum):
    queued = "queued"
    running = "running"
    completed = "completed"
    failed = "failed"


class OCRJob(UUIDPKMixin, TimestampMixin, TenantMixin, Base):
    """OCR job row. Engine wiring lives in app.ocr / app.services.ocr_service."""

    __tablename__ = "ocr_jobs"

    document_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True
    )
    status: Mapped[JobStatus] = mapped_column(
        Enum(JobStatus, name="ocr_job_status"), nullable=False, default=JobStatus.queued
    )
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    extracted_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    detected_language: Mapped[str | None] = mapped_column(String(32), nullable=True)
    mean_confidence: Mapped[float | None] = mapped_column(Float, nullable=True)
    pages_json: Mapped[list[dict[str, Any]] | None] = mapped_column(JSONB, nullable=True)
    engine_name: Mapped[str | None] = mapped_column(String(64), nullable=True)
    engine_version: Mapped[str | None] = mapped_column(String(64), nullable=True)
    paddle_lang_used: Mapped[str | None] = mapped_column(String(32), nullable=True)
