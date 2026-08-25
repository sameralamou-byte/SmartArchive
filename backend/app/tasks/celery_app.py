"""
Celery application. Wired to Redis as both broker and result backend.

Heartbeat remains. OCR jobs are processed by app.tasks.ocr_tasks.
"""
from celery import Celery

from app.core.config import settings

celery_app = Celery(
    "smartarchive",
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=["app.tasks.heartbeat", "app.tasks.ocr_tasks"],
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
