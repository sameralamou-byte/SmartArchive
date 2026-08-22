# SA-AUTH-001 — Account Email Verification Foundation

## Frozen Implementation Specification

| Field | Value |
|---|---|
| Document ID | SA-AUTH-001 |
| Title | Account Email Verification Foundation |
| Version | 1.2 |
| Status | **Frozen specification — pending independent Claude review. Implementation is not authorized.** |
| Date | 2026-08-16 |
| Owner | Product / Authentication — SmartArchive Home (HSA) |
| Classification | Internal |
| Authority | Founder authorization to prepare this specification only. SA-UX-009 is closed/accepted. This is the next SmartArchive wave **on paper**. |
| Related | ADR-002 (Locked), ADR-004 (Locked), ADR-008, ADR-009 (Approved v1.1), SA-ARCH-014-01, SA-ARCH-014-05, SA-ARCH-014-06, SA-UX-009 (closed), Slice 1 |

**This document does not authorize implementation.** Do not modify backend, frontend, database, migrations, authentication code, architecture documents, or configuration because of this file.

Independent Claude review is required. Founder implementation authorization is a later, separate act.

This specification **supersedes SA-UX-009 §E.2** only where that section required immediate `POST /login` and navigation to `/app` after register. Confirm-email and confirm-password fields, archive name, and Slice 1 register API body remain. SA-UX-009 is **not edited**.

v1.2 incorporates the six independent-review conditions without reversing any v1.1 product decision or any Slice 1 architecture rule. The conditions are freeze language, not new features.

---

## 1. Purpose

Prove that the person who created a SmartArchive Account **owns the mailbox** they registered with, then **activate** that Account for normal Home use.

v1 identity chain (unchanged Slice 1):

```text
Account  →  Personal Tenant (private archive)  →  User
```

Verification is an **Account** fact. It is not a Tenant row, not an `authorize()` permission, not a JWT claim, and not a trial or Family feature.

Named product flow (frozen):

```text
Register  →  Verify mailbox  →  Activate Account  →  Login  →  /app
```

Normal `/app` access requires a verified email. Unverified Accounts occupy the email (Slice 1 uniqueness) but cannot obtain a product session and cannot use `/app`.

This wave does **not** start, deny, display, or enforce a trial. TrialHistory remains unread.

---

## 2. Frozen product decisions

1. **Account is the identity.** `email_verified_at` lives on `accounts`. Tokens are Account-scoped, not User-scoped, not Organization-scoped.
2. **Real mailbox proof.** Matching the two register email fields is **not** verification. Verification is a secret delivered only to that mailbox.
3. **Protocol:** emailed single-use opaque token, 24-hour expiry, **hash persisted / raw token never stored**, POST consume only.
4. **Register still creates the Slice 1 triple** (Personal Tenant + Account + User) in one transaction and returns `201`. There is no pending-registration table.
5. **Register does not sign the person in.** Frontend must not call login after `201`. The next screen is “check your email.”
6. **Activation = first successful verify.** `accounts.email_verified_at` is set to UTC now. `is_active` is **not** used for this (it remains the disable/lock flag). Unverified Accounts are created with `is_active = true` as today.
7. **Login issues JWTs only after activation.** Correct password on an unverified Account returns `403` with code `email_not_verified` — not `401`, and not tokens.
8. **Normal `/app` requires verified email.** The **server** is the security boundary (no JWT until verified; product APIs reject unverified Accounts). React may hide `/app` but must not be the only control. `/dev/*` stays development-only and is unchanged.
9. **Confirm-email and confirm-password fields remain** on `/register`. They stay client-side typo guards.
10. **Verify does not issue JWTs.** After activation the person **logs in**. The email link is not magic-link authentication.
11. **Resend is unauthenticated by email.** Every well-formed request returns the **same `202` envelope**, including existing, nonexistent, already-verified, inactive, and **rate-limited** addresses. Limiters may suppress send/token rotation; they must not change the client-visible response. Login remains unavailable until verified, so resend cannot depend on a Bearer token.
12. **JWT claims stay** `sub`, `org_id`, `account_id`, `type`, `iat`, `exp`. No `email_verified` claim.
13. **`authorize()` is unchanged** (ADR-004). Verification is not a role and not a permission string.
14. **ADR-002 RLS is unchanged.** Verification tables are not TenantMixin and do not use `organization_id` RLS (same pattern as `trial_history`).
15. **Existing Slice 1 Accounts are unverified** after the future migration (`email_verified_at` null). No grandfathering.
16. **Account email-change is out of scope** (no API, no UI, no token reuse for a new address). Password reset, SSO, OTP, Family, Entitlement, Billing, C2, and HSA-08 remain out of this wave.

---

## 2A. Independent-review conditions (v1.2 freeze)

These six conditions are **normative**. They restated v1.1; they do not add Family, Entitlement, billing, or email-change.

