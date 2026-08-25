"""Focused OCR unit tests. No live database. No Paddle model download."""

import uuid
from datetime import UTC, datetime
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient

from app.core.dependencies import get_current_user
from app.core.database import get_db
from app.models.document import Document, DocumentStatus
from app.models.ocr_job import JobStatus, OCRJob
from app.models.user import User
from app.ocr.languages import OCR_PRODUCT_LANGUAGES, paddle_lang_codes
from app.ocr.paddle_engine import _parse_paddle_output
from app.ocr.types import (
    EmptyOCRResultError,
    OCREngineError,
    OCREngineResult,
    OCRPageResult,
    UnsupportedOCRInputError,
)
from app.routers.v1 import ocr as ocr_router
from app.schemas.ocr import OCRJobRead
from app.security.authorize import NotAuthorizedError
from app.services.ocr_service import OCRService

TINY_PNG = (
    b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
    b"\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\xcf\xc0"
    b"\x00\x00\x00\x03\x00\x01\x00\x05\xfe\xd4\xef\x00\x00\x00\x00IEND\xaeB`\x82"
)


class FakeEngine:
    name = "fake"

    def __init__(self, result: OCREngineResult | None = None, error: Exception | None = None) -> None:
        self._result = result
        self._error = error
        self.version = "test"

    def recognize(self, data: bytes, mime_type: str) -> OCREngineResult:
        if self._error:
            raise self._error
        assert self._result is not None
        return self._result


class FakeStorage:
    def __init__(self, payload: bytes | None = TINY_PNG, error: Exception | None = None) -> None:
        self._payload = payload
        self._error = error

    def download(self, storage_key: str) -> bytes:
        if self._error:
            raise self._error
        if self._payload is None:
            raise FileNotFoundError(storage_key)
        return self._payload


def _document(*, mime: str = "image/png") -> Document:
    return Document(
        id=uuid.uuid4(),
        organization_id=uuid.uuid4(),
        title="sample.png",
        original_filename="sample.png",
        mime_type=mime,
        size_bytes=32,
        storage_key="org/key/sample.png",
        owner_id=uuid.uuid4(),
        status=DocumentStatus.uploaded,
    )


def _job(document: Document, *, status: JobStatus = JobStatus.queued) -> OCRJob:
    now = datetime.now(UTC)
    return OCRJob(
        id=uuid.uuid4(),
        organization_id=document.organization_id,
        document_id=document.id,
        status=status,
        created_at=now,
        updated_at=now,
    )


def _success_result(*, pages: int = 1) -> OCREngineResult:
    page_results = tuple(
        OCRPageResult(page_number=i, text=f"page {i} hello", confidence=0.91) for i in range(1, pages + 1)
    )
    return OCREngineResult(
        pages=page_results,
        engine_name="fake",
        engine_version="test",
        detected_language=None,
        paddle_lang_used="en",
    )


def test_product_languages_are_explicit():
    assert OCR_PRODUCT_LANGUAGES == ("ar", "en", "de", "es", "fr", "ru", "uk")
    codes = paddle_lang_codes()
    assert "arabic" in codes
    assert "cyrillic" in codes
    assert "german" in codes
    assert "french" in codes
    assert "latin" in codes
    assert "en" in codes


def test_parse_paddle_output_does_not_invent_confidence():
    text, score = _parse_paddle_output({"rec_texts": ["Hello"], "rec_scores": None})
    assert text == "Hello"
    assert score is None


def test_parse_paddle_output_uses_engine_scores():
    text, score = _parse_paddle_output({"rec_texts": ["A", "B"], "rec_scores": [0.5, 1.0]})
    assert "A" in text and "B" in text
    assert score == pytest.approx(0.75)


