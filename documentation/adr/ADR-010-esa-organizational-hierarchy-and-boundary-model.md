# ADR-010 — ESA Organizational Hierarchy & Boundary Model

| Field | Value |
|---|---|
| Document ID | ADR-010 |
| Title | ESA Organizational Hierarchy & Boundary Model (including Scoped Administration) |
| Version | 1.2 |
| Status | **Approved** (Founder Approval, round 1 review of Rev 1.1 — content unchanged from Rev 1.1; not yet Locked per [SA-ARCH-999](../SA-ARCH-999_Architecture_Governance.md) §2, which requires surviving a subsequent review cycle first) |
| Date | 2026-08-29 |
| Owner | Architecture team — SmartArchive AI Platform |
| Classification | Internal |
| Related | [SA-ARCH-012](../SA-ARCH-012_Domain_Model.md) (Locked — Workspace flagged Conceptual/open), [SA-ARCH-011](../SA-ARCH-011_Capability_Map.md) (Locked), [ADR-002](ADR-002-multi-tenancy.md) (Locked), [ADR-004](ADR-004-authorization.md) (Locked), [ADR-006](ADR-006-platform-extension-model.md), [ADR-009](ADR-009-account-tenant-family-entitlement.md) |
| Resolves | The Workspace open-modeling question `SA-ARCH-012` explicitly deferred; the organizational-hierarchy and scoped-administration gaps named in the ESA Core Architecture Reconciliation Audit (2026-08-29) |
| Part of package | Approved alongside ADR-011, ADR-012, ADR-013 (ESA Architecture Draft Package, 2026-08-29) — this is the foundational one; the other three reference it |

## 1. Status

