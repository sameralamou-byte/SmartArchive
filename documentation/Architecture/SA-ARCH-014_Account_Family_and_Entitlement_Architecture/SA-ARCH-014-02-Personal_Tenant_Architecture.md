# SA-ARCH-014-02 — Personal Tenant Architecture

## Document Information

| Field | Value |
|---|---|
| Document ID | SA-ARCH-014-02 |
| Title | Personal Tenant Architecture |
| Version | 1.0 |
| Status | **Draft** |
| Owner | Architecture team — SmartArchive AI Platform |
| Classification | Internal |
| Parent Document | SA-ARCH-014 – Account, Family and Entitlement Architecture |
| Created | 2026-08-16 |
| Last Updated | 2026-08-16 |
| Dependencies | [ADR-002](../../adr/ADR-002-multi-tenancy.md), [ADR-009](../../adr/ADR-009-account-tenant-family-entitlement.md), [SA-ARCH-014-01](SA-ARCH-014-01-Account_Architecture.md) |

---

# Purpose

State that **Tenant remains the data-isolation boundary**, that each person’s SmartArchive archive is private, and that Family must not be implemented as a shared Tenant or a shared `organization_id`.

# Scope

**In scope:** isolation rules; personal vs ESA vs Family; relationship to ADR-002.

**Out of scope:** changing RLS policies, JWT claims, or `set_tenant_context()`; Workspace (still conceptual in SA-ARCH-012).

# Terminology

- **Tenant** — isolation unit, realized today as `Organization`.
- **Personal Tenant** — the private archive of one person.
- **ESA Tenant** — a collaboration Tenant for Enterprise use.
- **Family** — not a Tenant (see [SA-ARCH-014-03](SA-ARCH-014-03-Family_Entitlement_Architecture.md)).

# Architecture Relationships

[ADR-002](../../adr/ADR-002-multi-tenancy.md) is **authoritative** for how isolation is enforced:

- shared database and schema;
- `organization_id` on tenant-owned tables;
- PostgreSQL Row-Level Security **forced**;
- `app.current_org_id` set from the authenticated request.

This package **does not supersede ADR-002**. It assigns product meaning: the personal archive is one Tenant per person, not one Tenant per Family.

# Tenant remains the isolation boundary

Documents, document versions, AI jobs, OCR jobs, folders, and other tenant-owned rows remain visible only within the Tenant whose `organization_id` is in context. Application code must not be the only barrier (ADR-002).

The personal SmartArchive archive is **private** to that Tenant. Family membership does not place another Account’s rows into that Tenant.

# Family does not become a shared Tenant

Family is an entitlement/billing group. It has no document corpus of its own in v1.

**Forbidden model:**

```text
Family Organization (one organization_id)
  ├── Owner documents
  ├── Member A documents
  └── Member B documents
```

That model would make RLS share the archive — the opposite of the Founder rule.

**Required model:**

```text
Account Owner  → Personal Tenant (private)
Account Member → Personal Tenant (private)
        ↑
   Family entitlement (billing/seats only)
```

# Family does not reuse one organization_id for all members

Members must not share a single `organization_id` in order to “be a Family.” Shared `organization_id` **is** shared archive under ADR-002. Family linkage belongs on the Account/entitlement side, outside the isolation key.

# ESA collaboration Tenant remains distinct from Family

ESA organizations are collaboration Tenants: people who are invited into an enterprise archive **do** share that Tenant’s documents according to that Tenant’s roles and `authorize()` rules. That is an explicit collaboration product, not Family.

| | Personal Tenant | ESA Tenant | Family |
|---|---|---|---|
| Isolation key | own `organization_id` | org `organization_id` | none (not a Tenant) |
| Default document access | only that person | org members per RBAC | none across members |
| Purpose | private HSA archive | enterprise collaboration | billing/seats |

An Account may have a personal Tenant **and** an ESA membership. That does not merge Family into ESA.

# Current code (inspection only — not changed)

- `backend/app/core/tenancy.py` — sets `app.current_org_id`
- `backend/app/models/mixins.py` — `TenantMixin.organization_id`
- `backend/alembic/versions/0001_initial_schema.py` — RLS policies
- `backend/app/models/document.py` — `owner_id` exists, but isolation is still `organization_id`

`owner_id` is not a substitute for personal Tenants. It does not isolate Family members if they share an Organization.

# Constraints

- Do not weaken FORCE RLS.
- Do not introduce a Family `organization_id` as a document scope.
- Do not treat “shared family organization” as the architecture (that product phrase is a known Master Context conflict; Master Context is not edited in Wave A).

# Assumptions

- ADR-002 remains Locked and in force.
- Personal Tenant count is one per person as approved.

# Risks

- Using Phase 2 “invite into org” (commented in `auth_service.py`) as Family invite would create a shared archive by default.

# References

- [ADR-002](../../adr/ADR-002-multi-tenancy.md)
- [ADR-009](../../adr/ADR-009-account-tenant-family-entitlement.md)
- [SA-ARCH-001](../../SA-ARCH-001.md) §1 Multi-tenancy (Locked; not edited)
- [SA-ARCH-014-09](SA-ARCH-014-09-Owner_and_Member_Access_Boundaries.md)

# Change History

| Version | Date | Description |
|---|---|---|
| 1.0 | 2026-08-16 | Draft. Personal Tenant isolation; Family is not a Tenant. |
