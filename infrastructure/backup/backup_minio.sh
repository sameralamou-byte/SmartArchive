#!/usr/bin/env bash
# Mirrors the MinIO bucket to a local directory using the `mc` client.
# Usage: ./backup_minio.sh [output_dir]
set -euo pipefail

OUTPUT_DIR="${1:-./backups/minio}"
mkdir -p "$OUTPUT_DIR"

# shellcheck disable=SC1091
source .env 2>/dev/null || true

docker run --rm --network smartarchive_default \
  -e MC_HOST_source="http://${MINIO_ROOT_USER:-smartarchive}:${MINIO_ROOT_PASSWORD:-smartarchive_dev_password}@minio:9000" \
  -v "$(pwd)/$OUTPUT_DIR:/backup" \
  minio/mc mirror source/smartarchive-documents /backup

echo "MinIO bucket mirrored to $OUTPUT_DIR"
