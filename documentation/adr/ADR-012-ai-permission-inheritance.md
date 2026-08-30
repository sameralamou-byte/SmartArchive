# ADR-012 — AI Permission Inheritance

| Field | Value |
|---|---|
| Document ID | ADR-012 |
| Title | AI Permission Inheritance (including Human Authority, Governed Automation, and Future Agent Security) |
| Version | 1.2 |
| Status | **Approved** (Founder Approval, round 1 review of Rev 1.1 — content unchanged from Rev 1.1; not yet Locked per `SA-ARCH-999` §2, which requires surviving a subsequent review cycle first) |
| Date | 2026-08-29 |
| Owner | Architecture team — SmartArchive AI Platform |
| Classification | **Internal — Security-Critical** |
| Related | [ADR-004](ADR-004-authorization.md) (Locked), [ADR-002](ADR-002-multi-tenancy.md) (Locked), [ADR-006](ADR-006-platform-extension-model.md), [ADR-007](ADR-007-extension-interface-platform-contracts.md) (AI Provider Contract, Workflow Contract), [ADR-010](ADR-010-esa-organizational-hierarchy-and-boundary-model.md) (**Approved**, Rev 1.2), [ADR-011](ADR-011-device-and-intake-governance.md) (**Approved**, Rev 1.2), [SA-ROADMAP-001](../SA-ROADMAP-001_Architecture_Roadmap.md) (`B1` AI Gateway) |
| Resolves | The permission-aware-AI gap named in the ESA Core Architecture Reconciliation Audit (2026-08-29) — the single most safety-critical finding in that audit |
| Part of package | ESA Architecture Draft Package, 2026-08-29 |
| Sequencing | **Must be Approved before `B1` (AI Gateway) design begins** — recommend adding as a named conformance target in `SA-ROADMAP-001`'s Gate 3, alongside `B9-iface` |

## 1. Status

**Approved.** Founder Approval recorded 2026-08-29 (round 1 security review of Rev 1.1, content unchanged — see Revision History). The central rule — AI must never become a permission bypass — and all twelve reviewed areas (§3.1–§3.9, §21, §22, and the identity/vector/derived-artifact/cache/audit/citation/cross-tenant/intake-coordination invariants throughout) are Founder-approved as the required security foundation for `B1`/`B2` design. Not yet Locked per `SA-ARCH-999` §2 (Locked status requires surviving a subsequent review cycle beyond first Approval).

**Synchronization not yet authorized.** Per Founder instruction, the coordinated synchronization pass to Locked documents (`SA-ARCH-000`, `SA-ARCH-011`, `SA-TRACE-001`, and the ADR-007 cross-reference named in §16) remains parked until ADR-013 has also been reviewed, for one coordinated pass across all four ADRs in this package. No AI Gateway, retrieval, agent, vector-search, cache, workflow, or authorization code is authorized by this document.

## 2. Context / Problem

`ADR-007`'s AI Provider Contract defines `complete / embed / classify` plus cost metering — it says nothing about authorization. `ADR-004`'s `authorize()` governs what a User may do, but no document states that AI retrieval (search, summarization, relationships, recommendations, generated answers, conversational retrieval) must filter through it **per document** before results reach a user.

**Permanent Founder rule: AI must never become a permission bypass.**

The failure mode this ADR exists specifically to forbid: *retrieve everything → send everything to the AI → hide the unauthorized parts of the answer afterward.* Filtering an AI operation's **output** is not equivalent to authorizing its **input** — by the time output is filtered, the model has already been exposed to the content, any cache has already stored the unfiltered generation, and a citation can leak the unauthorized content's existence even if its text is withheld.

**Round 1 Founder security review (this revision responds to it):** the core direction and the central rule are approved unchanged. Rev 1.0 under-specified several things a security-critical document cannot leave under-specified: it conflated the requesting user's identity with the identity that performs background AI processing (§3.2 now separates these); it risked mandating one implementation-specific vector-filtering algorithm (§3.3 now states the invariant only); its derived-artifact rule only named summaries explicitly (§3.4 now lists the full set and adds a multi-source rule); its cache and audit requirements named specific mechanisms rather than the security properties those mechanisms must guarantee (§3.5, §3.6); and its Human Authority section (§21) required human approval for literally every consequential action, which does not allow for legitimate governed automation and has been replaced with a three-category model.