| # | Condition | Freeze in this document |
|---|---|---|
| C1 | Define `email_verified` / verification state separately from `is_active` | §5.2 and §5.4. Verification is only `accounts.email_verified_at`. `accounts.is_active` and `users.is_active` remain disable/lock flags. Neither flag is set, cleared, or overloaded to mean “verified.” |
| C2 | Bind verification to Account, never Organization/Tenant | §4 and §6.2. Token FK is `accounts.id` only. No `organization_id` column, no TenantMixin, no RLS on verification rows, no verify-by-org-slug. |
| C3 | Enforce unverified-account blocking **server-side**, not only in React | §9.2, §9.3, §9.7. Login must not issue JWTs. Product APIs must `403` unverified sessions. React `/app` guards are UX only and are **not** the security boundary. |
| C4 | Raw verification tokens are never stored; only hashes are persisted | §7. Database, Redis, JWT, and files store **hash only**. Raw token exists in memory, the mailbox (or `LogEmailSender` delivery line), and the one POST body. |
| C5 | Resend is non-enumerating for existing, nonexistent, already-verified, **and rate-limited** addresses | §9.5 and §11. Well-formed resend is always the same `202` body. Rate-limit **does not** change status, body, or headers that would distinguish those cases. |
| C6 | Account email-change remains out of scope | §17.1. No change-email endpoint, UI, or “verify a different address” flow. |

---

## 3. Current state (inspection only)

Inspected 2026-08-16. Writing this document changes none of it.

| Fact | Today |
|---|---|
| Register | `POST /api/v1/auth/register` creates Organization + Account + User; `201` `UserRead`; no tokens |
| Frontend register | Confirm email + confirm password; then login; then `/app` |
| Login | Account email → Personal Tenant User; `401` on bad credentials or inactive |
| `UserRead` | `id`, `email`, `full_name`, `is_active`, `organization_id` |
| Account | `email` globally unique; `is_active`; `personal_organization_id`; **no verification column** |
| JWT | `sub` = user id, `org_id` = Personal Tenant, `account_id` = identity only |
| Rate limits | register 5/60s/IP, login 10/60s/IP, refresh 30/60s/IP |
| Mailer | **None** in config or code |
| `notifications` | Tenant-scoped reminders schema — **not** usable as the verification mailer |
| TrialHistory | Exists; register/login/UI do not consult it |
| Auth integration test | `test_register_then_login_then_refresh` expects login `200` immediately after register |

SA-ARCH-014-01 left the verification **mechanism** unspecified. This document selects it.

---

## 4. Account identity (Slice 1 — preserved)

Do not redesign. Future implementation must keep:

| Rule | Detail |
|---|---|
| Cardinality | One Account, one Personal Tenant, one User at register |
| Email uniqueness | `accounts.email` globally unique. Duplicate register remains `409` whether or not verified |
| Isolation | Documents and tenant tables: `organization_id` + RLS (ADR-002) |
| Authorization | `authorize()` only (ADR-004) |
| JWT | `sub` / `org_id` / `account_id` remain distinct. UI never displays UUIDs |
| Superuser | First User is admin of **that** Personal Tenant only |
| Login lookup | Account email → `personal_organization_id` → User. Optional `organization_slug` stays fail-closed and **absent** from Home UI |
| TrialHistory | Account-scoped ledger; still not an eligibility engine in this wave |

Verification **adds** an Account timestamp and a token table beside this model. It does not merge Account into Organization, does not add Family, and does not put `email_verified` into RLS.

**Binding rule (C2):** verification state and verification tokens are bound to **Account id** only. They are never bound to `organizations.id`, never keyed by `organization_slug`, never stored on `users.organization_id`, and never placed on a TenantMixin table. Personal Tenant remains the archive isolation boundary (ADR-002). It is not the mailbox-identity boundary.

---

## 5. End-to-end flow

### 5.1 Happy path

```text
1. Person completes /register (emails match, passwords match, archive name set)
2. POST /api/v1/auth/register
     → insert Organization, Account (email_verified_at NULL), User
     → insert hashed verification token (24h)
     → attempt transactional email (failure does not roll back register)
     → 201 UserRead { email_verified: false, ... }
3. UI shows /register/check-email  (no login, no /app)
4. Person opens mail, clicks {PUBLIC_APP_ORIGIN}/verify-email?token=RAW
5. Frontend POSTs { token } to /api/v1/auth/verify-email
     → consume token
     → set accounts.email_verified_at  (= activation)
     → 200 { email_verified: true }
6. UI: “Your email is confirmed.” Primary action: Sign in → /login
7. POST /api/v1/auth/login  → 200 tokens
8. GET /api/v1/users/me → email_verified: true
9. /app allowed
```

### 5.2 What “activation” is

Activation is **not** a second API and **not** `is_active`.

| State | `email_verified_at` | Login | `/app` and product APIs |
|---|---|---|---|
| Registered, not verified | `NULL` | `403` `email_not_verified` | Denied **by the API** (React must not be the only check) |
| Verified / activated | set | `200` tokens (if password and active flags OK) | Allowed |
| Disabled (`is_active` false on Account or User) | any | `401` invalid credentials (existing behavior) | Denied |

### 5.3 Confirm fields vs verification

| Mechanism | When | Proves |
|---|---|---|
| Confirm email + confirm password | Before register request | Typo prevention |
| Token in mailbox | After register | Ownership of that address |

If confirm fields mismatch, the API is not called (current UI). If they match, the Account is still **unverified** until the token flow succeeds.

### 5.4 `email_verified` vs `is_active` (C1)

These are **independent** fields. Implementation must not collapse them.