@pytest.mark.asyncio
async def test_ocr_success_persists_text_and_pages():
    document = _document()
    job = _job(document)
    engine = FakeEngine(_success_result(pages=2))
    service = OCRService(MagicMock(), FakeStorage(), lambda: engine)
    service.get_job = AsyncMock(return_value=job)
    service.get_document = AsyncMock(return_value=document)

    result = await service.process_job(job.id)

    assert result.status is JobStatus.completed
    assert result.extracted_text == "page 1 hello\n\npage 2 hello"
    assert result.pages_json is not None
    assert len(result.pages_json) == 2
    assert result.mean_confidence == pytest.approx(0.91)
    assert document.status is DocumentStatus.ready
    assert result.error_message is None


@pytest.mark.asyncio
async def test_ocr_image_and_pdf_mime_supported():
    for mime in ("image/png", "image/jpeg", "application/pdf"):
        document = _document(mime=mime)
        job = _job(document)
        service = OCRService(MagicMock(), FakeStorage(), lambda: FakeEngine(_success_result()))
        service.get_job = AsyncMock(return_value=job)
        service.get_document = AsyncMock(return_value=document)
        result = await service.process_job(job.id)
        assert result.status is JobStatus.completed


@pytest.mark.asyncio
async def test_ocr_unsupported_file():
    document = _document(mime="application/zip")
    job = _job(document)
    service = OCRService(MagicMock(), FakeStorage(), lambda: FakeEngine(_success_result()))
    service.get_job = AsyncMock(return_value=job)
    service.get_document = AsyncMock(return_value=document)
    result = await service.process_job(job.id)
    assert result.status is JobStatus.failed
    assert result.error_message == "unsupported file"
    assert document.status is DocumentStatus.failed


@pytest.mark.asyncio
async def test_ocr_engine_failure():
    document = _document()
    job = _job(document)
    service = OCRService(
        MagicMock(), FakeStorage(), lambda: FakeEngine(error=OCREngineError("OCR engine failed"))
    )
    service.get_job = AsyncMock(return_value=job)
    service.get_document = AsyncMock(return_value=document)
    result = await service.process_job(job.id)
    assert result.status is JobStatus.failed
    assert result.error_message == "OCR engine failure"


@pytest.mark.asyncio
async def test_ocr_empty_result():
    document = _document()
    job = _job(document)
    service = OCRService(
        MagicMock(), FakeStorage(), lambda: FakeEngine(error=EmptyOCRResultError("empty OCR result"))
    )
    service.get_job = AsyncMock(return_value=job)
    service.get_document = AsyncMock(return_value=document)
    result = await service.process_job(job.id)
    assert result.status is JobStatus.failed
    assert result.error_message == "empty OCR result"


@pytest.mark.asyncio
async def test_ocr_missing_stored_object():
    document = _document()
    job = _job(document)
    service = OCRService(MagicMock(), FakeStorage(error=RuntimeError("no object")), lambda: FakeEngine(_success_result()))
    service.get_job = AsyncMock(return_value=job)
    service.get_document = AsyncMock(return_value=document)
    result = await service.process_job(job.id)
    assert result.status is JobStatus.failed
    assert result.error_message == "missing stored object"


@pytest.mark.asyncio
async def test_ocr_corrupted_file():
    document = _document()
    job = _job(document)
    from app.ocr.types import CorruptedOCRInputError

    service = OCRService(
        MagicMock(), FakeStorage(), lambda: FakeEngine(error=CorruptedOCRInputError("bad"))
    )
    service.get_job = AsyncMock(return_value=job)
    service.get_document = AsyncMock(return_value=document)
    result = await service.process_job(job.id)
    assert result.status is JobStatus.failed
    assert result.error_message == "corrupted file"


def test_api_status_mapping():
    document = _document()
    job = _job(document, status=JobStatus.queued)
    job.extracted_text = None
    payload = OCRJobRead.from_job(job)
    assert payload.status == "pending"
    job.status = JobStatus.running
    assert OCRJobRead.from_job(job).status == "processing"


def _user() -> User:
    return User(
        id=uuid.uuid4(),
        organization_id=uuid.uuid4(),
        email="ocr@example.com",
        hashed_password="x",
        full_name="OCR User",
        is_active=True,
        is_superuser=True,
        role_id=uuid.uuid4(),
        account_id=uuid.uuid4(),
    )


