# SA-AUTH-002 — Password Recovery, Password Change, Remember Me & Persistent Session Foundation

## Frozen Implementation Specification

| Field | Value |
|---|---|
| Document ID | SA-AUTH-002 |
| Title | Password Recovery, Password Change, Remember Me & Persistent Session Foundation |
| Version | **1.2** |
| Status | **FROZEN SPECIFICATION — PENDING INDEPENDENT REVIEW** |
| Date | 2026-08-16 |
| Owner | Product / Authentication — SmartArchive Home (HSA) |
| Classification | Internal |
| Authority | Founder authorization to revise this specification only (v1.2). SA-AUTH-001 v1.2 remains frozen and is not edited. Implementation is **not** authorized. |
| Related | ADR-002 (Locked), ADR-004 (Locked), ADR-009 (Approved v1.1), SA-AUTH-001 v1.2, Slice 1 (Account + Personal Tenant + User) |
| Supersedes | SA-AUTH-002 v1.1 (same path). v1.2 incorporates the independent security review of v1.1 (blocker B1; required R1–R6). |
| Deferred | Passkey / WebAuthn → **SA-AUTH-002b** (not in this wave) |

**This document does not authorize implementation.** Do not modify backend, frontend, database, migrations, authentication code, JWT signing/claims, RLS policies, `authorize()`, SA-AUTH-001, ADRs, Family / Entitlement / Billing, C2, HSA-08, SMTP/Resend configuration, or environment files because of this file.

Independent review of **v1.2** is required. Founder implementation authorization is a later, separate act.

v1.2 is freeze language for wave 1. It does not add Family, Entitlement, billing, email-change, or Passkeys.

---

## 1. Purpose

Wave 1 gives a SmartArchive Account these **distinct** capabilities, without changing identity, tenancy, or authorization:

1. **Forgot Password**
2. **Reset Password**
3. **Change Password**
4. **Remember Me / persistent session**
5. **Server-side session revocation**
6. **Refresh-session migration** (stateless JSON refresh JWT → HttpOnly cookie + Account session row)

Named product flows (frozen):

```text
Login → Forgot password? → enter email → generic 202
      → reset email → reset link → POST new password → Login
      (mailbox proof for login remains SA-AUTH-001)

Account → Security / Change Password → current + new + confirm → all sessions revoked → Login

Login → [ ] Remember me
         unchecked = browser/session cookie lifetime
         checked   = persistent cookie lifetime
```

SA-AUTH-001 remains mandatory and unchanged:

```text
Register → Verify mailbox → Activate Account → Login → /app
```

Password reset and Remember Me **do not** bypass `accounts.email_verified_at`. Unverified Accounts still cannot obtain a product session.

**Passkey / WebAuthn is not in this wave.** See §19 (SA-AUTH-002b).

---

## 2. Frozen product and architecture decisions (v1.1 preserved; v1.2 CSRF/hash/logout/RLS session clarifications)

1. **Account is the identity.** Password-reset tokens and persistent sessions bind to `accounts.id` only. Never to Organization/Tenant.
2. **Personal Tenant remains the isolation boundary.** JWT `org_id` remains the Tenant/RLS claim (ADR-002). `account_id` remains identity only. This wave does not replace `org_id` with `account_id` for RLS.
3. **`authorize()` is unchanged** (ADR-004). Recovery and sessions are not permissions.
4. **Access JWT claim set stays** `sub`, `org_id`, `account_id`, `type`, `iat`, `exp`. No `email_verified` claim. Access JWT remains short-lived (`jwt_access_token_expire_minutes = 15`) and **may live in frontend memory only**. It must not go in `localStorage` / `sessionStorage`.
5. **Refresh is no longer a JWT in JSON.** After this wave there is **one** refresh architecture: opaque refresh secret in an HttpOnly cookie, hashed on an Account session row. Existing stateless 7-day JSON refresh JWTs are **rejected**.
6. **`POST /auth/login` may accept `remember_me`** (boolean, default `false`). Password verification, `401` / `403` `email_not_verified`, and “no tokens for unverified” rules from SA-AUTH-001 **do not change**.
7. **Password lives on User** (`users.hashed_password`). Reset and change update **exactly one** row: the Account’s Personal Tenant User (`uq_users_account_id`). They do not move the password onto `accounts`.
8. **Unauthenticated password UPDATE is fail-closed under RLS.** Before any read/write of `users.hashed_password` on reset, the server must set Personal Tenant context to `accounts.personal_organization_id` via existing `set_tenant_context`. No blanket RLS bypass. §6.5.
9. **EmailSender is reused** (SA-AUTH-001 §8). No second mailer. SMTP/Resend remains operational configuration.
10. **Raw reset tokens are never stored.** HMAC-SHA-256 hash only, dedicated `PASSWORD_RESET_SECRET` — not `JWT_SECRET_KEY`, not `EMAIL_VERIFICATION_SECRET`.
11. **Forgot-password and reset never issue JWTs or set the refresh cookie.** After reset the person logs in.
12. **Password reset/change never set `email_verified_at`.** They never activate an Account. `email_verified_at` stays independent of `is_active` (SA-AUTH-001 C1).
13. **Forgot-password may send mail to an unverified Account.** Login remains `403` `email_not_verified` until SA-AUTH-001 verify. Mail and UI copy must say so.
14. **Inactive Accounts are not reset.** Forgot-password does not send. Leftover token consume → generic failure.
15. **New password must not equal current password** (reset and change). Confirmation is required in **API and UI**.
16. **Reset and change revoke ALL Account sessions.** Change also invalidates all outstanding reset tokens.
17. **Refresh reuse** (presented consumed/rotated secret) revokes **ALL** sessions for that Account. No Account ban (ADR-009: `verify → review → protect`).
18. **No `localStorage` / `sessionStorage`** for access tokens or refresh secrets.
19. **Session/device listing UI is out of wave 1.** Server-side session rows, logout, and mass revocation are required.
20. **No automatic permanent account ban.** No GPS, no invasive fingerprinting, no user-visible fraud scores.
21. **Account email-change remains out of scope** (SA-AUTH-001 C6).
22. **SA-AUTH-001 endpoints** register / verify-email / resend-verification are **not** modified. Login is extended only by optional `remember_me` plus session-cookie issuance on success. Refresh **behavior** is replaced (JSON refresh JWT retired).
23. **CSRF for cookie endpoints is Origin-allowlist only** (v1.2). `POST /auth/refresh` and `POST /auth/logout` require a valid `Origin` in `CORS_ALLOWED_ORIGINS`. Missing or invalid Origin is rejected. **`X-CSRF-Token` is not required.** No “first refresh after reload” exception. No bootstrap flag. No JS-readable CSRF cookie. No CSRF secret is issued, stored, or derived from the access JWT.
24. **`refresh_hash` algorithm is HMAC-SHA-256** (v1.2). Same construction as reset tokens: HMAC-SHA-256(raw secret, dedicated `SESSION_REFRESH_SECRET`). That key is **not** `JWT_SECRET_KEY`, **not** `EMAIL_VERIFICATION_SECRET`, **not** `PASSWORD_RESET_SECRET`. Wave 1 does **not** store `csrf_hash` (CSRF tokens are not used).
25. **Logout success status is HTTP `204` No Content** (v1.2).
26. **Password-reset RLS context and User SELECT/UPDATE use the same `AsyncSession` and the same database transaction** (v1.2).
27. **Change-password requests use `withCredentials: true`** so `sa_refresh` can be cleared (v1.2).