| Field | Owner | Meaning in this wave | Set when | Cleared when |
|---|---|---|---|---|
| `accounts.email_verified_at` | Account | Mailbox ownership proven; Account activated for login/`/app` | First successful `POST /auth/verify-email` | **Never in this wave** (no email-change) |
| `email_verified` (API bool) | Derived | `accounts.email_verified_at IS NOT NULL` | — | — |
| `accounts.is_active` | Account | Account not disabled/locked | `true` at register (Slice 1, unchanged) | Ops/disable flows **not in this wave** |
| `users.is_active` | User | User actor not disabled | `true` at register (unchanged) | Not this wave |

Required combinations:

| `is_active` (Account and User) | `email_verified_at` | Login result |
|---|---|---|
| true | `NULL` | `403` `email_not_verified` — **not** `401`, **not** treated as inactive |
| true | set | `200` tokens |
| false (either) | `NULL` or set | `401` invalid credentials (existing inactive behavior; do not return `email_not_verified`) |

Forbidden:

- Setting `is_active = false` to mean “awaiting email confirm.”
- Setting `is_active = true` to mean “email verified.”
- Using `users.is_active` as the verification flag.
- Putting verification on `organizations`.

---

## 6. Target database changes

Additive only. Next Alembic revision after `0002_account_tenant_trial`. No edits to 0001/0002. No RLS policy changes. No document/org data movement.

### 6.1 `accounts.email_verified_at`

| Column | Type | Null | Default |
|---|---|---|---|
| `email_verified_at` | `timestamptz` | yes | `NULL` |

- `NULL` = not verified / not activated for `/app`.
- Set once on first successful confirm. Later successful/idempotent confirms **do not** change the timestamp.
- Existing rows after upgrade: `NULL` (honest: those mailboxes were never proven).
- This column is **not** `is_active` and must not replace `is_active`.

Do not add a boolean-only column in place of this timestamp. Do not add `email_verified_at` (or any verification flag) to `organizations` or `users`.

### 6.2 `account_email_verification_tokens`

Not TenantMixin. Not RLS. FK to `accounts.id` `ON DELETE RESTRICT`.

| Column | Type | Null | Notes |
|---|---|---|---|
| `id` | UUID PK | no | `gen_random_uuid()` |
| `account_id` | UUID FK | no | Indexed. **Only** FK: `accounts.id`. Not `organizations.id` |
| `token_hash` | `bytea` **or** `char(64)` hex | no | HMAC-SHA-256 of raw token; unique. **Not** the raw token |
| `expires_at` | `timestamptz` | no | `created_at + 24 hours` |
| `consumed_at` | `timestamptz` | yes | Set on successful consume |
| `created_at` | `timestamptz` | no | Server default now() |

Constraints:

- `UNIQUE (token_hash)`
- **At most one unconsumed token per Account:** `UNIQUE (account_id) WHERE consumed_at IS NULL`
- Resend replaces the unused token (delete or consume the previous unconsumed row, then insert). Old email links die.

**Forbidden on this table:** `organization_id`, TenantMixin, RLS policies, `user_id` as the identity key.

No `organization_id` on this table.

### 6.3 What is not migrated

- No change to `users`, `organizations`, `trial_history`, JWT tables (there are none), or RLS functions.
- No backfill of `email_verified_at`.
- Password hashes unchanged.

---

## 7. Token security

| Rule | Freeze |
|---|---|
| Entropy | 32 bytes from `secrets.token_bytes` (or equivalent CSPRNG) |
| Transport encoding | URL-safe base64 or hex in the query string only |
| **Persistence (C4)** | **Raw tokens are never stored.** Only `token_hash` is persisted. No raw-token column, no plaintext in Redis, no JWT claim, no file/object dump |
| At rest | HMAC-SHA-256(raw_token, `EMAIL_VERIFICATION_SECRET`) |
| Secret | Dedicated `EMAIL_VERIFICATION_SECRET`. **Not** `JWT_SECRET_KEY` |
| TTL | **24 hours** from issue |
| Use count | One successful consume |
| API consume | **`POST /api/v1/auth/verify-email` only** |
| GET API | **Must not exist** for verify. Email scanners prefetch GET and would activate or burn tokens |
| Compare | Lookup by hash; unknown / expired / consumed-invalid → same `400` |
| Logs / metrics | Production must not emit raw token. After frontend POST, replace history to drop `?token=` |
| Dev delivery | `LogEmailSender` / `MemoryEmailSender` may hold the URL **in process** as the mailbox stand-in. That is delivery, not a persisted credential store. Tests read it from memory; it must not be written to Postgres |
| Not a password | Do not run bcrypt on these tokens (unnecessary; HMAC + uniqueness is the store) |
| Not a session | Verify response has no `access_token` / `refresh_token` |

Invariant for reviewers and implementers: a database dump of `account_email_verification_tokens` must be insufficient to reconstruct any raw token.

---

## 8. Email-provider abstraction

Do not use `app.models.notification`. Do not select SendGrid/SES/Postmark in this spec.

### 8.1 Port

```text
EmailSender.send(
  to: str,
  subject: str,
  text_body: str,
  html_body: str | None,
) -> None
```

Verification service builds `verify_url = {PUBLIC_APP_ORIGIN}/verify-email?token={raw}` and locale-specific subject/body, then calls `EmailSender`.

### 8.2 Adapters

