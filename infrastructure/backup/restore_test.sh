#!/usr/bin/env bash
# Verifies that backups are actually restorable -- not just that the backup
# command exits 0. Run this periodically (e.g. weekly via CI/cron), not just
# once at setup time; an untested backup is not a backup.
#
# Flow: take a fresh backup -> note the row count of a stable table
# (organizations) -> restore that same backup -> compare row counts.
set -euo pipefail

echo "1/4 -- Taking a fresh backup..."
./backup_postgres.sh ./backups/restore_test

DUMP_FILE=$(ls -t ./backups/restore_test/*.dump | head -n1)

echo "2/4 -- Recording pre-restore row count..."
# shellcheck disable=SC1091
source .env 2>/dev/null || true
BEFORE=$(docker compose exec -T postgres psql -U "${POSTGRES_USER:-smartarchive}" -d "${POSTGRES_DB:-smartarchive}" -tAc "SELECT count(*) FROM organizations;")

echo "3/4 -- Restoring $DUMP_FILE ..."
./restore_postgres.sh "$DUMP_FILE"

echo "4/4 -- Verifying row count after restore..."
AFTER=$(docker compose exec -T postgres psql -U "${POSTGRES_USER:-smartarchive}" -d "${POSTGRES_DB:-smartarchive}" -tAc "SELECT count(*) FROM organizations;")

if [ "$BEFORE" != "$AFTER" ]; then
  echo "RESTORE TEST FAILED: row count before ($BEFORE) != after ($AFTER)"
  exit 1
fi

echo "RESTORE TEST PASSED: organizations row count unchanged ($AFTER)"
