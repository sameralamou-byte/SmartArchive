"""Subscribe to document.uploaded — do not call OCR from the files router."""

import logging
import uuid

from app.core.database import _get_session_factory
from app.core.tenancy import set_tenant_context
from app.events.bus import Event
from app.ocr.factory import default_ocr_engine
from app.services.ocr_service import OCRService
from app.services.storage_service import StorageService
from app.tasks.ocr_tasks import process_ocr_job

logger = logging.getLogger("smartarchive.ocr")


async def enqueue_ocr_on_upload(event: Event) -> None:
    document_id = event.payload.get("document_id")
    if not document_id:
        return

    session_factory = _get_session_factory()
    async with session_factory() as session:
        await set_tenant_context(session, event.organization_id)
        service = OCRService(session, StorageService(), default_ocr_engine)
        document = await service.get_document(uuid.UUID(str(document_id)))
        if document is None:
            return
        job = await service.enqueue(document)
        await session.commit()
        try:
            process_ocr_job.delay(str(job.id), event.organization_id)
        except Exception:
            logger.exception("ocr enqueue failed")