## 3. Decision

### 3.1 Core authorization sequence — user-initiated AI operations

Unchanged from Rev 1.0, and explicitly scoped to **user-initiated** operations (§3.2 distinguishes this from background processing). A mandatory sequence, enforced **before** any AI operation exposes document content to the requesting user:

```
Authenticated (requesting) Identity
  → Tenant/Organization Boundary (ADR-002)
    → Organizational Scope (ADR-010 hierarchy, where applicable)
      → Resource Authorization (authorize(), ADR-004 — evaluated per candidate document)
        → Authorized Retrieval (only documents that passed authorize() are fetched into context)
          → AI Context Construction (context built exclusively from authorized retrieval)
            → AI Operation (the model call itself)
              → Authorized Result
```

This governs every user-initiated operation named in the Founder brief: "Ask SmartArchive," semantic/AI search, summaries, document understanding, document relationships, recommendations, generated answers, and conversational retrieval. None of these may query, embed, or retrieve a document the requesting identity is not authorized to access — the check happens at retrieval time, never as a post-hoc filter on the model's output.

**Invariants carried forward from ADR-010, applied here without modification:**

- Tenant isolation (ADR-002) is mandatory and non-negotiable for every AI operation.
- ADR-010's organizational boundaries apply to AI exactly as they apply to direct document access.
- A Restricted Area's override is respected: **parent access ≠ unconditional descendant access.** Holding AI-context access to a parent scope never by itself grants AI-context access to a Restricted Area beneath it.
- **Sibling access is never implied** — access to one Department, Site, or Workspace's documents grants nothing toward a sibling scope's documents in AI context.
- **Cross-boundary access is always explicit**, never a default or a side effect of proximity.
- Metadata and mere existence of a document can themselves be sensitive (§3.4).
- Citations/source references are disclosures (§3.7).
- Derived AI information inherits its source's restrictions (§3.4).

### 3.2 Two distinct identity contexts — requesting identity vs. processing/service identity

**New in this revision, replacing Rev 1.0's implicit single-identity framing.** Two contexts must be architecturally distinct:

**A. User-Initiated AI Operation** — "Ask SmartArchive," semantic search, a generated answer, a summary request, a recommendation, a related-document request. Context is constructed **exclusively** from information the **requesting identity** is authorized to access, per §3.1. No exception.

**B. Governed Background/System Processing** — ingestion processing, OCR, classification, embedding generation, indexing, governed relationship extraction. This work does not wait for, and is not performed on behalf of, one specific requesting user at query time — it may execute under an explicitly authorized **system/service identity**, distinct from any end user's identity, so that a document can be processed (OCR'd, classified, embedded, indexed) once, at ingestion, rather than re-processed per eventual requester.

**The rule that makes this safe: system authority ≠ user authority.** A system/service identity being permitted to *process* a restricted document never makes that document — or any embedding, metadata, relationship, summary, or other derived information produced from it — retrievable by a user who lacks access to the source. Processing authority and retrieval authority are different questions; §3.1's sequence governs the second regardless of how the first was satisfied. **No unrestricted "AI superuser" shortcut may be created** — a system identity's broad processing access must never be reachable through a user-facing query path.

The future `B1`/`B2` design must explicitly represent three distinct things and never collapse them into one: **requesting identity**, **processing/service identity**, and **authorization scope**.

### 3.3 Vector / embedding security — invariant, not a mandated algorithm

**Revised from Rev 1.0**, which risked over-specifying implementation. Permanent invariant, mechanism-neutral:

**Unauthorized vector/embedding information must not enter the requesting user's retrieval result or AI context.**