---

## 3. Current state (inspection only)

Inspected 2026-08-16. This file does not change running code.

| Fact | Today |
|---|---|
| Register password policy | `min_length=8`. No max, no complexity class |
| Confirm password | Register: UI only |
| Password hash | bcrypt on `users.hashed_password` |
| User cardinality | `uq_users_account_id` — one User per Account |
| Login | Account email → Personal Tenant User; JSON `TokenResponse` with access **and** refresh JWTs; unverified + correct password → `403` `email_not_verified` |
| Refresh | `POST /auth/refresh` JSON `refresh_token`; **stateless JWT**; 7 days; not revocable |
| Access TTL | 15 minutes |
| Frontend session | Zustand memory; reload of `/app` → `/login` |
| Logout | Client `clear()` only |
| CORS | `allow_credentials=True`; origins from `CORS_ALLOWED_ORIGINS` (local must include `http://localhost:5174`) |
| Frontend client | axios **without** `withCredentials` |
| RLS | `set_tenant_context` → `set_config('app.current_org_id', :org_id, true)` |
| Rate limits | login 10/60s/IP; register 5/60s/IP; refresh 30/60s/IP; verify-email 20/60s/IP; resend internal 3/15 min email-hash + 5/60s IP, always `202` |
| Mailer | SA-AUTH-001 `EmailSender` |
| Verification tokens | HMAC-SHA-256, `EMAIL_VERIFICATION_SECRET`, 24h |
| Passkeys | None — remain none in this wave |

---

## 4. Account identity (preserved)

| Rule | Detail |
|---|---|
| Cardinality | One Account, one Personal Tenant, one User at register |
| Email uniqueness | `accounts.email` globally unique |
| Isolation | Tenant tables: `organization_id` + RLS (ADR-002) |
| Authorization | `authorize()` only (ADR-004) |
| JWT access | `sub` = User id; `org_id` = Personal Tenant (RLS); `account_id` = Account identity. UI never displays these UUIDs |
| Login lookup | Account email → `personal_organization_id` → User |
| Verification | `accounts.email_verified_at` only. Independent of `is_active` |
| Password User row | **Exactly** the User with `users.account_id = accounts.id` **and** `users.organization_id = accounts.personal_organization_id` (`uq_users_account_id`) |
| Family | Not a Tenant. Passwords and sessions are not Family credentials |

**Binding:** reset tokens and sessions → `accounts.id` only. Forbidden on those tables: `organization_id`, TenantMixin, tenant RLS, reset-by-org-slug.

`users` **does** have TenantMixin. Password updates must use §6.5. Session/reset-token tables must **not** use TenantMixin.

---

## 5. Capability 1 — Forgot Password

### 5.1 Flow

```text
1. /login → Forgot password?
2. /forgot-password — Email *
3. POST /api/v1/auth/forgot-password
4. UI always shows the same generic check-email copy
5. If send is permitted: EmailSender delivers reset link
6. Person opens {PUBLIC_APP_ORIGIN}/reset-password?token=RAW
7. POST /auth/reset-password (Capability 2)
```

### 5.2 Public response (non-enumeration)

Every well-formed request returns **HTTP `202`** and **exactly this body** (same bytes):

```json
{ "detail": "If this email can be reset, a message is on its way." }
```

This identical `202` applies to: existing, nonexistent, inactive, verified, unverified, and **rate-limited** addresses.

Forbidden: `404`; `401`/`403` that distinguish cases; client-visible `429` on this path; `Retry-After`; extra fields; JWTs; cookies; saying whether mail was sent.

`422` only for invalid email **shape**.

### 5.3 Server behavior

Limiter **first** (testable): for every well-formed email, increment **both** the email-hash limiter and the IP limiter **before** Account lookup. Hash the **normalized** email in the Redis key (not the raw email), same pattern as SA-AUTH-001 resend.

