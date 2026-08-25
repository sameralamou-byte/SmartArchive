"""Authenticated OCR status/trigger/result API. Tenant isolation via authorize + RLS."""

import logging
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.ocr.factory import default_ocr_engine
from app.schemas.ocr import OCRJobRead
from app.security.authorize import NotAuthorizedError, authorize
from app.services.ocr_service import OCRService
from app.services.storage_service import StorageService
from app.tasks.ocr_tasks import process_ocr_job

logger = logging.getLogger("smartarchive.ocr")

router = APIRouter(prefix="/documents", tags=["ocr"])


def _service(session: AsyncSession) -> OCRService:
    return OCRService(session, StorageService(), default_ocr_engine)


@router.post("/{document_id}/ocr", response_model=OCRJobRead, status_code=status.HTTP_202_ACCEPTED)
async def trigger_ocr(
    document_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
) -> OCRJobRead:
    try:
        await authorize(session, current_user, "document.read")
    except NotAuthorizedError as exc:
        raise HTTPException(status.HTTP_403_FORBIDDEN, str(exc)) from exc

    service = _service(session)
    document = await service.get_document(document_id)
    if document is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Document not found")

    job = await service.enqueue(document)
    await session.commit()
    try:
        process_ocr_job.delay(str(job.id), str(document.organization_id))
    except Exception:
        logger.exception("ocr enqueue failed")
    return OCRJobRead.from_job(job)


@router.get("/{document_id}/ocr", response_model=OCRJobRead)
async def get_ocr(
    document_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
) -> OCRJobRead:
    try:
        await authorize(session, current_user, "document.read")
    except NotAuthorizedError as exc:
        raise HTTPException(status.HTTP_403_FORBIDDEN, str(exc)) from exc

    service = _service(session)
    document = await service.get_document(document_id)
    if document is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Document not found")

    job = await service.latest_job(document_id)
    if job is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "OCR result not found")
    return OCRJobRead.from_job(job)
