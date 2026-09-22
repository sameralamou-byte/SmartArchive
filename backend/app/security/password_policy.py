"""Founder password policy — one function, every password-setting flow.

Authoritative policy (Founder, 2026-09-15): length >= 8, at least one
uppercase letter, one lowercase letter, one number, and one special
symbol. Never returns or logs the password itself. Returned items are
stable requirement keys only.
"""

import re

from app.services.auth_exceptions import PasswordPolicyError

MIN_PASSWORD_LENGTH = 8

_UPPERCASE = re.compile(r"[A-Z]")
_LOWERCASE = re.compile(r"[a-z]")
_DIGIT = re.compile(r"\d")
_SPECIAL = re.compile(r"[^A-Za-z0-9]")

PASSWORD_REQUIREMENT_PHRASES = {
    "minLength": f"at least {MIN_PASSWORD_LENGTH} characters",
    "uppercase": "one uppercase letter",
    "lowercase": "one lowercase letter",
    "number": "one number",
    "symbol": "one symbol",
}


def missing_registration_password_requirements(password: str) -> list[str]:
    """Return which Founder password-policy rules this value fails."""
    value = password or ""
    missing: list[str] = []
    if len(value) < MIN_PASSWORD_LENGTH:
        missing.append("minLength")
    if _UPPERCASE.search(value) is None:
        missing.append("uppercase")
    if _LOWERCASE.search(value) is None:
        missing.append("lowercase")
    if _DIGIT.search(value) is None:
        missing.append("number")
    if _SPECIAL.search(value) is None:
        missing.append("symbol")
    return missing


def require_password_policy(password: str) -> None:
    """Raise PasswordPolicyError when password fails the Founder policy."""
    missing = missing_registration_password_requirements(password)
    if not missing:
        return
    phrases = [PASSWORD_REQUIREMENT_PHRASES[key] for key in missing]
    message = "password does not meet the required policy: " + ", ".join(phrases)
    raise PasswordPolicyError(message, missing=missing)
