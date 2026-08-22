# SA-ARCH-014-03 — Family Entitlement Architecture

## Document Information

| Field | Value |
|---|---|
| Document ID | SA-ARCH-014-03 |
| Title | Family Entitlement Architecture |
| Version | 1.0 |
| Status | **Draft** |
| Owner | Architecture team — SmartArchive AI Platform |
| Classification | Internal |
| Parent Document | SA-ARCH-014 – Account, Family and Entitlement Architecture |
| Created | 2026-08-16 |
| Last Updated | 2026-08-16 |
| Dependencies | [ADR-009](../../adr/ADR-009-account-tenant-family-entitlement.md), [SA-ARCH-014-01](SA-ARCH-014-01-Account_Architecture.md), [SA-ARCH-014-02](SA-ARCH-014-02-Personal_Tenant_Architecture.md) |

---

# Purpose

Define Family as an **entitlement and billing group**: who may sit on a Family Package, who pays, and what Family must never become.

# Scope

**In scope:** Family meaning; Owner vs members; v1 cardinality; seats; privacy default.

**Out of scope:** payment provider; UI; invitation token implementation details (see [SA-ARCH-014-08](SA-ARCH-014-08-Family_Invitation_Lifecycle.md)); document sharing features.

# Terminology

- **Family** — entitlement/billing group of Accounts.
- **Family Owner** — Account that manages the Family subscription.
- **Family Member** — Account that holds a seat; keeps a separate personal Tenant.
- **Seat** — a countable entitlement slot on the Family subscription. Not an archive.

# Architecture Relationships

Family sits **above** Entitlement and **beside** Tenants. It does not sit inside ADR-002 isolation.

```text
Family (entitlement group)
  ├── Owner Account → Personal Tenant (private)
  └── Member Accounts → each Personal Tenant (private)
```

ESA collaboration Tenants are unrelated ([SA-ARCH-014-02](SA-ARCH-014-02-Personal_Tenant_Architecture.md)).

# Family is an entitlement / billing group

Family answers: *who is covered by this paid (or trial-adjacent) Family Package?* It does not answer: *whose documents are in this archive?*

The Owner manages membership, invitations, seats, billing, and entitlement information. Entitlement itself is evaluated server-side ([SA-ARCH-014-04](SA-ARCH-014-04-Subscription_and_Entitlement_Service.md)).

# Family is not a Tenant and not an Organization

Family has no `organization_id` that holds member documents. It must not be persisted as an `Organization` row used as a shared archive. ADR-002 continues to isolate **Tenants**, not Families.

# Separate member archives

Every Family participant has:

- own Account
- own login
- own personal Tenant
- own documents
- own AI history
- own settings and language (as they apply in that Tenant)

Membership does **not** expose member documents or AI history to the Owner or to other members.

# Owner and members

| | Owner | Member |
|---|---|---|
| Separate Account and personal Tenant | Yes | Yes |
| Manage invitations, seats, billing/entitlement | Yes | No (unless later explicitly granted — not in v1) |
| Automatic access to others’ archives | No | No |
| Covered by Family entitlement | Yes | Yes, while membership is active |

# Adult-only v1

Family v1 is **adult-only**. Accounts that cannot be treated as adult must not be invited or accepted into Family in v1.

This document does **not** specify an age-verification product or legal process. That is a later Founder/legal decision. Until specified, architecture assumes adult-only enrollment and does not invent KYC.

# One Family per Account in v1

An Account may belong to **at most one Family** in v1 (as Owner or as Member, not both in two Families). Moving between Families is a membership lifecycle event, not a second concurrent Family.

# Configurable seat limit

The maximum number of seats is **configurable**, not hard-coded in architecture or in this document. Configuration belongs to product/operations settings in a later implementation wave. Architecture requires that a limit exists and is enforced by Entitlement, not by UI hiding.

# Family membership does not grant document or AI access

Default:

```text
Family
├── Owner     → Private documents / AI history
├── Member A  → Private documents / AI history
└── Member B  → Private documents / AI history
```

If document sharing is ever introduced, it must be explicit, user-controlled, and outside this v1 Family definition. It is not implied by paying for a Family Package.

# Constraints

- Do not model Family as shared Organization.
- Do not make Owner an Organization superuser over members ([SA-ARCH-014-09](SA-ARCH-014-09-Owner_and_Member_Access_Boundaries.md)).
- Joining Family does not mint a new introductory trial ([SA-ARCH-014-05](SA-ARCH-014-05-Trial_Eligibility_and_History.md)).

# Assumptions

- Founder-approved v1 rules: adult-only, one Family per Account, configurable seats.

# Risks

- Product copy that says “Family View / shared family organization” (Master Context) can be misread as this model. Master Context is not edited in Wave A; Wave B should align language after ADR-009 approval.

# References

- [ADR-009](../../adr/ADR-009-account-tenant-family-entitlement.md)
- [SA-ARCH-014-04](SA-ARCH-014-04-Subscription_and_Entitlement_Service.md)
- [SA-ARCH-014-08](SA-ARCH-014-08-Family_Invitation_Lifecycle.md)
- [SA-ARCH-014-09](SA-ARCH-014-09-Owner_and_Member_Access_Boundaries.md)

# Change History

| Version | Date | Description |
|---|---|---|
| 1.0 | 2026-08-16 | Draft. Family as entitlement group; not a Tenant. |