| Case | Client-visible | Server may |
|---|---|---|
| Verified, active, under limit | Same `202` | Replace unused reset token; send mail |
| Unverified, active, under limit | Same `202` | Replace unused reset token; **send mail**; **must not** set `email_verified_at` |
| Nonexistent | Same `202` | Do nothing (after limiter increment) |
| Inactive | Same `202` | Do not send; do not rotate token |
| Rate-limited | Same `202` | Do not send; do not rotate token |
| Mail send failure after permitted send | Same `202` | Log without raw token |

### 5.4 Reset token (issue)

| Rule | Freeze |
|---|---|
| Bound to | `accounts.id` only |
| Entropy | 32 bytes CSPRNG (`secrets.token_bytes` / `token_urlsafe` equivalent) |
| Transport | URL-safe in query string only |
| Persistence | **Raw never stored.** HMAC-SHA-256(raw, `PASSWORD_RESET_SECRET`) |
| Secret | Dedicated `PASSWORD_RESET_SECRET`. **Not** `JWT_SECRET_KEY`. **Not** `EMAIL_VERIFICATION_SECRET` |
| TTL | **1 hour** from issue |
| Use | One successful consume |
| Replacement | New **permitted** forgot-password replaces the previous unconsumed token for that Account |
| JWT / cookie | Never on this path |
| GET consume | **Forbidden** |

---

## 6. Capability 2 — Reset Password

### 6.1 Consume

**POST only.** Frontend reads `token` from the query, POSTs it, then replaces history to drop `?token=`.

Request:

```json
{
  "token": "<raw>",
  "password": "<new, min 8>",
  "password_confirm": "<must match password>"
}
```

### 6.2 Success

1. Hash raw token; load reset row.
2. Generic `400` if missing, unknown, expired, consumed, or replaced.
3. Load Account by `account_id`. Generic `400` if missing or **`accounts.is_active` is false** (inactive: **do not** reset; leftover tokens fail closed).
4. **§6.5** set Personal Tenant context, then load the single User (§4). Generic `400` if User missing or `users.is_active` is false.
5. Reject if `password` ≠ `password_confirm` (`422`).
6. Reject if new password length < 8 (`422`).
7. Reject if new password **equals current** (`verify_password` true) → `422` with a policy detail that does **not** name the Account. Token was already proven, so `422` vs `400` is not an existence oracle.
8. Persist new bcrypt hash on **that User row only**.
9. Set `consumed_at` on the token; invalidate any other unconsumed reset tokens for the Account.
10. **Revoke ALL** `account_sessions` for the Account (`revoked_at` set).
11. **Do not** issue access JWT, refresh cookie, or any CSRF token (wave 1 does not issue CSRF tokens).
12. **Do not** set `email_verified_at`.
13. `200` generic success. UI → `/login`. No auto-login.

If the Account is unverified, success copy on the reset page **and** the email body must state that they still must **confirm email** (SA-AUTH-001) before signing in. Do not imply reset = verified.

### 6.3 Failure

Unknown / expired / consumed / replaced / inactive / missing User → **same generic `400`**:

```json
{ "detail": "This reset link is invalid or has expired." }
```

No Account id, no “inactive” vs “expired” distinction, no JWT, no cookie.

### 6.4 After success

Login with the **new** password. Old password → `401`. Unverified + correct new password → `403` `email_not_verified` (SA-AUTH-001 unchanged).

### 6.5 Fail-closed Personal Tenant context (BLOCKER F1 — frozen)

`users` is TenantMixin. RLS reads `current_setting('app.current_org_id')`. Unauthenticated reset has no JWT. Implementation **must**:

```text
After Account is loaded and known active, on the SAME request-scoped AsyncSession
and in the SAME database transaction:
  org_id = account.personal_organization_id
  await set_tenant_context(session, str(org_id))
    → SELECT set_config('app.current_org_id', :org_id, true)
    (transaction-local; existing helper; do not invent a second setter)
  Load User WHERE
      account_id = account.id
      AND organization_id = account.personal_organization_id
  If no row: abort, generic 400, no UPDATE
  UPDATE that User's hashed_password only
```

`set_tenant_context` and the User SELECT/UPDATE **must** use that same `AsyncSession` and that same transaction. The request-scoped `app.current_org_id` **must remain active** for the actual User write. Do not set tenant context on one session/connection and write the User on another. Do not commit or close the session between `set_tenant_context` and the User UPDATE.

Forbidden:

- A DB role or session that **disables RLS** / uses `BYPASSRLS` for this path
- Setting `app.current_org_id` to empty, another tenant, or a client-supplied org
- Updating `users` **before** `set_tenant_context`
- Updating any User except the `uq_users_account_id` row
- Using `organization_slug` from the client

If `set_tenant_context` fails, abort the request, no password write.

Change-password uses `get_current_user`, which already sets tenant context from the access JWT `org_id`. That path must still only update the same User row (JWT `sub` / `account_id` must match that row).

---

## 7. Capability 3 — Change Password

Authenticated, **verified** Account (existing product gate).

### 7.1 UX

`/app/account/security` — labels with red `*`; `PasswordInput` show/hide, independent toggles:

- Current password *
- New password *
- Confirm new password *

### 7.2 API

`POST /api/v1/auth/change-password` (Bearer access token)

Frontend **must** send this request with **`withCredentials: true`**. Success revokes all sessions and must clear `sa_refresh`; the browser will not accept or apply that cookie clear unless credentials are included.

```json
{
  "current_password": "<current>",
  "new_password": "<new, min 8>",
  "new_password_confirm": "<must match new_password>"
}
```

