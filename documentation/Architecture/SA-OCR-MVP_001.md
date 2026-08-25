# SA-OCR-MVP-001 — Stage 2 OCR (first capability)

| Field | Value |
|---|---|
| Status | Implemented MVP — not multilingual quality validation |
| Date | 2026-08-24 |
| Engine | PaddleOCR (initial). Abstraction: `app.ocr.engine.OCREngine` |
| Languages configured | ar, en, de, es, fr, ru, uk |

## Pipeline

Document upload (existing `POST /api/v1/files`) stores the object in MinIO and emits `document.uploaded`. A subscriber enqueues an `ocr_jobs` row and a Celery task. The worker downloads the object, runs `OCREngine.recognize`, and persists extracted text on the same `ocr_jobs` row.

```
Upload → Document stored → OCRJob (queued/running/completed/failed)
       → OCREngine (PaddleOCR) → extracted text + optional page list
```

The files router is not OCR-aware. Swap the engine by changing `app.ocr.factory.default_ocr_engine`.

## API (authenticated, `document.read`, tenant RLS)

- `POST /api/v1/documents/{document_id}/ocr` — enqueue (202). Status `pending` until the worker runs.
- `GET /api/v1/documents/{document_id}/ocr` — latest job, including `extracted_text` when completed.

API status names: `pending` | `processing` | `completed` | `failed` (DB enum remains queued/running/completed/failed).

## Database

Migration `0005_ocr_job_result` adds result columns to existing `ocr_jobs`. Apply with Alembic against the environment database; do not point `TEST_DATABASE_URL` at the live SmartArchive development database.

## How to test

Unit tests (no Paddle download, no live DB):

```text
cd backend
pytest app/tests/test_ocr.py -q
```

Real engine sample (downloads Paddle models; optional):

```text
set RUN_PADDLE_OCR=1
pytest app/tests/test_ocr_paddle_optional.py -q
```

OpenAPI: `/docs` → paths `/api/v1/documents/{document_id}/ocr`.

## Limitations

- Language packs are configured; quality per language is **not** claimed until sample tests exist.
- PaddleOCR does not always return a detected language; `detected_language` is stored only when the engine provides it.
- Celery worker must be running for jobs to leave `pending`.
- Antivirus remains a stub from Phase 1.5.
- No list-documents API; GET OCR 404s if RLS hides the document (other tenant).
