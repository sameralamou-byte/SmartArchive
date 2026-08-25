"""
SmartArchive backend entrypoint.

Milestone 1: core skeleton, no business features.
Milestone 1.5: production-hardening middleware stack added below (security
headers, rate limiting, metrics) — still no OCR/AI/connectors. See README
and documentation/adr/ for the reasoning behind each addition.
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.exceptions import EmailNotVerifiedError
from app.core.logging import configure_logging, logging_middleware
from app.core.metrics import metrics_endpoint, metrics_middleware
from app.core.rate_limit import rate_limit_middleware
from app.core.security_headers import security_headers_middleware
from app.routers.v1.router import api_router

configure_logging()

app = FastAPI(
    title="SmartArchive AI Platform",
    description="Enterprise AI Document Intelligence Platform — API",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Order matters: outermost-registered runs first on the request, last on the
# response. Security headers should wrap everything; rate limiting should
# reject abusive traffic before it reaches business logic; metrics/logging
# should observe the full request lifecycle.
app.middleware("http")(security_headers_middleware)
app.middleware("http")(rate_limit_middleware)
app.middleware("http")(metrics_middleware)
app.middleware("http")(logging_middleware)

app.include_router(api_router, prefix="/api/v1")

if settings.ocr_enqueue_on_upload:
    from app.events.bus import event_bus
    from app.events.document_events import DOCUMENT_UPLOADED
    from app.events.ocr_handlers import enqueue_ocr_on_upload

    event_bus.subscribe(DOCUMENT_UPLOADED, enqueue_ocr_on_upload)


@app.exception_handler(EmailNotVerifiedError)
async def email_not_verified_handler(_request: Request, exc: EmailNotVerifiedError) -> JSONResponse:
    return JSONResponse(
        status_code=403,
        content={"detail": exc.message, "code": "email_not_verified"},
    )


@app.get("/metrics", include_in_schema=False)
def metrics():
    return metrics_endpoint()
