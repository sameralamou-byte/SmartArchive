"""Product auth configs. HSA and ESA are separate login systems, not a flag."""

from dataclasses import dataclass

from app.core.config import settings

HSA_ISSUER = "smartarchive-hsa"
ESA_ISSUER = "smartarchive-esa"
HSA_REFRESH_COOKIE = "sa_refresh"
ESA_REFRESH_COOKIE = "esa_refresh"
HSA_COOKIE_PATH = "/api/v1/auth"
ESA_COOKIE_PATH = "/api/v1/esa/auth"


@dataclass(frozen=True)
class ProductAuthConfig:
    product: str
    jwt_issuer: str
    jwt_secret: str
    refresh_cookie_name: str
    refresh_cookie_path: str
    session_refresh_secret: str
    password_reset_secret: str
    email_verification_secret: str
    public_app_origin: str
    verify_path: str
    reset_path: str
    brand: str


def hsa_auth_config() -> ProductAuthConfig:
    return ProductAuthConfig(
        product="hsa",
        jwt_issuer=settings.jwt_hsa_issuer,
        jwt_secret=settings.jwt_secret_key,
        refresh_cookie_name=HSA_REFRESH_COOKIE,
        refresh_cookie_path=HSA_COOKIE_PATH,
        session_refresh_secret=settings.session_refresh_secret,
        password_reset_secret=settings.password_reset_secret,
        email_verification_secret=settings.email_verification_secret,
        public_app_origin=settings.public_app_origin,
        verify_path="/verify-email",
        reset_path="/reset-password",
        brand="SmartArchive",
    )


def esa_auth_config() -> ProductAuthConfig:
    return ProductAuthConfig(
        product="esa",
        jwt_issuer=settings.jwt_esa_issuer,
        jwt_secret=settings.jwt_esa_secret_key,
        refresh_cookie_name=ESA_REFRESH_COOKIE,
        refresh_cookie_path=ESA_COOKIE_PATH,
        session_refresh_secret=settings.esa_session_refresh_secret,
        password_reset_secret=settings.esa_password_reset_secret,
        email_verification_secret=settings.esa_email_verification_secret,
        public_app_origin=settings.esa_public_app_origin,
        verify_path="/dev/founder-page-review/esa-website/verify-email",
        reset_path="/dev/founder-page-review/esa-website/reset-password",
        brand="SmartArchive ESA",
    )
