# ADR-004 — Centralized RBAC-now, ABAC-ready authorization

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-07-30 |
| Related | SA-ARCH-001 |

## Context
The security policy requires both RBAC and ABAC. Building full ABAC
(department, ownership, classification, time, IP restrictions) in Phase 1
would delay the foundation milestone for capabilities nothing yet needs.

## Decision
A single function, `authorize(session, user, action, resource)` in
`app/security/authorize.py`, is the only place permission checks happen.
No route or service ever inlines a permission check. Phase 1 implements
RBAC only inside that function (role → permission lookup). Stage 2+ adds
ABAC conditions inside the same function body, using the `resource`
parameter that already exists in the signature.

## Alternatives considered
- **Route-level `@requires_permission("...")` decorators with inline
  logic.** Rejected: works fine for RBAC alone, but adding ABAC later means
  either rewriting every decorator or bolting ABAC checks onto call sites
  piecemeal — exactly the churn this ADR exists to avoid.
- **Build ABAC now, even if unused.** Rejected as premature: no Phase 1
  feature has attribute-based rules to enforce, and speculative
  generality without real use cases tends to guess the wrong abstraction.
- **Policy-as-code engine (OPA/Cedar) from day one.** Worth revisiting once
  ABAC rules are actually needed — deferred rather than rejected, to avoid
  operating an extra service before there's a policy complex enough to
  justify it.

## Consequences
- Every new protected endpoint must call `authorize()` — this is a code
  review checklist item, not (yet) statically enforced.
- The `Permission` catalogue is global (not tenant-scoped) by design: the
  set of possible actions is fixed by the product, while which roles have
  which permissions is tenant-scoped (`Role`/`RolePermission`).
