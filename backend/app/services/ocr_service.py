"""OCR orchestration: storage → engine → ocr_jobs. No LLM, search, or embeddings."""

from __future__ import annotations

import logging
import uuid
from collections.abc import Callable

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.document import Document, DocumentStatus
from app.models.ocr_job import JobStatus, OCRJob
from app.ocr.engine import OCREngine
from app.ocr.types import (
    CorruptedOCRInputError,
    EmptyOCRResultError,
    OCREngineError,
    OCREngineResult,
    UnsupportedOCRInputError,
)
from app.services.storage_service import StorageService

logger = logging.getLogger("smartarchive.ocr")

_SUPPORTED_MIME = {"application/pdf", "image/png", "image/jpeg"}

EngineFactory = Callable[[], OCREngine]


def _pages_payload(result: OCREngineResult) -> list[dict]:
    payload: list[dict] = []
    for page in result.pages:
        item: dict = {"page_number": page.page_number, "text": page.text}
        if page.confidence is not None:
            item["confidence"] = page.confidence
        payload.append(item)
    return payload


class OCRService:
    def __init__(
        self,
        session: AsyncSession,
        storage: StorageService,
        engine_factory: EngineFactory,
    ) -> None:
        self._session = session
        self._storage = storage
        self._engine_factory = engine_factory

    async def get_document(self, document_id: uuid.UUID) -> Document | None:
        result = await self._session.execute(select(Document).where(Document.id == document_id))
        return result.scalar_one_or_none()

    async def latest_job(self, document_id: uuid.UUID) -> OCRJob | None:
        result = await self._session.execute(
            select(OCRJob)
            .where(OCRJob.document_id == document_id)
            .order_by(OCRJob.created_at.desc())
        )
        return result.scalars().first()

    async def get_job(self, job_id: uuid.UUID) -> OCRJob | None:
        result = await self._session.execute(select(OCRJob).where(OCRJob.id == job_id))
        return result.scalar_one_or_none()

    async def enqueue(self, document: Document) -> OCRJob:
        existing = await self.latest_job(document.id)
        if existing is not None and existing.status in {JobStatus.queued, JobStatus.running}:
            return existing
        job = OCRJob(
            document_id=document.id,
            organization_id=document.organization_id,
            status=JobStatus.queued,
        )
        self._session.add(job)
        document.status = DocumentStatus.processing
        await self._session.flush()
        return job

    async def process_job(self, job_id: uuid.UUID) -> OCRJob:
        job = await self.get_job(job_id)
        if job is None:
            raise OCREngineError("OCR job not found")
        document = await self.get_document(job.document_id)
        if document is None:
            await self._fail(job, None, "missing stored object")
            return job

        job.status = JobStatus.running
        job.error_message = None
        document.status = DocumentStatus.processing
        await self._session.flush()

        if document.mime_type not in _SUPPORTED_MIME:
            await self._fail(job, document, "unsupported file")
            return job

        try:
            data = self._storage.download(document.storage_key)
        except Exception:
            logger.exception("ocr storage download failed")
            await self._fail(job, document, "missing stored object")
            return job

        if not data:
            await self._fail(job, document, "missing stored object")
            return job

        try:
            engine = self._engine_factory()
            result = engine.recognize(data, document.mime_type)
        except UnsupportedOCRInputError:
            await self._fail(job, document, "unsupported file")
            return job
        except CorruptedOCRInputError:
            await self._fail(job, document, "corrupted file")
            return job
        except EmptyOCRResultError:
            await self._fail(job, document, "empty OCR result")
            return job
        except OCREngineError:
            logger.exception("ocr engine failed")
            await self._fail(job, document, "OCR engine failure")
            return job
        except Exception:
            logger.exception("ocr processing failed")
            await self._fail(job, document, "processing failure")
            return job

        job.status = JobStatus.completed
        job.error_message = None
        job.extracted_text = result.combined_text
        job.detected_language = result.detected_language
        job.mean_confidence = result.mean_confidence
        job.pages_json = _pages_payload(result)
        job.engine_name = result.engine_name
        job.engine_version = result.engine_version
        job.paddle_lang_used = result.paddle_lang_used
        document.status = DocumentStatus.ready
        await self._session.flush()
        return job

    async def _fail(self, job: OCRJob, document: Document | None, message: str) -> None:
        job.status = JobStatus.failed
        job.error_message = message
        job.extracted_text = None
        if document is not None:
            document.status = DocumentStatus.failed
        await self._session.flush()
