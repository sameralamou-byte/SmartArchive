# SA-TRACE-001 — Architecture Traceability Matrix

| Field | Value |
|---|---|
| Document ID | SA-TRACE-001 |
| Version | 1.5 |
| Owner | Architecture team — SmartArchive AI Platform |
| Status | **Locked** — constitutional document of Architecture Baseline v1.0 (promoted from Approved on second review, per [SA-ARCH-999](SA-ARCH-999_Architecture_Governance.md) §2). Note: per §8 of that document, this matrix is still a *derived* artifact that should be regenerated whenever a cornerstone changes — "Locked" here means its structure/method is stable, not that its rows are frozen. |
| Dependencies | [SA-ARCH-000](SA-ARCH-000_Master_Architecture.md), [SA-ARCH-011](SA-ARCH-011_Capability_Map.md), [SA-ARCH-012](SA-ARCH-012_Domain_Model.md), all `ADR-*` including **Approved** [ADR-009](adr/ADR-009-account-tenant-family-entitlement.md) |
| Purpose | Answer, for any principle, document, ADR, capability, code module, test, or CI job: what does this trace to, and what traces to it? This is a **derived artifact** — it should be regenerated/reviewed whenever any cornerstone document changes (per [SA-ARCH-999](SA-ARCH-999_Architecture_Governance.md) §8), not maintained as an independent source of truth. |

## How to use this matrix

- **"Which principles support this feature?"** → find the feature's capability in Section B, read its Principle column, cross-reference Section A for the principle's full text.
- **"Which ADR governs this module?"** → find the module in Section B's Repository Module column; its row gives the governing ADR.
- **"Which tests verify this capability?"** → Section B's Automated Tests column.
- **"If we change this architecture decision, what code and documentation are affected?"** → find the ADR in Section B (it may appear in multiple capability rows), read every row it appears in, plus check Section A for which principles it traces back to.

Every row in Section B carries a **Traceability Status**: `Fully traced` (principle → doc → ADR → module → test → CI all exist), `Partially traced` (some links exist, some don't), or `Not yet traceable` (capability is designed or conceptual only — nothing to trace to yet, and that's stated honestly rather than papered over).

---

## Section A — Principles → Governing Documents

| # | Principle | Governing document |
|---|---|---|
| 1 | One Platform, Multiple Products | [SA-ARCH-000](SA-ARCH-000_Master_Architecture.md) §2.1, §7 (Industry Edition question) |
| 2 | Mobile-First AND Desktop-First | [SA-ARCH-000](SA-ARCH-000_Master_Architecture.md) §2.2; [SA-AUDIT-002](SA-AUDIT-002_Enterprise_Architecture_Audit.md) §5, §13 |
| 3 | Responsive Design Everywhere | [SA-ARCH-000](SA-ARCH-000_Master_Architecture.md) §2.3; [SA-AUDIT-002](SA-AUDIT-002_Enterprise_Architecture_Audit.md) §5 |
| 4 | Voice is a Primary Interface | [SA-ARCH-000](SA-ARCH-000_Master_Architecture.md) §2.4; [SA-AUDIT-002](SA-AUDIT-002_Enterprise_Architecture_Audit.md) §6 |
| 5 | Integrated Mode is the Default | [SA-ARCH-000](SA-ARCH-000_Master_Architecture.md) §2.5, §4 (Deployment Model); SA-ARCH-006 |
| 6 | Standalone Mode | [SA-ARCH-000](SA-ARCH-000_Master_Architecture.md) §2.6, §4; SA-ARCH-006 |
| 7 | AI Everywhere | [SA-ARCH-000](SA-ARCH-000_Master_Architecture.md) §2.7; [SA-AUDIT-002](SA-AUDIT-002_Enterprise_Architecture_Audit.md) §2, §8 |
| 8 | Enterprise Grade | [SA-ARCH-000](SA-ARCH-000_Master_Architecture.md) §2.8, §3 (Core Decisions); ADR-001 through ADR-005 |
| 9 | Human-Centered | [SA-ARCH-000](SA-ARCH-000_Master_Architecture.md) §2.9 |
| 10 | API-First, UI-Independent | [SA-ARCH-000](SA-ARCH-000_Master_Architecture.md) §2.10; [SA-AUDIT-002](SA-AUDIT-002_Enterprise_Architecture_Audit.md) §4 |

---

## Section B — Capabilities → ADRs → Modules → Tests → CI/CD

