"""SA-AUTH-002 Origin-only CSRF for cookie-authenticated auth endpoints."""
from fastapi import HTTPException, Request, status

from app.core.config import settings


def require_allowed_origin(request: Request) -> None:
    origin = request.headers.get("origin")
    if origin is None or origin not in settings.cors_origins_list:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Forbidden")
