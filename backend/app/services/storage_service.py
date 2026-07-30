"""
MinIO (S3-compatible) storage service.

Phase 1 scope only: upload / download / delete / versioning plumbing.
No OCR, no AI, no content inspection.
"""
import uuid
from datetime import timedelta
from io import BytesIO

from minio import Minio

from app.core.config import settings


class StorageService:
    def __init__(self) -> None:
        self._client = Minio(
            settings.minio_endpoint,
            access_key=settings.minio_root_user,
            secret_key=settings.minio_root_password,
            secure=settings.minio_use_ssl,
        )
        self._bucket = settings.minio_bucket
        self._ensure_bucket()

    def _ensure_bucket(self) -> None:
        if not self._client.bucket_exists(self._bucket):
            self._client.make_bucket(self._bucket)

    def build_storage_key(self, organization_id: uuid.UUID, filename: str) -> str:
        return f"{organization_id}/{uuid.uuid4()}/{filename}"

    def upload(self, storage_key: str, data: bytes, content_type: str) -> None:
        self._client.put_object(
            self._bucket,
            storage_key,
            BytesIO(data),
            length=len(data),
            content_type=content_type,
        )

    def download(self, storage_key: str) -> bytes:
        response = self._client.get_object(self._bucket, storage_key)
        try:
            return response.read()
        finally:
            response.close()
            response.release_conn()

    def delete(self, storage_key: str) -> None:
        self._client.remove_object(self._bucket, storage_key)

    def presigned_download_url(self, storage_key: str, expires_minutes: int = 15) -> str:
        return self._client.presigned_get_object(
            self._bucket, storage_key, expires=timedelta(minutes=expires_minutes)
        )
