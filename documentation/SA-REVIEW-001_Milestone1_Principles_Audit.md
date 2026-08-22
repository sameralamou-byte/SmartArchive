# SA-REVIEW-001 — Milestone 1 Codebase & Docs Audit vs. the 10 Locked Principles

| Field | Value |
|---|---|
| Document ID | SA-REVIEW-001 |
| Status | Review — not a locked architecture decision |
| Scope | `backend/`, `frontend/`, `ai-services/`, `plugins/`, `sdk/`, `marketplace/`, `infrastructure/`, `database/`, `documentation/` as of Milestone 1 (Foundation) |
| Purpose | Score current code + docs against the 10 locked SmartArchive principles; surface doc/code mismatches |

## How to read this

Milestone 1 is explicitly scoped as "core skeleton, no business features" (`backend/app/main.py`, `README.md`). Several principles (voice, AI-everywhere, plugin architecture) are **intentionally** unimplemented per the roadmap — that's not a defect. This report distinguishes **on track for what's built so far** from **actual gaps/inconsistencies worth fixing now**.

---

## Principle-by-principle

### 1. One Platform — Multiple Products
**Status: On track (thin but correctly shaped).**
`organizations.deployment_mode` (integrated/standalone/hybrid) and a single shared schema/RLS model mean there's no per-product duplication yet to consolidate — the foundation doesn't fork logic by product. Nothing to correct; the real test comes when Enterprise-specific and Home-specific features start landing in Stage 2 — watch that they go through shared services, not parallel ones.

### 2. Mobile-First AND Desktop-First
**Status: Not yet evidenced — flag for Stage 2 planning, not a Milestone 1 defect.**
Frontend is React + Vite + TailwindCSS + React Router with exactly three pages (`Login`, `Dashboard`, `NotFound`), all plain `<div>` layouts with no responsive breakpoint classes (`sm:`/`md:`/`lg:`) anywhere yet (`frontend/src/pages/Dashboard.tsx`). No PWA manifest, no Capacitor/React Native/Electron scaffolding, no viewport testing in CI. This is fine for a 3-page skeleton, but there is currently no architectural commitment (responsive component library, design tokens, breakpoint strategy) that would make "excellent experience on 6″ phone through ultra-wide" a forced outcome later rather than a retrofit. **Recommendation:** decide the responsive strategy (Tailwind breakpoints + a shared layout primitive set) before Stage 2 adds real screens, not after.

### 3. Responsive Design Everywhere
**Status: Same as #2 — no violation yet, no enforcement yet.**
Nothing in ESLint/CI checks for responsive coverage. Not a problem today (3 trivial pages); becomes one the moment document-list/upload/search UIs land without a reviewed responsive baseline.

### 4. Voice is a Primary Interface
**Status: Explicitly deferred — consistent with docs.**
`README.md` lists "Voice Assistant" under "Explicitly NOT included (Stage 2+)". No gap here; docs and code agree.

### 5. Integrated Mode is the Default
**Status: On track, correctly load-bearing.**
`DeploymentMode.standalone` is actually the SQLAlchemy column *default* (`backend/app/models/organization.py:26`), while SA-ARCH-006 states Integrated is the default *behavior* for any org with an existing system. These aren't contradictory (the column default is just "assume nothing until told otherwise"), but worth a one-line comment noting that the DB default is a fallback value, not a statement that standalone is preferred — a future reader could misread it as principle #6 winning over #5.

### 6. Standalone Mode
**Status: On track.** Modeled explicitly as a first-class enum value, matches SA-ARCH-006 §4 (metadata store + document archive only, deliberately not CRM/ERP).

### 7. AI Everywhere
**Status: Explicitly deferred, but the data model is already shaped for it.**
`ai_job.py` and `ocr_job.py` models exist as placeholders; `ai-services/` is an empty README stub. Consistent with "Stage 2+" scoping — no inconsistency.

### 8. Enterprise Grade
**Status: Partial — strong on some sub-requirements, silent on others.**
- Multi-tenant: solid (RLS, forced, per-table policies — verified in `backend/alembic/versions/0001_initial_schema.py:247-259`).
- RBAC/ABAC: solid, single-gate design verified in `authorize.py`.
- Audit logs: modeled (`audit_log.py`) but no writer/subscriber wired yet (expected — event bus has zero subscribers by design per ADR-005).
- Versioning: modeled (`document_version.py`).
- Encryption: **no encryption-at-rest or TLS configuration found anywhere** (`infrastructure/nginx/` is an empty directory, no cert/TLS termination config, no MinIO server-side encryption env vars in `docker-compose.yml`). This is normal for a local dev Docker Compose setup, but there's no ADR yet committing to how encryption-in-transit/at-rest gets handled in a real deployment. **Recommendation:** an ADR-006 on TLS termination + at-rest encryption strategy before Stage 2 handles real customer documents.
- Plugin architecture / event-driven: modeled and stubbed appropriately (in-process bus, swap point documented).

### 9. Human-Centered
**Status: Not yet applicable** — no AI-facing UI exists yet to evaluate against "explain, assist, simplify." Nothing to flag.

### 10. API-First, UI-Independent Architecture
**Status: On track.** `/api/v1/...` versioning from commit one, OpenAPI/Swagger auto-exposed, frontend consumes the API through a single `apiClient` (`frontend/src/api/client.ts`) rather than any direct DB/backend coupling. No violations found.

---

## Cross-cutting findings (not tied to one principle)

1. **Missing foundational document.** Both `SA-ARCH-001.md` and the `SA-ARCH-006` docx declare `SAC-ARCH-000 v2.1.0` ("البنية المعمارية التأسيسية" / foundational architecture) as a dependency, and `README.md`'s "Explicitly NOT included" section also cites "the master project instructions." **Neither exists anywhere in this repository** (checked `C:\Dev\SmartArchive` and the AI-COS repo). Everything downstream cites it as authoritative, but there's no committed copy to verify claims against or to onboard a new contributor with. **Recommendation:** commit `SAC-ARCH-000` into `documentation/` (even if authored elsewhere) so the dependency chain is self-contained in the repo that GitHub main treats as source of truth.

2. **Stale code comment / doc mismatch.** `backend/app/core/tenancy.py:11` says RLS policies live in `database/init/002_rls_policies.sql` — that file doesn't exist. The RLS policies actually live in `backend/alembic/versions/0001_initial_schema.py:247-259` (confirmed). Small, but exactly the kind of stale pointer that wastes a future debugging session. **Recommendation:** fix the docstring to point at the migration file.

3. **CI doesn't run frontend tests.** `frontend/package.json` defines a `test` script (`vitest run`), but `.github/workflows/ci.yml`'s frontend job only runs `lint` and `build` — `npm run test` is never invoked in CI. Backend CI does run `pytest`. **Recommendation:** add the `npm run test` step so frontend regressions aren't silently unguarded.

4. **Grafana/Prometheus/backup infra is real, not placeholder** — `infrastructure/backup/*.sh` includes an actual `restore_test.sh` that restores and verifies row counts, which is more rigorous than most Milestone-1 stage foundations bother with. Worth calling out as something done well, not just gaps.

## Summary

Nothing found here should block Milestone 1 sign-off — the foundation is disciplined and the ADRs are unusually honest about alternatives-considered. The two items worth acting on soon: (1) get `SAC-ARCH-000` actually into the repo since two locked documents depend on it, and (2) decide the responsive/mobile-first strategy before Stage 2 UI work starts, since principles #2/#3 currently have zero enforcement mechanism (no lint rule, no CI check, no shared layout primitives) to make them structural rather than aspirational.
