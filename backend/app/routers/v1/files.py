"""
File upload/download/delete endpoints — Milestone 1.5.

Phase 1 defined the storage plumbing (app/services/storage_service.py) but
had no route exercising it end to end. This wires validation (size, MIME,
antivirus hook), MinIO storage, the documents table, an audit log entry, and
a domain event -- with no OCR/AI processing, per the Phase 1 scope.
"""
import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.upload_validation import UploadValidationError, antivirus_scan_hook, validate_upload
from app.events.bus import Event, event_bus
from app.events.document_events import DOCUMENT_UPLOADED
from app.models.audit_log import AuditLog
from app.models.document import Document
from app.models.user import User
from app.schemas.document import DocumentRead
from app.security.authorize import NotAuthorizedError, authorize
from app.services.storage_service import StorageService

router = APIRouter(prefix="/files", tags=["files"])

_storage = StorageService()


@router.post("", response_model=DocumentRead, status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
) -> DocumentRead:
    try:
        await authorize(session, current_user, "document.create")
    except NotAuthorizedError as exc:
        raise HTTPException(status.HTTP_403_FORBIDDEN, str(exc)) from exc

    data = await file.read()
    try:
        result = validate_upload(data, file.content_type or "application/octet-stream")
    except UploadValidationError as exc:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, str(exc)) from exc

    if not antivirus_scan_hook(data):
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "File failed antivirus scan")

    storage_key = _storage.build_storage_key(current_user.organization_id, file.filename)
    _storage.upload(storage_key, data, result.detected_mime_type)

    document = Document(
        title=file.filename,
        original_filename=file.filename,
        mime_type=result.detected_mime_type,
        size_bytes=len(data),
        storage_key=storage_key,
        organization_id=current_user.organization_id,
        owner_id=current_user.id,
    )
    session.add(document)
    await session.flush()

    session.add(
        AuditLog(
            organization_id=current_user.organization_id,
            actor_user_id=current_user.id,
            action="document.create",
            resource_type="document",
            resource_id=str(document.id),
        )
    )
    await session.commit()

    await event_bus.publish(
        Event(
            name=DOCUMENT_UPLOADED,
            organization_id=str(current_user.organization_id),
            payload={"document_id": str(document.id)},
        )
    )

    return DocumentRead.model_validate(document)


@router.get("/{document_id}/download-url")
async def get_download_url(
    document_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
) -> dict:
    from sqlalchemy import select

    try:
        await authorize(session, current_user, "document.read")
    except NotAuthorizedError as exc:
        raise HTTPException(status.HTTP_403_FORBIDDEN, str(exc)) from exc

    stmt = select(Document).where(Document.id == document_id)
    result = await session.execute(stmt)
    document = result.scalar_one_or_none()
    if document is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Document not found")

    return {"url": _storage.presigned_download_url(document.storage_key)}


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_file(
    document_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
) -> None:
    from sqlalchemy import select

    try:
        await authorize(session, current_user, "document.delete")
    except NotAuthorizedError as exc:
        raise HTTPException(status.HTTP_403_FORBIDDEN, str(exc)) from exc

    stmt = select(Document).where(Document.id == document_id)
    result = await session.execute(stmt)
    document = result.scalar_one_or_none()
    if document is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Document not found")

    _storage.delete(document.storage_key)
    await session.delete(document)
    session.add(
        AuditLog(
            organization_id=current_user.organization_id,
            actor_user_id=current_user.id,
            action="document.delete",
            resource_type="document",
            resource_id=str(document_id),
        )
    )
    await session.commit()

    from app.events.document_events import DOCUMENT_DELETED

    await event_bus.publish(
        Event(
            name=DOCUMENT_DELETED,
            organization_id=str(current_user.organization_id),
            payload={"document_id": str(document_id)},
        )
    )