@pytest.mark.asyncio
async def test_ocr_openapi_paths_exist():
    from app.main import app

    paths = app.openapi()["paths"]
    assert "/api/v1/documents/{document_id}/ocr" in paths
    assert "get" in paths["/api/v1/documents/{document_id}/ocr"]
    assert "post" in paths["/api/v1/documents/{document_id}/ocr"]


@pytest.mark.asyncio
async def test_ocr_get_requires_auth():
    transport = ASGITransport(app=ocr_router.router)
    # Router without auth dependency injection of main app — mount on temp app.
    app = FastAPI()
    app.include_router(ocr_router.router, prefix="/api/v1")
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get(f"/api/v1/documents/{uuid.uuid4()}/ocr")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_ocr_forbidden_when_authorize_denies():
    user = _user()
    user.is_superuser = False
    user.role_id = None
    app = FastAPI()
    app.include_router(ocr_router.router, prefix="/api/v1")

    async def override_user():
        return user

    async def override_db():
        yield MagicMock()

    app.dependency_overrides[get_current_user] = override_user
    app.dependency_overrides[get_db] = override_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get(f"/api/v1/documents/{uuid.uuid4()}/ocr")
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_ocr_get_success_and_trigger(monkeypatch):
    user = _user()
    document = _document()
    document.organization_id = user.organization_id
    job = _job(document, status=JobStatus.completed)
    job.extracted_text = "hello archive"
    job.pages_json = [{"page_number": 1, "text": "hello archive", "confidence": 0.9}]

    session = MagicMock()
    session.commit = AsyncMock()

    app = FastAPI()
    app.include_router(ocr_router.router, prefix="/api/v1")

    async def override_user():
        return user

    async def override_db():
        yield session

    app.dependency_overrides[get_current_user] = override_user
    app.dependency_overrides[get_db] = override_db

    fake_service = MagicMock()
    fake_service.get_document = AsyncMock(return_value=document)
    fake_service.latest_job = AsyncMock(return_value=job)
    fake_service.enqueue = AsyncMock(return_value=job)

    monkeypatch.setattr(ocr_router, "_service", lambda _session: fake_service)
    monkeypatch.setattr(ocr_router, "authorize", AsyncMock())
    monkeypatch.setattr(ocr_router.process_ocr_job, "delay", MagicMock())

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        got = await client.get(f"/api/v1/documents/{document.id}/ocr")
        posted = await client.post(f"/api/v1/documents/{document.id}/ocr")
    assert got.status_code == 200
    assert got.json()["extracted_text"] == "hello archive"
    assert got.json()["status"] == "completed"
    assert posted.status_code == 202


@pytest.mark.asyncio
async def test_ocr_cross_tenant_document_not_found():
    """RLS/session query returns no document for another tenant."""
    user = _user()
    session = MagicMock()
    app = FastAPI()
    app.include_router(ocr_router.router, prefix="/api/v1")

    async def override_user():
        return user

    async def override_db():
        yield session

    app.dependency_overrides[get_current_user] = override_user
    app.dependency_overrides[get_db] = override_db
    fake_service = MagicMock()
    fake_service.get_document = AsyncMock(return_value=None)
    with patch.object(ocr_router, "_service", lambda _session: fake_service), patch.object(
        ocr_router, "authorize", AsyncMock()
    ):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.get(f"/api/v1/documents/{uuid.uuid4()}/ocr")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_unsupported_engine_input_maps():
    document = _document()
    job = _job(document)
    service = OCRService(
        MagicMock(),
        FakeStorage(),
        lambda: FakeEngine(error=UnsupportedOCRInputError("nope")),
    )
    service.get_job = AsyncMock(return_value=job)
    service.get_document = AsyncMock(return_value=document)
    result = await service.process_job(job.id)
    assert result.error_message == "unsupported file"
