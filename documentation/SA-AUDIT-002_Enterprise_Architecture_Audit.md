# SA-AUDIT-002 — Enterprise Architecture Audit

| Field | Value |
|---|---|
| Document ID | SA-AUDIT-002 |
| Revision | 1 (see Revision History) |
| Status | Approved — part of Architecture Baseline v1.0 (approved 2026-07-30) |
| Scope | Entire repository at `C:\Dev\SmartArchive` as of Milestone 1 (Foundation) + Milestone 1.5 hardening |
| Method | Direct reading of every ADR, SA-ARCH doc, backend module, frontend module, infra config, CI pipeline, and repo structure. No code was modified. |
| Predecessor | [SA-REVIEW-001](SA-REVIEW-001_Milestone1_Principles_Audit.md) (principles-only pass) — this document supersedes it in scope, not in findings; SA-REVIEW-001's findings are re-included below under their relevant sections. |

## Revision History

| Rev | Change |
|---|---|
| 0 | Initial audit across 15 requested areas. |
| 1 | Human review pass. Upgraded the RLS test assessment to a named strength (§12); added the `/ready`-vs-MinIO doc/code mismatch (§15, Track A item A6); corrected the design-token finding to acknowledge the existing Tailwind `brand` color scale (§5, §13); broadened the compliance finding from GDPR-only to a general regulatory framework spanning HIPAA/FERPA/jurisdiction-specific rules (§7); added Internationalization & Localization as a new audited area (§16) after finding no i18n strategy despite `SA-ARCH-006` itself being Arabic-language and Principle #4 citing translation as a core voice use case; added Industry/Vertical Edition Extension Model & Core-vs-Edition Capability Boundaries as a new unresolved architectural question (§17), since neither the original audit nor any existing document says how Legal/Healthcare/Education/Government editions are meant to extend the shared engine without industry-specific logic leaking into the core. |

## How to read this

SmartArchive is currently **one milestone into a multi-year platform vision**. Most "Critical" findings below are critical *as design decisions to make explicit soon*, not as bugs to fix in the running code — implementing OCR, AI, connectors, or Kubernetes today would itself violate the locked principle of building foundations before features. The Priority column reflects urgency of **deciding and documenting**, not urgency of **coding**; the Timing column separates the two explicitly.

**Vision check applied in this revision:** every finding and recommendation below was re-evaluated against SmartArchive's long-term goal of serving homes, SMBs, enterprises, and future industry editions (Healthcare, Legal, Education, Government) from one shared core — specifically: does this recommendation maximize reuse of the shared engine, avoid duplicating business logic, preserve API-first/UI-independence, and keep Web/Desktop/Mobile/Voice/future interfaces consuming identical backend services? Where that lens changed a finding's scope or priority, it's called out explicitly (see §7, §9, §17).

---

## 1. Enterprise Scalability (multi-tenant, horizontal scaling, queues, caching, HA)

**Status:** Partial — tenancy is enterprise-grade; horizontal scaling and HA are not yet addressed, appropriately for this stage.

**Evidence:**
- Multi-tenancy: shared schema + PostgreSQL RLS, `FORCE ROW LEVEL SECURITY` on every tenant table, policy compares `organization_id` to a session variable (`backend/alembic/versions/0001_initial_schema.py:247-259`, `backend/app/core/tenancy.py`). This is genuinely solid — matches ADR-002's stated alternative analysis.
- Queues: Celery + Redis wired (`docker-compose.yml` `celery-worker` service, `backend/app/tasks/celery_app.py`), but only a heartbeat task exists — no real workload yet (by design, per ADR-005 and README).
- Caching: Redis is used only for rate-limiting counters (`backend/app/core/rate_limit.py`); there is no read-through/cache-aside layer for document metadata, permissions, or search results.
- HA: every stateful service (Postgres, Redis, MinIO) runs as a **single container** with a healthcheck and `restart: unless-stopped` — no replication, no failover, no read replicas, no Redis Sentinel/Cluster, no MinIO distributed/erasure-coded mode. `docker-compose.yml` has no `deploy.replicas` anywhere.
- No Kubernetes manifests, Helm charts, or autoscaling policy exist anywhere in the repo (`deployment/` is a placeholder README only).
- SQLAlchemy engine created with defaults (`backend/app/core/database.py:43`) — no explicit pool sizing (`pool_size`, `max_overflow`) has been decided for production load.

**Gaps:** No HA topology decided for Postgres/Redis/MinIO; no horizontal scaling story for the API tier (single `backend` container); no connection-pool sizing policy; no caching strategy for hot read paths.

**Risks:** Low today (zero production traffic). Becomes a real risk the moment a pilot customer with real usage patterns is onboarded, because retrofitting HA into a single-instance topology under load is much more disruptive than designing for it from the next milestone.

**Priority:** High (as a design decision, not as code to write today).

**Recommendation:** An ADR deciding the HA/scaling topology (e.g., Postgres primary + read replica via managed service, Redis Sentinel or managed Redis, MinIO distributed mode or migration to cloud object storage) before the first pilot deployment, plus an explicit connection-pool sizing policy.

