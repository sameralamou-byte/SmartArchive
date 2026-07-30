#!/usr/bin/env bash
# Restores a local MinIO mirror (produced by backup_minio.sh) back into the bucket.
# Usage: ./restore_minio.sh <backup_dir>
set -euo pipefail

BACKUP_DIR="${1:?Usage: restore_minio.sh <backup_dir>}"

# shellcheck disable=SC1091
source .env 2>/dev/null || true

docker run --rm --network smartarchive_default \
  -e MC_HOST_target="http://${MINIO_ROOT_USER:-smartarchive}:${MINIO_ROOT_PASSWORD:-smartarchive_dev_password}@minio:9000" \
  -v "$(pwd)/$BACKUP_DIR:/backup" \
  minio/mc mirror /backup target/smartarchive-documents

echo "MinIO bucket restored from $BACKUP_DIR"
