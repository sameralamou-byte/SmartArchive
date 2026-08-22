# Disaster Recovery Runbook

Milestone 1.5. One page, intentionally — the backup/restore *mechanism* already exists and is verified (`infrastructure/backup/restore_test.sh`); this document is the *policy* around it: what we're protecting against, how fast we commit to recovering, and how often we prove it still works.

## Scope

Covers the two stateful services with data an incident could actually lose: **PostgreSQL** (all relational data — tenants, users, documents metadata, audit logs) and **MinIO** (document binaries). Redis is not in scope — it holds only rate-limit counters and the Celery broker queue, both safely reconstructible with no data loss.

## Targets

| Metric | Target | Why |
|---|---|---|
| **RPO** (Recovery Point Objective — how much data we can afford to lose) | 24 hours | Matches a daily backup cadence; acceptable for the current pre-production stage. Must be revisited before any pilot customer with real documents is onboarded — see [SA-ROADMAP-001](../documentation/SA-ROADMAP-001_Architecture_Roadmap.md) Wave 2 (`B4`/`B5`). |
| **RTO** (Recovery Time Objective — how long we're down) | 4 hours | Based on `restore_postgres.sh` + `restore_minio.sh` running against a fresh Docker Compose stack; not yet measured against a real incident, only against `restore_test.sh`'s scheduled drills below. |

These targets are deliberately modest — appropriate for Milestone 1 (no real customer data yet), not aspirational production SLAs. They should be tightened as part of the encryption/compliance work already tracked in Wave 2, not silently assumed to already be production-grade.

## Recovery Procedure

1. Confirm the failure: which service (Postgres, MinIO, or both) and whether it's data loss vs. availability-only (a container restart may be all that's needed — check `docker compose ps` and service healthchecks before assuming data loss).
2. If data loss: stop the affected service's writers (the `backend` and `celery-worker` containers) to avoid writes racing the restore.
3. Restore Postgres: `infrastructure/backup/restore_postgres.sh <dump>` using the most recent backup.
4. Restore MinIO: `infrastructure/backup/restore_minio.sh <dir>` using the most recent backup.
5. Bring `backend`/`celery-worker` back up; hit `/ready` (`backend/app/routers/v1/health.py`) to confirm Postgres, Redis, and MinIO are all reachable before declaring recovery complete.
6. Record the incident: what failed, RPO/RTO actually achieved vs. target, and any runbook step that didn't match reality — feed corrections back into this document.

## Drill Cadence

- **Quarterly**, minimum: run `infrastructure/backup/restore_test.sh` end-to-end (it backs up, restores, and verifies row counts — not just that the backup command exited 0) and record the actual time taken against the 4-hour RTO target.
- **On every schema change**: run `restore_test.sh` immediately, per the existing guidance in `infrastructure/backup/README.md` — a migration that breaks restore compatibility is far cheaper to catch here than during a real incident.

## Explicitly Out of Scope for This Runbook

- Multi-region failover — no multi-region deployment exists yet; revisit if/when one is planned.
- Encryption-at-rest for backups themselves — tracked as part of the encryption/secrets ADR in [SA-ROADMAP-001](../documentation/SA-ROADMAP-001_Architecture_Roadmap.md) Wave 2, not duplicated here.
