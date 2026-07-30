"""
Celery application. Wired to Redis as both broker and result backend.

Phase 1 only proves the pipeline works end to end (Docker networking,
Redis, worker process, beat scheduler) via a trivial heartbeat task —
see app/tasks/heartbeat.py. OCR/AI task queues are Stage 2.
"""
from celery import Celery

from app.core.config import settings

celery_app = Celery(
    "smartarchive",
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=["app.tasks.heartbeat"],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    beat_schedule={
        "heartbeat-every-minute": {
            "task": "app.tasks.heartbeat.heartbeat",
            "schedule": 60.0,
        },
    },
)