| Case | Status |
|---|---|
| Current OK, confirm OK, min 8, not equal to current | `200`; revoke **all** sessions; invalidate **all** reset tokens; clear `sa_refresh`; **no** new JWT |
| Wrong current password | `401` generic invalid credentials |
| Confirm mismatch or min length or equals current | `422` |
| Unverified | `403` `email_not_verified` (SA-AUTH-001) |
| Rate limit | `429` (§15) |

After `200`, UI signs out and goes to `/login`. Person signs in again. No keep-this-device in wave 1.

Does not set `email_verified_at`. Does not change `authorize()` or RLS policies.

---

## 8. Password policy

Reuse registration: **minimum 8**. No new complexity class in this wave.

| Rule | Freeze |
|---|---|
| Minimum | 8 |
| Maximum / complexity | Unchanged (not defined). Do not add in wave 1 |
| Confirm | **API and UI** for reset and change |
| Equals current | **Rejected** (`422`) |
| Hash | bcrypt / passlib, unchanged |
| Password in email | Never |

---

## 9. Remember Me, sessions, cookies, CSRF, CORS

### 9.1 Login UX

`[ ] Remember me` — unchecked default. Not “logged in forever.”

### 9.2 One refresh architecture

| Retired | Wave 1 |
|---|---|
| JSON `refresh_token` JWT, 7 days, stateless | Opaque refresh secret, HttpOnly cookie, hashed on `account_sessions` |
| `POST /auth/refresh` with JSON body `{ "refresh_token": "<jwt>" }` | Cookie + **Origin allowlist** (§9.5); JSON body **must not** carry the refresh secret; **`X-CSRF-Token` is not required** |
| Client-only logout | `POST /auth/logout` revokes the current session and clears cookies |

After cutover, presenting a JWT (or any string) as `refresh_token` in JSON → **`401`**. Do not mint a session from it. Do not run two refresh designs in parallel.

Access JWT remains a JWT in the JSON login/refresh **body**, stored in **frontend memory only**.

### 9.3 Lifetimes

| Remember Me | Cookie / session `expires_at` |
|---|---|
| Unchecked (`false`) | **Browser session cookie** (no persistent `Max-Age` / `Expires`). Does not survive browser restart. Server `expires_at` **OPEN as absolute cap** — freeze: **24 hours** so an abandoned tab cannot refresh forever. |
| Checked (`true`) | Persistent cookie and server `expires_at` = **7 days** (same magnitude as today’s refresh JWT TTL, now revocable) |

### 9.4 Cookie: `sa_refresh`

| Attribute | Freeze |
|---|---|
| Name | `sa_refresh` |
| Value | Opaque CSPRNG secret (not a JWT). Server stores **HMAC-SHA-256** of the raw secret only in `account_sessions.refresh_hash`. Key: dedicated `SESSION_REFRESH_SECRET`. **Not** `JWT_SECRET_KEY`. **Not** `EMAIL_VERIFICATION_SECRET`. **Not** `PASSWORD_RESET_SECRET`. There is **no** SHA-256-without-HMAC option. |
| HttpOnly | **`true`** |
| Path | `/api/v1/auth` |
| Domain | **Host-only** (omit `Domain`). Cookie is set by the **API host** (local: `localhost` / `127.0.0.1` on port 8001). Do not invent a production parent domain; production host-only on the API host |
| SameSite | **`None`** — required because `http://localhost:5174` and `http://localhost:8001` are **cross-origin**. `Lax`/`Strict` would not send this cookie on axios POST |
| Secure | **Production HTTPS: `true` (required).** **Local `http://localhost`: `true`** as well (Chromium treats localhost as a secure context for `Secure` cookies). If a given browser refuses `Secure` on local HTTP, implementation must use HTTPS localhost or a same-origin proxy — **not** `SameSite=None` without `Secure` |
| Max-Age / Expires | Unchecked: omit (session cookie). Checked: 7 days |

Frontend JavaScript **cannot** read `sa_refresh` (HttpOnly + different origin). That is intended.

### 9.5 CSRF (cross-origin cookie POST) — Origin-only (v1.2)

`SameSite=None` does **not** stop a foreign site from POSTing to the API with the cookie. For cookie-authenticated state changes, wave 1 CSRF protection is **Origin validation only**.

**Normative CSRF control** for `POST /auth/refresh` and `POST /auth/logout`:

1. The browser `Origin` header **must** be present and **must** be in `CORS_ALLOWED_ORIGINS`.
2. **Missing Origin → reject** (`403`).
3. **Invalid / disallowed Origin → reject** (`403`).
4. **`X-CSRF-Token` is not required** and is **not** checked on these endpoints.
5. There is **no** “first refresh after reload” exception.
6. There is **no** bootstrap flag.
7. There is **no** JS-readable CSRF cookie.
8. There is **no** synchronizer token, double-submit cookie, or other CSRF mechanism.

**CSRF secret:** wave 1 does **not** generate, issue, store, or rotate a CSRF secret for these endpoints. CSRF secret generation is therefore unused. It **must not** be derived from the access JWT. Entropy for secrets that this wave *does* generate (reset token, refresh secret) is **CSPRNG**. If a CSRF secret were ever specified later, it would have to be CSPRNG entropy and still must not be derived from the access JWT — that is **not** this wave.

Do **not** put refresh secrets in `localStorage`. Do **not** expect `document.cookie` on 5174 to see API-host cookies (`sa_refresh` is HttpOnly on the API host).

CORS credentials behavior is unchanged from §9.6 (`Access-Control-Allow-Credentials: true`; explicit allowlisted origin, never `*`). `Content-Type: application/json` still forces a CORS preflight; the Origin check remains the CSRF control and is mandatory even when a preflight occurred.

Login, forgot-password, reset-password, and change-password are **not** cookie-authenticated state changes of this class. Change-password authenticates with Bearer; it still uses `withCredentials: true` so `sa_refresh` can be cleared (§7.2).