| Capability | Principle(s) | ADR / Design Doc | Repository Module(s) | Automated Tests | CI/CD Job | Traceability Status |
|---|---|---|---|---|---|---|
| Identity | #1, #8 | ADR-002 (Tenant/RLS); **ADR-009** (**Approved** — Account vs Tenant vs Family); [SA-ARCH-014-01](Architecture/SA-ARCH-014_Account_Family_and_Entitlement_Architecture/SA-ARCH-014-01-Account_Architecture.md) | `backend/app/models/organization.py`, `models/user.py` (Account **not implemented**) | `test_rls_isolation.py` | `ci.yml` → `backend` | Partially traced (org/user + RLS proven; Account/Family identity is architecture-only, not implemented) |
| Authentication | #8 | *(implementation detail under SA-ARCH-001 §4; no dedicated ADR)* | `backend/app/security/jwt.py`, `routers/v1/auth.py` | `test_auth_api.py` | `ci.yml` → `backend` | Fully traced |
| Authorization | #8 | ADR-004; **ADR-009** (Entitlement is not Authorization) | `backend/app/security/authorize.py` | `test_authorize.py` | `ci.yml` → `backend` | Fully traced (permission gate). Entitlement is a separate capability — not implemented. |
| Entitlement | #1, #8 | **ADR-009** (**Approved**); [SA-ARCH-014-03](Architecture/SA-ARCH-014_Account_Family_and_Entitlement_Architecture/SA-ARCH-014-03-Family_Entitlement_Architecture.md), [SA-ARCH-014-04](Architecture/SA-ARCH-014_Account_Family_and_Entitlement_Architecture/SA-ARCH-014-04-Subscription_and_Entitlement_Service.md), [SA-ARCH-014-05](Architecture/SA-ARCH-014_Account_Family_and_Entitlement_Architecture/SA-ARCH-014-05-Trial_Eligibility_and_History.md) | none | none | none | Not yet traceable — Approved architecture decision; standing package SA-ARCH-014 remains Draft; **not implemented** |
| Trust & Abuse | #8, #9 | **ADR-009** (**Approved**); [SA-ARCH-014-06](Architecture/SA-ARCH-014_Account_Family_and_Entitlement_Architecture/SA-ARCH-014-06-Abuse_and_Risk_Protection.md) | existing `core/rate_limit.py` is generic HTTP hardening only, not this capability | none dedicated | `ci.yml` → `backend` (rate-limit tests if present do not implement trial/Family abuse) | Not yet traceable — Approved architecture decision; standing package SA-ARCH-014 remains Draft; **not implemented**. No automatic permanent account ban/termination in v1. |
| Storage | #8 | ADR-003; formalized as the reference **Storage Contract** in ADR-007 (**Approved**) | `backend/app/services/storage_service.py` | `test_storage_service.py` | `ci.yml` → `backend` | Fully traced |
| Audit | #8 | *(no dedicated ADR — covered by SA-ARCH-001's general enterprise-grade requirement)*; future Family/trial/entitlement events per ADR-009 / SA-ARCH-014-08 | `models/audit_log.py`, wired in `routers/v1/files.py` | *(none found)* | `ci.yml` → `backend` (runs, doesn't assert) | Partially traced — tenant-scoped audit wired in code, not asserted. Platform-level Family/trial audit **not implemented**. |
| Monitoring | #8 | *(no dedicated ADR)* | `core/metrics.py`, `infrastructure/prometheus/`, `infrastructure/grafana/` | *(none — no test asserts metrics content)* | Not part of CI | Partially traced — real config, unverified by automation |
| Administration | #8 | *(no dedicated ADR)* | `routers/v1/users.py` | *(none found dedicated to this router)* | `ci.yml` → `backend` | Partially traced |
| OCR | #7 | ADR-006 + ADR-007 (OCR Contract) — **Approved**; AI Gateway orchestration itself still Wave 1 (`B1`) | `models/ocr_job.py` (schema only) | none | none | Not yet traceable — contract Approved, no implementation |
| Search | #7 | ADR-006 + ADR-007 (Search Contract) — **Approved**; vector strategy still Wave 1 (`B2`) | none | none | none | Not yet traceable — contract Approved, no implementation |
| AI | #7 | ADR-006 + ADR-007 (AI Provider Contract) — **Approved**; AI Gateway orchestration itself still Wave 1 (`B1`) | `models/ai_job.py` (schema only) | none | none | Not yet traceable — contract Approved, no implementation |
| Voice | #4 | ADR-006 + ADR-007 (Voice Contract) — **Approved**; orchestration still Wave 3 (`B6`) | none | none | none | Not yet traceable — contract Approved, no implementation |
| Workflow | #7, #8 | ADR-006 + ADR-007 (Workflow Contract, added on review) — **Approved**; orchestration itself still undesigned | none (only `DocumentStatus` lifecycle enum exists — not a workflow engine) | none | none | Not yet traceable — contract Approved, no implementation |
| Notifications | — | ADR-007 (Notification Contract) — **Approved**; orchestration + ACE per [SA-ARCH-000](SA-ARCH-000_Master_Architecture.md) §5 (partially specified) | `models/notification.py` (schema only) | none | none | Not yet traceable — contract Approved, no implementation |
| Connectors | #5 | ADR-006 (Platform Extension Model) + ADR-007 (Connector Contract) — **Approved**; detailed connector semantics still `B3` | `deployment_mode` field on `Organization` only | none | none | Not yet traceable — extension model + contract Approved, no implementation |
| Reporting | #8 | Not yet designed | none | none | none | Not yet traceable |
| Localization | #2, #3, #4 | **ADR-008 (Internationalization & Localization Strategy) — Approved** | none | none | none | Not yet traceable — strategy Approved, no implementation |
| Compliance | #8 | Not yet designed — [SA-AUDIT-002](SA-AUDIT-002_Enterprise_Architecture_Audit.md) §7, Wave 2 (`B5`) | `audit_log.py` (partial building block only) | none | none | Not yet traceable |
| Plugin Runtime | #8 | **ADR-007 (Extension Envelope) — Approved** for the interface half; `B9-runtime` (sandboxing/marketplace) still Wave 3, undesigned | `plugins/` (empty stub) | none | none | Not yet traceable — interface Approved, no implementation |
| Industry Extensions | #1 | **ADR-006 (Platform Extension Model) — Approved** — Industry Editions are modeled there as a special case of Extension | none | none | none | Not yet traceable — model Approved, no implementation |
| Knowledge Graph | #7 | Not yet designed; depends on AI + Search existing first | none | none | none | Not yet traceable |
| Automation | #7, #8 | ADR-007 (Workflow Contract's rule-evaluation operation) — **Approved**; depends on the event bus (ADR-005) having real subscribers | `backend/app/events/bus.py` (plumbing only — zero subscribers by design per ADR-005) | none | none | Not yet traceable — contract Approved, no implementation |

