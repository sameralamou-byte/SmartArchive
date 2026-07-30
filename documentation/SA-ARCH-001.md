# SA-ARCH-001 — Locked Architecture Decisions (Milestone 1)

| Field | Value |
|---|---|
| Document ID | SA-ARCH-001 |
| Version | 1.0 |
| Owner | Architecture team — SmartArchive AI Platform |
| Status | Locked |
| Dependencies | SAC-ARCH-000 v2.1.0 |

## 1. Multi-tenancy
Shared database, `organization_id` on every tenant-owned table, isolation enforced
by PostgreSQL Row-Level Security — not application code. See
`backend/app/core/tenancy.py` and the RLS policies in
`backend/alembic/versions/0001_initial_schema.py`.

## 2. Fully async stack
FastAPI → SQLAlchemy 2.0 async → asyncpg → PostgreSQL. No synchronous database
access anywhere: routes, services, repositories, background jobs, and future
AI services/connectors are all async.

## 3. Frontend styling
TailwindCSS + Zustand (not Material UI) — smaller bundles, white-label/branding
flexibility, consistent with the "minimal, professional, enterprise" UI principle.

## 4. Authorization model
RBAC in Phase 1, ABAC-ready by design. Every protected action calls
`authorize(session, user, action, resource)` in `backend/app/security/authorize.py` —
no route or service checks permissions directly. Stage 2+ ABAC conditions are added
inside that one function; call sites never change.

## 5. API versioning
`/api/v1/...` from the first commit. OpenAPI/Swagger/ReDoc exposed automatically
by FastAPI.

## 6. Event-driven core
Business actions emit domain events via the in-process bus in
`backend/app/events/bus.py` instead of services calling each other directly.
Swappable later for Redis Streams/RabbitMQ/Kafka without touching publishers
or subscribers.

## 7. Repository standards
Every backend module follows: `routers/ services/ repositories/ models/ schemas/
security/ events/ tasks/ tests/`. No module invents its own layout.

## Additional Milestone 1 decisions
- Celery + Redis wired immediately with a trivial heartbeat task (validates
  Docker networking, broker, worker, and beat scheduler before OCR/AI workloads).
- `organizations.deployment_mode` (`integrated` / `standalone` / `hybrid`) added
  to the schema from day one — see SA-ARCH-006.
