import enum
import uuid

from sqlalchemy import Enum, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import TenantMixin, TimestampMixin, UUIDPKMixin


class JobStatus(str, enum.Enum):
    queued = "queued"
    running = "running"
    completed = "completed"
    failed = "failed"


class OCRJob(UUIDPKMixin, TimestampMixin, TenantMixin, Base):
    """Table only in Phase 1 — no OCR engine is wired up yet (Stage 2)."""

    __tablename__ = "ocr_jobs"

    document_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True
    )
    status: Mapped[JobStatus] = mapped_column(
        Enum(JobStatus, name="ocr_job_status"), nullable=False, default=JobStatus.queued
    )
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