### 9.6 CORS and frontend credentials (5174 → 8001)

Frozen local pair: SmartArchive Vite **`http://localhost:5174`** → API **`http://localhost:8001`**.

| Rule | Freeze |
|---|---|
| `Access-Control-Allow-Origin` | Explicit origin from allowlist (never `*`) |
| `Access-Control-Allow-Credentials` | `true` (already true in current CORS middleware; must remain) |
| Local allowlist | **Must include `http://localhost:5174`**. `http://localhost:5173` may remain if already configured; it is not the SmartArchive Vite port |
| Production origins | Configuration (`CORS_ALLOWED_ORIGINS`); not invented here |
| Frontend | `apiClient` must use **`withCredentials: true`** for requests that need `sa_refresh` **sent or cleared**: login (response cookies), refresh, logout, **and change-password**. Access token still sent as `Authorization: Bearer` |
| Allowed headers | Must allow `Authorization`, `Content-Type`. **`X-CSRF-Token` is not a wave-1 required header** |

### 9.7 Rotation and reuse

- Each successful refresh: new opaque CSPRNG secret, new HMAC-SHA-256 `refresh_hash`, previous hash invalid, `Set-Cookie` replaces `sa_refresh`. **No** `csrf_token` in JSON.
- If a **rotated/revoked** refresh secret is presented: treat as theft → **revoke ALL sessions** for that Account, clear cookies, `401`. Log without secrets. **No** Account ban.

### 9.8 Logout

`POST /api/v1/auth/logout` (cookie + **Origin allowlist**; **no** `X-CSRF-Token`):

1. Reject if Origin is missing or not allowlisted (`403`).
2. Revoke **current** session.
3. `Set-Cookie` expire `sa_refresh`.
4. Client drops access JWT from memory.
5. Navigate `/login`.

Success status is **HTTP `204` No Content**. No JSON body. Idempotent if already logged out: still **`204`**, no enumeration.

### 9.9 Browser restart

| Remember Me | After restart |
|---|---|
| Unchecked | Not authenticated |
| Checked, session valid, Account verified and active | Refresh may mint a new access JWT; then `/app` |
| Cookie expired/revoked, or unverified/inactive | Login required |

### 9.10 Residual access JWT (F2 — accepted)

Session revocation **does not** instantly invalidate already-issued access JWTs. They remain valid until **`exp`** (max **15 minutes**).

**Accepted residual risk** for wave 1. Do **not** add `token_version`, denylist, or access-JWT revocation in this wave.

Password reset/change still revoke all **refresh sessions**, so a stolen refresh cookie dies immediately; a stolen access JWT may work until expiry.

### 9.11 Login issuance

On **verified**, active, correct password:

- Create `account_sessions` row (`remember_me` from body, default `false`).
- `Set-Cookie: sa_refresh`.
- JSON: `access_token`, `token_type`. **No** `refresh_token` field. **No** `csrf_token` field.
- Unverified: `403` `email_not_verified`, **no** cookie, **no** access token (SA-AUTH-001).

---

## 10. Email

Reuse `EmailSender.send(...)`.

Forgot-password mail:

- Transactional only. No marketing, trial, Family, billing, pixels.
- Link: `{PUBLIC_APP_ORIGIN}/reset-password?token={raw}`
- Never the password, never a JWT, token not in subject.
- Locale: `Accept-Language` else `en` (ADR-008).
- Public HTTP never says whether mail was sent.

**English freeze:**

- Subject: `Reset your SmartArchive password`
- Body must include: use the link to set a new password; link expires in **1 hour**; if you did not ask, ignore; **this message does not mean the address is registered**; **setting a new password does not confirm your email — you must still confirm your mailbox before signing in** (covers unverified recipients without asserting that this recipient is unverified).

---

## 11. Session matrix

| Event | Access JWT (≤15 min, memory) | `account_sessions` | `sa_refresh` | Reset tokens | `email_verified_at` |
|---|---|---|---|---|---|
| Password reset success | Residual until `exp` (§9.10) | **Revoke ALL** | Not set; existing cookies unusable after revoke | Consumed + others invalidated | **Unchanged** |
| Password change success | Residual until `exp` | **Revoke ALL** | Clear cookies | **All invalidated** | **Unchanged** |
| Logout | Client drop | Revoke **current** | Delete cookie | Unchanged | Unchanged |
| Refresh reuse | Drop | **Revoke ALL** | Delete | Unchanged | Unchanged |
| Account deactivated | Product APIs fail closed | **Revoke ALL** | Invalid | Forgot does not send; leftover consume generic `400` | Unchanged |
| Unverified | Login must not issue session | Must not create | Must not set | Mail **may** send; consume must **not** verify | Unchanged |
| Email verified (AUTH-001) | Unchanged | Unchanged | Unchanged | Unchanged | Set by AUTH-001 only |

No device-listing UI in wave 1.

---

## 12. Frontend (wave 1 UX)

Reuse Weave `Alert`, `Button`, `Input`, `PasswordInput`, `Container`. No HSA-08 restyle. No Family/billing/AI chrome. Required fields: label + red `*`.

| Route | Auth | Role |
|---|---|---|
| `/login` | PublicOnly | Password; `remember_me`; Forgot password?; SA-AUTH-001 unverified resend unchanged |
| `/forgot-password` | Public (not RequireAuth). If already authed, **OPEN bounce** — freeze: **allow** forgot-password while signed in is unnecessary; **PublicOnly bounce to `/app`** if access token present |
| `/forgot-password/check-email` | Public | Generic 202 copy only |
| `/reset-password` | Public | New * + confirm *; POST; then Login; unverified reminder copy |
| `/app/account` | RequireAuth + verified | Profile + logout (calls `POST /auth/logout`) |
| `/app/account/security` | RequireAuth + verified | Change Password only (no Passkeys) |

