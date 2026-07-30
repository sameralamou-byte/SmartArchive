import enum
import uuid

from sqlalchemy import Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import TenantMixin, TimestampMixin, UUIDPKMixin
from app.models.ocr_job import JobStatus


class AIJobType(str, enum.Enum):
    classification = "classification"
    extraction = "extraction"
    summarization = "summarization"
    embedding = "embedding"


class AIJob(UUIDPKMixin, TimestampMixin, TenantMixin, Base):
    """Table only in Phase 1 — no AI engine is wired up yet (Stage 2)."""

    __tablename__ = "ai_jobs"

    document_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True
    )
    job_type: Mapped[AIJobType] = mapped_column(Enum(AIJobType, name="ai_job_type"), nullable=False)
    status: Mapped[JobStatus] = mapped_column(
        Enum(JobStatus, name="ai_job_status"), nullable=False, default=JobStatus.queued
    )
    result_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