**Approved** — Founder Approval recorded on the round 1 review of Rev 1.1 (§3's five-category model, Workspace/Restricted Area distinction, canonical parentage, and refined inheritance rule are all Founder-approved as written; content unchanged since Rev 1.1). Not yet **Locked**: per [SA-ARCH-999](../SA-ARCH-999_Architecture_Governance.md) §2, a document earns Locked status only after surviving a subsequent review cycle without being overturned — this is this document's first review.

**Synchronization not yet authorized.** Approval of this ADR does **not** itself trigger the §16 synchronization edits to `SA-ARCH-012`, `SA-ARCH-011`, `SA-TRACE-001`, or `SA-BIZ-001-24` — the Founder has explicitly deferred that coordinated pass until ADR-011 and ADR-012 have also been reviewed, so all Locked-document edits happen together rather than piecemeal. Do not treat this Approval as authorization to edit any Locked document yet.

No implementation, migration, or code change is authorized by this document.

## 2. Context / Problem

`SA-ARCH-012` (Domain Model) defines **Tenant** (Realized) and **Workspace** — "a sub-division within a Tenant... a department, project, site, or branch" — as explicitly **Conceptual**, with this document's own words: *"no Workspace model exists today... this is an open modeling question, not an oversight... should be resolved together with the still-undecided `B-EXT` industry-edition extension model, not designed in isolation."*

ESA must now represent organizations ranging from a single-site SMB to a multi-entity, multi-site enterprise — without hard-coding one company's structure, and without collapsing "one organization" into "one open archive." No existing document names Legal Entity/Business Unit, Site/Facility, Department, Team/Function, or Restricted Area as domain concepts; today's vocabulary stops at the undifferentiated Workspace placeholder.

A related, previously undocumented question: administration itself is not scoped anywhere. `SA-ARCH-011`'s Administration capability row has no governing ADR at all — nothing states that an administrator can be bounded to one Site or Department rather than the whole organization.

**Round 1 Founder review (this revision responds to it):** the direction was approved in principle; six specific modifications were required before further approval — see §3 below, which is substantially rewritten from Rev 1.0. The rewrite's central correction: Rev 1.0 treated "organizational structure," "operational/collaboration scope," and "security restriction" as one undifferentiated chain, with Workspace as its forced terminal node. These are three different kinds of concept that happen to compose into a hierarchy *in use* — they do not share one semantic, and the model must say so explicitly.

## 3. Decision

### 3.1 Five distinct concept categories (not one undifferentiated chain)

This is the terminology correction the rest of §3 is built on:

| Category | Concepts | Semantics |
|---|---|---|
| **Organizational structure** | Legal Entity / Business Unit, Site / Facility / Branch, Department, Team / Function | *Who the organization is* — its formal/administrative shape. Forms the optional linear chain in §3.2. |
| **Operational / collaboration scope** | Workspace | *Where work actually happens* — a project, initiative, or working group. Attaches beneath an organizational-structure node, at whatever depth that node's owners choose; not itself part of the organizational-structure chain. |
| **Security restriction** | Restricted Area | *A stricter authorization boundary*, layered beneath an organizational-structure node or a Workspace where a narrower grant list than the parent is required. Not a kind of Workspace — its own category, defined by what it *does* (tighten access), not by where it sits. |
| **Document / Record** | Document | Governed content (existing — Realized). |
| **Role / User authorization** | Role, User | Access identity and grants (existing — Realized, ADR-004), evaluated against nodes from every category above. |

### 3.2 Organizational structure chain (optional, linear)

```
Organization / Tenant  (existing — Realized, ADR-002; root boundary)
  → Legal Entity / Business Unit   (new — Conceptual, optional)
    → Site / Facility / Branch     (new — Conceptual, optional)
      → Department                (new — Conceptual, optional)
        → Team / Function         (new — Conceptual, optional)
```

**Every level below Tenant is optional**, and a chain may terminate at any point — a small business may have only Tenant, with none of the four structure levels populated at all. No application code may assume a fixed depth or that any level besides Tenant exists.

### 3.3 Workspace — operational/collaboration scope, variable attachment depth

**Correction from Rev 1.0:** Workspace is **not** defined as the terminal/leaf organizational node, and is **not** required merely because a Document needs somewhere to attach (see §3.5). Workspace is a flexible operational/collaboration boundary that may be created beneath **any** organizational-structure node — Tenant directly, a Site, a Department, or a Team/Function — depending on how a given organization chooses to work. Depth is not fixed. Illustrative, non-exhaustive shapes:

```
Department → Workspace
Department → Team/Function → Workspace
Site → Workspace
Tenant → Workspace                 (no intervening structure at all)
```

A Workspace's structural parent is whichever single node it was created beneath (see §3.6, Canonical Parentage) — the organizational-structure chain in §3.2 does not dictate where a Workspace must sit; the organization's own administrators choose.

### 3.4 Restricted Area — a distinct security-restriction concept, not a Workspace type

**Correction from Rev 1.0:** Restricted Area is **not** modeled as another name or subtype of Workspace. It is its own category (§3.1), defined by function: a node that establishes a **stricter authorization boundary** than its parent, wherever one is required. A Restricted Area may sit beneath an organizational-structure node directly, or beneath a Workspace:

```
Engineering (Department) → Project Alpha (Workspace) → Restricted Contracts Area
HR (Department) → Recruitment (Workspace) → Executive Recruitment (Restricted Area)
Legal (Department) → Restricted Area                      (no Workspace in between)
```

A Restricted Area's defining property (see §3.7): access to it is **not** automatically granted by holding access to its parent. A parent grant may extend downward *where policy allows* (§3.7) — a Restricted Area is precisely the node that can require its own explicit grant regardless of what access exists above it.

### 3.5 Document attachment — Tenant plus the single most appropriate scope, never forced

**Correction from Rev 1.0:** a Document is **not** forced through every hierarchy level, and is **not** forced through a Workspace. A Document belongs to exactly one Tenant (unchanged, ADR-002) and *may additionally* be assigned to the single most appropriate node reached from any category in §3.1 — whichever level actually fits that document, nothing more. Illustrative, non-exhaustive:

```
Tenant → Document
Tenant → Site → Document
Tenant → Department → Document
Tenant → Department → Workspace → Document
Tenant → Department → Workspace → Restricted Area → Document
```

Exact persistence design (how this optional single-scope reference is stored) is explicitly implementation-stage work, not decided in this ADR.

### 3.6 Canonical parentage — one structural parent, no multi-parent grafting

**Resolves Rev 1.0's open cardinality question, per Founder direction:** every organizational-structure, Workspace, or Restricted Area node has **exactly one** canonical structural parent. A Workspace is never modeled with two structural parents to represent, e.g., a cross-department project.

Cross-department and cross-site **collaboration** is handled by **explicit authorization grants** layered on top of the single-parent structure (§3.7), or by a future governed sharing mechanism — never by giving a node ambiguous or multiple ancestry. This is required for predictable authorization inheritance, auditing, ownership, routing, and AI authorization ([ADR-012](ADR-012-ai-permission-inheritance.md)) — every one of which depends on a node having one unambiguous position in the tree.

### 3.7 Boundary principle and authorization inheritance

**ONE ORGANIZATION IS NOT ONE OPEN ARCHIVE.** Tenant membership alone grants no default visibility into any node beneath it.

**Inheritance rule, stated precisely (corrects Rev 1.0's looser wording):**

- Parent-level authorization **may** extend to descendant nodes **where policy allows** — inheritance is a permitted behavior, not an unconditional guarantee.
- A **Restricted Area may impose a stricter boundary that overrides this** — holding access to a parent node does **not** by itself guarantee access to a Restricted Area beneath it. A Restricted Area can require its own explicit, additional grant regardless of what access exists above it. Parent access ≠ unconditional descendant access.
- **Sibling access is never implied.** Access to one Department, Site, or Workspace grants nothing toward any sibling node at the same level.
- **Cross-boundary access (cross-department, cross-site) is always an explicit additional grant**, never a default or an accidental consequence of structural proximity.

This section defines the **architectural invariant** a future ADR-004 ABAC implementation must enforce. It does not design the ABAC mechanism itself (rule syntax, evaluation order, condition storage) — that remains future implementation-stage work, explicitly out of scope here, exactly as ADR-004 originally deferred ABAC's mechanics while committing to the extension point.

Every node above (from any of §3.1's five categories) becomes an authorization-scope resource passed to the *existing* `authorize()` gate (ADR-004) as its `resource` parameter — this ADR introduces no second permission system.

### 3.8 Scoped Administration

Folded into this ADR rather than a separate one (see §13, Alternatives) because administration scope is an application of the same structure, not a new concept.

An "Administrator" is never a single global flag. Administrative capability is granted along two independent dimensions:

- **Scope node** — any node from §3.1's organizational-structure, operational-scope, or security-restriction categories (Tenant, Legal Entity/Business Unit, Site/Facility, Department, Team/Function, Workspace, or Restricted Area).
- **Functional area** — general administration, security/authorization administration, device/intake administration ([ADR-011](ADR-011-device-and-intake-governance.md)), integration administration.

The two dimensions are independent: a person can hold Site-scoped + device-intake-functional-area administration without also holding Organization-scoped + security administration. Both dimensions resolve through the *existing* `authorize()` gate (ADR-004) — administration is not a parallel permission system. A scoped administrator's authority does not extend past its granted scope node — an administrator scoped to a Department cannot, by virtue of that grant alone, act on a sibling Department, a different Site, or the Organization as a whole (same §3.7 inheritance rule, applied to administrative action rather than document access).

This deliberately avoids pre-enumerating every (scope × functional-area) combination as a named Role up front — that would be role explosion. Named Roles ("Site Administrator," "Security Administrator") are curated *bundles* of (scope, functional-area) grants, a later product/UX decision, not an architecture requirement decided here.

## 4. Scope

Domain-model and conceptual-boundary decision only. No database schema, no migration, no API shape, no ABAC implementation, and no assignment of this hierarchy to any real customer's actual structure.

## 5. Domain Model implications

Extends `SA-ARCH-012`. New Conceptual concepts, now explicitly categorized (§3.1): **Legal Entity / Business Unit**, **Site / Facility**, **Department**, **Team / Function** (organizational structure); **Workspace** (operational/collaboration scope — existing `SA-ARCH-012` entry re-scoped to variable-depth attachment rather than a fixed terminal position, per §3.3); **Restricted Area** (new — security restriction, a distinct concept from Workspace, per §3.4). `Document`'s Tenant-ownership rule ("belongs to exactly one Tenant") is unchanged; a Document may additionally belong to one node from any of the categories above, per §3.5.

## 6. Security implications

Establishes "one organization is NOT one open archive" as an architectural invariant, not only a product statement. ADR-002's RLS continues to enforce **cross-Tenant** isolation, unchanged. This ADR is the domain-model prerequisite for ADR-004's still-deferred ABAC to eventually enforce **intra-Tenant** isolation (cross-department, cross-site, and Restricted Area boundaries) — it does not itself implement that enforcement, and defines the invariant (§3.7) that implementation must satisfy: a Restricted Area's stricter boundary must be capable of overriding inherited parent access, not merely coexisting with it.

## 7. Authorization implications

Supplies the scope vocabulary ADR-004's currently-generic `resource` parameter needs once Stage 2+ ABAC is designed — ADR-004 already anticipated conditions being added "inside the same function body" without specifying their shape; this ADR is that shape, refined in §3.7 to distinguish permitted inheritance from a Restricted Area's override. Restricted Areas are a distinct authorization concept from Workspace (corrected from Rev 1.0): the same `authorize()` mechanism, but a node explicitly allowed to require a narrower grant than its parent extends by default.

## 8. Data-model implications (conceptual — no migration authorized)

Each new organizational-structure or operational/security node would need its own table carrying a single nullable parent-link (per §3.6's canonical-parentage rule — never a many-to-many parent relation) and an `organization_id` column for RLS, following the pattern ADR-002 already established. A Document's optional scope reference (§3.5) points to exactly one node at whatever level was actually assigned — not a fixed foreign key to a "Workspace" table specifically, since a Document may terminate its scope at any category's node.

## 9. API implications

None designed here. Future Administration and Document APIs would need to accept an optional, variable-level hierarchy-scope reference rather than assuming Tenant is the only addressable unit or that Workspace is the only attachable node.

## 10. AI implications

This ADR defines the scope vocabulary [ADR-012](ADR-012-ai-permission-inheritance.md) (AI Permission Inheritance) resolves AI retrieval against — an AI operation executes within the requesting identity's actual granted scopes, including any Restricted Area override, not merely their Tenant membership. This document does not itself specify AI behavior.

## 11. Integration implications

A future Connector (`B3`) importing from an external ERP/CRM should be able to map external organizational units (cost centers, plants, departments) onto this hierarchy rather than flattening everything to Tenant level — a `B3`-time design concern, not decided further here.

## 12. Migration / backward-compatibility implications

No implementation is authorized by this ADR. When implementation is later authorized: every hierarchy level is nullable/optional, so existing Tenant-and-Document data (today's `folder`/`category` model) remains valid with no hierarchy assigned. Hierarchy adoption is opt-in per organization, not a forced migration.

## 13. Alternatives considered / rejected

- **Fixed universal hierarchy** (every organization must populate every level) — rejected: hard-codes one company's shape, directly contradicted by the Founder's explicit instruction.
- **Fully generic, unbounded-depth nesting with no named levels** — rejected for now: maximally flexible but gives ADR-004's future ABAC nothing stable to reason about, and is harder for administrators to understand. Revisit only if named levels prove insufficient in practice.
- **Flatten everything onto Document tags instead of a real hierarchy** — rejected: tags carry no membership/inheritance semantics and no stable authorization scope; `SA-ARCH-012` already implicitly rejected this by keeping Workspace a structural concept.
- **Force Legal Entity/Business Unit == Tenant (one Tenant per legal entity)** — rejected as a mandated assumption: some ESA customers will want one Tenant spanning multiple legal entities (shared services); others will want one Tenant per entity. Left as configuration, not architectural mandate.
- **Workspace as the sole terminal node, required for every Document** (Rev 1.0's shape) — rejected on Founder review: forces structure a simple organization doesn't need and misrepresents Workspace's semantics as identical to "wherever a Document attaches." Replaced by §3.3/§3.5.
- **Restricted Area modeled as a Workspace subtype** (Rev 1.0's shape) — rejected on Founder review: conflates an operational/collaboration concept with a security-restriction concept that has a different defining property (the ability to override inherited access). Replaced by §3.4.
- **Multi-parent Workspace to represent cross-department collaboration** — rejected on Founder review: produces ambiguous ancestry that undermines predictable inheritance, auditing, ownership, routing, and AI authorization. Cross-boundary collaboration is instead an explicit grant or a future governed sharing mechanism (§3.6).
- **A separate Scoped Administration ADR** — rejected: administration scope is the hierarchy applied to who may manage what; splitting it out would create two documents that must always be read together, with no independent decision content of its own.

## 14. Dependencies

- [ADR-002](ADR-002-multi-tenancy.md) — Tenant/RLS isolation. Unchanged; this ADR builds *inside* a Tenant, never across Tenants.
- [ADR-004](ADR-004-authorization.md) — `authorize()`. The enforcement mechanism this ADR's scopes plug into.
- [SA-ARCH-012](../SA-ARCH-012_Domain_Model.md) — the document this ADR extends.
- [ADR-006](ADR-006-platform-extension-model.md) (`B-EXT`) — `SA-ARCH-012` already tied Workspace's resolution to `B-EXT`; this ADR is that resolution and should be read alongside ADR-006, not as reopening it.

## 15. Relationship to existing ADRs

Extends, does not supersede, ADR-002 and ADR-004 — both remain Locked and unchanged, the same non-superseding pattern ADR-009 already used for its own relationship to them. Resolves the specific open question `SA-ARCH-012` named for Workspace, now with Workspace and Restricted Area distinguished as separate concepts per Founder direction.

## 16. Documents requiring synchronization AFTER approval

- `SA-ARCH-012` — Workspace re-scoped to variable-depth attachment (not a terminal node); **Restricted Area** added as a new, distinct Conceptual concept (not a Workspace subtype); Legal Entity/Business Unit, Site/Facility, Department, Team/Function added as organizational-structure concepts.
- `SA-ARCH-011` — Administration capability row gains a governing document (this ADR) and a stated scope model.
- `SA-TRACE-001` — new rows for the new domain concepts, all "Not yet traceable" until implementation.
- `SA-BIZ-001-24` Glossary — new terms, with Workspace vs. Restricted Area explicitly distinguished per §3.1.

## 17. Implementation prerequisites

This ADR must be Approved before any Workspace/hierarchy database work begins. `B-EXT` (already Approved) is a co-requisite context, not a blocker — this ADR does not reopen or change B-EXT's decisions.

## 18. Risks

Under-using the hierarchy (every customer only ever using Tenant + Document) makes the intermediate categories dead weight — mitigated by full optionality. Over-fitting named levels to enterprise assumptions that don't suit an SMB — mitigated by the same optionality. A new risk introduced by this revision's flexibility: variable-depth Workspace/Restricted Area attachment is harder to query/report on generically than Rev 1.0's fixed terminal position — accepted as the correct tradeoff per Founder direction, to be addressed at the data-model/implementation stage (§8), not by re-introducing a fixed shape here.

## 19. Open questions

- Whether Legal Entity/Business Unit ever needs isolation stronger than Tenant-level (e.g., data residency differing between two Legal Entities inside one Tenant) — flagged, not answered; likely a `B5` (compliance) question, not this ADR's.
- Exact mechanism for a future "governed sharing" path referenced in §3.6 (for legitimate cross-department/cross-site collaboration beyond a one-off explicit grant) — named as a possibility, not designed here; a candidate topic for a future ADR if explicit-grant-only proves insufficient in practice.

*(Rev 1.0's cardinality open question — "can a Workspace belong to more than one Department?" — is resolved by §3.6: no. Removed from this section accordingly.)*

## 20. Founder decision points

1. Approve the five-category model (§3.1) — organizational structure, operational/collaboration scope, security restriction, document/record, role/user authorization — as the correct conceptual separation.
2. Approve Workspace's variable-depth attachment (§3.3) in place of Rev 1.0's fixed terminal position.
3. Approve Restricted Area as its own distinct concept (§3.4), not a Workspace subtype, with the explicit override-of-inheritance property.
4. Approve single canonical parentage (§3.6) and explicit-grant-only cross-boundary collaboration, rejecting multi-parent Workspace modeling.
5. Approve the refined inheritance rule (§3.7): parent access extends where policy allows; a Restricted Area may require its own explicit grant regardless of parent access; sibling access is never implied.
6. Reconfirm the two-dimensional (scope × functional-area) Scoped Administration model (§3.8) against the revised scope-node set.

## Revision History

| Rev | Change |
|---|---|
| 1.0 | Initial Draft, prepared as part of the ESA Architecture Draft Package following the Founder-approved ESA Core Architecture Reconciliation Audit (2026-08-29). |
| 1.1 | Founder review round 1 (verdict: MODIFY) incorporated. Rewrote §3 (Decision) around five explicitly distinguished concept categories (§3.1). Workspace redefined as variable-depth operational/collaboration scope, no longer a forced terminal node (§3.3). Restricted Area introduced as its own security-restriction category, not a Workspace subtype, with an explicit inheritance-override property (§3.4). Document attachment loosened to "Tenant plus the single most appropriate node at any level," never forced through Workspace (§3.5). Canonical single-parentage rule added, resolving Rev 1.0's open multi-parent-Workspace question by prohibiting it; cross-boundary collaboration routed through explicit grants instead (§3.6). Authorization-inheritance rule restated precisely: parent access extends only where policy allows, and a Restricted Area may override it (§3.7). Scoped Administration (§3.8) scope-node set updated to match. Alternatives, synchronization list, risks, open questions, and Founder decision points updated to match throughout. Status remains Draft. |
| 1.2 | **Founder Approved** on round 1 review of Rev 1.1 — the five-category model, flexible/optional organizational structure, Workspace as operational/collaboration scope, Restricted Area as a distinct security concept with override power, single-most-appropriate Document attachment, canonical single structural parentage, the refined authorization-inheritance invariants, Scoped Administration (scope × functional area), and continued use of the existing ADR-004 `authorize()` gate are all confirmed as approved. No content rewrite — status transition only (Draft → Approved). Per explicit Founder direction, synchronization edits to Locked documents (§16) remain **not authorized** until ADR-011 and ADR-012 have also been reviewed, for one coordinated synchronization pass. Not yet Locked (first review). |
