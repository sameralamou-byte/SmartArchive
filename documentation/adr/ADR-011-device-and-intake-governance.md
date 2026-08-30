# ADR-011 — Device & Intake Governance

| Field | Value |
|---|---|
| Document ID | ADR-011 |
| Title | Device & Intake Governance (Registered Intake Sources) |
| Version | 1.2 |
| Status | **Approved** (Founder Approval, round 1 review of Rev 1.1 — content unchanged from Rev 1.1; not yet Locked per [SA-ARCH-999](../SA-ARCH-999_Architecture_Governance.md) §2, which requires surviving a subsequent review cycle first) |
| Date | 2026-08-29 |
| Owner | Architecture team — SmartArchive AI Platform |
| Classification | Internal |
| Related | [ADR-004](ADR-004-authorization.md) (Locked), [ADR-006](ADR-006-platform-extension-model.md), [ADR-007](ADR-007-extension-interface-platform-contracts.md), [ADR-010](ADR-010-esa-organizational-hierarchy-and-boundary-model.md) (**Approved**, Rev 1.2), [ADR-012](ADR-012-ai-permission-inheritance.md), [SA-ARCH-011](../SA-ARCH-011_Capability_Map.md), [SA-ARCH-012](../SA-ARCH-012_Domain_Model.md) |
| Resolves | The device/intake governance gap named in the ESA Core Architecture Reconciliation Audit (2026-08-29) — zero architectural representation existed for physical/network intake prior to this document |
| Part of package | ESA Architecture Draft Package, 2026-08-29 — depends on the now-Approved ADR-010 |

## 1. Status

**Approved** — Founder Approval recorded on the round 1 review of Rev 1.1 (the Intake Contract/Intake category naming, the Registered Intake Source umbrella concept, the User-Governed/Source-Governed split, the reordered authorization-before-processing pipeline, ADR-010-aligned destination binding with full Restricted Area override, the credential-lifecycle invariants, the authorization-failure/processing-failure quarantine distinction, and the Connector/Intake separation are all Founder-approved as written; content unchanged since Rev 1.1). Not yet **Locked**: per [SA-ARCH-999](../SA-ARCH-999_Architecture_Governance.md) §2, a document earns Locked status only after surviving a subsequent review cycle without being overturned — this is this document's first review.

**Synchronization not yet authorized.** Approval of this ADR does **not** itself trigger the §16 synchronization edits to `ADR-006`, `ADR-007`, `SA-ARCH-011`, `SA-ARCH-012`, or `SA-TRACE-001` — per explicit Founder direction, that coordinated pass remains parked until the remaining package reviews (ADR-012, ADR-013) are also complete.

No implementation, migration, scanner/MFP integration, or Intake Gateway is authorized by this document. No specific hardware brand, transport protocol, or credential technology is claimed or mandated.

## 2. Context / Problem

ESA must accept documents from many intake sources: network scanners, MFPs, high-speed document scanners, departmental scanners, production-floor intake stations, workstation uploads, approved network shares, email/document gateways, and mobile capture where appropriate. None of ADR-007's nine Platform Contracts (Storage, Connector, AI Provider, OCR, Authentication, Notification, Search, Voice, Workflow) address a physical or network intake source — "Connector" governs external *systems* (ERP/CRM), not intake sources pushing scanned content in. Confirmed in the 2026-08-29 audit: zero architectural representation exists anywhere in the repository today.

Core risk this ADR exists to close: **same network ≠ authorization.** A source reachable on the corporate network must not thereby gain the ability to route documents to any organizational destination.

