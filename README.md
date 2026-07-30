# SmartArchive AI Platform

Enterprise AI Document Intelligence Platform — Milestone 1 (Foundation).

## What's in this milestone

- Repository structure (see below)
- Docker Compose environment: PostgreSQL, Redis, MinIO, backend, frontend, Celery worker
- FastAPI backend skeleton — fully async (SQLAlchemy 2.0 async + asyncpg), no business logic
- Multi-tenancy via shared schema + PostgreSQL Row-Level Security (RLS)
- JWT auth (login/register/refresh) with RBAC, built through a centralized `authorize()` gate that is ABAC-ready
- Database schema (first version): users, organizations, roles, permissions, documents, folders, tags, categories, document_versions, ocr_jobs, ai_jobs, audit_logs, notifications
- MinIO-backed file storage service (upload/download/delete/versioning) — no OCR/AI processing
- Centralized logging middleware
- Health endpoints: `/health`, `/ready`, `/live`
- Celery + Redis wired with a trivial heartbeat task
- Domain event bus stub (in-process, swappable later for a real broker)
- Frontend skeleton: React + TypeScript + Vite + TailwindCSS + Zustand + TanStack Query + React Router — pages and routing only
- GitHub Actions CI: lint (ruff, eslint) + test (pytest) + build

## Milestone 1.5 — Production hardening

Invisible to end users, but what makes the foundation production-grade:

- **Test coverage**: unit tests (authorize gate, upload validation, storage
  service — all mocked, no infra needed) plus integration tests (auth flow,
  PostgreSQL RLS cross-tenant isolation — gated on `TEST_DATABASE_URL`, see
  `backend/app/tests/conftest.py`). 80% coverage of core logic is the
  target; see `backend/pyproject.toml` for the honest current scope.
- **Security audit**: security headers middleware (HSTS, CSP, X-Frame-Options,
  etc.), Redis-backed rate limiting (tighter on `/auth/*`), explicit CORS
  allowlist (no more `*`), file upload validation (size limit + magic-number
  MIME sniffing, not just trusting `Content-Type`), and an antivirus scan
  hook stubbed for a Stage 2 ClamAV/cloud-AV integration.
- **Docker health**: every service has a healthcheck, `restart: unless-stopped`,
  resource limits, and explicit `depends_on` health-gated ordering.
- **Observability**: Prometheus metrics at `/metrics`, a provisioned Grafana
  dashboard (request rate, error rate, p95 latency), and request/correlation
  ID propagation through every log line and response header.
- **Backup strategy**: `infrastructure/backup/` — Postgres and MinIO
  backup/restore scripts, plus `restore_test.sh`, which actually restores a
  backup and verifies row counts rather than just checking the backup
  command exited 0.
- **ADRs**: `documentation/adr/` — five records (async architecture,
  multi-tenancy, storage, authorization, event bus), each with the
  alternatives that were considered and rejected, not just the decision.

## Explicitly NOT included (Stage 2+)

OCR, AI classification/extraction, Voice Assistant, Semantic Search, Workflow Automation,
ERP/CRM connectors (SAP/Odoo/Salesforce/Dynamics), AI Copilot.

## Quick start

```bash
cp .env.example .env
docker compose up --build
docker compose exec backend alembic upgrade head
```

- Backend: http://localhost:8000/docs
- Frontend: http://localhost:5173
- MinIO console: http://localhost:9001
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (admin/admin — change in production)

## Running tests

```bash
# Unit tests only (no infra required)
cd backend && pytest -q

# Full suite including integration tests (needs Postgres reachable)
export TEST_DATABASE_URL=postgresql+asyncpg://smartarchive:smartarchive_dev_password@localhost:5432/smartarchive_test
createdb smartarchive_test   # once, against the running postgres container/host
alembic upgrade head          # applied to the test database
pytest -q
```

## Repository structure

```
SmartArchive/
├── backend/            FastAPI service (async)
├── frontend/            React + TS + Vite
├── ai-services/         placeholder — Stage 2
├── infrastructure/       nginx, shared infra config
├── database/            init scripts, RLS policies
├── documentation/        architecture docs (SA-ARCH-*)
├── deployment/          k8s/terraform — future
├── sdk/                  public SDK — future
├── plugins/              plugin architecture — future
└── marketplace/          marketplace — future
```

## Locked architecture decisions (see documentation/SA-ARCH-001.md)

1. Multi-tenancy: shared database, `organization_id` on every tenant table, enforced with PostgreSQL RLS
2. Fully async stack end to end — no synchronous DB access anywhere
3. Frontend styling: TailwindCSS + Zustand (not Material UI)
4. Authorization: RBAC now, funneled through one `authorize(user, action, resource)` gate — ABAC-ready
5. API versioning from commit one: `/api/v1/...`
6. Event-driven core: business actions emit domain events instead of direct service-to-service calls
7. Every backend module follows the same internal layout: routers/services/repositories/models/schemas
