# SA-ARCH-000 — Master Architecture

| Field | Value |
|---|---|
| Document ID | SA-ARCH-000 |
| Version | 1.5 |
| Owner | Architecture team — SmartArchive AI Platform |
| Status | **Locked** — constitutional document of Architecture Baseline v1.0 (Approved 2026-07-30; promoted to Locked on second review the same day, per [SA-ARCH-999](SA-ARCH-999_Architecture_Governance.md) §2) |
| Supersedes | `SAC-ARCH-000 v2.1.0` — cited as a dependency by [SA-ARCH-001](SA-ARCH-001.md) and [SA-ARCH-006](SA-ARCH-006_Integration_Standalone_Reminders.docx), never located in this repository or elsewhere despite repeated search (see [SA-AUDIT-002](SA-AUDIT-002_Enterprise_Architecture_Audit.md) §15). This document is authored fresh, consolidating everything established across the locked principles, SA-ARCH-001, SA-ARCH-006, ADR-001 through ADR-005, and the audit/roadmap process, rather than reconstructing the original from memory. Where the original apparently defined mechanisms this document only knows by name (see §5), that gap is stated honestly rather than filled in by inference. |
| Purpose | The single source of truth for what SmartArchive's architecture *is*. Governs every future ADR, design doc, and implementation decision, per [SA-ARCH-999](SA-ARCH-999_Architecture_Governance.md). |

## 1. What SmartArchive Is

SmartArchive is one AI-driven document intelligence engine serving multiple products — Enterprise, Home, and future industry editions (Legal, Healthcare, Education, Government) — from a single shared core, accessible identically from Web, Desktop, Mobile, Voice, and future interfaces via one API-first backend. It is not a web application with a mobile afterthought, not a document store with AI bolted on, and not a per-industry fork with a shared library underneath — it is one platform, engineered enterprise-grade from the first commit, that different products and interfaces all sit on top of.

## 2. The Ten Locked Principles

These are non-negotiable, per the user's explicit direction, and gate every architectural recommendation made about this platform:

1. **One Platform, Multiple Products** — one shared Engine serves Enterprise, Home, and future verticals. No duplicated business logic without a compelling, documented reason.
2. **Mobile-First AND Desktop-First** — excellent experience on Web, Desktop, Mobile, Tablet, and future interfaces (voice, wearable, kiosk), all supported by the architecture, APIs, authentication, and permissions from day one.
3. **Responsive Design Everywhere** — every screen works from a 6" phone through an ultra-wide monitor. No desktop-only or mobile-only screens or logic.
4. **Voice is a Primary Interface** — the system works keyboard-free wherever possible ("Archive this contract," "Find my electricity bill," "Translate this letter").
5. **Integrated Mode** — when a customer already runs SAP, Dynamics, Odoo, Salesforce, Zoho, SharePoint, or Google Workspace, SmartArchive connects to and augments it as the AI intelligence layer, rather than replacing it.
6. **Standalone Mode** — for home users, small offices/businesses, NGOs, and startups with no existing system, SmartArchive provides a complete organizational document-intelligence environment on its own; stays lightweight and simple by design.
7. **AI Everywhere** — AI is not a bolt-on module; it participates in OCR, search, classification, chat, summaries, translation, reminder extraction, automation, recommendations, and the knowledge graph.
8. **Enterprise Grade** — multi-tenant, RBAC/ABAC, audit logs, versioning, encryption, scalable APIs, plugin architecture, event-driven services, assumed from the start.
9. **Human-Centered** — the AI always explains, assists, and simplifies without taking control away from the user.
10. **API-First, UI-Independent Architecture** — every capability exists as an API before it exists as a screen; Web, Desktop, Mobile, Voice, and third-party integrations all consume the same APIs.

### The Unifying Requirement

This is not an eleventh principle — it's the single sentence that states what Principles #1, #2, #5, #6, #7, and #10 jointly require, elevated to first-class status because it's the thesis the individual principles compose into, not a separate rule alongside them:

> **SmartArchive must behave as a single intelligent platform regardless of device, deployment mode, or edition.**

