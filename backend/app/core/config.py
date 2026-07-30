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

    # JWT
    jwt_secret_key: str = "change_me_in_production"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 15
    jwt_refresh_token_expire_days: int = 7

    # CORS -- Milestone 1.5: explicit allowlist instead of "*".
    # Comma-separated in the env var, e.g. "http://localhost:5173,https://app.smartarchive.io"
    cors_allowed_origins: str = "http://localhost:5173"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_allowed_origins.split(",") if origin.strip()]


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