No “Sign in with Passkey.” No devices page.

Frontend session store (wave 1): `accessToken` in memory. **`withCredentials: true`** on login, refresh, logout, **and change-password**. Refresh interceptor: `POST /auth/refresh` with credentials; **no** `X-CSRF-Token`. On `401` clear memory and go to `/login`.

Reload of `/app` without a valid `sa_refresh` still cannot restore the access JWT from memory (memory is empty). **Checked** Remember Me: app boot should try cookie refresh **once**. That request is protected by the **Origin allowlist** (§9.5). There is no in-memory CSRF token to restore and no bootstrap exception.

Do **not** store a CSRF token in memory. Do **not** send `X-CSRF-Token`.

---

## 13. API contracts (specification, not implementation)

Prefix `/api/v1`.

### 13.1 Unchanged SA-AUTH-001

`POST /auth/register`, `POST /auth/verify-email`, `POST /auth/resend-verification`, `GET /users/me` field set. Login **password / unverified** rules unchanged.

### 13.2 `POST /auth/login` (extended)

```json
{
  "email": "<EmailStr>",
  "password": "<string>",
  "remember_me": false,
  "organization_slug": null
}
```

`remember_me` optional, default `false`.

| Case | Status | Cookies | Body |
|---|---|---|---|
| Unknown / wrong password / inactive / slug mismatch | `401` | none | existing invalid-credentials |
| Correct password, unverified | `403` `email_not_verified` | none | SA-AUTH-001 body |
| Correct, verified, active | `200` | `Set-Cookie: sa_refresh` | `{ "access_token", "token_type" }` — **no `refresh_token`**, **no `csrf_token`** |
| Rate limit | `429` | none | existing |

### 13.3 `POST /auth/forgot-password`

```json
{ "email": "<EmailStr>" }
```

Always `202` + frozen `detail` (§5.2). No `429`. No JWT. No cookie.

### 13.4 `POST /auth/reset-password`

See §6.1. Success `200` no tokens. Invalid token/inactive `400` frozen detail. Policy `422`. Rate limit `429` (§15). **No GET.**

### 13.5 `POST /auth/change-password`

See §7.2. Bearer required. Frontend **must** use **`withCredentials: true`** so `sa_refresh` is cleared on success.

### 13.6 `POST /auth/refresh` (replaced behavior)

- Cookie `sa_refresh`.
- **Origin allowlist is the CSRF control.** Valid Origin required. Missing or invalid Origin → `403`.
- **`X-CSRF-Token` is not required** and must not be treated as required.
- **JSON `refresh_token` is rejected (`401`).**
- Success `200`: `{ "access_token", "token_type" }` (**no** `csrf_token`), rotated `Set-Cookie: sa_refresh`.
- Unverified / inactive / revoked / reuse → `401`; reuse additionally revokes **all** sessions.

### 13.7 `POST /auth/logout` (new)

Cookie + **Origin allowlist**. **`X-CSRF-Token` is not required.** Missing or invalid Origin → `403`. Revokes current session. Clears `sa_refresh`. Success **`204` No Content**. Idempotent if already logged out: still **`204`**, no enumeration.

---

## 14. Database (wave 1 records)

Additive Alembic **after** SA-AUTH-001 verification migration. No edits to 0001/0002/0003. No tenant RLS policy changes.

**These tables: TenantMixin prohibited. `organization_id` prohibited. Tenant RLS prohibited.** FK `accounts.id` `ON DELETE RESTRICT`.

### 14.1 `account_password_reset_tokens`

| Column | Type | Null | Notes |
|---|---|---|---|
| `id` | UUID PK | no | |
| `account_id` | UUID FK | no | Indexed |
| `token_hash` | bytea | no | HMAC-SHA-256; unique |
| `expires_at` | timestamptz | no | issue + **1 hour** |
| `consumed_at` | timestamptz | yes | |
| `created_at` | timestamptz | no | |

`UNIQUE (token_hash)`; **at most one unconsumed per Account**.

### 14.2 `account_sessions`

| Column | Type | Null | Notes |
|---|---|---|---|
| `id` | UUID PK | no | |
| `account_id` | UUID FK | no | Indexed |
| `refresh_hash` | bytea | no | Unique; **HMAC-SHA-256** of the raw refresh secret with `SESSION_REFRESH_SECRET`; not raw secret. **Not** SHA-256-without-HMAC. |
| `expires_at` | timestamptz | no | Session 24h cap or persistent 7d |
| `revoked_at` | timestamptz | yes | |
| `remember_me` | boolean | no | |
| `created_at` | timestamptz | no | |

`UNIQUE (refresh_hash)`. Multiple rows per Account allowed. **No** devices UI. No IP/UA required in wave 1 (do not add as fraud score).

**No `csrf_hash` column.** Wave 1 does not store, hash, or compare CSRF secrets. HMAC-SHA-256 is the only hashing algorithm for `refresh_hash` (and would be the only algorithm if a `csrf_hash` were ever specified later — it is not in this wave).

Password reset/change: `revoked_at = now()` on **all** rows for `account_id`.

### 14.3 Not in wave 1

No WebAuthn tables. No `token_version` on Account. Password stays on `users`.

---

## 15. Rate limits (frozen)

Existing paths unchanged.