Concretely: Desktop and Mobile expose the same capabilities (#2, #10). Cloud and Standalone deployments expose the same APIs wherever practical (#5, #6, #10). Home, SMB, Enterprise, and future vertical editions share the same core Engine (#1). Voice, chat, OCR, automation, connectors, and AI are different interaction layers *over* the same platform — not separate products (#4, #7, #10). Every future architectural decision in §3 onward, and every ADR written under [SA-ARCH-999](SA-ARCH-999_Architecture_Governance.md), should be checked against this sentence specifically, not just against the ten principles individually — a design can satisfy each principle in isolation while still fragmenting the platform if this synthesis is lost sight of.

## 3. Core Architectural Decisions (Locked, Milestone 1)

Detailed rationale and alternatives-considered live in the individual ADRs; this section is the index, not a restatement.

| Decision | Governing document | Status |
|---|---|---|
| Multi-tenancy: shared schema + PostgreSQL RLS, forced on every tenant table | [SA-ARCH-001](SA-ARCH-001.md) §1, ADR-002 | Locked |
| Fully async backend: FastAPI → SQLAlchemy 2.0 async → asyncpg | [SA-ARCH-001](SA-ARCH-001.md) §2, ADR-001 | Locked |
| Frontend: TailwindCSS + Zustand (not Material UI) | [SA-ARCH-001](SA-ARCH-001.md) §3 | Locked |
| Authorization: centralized `authorize()` gate, RBAC now / ABAC-ready | [SA-ARCH-001](SA-ARCH-001.md) §4, ADR-004 | Locked |
| API versioning: `/api/v1/...` from commit one | [SA-ARCH-001](SA-ARCH-001.md) §5 | Locked |
| Event-driven core: in-process bus, swappable later | [SA-ARCH-001](SA-ARCH-001.md) §6, ADR-005 | Locked — but see §6 of this document for a load-bearing caveat |
| Object storage: MinIO/S3-compatible | ADR-003 | Locked |
| Repository module layout: `routers/services/repositories/models/schemas/security/events/tasks/tests` | [SA-ARCH-001](SA-ARCH-001.md) §7 | Locked |
| Platform Extension Model: Core owns orchestration/policy/lifecycle; Extensions provide vendor-specific implementations, via 9 governed categories (Intake added per ADR-011) | ADR-006 | Approved |
| Extension Interface & Platform Contracts: shared Extension Envelope + 10 named contracts (Storage, Connector, AI Provider, OCR, Authentication, Notification, Search, Voice, Workflow, Intake — Intake added per ADR-011) | ADR-007 | Approved |
| Internationalization & Localization: locale cascade, RTL via design tokens, translation as an AI Provider Contract operation, covers formatting/currency/timezone/collation beyond language | ADR-008 | Approved |

## 4. Deployment Model

**Per [ADR-013](adr/ADR-013-integrated-standalone-esa-equal-modes.md) (Approved), superseding this section's prior "Integration-first, standalone as a designed fallback" wording:** Standalone, Integrated, and Hybrid are supported operating configurations of the same ESA platform architecture. Standalone and Integrated are equal first-class modes; neither is a fallback for the other. Standalone ESA provides the organizational document-intelligence environment without requiring an external ERP/CRM/business system. Integrated ESA adds governed connections to relevant existing systems while preserving SmartArchive's own security, organizational, document-intelligence, and intake foundations. Hybrid configuration allows these approaches to coexist where appropriate within one Tenant. Operating mode is explicit per Tenant and does not create a separate ESA product architecture. This applies across Enterprise (B2B) and Home (B2C) products wherever an institutional environment exists, and covers commercial companies, factories/warehouses, government bodies, and any organization running its operations through existing administrative software.

`organizations.deployment_mode` (`integrated | standalone | hybrid`) is modeled in the schema from day one (see [SA-AUDIT-002](SA-AUDIT-002_Enterprise_Architecture_Audit.md) §11 — confirmed on track, no behavioral branching wired yet since connectors don't exist yet).

## 5. Universal Reminders & Scheduling Engine (Layer 1D)

Per SA-ARCH-006 §5: a shared reminders/scheduling capability spans both deployment modes and both products (Enterprise and Home), known as the **Universal Reminders & Scheduling Engine**. Every reminder — regardless of source (a document, an email, an event in an external system, or manual entry) — is described as passing through a layer called **ACE** before reaching the user, for appropriate timing and context-sensitive phrasing ("Calm Cards"), so users aren't flooded with unnecessary notifications.

**Honest gap, stated rather than filled in:** SA-ARCH-006 refers to ACE, the "Confidence Gate," and "Calm Cards" as existing concepts, presumably defined in the unrecovered `SAC-ARCH-000 v2.1.0` (§ Supersedes, above). This document only knows these mechanisms by name and the one-sentence behavioral description SA-ARCH-006 gives them (context-sensitive timing and phrasing to avoid notification overload) — it does not know their actual implementation contract, and does not invent one. Any Stage 2 work touching reminders, notifications, or the ACE layer should treat its detailed design as an open question, not an assumed-solved one — this is exactly the kind of gap [SA-ROADMAP-001](SA-ROADMAP-001_Architecture_Roadmap.md)'s Architecture Gates exist to catch before implementation starts on an assumption nobody actually verified.

## 6. Known Coupling: Event Bus and Horizontal Scaling

Flagged during the Phase 2 roadmap review ([SA-ROADMAP-001](SA-ROADMAP-001_Architecture_Roadmap.md), Wave 3 / B8): the in-process event bus (ADR-005) is explicitly non-durable and single-process by design. If Stage 2's AI Gateway and Connector Engine job orchestration come to depend on it for async dispatch, then horizontal scaling (multiple backend instances) forces the Redis Streams/Kafka swap ADR-005 already anticipated — turning what ADR-005 framed as an optional future upgrade into a hard prerequisite the moment a second instance is needed. This is noted here, at the master-architecture level, specifically so it isn't rediscovered mid-implementation.

## 7. Extension Model & Industry Editions — Resolved via ADR-006 / ADR-007

**Previously unresolved; resolved 2026-07-30.** How SmartArchive extends beyond its Core Engine — for industry editions and for every provider/connector/engine type alike — is decided by [ADR-006](adr/ADR-006-platform-extension-model.md) as a rule, not a fixed list: a capability's orchestration/policy/security/data model is Core; a specific third-party implementation of part of it is an Extension, reachable only through that capability's Platform Contract. Industry Editions (Legal, Healthcare, Education, Government) are one instance of this pattern — a bundle of capability-level Extensions plus configuration, never a fork of Core code. The interface shape Extensions implement is [ADR-007](adr/ADR-007-extension-interface-platform-contracts.md)'s Extension Envelope plus 10 named Platform Contracts. This closes the question SA-AUDIT-002 §17 raised and the risk it warned about (industry-specific logic gradually eroding the shared core) — see those two ADRs for the full decision and alternatives considered; this section only indexes the outcome, per §9 below.

## 8. Internationalization & Localization — Resolved via ADR-008

**Previously tracked as an open question; resolved 2026-07-30.** Per [SA-AUDIT-002](SA-AUDIT-002_Enterprise_Architecture_Audit.md) §16: multilingual support (including the Arabic in which SA-ARCH-006 itself is written) is a platform capability on the same tier as OCR or Search, not a UI-layer concern to defer — and per the approval review, this extends beyond translated strings to date/number/currency/timezone/address formats and collation. [ADR-008](adr/ADR-008-internationalization-localization.md) decides the locale-negotiation cascade (User → Organization → platform default), RTL support via the shared frontend design-token system, and translation as an AI Provider Contract operation rather than a separate subsystem — see that ADR for the full decision.

## 9. Governing Document Map

This document is one of seven cornerstones that form Architecture Baseline v1.0, per [SA-ARCH-999](SA-ARCH-999_Architecture_Governance.md) §8:

- **[SA-ARCH-013](SA-ARCH-013_Product_Vision_and_Evolution.md)** — the North Star: *why* SmartArchive exists, upstream of everything below.
- **SA-ARCH-000** (this document) — what the architecture *is*, technically.
- **[SA-ARCH-999](SA-ARCH-999_Architecture_Governance.md)** — how architecture decisions are made, named, owned, and retired.
- **[SA-AUDIT-002](SA-AUDIT-002_Enterprise_Architecture_Audit.md)** — current state of the codebase against this document, as of the last review.
- **[SA-ROADMAP-001](SA-ROADMAP-001_Architecture_Roadmap.md)** — the dependency-ordered plan for closing the gaps the audit found.
- **[SA-ARCH-011](SA-ARCH-011_Capability_Map.md)** — what capabilities exist and who owns them.
- **[SA-ARCH-012](SA-ARCH-012_Domain_Model.md)** — the shared business-domain language.

**[SA-TRACE-001](SA-TRACE-001_Architecture_Traceability_Matrix.md)** sits alongside as a derived artifact, per SA-ARCH-999 §8.

Individual ADRs (`ADR-001` through `ADR-008`, and all future ones) supply the detailed rationale behind any single row in §3 of this document; this document does not duplicate that reasoning, only indexes it.

## Revision History

| Rev | Change |
|---|---|
| 1.0 | Initial authoring. Consolidates the locked principles, SA-ARCH-001/006, and the Phase 1/2 audit-and-roadmap findings into one master document, superseding the unrecoverable `SAC-ARCH-000 v2.1.0` citation in SA-ARCH-001 and SA-ARCH-006 (both updated to reference this document instead). Second review (same day) added the Unifying Requirement synthesis to §2 and promoted this document to `Locked` as part of Architecture Baseline v1.0. |
| 1.1 | Synchronization update following the Approval of ADR-006 (Platform Extension Model), ADR-007 (Extension Interface & Platform Contracts), and ADR-008 (Internationalization & Localization) — per [SA-ARCH-999](SA-ARCH-999_Architecture_Governance.md)'s process, this records those ADRs' already-made decisions, it does not introduce new ones. §3's decisions table gained three rows; §7 (previously "Unresolved") and §8 now cite the resolving ADRs; §9's cornerstone list was also corrected to match reality (it had gone stale, still saying "four, soon five" after SA-ARCH-012/013 and SA-TRACE-001 already existed). |
| 1.2 | Restricted synchronization following the Founder-approved ESA ADR-010–013 Architecture Draft Package (Approval 2026-08-29; Synchronization Impact Audit 2026-08-30) — Founder-authorized this pass to record ADR-013's decision only, per an explicit two-restriction scope. §2 Principles #5/#6 reworded to remove the "Integrated Mode is the Default" / fallback framing (title and text only — the principles' existence and numbering are unchanged). §4 Deployment Model rewritten verbatim to ADR-013's Founder-approved replacement wording: Standalone, Integrated, and Hybrid are equal-footing configurations of one ESA platform architecture, not a default/fallback pair. No other section changed — ADR-010/011/012 material is deliberately **not** added to this document in this pass (Founder restriction: SA-ARCH-000 stays lean; hierarchy, Intake, and AI-permission architecture have their own authoritative locations in SA-ARCH-011/012 and ADR-006/007). |
| 1.3 | Post-synchronization consistency correction, Founder-approved (2026-08-30) — a single factual correction, not an architecture change, per [SA-ARCH-999](SA-ARCH-999_Architecture_Governance.md) §2's distinction ("a correction to a factual error... is not an architecture change and doesn't need [the ADR] process"). §3's Core Decisions table row for ADR-007 corrected from "9 named contracts" to "10 named contracts," naming Intake and citing ADR-011 as the reason for the count change — this row had gone stale after ADR-007's 1.1 synchronization (recorded above, Rev 1.2 history entry, and in ADR-007's own Revision History) added the Intake Contract but this document's own summary row wasn't updated in that pass. No other content changed. |
| 1.4 | Second post-synchronization consistency correction, Founder-approved (2026-08-30) — same factual-correction basis as Rev 1.3 ([SA-ARCH-999](SA-ARCH-999_Architecture_Governance.md) §2). §3's Core Decisions table row for ADR-006 corrected from "8 governed categories" to "9 governed categories," citing ADR-011 as the reason (the Intake Extension Category). This row had gone stale for the identical reason as the Rev 1.3 correction — ADR-006's own Rev 1.1 synchronization added the category but this document's summary row wasn't updated in that pass. No other content changed. |
| 1.5 | Third post-synchronization consistency correction, Founder-approved (2026-08-30) — same factual-correction basis as Rev 1.3/1.4 ([SA-ARCH-999](SA-ARCH-999_Architecture_Governance.md) §2). §7 corrected from "9 named Platform Contracts" to "10 named Platform Contracts" — a second occurrence of the same staleness corrected in §3 (Rev 1.3), found during that correction's verification pass and reported then, now corrected under this explicit Founder authorization. No contract names were added to §7 (it named none before this correction, only a count) and no other §7 wording or architectural meaning changed. |