**Round 1 Founder review (this revision responds to it):** the direction was approved in principle; seven specific modifications were required. The two most consequential corrections: (1) the original conceptual pipeline let OCR/AI processing happen *before* destination authorization was confirmed — this revision reorders it so authorization is always established first; (2) the original model was implicitly hardware-shaped ("Registered Device") — this revision generalizes to a broader **Intake Source** concept, with Device as one subtype among several, and explicitly separates *user-initiated* intake (a person's own phone or workstation) from *unattended source* intake (a scanner, gateway, or agent acting as its own identity), so ordinary employees are never mistakenly required to register their own devices.

## 3. Decision

### 3.1 Two governance categories of intake

**Correction from Rev 1.0 (Modifications 3 and 4):** not everything that brings a document in is a "Registered Intake Source." Two categories exist, and this ADR governs only the second:

| Category | What it covers | Governed by |
|---|---|---|
| **User-Governed Intake** | An authenticated human User interactively capturing or uploading a document — a phone camera used by that User in the moment, or a workstation browser upload. | That User's own existing authorization (ADR-004), through the existing document-upload path. **Out of scope for this ADR.** A User's personal phone or workstation is never required to register merely because it was used to upload. |
| **Source-Governed Intake** | A non-interactive, unattended source acting under its own service identity, not on behalf of an interactively authenticated human session at the moment of intake — a scanner, MFP, network-share agent, email/document gateway, production intake station, or an unattended workstation agent/watch-folder service. | This ADR's **Registered Intake Source** model, §3.2 onward. |

The distinguishing test is *whether an authenticated human session initiated this specific intake action*, not what hardware happens to be involved. An unattended workstation watch-folder service is Source-Governed even though it runs on ordinary workstation hardware (§3.1.2 below); a dedicated, unattended mobile intake terminal not tied to an individual's own login session is likewise Source-Governed even though it uses a phone camera.

#### 3.1.1 Mobile capture (Modification 3)

Interactive mobile capture performed by an authenticated SmartArchive User is **User-Governed**, never treated as an unattended Registered Intake Source merely because a phone camera produced the image:

```
Authenticated User → the User's existing authorization → authorized
destination → upload/capture → processing
```

If an organization later deploys a dedicated, unattended mobile intake terminal (not an individual's own logged-in session — e.g., a kiosk-style device performing scheduled or triggered capture with no human present), that terminal may qualify as a Registered Intake Source under §3.2.

#### 3.1.2 Workstation upload (Modification 4)

The identical distinction applies to workstations. An authenticated User manually uploading from a workstation is **User-Governed** intake, using that User's own authorization — no employee workstation is required to become a Registered Intake Source merely to support manual upload.

An **unattended** workstation agent, watch-folder, or automated intake service running with no human session behind a given submission is **Source-Governed** — it must hold a registered service/intake identity with an authorized destination scope, exactly as a scanner or gateway would.

### 3.2 Registered Intake Source — the broader governed concept (Modification 2)

**Correction from Rev 1.0:** the governed concept is not "Registered Device." It is the broader **Registered Intake Source**, of which Device is one category among several:

| Source category | Examples |
|---|---|
| **Device** | Network scanner, MFP, high-speed document scanner, departmental scanner, production-floor intake station |
| **Network-Share Agent** | An approved network-share intake watcher/agent |
| **Email / Document Gateway** | An email or document-gateway intake channel |
| **Unattended Terminal / Service** | An unattended workstation agent, watch-folder service, or dedicated unattended mobile intake terminal (§3.1.1) |
| **Other** | Future unattended, non-human intake mechanisms not yet named |

A network share or email gateway is not literally a physical device, but needs the same governance this ADR establishes — source identity, destination authorization, and audit — so it is modeled as the same kind of thing, not a special case.

### 3.3 Intake pipeline — authorization before processing (Modification 1)

**Correction from Rev 1.0:** the original conceptual flow placed OCR/AI Understanding before destination-permission enforcement. Corrected sequence:

```
Intake Source
  → Intake Identity Authentication
    → Registration / Status Validation
      → Requested Destination
        → Authorization against requested destination (authorize(), ADR-004,
           against an ADR-010 scope)
          → Secure acceptance / staging
            → Processing / OCR
              → AI Understanding
                → Governed Document creation / storage
                  → Search / Context / Alerts
```

**Permanent invariant: unauthorized intake must not become an AI-context bypass.** Content is not processed by OCR, and is never exposed to any AI operation, until the requested destination has been authorized. This is the intake-side counterpart to [ADR-012](ADR-012-ai-permission-inheritance.md)'s retrieval-side invariant — ADR-012 governs authorization *before retrieval*; this ADR governs authorization *before intake processing*. The two are coordinated, not merged: this ADR does not redesign ADR-012, and ADR-012 does not redesign this ADR. The exact implementation pipeline (staging mechanics, timeouts, partial-failure handling) remains future design work.

### 3.4 Destination binding — aligned with ADR-010 Rev 1.2 (Modification 5)

**Correction from Rev 1.0:** destination binding is not assumed to always be a Workspace. Per the now-Approved [ADR-010](ADR-010-esa-organizational-hierarchy-and-boundary-model.md) Rev 1.2 five-category model, a valid destination for a Registered Intake Source is any appropriate node the organization has configured — an organizational-structure node (e.g., a Department or Site), a Workspace, or a Restricted Area — subject to authorization policy, exactly as for any other resource.

**Restricted Area override applies fully to sources, not only to human Users.** A source bound to a parent scope (e.g., "Finance MFP → Finance Department") does **not** thereby gain deposit rights into a Restricted Area beneath that scope. Per ADR-010 §3.7, "parent access ≠ unconditional descendant access" — a Restricted Area may require its own explicit grant to the source's service identity regardless of what destination scope the source otherwise holds.

### 3.5 Identity and credential lifecycle (Modification 6)

Registration requires a stable **Intake Source Identity**, distinct from network-layer facts (IP/MAC address establish reachability, not authorization). Independent of the specific authentication technology (deliberately not chosen here — see below), the architecture requires:

- Credentials are **revocable**.
- Credentials are **never stored as plaintext secrets**.
- Identity supports a lifecycle: **activation, revocation, rotation**, where applicable to the credential type in use.
- **Revoking network-layer access alone is not the security model** — an Intake Source's registration status is the control that matters.
- **Revoking an Intake Source's registration must stop further accepted intake** — every submission re-validates registration/status (§3.3's "Registration / Status Validation" step runs per submission, not only at first connection), so a revoked source is rejected on its next attempt even if it retains network reachability.

This ADR does not mandate a specific credential technology (certificates, API keys, OAuth, or otherwise) — none is chosen here unless a future ADR or already-existing architecture requires one. Nothing in the current repository mandates one for this case.

### 3.6 Failure and quarantine semantics (Modification 7)

**Reject, don't redirect** is preserved, and now scoped precisely against a second, distinct case:

- **Authorization failure** — an unregistered source, a revoked source, or a request targeting a destination outside the source's authorized set — is **rejected outright**. The Gateway never guesses a "closest match" destination and never silently reroutes.
- **Authorized source, processing failure** — a registered, authorized source whose submission fails for an operational reason (a corrupted scan, an OCR failure, an unsupported file, a transient processing error) **may** enter a controlled failure/quarantine workflow for retry or manual review. This is a materially different case from an authorization failure and must not be treated identically.

**Quarantine must never weaken the original destination-authorization boundary.** A quarantined submission remains within the authorized destination scope already established at the authorization step (§3.3) while awaiting retry or review — quarantine is a processing-state, not a re-authorization opportunity, and never becomes a path to a different or broader destination than the one originally authorized.

The full quarantine/retry workflow design (timeouts, retry counts, reviewer assignment) is explicitly future implementation-stage work; only the architectural distinction between the two failure classes is decided here.

## 4. Scope

Conceptual/architectural only. No hardware/protocol/credential-technology compatibility is claimed or promised — no scanner brand, MFP vendor, transport (SMB share, SMTP gateway, TWAIN, etc.), or authentication technology is committed to by this document.

## 5. Domain Model implications

New Conceptual concept: **Registered Intake Source** (§3.2), replacing Rev 1.0's narrower "Registered Device" as the umbrella term — Device remains one of its categories, not the whole concept. Not a Document, not a User, not a Connector. Belongs to exactly one Tenant; bound to one or more [ADR-010](ADR-010-esa-organizational-hierarchy-and-boundary-model.md) hierarchy nodes (organizational-structure, Workspace, or Restricted Area) as its authorized destination set, subject to ADR-010's inheritance rules (§3.4). User-Governed intake (§3.1) introduces no new domain concept — it is the existing Document-upload path under the existing User/Role concepts, unchanged.

## 6. Security implications

Directly implements "same network ≠ authorization." A compromised or misconfigured source on the corporate network cannot intake documents outside its registered, authorized destination(s), and cannot bypass a Restricted Area's stricter requirement merely by holding a broader parent-scope binding (§3.4). Authorization is established **before** OCR/AI processing (§3.3), closing the intake-side path that could otherwise let unauthorized content reach an AI operation before a permission check ever ran. Credential/identity lifecycle (§3.5) ensures a revoked source is stopped at the next submission, not merely at the network layer.

## 7. Authorization implications

Intake is authorized through the existing `authorize()` gate (ADR-004): the source's registered destination(s) become the `resource`, its service identity the `user` parameter, evaluated against [ADR-010](ADR-010-esa-organizational-hierarchy-and-boundary-model.md)'s scope hierarchy — including its Restricted Area override rule (§3.4). No second permission system — the same precedent ADR-007 already set for Extensions.

## 8. Data-model implications (conceptual — no migration authorized)

A `registered_intake_sources`-style table: `organization_id` (RLS, ADR-002), source identity, source category (Device / Network-Share Agent / Email Gateway / Unattended Terminal-Service / Other), one or more destination hierarchy-node references, status (active/revoked), credential reference (never plaintext), last-seen/audit metadata. User-Governed intake requires no new table — it uses the existing Document-upload/User path.

## 9. API implications

None designed here. Future: a source-registration endpoint (Administration-scoped — "device/intake administration" is a named functional area in ADR-010 §3.8) and an intake-submission endpoint the Gateway exposes only to registered, currently-active sources — re-validating registration and destination authorization on every submission, per §3.3 and §3.5.

## 10. AI implications

Content from a Registered Intake Source is never exposed to OCR or any AI operation until the destination-authorization step (§3.3) has passed — the permanent invariant that unauthorized intake must not become an AI-context bypass. This is coordinated with, and does not redesign, [ADR-012](ADR-012-ai-permission-inheritance.md)'s own authorization-before-retrieval sequence; the two ADRs establish parallel invariants at two different points (intake vs. retrieval) using the same underlying mechanism (`authorize()`, ADR-004).

## 11. Integration implications

Distinct from, but consistent with, the Connector Contract (ADR-007): a Connector reaches *into* an external system's API; an Intake Source *receives* a push/scan/drop from a physical, network, or service source — an inverted relationship. Both ultimately deposit a Document under an authorized destination and both route through the same `authorize()` gate. This distinction is unaffected by broadening from "Device" to "Intake Source" (§3.2) — an email gateway or network-share agent is still fundamentally a push source, not a bidirectional external-system integration.

**Platform Contract naming recommendation (as requested):** name the new contract the **Intake Contract**, not "Device Contract" or "Device Intake Contract," and name its Extension Category **Intake**, not "Device." Reasoning: once the governed concept is broadened to cover network-share agents, email gateways, and unattended terminals alongside physical devices (§3.2), "Device" materially undersells what the contract actually covers and would misdescribe an email-gateway or network-share implementation as a "device," which it isn't. "Intake Contract" / "Intake" category remains correct across every current and anticipated source category without renaming again later, and reads unambiguously distinct from "Connector" (external system integration) at a glance.

Illustrative Intake Contract operations (not final — implementation detail, matching every other ADR-007 contract's own caveat): `register-source / bind-destination / validate-status / submit-document / revoke`.

## 12. Migration / backward-compatibility implications

N/A — no implementation authorized. Additive: existing human document upload (`backend/app/routers/v1/files.py`) is **explicitly unaffected and out of this ADR's scope** (§3.1) — it already has an authenticated human User as its identity and needs no new mechanism, and no User or workstation is retroactively required to register anything. Registered Intake Source governance applies only to the Source-Governed category (§3.1).

## 13. Alternatives considered / rejected

- **Treat intake sources as a special case of the Connector Contract** — rejected: a Connector authenticates to an external system's API; an intake source pushes into SmartArchive, an inverted relationship with different identity/registration needs.
- **No registration — trust any document arriving on an authenticated network path** — rejected outright: directly violates "same network ≠ authorization," the one non-negotiable principle in this section.
- **Per-source bespoke permission logic outside `authorize()`** — rejected: the same reasoning ADR-007 already applied to Extensions; a second permission system is exactly what ADR-004 exists to prevent.
- **Process/OCR/AI-understand first, authorize destination afterward** (Rev 1.0's shape) — rejected on Founder review: creates exactly the AI-context-bypass risk this revision's §3.3 exists to close.
- **Keep the governed concept scoped to physical "Device" only** (Rev 1.0's shape) — rejected on Founder review: leaves network-share agents, email gateways, and unattended services without governance despite needing the identical source-identity/destination-authorization/audit model. Replaced by §3.2.
- **Require every employee phone/workstation to register as an Intake Source for normal interactive use** — rejected on Founder review: over-broad, would force ordinary User-Governed uploads through unattended-source machinery they don't need, and duplicates authorization ADR-004 already provides for authenticated Users. Replaced by §3.1's two-category split.
- **One undifferentiated failure/rejection path for both authorization failures and processing failures** — rejected on Founder review: conflates a security event (unauthorized intake) with a routine operational failure (a corrupted scan), which would either make authorization failures look recoverable or make routine OCR failures look like security incidents. Replaced by §3.6.

## 14. Dependencies

- [ADR-004](ADR-004-authorization.md) — `authorize()`, the enforcement mechanism.
- [ADR-010](ADR-010-esa-organizational-hierarchy-and-boundary-model.md) — **Approved, Rev 1.2** — supplies the destination hierarchy nodes (including Restricted Area override behavior) an Intake Source is bound to.
- [ADR-006](ADR-006-platform-extension-model.md) / [ADR-007](ADR-007-extension-interface-platform-contracts.md) — the Extension/Contract structure this ADR proposes extending (as the Intake Contract, §11).
- [ADR-012](ADR-012-ai-permission-inheritance.md) — coordination only, not a hard sequencing dependency: both ADRs establish an authorization-before-AI invariant at different points in the pipeline (intake vs. retrieval), using the same `authorize()` mechanism. Neither ADR redesigns the other.

## 15. Relationship to existing ADRs

Companion to, not a replacement for, the Connector Contract (ADR-007). Structured the same way ADR-006/007 structured every other pluggable capability, for consistency. Builds directly on the now-Approved ADR-010's destination-scope model, including its Restricted Area override rule.

## 16. Documents requiring synchronization AFTER approval

- `ADR-006` — new Extension Category: **Intake** (not "Device" — see §11 naming recommendation).
- `ADR-007` — new Platform Contract: **Intake Contract**.
- `SA-ARCH-011` — new capability row: **Intake Governance** (or equivalent name matching the approved Contract naming).
- `SA-ARCH-012` — new Conceptual concept: **Registered Intake Source** (with its source-category subtypes).
- `SA-TRACE-001` — new row.

## 17. Implementation prerequisites

ADR-010 is now Approved, satisfying this ADR's structural dependency. This ADR itself must be Approved before any Intake Contract implementation, Intake Gateway, or scanner/MFP/gateway integration work begins.

## 18. Risks

Without this ADR, the realistic failure mode mirrors what `SA-AUDIT-002` already warned about for connectors generally: each department or site integrating its own scanner or gateway as a bespoke, ungoverned point solution instead of one governed intake surface. Over-specifying source-specific protocol support prematurely — before a real integration is scoped — risks guessing the wrong contract shape; mitigated by keeping Intake Contract operations illustrative, the same caveat ADR-007 already applies to its other contracts. A risk specific to this revision: an overly broad reading of "Source-Governed" could accidentally sweep in ordinary User-Governed activity — mitigated by §3.1's explicit test (was an authenticated human session behind this specific submission?).

## 19. Open questions

- Exact criteria for distinguishing a "dedicated, unattended mobile intake terminal" (Source-Governed, §3.1.1) from an individual's own device used unusually (e.g., left logged in on a shared kiosk) — flagged for implementation-stage policy, not resolved here.
- Detailed quarantine/retry workflow design (timeouts, retry counts, reviewer assignment, escalation) — explicitly deferred to future implementation design (§3.6).
- Whether Legal Entity/Business Unit-level source registration ever needs isolation stronger than Tenant-level — same open question ADR-010 §19 already carries; not re-decided here.

*(Rev 1.0's mobile-capture open question is resolved by §3.1.1 and removed from this section accordingly.)*

## 20. Founder decision points

1. Approve the two-category split (User-Governed vs. Source-Governed intake, §3.1) as the correct boundary, including the mobile-capture (§3.1.1) and workstation-upload (§3.1.2) resolutions.
2. Approve the broadened **Registered Intake Source** concept (§3.2), with Device as one category among Network-Share Agent, Email/Document Gateway, Unattended Terminal/Service, and Other.
3. Approve the corrected pipeline (§3.3) placing authorization before OCR/AI processing, and the "unauthorized intake must not become an AI-context bypass" invariant.
4. Approve destination binding against the full ADR-010 scope set (organizational node, Workspace, or Restricted Area), with the Restricted Area override applying to sources exactly as it does to human Users (§3.4).
5. Approve the credential/identity-lifecycle invariants (§3.5) without committing to a specific technology.
6. Approve the authorization-failure vs. processing-failure distinction and quarantine semantics (§3.6).
7. Approve **"Intake Contract"** (Extension Category: **Intake**) as the permanent Platform Contract name, replacing "Device Contract."

## Revision History

| Rev | Change |
|---|---|
| 1.0 | Initial Draft, prepared as part of the ESA Architecture Draft Package following the Founder-approved ESA Core Architecture Reconciliation Audit (2026-08-29). |
| 1.1 | Founder review round 1 (verdict: MODIFY) incorporated. Reordered the intake pipeline so authorization precedes OCR/AI processing, with an explicit "unauthorized intake must not become an AI-context bypass" invariant coordinated with ADR-012 (§3.3). Broadened the governed concept from "Registered Device" to **Registered Intake Source**, with Device as one category among several (§3.2). Introduced the User-Governed vs. Source-Governed intake split, resolving mobile capture and workstation upload explicitly — neither requires registration when performed by an authenticated User (§3.1–3.1.2). Aligned destination binding with the now-Approved ADR-010 Rev 1.2 five-category model, including full application of the Restricted Area override to sources (§3.4). Added credential/identity-lifecycle invariants without mandating a technology (§3.5). Distinguished authorization failure (reject) from authorized-source processing failure (may quarantine, boundary preserved) (§3.6). Changed the Platform Contract naming recommendation from "Device Contract" to **Intake Contract** / Extension Category **Intake**. Alternatives, dependencies, synchronization list, risks, open questions, and Founder decision points updated throughout. Status remains Draft. |
| 1.2 | **Founder Approved** on round 1 review of Rev 1.1 — the Intake Contract/Intake Extension Category naming, the Registered Intake Source umbrella concept and its categories, the User-Governed vs. Source-Governed split (including the mobile-capture and workstation-upload resolutions), same-network-≠-authorization, the authorization-before-processing pipeline and its AI-context-bypass invariant, ADR-010-aligned destination binding with full Restricted Area override, continued use of the existing ADR-004 `authorize()` gate, reject-don't-redirect, the authorization-failure/processing-failure quarantine distinction, the credential/identity-lifecycle invariants, and the Connector/Intake separation are all confirmed as approved. No content rewrite — status transition only (Draft → Approved). Per explicit Founder direction, synchronization edits to `ADR-006`, `ADR-007`, `SA-ARCH-011`, `SA-ARCH-012`, and `SA-TRACE-001` (§16) remain **not authorized** until ADR-012 and ADR-013 have also been reviewed, for one coordinated synchronization pass. Not yet Locked (first review). |
