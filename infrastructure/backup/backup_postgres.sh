#!/usr/bin/env bash
# Backs up the PostgreSQL database from the running `postgres` container.
# Usage: ./backup_postgres.sh [output_dir]
set -euo pipefail

OUTPUT_DIR="${1:-./backups}"
mkdir -p "$OUTPUT_DIR"

TIMESTAMP=$(date -u +%Y%m%dT%H%M%SZ)
OUTPUT_FILE="$OUTPUT_DIR/smartarchive_postgres_${TIMESTAMP}.dump"

# shellcheck disable=SC1091
source .env 2>/dev/null || true

docker compose exec -T postgres pg_dump \
  -U "${POSTGRES_USER:-smartarchive}" \
  -d "${POSTGRES_DB:-smartarchive}" \
  -F custom -f "/tmp/backup.dump"

docker compose cp postgres:/tmp/backup.dump "$OUTPUT_FILE"
docker compose exec -T postgres rm -f /tmp/backup.dump

echo "Backup written to $OUTPUT_FILE"