Vector entries must carry sufficient tenant/resource/scope authorization information — or use an equivalent governed mechanism providing the same guarantee — so that authorization can be enforced before unauthorized content becomes AI- or user-visible context. This ADR does **not** mandate one specific "pre-filter, then rank" query implementation; `B2` may choose a different mechanism (a filtered index, partitioned collections, a provably equivalent approach) if it delivers the same security guarantee.

What remains explicitly **not acceptable**, regardless of mechanism: *rank everything → expose candidate information → remove unauthorized results afterward.* Similarity scores, document existence, titles, metadata, and relationship hints must not become side channels that reveal something about unauthorized content even when its full text is withheld.

### 3.4 Derived-artifact authorization — expanded scope, multi-source rule

**Expanded from Rev 1.0**, which named only summaries. Protected derived artifacts include, without limitation: embeddings, extracted entities, classifications where sensitive, relationships, summaries, generated explanations, recommendations, cached answers, graph edges, extracted structured data, and future AI memory derived from documents.

**A derived artifact never becomes less restricted merely because it is stored separately from its source document.**

**Multi-source rule:** where an artifact derives from multiple source documents carrying different authorization boundaries, the future design must apply a safe effective-access policy. The exact algorithm (e.g., most-restrictive-source-wins, or another approach) is **not invented here** — that is future `B1`/`B2` design work. The invariant decided in this ADR is:

**Derived information must not widen access beyond its authorized sources.**

### 3.5 Cache security — a required guarantee, not a required mechanism

**Generalized from Rev 1.0**, which named a specific `(User/Role × Document)` cache-key shape. Requirement, mechanism-neutral:

**A cached AI/derived result must be revalidated against current authorization before being served, or invalidated through an equivalent mechanism that guarantees revoked access cannot continue to be served through a stale cache.**

This ADR does not mandate event-driven invalidation, permission-versioning, TTL expiry, a specific cache-key structure, or a hybrid of these — that choice belongs to `B1`/`B2` implementation design. The security requirement that constrains whichever mechanism is chosen: **authorization revocation must propagate to AI/derived access** — a person whose access was revoked must not continue to receive AI results derived from what they can no longer see, regardless of how the cache is implemented.

### 3.6 Security audit trail — sufficient evidence without becoming a second sensitive index

**Revised from Rev 1.0**, which required logging every considered document unconditionally. The audit trail must provide sufficient evidence to investigate an AI operation, recording (where feasible):

- Who initiated the operation (requesting identity, or processing/service identity per §3.2).
- Tenant/organization context.
- Relevant authorization context/version, where feasible.
- Operation type.
- **Protected resources actually used in AI context** (not necessarily every candidate merely considered and excluded).
- Authorization denials/security events, where appropriate.
- Resulting action/reference identifiers.
- Timing.
- Service/provider path, where required for governance.

**The audit trail is itself protected information** — it requires its own authorization to read, follows retention policy, and must minimize unnecessary sensitive content. It must **not** log full document contents or full prompts by default merely for debugging convenience. Logging "considered but unauthorized" candidates is done only where necessary for security/compliance purposes, and in a manner that does not itself create a new disclosure surface (e.g., an audit log that is easier to read than the documents it references would defeat its own purpose). Exact telemetry/storage design is deferred to `B1`/`B5` (the future compliance framework).

### 3.7 Citations / source references — disclosures, reaffirmed

**Unchanged in principle, Founder-reaffirmed.** An AI answer may only expose a citation or source reference when the requesting identity is authorized to know of, and access, that source under applicable policy. The forbidden pattern, stated explicitly: *"You cannot read it, but I can tell you a confidential document exists."* A citation is a disclosure and is subject to the same authorization check as the retrieval that produced it.

### 3.8 Cross-tenant future features — explicitly out of scope, not approved

**Strengthened from Rev 1.0's open question.** Cross-tenant benchmarking, "industry insights," or any aggregation of information across Tenants is explicitly **out of scope and not approved** by this ADR. Calling data "de-identified" does **not** itself imply future authorization — de-identification is not a magic exemption from this ADR's invariants. Any future cross-tenant feature of this kind requires its own dedicated architecture/privacy/security decision and a separate Founder approval; nothing in this ADR should be read as pre-clearing it.

