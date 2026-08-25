import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from app.models.ocr_job import JobStatus

_API_STATUS = {
    JobStatus.queued: "pending",
    JobStatus.running: "processing",
    JobStatus.completed: "completed",
    JobStatus.failed: "failed",
}


class OCRJobRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    document_id: uuid.UUID
    status: str
    extracted_text: str | None = None
    detected_language: str | None = None
    mean_confidence: float | None = None
    pages: list[dict[str, Any]] | None = Field(default=None, validation_alias="pages_json")
    engine_name: str | None = None
    engine_version: str | None = None
    paddle_lang_used: str | None = None
    error_message: str | None = None
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_job(cls, job: object) -> "OCRJobRead":
        status = getattr(job, "status")
        api_status = _API_STATUS.get(status, str(status.value if hasattr(status, "value") else status))
        return cls(
            id=job.id,
            document_id=job.document_id,
            status=api_status,
            extracted_text=job.extracted_text,
            detected_language=job.detected_language,
            mean_confidence=job.mean_confidence,
            pages=job.pages_json,
            engine_name=job.engine_name,
            engine_version=job.engine_version,
            paddle_lang_used=job.paddle_lang_used,
            error_message=job.error_message,
            created_at=job.created_at,
            updated_at=job.updated_at,
        )
