from app.core.config import Settings
from app.security.password_policy import (
    missing_registration_password_requirements,
    require_password_policy,
)
from app.services.auth_exceptions import PasswordPolicyError


def test_password_policy_accepts_founder_compliant_value() -> None:
    assert missing_registration_password_requirements("A-strong-password-123") == []


def test_password_policy_reports_stable_keys_never_the_password() -> None:
    missing = missing_registration_password_requirements("short")
    assert missing == ["minLength", "uppercase", "number", "symbol"]
    assert all(key in {"minLength", "uppercase", "lowercase", "number", "symbol"} for key in missing)


def test_password_policy_rejects_missing_symbol() -> None:
    assert "symbol" in missing_registration_password_requirements("Abcdefg1")


def test_require_password_policy_raises_without_echoing_secret() -> None:
    try:
        require_password_policy("secret")
    except PasswordPolicyError as exc:
        assert "secret" not in exc.detail
        assert "minLength" in exc.missing or "uppercase" in exc.missing
    else:
        raise AssertionError("expected PasswordPolicyError")


def test_dev_email_auto_verify_is_fail_closed() -> None:
    production_shaped = Settings(
        environment="production",
        debug=True,
        dev_auto_verify_email=True,
        email_delivery_mode="smtp",
    )
    assert production_shaped.allows_dev_email_auto_verify() is False

    local_mock = Settings(
        environment="development",
        debug=True,
        dev_auto_verify_email=True,
        email_delivery_mode="memory",
    )
    assert local_mock.allows_dev_email_auto_verify() is True
