"""
Trivial task validating: Docker networking, Redis, Celery worker, task
queue, and Celery Beat scheduling — all before any real workload
(OCR/AI) is introduced.
"""
import logging
from datetime import UTC, datetime

from app.tasks.celery_app import celery_app

logger = logging.getLogger("smartarchive.celery")


@celery_app.task(name="app.tasks.heartbeat.heartbeat")
def heartbeat() -> str:
    message = f"Worker healthy at {datetime.now(UTC).isoformat()}"
    logger.info(message)
    return message