| Path | Limit | Key | Client-visible |
|---|---|---|---|
| `POST /auth/forgot-password` | **3 / 15 min** per normalized **email hash** **and** **5 / 60s** per IP | Increment **before** lookup, including nonexistent emails | **Still `202` same body.** No send, no token rotate, no `429` |
| `POST /auth/reset-password` | **10 / 60s** per IP | IP | **`429`** (does not enumerate Accounts) |
| `POST /auth/change-password` | **10 / 60s** per IP | IP | **`429`** |
| `POST /auth/refresh` | **30 / 60s** per IP (unchanged number) | IP | **`429`** |
| `POST /auth/logout` | Default API cap (120/60s) unless tighter | IP | `429` if default fires |
| login / register / verify-email / resend | Unchanged (SA-AUTH-001) | | Unchanged |

Redis down: keep current **fail-open** limiter behavior. Residual risk: refresh/logout may proceed without a 429. Do not silently fail-closed.

---

## 16. Testing (required when implementation is authorized)

### 16.1 Forgot password

- Verified active: `202` frozen body; mailer called; hash in DB; raw token absent.
- Unverified active: `202` same body; mailer called; **`email_verified_at` still NULL**.
- Nonexistent: `202` same body; mailer not called.
- Inactive: `202` same body; mailer not called; no token rotate.
- Rate-limited: `202` same body; no send; no rotate.
- Limiter-before-lookup: existent and nonexistent both increment; order asserted in test.
- No JWT, no `sa_refresh`.

### 16.2 Reset

- Valid, verified: password updated **only** on `uq_users_account_id` User; token consumed; **all** sessions revoked; no JWT/cookie; login with new password `200`.
- Valid, unverified: password updated; `email_verified_at` still NULL; login `403` `email_not_verified`.
- Equals current password: `422`; hash unchanged.
- Confirm mismatch: `422`.
- Expired / unknown / consumed / replaced: generic `400`.
- Inactive Account leftover token: generic `400`; hash unchanged.
- Missing User after context set: generic `400`.
- **RLS:** reset without `set_tenant_context` must not be shippable; test that the update uses Personal Tenant org id equal to `personal_organization_id` (integration: tenant context set; wrong org context yields no row). Assert `set_tenant_context` and the User SELECT/UPDATE run on the **same AsyncSession** and **same transaction**, with `app.current_org_id` still active for the write.
- Raw token never stored.
- Old password rejected; GET reset absent.

### 16.3 Change password

- Correct current + valid new: hash updated; **all** sessions revoked; **all** reset tokens invalidated; `sa_refresh` cleared; old refresh `401`. Frontend request uses `withCredentials: true`.
- Wrong current: `401`; hash unchanged.
- Equals current / confirm mismatch / min length: `422`.
- Unverified: `403` `email_not_verified`.

### 16.4 Sessions / Remember Me / migration

- Unchecked: no persistence across browser restart; 24h server cap.
- Checked: persists across restart for 7 days.
- Rotation: old cookie rejected; new accepted.
- Reuse of rotated secret: **all** sessions revoked.
- Logout revokes current + clears cookie; success **`204`**.
- Reset/change revoke all.
- Unverified login does not set cookie.
- JSON `refresh_token` (legacy JWT) → `401`; does not create a session.
- Refresh secret not in `localStorage` / `sessionStorage`.
- Access token may remain valid ≤15 minutes after revoke (document in test comments; do not require denylist).
- CORS: credentialed request from `http://localhost:5174` allowed; disallowed Origin on refresh/logout → `403`.
- CSRF: missing Origin on refresh/logout → `403`. Invalid Origin on refresh/logout → `403`. Valid Origin + valid cookie succeeds **without** `X-CSRF-Token`. Do **not** require a CSRF header. Do **not** test a “first refresh after reload” CSRF exception.
- `withCredentials: true` required in frontend tests for login, refresh, logout, **and change-password**.

### 16.5 Integration

- SA-AUTH-001 verification still mandatory.
- No `organization_id` on reset-token or session tables.
- `org_id` still RLS claim; `account_id` still identity.
- `authorize()` unchanged.
- No Passkey endpoints or tables.
- No device-listing UI.

---

## 17. OPEN / remaining Founder decisions

Wave 1 security numbers and session model are frozen. Still OPEN (configuration or later waves — **do not invent in implementation**):

1. Production API host / HTTPS origin list (`CORS_ALLOWED_ORIGINS`) beyond local `http://localhost:5174`.
2. Password maximum length and complexity (still not in register policy).
3. Change-password / reset **notification emails** (not in wave 1).
4. Session listing / per-device revoke UI (explicitly later).
5. Fail-closed rate limiter when Redis is down (keep fail-open unless Founder later changes it).
6. Absolute 24h cap on **unchecked** sessions — frozen in §9.3; reopen only if Founder wants a different cap.
7. **SA-AUTH-002b** Passkey / WebAuthn (entirely deferred).

---

## 18. Non-goals (wave 1)

- Passkey / WebAuthn / MFA beyond password (→ SA-AUTH-002b)
- Account email change
- Family authentication or shared credentials
- Billing, Entitlement, Stripe, C2, HSA-08
- AI analysis, document search, reminders engine
- Abuse engine, GPS, invasive fingerprinting, user-visible fraud scores
- GDPR legal implementation
- Access-JWT denylist / `token_version`
- Device/session management UI
- Keeping JSON refresh JWTs alive in parallel
- Changing SA-AUTH-001 verify/resend/`email_not_verified`
- Changing ADR-002 RLS **policies** or ADR-004 `authorize()`
- Automatic permanent account ban/termination

---

## 19. Deferred: SA-AUTH-002b (Passkey / WebAuthn)

**Not in AUTH-002 wave 1.** Do not implement endpoints, tables, UI, or tests for Passkeys in this wave.