| Adapter | When | Behavior |
|---|---|---|
| `LogEmailSender` | Development default (`EMAIL_DELIVERY_MODE=log`) | INFO log of recipient + full verify URL. No network. Required for local/CI without SMTP |
| `SmtpEmailSender` | Production-shaped (`EMAIL_DELIVERY_MODE=smtp`) | SMTP via env host/port/user/password/TLS |
| `MemoryEmailSender` | Automated tests | Captures last message(s) in process; tests read the token URL from here |

Wiring is config/DI. Application code talks only to `EmailSender`.

### 8.3 Environment names (frozen for later implementation)

| Variable | Purpose |
|---|---|
| `PUBLIC_APP_ORIGIN` | Link origin, e.g. `http://localhost:5174` |
| `EMAIL_FROM` | From address |
| `EMAIL_DELIVERY_MODE` | `log` \| `smtp` |
| `EMAIL_VERIFICATION_SECRET` | HMAC key |
| `SMTP_HOST` `SMTP_PORT` `SMTP_USER` `SMTP_PASSWORD` `SMTP_USE_TLS` | SMTP adapter only |

Register **must succeed** if send raises. Log the failure. Person uses resend.

### 8.4 Message content

- Transactional only. No marketing, trial, Family, billing, tracking pixels.
- Locales: EN / DE / AR (ADR-008). Locale from `Accept-Language`, else `en`. **Do not** add locale to `RegisterRequest`.
- English spec copy:
  - Subject: `Confirm your SmartArchive email`
  - Body: `Please confirm the email for your SmartArchive account.` + link + `This link expires in 24 hours.`
- Token not in the subject. Plain text required; HTML optional and equivalent.

---

## 9. API contracts

Prefix `/api/v1`. JSON.

### 9.1 `POST /auth/register`

**Request body unchanged:** `email`, `password` (min 8), `full_name`, `organization_name`.

| Result | Status | Notes |
|---|---|---|
| Created | `201` | `UserRead` including `email_verified: false`. Token issued; email attempted |
| Duplicate Account email | `409` | Unverified or verified — same as today. UI may point to resend / sign in, not a second Account |
| Rate limit | `429` | 5 / 60s / IP unchanged |
| Validation | `422` | Existing pydantic |

Mail failure: still `201`.

### 9.2 `POST /auth/login`

Request body unchanged: `email`, `password`, optional `organization_slug`.

| Condition | Status | Body |
|---|---|---|
| Unknown email, wrong password, inactive, slug mismatch | `401` | Existing invalid-credentials detail (do not reveal “unverified”) |
| Password correct, Account/User active, **not verified** | `403` | `{ "detail": "Confirm your email before signing in.", "code": "email_not_verified" }` |
| Password correct, verified, active | `200` | `TokenResponse` unchanged |
| Rate limit | `429` | 10 / 60s / IP unchanged |

No tokens on `403`. Wrong password must not return `403` (would leak verification state without proving the password).

### 9.3 `POST /auth/refresh`

If the Account is unverified, `401` (defense in depth; this wave should not have issued the refresh token). Do not mint new tokens for unverified Accounts.

### 9.4 `POST /auth/verify-email` (new, unauthenticated)

```json
{ "token": "<raw>" }
```

| Case | Status | Body |
|---|---|---|
| Valid unconsumed, unexpired, Account unverified | `200` | `{ "email_verified": true }` + set `email_verified_at`, set `consumed_at` |
| Valid token, Account **already verified** (replay of leftover unconsumed or consumed token for that Account if hash still resolvable) | `200` | `{ "email_verified": true }` — idempotent; do not change `email_verified_at` |
| Missing, unknown, expired, or consumed token that cannot be treated as already-verified | `400` | `{ "detail": "This confirmation link is invalid or has expired." }` |
| Rate limit | `429` | See §11 |

Do **not** add `GET /auth/verify-email`.  
Do **not** return JWTs.  
Do **not** accept a redirect URL from the client.

**Already-verified + expired/unknown token:** `400` generic (cannot distinguish without leaking). The person uses `/login`.

**Already-verified + still-valid unconsumed token** (resend after verify race): consume it, `200`, leave original `email_verified_at`.

### 9.5 `POST /auth/resend-verification` (new, unauthenticated)

```json
{ "email": "<EmailStr>" }
```

**Non-enumeration (C5):** every well-formed request returns **HTTP `202`** and **exactly this body** (same bytes, same `detail` string). No extra fields.

```json
{ "detail": "If this email can be confirmed, a new message is on its way." }
```

This identical `202` applies to all of:

| Case | Client-visible result | Server may |
|---|---|---|
| Existing Account, unverified, active, under limit | `202` same body | Replace unused token; send mail |
| Nonexistent email | `202` same body | Do nothing |
| Already-verified Account | `202` same body | Do not send |
| Inactive Account | `202` same body | Do not send |
| **Rate-limited** email hash and/or IP | `202` same body | Do **not** send; do **not** rotate token; do **not** return `429` |
| Mail send failure after a permitted send | `202` same body | Log failure without raw token |

Do **not** vary status, `detail`, `Retry-After`, `email_verified`, or timing in a way that is intended to distinguish those cases. Best-effort constant work is required: apply the same limiter increment for every well-formed email, including nonexistent ones, **before** lookup results are used to decide whether to send.