**Correction on review:** this row (Automation) was missing from the original version of this matrix — [SA-ARCH-011](SA-ARCH-011_Capability_Map.md) listed 21 capabilities, but Section B originally covered only 20. Added in v1.1. Wave B (v1.4) adds Entitlement and Trust & Abuse; Identity and Audit rows are extended. Capability count in Section B is now **23**.

## Section C — Account / Family / Entitlement decisions (ADR-009)

Architecture: **ADR-009 is Approved.** Standing package **SA-ARCH-014 remains Draft**. **Not implemented.** Rows must not be read as running product behavior.

| Requirement / Decision | Architecture | Traceability Status |
|---|---|---|
| Account as durable identity | [ADR-009](adr/ADR-009-account-tenant-family-entitlement.md) / [SA-ARCH-014-01](Architecture/SA-ARCH-014_Account_Family_and_Entitlement_Architecture/SA-ARCH-014-01-Account_Architecture.md) | Not yet traceable — ADR-009 Approved; SA-ARCH-014 Draft; not implemented |
| Tenant as isolation boundary | [ADR-002](adr/ADR-002-multi-tenancy.md) / [SA-ARCH-014-02](Architecture/SA-ARCH-014_Account_Family_and_Entitlement_Architecture/SA-ARCH-014-02-Personal_Tenant_Architecture.md) | Partially traced — RLS realized; Personal Tenant as Account-bound archive not implemented |
| Family as entitlement group | ADR-009 / [SA-ARCH-014-03](Architecture/SA-ARCH-014_Account_Family_and_Entitlement_Architecture/SA-ARCH-014-03-Family_Entitlement_Architecture.md) | Not yet traceable — ADR-009 Approved; SA-ARCH-014 Draft; not implemented |
| Entitlement separate from authorization | [ADR-004](adr/ADR-004-authorization.md) / [SA-ARCH-014-04](Architecture/SA-ARCH-014_Account_Family_and_Entitlement_Architecture/SA-ARCH-014-04-Subscription_and_Entitlement_Service.md) | Authorization fully traced; Entitlement not implemented |
| One trial per Account | [SA-ARCH-014-05](Architecture/SA-ARCH-014_Account_Family_and_Entitlement_Architecture/SA-ARCH-014-05-Trial_Eligibility_and_History.md) | Not yet traceable — ADR-009 Approved; SA-ARCH-014 Draft; not implemented |
| Abuse signals, not verdicts; no automatic permanent account ban/termination in v1 | [SA-ARCH-014-06](Architecture/SA-ARCH-014_Account_Family_and_Entitlement_Architecture/SA-ARCH-014-06-Abuse_and_Risk_Protection.md); Founder decision 2026-08-16 | Not yet traceable — ADR-009 Approved; SA-ARCH-014 Draft; not implemented |
| Privacy boundaries (Owner cannot read member archives) | [SA-ARCH-014-07](Architecture/SA-ARCH-014_Account_Family_and_Entitlement_Architecture/SA-ARCH-014-07-Privacy_and_GDPR_Boundaries.md) | Not yet traceable — ADR-009 Approved; SA-ARCH-014 Draft; not implemented |
| Family invitation lifecycle | [SA-ARCH-014-08](Architecture/SA-ARCH-014_Account_Family_and_Entitlement_Architecture/SA-ARCH-014-08-Family_Invitation_Lifecycle.md) | Not yet traceable — ADR-009 Approved; SA-ARCH-014 Draft; not implemented |
| Owner/member boundaries | [SA-ARCH-014-09](Architecture/SA-ARCH-014_Account_Family_and_Entitlement_Architecture/SA-ARCH-014-09-Owner_and_Member_Access_Boundaries.md) | Not yet traceable — ADR-009 Approved; SA-ARCH-014 Draft; not implemented |