A later specification **SA-AUTH-002b** must define WebAuthn. Binding rules already decided for that future spec (not an implementation contract now): credentials bind to **Account id**, never Tenant/Family; `user handle` must be `account_id` not `org_id`; registration requires `email_verified_at`; assertion must not issue a session if unverified; `authorize()` and RLS unchanged.

v1.0 passkey API/table/test text is **withdrawn** from wave 1.

---

## 20. Governance

| Item | Rule |
|---|---|
| Status | **FROZEN SPECIFICATION — PENDING INDEPENDENT REVIEW** |
| Implementation | **NOT AUTHORIZED** |
| Sequence | v1.2 specification → independent review of v1.2 → Founder implementation approval → implementation → tests → real email + Remember Me smoke → Founder closure |
| SA-AUTH-001 | Unchanged |
| ADRs | ADR-002, ADR-004 Locked; ADR-009 Approved v1.1 — not edited |
| Slice 1 | Preserved |
| Commit / push | Not part of this revision task |

---

## 21. Independent-review blockers (v1.0) — resolution in v1.1

| Review ID | Resolution |
|---|---|
| F1 RLS password update | §6.5 fail-closed `set_tenant_context` to Personal Tenant before User read/write |
| F13 login vs remember_me | Login **may** accept `remember_me`; AUTH-001 password/unverified rules unchanged |
| F14/F15/F41 dual refresh | Single architecture: HttpOnly cookie + `account_sessions`; JSON refresh JWT **rejected** |
| F25 passkeys in same wave | Deferred to SA-AUTH-002b |
| F35/F36 CSRF/CORS | v1.1: Origin + in-memory CSRF. **Superseded in v1.2:** Origin-only for cookie endpoints; `X-CSRF-Token` not required; CORS credentials unchanged |
| F2 access JWT residual | §9.10 **accepted** 15-minute residual; no denylist |
| F7 token TTL/secret | 1 hour; `PASSWORD_RESET_SECRET` |
| F11/F12 confirm and reuse | API+UI confirm; reject equal to current |
| F21/F22 session and reset tokens | Revoke all sessions; change invalidates all reset tokens |
| F23 unverified mail | Send allowed; never verifies; copy frozen |
| F30/F31 rate limits | §15 frozen numbers |
| F28 passkey list GET | N/A — passkeys deferred |
| F33 inactive leftover token | Generic `400` |
| F37 access in memory | Frozen allowed; refresh not JS-readable |
| F39 tests | §16 includes RLS, legacy JWT, Origin CSRF, residual access, limiter-before-lookup, no verify on reset |

---

## 21.1 Independent-review findings (v1.1) — resolution in v1.2

| Review ID | Resolution |
|---|---|
| **B1 CSRF contradiction** | Option 1 frozen. `POST /auth/refresh` and `POST /auth/logout` are protected by **Origin allowlist only**. Valid Origin required; missing/invalid Origin rejected. **`X-CSRF-Token` is not required.** “First refresh after reload” exception **removed**. No bootstrap flag. No JS-readable CSRF cookie. No other CSRF mechanism. CORS credentials unchanged. Applied in §9.5, §12, §13.6, §13.7, §16.4, login JSON, and related tables. |
| **R1 hashing** | Exactly one algorithm: **HMAC-SHA-256** for `refresh_hash` (dedicated `SESSION_REFRESH_SECRET`). No “HMAC or SHA-256”. `csrf_hash` is **not** a wave-1 column (CSRF tokens unused). |
| **R2 logout status** | Success is **HTTP `204` No Content** only. Alternative `200` wording removed. Idempotent logout is also `204`. |
| **R3 RLS session** | Password-reset `set_tenant_context` and User SELECT/UPDATE use the **same `AsyncSession`** and **same database transaction**. `app.current_org_id` remains active for the User write (§6.5). |
| **R4 change-password credentials** | Change-password **must** use `withCredentials: true` so `sa_refresh` can be cleared (§7.2, §9.6, §12, §13.5). |
| **R5 rate-limit xref** | §7.2 rate-limit reference is **§15** (not §16). |
| **R6 CSRF secret entropy** | Wave 1 **does not** generate a CSRF secret (Origin-only). CSRF secrets **must not** be derived from the access JWT. Secrets this wave does generate (reset token, refresh secret) are **CSPRNG**. |

---

## 22. Revision history

| Version | Date | Notes |
|---|---|---|
| 1.0 | 2026-08-16 | Initial frozen draft. Passkeys in-scope; many security values OPEN. Independent review: REVISION REQUIRED. |
| 1.1 | 2026-08-16 | Founder decisions after review. Wave 1: forgot/reset/change, Remember Me, persistent sessions, revocation, refresh migration. Passkeys → SA-AUTH-002b. Login `remember_me`. HttpOnly `sa_refresh`, SameSite=None, CSRF+Origin, CORS credentials 5174→8001. RLS fail-closed reset. Token 1h + `PASSWORD_RESET_SECRET`. Frozen rate limits. Unverified may receive reset mail, never `email_verified_at`. Inactive not reset. Confirm API+UI; reject password reuse. Revoke all sessions; reuse revokes all; change invalidates reset tokens. Access JWT 15 min residual accepted. No device UI. Specification only. Implementation not authorized. |
| 1.2 | 2026-08-16 | Independent review of v1.1. CSRF contradiction resolved: Origin-only protection for cookie endpoints; `X-CSRF-Token` not required; reload bootstrap exception removed. Hashing frozen to HMAC-SHA-256 for `refresh_hash`. Logout success frozen to HTTP 204. Same-session/same-transaction RLS requirement clarified. Change-password `withCredentials: true` required. Rate-limit reference corrected (§7.2 → §15). CSRF secret not issued and not derived from the access JWT. v1.1 product decisions otherwise preserved. Specification only. Implementation not authorized. |