`422` only for invalid email **shape** (not a registered-address leak).  
**`429` is forbidden on this path.** Limiters are internal suppressors, not a client signal.

Authenticated resend is **not** required in this wave (there is no product session before activation). Do not add a second resend path.

### 9.6 `GET /users/me`

Additive field only:

```text
UserRead:
  id, email, full_name, is_active, organization_id,
  email_verified: bool   # accounts.email_verified_at IS NOT NULL
```

- Requires a valid access token **and** verified Account (product gate, §9.7). React is not this gate.
- UI still must not display `organization_id`.
- Do not add `account_id` or `email_verified_at` to the payload.

Register `201` uses the same model, so it includes `email_verified: false` without requiring a session.

### 9.7 Product API gate — server-side (C3)

React route guards are **not sufficient**. A client that ignores the UI, calls the API with curl, or uses a helper-issued JWT must still be blocked.

After a valid JWT is decoded and the User is loaded (existing `get_current_user`):

1. Load the **Account** by `user.account_id` (not by `organization_id`).
2. If Account `email_verified_at` is null → `403` `{ "detail": "Confirm your email before continuing.", "code": "email_not_verified" }`.
3. Apply this in **server code** to all authenticated product routers (`/users`, `/files`, and any later sibling under `/api/v1` except the auth exceptions below).

