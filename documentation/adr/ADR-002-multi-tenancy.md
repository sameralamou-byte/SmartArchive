# ADR-002 — Multi-tenancy via shared schema + PostgreSQL RLS

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-07-30 |
| Related | SA-ARCH-001, SA-ARCH-006 |

## Context
SmartArchive serves multiple organizations (tenants) from one deployment.
Tenant data must never leak across organizations, even in the presence of
an application-level bug (missing `WHERE organization_id = ...` clause).

## Decision
Single shared database and schema. Every tenant-owned table carries an
`organization_id` column. PostgreSQL Row-Level Security is enabled and
**forced** on each of these tables, with a policy comparing
`organization_id` against a per-request session variable
(`app.current_org_id`) set by `app/core/tenancy.py` from the authenticated
user's JWT claims. Enforcement happens in the database, not application code.

## Alternatives considered
- **Schema-per-tenant.** Strong isolation, but migrations must run against
  every tenant schema, connection pooling gets complicated (one pool per
  schema or `SET search_path` per request — itself a footgun), and
  cross-tenant analytics/reporting becomes harder. Rejected for
  operational complexity at our expected tenant count.
- **Database-per-tenant.** Maximum isolation, but highest infrastructure
  cost and operational overhead (backups, migrations, connections all
  multiply by tenant count). Rejected as over-engineering for Phase 1;
  revisit only if a specific enterprise customer contractually requires
  physical database isolation.
- **Application-level filtering only (no RLS).** Rejected outright: a
  single missing filter in a new endpoint becomes a cross-tenant data
  leak. RLS makes the failure mode "query returns nothing" instead of
  "query returns someone else's documents."

## Consequences
- Every new tenant-scoped table must (a) include `organization_id`, and
  (b) get a corresponding RLS policy added in the same migration —
  process, not tooling, currently enforces this; a migration lint check
  is a good Stage 2 addition.
- Every request must call `set_tenant_context()` before any tenant-scoped
  query; forgetting this doesn't cause a leak (FORCE ROW LEVEL SECURITY
  means "no org context" reads as "no rows"), but it does cause confusing
  empty results — worth a clear error path if it happens in practice.
