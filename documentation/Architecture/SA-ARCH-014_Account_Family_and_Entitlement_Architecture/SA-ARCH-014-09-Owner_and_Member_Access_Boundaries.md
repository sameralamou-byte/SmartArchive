# SA-ARCH-014-09 — Owner and Member Access Boundaries

## Document Information

| Field | Value |
|---|---|
| Document ID | SA-ARCH-014-09 |
| Title | Owner and Member Access Boundaries |
| Version | 1.0 |
| Status | **Draft** |
| Owner | Architecture team — SmartArchive AI Platform |
| Classification | Internal |
| Parent Document | SA-ARCH-014 – Account, Family and Entitlement Architecture |
| Created | 2026-08-16 |
| Last Updated | 2026-08-16 |
| Dependencies | [SA-ARCH-014-02](SA-ARCH-014-02-Personal_Tenant_Architecture.md), [SA-ARCH-014-03](SA-ARCH-014-03-Family_Entitlement_Architecture.md), [ADR-002](../../adr/ADR-002-multi-tenancy.md), [ADR-004](../../adr/ADR-004-authorization.md), [ADR-009](../../adr/ADR-009-account-tenant-family-entitlement.md) |

---

# Purpose

State a clear **access matrix**: what a Family Owner may manage, and what the Owner must not automatically see. Forbid modeling Family Owner as Organization superuser.

# Scope

**In scope:** Owner vs member vs SmartArchive operator; document/AI isolation; relationship to `authorize()` and RLS.

**Out of scope:** future explicit sharing; support-operator break-glass (not designed here); implementation.

# Terminology

- **Automatic access** — visibility that exists solely because of Family Owner status.
- **Explicit access** — a later, user-controlled share (not in v1 Family).
- **Superuser** — today’s `User.is_superuser`, which bypasses `authorize()`. Must not mean Family Owner over member Tenants.

# Architecture Relationships

- ADR-002 prevents cross-Tenant document reads when members have separate Tenants.
- ADR-004 `authorize()` must not be bypassed by stamping Owner as superuser on member Tenants.
- Entitlement ([SA-ARCH-014-04](SA-ARCH-014-04-Subscription_and_Entitlement_Service.md)) does not confer archive access.

# Access matrix

| Resource / action | Family Owner | Family Member | Other Family members |
|---|---|---|---|
| Own personal Tenant documents | Yes | Yes | No |
| Own AI analysis / AI history | Yes | Yes | No |
| Own document history / versions | Yes | Yes | No |
| Member documents | **No** (not automatic) | Own only | **No** |
| Member document history | **No** | Own only | **No** |
| Member AI analysis / history | **No** | Own only | **No** |
| Member private archive (settings, reminders, assistant history in that Tenant) | **No** | Own only | **No** |
| Family membership list (who has a seat) | Yes | Limited (own status; full roster only if later product-approved — default: Owner) | — |
| Create / revoke invitations | Yes | No | No |
| Configure seats (within configurable limit) | Yes | No | No |
| Subscription / entitlement / billing information for the Family | Yes | Own coverage status only, not Owner payment details unless required by law later | No |
| ESA Tenant documents (if that Account is also in an ESA org) | Per that ESA Tenant’s RBAC — **not** via Family | Same | N/A |

“Limited membership list for members” is not implemented and not required in v1; the table records that **document access** is never implied.

# Owner may manage

- Family membership
- Invitations
- Seats
- Subscription / entitlement information for the Family Package

# Owner may not automatically access

- Member documents
- Member document history
- Member AI analysis
- Member private archive

# Do not model Family Owner as Organization superuser

Current code sets `is_superuser=True` on the first user of a new Organization. That pattern is acceptable only as “admin of **that** Tenant,” and is already a sharp tool because it skips `authorize()`.

It is **forbidden** as the Family Owner model:

- Owner must not be superuser on member personal Tenants.
- Owner must not be superuser on a fictional “Family Organization” that contains member documents (that Organization must not exist).

When Family-management APIs are later authorized, they must go through `authorize()` plus Entitlement (“caller is Family Owner”), never through a blanket superuser flag on someone else’s archive.

# Constraints

- Do not implement the matrix in Wave A.
- Do not add a UI “Family files” view that lists member documents.
- Support/appeal access, if ever needed, is a separate operator path with audit — not Owner privilege. Not designed here.

# Assumptions

- v1 has no implicit household sharing.
- Adult-only Family (014-03) still uses this matrix; adulthood does not grant Owner extra document rights.

# Risks

- Any “convenient” admin query without Tenant context would violate ADR-002. Family admin features must not disable RLS.

# References

- [ADR-002](../../adr/ADR-002-multi-tenancy.md)
- [ADR-004](../../adr/ADR-004-authorization.md)
- [ADR-009](../../adr/ADR-009-account-tenant-family-entitlement.md)
- [SA-ARCH-014-07](SA-ARCH-014-07-Privacy_and_GDPR_Boundaries.md)
- `backend/app/security/authorize.py` (inspection only: superuser short-circuit)

# Change History

| Version | Date | Description |
|---|---|---|
| 1.0 | 2026-08-16 | Draft. Owner/member access matrix; Owner is not superuser over members. |