**Allowed without verified email:**

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/verify-email`
- `POST /auth/resend-verification`
- Health: `/health`, `/live`, `/ready` (and current health paths as implemented)
- `/metrics` as today

`POST /auth/refresh` requires a refresh token and must refuse unverified Accounts (`401`). Do not mint new tokens for unverified Accounts.

Primary block: **login does not issue JWTs** until `email_verified_at` is set (§9.2).  
Secondary block: product dependencies refuse unverified Accounts even if a token exists.

Do **not** implement the gate inside `authorize()` and do **not** add a permission `email.verified`.
Do **not** treat a hidden `/app` route as enforcement.

---

## 10. Frontend changes (specified, not implemented)

Reuse Weave `Alert`, `Button`, `Input`, `Container`. No HSA-08 restyle. No Family/billing chrome. Confirm-email and confirm-password **remain**.

### 10.1 Routes

| Route | Auth | Role |
|---|---|---|
| `/register` | PublicOnly | Unchanged fields; on `201` → `/register/check-email` **without** login |
| `/register/check-email` | Public (not PublicOnly bounce-if-authed; not RequireAuth) | “Check your email”; resend |
| `/verify-email` | Public (same: reachable signed-out; if a stray session exists, do not bounce before POST) | Consume token via POST; then Sign in |
| `/login` | PublicOnly | On `403` `email_not_verified` → message + resend + link to check-email |
| `/app/*` | RequireAuth **and** `email_verified === true` | UX only. If tokens exist but `/users/me` is `403` `email_not_verified`: clear session. **Server still denies product APIs even if this guard is removed.** |
| `/dev/*` | Unchanged | Not “normal `/app` access” |

`PublicOnly` today redirects authed users from `/login` and `/register` to `/app`. `/register/check-email` and `/verify-email` must **not** use that bounce.

### 10.2 Register

- Fields: Full name, Email, Confirm email, Password, Confirm password, Archive name.
- Mismatch: no API call (current).
- Success: **do not** `login()`, **do not** `setTokens`, **do not** `navigate('/app')`.
- Navigate to `/register/check-email` with the email in **location state** (not the token). If state is lost on refresh, show an email field for resend.

### 10.3 Check-email page

- Heading: `Check your email`
- Body: `We sent a confirmation link to {email}. Confirm it before you sign in.`
- Action: `Resend confirmation email` → `POST /auth/resend-verification`
- Always show the generic 202 copy after the request succeeds at HTTP layer. Do **not** show a distinct “rate limited” state for this endpoint (it does not return `429`).
- Link: `Already confirmed? Sign in`

### 10.4 Verify-email page

- Read `token` from query; if missing → generic invalid copy.
- `POST /auth/verify-email`; **never** GET the API.
- Success → `Your email is confirmed.` Primary: Sign in (`/login`). Do **not** auto-login.
- Failure → generic invalid/expired copy; offer resend (needs email input if unknown) and Sign in.
- Replace history to strip `token` after the POST attempt.
- No third-party scripts on this page (Referer/token leakage).

### 10.5 Login

- Email + password only (no Organization field — SA-UX-009).
- `403` + `code === "email_not_verified"`: `Confirm your email before signing in.` + resend using the email they typed + link to check-email.
- `401`: existing incorrect-credentials copy.
- Success: existing `/users/me` then `/app`.

### 10.6 AppShell / Account

- No persistent “please verify” banner **inside** `/app`, because unverified users never stay there.
- Account page may show `Email confirmed` after login (optional, truthful). No resend on Account in this wave (they are already verified to be there).
- Still never display `organization_id` / `account_id`.

### 10.7 Locale

New EN / DE / AR strings for check-email, verify, login unverified, resend generic copy. RTL unchanged.

---

## 11. Rate limits

Existing limits unchanged for register, login, refresh, and verify-email.

| Path | Limit | Key | Client-visible when exceeded |
|---|---|---|---|
| `POST /auth/register` | 5 / 60s | IP | `429` (unchanged) |
| `POST /auth/login` | 10 / 60s | IP | `429` (unchanged) |
| `POST /auth/refresh` | 30 / 60s | IP | `429` (unchanged) |
| `POST /auth/verify-email` | 20 / 60s | IP | `429` |
| `POST /auth/resend-verification` | 3 / 15 min per **normalized email hash** **and** 5 / 60s per IP | Hash the email in the Redis key (not the raw email). Increment **whether or not** the Account exists | **Still `202` same body.** No send, no token rotation, no `Retry-After`, no `429` |

Redis down: keep current fail-open middleware behavior.

The generic `/api/v1` default limiter must **not** attach a `429` to resend that would bypass §9.5. Resend is exempt from a client-visible 429, including the default 120/60s cap: if that cap would fire, treat it as internal suppress + `202`, or set resend’s explicit policy as the only limiter for that path.

---

## 12. Failure, expiry, replay, already-verified

| Case | API | UI |
|---|---|---|
| Confirm fields mismatch | No request | Current mismatch alerts |
| Duplicate email (verified or not) | `409` | Current conflict copy; may add “Sign in or resend confirmation” **without** claiming which |
| Mail send fails at register | `201` | Check-email + resend |
| Token expired | `400` generic | Invalid/expired copy + resend |
| Token unknown / tampered | `400` generic | Same |
| Token already consumed, Account unverified (should not happen if consume is transactional with activation) | `400` generic | Resend |
| Token already consumed, Account verified | `200` if the consumed row can still be resolved to that Account; else `400` | Success → Sign in, or invalid copy |
| Double-click verify | Idempotent `200` | Success → Sign in |
| Replay of raw token after consume, hash row retained | Treat as already-verified `200` if `consumed_at` set and Account verified; else `400` | Prefer Sign in |
| Resend unknown email | `202` generic | Same generic copy |
| Resend already verified | `202` generic; no mail | Same |
| Resend existing unverified | `202` generic; mail if under internal limit | Same |
| Resend when internally rate-limited | `202` generic; no mail; no token rotation | Same — **not** a rate-limit alert |
| Login unverified, good password | `403` `email_not_verified` | Confirm + resend |
| Login unverified, bad password | `401` | Incorrect credentials |
| Login verified | `200` | `/app` |
| Unverified JWT hitting `/users/me` or `/files` (helper-issued or stale) | `403` `email_not_verified` **from the API** | Clear session; leave `/app` |
| Rate limit on register / login / verify-email | `429` | Existing rate-limit message |
| Inactive Account | `401` | Incorrect credentials (unchanged) |

Token consume and `email_verified_at` update **must be one database transaction**.

---

## 13. Tests (required when implementation is authorized)

Do not run or write these now. Future wave must include them.

### 13.1 Must update

`test_register_then_login_then_refresh` **will fail** under this contract (login becomes `403`). Replace with: register → capture token from `MemoryEmailSender` → verify → login `200` → me `email_verified: true` → refresh `200`.

Any other test that logs in immediately after register must verify first (or use a test helper that activates the Account in-process **without** skipping hash/TTL rules in API tests).

### 13.2 New API / service tests

1. Register creates Account with `email_verified_at` null, `is_active` true, and one unconsumed **token hash** (raw token absent from DB and from Redis).
2. Register `201` even when `EmailSender` raises.
3. Duplicate register `409` while unverified.
4. Login unverified + `is_active` true + correct password → `403` + `email_not_verified` + no tokens (not `401`).
5. Login unverified + wrong password → `401` (not `403`).
6. Login inactive Account (verified or not) → `401` (not `email_not_verified`).
7. Verify valid token → `email_verified_at` set; `is_active` unchanged; second POST → `200` idempotent; timestamp unchanged.
8. Verify expired token → `400`; login still `403`.
9. Verify unknown token → `400`.
10. Resend replaces unconsumed token; old raw token → `400`; new token → `200`.
11. Resend unknown email → `202` same body; no token row.
12. Resend verified email → `202` same body; no new mail.
13. Resend existing unverified over the internal limiter → `202` same body; no new mail; no token rotation; **not** `429`.
14. Login after verify → `200`; `GET /users/me` → `email_verified: true`.
15. Helper-issued access token for unverified User → `/users/me` and `/files` → `403` `email_not_verified` with **no frontend involved**.
16. `GET /auth/verify-email` is 405 or 404 (not consume).
17. JWT payload has no `email_verified`. Token table has no `organization_id`.
18. No change-email / patch-email route exists.
19. Register body still does not require extra fields; password min 8 unchanged.
20. RLS isolation tests still pass; `authorize()` tests still pass; Slice 1 cardinality tests still pass.

### 13.3 Frontend tests

1. Register success does not call login and lands on check-email.
2. Confirm-email / confirm-password mismatch still blocks submit.
3. Check-email resend POSTs `{ email }`.
4. Verify page POSTs token and does not GET the API.
5. Login `403` `email_not_verified` does not enter `/app`.
6. RequireAuth + unverified (simulated) redirects away from `/app` — **in addition to**, not instead of, API tests in §13.2 item 15.

---

## 14. Acceptance criteria (future implementation)

1. New register does not grant `/app` access until the mailbox token succeeds and the person logs in.
2. Confirm-email and confirm-password fields still exist and still behave as typo guards.
3. Tokens are single-use, 24h, hashed, HMAC with dedicated secret, POST-consumed only.
4. Dev can complete the flow with `LogEmailSender` / `MemoryEmailSender` (no vendor).
5. SMTP adapter exists behind `EmailSender` and is unused unless configured.
6. Login `403` vs `401` distinction matches §9.2.
7. Product APIs reject unverified sessions **without relying on React**; auth verify/resend/register/login do not require verification.
8. Duplicate email remains `409`; resend does not create a second Account; resend `202` is identical for existing, nonexistent, already-verified, and internally rate-limited addresses.
9. Existing Slice 1 Accounts are unverified until they complete this flow.
10. `email_verified_at` is independent of `is_active`; unverified+active is `403`, not inactive.
11. Raw tokens are absent from persisted storage; only hashes are stored.
12. No Account email-change API or UI ships in this wave.
13. ADR-002, ADR-004, JWT claim set, Family absence, TrialHistory non-enforcement, HSA-08, and register field set (except post-success navigation) remain intact.
14. Independent review of **this specification** completed before coding.

---

## 15. Migration and rollback safety

### 15.1 Upgrade

- New Alembic revision only (after `0002_account_tenant_trial`).
- `ADD COLUMN accounts.email_verified_at timestamptz NULL` — no table rewrite required beyond the column add.
- `CREATE TABLE account_email_verification_tokens` + indexes/constraints in §6.2.
- No `UPDATE` that sets `email_verified_at` on existing rows.
- No RLS enable on the new table or on `accounts`.
- Deploy order (when authorized): migrate → backend that understands the column → frontend that stops auto-login. If frontend ships first, people would land in `/app` unverified against an API that still issues tokens — **forbidden**. If backend ships first without frontend, register still auto-logs in from old UI but new login/product gate would `403` them out of `/app` until they verify — acceptable briefly; mail + check-email UI should ship in the same implementation wave.

### 15.2 Rollback

`downgrade()`:

1. `DROP TABLE account_email_verification_tokens`
2. `DROP COLUMN accounts.email_verified_at`

Effects:

- Verification state and unused tokens are **destroyed**.
- Slice 1 Account / Tenant / User rows remain.
- After rollback, previous login-immediately-after-register behavior can resume only if backend/frontend code is also rolled back.
- Rolling back the **schema** while leaving new code deployed will error (missing column). Schema and code roll back together.
- This rollback cannot “un-send” email already delivered.

No document, RLS, or TrialHistory rollback is involved. No data backfill to reverse.

### 15.3 Failure modes

- Additive migration must not fail because of existing nulls (column is nullable).
- Unique partial index on unconsumed tokens: at most one per Account at apply time (empty table).
- Preflight: none beyond standard Alembic. Slice 1 legacy preflight is **not** reused for this (it is for 0002 email mapping).

---

## 16. Security and privacy boundaries

| Boundary | Rule |
|---|---|
| Isolation | ADR-002 unchanged. Tokens are not tenant documents. |
| Authorization | ADR-004 unchanged. No RBAC flag for verified email. |
| Session | Password login after activation only. Verify is not authentication. |
| Enumeration | Resend: identical `202` for existing, nonexistent, already-verified, inactive, and rate-limited addresses. Login `403` only after **correct password**. Register `409` remains (existing product). |
| Secrets | Raw token is never persisted. Hash only in DB. HMAC secret ≠ JWT secret. |
| Prefetch | Frontend GET landing; API POST consume. |
| Open redirect | Server `PUBLIC_APP_ORIGIN` only. |
| PII | Email is already Account identity. Mail contains email + confirm link. No documents, no archive contents, no UUIDs in the email body. |
| Logs | No passwords, no raw tokens, no JWT dumps. |
| Abuse | Rate limits only. **No** automatic ban/termination (ADR-009). No device fingerprint, GPS, or fraud score. |
| Privacy / GDPR | Not a legal determination. No new marketing list. No third-party analytics on `/verify-email`. |
| `/dev/*` | Unchanged; not a verified-email product surface. |
| Superuser | Still Personal Tenant admin only; verification does not create platform admin. |

---

## 17. Out of scope

### 17.1 Account email-change (C6) — explicit exclusion

This wave **must not** introduce:

- `PATCH`/`PUT`/`POST` to change `accounts.email` or `users.email`
- UI to edit email on `/app/account` or settings
- Re-verification of a **new** address
- Transfer of `email_verified_at` onto a different mailbox
- A second mailbox on the same Account
- Treating confirm-email fields as an email-change flow

The verified mailbox is the Account email captured at **register**. Changing it is a later Founder-authorized specification.

### 17.2 Other exclusions

- Family membership, invitations, seats, Owner document access
- Entitlement Service, Individual vs Family SKUs
- Billing, Stripe, C2 commercial content
- HSA-08 visual language and `/dev/hsa-understanding` productionization
- AI document analysis / document intelligence / OCR / classification
- Reminders engine, ACE, `notifications` delivery
- Document list or search APIs
- Abuse engine / risk scoring
- Password reset, magic-link login, SSO, WebAuthn, SMS OTP
- Trial start/deny UI or TrialHistory writes
- httpOnly cookie session redesign
- Putting `email_verified` in JWT
- KYC / age verification
- Editing ADR-002, ADR-004, ADR-009, SA-ARCH-014, or SA-UX-009 as part of this spec wave

---

## 18. Rejected alternatives

| Alternative | Why rejected |
|---|---|
| Allow `/app` while unverified (SA-AUTH-001 v1.0) | Founder requires verified email before normal `/app` access; flow is register → verify → activate → login |
| Pending row instead of Slice 1 Account at register | Breaks atomic Account + Personal Tenant + User; loses global email uniqueness on `accounts` |
| Use `is_active=false` until verify | Collides with disable/lock; today’s login would `401` “invalid credentials” instead of a confirmable `403`. **C1 forbids overloading `is_active`.** |
| Auto-login on successful verify | Founder named **login after** activation; verify must not become magic-link auth |
| Authenticated-only resend | No product session exists before activation |
| Frontend-only `/app` guard | **C3:** API clients would skip React. Server must refuse unverified product access. |
| `429` on resend when limited | **C5:** would enumerate or distinguish rate-limited addresses from others. Internal suppress + same `202`. |
| 6-digit OTP | Weaker; extra UI; 32-byte token already proves the mailbox |
| IdP / OAuth this wave | Core remains password + JWT |
| Store raw tokens or put verify state in JWT | **C4:** replay, log leakage, stale claims |
| Put verification on `users` or `organizations` | **C2:** contradicts Account as durable identity |
| Account email-change in this wave | **C6:** out of scope; would require re-verify of a new mailbox |
| Grandfather existing Accounts as verified | Those mailboxes were never proven |
| Gate inside `authorize("email.verified")` | Would overload ADR-004 permissions with identity/eligibility |

---

## 19. Implementation sequence (do not execute)

1. Additive migration (§6).
2. `EmailSender` port + log/memory/SMTP adapters + config.
3. Token issue/hash/replace/consume in one Account service path.
4. Register-after-commit: issue token + send (swallow send errors).
5. Verify + resend endpoints; login `403`; product `get_current_user` verified gate.
6. `UserRead.email_verified`.
7. Frontend: stop auto-login; check-email; verify-email; login 403 handling; `/app` guard.
8. Tests in §13.
9. **Stop.** No trial, Family, email-change, or password reset.

### Files that would be touched later (not now)

- `backend/alembic/versions/` (new revision only)
- `backend/app/models/account.py`, new token model, `models/__init__.py`
- `backend/app/schemas/user.py`, `schemas/auth.py`
- `backend/app/services/auth_service.py`, `routers/v1/auth.py`, `routers/v1/users.py`, `core/dependencies.py`, `core/config.py`, `core/rate_limit.py`
- New mailer package (not `models/notification.py`)
- `frontend/src/pages/Register.tsx`, new check-email + verify-email pages, `Login.tsx`, `AppRoutes.tsx`, `RequireAuth`, `api/auth.ts`, `api/types.ts`, `store/authStore.ts`, locale JSON
- Auth and Slice 1 tests as in §13

Do not edit ADR files or SA-ARCH-014 in the implementation wave unless Founder separately authorizes documentation alignment.

---

## 20. Independent Claude review checklist

Review this specification only. Do not implement.

1. Slice 1 Account / Personal Tenant / User is preserved; verification is Account-scoped and non-RLS (**C2**).
2. Register → verify → activate → login is complete and consistent (no auto-login, no verify-issued JWT).
3. `/app` and product APIs require `email_verified_at`; **server** is authoritative (**C3**); `/dev/*` is correctly excluded.
4. Confirm-email / confirm-password remain and are not treated as mailbox proof.
5. Token rules: hash persisted, **raw never stored** (**C4**), TTL, single-use, POST-only, dedicated secret.
6. EmailSender abstraction covers log (dev), SMTP (prod), memory (tests) without a vendor lock-in.
7. `403` vs `401` on login does not leak unverified state on wrong password; `is_active` is not verification (**C1**).
8. Resend `202` is identical for existing, nonexistent, already-verified, and rate-limited addresses (**C5**).
9. Account email-change is explicitly excluded (**C6**).
10. Migration/rollback does not touch RLS or Slice 1 cardinality.
11. Out-of-scope list actually excludes Family, Entitlement, Billing, Stripe, C2, HSA-08, AI analysis, reminders, document list/search, abuse engine.
12. ADR-002 and ADR-004 are not redesigned.
13. Conditions, if any, are spec patches — not silent code.

---

## 21. Revision history

| Rev | Date | Change |
|---|---|---|
| 1.0 | 2026-08-16 | First specification draft. Allowed unverified `/app` session; authenticated resend. |
| 1.1 | 2026-08-16 | Frozen for Claude review. Founder restated: real mailbox proof; register → verify → activate → login; verified email required before `/app`. v1.0 “allow `/app` unverified” rejected. No implementation. |
| 1.2 | 2026-08-16 | **Frozen for independent Claude review.** Incorporates six review conditions: (C1) `email_verified` separate from `is_active`; (C2) Account-only binding; (C3) server-side unverified block; (C4) raw tokens never stored, hashes only; (C5) resend non-enumerating including rate-limited (`202`, never `429`); (C6) Account email-change explicitly out of scope. All v1.1 product decisions and Slice 1 architecture preserved. Specification only. |
