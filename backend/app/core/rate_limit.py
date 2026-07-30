"""
Redis-backed fixed-window rate limiter — Milestone 1.5 hardening.

Deliberately simple (fixed window, not sliding/token-bucket) for Phase 1.5:
it's enough to stop credential-stuffing and abusive polling without adding
a heavyweight dependency. Swap for slowapi's full strategy set or a proper
token bucket if traffic patterns demand it later.
"""
from collections.abc import Awaitable, Callable

from fastapi import Request, Response, status
from fastapi.responses import JSONResponse
from redis.asyncio import Redis

from app.core.config import settings

# path-prefix -> (max requests, window seconds). Auth endpoints are the
# highest-value target for brute-forcing, so they get the tightest limit.
RATE_LIMITS: dict[str, tuple[int, int]] = {
    "/api/v1/auth/login": (10, 60),
    "/api/v1/auth/register": (5, 60),
    "/api/v1/auth/refresh": (30, 60),
}
DEFAULT_LIMIT: tuple[int, int] = (120, 60)

_redis: Redis | None = None


def _get_redis() -> Redis:
    global _redis
    if _redis is None:
        _redis = Redis.from_url(settings.redis_url)
    return _redis


def _limit_for_path(path: str) -> tuple[int, int]:
    return RATE_LIMITS.get(path, DEFAULT_LIMIT)


async def rate_limit_middleware(
    request: Request, call_next: Callable[[Request], Awaitable[Response]]
) -> Response:
    client_ip = request.client.host if request.client else "unknown"
    max_requests, window_seconds = _limit_for_path(request.url.path)
    key = f"ratelimit:{request.url.path}:{client_ip}"

    try:
        redis_client = _get_redis()
        current = await redis_client.incr(key)
        if current == 1:
            await redis_client.expire(key, window_seconds)
        if current > max_requests:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={"detail": "Rate limit exceeded. Try again shortly."},
            )
    except Exception:
        # Redis unavailable -- fail open rather than blocking all traffic.
        # This is logged as a `ready` check failure separately.
        pass

    return await call_next(request)
