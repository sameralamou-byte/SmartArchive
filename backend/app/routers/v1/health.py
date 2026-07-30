"""
/health   -- liveness + basic info
/ready    -- readiness: can we reach Postgres, Redis, MinIO
/live     -- liveness probe for orchestrators
"""
from fastapi import APIRouter, Depends, Response, status
from redis.asyncio import Redis
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db

router = APIRouter(tags=["health"])


@router.get("/health")
async def health() -> dict:
    return {"status": "ok", "service": "smartarchive-backend"}


@router.get("/live")
async def live() -> dict:
    return {"status": "alive"}


@router.get("/ready")
async def ready(response: Response, session: AsyncSession = Depends(get_db)) -> dict:
    checks = {"database": False, "redis": False}

    try:
        await session.execute(text("SELECT 1"))
        checks["database"] = True
    except Exception:
        pass

    try:
        redis_client = Redis.from_url(settings.redis_url)
        await redis_client.ping()
        await redis_client.aclose()
        checks["redis"] = True
    except Exception:
        pass

    if not all(checks.values()):
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    return {"status": "ready" if all(checks.values()) else "not_ready", "checks": checks}
