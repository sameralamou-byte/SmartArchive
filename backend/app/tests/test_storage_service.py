"""
Unit tests for StorageService using a mocked MinIO client -- no real MinIO
required. Storage_service's own bucket-existence check is also mocked so
this test never touches the network.
"""
import uuid
from unittest.mock import MagicMock, patch

from app.services.storage_service import StorageService


@patch("app.services.storage_service.Minio")
def test_ensure_bucket_creates_when_missing(mock_minio_cls):
    mock_client = MagicMock()
    mock_client.bucket_exists.return_value = False
    mock_minio_cls.return_value = mock_client

    StorageService()

    mock_client.bucket_exists.assert_called_once()
    mock_client.make_bucket.assert_called_once()


@patch("app.services.storage_service.Minio")
def test_ensure_bucket_skips_creation_when_present(mock_minio_cls):
    mock_client = MagicMock()
    mock_client.bucket_exists.return_value = True
    mock_minio_cls.return_value = mock_client

    StorageService()

    mock_client.make_bucket.assert_not_called()


@patch("app.services.storage_service.Minio")
def test_build_storage_key_includes_org_and_filename(mock_minio_cls):
    mock_client = MagicMock()
    mock_client.bucket_exists.return_value = True
    mock_minio_cls.return_value = mock_client

    service = StorageService()
    org_id = uuid.uuid4()
    key = service.build_storage_key(org_id, "invoice.pdf")

    assert key.startswith(str(org_id))
    assert key.endswith("invoice.pdf")


@patch("app.services.storage_service.Minio")
def test_upload_calls_put_object_with_correct_args(mock_minio_cls):
    mock_client = MagicMock()
    mock_client.bucket_exists.return_value = True
    mock_minio_cls.return_value = mock_client

    service = StorageService()
    service.upload("some/key.pdf", b"file bytes", "application/pdf")

    args, kwargs = mock_client.put_object.call_args
    assert args[0] == service._bucket
    assert args[1] == "some/key.pdf"
    assert kwargs["content_type"] == "application/pdf"


@patch("app.services.storage_service.Minio")
def test_delete_calls_remove_object(mock_minio_cls):
    mock_client = MagicMock()
    mock_client.bucket_exists.return_value = True
    mock_minio_cls.return_value = mock_client

    service = StorageService()
    service.delete("some/key.pdf")

    mock_client.remove_object.assert_called_once_with(service._bucket, "some/key.pdf")