**Timing:** Document now; implement starting Stage 2/3 when a first real deployment is scheduled.

---

## 2. AI Architecture (AI Gateway, multi-model support, orchestration, memory, prompt management, safety)

**Status:** Not started — and this is the single biggest architectural risk in the whole audit if left undecided past the point where the first AI feature gets written.

**Evidence:** `ai-services/` contains only a placeholder README. `AIJob` model (`backend/app/models/ai_job.py`) defines `classification | extraction | summarization | embedding` job types — a good forward-looking data shape — but there is zero orchestration code, no model-routing abstraction, no prompt template system, no conversation/session memory store, no safety/guardrail layer, and no cost/usage tracking.

**Gaps:** No AI Gateway design exists anywhere — not in this repo, and (since it's missing) possibly not in `SAC-ARCH-000` either. Nothing prevents Stage 2 from wiring individual OCR/classification/chat calls directly into routers ad hoc.

**Risks:** This is the one area where "implement now" would be actively harmful, but "leave undecided" is equally harmful. If the first AI feature (e.g., OCR) gets built as a point-to-point integration without a Gateway abstraction first, every subsequent AI feature (classification, summarization, chat, translation, reminders) either duplicates that integration pattern or requires a disruptive retrofit — directly undermining Principle #1 (One Engine) and Principle #10 (API-first, one governed surface).

**Priority:** Critical (as a design decision — must exist *before* the first AI code, even a single OCR call, is written).

**Recommendation:** ADR + design doc for an **AI Gateway** covering: multi-model routing (which provider/model per job type), prompt template management and versioning, conversation memory storage, safety/guardrail filtering, and usage/cost metering — all consumed through one internal interface so `ai_jobs` rows are the only thing routers ever touch directly.

**Timing:** Design now (blocks nothing else); implement at the start of Stage 2, before the first OCR/classification call is written.

---

## 3. Universal Connector Engine (ERP, CRM, cloud storage, email, messaging, APIs)

**Status:** Vision-only, and the documentation itself creates ambiguity here.

**Evidence:** SA-ARCH-006 (§3) refers to "واجهات Universal Connector Engine القائمة" — literally "the **existing** Universal Connector Engine interfaces" — treating it as already architecturally established (presumably in the missing `SAC-ARCH-000`). No connector code, connector interface, or connector-related config exists anywhere in this repo (`plugins/` is an empty stub; no `connectors/` directory exists at all).

**Gaps:** Because `SAC-ARCH-000` isn't in the repo (see §15), there is no way to verify what the Universal Connector Engine's actual contract is supposed to be — auth model per connector type, sync vs. webhook-driven updates, conflict resolution when SmartArchive and the external ERP/CRM both hold a copy of the same fact, rate-limit handling per third-party API, etc. Right now this "engine" exists only as a name referenced across documents.

**Risks:** High long-term — six named integration targets (SAP, Dynamics, Odoo, Salesforce, Zoho, SharePoint, Google Workspace, plus "government systems") all need to share one connector contract per Principle #1, or this becomes six bespoke integrations instead of one engine with six plugins.

**Priority:** Critical documentation gap; Medium implementation urgency (correctly Stage 2+).

**Recommendation:** A standalone connector-engine design doc: connector interface (auth, read, write, webhook subscription), how a connector maps external records to SmartArchive's document/metadata model, and how conflicts are resolved. This should exist independently of `SAC-ARCH-000` even after that document is recovered, since it's implementation-facing detail a foundational architecture doc likely doesn't carry.

**Timing:** Design in parallel with AI Gateway design (both are Stage 2 prerequisites); implement Stage 2+.

---

## 4. API-First Architecture and UI Independence

**Status:** Met.

**Evidence:** `/api/v1/...` versioning from the first commit, OpenAPI/Swagger/ReDoc auto-exposed (`backend/app/main.py`), frontend consumes the API exclusively through one `apiClient` (`frontend/src/api/client.ts`) with no direct DB or backend-internals coupling.

**Gaps:** None found in what exists. The only forward-looking gap is that no OpenAPI-client-codegen pipeline exists yet for future mobile/desktop clients (see §5, §13) — `sdk/` is an empty placeholder.

**Risks:** Low.

**Priority:** Low (maintain current discipline; no corrective action needed).

**Recommendation:** None now; when a second client (mobile/desktop) is planned, generate its API client from the OpenAPI spec rather than hand-writing a second HTTP layer.

**Timing:** N/A — already on track.

---

## 5. Mobile-First and Desktop-First Architecture Using One Shared Backend

**Status:** Foundation is correct; nothing yet proves the principle because only one client exists.

**Evidence:** Backend is transport-agnostic REST/JSON with no web-specific assumptions baked in (no server-rendered HTML, no session cookies — pure JWT bearer auth in `backend/app/security/jwt.py`), which is the right substrate for multiple clients. Frontend itself, however, is a plain responsive-agnostic React SPA with three pages and no responsive breakpoints (`frontend/src/pages/Dashboard.tsx`), no PWA manifest, and no React Native/Electron/Capacitor scaffolding anywhere.

**Gaps:** A design-token *seed* exists — `frontend/tailwind.config.js` defines a custom `brand` color scale (`50/500/600/900`), used consistently in `Login.tsx` — so this isn't a from-zero gap. What's actually missing is everything past color: no responsive breakpoint convention, no spacing scale, no typography scale, no reusable component library, and no design-token governance (who owns adding a new token, how it's versioned) that a future mobile or desktop client could build against. No client SDK generation from the OpenAPI spec exists either.

**Risks:** Medium now (only one trivial client), High once Stage 2 adds real screens without a responsive/shared-logic strategy already in place — retrofitting is always more expensive than designing in from the start, which is the explicit reasoning your locked Principle #2 is built on.

**Priority:** High (decide the strategy before Stage 2 UI work, not after).

**Recommendation:** Pick and document: (a) the responsive breakpoint/layout convention for the web client now, (b) whether a future mobile client is React Native (sharing logic/state with the web client) vs. fully native, and (c) an OpenAPI-codegen pipeline so all clients generate their API layer from one source of truth instead of hand-writing it per platform.

**Timing:** Document now; apply the web-side convention starting with the next UI milestone (document list/upload/search), which is coming soon regardless of AI timelines.

---

## 6. Voice Architecture (speech-to-text, text-to-speech, conversational context)

**Status:** Not started — correctly deferred, but under-specified as a design question.

**Evidence:** README explicitly lists "Voice Assistant" under Stage 2+ scope. No STT/TTS provider is chosen, no code exists.

**Gaps:** Voice is architecturally different from the rest of the API-first model in one specific way worth calling out: REST/JSON works fine for "archive this contract" as a one-shot command, but natural voice interaction (interruption, multi-turn clarification, streaming partial transcripts) typically needs a persistent connection (WebSocket/gRPC streaming), which is a different transport pattern than anything else in this codebase. No document yet reconciles "voice is a primary interface" (Principle #4) with "every capability is an API first" (Principle #10) — they're not in conflict, but the *how* isn't decided.

**Risks:** Medium — same class of risk as AI Gateway: if voice gets bolted on ad hoc later without deciding this, it either bypasses the AI Gateway (breaking Principle #1) or forces an awkward retrofit of streaming into a purely request/response API design.

**Priority:** Medium (design question, not urgent to answer before other Stage 2 work, but shouldn't be left completely undocumented).

**Recommendation:** A short ADR, even a stub one, stating: STT/TTS provider(s) under consideration, the streaming transport decision (WebSocket vs. gRPC vs. chunked HTTP), and confirming voice commands route through the same AI Gateway and same `authorize()`/business-logic layer as every other client — i.e., voice is a *client*, not a parallel backend.

**Timing:** Can wait until Stage 2 planning begins in earnest; doesn't block current work.

---

## 7. Security Architecture (authN, authZ, encryption, secrets, audit logging, regulatory compliance)

**Status:** Partial — authentication/authorization is genuinely strong; encryption, secrets management, and regulatory compliance are unaddressed.

**Scope correction on review:** the original pass scoped this as a "GDPR" gap specifically. That's too narrow given the locked Principle #1 explicitly names Healthcare, Legal, Education, and Government as future editions on the same shared engine — each brings its own regulatory regime (HIPAA for Healthcare, FERPA for Education, jurisdiction-specific data-residency/privilege rules for Government and Legal), on top of GDPR for EU customers of any edition. Treating this as "the GDPR gap" risks a GDPR-shaped solution that has to be redone per-edition later. It's reframed below as a general regulatory compliance framework.

**Evidence:**
- AuthN: JWT access (15 min) + refresh (7 day) tokens, bcrypt password hashing via `passlib` (`backend/app/security/jwt.py`).
- AuthZ: single `authorize()` gate, RBAC now / ABAC-ready by design (`backend/app/security/authorize.py`) — verified as the only permission-check path across `files.py`.
- Audit logging: **actually wired**, not just modeled — `AuditLog` rows are written on `document.create` and `document.delete` (`backend/app/routers/v1/files.py:79-87, 144-152`). This is a genuine strength worth noting.
- Rate limiting: Redis-backed fixed-window limiter, tighter on auth endpoints, **fails open** if Redis is unreachable (`backend/app/core/rate_limit.py:70-73`) — a deliberate availability-over-security tradeoff that is reasonable but not yet written down anywhere as an accepted risk.
- Encryption: **no TLS anywhere** — `docker-compose.yml` has every service talk over plain HTTP internally, `MINIO_USE_SSL=false` by default (`.env.example:21`), and `infrastructure/README.md` explicitly confirms nginx/TLS termination is deferred. No at-rest encryption for Postgres or MinIO volumes.
- Secrets: `JWT_SECRET_KEY=change_me_in_production` lives as a plaintext env var with no secrets-manager integration (Vault, AWS Secrets Manager, Azure Key Vault) planned anywhere.
- Regulatory compliance: no data export endpoint, no right-to-erasure implementation, no data-residency handling for different deployment modes, no PII classification on any model, and — beyond GDPR — nothing anywhere addresses HIPAA (Healthcare edition), FERPA (Education edition), or jurisdiction-specific confidentiality/data-residency rules (Legal, Government editions).

**Gaps:** Encryption-in-transit/at-rest strategy, secrets management strategy, and a regulatory-compliance posture are all completely undocumented — not merely unimplemented.

**Risks:** Critical the moment real customer documents are stored — an enterprise document-intelligence platform handling contracts, IDs, and financial documents without a stated encryption and compliance posture is a credibility and legal risk, not just a technical one. The risk compounds per future industry edition: a compliance design that only ever considered GDPR would need rework the moment Healthcare or Education editions are greenlit.

**Priority:** Critical (documentation), High (implementation, gated on when real customer data starts flowing — must be before any pilot, not before Milestone 1 sign-off).

**Recommendation:** Two ADRs: (1) Encryption & TLS strategy (edge TLS termination approach, at-rest encryption for Postgres/MinIO, secrets manager choice), (2) a **regulatory compliance framework** — not a GDPR-only document — covering retention, erasure, residency, and PII handling as configurable rules per deployment mode *and* per industry edition (GDPR baseline for all; HIPAA rules activate for Healthcare; FERPA for Education; jurisdiction/privilege rules for Legal and Government). The framework should state explicitly which regimes are in scope for the initial target market, since that's a product decision, not just an engineering one — but the architecture itself should be regime-agnostic from the start rather than GDPR-shaped.

**Timing:** Document before Stage 2 begins handling any real customer document; implement before the first pilot customer (not before Milestone 1 sign-off, since Milestone 1 has no real data yet).

---

## 8. Document Intelligence Pipeline (upload, OCR, classification, metadata, embeddings/vector search, automation, retention)

**Status:** Partial — the upload leg is solid and complete; everything downstream is correctly unstarted, but vector search and retention have no architectural decision at all yet, which is the actual gap (not the absence of code).

**Evidence:**
- Upload: fully implemented end to end — validation (size + magic-number MIME sniffing, not just `Content-Type`), antivirus hook (stubbed for Stage 2 ClamAV), MinIO storage, `documents` row, audit log, domain event emission (`backend/app/routers/v1/files.py`). This is real, working code, not a stub.
- OCR/classification: modeled only (`ocr_jobs`, `ai_jobs` tables), zero engine, explicitly Stage 2 — consistent with docs.
- Metadata: basic model fields plus separate `folder`, `category`, `tag` models exist — reasonable foundation.
- **Embeddings/vector search: no decision exists anywhere.** `AIJobType.embedding` is a defined enum value, but `database/init/001_extensions.sql` only enables `pgcrypto` — no `pgvector` extension, no vector column anywhere, and no ADR comparing pgvector-in-Postgres vs. a dedicated vector database (Qdrant/Pinecone/Weaviate/Milvus). This is the single largest silent gap in the Document Intelligence section, because the schema decision (in-Postgres vs. external vector store) has real migration cost if made late.
- Retention: no retention-period field, no lifecycle/expiry engine, no legal-hold concept anywhere in `Document` or any related model.

**Gaps:** Vector search architecture and retention policy are both completely undecided, not just unimplemented.

**Risks:** High for vector search specifically — if embeddings get bolted onto Postgres ad hoc once Stage 2 needs semantic search, and the right answer turns out to be a dedicated vector DB at scale, migrating billions of embedding rows later is far more expensive than deciding now. Retention ties directly into the regulatory compliance framework gap in §7 (retention rules will differ by industry edition, not just by GDPR).

**Priority:** Critical (vector search decision), High (retention policy decision).

**Recommendation:** ADR comparing pgvector vs. dedicated vector DB (criteria: expected corpus size, hybrid keyword+semantic search needs, operational overhead of one more service vs. an extension). Separate retention-policy doc defining default retention, legal-hold override, and how it interacts with deployment mode (Enterprise customers likely need configurable retention; Home users likely don't).

**Timing:** Decide both before Stage 2 AI work starts (the vector search decision directly shapes the `ai_jobs`/embedding schema that Stage 2 will build on).

---

## 9. Plugin and Extension Architecture

**Status:** Not started, and the design questions aren't documented anywhere accessible.

**Evidence:** `plugins/` and `marketplace/` are both empty README placeholders explicitly scoped to Stage 2+.

**Gaps:** No plugin manifest format, no sandboxing/isolation model, no permission model for third-party plugin code, no marketplace review/publishing process — none of this is decided, and (since `SAC-ARCH-000` is missing) it's unclear whether any of it was decided elsewhere.

**Risks:** Medium-High long-term (Principle #8 explicitly requires plugin architecture as an enterprise-grade baseline) but low near-term since nothing has been built that would need retrofitting yet.

**Priority:** Medium (correctly not urgent; the connector engine and AI Gateway decisions in §2/§3 are more foundational and should come first, since plugins likely build on top of both).

**Vision-check flag:** this section's original sequencing assumed plugins are "a connector or AI capability packaged for third-party distribution." On review, that assumption may be incomplete — if future industry editions (Legal, Healthcare, Education, Government) are themselves meant to be delivered *as* plugins/extensions rather than as forks or separate deployments, then this decision is more load-bearing for Principle #1 (One Platform, Multiple Products) than "Medium priority, sequence last" suggests. See the new §17 for the open question this surfaces; the priority/sequencing here should be revisited once §17 is resolved, likely during the roadmap (Phase 2) review rather than by editing this priority now.

**Recommendation:** Defer the *detailed* design until after the AI Gateway and Connector Engine ADRs land, since a plugin is likely "a connector or AI capability packaged for third-party distribution" — designing plugins before those two exist risks designing the wrong abstraction. However, the *higher-level* question of whether industry editions are plugins at all (§17) should not wait, since it may change how §2/§3 themselves need to be designed.

**Timing:** Stage 2+, after §2 and §3 are resolved.

---

## 10. Infrastructure Architecture (Docker, Kubernetes readiness, monitoring, backup, DR)

**Status:** Strong for local dev; appropriately absent for production topology.

**Evidence:**
- Docker: healthchecks, `restart: unless-stopped`, explicit resource limits, and health-gated `depends_on` ordering on every service (`docker-compose.yml`) — genuinely good practice, not just boilerplate.
- Monitoring: Prometheus scrape config + a provisioned Grafana dashboard (request rate, error rate, p95 latency) actually exist as real files (`infrastructure/prometheus/prometheus.yml`, `infrastructure/grafana/dashboards/smartarchive-overview.json`), not placeholders.
- Backup: `infrastructure/backup/` has real Postgres/MinIO backup **and restore** scripts, including `restore_test.sh` which actually restores a backup and verifies row counts — more rigorous than most projects bother with at this stage. Worth calling out as a strength.
- Kubernetes: zero manifests/Helm charts anywhere; `deployment/` is an empty placeholder.
- Disaster recovery: backup mechanics exist, but no documented RTO/RPO targets, no failover runbook, no drill schedule — the *mechanism* exists without the *policy* around it.

**Gaps:** No k8s readiness (fine for now); no stated DR objectives despite having the tooling to meet them.

**Risks:** Low for k8s (premature until real scale). Medium for DR — having backup scripts without stated recovery-time expectations means nobody can say today whether the current setup actually meets what an enterprise customer would contractually expect.

**Priority:** Low (Kubernetes), High (documenting RTO/RPO — cheap to write, currently a real blind spot).

**Recommendation:** A short DR runbook stating target RTO/RPO and a drill cadence (even quarterly), using the backup/restore scripts that already exist. Kubernetes/production infra ADR can wait until a specific deployment triggers the need.

**Timing:** DR runbook: soon, it's cheap. Kubernetes: defer until Stage 2/3 scaling need is concrete.

---

## 11. Standalone vs. Enterprise Deployment Model

**Status:** On track.

**Evidence:** `organizations.deployment_mode` (`integrated | standalone | hybrid`) exists in the schema from day one (`backend/app/models/organization.py`), matching SA-ARCH-006 exactly.

**Gaps:** No behavioral branching in code yet based on `deployment_mode` (e.g., conditionally loading connectors) — expected and correct at this stage, since connectors don't exist yet (§3).

**Risks:** None currently.

**Priority:** Low.

**Recommendation:** None now; revisit once the Connector Engine (§3) exists, since that's where `deployment_mode` will actually start driving behavior.

**Timing:** N/A.

---

## 12. Performance, Observability, Testing Strategy, CI/CD, DevOps Readiness

**Status:** Partial — observability and test *content* are strong; CI enforcement and performance testing have real gaps.

**Evidence:**
- Observability: Prometheus metrics, `structlog` structured logging, request/correlation-ID propagation (`backend/app/core/request_context.py`, `metrics.py`) — solid.
- Testing: real unit + integration tests exist — auth flow, `authorize()` gate, storage service, upload validation, and (notably) an actual **RLS cross-tenant isolation test** (`backend/app/tests/test_rls_isolation.py`) that verifies the multi-tenancy guarantee empirically rather than trusting the SQL. **Named strength, upgraded on review:** this test specifically guards against the single most common way teams accidentally validate nothing — Postgres superusers (which is what `POSTGRES_USER` becomes in the stock `postgres` Docker image used here and in CI) bypass RLS unconditionally, even on tables with `FORCE ROW LEVEL SECURITY`. Running the read assertions on the default superuser connection would "pass" whether or not the policy actually worked. The test explicitly `CREATE ROLE rls_test_role NOSUPERUSER NOBYPASSRLS` and `SET ROLE`s to it before every read (`test_rls_isolation.py:14-15, 100, 114`), so it genuinely exercises enforcement rather than exercising a connection that was never subject to the policy in the first place. This is a materially harder test to write correctly than "assert the query returns zero rows," and its presence is a real signal of engineering discipline, not just test-count coverage.
- Coverage: 80% target documented (`backend/pyproject.toml`) but **not enforced** — no `fail_under` set, so CI cannot currently fail on a coverage regression.
- CI/CD: `.github/workflows/ci.yml` runs lint + test + build for both backend and frontend, but (confirmed in the prior review) the **frontend job never runs `npm run test`** despite `vitest` being configured. No deploy stage, no image publishing, no migration-on-deploy automation exists anywhere — appropriately, since there's no deployment target yet.
- Performance: no load-testing tooling (k6/Locust/etc.) and no written SLOs beyond the Grafana dashboard tracking p95 latency (which implies an expectation without stating the number).

**Gaps:** Coverage not enforced; frontend tests not run in CI; no performance/load testing baseline or SLOs.

**Risks:** Low-Medium — these are cheap, mechanical fixes, but every day they're not fixed is a day a regression could land silently.

**Priority:** Medium — cheap wins, worth doing soon rather than deferring to a "hardening milestone."

**Recommendation:** Add `npm run test` to the frontend CI job; set `fail_under = 80` (or the currently-honest number) in `[tool.coverage.report]`; write down at least one SLO (e.g., "p95 API latency < 300ms at expected Milestone 2 load") so the existing Grafana panel has a target to alert against.

**Timing:** Now — these are all small, low-risk changes with no architectural dependencies.

---

## 13. UX Architecture — Identical Business Logic Across Web, Desktop, Mobile, Future Native Apps

**Status:** Foundation correct (business logic is server-side, API-first); nothing yet proves cross-platform parity because only one client exists.

**Evidence:** See §5 — same underlying facts apply here from the UX-consistency angle specifically. A `brand` color-token seed exists (`frontend/tailwind.config.js`), but no shared component library, responsive/typography/spacing conventions, or state-management convention has been decided that a second client would need to conform to.

**Gaps:** No documented plan for how a second client will reuse business logic vs. re-implement it — e.g., will a mobile app share Zustand stores and TanStack Query hooks (React Native), or will it be a fully separate native codebase re-deriving the same rules from the API alone?

**Risks:** Medium now, High the moment a second client is greenlit without this decided — the exact retrofit-cost problem Principle #2 was written to prevent.

**Priority:** Medium-High (same as §5 — these two are really one decision, viewed from two angles).

**Recommendation:** Same as §5: decide the mobile client strategy and an OpenAPI-codegen pipeline before Stage 2 client work starts, not after the first native app is scaffolded.

**Timing:** Document now; doesn't block current backend/frontend work.

---

## 14. Compliance with the Locked SmartArchive Architecture Principles

**Status:** See [SA-REVIEW-001](SA-REVIEW-001_Milestone1_Principles_Audit.md) for the full principle-by-principle scoring; summarized here for completeness.

| # | Principle | Status |
|---|---|---|
| 1 | One Platform, Multiple Products | On track |
| 2 | Mobile-First AND Desktop-First | Not yet evidenced — see §5/§13 |
| 3 | Responsive Design Everywhere | Not yet evidenced — see §5/§13 |
| 4 | Voice is a Primary Interface | Correctly deferred — see §6 |
| 5 | Integrated Mode is the Default | On track |
| 6 | Standalone Mode | On track |
| 7 | AI Everywhere | Correctly deferred — see §2 |
| 8 | Enterprise Grade | Partial — see §1, §7 |
| 9 | Human-Centered | Not yet applicable (no AI-facing UI exists) |
| 10 | API-First, UI-Independent | On track |

No new violations found beyond what SA-REVIEW-001 already identified.

---

## 15. Consistency Between Documentation and Actual Implementation

**Status:** Mostly strong, with one significant structural gap and one small stale reference.

**Evidence:**
- README's "Repository structure" and "What's in this milestone" sections are **accurate** — they match what's actually in the repo, which is not a given for a project at this stage and is worth noting as a strength.
- **Significant gap:** `SAC-ARCH-000 v2.1.0` is cited as a hard dependency by both `SA-ARCH-001.md` and the `SA-ARCH-006` docx, and SA-ARCH-006 speaks of the Universal Connector Engine as already "existing" (§3 above) — implying a broader architecture is assumed established elsewhere. That document is **not in this repository** (confirmed absent from both `C:\Dev\SmartArchive` and the AI-COS repo). Every downstream document's authority ultimately traces back to a document nobody reviewing this repo can actually read.
- **Small gap:** `backend/app/core/tenancy.py:11` points to `database/init/002_rls_policies.sql`, which doesn't exist — the real policies are in `backend/alembic/versions/0001_initial_schema.py:247-259` (previously flagged in SA-REVIEW-001, still unfixed).
- **New finding (added on review):** `backend/app/routers/v1/health.py`'s own module docstring claims `/ready` checks "can we reach Postgres, Redis, **MinIO**" — but the actual `checks` dict (`health.py:29`) only contains `database` and `redis` keys. MinIO connectivity is never verified by the readiness probe, despite the code's own comment claiming it is. This is the same class of doc/code drift as the `tenancy.py` comment, just discovered on this review pass rather than the first one. Functionally: a MinIO outage today would not fail `/ready`, so an orchestrator relying on this probe wouldn't know storage was down.

**Risks:** High for the missing `SAC-ARCH-000` specifically — "GitHub main is the single source of truth" (your own stated rule) cannot be true while the foundational document everything else depends on isn't in GitHub main. Low-Medium for the `/ready` gap — cheap to fix, but it's a false sense of readiness in the interim.

**Priority:** Critical (getting `SAC-ARCH-000` committed), Low (fixing the `tenancy.py` stale comment and the `/ready` MinIO gap — both trivial, mechanical fixes).

**Recommendation:** Commit `SAC-ARCH-000 v2.1.0` into `documentation/` regardless of where it currently lives (this session, another tool, a physical document) so the repository is self-contained. Fix the `tenancy.py` docstring in the same pass as any other Stage 1.5 cleanup. For `/ready`, either add an actual MinIO `bucket_exists()` (or equivalent) check to the `checks` dict, or correct the docstring to stop claiming a check that doesn't run — implementing the real check is more useful, since it closes an actual observability gap rather than just fixing a comment. **Added to the roadmap as Track A item A6.**

**Timing:** Now — this one has no dependencies and directly affects whether the rest of this audit's citations can even be verified by a future reader.

---

## 16. Internationalization & Localization Architecture (New — identified during review)

**Status:** Not started, and not identified as a gap in the original audit pass — added here on review.

**Evidence:** `SA-ARCH-006`, one of the two locked architecture documents governing this platform, is itself written in Arabic. Principle #4 (Voice is a Primary Interface) explicitly lists "Translate this letter" and "Explain this legal notice" as core voice examples, not edge cases. `frontend/package.json` has no internationalization library (no `i18next`, `react-intl`, `FormatJS`, or equivalent), no locale-routing strategy, and no RTL (right-to-left) layout handling anywhere in the three existing pages — all layouts assume LTR text flow implicitly (e.g., no `dir` attribute handling, no logical CSS properties). `AIJobType` (`backend/app/models/ai_job.py`) has no `translation` job type, despite translation being named as a first-class capability in the locked principles.

**Gaps:** No locale negotiation strategy (how a user's or organization's language is determined), no translated-UI-string pipeline, no RTL support, no multilingual document handling (a document's OCR/extraction language may differ from the UI language, and may differ per-page within one document), and no integration point between "AI-assisted translation" and the not-yet-designed AI Gateway (§2).

**Risks:** Medium-High long-term, specifically because this platform's own governing documentation is bilingual (Arabic/English) and Government/Legal editions in Arabic-speaking or other non-English jurisdictions are a named part of the vision — treating multilingual support as a UI nice-to-have rather than a core platform capability risks the same retrofit-cost problem Principle #2 (mobile/desktop) was written to prevent, just for language instead of device.

**Priority:** Medium (design decision should exist before Stage 2 UI and AI Gateway work solidify assumptions that are hard to walk back — e.g., hardcoded LTR layout primitives, or an AI Gateway prompt-template system with no locale parameter).

**Recommendation:** A new ADR/design doc covering: locale negotiation (user preference vs. organization default vs. document-detected language), the translated-UI-string pipeline and who owns translations, RTL layout support (a Tailwind/component-level decision, ties into §5's design-token work), and how AI-assisted translation and multilingual document processing (OCR output language, cross-language search/classification) integrate with the AI Gateway (§2) rather than becoming a separate bolted-on service. Treat this as a core platform capability in the same tier as OCR or search, not a frontend-only concern.

**Timing:** Document before Stage 2 UI and AI Gateway design solidify (parallel with §2, §5); implementation follows once those land.

---

## 17. Industry/Vertical Edition Extension Model & Core-vs-Edition Capability Boundaries (New — identified during review)

**Status:** Unresolved architectural question — not answered by any existing document, and not surfaced as its own question in the original audit pass.

**Evidence:** Principle #1 names Legal, Healthcare, Education, and Government as future products sharing one engine with "no duplicated business logic... unless there is a compelling reason otherwise." `SA-ARCH-006` treats the Universal Connector Engine as the mechanism for reaching external systems, and Plugin Architecture (§9) is the only other extension mechanism mentioned anywhere (Principle #8). Neither document, nor any code, states **how an industry edition is actually assembled** — as a plugin/extension on the core, a `deployment_mode`-style flag with conditional logic in the same codebase, a separate deployable overlay that depends on the core as a library, or a bundled "feature package."

**Gaps:** This is two related open questions, not one:
1. **Extension model** — plugin-based editions vs. capability modules vs. deployment overlays vs. feature packages. Each has different implications for how independently editions can be developed/deployed/versioned, and for whether Principle #10 (API-first) still holds per-edition.
2. **Capability boundary** — what belongs in the shared core vs. what belongs in an edition. An illustrative (not decided) split, to make the question concrete:

   | Core Engine | Legal Edition | Healthcare Edition | Education Edition |
   |---|---|---|---|
   | OCR | Contract analysis | Medical terminology | Student records |
   | AI Gateway | Clause extraction | HL7/FHIR connectors | LMS integration |
   | Security | Legal templates | Clinical workflows | |
   | Search | | | |
   | Storage | | | |
   | Connectors | | | |
   | Workflow | | | |
   | API | | | |

   Without an explicit boundary like this, the realistic failure mode isn't a dramatic architecture violation — it's gradual: a Legal-specific field added to the core `Document` model "just this once," a Healthcare-specific branch added to the core AI Gateway "temporarily," each individually reasonable, cumulatively turning the shared engine into a Legal-and-Healthcare-flavored engine that Education and Government then have to work around. That outcome would violate Principle #1 without any single decision ever having been made to violate it.

**Risks:** High long-term, specifically because this is the kind of architectural erosion that's nearly invisible turn-by-turn and expensive to reverse once several editions' worth of core-boundary violations have accumulated.

**Priority:** Critical to answer as a documented decision before the second industry edition (beyond Enterprise/Home) is scoped — does not block current Stage 2 work (AI Gateway, connectors, voice), but should be resolved before, or at latest alongside, the Plugin Architecture ADR (§9), since the two questions are coupled.

**Recommendation:** A dedicated ADR evaluating the extension-model alternatives (plugin-based, capability modules, deployment overlays, feature packages) without prematurely committing to one, plus an explicit, versioned "core vs. edition" capability boundary list (starting from the illustrative split above) that every future PR touching a core module can be checked against. This is deliberately listed as a question to resolve, not a recommendation to pick an answer now — see the Missing Architecture Documents list below.

**Timing:** Document as part of Phase 2/3 baseline work (this is exactly the kind of decision the user's requested "Architecture Baseline v1.0" should either resolve or explicitly defer with reasoning) — before any Stage 2 code makes an implicit choice by default.

---

## Missing Architecture Documents Required Before "Enterprise-Grade AI Document Intelligence Platform" Is a Fair Description

1. **`SAC-ARCH-000 v2.1.0`** itself — referenced everywhere, present nowhere. (§15)
2. **AI Gateway / Multi-Model Orchestration ADR** — routing, prompt management, memory, safety, cost metering. (§2)
3. **Vector Search & Embeddings Strategy ADR** — pgvector vs. dedicated vector DB, before the embedding schema is built. (§8)
4. **Universal Connector Engine design doc** — connector contract, auth-per-type, sync/webhook model, conflict resolution. (§3)
5. **Voice Architecture ADR** — STT/TTS provider, streaming transport, confirmation that voice is a client of the AI Gateway, not a parallel path. (§6)
6. **Encryption & Secrets Management ADR** — TLS termination, at-rest encryption, secrets manager choice. (§7)
7. **Data Retention & Regulatory Compliance Framework** — retention, erasure, residency, PII handling, configurable per deployment mode *and* per industry edition (GDPR baseline; HIPAA for Healthcare; FERPA for Education; jurisdiction-specific rules for Legal/Government) — broadened on review from a GDPR-only scope. (§7, §8)
8. **Plugin Architecture & Extension SDK design doc** — manifest format, sandboxing, permission model, marketplace review. (§9) — sequencing depends on #14 below.
9. **HA / Horizontal Scaling & Kubernetes-readiness ADR** — Postgres/Redis/MinIO topology, connection pool policy, autoscaling. (§1)
10. **Disaster Recovery runbook** — RTO/RPO targets, failover procedure, drill cadence (backup mechanics already exist; policy doesn't). (§10)
11. **Mobile/Desktop Client Architecture doc** — shared logic strategy, React Native vs. native, OpenAPI-codegen pipeline. (§5, §13)
12. **Performance & Load Testing Strategy** — SLOs, load-test tooling, capacity baseline. (§12)
13. **Internationalization & Localization ADR** *(added on review)* — locale negotiation, translated-UI pipeline, RTL support, multilingual document processing, AI-assisted translation integration with the AI Gateway. (§16)
14. **Industry/Vertical Edition Extension Model & Core-vs-Edition Capability Boundary ADR** *(added on review)* — how Legal/Healthcare/Education/Government editions extend the shared engine (plugin-based vs. capability modules vs. deployment overlays vs. feature packages) and an explicit, versioned list of what belongs in the core vs. an edition. Load-bearing for Principle #1; should resolve before or alongside #8. (§17)

---

## Overall Assessment

The foundation is disciplined and unusually honest for a Milestone 1 codebase — the ADRs document real alternatives considered, the RLS isolation guarantee is empirically tested against a genuinely hard-to-get-right scenario (not just asserted), audit logging is actually wired rather than stubbed, and the backup/restore scripts genuinely verify recovery. Nothing here should block continued Stage 2 planning.

The pattern across nearly every "Critical" finding above is the same: **the code correctly hasn't built AI, connectors, voice, or vector search yet — but the documents that would keep those future features from becoming six ad-hoc integrations instead of one governed platform don't exist yet either.** That is the actual finding of this audit: not that Milestone 1 is behind schedule, but that the design decisions gating a coherent Stage 2 need to be made now, on paper, before the first line of AI/connector/voice code is written — exactly consistent with how Milestone 1 itself was run.

**Revision 1 addendum:** applying the long-term-vision lens explicitly (one shared engine, no duplicated business logic, API-first, identical backend across Web/Desktop/Mobile/Voice/future interfaces) surfaced two findings the original pass missed entirely rather than just under-scored: internationalization (§16) and the industry-edition extension model (§17). Of the two, §17 is the more consequential — it's the one open question where *not deciding* has a plausible failure mode that doesn't look like a failure at the time (industry-specific logic accreting into the shared core one reasonable-seeming PR at a time). It belongs in the same tier as the AI Gateway and Connector Engine decisions: not urgent to implement, but urgent to decide on paper before Stage 2 work starts making the choice implicitly.
