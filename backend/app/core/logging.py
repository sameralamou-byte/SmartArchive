"""Centralized structured logging — every request, every error, every upload."""
import logging
import time

import structlog
from fastapi import Request

from app.core.config import settings
from app.core.request_context import (
    CORRELATION_ID_HEADER,
    REQUEST_ID_HEADER,
    correlation_id_ctx,
    new_request_id,
    request_id_ctx,
)


def configure_logging() -> None:
    logging.basicConfig(level=settings.log_level)
    structlog.configure(
        processors=[
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.add_log_level,
            structlog.processors.JSONRenderer(),
        ],
    )


logger = structlog.get_logger("smartarchive")


async def logging_middleware(request: Request, call_next):
    request_id = new_request_id()
    correlation_id = request.headers.get(CORRELATION_ID_HEADER, request_id)
    request_id_ctx.set(request_id)
    correlation_id_ctx.set(correlation_id)

    start = time.perf_counter()
    response = None
    try:
        response = await call_next(request)
        return response
    finally:
        duration_ms = round((time.perf_counter() - start) * 1000, 2)
        logger.info(
            "request",
            request_id=request_id,
            correlation_id=correlation_id,
            method=request.method,
            path=request.url.path,
            status_code=getattr(response, "status_code", 500),
            duration_ms=duration_ms,
        )
        if response is not None:
            response.headers[REQUEST_ID_HEADER] = request_id
            response.headers[CORRELATION_ID_HEADER] = correlation_id
