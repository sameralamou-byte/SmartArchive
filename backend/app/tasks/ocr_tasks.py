"""Celery OCR worker. Uses async DB sessions via asyncio.run — no sync engine."""

from __future__ import annotations

import asyncio
import logging
import uuid

from app.core.database import _get_session_factory
from app.core.tenancy import set_tenant_context
from app.ocr.factory import default_ocr_engine
from app.services.ocr_service import OCRService
from app.services.storage_service import StorageService
from app.tasks.celery_app import celery_app

logger = logging.getLogger("smartarchive.ocr")


async def _run(job_id: uuid.UUID, organization_id: str) -> None:
    session_factory = _get_session_factory()
    async with session_factory() as session:
        await set_tenant_context(session, organization_id)
        service = OCRService(session, StorageService(), default_ocr_engine)
        try:
            await service.process_job(job_id)
            await session.commit()
        except Exception:
            await session.rollback()
            logger.exception("ocr celery job failed")
            raise


@celery_app.task(name="app.tasks.ocr_tasks.process_ocr_job")
def process_ocr_job(job_id: str, organization_id: str) -> str:
    asyncio.run(_run(uuid.UUID(job_id), organization_id))
    return job_id