## Cross-Cutting Architecture Decisions (not owned by one capability)

| Decision | ADR | Repository Module(s) | Automated Tests | CI/CD Job | Traceability Status |
|---|---|---|---|---|---|
| Fully async backend | ADR-001 | `backend/app/core/database.py`, all routers/services | Exercised implicitly by every backend test (`asyncio_mode = "auto"` in `pyproject.toml`) | `ci.yml` → `backend` | Fully traced |
| Event-driven core (in-process bus) | ADR-005 | `backend/app/events/bus.py`, `document_events.py` | *(no dedicated bus test found — only exercised indirectly via `files.py` publishing on upload/delete)* | `ci.yml` → `backend` | Partially traced |
| Repository module layout | SA-ARCH-001 §7 | Entire `backend/app/` tree | N/A (structural convention, not directly testable) | N/A | Fully traced (by inspection) |
| Frontend styling (Tailwind + Zustand) | SA-ARCH-001 §3 | `frontend/tailwind.config.js`, `frontend/src/store/` | `authStore.test.ts` (added with Track A2 — the platform's first frontend test) | `ci.yml` → `frontend` (lint, **test**, build — Track A2 closed) | Fully traced |

## Rollup

Of the **23** capabilities in Section B: **3 fully traced** (Authentication, Authorization, Storage), **4 partially traced** (Identity, Audit, Monitoring, Administration), **16 not yet traceable** (previous 14 plus **Entitlement** and **Trust & Abuse**). Entitlement and Trust & Abuse cite **Approved ADR-009** and Draft SA-ARCH-014 — architecture documented, **not implemented**. This matrix does not treat Approved architecture as implementation.

**This matrix's own maintenance rule:** any PR that adds an ADR, a module, a test, or wires up a previously-"not yet traceable" capability should update the corresponding row here in the same PR — per [SA-ARCH-999](SA-ARCH-999_Architecture_Governance.md), a Stage 2 implementation PR should cite which row of this matrix it moves from `Not yet traceable` to `Partially traced` or `Fully traced`.

## Revision History

| Rev | Change |
|---|---|
| 1.0 | Initial matrix, authored as the final artifact of Architecture Baseline v1.0. All "not yet traceable"/"partially traced" findings verified directly against the repository (grepped for tests, checked CI job contents) rather than assumed from the audit's prose. |
| 1.1 | Stage 2 kickoff update — permitted under this document's own "Locked means structure/method stable, not rows frozen" rule. Updated OCR/Search/AI/Voice/Notifications/Connectors/Plugin Runtime/Industry Extensions/Localization/Storage rows to cite ADR-006/007/008 (all Draft, pending review) instead of "not yet designed." **Corrected a genuine gap found on this review**: the Automation capability (in SA-ARCH-011) was missing from Section B entirely in v1.0; added, and the Rollup recount corrected from a previously-miscounted "19 capabilities, 4 fully traced" to the accurate "21 capabilities, 3 fully traced, 4 partially traced, 14 not yet traceable." |
| 1.2 | Track A closed (SA-ROADMAP-001 Rev 3). Updated the Frontend styling cross-cutting row from "no frontend tests currently run in CI" to Fully traced, now that `authStore.test.ts` exists and `ci.yml`'s frontend job actually runs `npm run test`. |
| 1.3 | ADR-006/007/008 Approved. Updated all rows citing them from Draft to Approved (Storage, OCR, Search, AI, Voice, Workflow, Notifications, Connectors, Localization, Plugin Runtime, Industry Extensions, Automation). No traceability-status changes yet — Approved decisions aren't implementation, and this matrix doesn't conflate the two; rows move to Partially/Fully traced only once Milestone S2.1's reference extension actually exists. |
| 1.4 | Wave B (Founder authorization 2026-08-16), authority **ADR-009**. Added Entitlement and Trust & Abuse capability rows (Not yet traceable). Extended Identity and Audit. Added Section C mapping Account/Family/Entitlement decisions to SA-ARCH-014. No implementation claimed. |
| 1.5 | Founder alignment after Wave B: cite **ADR-009** as **Approved**. SA-ARCH-014 remains Draft. No implementation claimed. |
