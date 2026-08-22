# Backup & restore — Milestone 1.5

See [../DR_RUNBOOK.md](../DR_RUNBOOK.md) for the RTO/RPO targets and drill
cadence these scripts exist to satisfy — this README covers the mechanics,
that document covers the policy.

Run these from the repository root (they assume `docker compose` is up and
`.env` is present).

| Script | Purpose |
|---|---|
| `backup_postgres.sh [dir]` | `pg_dump` (custom format) copied out of the container |
| `restore_postgres.sh <dump>` | Drops, recreates, and restores the database from a dump |
| `backup_minio.sh [dir]` | Mirrors the document bucket to a local directory |
| `restore_minio.sh <dir>` | Mirrors a local backup directory back into the bucket |
| `restore_test.sh` | **Run this regularly.** Backs up, restores, and verifies row counts match — an untested backup is not a backup |

Even in development, run `restore_test.sh` after any schema change to catch
restore failures early rather than discovering them during a real incident.