### 3.9 Coordination with ADR-011

Per the now-Approved [ADR-011](ADR-011-device-and-intake-governance.md): **unauthorized intake must not become an AI-context bypass.** Only intake that has already passed ADR-011's own authorization-before-processing sequence (its §3.3) proceeds into the governed processing this ADR regulates. ADR-011's User-Governed intake (an authenticated person uploading) and Source-Governed intake (a Registered Intake Source under a service identity) map directly onto this ADR's two identity contexts (§3.2): User-Governed intake acts under a requesting/uploading User's own identity; Source-Governed intake's subsequent processing acts under a processing/service identity, subject to §3.2's "system authority ≠ user authority" rule exactly as any other background processing would be.

## 4. Scope

Architectural/security decision only. Does not implement the AI Gateway, select a vector database, design the agent framework, or write retrieval/caching/audit code.

## 5. Domain Model implications

Sharpens `SA-ARCH-012`'s existing **AI Session** concept (already named, Conceptual): a User-Initiated AI Session's available context is always a subset of the requesting User's authorized Document set — never the Tenant's full corpus, and never wider than what ADR-010's hierarchy scopes (including Restricted Area overrides) permit for that identity. Introduces the conceptual distinction (§3.2) between a requesting identity and a processing/service identity as something the future AI Session / background-job concepts must both be able to represent without conflating them.

## 6. Security implications

§3 in full is this ADR's security content. Summarized: authorization precedes AI exposure for every user-initiated operation (§3.1); background processing may use a service identity but never grants that identity's access to end users (§3.2); vector/embedding retrieval must not leak authorization information through any channel, exact mechanism left to `B2` (§3.3); every kind of derived artifact inherits and never widens its source's restrictions, including across multiple sources (§3.4); caches must not outlive a revocation (§3.5); the audit trail gives investigators enough evidence without becoming a second sensitive index (§3.6); citations are disclosures (§3.7); cross-tenant aggregation stays unapproved (§3.8); intake-side and AI-side authorization are coordinated, not duplicated (§3.9).

## 7. Authorization implications

No second permission system for AI. Every check in §3 is a call to the existing `authorize()` gate (ADR-004), using ADR-010's hierarchy nodes — including its Restricted Area override — as part of `resource` where applicable. The AI Gateway (`B1`, not yet designed) must treat `authorize()` as a mandatory pre-retrieval filter for user-initiated operations, and must represent processing/service identity as a distinct, narrower-purpose identity for background operations (§3.2) — never optional, never advisory, and never a shortcut around the first.

## 8. Data-model implications (conceptual — no migration authorized)

Vector-store entries need an authorization-scope reference alongside their embedding (Tenant + optional hierarchy node) sufficient to support §3.3's pre-authorization requirement. Derived-artifact records (§3.4) need a traceable link to their source document(s)' authorization scope, including a defined (if not yet algorithmically specified) handling for multi-source artifacts. AI Session / context-construction logs need a structured, minimized record per §3.6 — resources actually used, not necessarily every candidate considered. A processing/service identity (§3.2) needs to be representable distinctly from a User identity in whatever identity model `B1` adopts.

## 9. API implications

None designed here. Future AI-facing endpoints (`B1`) must document, per endpoint, which authorization checks apply to their retrieval path, and whether they execute under a requesting identity or a processing/service identity — this ADR is the standard they are checked against.

## 10. AI implications

§3 above is the AI-implications content of this document in full.

## 11. Integration implications

Applies identically regardless of a document's source — whether it arrived via a future Connector (external system) or a Registered Intake Source ([ADR-011](ADR-011-device-and-intake-governance.md)), its authorization boundary is unchanged once it is a Document in SmartArchive, per §3.9's coordination with ADR-011.

## 12. Migration / backward-compatibility implications

N/A — no AI retrieval exists yet to migrate (`AI` is "Emerging" on the Maturity Matrix, schema-only). This ADR exists precisely so `B1` is designed against these rules from its first draft, avoiding a later retrofit.

