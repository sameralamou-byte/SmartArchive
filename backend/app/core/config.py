"""
Centralized application settings.
Loaded from environment variables (see .env.example at repo root).
"""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    environment: str = "development"
    log_level: str = "INFO"
    debug: bool = False
    dev_auto_verify_email: bool = False

    # Postgres
    postgres_user: str = "smartarchive"
    postgres_password: str = "smartarchive_dev_password"
    postgres_db: str = "smartarchive"
    postgres_host: str = "postgres"
    postgres_port: int = 5432

    # Redis
    redis_host: str = "redis"
    redis_port: int = 6379

    # MinIO
    minio_endpoint: str = "minio:9000"
    minio_root_user: str = "smartarchive"
    minio_root_password: str = "smartarchive_dev_password"
    minio_bucket: str = "smartarchive-documents"
    minio_use_ssl: bool = False

    # JWT — HSA uses jwt_secret_key; ESA uses a dedicated secret and issuer.
    jwt_secret_key: str = "change_me_in_production"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 15
    jwt_refresh_token_expire_days: int = 7
    jwt_hsa_issuer: str = "smartarchive-hsa"
    jwt_esa_issuer: str = "smartarchive-esa"
    jwt_esa_secret_key: str = "change_esa_jwt_in_production"

    # CORS -- Milestone 1.5: explicit allowlist instead of "*".
    # Comma-separated in the env var, e.g. "http://localhost:5173,https://app.smartarchive.io"
    cors_allowed_origins: str = "http://localhost:5173,http://localhost:5174"

    # SA-AUTH-001 email verification (EMAIL_DELIVERY_MODE: log | smtp | memory)
    public_app_origin: str = "http://localhost:5174"
    esa_public_app_origin: str = "http://localhost:5174"
    email_from: str = "smartarchive@localhost"
    email_delivery_mode: str = "log"
    email_verification_secret: str = "change_email_verification_secret"
    password_reset_secret: str = "change_password_reset_secret"
    session_refresh_secret: str = "change_session_refresh_secret"
    esa_email_verification_secret: str = "change_esa_email_verification_secret"
    esa_password_reset_secret: str = "change_esa_password_reset_secret"
    esa_session_refresh_secret: str = "change_esa_session_refresh_secret"
    smtp_host: str = "localhost"
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_use_tls: bool = True

    # Stage 2 OCR MVP — product languages, not engine quality claims.
    ocr_supported_languages: str = "ar,en,de,es,fr,ru,uk"
    ocr_enqueue_on_upload: bool = True

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_allowed_origins.split(",") if origin.strip()]

    def allows_dev_email_auto_verify(self) -> bool:
        """Fail-closed local bypass. All three must be true; production-shaped settings never pass."""
        env = self.environment.lower()
        mailer = self.email_delivery_mode.lower()
        return (
            self.dev_auto_verify_email
            and env in {"development", "dev", "local"}
            and self.debug is True
            and mailer in {"memory", "log"}
        )


    @property
    def database_url(self) -> str:
        return (
            f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    @property
    def redis_url(self) -> str:
        return f"redis://{self.redis_host}:{self.redis_port}/0"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
