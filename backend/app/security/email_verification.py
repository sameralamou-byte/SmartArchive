"""Opaque verification tokens: raw value is never persisted; HMAC-SHA-256 hash is."""
import hmac
import secrets
from hashlib import sha256

from app.core.config import settings

TOKEN_BYTES = 32


def generate_raw_token() -> str:
    return secrets.token_urlsafe(TOKEN_BYTES)


def hash_token(raw_token: str, secret: str | None = None) -> bytes:
    key = (secret if secret is not None else settings.email_verification_secret).encode("utf-8")
    return hmac.new(key, raw_token.encode("utf-8"), sha256).digest()
