# Smart Archive

# Glossary

## Document Information

| Field | Value |
|--------|-------|
| Document ID | SA-BIZ-001-24 |
| Title | Glossary |
| Version | 1.0 |
| Status | Draft |
| Owner | Smart Archive Team |
| Classification | Internal |
| Parent Document | SA-BIZ-001 – Product Vision & Business Architecture |
| Created | 2026-08-16 |
| Last Updated | 2026-08-16 |
| Authority | [ADR-009](../../adr/ADR-009-account-tenant-family-entitlement.md) (Approved v1.1), [SA-ARCH-012](../../SA-ARCH-012_Domain_Model.md), [SA-ARCH-013](../../SA-ARCH-013_Product_Vision_and_Evolution.md), [SA-ARCH-011](../../SA-ARCH-011_Capability_Map.md) |

---

# Purpose

Concise business-facing definitions for Account, Tenant, Family, and related terms. Definitions are copied from approved architecture. This glossary does not invent commercial numbers, legal conclusions, or implementation.

---

# Terms

Account ≠ User ≠ Tenant ≠ Organization ≠ Family ≠ Entitlement.

| Term | Definition |
|---|---|
| **Account** | Durable customer identity. Trial eligibility, subscription/entitlement, and Family membership attach to the Account, not to an Organization or Tenant. |
| **User** | Authenticated actor who acts within a Tenant context. Distinct from Account. |
| **Tenant** | Data-isolation boundary for documents and tenant-owned data (ADR-002). Not the durable customer identity. Not a Family. |
| **Personal Tenant** | The private SmartArchive archive belonging to one Account. Every Account has exactly one. Isolation boundary for that person’s documents, AI history, and private archive. |
| **Personal Archive** | The documents and history held in a person’s Personal Tenant. Family membership does not merge personal archives. |
| **Organization** | Realized today as the Tenant isolation unit (`Organization` / `organization_id` / RLS). Not Family. Not the durable customer identity (that is Account). ESA organizations are collaboration Tenants. |
| **ESA Tenant** | A collaboration Tenant, distinct from Family. People invited into an ESA Tenant share that Tenant’s documents according to that Tenant’s roles and `authorize()`. Family entitlement does not automatically apply to an ESA Tenant. |
| **Family** | Entitlement, membership, and billing group of Accounts. Family is **not** a Tenant, **not** an Organization, **not** a shared document archive, and **not** a replacement for RLS. Members retain separate Accounts and separate private Personal Tenants. |
| **Family Owner** | Account that manages Family membership, invitations, seats, billing, and entitlement information. Consumes one Family seat. Has **no** automatic access to member documents, AI history, or private archives. Must not be modeled as Organization superuser over member Tenants. |
| **Family Member** | Account covered by a Family seat while membership is active. Keeps a separate private Personal Tenant. Membership does not grant access to another member’s archive. |
| **Entitlement** | What an Account may use (Individual vs Family, seats, trial vs paid). Not Role, not Permission, and not Authorization. Must not be implemented as RBAC roles. |
| **Authorization** | What a User may do inside a Tenant, evaluated through `authorize()` (ADR-004). Separate from Entitlement. |
| **Seat** | A countable entitlement slot on a Family package. Not an archive. The Family Owner consumes one Family seat. The seat **limit** is configurable; this glossary does not set a number. |
| **Trial** | One introductory trial belonging to the Account. Creating another Tenant must not mint another introductory trial. Joining or creating a Family must not mint another. There is no Family trial SKU in v1. Duration and included features are not defined here. |

**Audience language:** “individuals,” “families,” and “households” describe who Home is for ([SA-ARCH-013](../../SA-ARCH-013_Product_Vision_and_Evolution.md)). They do **not** mean that a Family package creates a shared document Tenant.

**Family View:** a named Home product/UI concept for Family membership, entitlement, and management. It is not a shared document repository.

---

# Non-goals

This glossary does not specify prices, payment provider, trial duration, trial features, numeric seat defaults, KYC or age-verification method, risk weights, fraud scores, billing implementation, or GDPR legal conclusions.

---

# Change History

| Version | Date | Description |
|----------|------|-------------|
| 1.0 | 2026-08-16 | Wave C1. Terminology from ADR-009 / SA-ARCH-012 / SA-ARCH-013. |
