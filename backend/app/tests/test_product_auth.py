from app.auth.product import esa_auth_config, hsa_auth_config
from app.core.config import settings


def test_hsa_and_esa_auth_configs_stay_separate() -> None:
    hsa = hsa_auth_config()
    esa = esa_auth_config()

    assert hsa.product == "hsa"
    assert esa.product == "esa"
    assert hsa.jwt_issuer == settings.jwt_hsa_issuer == "smartarchive-hsa"
    assert esa.jwt_issuer == settings.jwt_esa_issuer == "smartarchive-esa"
    assert hsa.jwt_secret != esa.jwt_secret
    assert hsa.refresh_cookie_name == "sa_refresh"
    assert esa.refresh_cookie_name == "esa_refresh"
    assert hsa.refresh_cookie_path == "/api/v1/auth"
    assert esa.refresh_cookie_path == "/api/v1/esa/auth"
    assert hsa.email_verification_secret != esa.email_verification_secret
    assert hsa.session_refresh_secret != esa.session_refresh_secret
    assert hsa.password_reset_secret != esa.password_reset_secret
