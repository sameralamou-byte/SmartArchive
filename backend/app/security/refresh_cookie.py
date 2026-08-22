"""HttpOnly sa_refresh cookie helpers. Path-scoped to /api/v1/auth."""
from datetime import timedelta

from fastapi import Response

REFRESH_COOKIE_NAME = "sa_refresh"
REFRESH_COOKIE_PATH = "/api/v1/auth"
PERSISTENT_MAX_AGE = int(timedelta(days=7).total_seconds())


def set_refresh_cookie(response: Response, raw_secret: str, remember_me: bool) -> None:
    kwargs: dict = {
        "key": REFRESH_COOKIE_NAME,
        "value": raw_secret,
        "httponly": True,
        "secure": True,
        "samesite": "none",
        "path": REFRESH_COOKIE_PATH,
    }
    if remember_me:
        kwargs["max_age"] = PERSISTENT_MAX_AGE
    response.set_cookie(**kwargs)


def clear_refresh_cookie(response: Response) -> None:
    response.delete_cookie(
        key=REFRESH_COOKIE_NAME,
        path=REFRESH_COOKIE_PATH,
        secure=True,
        httponly=True,
        samesite="none",
    )