## 13. Alternatives considered / rejected

- **Filter AI output for unauthorized content** — rejected outright as the primary mechanism. This is the exact anti-pattern named in §2; output filtering does not undo exposure that already happened at generation/caching time.
- **Coarse Tenant-level-only AI authorization (no per-document check)** — rejected: fails "one organization is NOT one open archive" ([ADR-010](ADR-010-esa-organizational-hierarchy-and-boundary-model.md)) the moment any hierarchy scope is in use; would make AI features strictly less safe than direct document browsing.
- **A separate AI-specific permission system, parallel to `authorize()`** — rejected for the same reason ADR-007 rejected a parallel Extension permission system: two systems drift out of sync over time.
- **Defer authorization-aware retrieval to `B2` (vector search) instead of deciding it now** — rejected: the audit that produced this package specifically found this must land before `B1` is drafted, not after.
- **Let background processing run under the requesting user's identity, or under one shared "AI system" superuser identity** — rejected on Founder review (§3.2): the first makes ingestion depend on a live user session for no good reason; the second is exactly the "AI superuser shortcut" this revision explicitly forbids.
- **Mandate one specific vector pre-filtering algorithm at the ADR level** — rejected on Founder review (§3.3): premature implementation detail; the invariant is decided here, the mechanism is `B2`'s to choose.
- **Mandate one specific cache-key shape or invalidation strategy at the ADR level** — rejected on Founder review (§3.5): same reasoning — the guarantee is decided here, the mechanism is `B1`/`B2`'s to choose.
- **Require human approval for every action with any real-world effect** (Rev 1.0's §21 shape) — rejected on Founder review (§21 below): too broad; forecloses legitimate governed automation that operates entirely within pre-authorized policy and scope.

## 14. Dependencies

- [ADR-004](ADR-004-authorization.md) — `authorize()`, hard dependency, unchanged.
- [ADR-002](ADR-002-multi-tenancy.md) — Tenant/RLS, unchanged.
- [ADR-010](ADR-010-esa-organizational-hierarchy-and-boundary-model.md) — **Approved, Rev 1.2** — hierarchy scopes and the Restricted Area override this ADR applies to AI operations.
- [ADR-011](ADR-011-device-and-intake-governance.md) — **Approved, Rev 1.2** — coordination on the intake-to-processing boundary (§3.9).
- [ADR-006](ADR-006-platform-extension-model.md) / [ADR-007](ADR-007-extension-interface-platform-contracts.md) — the AI Provider Contract and Workflow Contract this ADR's rules apply to.

## 15. Relationship to existing ADRs

Amends the AI Provider Contract (ADR-007) by adding mandatory authorization preconditions to its `complete/embed/classify` operations, and adds a governed-automation qualifier to the Workflow Contract's execution model (§21) — does not change either contract's operation signatures. Does not supersede ADR-004; is a specific, security-critical application of it. Coordinates with, without redesigning, the now-Approved ADR-010 and ADR-011.

## 16. Documents requiring synchronization AFTER approval

- `ADR-007` — AI Provider Contract gains an explicit "Authorization precondition" note (§3.1–3.4); Workflow Contract gains a note on the three-category automation model (§21).
- `SA-ARCH-011` — AI capability row cites this ADR alongside ADR-006/007.
- `SA-ARCH-000` — optional §7/§8-style resolved-citation, Founder discretion on whether this is foundational enough for master-architecture-level mention.
- `SA-TRACE-001` — AI capability row.

## 17. Implementation prerequisites

Approval of this ADR is itself a prerequisite for `B1` (AI Gateway) design. Recommend explicitly adding it as a named Gate 3 conformance target in `SA-ROADMAP-001`, alongside `B9-iface`, the next time that roadmap is revised.

## 18. Risks

The highest-severity risk in this entire package if left undecided — an AI feature shipped without these rules designed in is a genuine data-leak vector, not a cosmetic gap. This revision's added identity distinction (§3.2) mitigates a specific risk Rev 1.0 didn't name: a background-processing shortcut quietly becoming a retrieval-time bypass. Conversely, over-specifying implementation mechanics (exact caching algorithm, exact vector-filter query shape, exact multi-source derivation formula) risks constraining `B1`/`B2`'s actual design unnecessarily — mitigated throughout this revision by keeping requirements behavioral ("must not happen") rather than mechanical.

## 19. Open questions

- Exact multi-source derived-artifact effective-access algorithm (§3.4) — deferred to `B1`/`B2` implementation design.
- Exact cache-invalidation mechanism (§3.5) — deferred to `B1`/`B2` implementation design.
- Exact audit telemetry/storage design and retention period (§3.6) — deferred to `B1`/`B5`.
- Exact risk taxonomy distinguishing Governed Automation from Consequential/High-Risk Action (§21) — deferred to future Workflow/Policy architecture.

## 20. Founder decision points

1. Approve the user-initiated authorization sequence (§3.1) and the ADR-010-derived invariants it carries forward, unchanged from Rev 1.0.
2. Approve the requesting-identity/processing-identity distinction and the "system authority ≠ user authority" rule (§3.2).
3. Approve the mechanism-neutral vector/embedding invariant (§3.3), explicitly rejecting only "rank-then-strip."
4. Approve the expanded derived-artifact list and the multi-source "must not widen access" invariant (§3.4).
5. Approve the generalized cache-revalidation-or-invalidation requirement (§3.5).
6. Approve the audit-trail requirements as scoped (§3.6), including that the audit trail is itself protected information and must not log full contents/prompts by default.
7. Reaffirm citations as disclosures (§3.7) — no change requested.
8. Confirm cross-tenant features remain explicitly unapproved (§3.8).
9. Approve the three-category Human Authority/Governed Automation model (§21) replacing Rev 1.0's blanket approval requirement.
10. Approve the future-agent least-privilege rule (§22).

---

## 21. Human Authority — Informational AI, Governed Automation, and Consequential Action

**Revised from Rev 1.0.** Rev 1.0 required human approval for "any action with a real-world effect" — too broad: it would have required a live approval prompt even for a Finance scanner routing an invoice to its own pre-authorized Finance destination, or a workflow creating a reminder it was explicitly configured to create. This revision replaces that blanket rule with three categories:

**A. Informational AI** — understand, summarize, connect, detect, explain, recommend. Produces information for a person to act on; performs no action itself. No approval mechanism needed beyond §3's retrieval/context rules already governing what it may see.

**B. Governed Automation** — an action explicitly allowed by approved organizational policy, workflow configuration, permissions, and scope. Example: an authorized Finance intake source ([ADR-011](ADR-011-device-and-intake-governance.md)) automatically routing an invoice to its pre-authorized Finance destination; a governed workflow automatically classifying a document, routing it within already-authorized policy, extracting metadata, or creating a reminder. These do **not** require a human-approval prompt on every occurrence merely because they have an operational effect — the approval already happened when the policy/workflow/scope was configured by an authorized administrator, and every such action still runs inside the same ADR-004/ADR-010 authorization boundaries as everything else in this ADR (a Governed Automation cannot route outside its pre-authorized destination any more than a human user could).

**C. Consequential / High-Risk Action** — an action requiring explicit human approval because of its effect, sensitivity, policy, or risk: granting or changing permissions, approving a contract, a legally consequential submission, a destructive action, an external communication where policy requires approval, or a high-impact workflow decision. These route through the Workflow Contract's `request-human-approval` operation ([ADR-007](ADR-007-extension-interface-platform-contracts.md)) — this section creates no new mechanism, it names which category of action must use the existing one. The exact taxonomy separating Category B from Category C is future Workflow/Policy architecture, not decided in this ADR.

**Permanent principles, unchanged in spirit from Rev 1.0:**

- **AI recommendation does not itself create authority.** A suggestion is never self-executing.
- **Automation authority comes from explicit policy/permission, never from the AI deciding it has authority.** Category B's legitimacy rests entirely on a human administrator having configured the policy in advance — the AI does not grant itself expanded scope by inference.
- **Actions outside pre-authorized automation policy require the appropriate human approval** — anything not cleanly inside Category B defaults to Category C, not the reverse.
- **No unrestricted autonomous enterprise AI.** This ADR does not create, and no future implementation may create without its own Founder-approved ADR, an AI capability that acts outside these three categories.

**Synchronization note:** `SA-ARCH-000` Principle #9 itself needs no edit (still true, still Locked) — this is additive clarification living here.

## 22. Future Agent Security

**New in this revision (Modification 9).** As future AI agents are designed, the following constraints apply, without this ADR designing the agent framework itself:

- An agent operates under an **explicit identity/authorization context** at all times — never an ambient or inherited "agent mode" with unstated scope.
- **Least privilege**: an agent's access is scoped to what its current task requires, not broadened by default.
- **An agent may not accumulate broader access merely by performing multiple steps.** Chaining several authorized single-step actions together does not produce authorization for an action none of those steps individually held — privilege does not compound through sequencing.
- **Tool invocation stays inside the authorization boundary applicable to that specific operation.** Each tool call is checked on its own terms (per §3.1's sequence, or §3.2's processing-identity rule if the call is background work), not inherited wholesale from whatever authorization the agent's overall session happens to hold.
- **Agent memory must not become a permission bypass.** If an agent stores information derived from a restricted document, that stored memory/derived state remains subject to §3.4's derived-artifact rule — it is exactly as restricted as its source, indefinitely, not merely at the moment it was created.

Detailed agent architecture (tool-calling framework, memory storage design, orchestration) is future work, gated on `B1` and this ADR's approval; only the security constraints above are decided now.

## Revision History

| Rev | Change |
|---|---|
| 1.0 | Initial Draft, prepared as part of the ESA Architecture Draft Package following the Founder-approved ESA Core Architecture Reconciliation Audit (2026-08-29). Includes §21 Human Authority as a folded-in clarification rather than a separate ADR. |
| 1.1 | Founder security review round 1 (verdict: MODIFY) incorporated. Central rule (AI must never become a permission bypass) unchanged. Added §3.2: explicit requesting-identity vs. processing/service-identity distinction, with "system authority ≠ user authority" and a prohibition on any AI-superuser shortcut. Revised §3.3 (vector/embedding security) to state the invariant only, no mandated algorithm, while still explicitly forbidding rank-then-strip. Expanded §3.4 (derived-artifact rule) to a full list beyond summaries, plus a multi-source "must not widen access" invariant. Generalized §3.5 (cache security) to a revalidate-or-invalidate requirement without mandating a cache-key shape. Revised §3.6 (audit trail) to require sufficient evidence without unconditional full logging, and named the audit trail itself as protected information. Reaffirmed §3.7 (citations as disclosures) unchanged. Added §3.8, explicitly placing cross-tenant/de-identified aggregation out of scope and not approved. Added §3.9, coordinating explicitly with the now-Approved ADR-011's intake-to-processing boundary. Replaced §21's blanket human-approval requirement with a three-category model (Informational AI / Governed Automation / Consequential-High-Risk Action). Added new §22, Future Agent Security (least privilege, no privilege accumulation through chaining, per-call tool authorization, memory inherits source restrictions). Sections 5–20 updated throughout for consistency. Status remains Draft. |
| 1.2 | Founder security review round 1 verdict: **APPROVED**. All twelve reviewed areas of Rev 1.1 (identity split, ADR-010 organizational-security inheritance, document/metadata authorization, vector/embedding security, derived-artifact security, cache/revocation, AI security auditing, citations, ADR-011 intake coordination, Human Authority/Governed Automation, Future AI Agents, Cross-Tenant AI) approved without further change. No content rewrite — status transition only: Status field changed to Approved (not yet Locked per `SA-ARCH-999` §2), §1 rewritten to state the approval and to name that Locked-document synchronization remains explicitly parked until ADR-013 has also been reviewed, for one coordinated pass. |
