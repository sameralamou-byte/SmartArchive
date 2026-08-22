"""
Redis-backed fixed-window rate limiter — Milestone 1.5 hardening.

Deliberately simple (fixed window, not sliding/token-bucket) for Phase 1.5:
it's enough to stop credential-stuffing and abusive polling without adding
a heavyweight dependency. Swap for slowapi's full strategy set or a proper
token bucket if traffic patterns demand it later.
"""
import asyncio
import hashlib
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
    "/api/v1/auth/verify-email": (20, 60),
    "/api/v1/auth/reset-password": (10, 60),
    "/api/v1/auth/change-password": (10, 60),
}
DEFAULT_LIMIT: tuple[int, int] = (120, 60)
RESEND_PATH = "/api/v1/auth/resend-verification"
FORGOT_PATH = "/api/v1/auth/forgot-password"
RESEND_ACCEPTED_DETAIL = "If this email can be confirmed, a new message is on its way."
FORGOT_ACCEPTED_DETAIL = "If this email can be reset, a message is on its way."
RESEND_EMAIL_LIMIT = (3, 15 * 60)
RESEND_IP_LIMIT = (5, 60)
FORGOT_EMAIL_LIMIT = (3, 15 * 60)
FORGOT_IP_LIMIT = (5, 60)

_redis: Redis | None = None
_redis_loop: asyncio.AbstractEventLoop | None = None


def _get_redis() -> Redis:
    """
    Cache the Redis client per-event-loop, not just once ever. In production
    (a single uvicorn process with one persistent loop) this is a plain
    singleton, same as before. But a client created on one loop breaks if
    reused after that loop closes -- which happens under pytest, where each
    test can run on its own loop even with the same asyncio_mode config.
    Detecting the loop change here fixes it in the code itself rather than
    depending on getting test-runner configuration exactly right.
    """
    global _redis, _redis_loop
    current_loop = asyncio.get_running_loop()
    if _redis is None or _redis_loop is not current_loop:
        _redis = Redis.from_url(settings.redis_url)
        _redis_loop = current_loop
    return _redis


def _limit_for_path(path: str) -> tuple[int, int]:
    return RATE_LIMITS.get(path, DEFAULT_LIMIT)


async def rate_limit_middleware(
    request: Request, call_next: Callable[[Request], Awaitable[Response]]
) -> Response:
    # SA-AUTH-001 C5 / SA-AUTH-002: these paths never return a client-visible 429.
    normalized = request.url.path.rstrip("/")
    if normalized in {RESEND_PATH.rstrip("/"), FORGOT_PATH.rstrip("/")}:
        return await call_next(request)

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


async def resend_should_suppress(email: str, client_ip: str) -> bool:
    """Increment resend limiters for every well-formed email. True = do not send.

    Never raises a client-visible 429. Redis failure fails open (allow send).
    """
    return await _email_ip_should_suppress(
        email,
        client_ip,
        RESEND_PATH,
        RESEND_EMAIL_LIMIT,
        RESEND_IP_LIMIT,
    )


async def forgot_password_should_suppress(email: str, client_ip: str) -> bool:
    """Increment forgot-password limiters before Account lookup. True = do not send.

    Never raises a client-visible 429. Redis failure fails open (allow send).
    """
    return await _email_ip_should_suppress(
        email,
        client_ip,
        FORGOT_PATH,
        FORGOT_EMAIL_LIMIT,
        FORGOT_IP_LIMIT,
    )


async def _email_ip_should_suppress(
    email: str,
    client_ip: str,
    path: str,
    email_limit: tuple[int, int],
    ip_limit: tuple[int, int],
) -> bool:
    try:
        redis_client = _get_redis()
        normalized = email.strip().lower().encode("utf-8")
        digest = hashlib.sha256(normalized).hexdigest()
        email_key = f"ratelimit:{path}:email:{digest}"
        ip_key = f"ratelimit:{path}:ip:{client_ip}"
        email_max, email_window = email_limit
        ip_max, ip_window = ip_limit

        email_count = await redis_client.incr(email_key)
        if email_count == 1:
            await redis_client.expire(email_key, email_window)
        ip_count = await redis_client.incr(ip_key)
        if ip_count == 1:
            await redis_client.expire(ip_key, ip_window)
        return email_count > email_max or ip_count > ip_max
    except Exception:
        return False
