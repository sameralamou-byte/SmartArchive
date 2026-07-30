#!/usr/bin/env bash
# Restores a PostgreSQL backup produced by backup_postgres.sh.
# WARNING: this drops and recreates the target database. Never run against
# production without a fresh backup taken immediately before.
# Usage: ./restore_postgres.sh <dump_file>
set -euo pipefail

DUMP_FILE="${1:?Usage: restore_postgres.sh <dump_file>}"

# shellcheck disable=SC1091
source .env 2>/dev/null || true

docker compose cp "$DUMP_FILE" postgres:/tmp/restore.dump

docker compose exec -T postgres psql -U "${POSTGRES_USER:-smartarchive}" -d postgres -c \
  "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${POSTGRES_DB:-smartarchive}' AND pid <> pg_backend_pid();"
docker compose exec -T postgres dropdb -U "${POSTGRES_USER:-smartarchive}" --if-exists "${POSTGRES_DB:-smartarchive}"
docker compose exec -T postgres createdb -U "${POSTGRES_USER:-smartarchive}" "${POSTGRES_DB:-smartarchive}"
docker compose exec -T postgres pg_restore -U "${POSTGRES_USER:-smartarchive}" -d "${POSTGRES_DB:-smartarchive}" /tmp/restore.dump
docker compose exec -T postgres rm -f /tmp/restore.dump

echo "Restore complete from $DUMP_FILE"
