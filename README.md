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

## Explicitly NOT included (Stage 2+)

OCR, AI classification/extraction, Voice Assistant, Semantic Search, Workflow Automation,
ERP/CRM connectors (SAP/Odoo/Salesforce/Dynamics), AI Copilot.

## Quick start

```bash
cp .env.example .env
docker compose up --build
```

- Backend: http://localhost:8000/docs
- Frontend: http://localhost:5173
- MinIO console: http://localhost:9001

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
