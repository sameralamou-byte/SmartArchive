# SmartArchive checkpoint — 17 August 2026

| Field | Value |
|---|---|
| Date | 2026-08-17 |
| Branch | `main` (HEAD `bce4c78`) |
| Purpose | Founder pause: record closed waves before returning to AI-COS |
| Authority | Governance / checkpoint only. No implementation. No commit. |

This file does not rewrite specifications. Closed AUTH/UX/Slice 1 specs remain the source of truth.

---

## 1. Completed waves

| Wave | Status |
|---|---|
| Slice 1 — Account / Personal Tenant / User | **CLOSED** |
| SA-UX-009 Main UI Foundation | **CLOSED** (Founder) |
| SA-AUTH-001 v1.2 — email verification | **CLOSED** (Founder) |
| SA-AUTH-002 v1.2 — password recovery, sessions, Remember Me | **CLOSED** (independent review **ACCEPT**; Founder authorized closure) |
| SA-AUTH-002b Passkeys | **NOT STARTED / DEFERRED** |
| C2 | **NOT STARTED** |
| Family / Entitlement / Billing | **NOT IMPLEMENTED** |
| HSA-08 | **NOT** integrated into production `/app` |

---

## 2. Current architecture state

Locked decisions remain in force:

- ADR-002: shared Postgres + RLS; tenant identity is `organization_id` / JWT `org_id`.
- ADR-004: `authorize()` is the only permission gate; unchanged.
- ADR-009: Account is identity; Personal Tenant is the archive/RLS boundary; Family is not a Tenant.
- Slice 1 cardinality at register: one Account, one Personal Tenant, one User (`uq_users_account_id`).
- JWT access claims: `sub` (User id), `org_id` (Personal Tenant / RLS), `account_id` (Account identity only). No `email_verified` claim.
- UI must not display those UUIDs.

Migrations (Alembic head in this working tree):

```text
0001_initial_schema
  → 0002_account_tenant_trial          (Slice 1)
  → 0003_account_email_verification    (SA-AUTH-001)
  → 0004_auth002_sessions              (SA-AUTH-002)
```

Head revision id: **`0004_auth002_sessions`**.

---

## 3. Authentication state (verified present, not modified)

Inspected in the repository (read-only):

| Capability | Present |
|---|---|
| Account + Personal Tenant + User | Yes — `accounts`, `users.account_id`, `personal_organization_id` |
| `account_id` = Account identity | Yes — JWT + User FK |
| `org_id` = Personal Tenant / RLS | Yes — JWT `org_id`, `set_tenant_context` |
| `accounts.email_verified_at` | Yes — AUTH-001 only sets it |
| Email verification tokens | Yes — `account_email_verification_tokens` (HMAC, not raw) |
| Password reset tokens | Yes — `account_password_reset_tokens` (Account FK, no RLS) |
| Account sessions | Yes — `account_sessions` (Account FK, no RLS) |
| HttpOnly `sa_refresh` | Yes — Path `/api/v1/auth`, Secure, SameSite=None, host-only |
| Remember Me | Yes — session cookie vs 7-day persistent; server 24h cap when unchecked |
| Refresh rotation | Yes — revoke old row + INSERT new (hash not overwritten) |
| Refresh reuse detection | Yes — revoked hash presented → revoke ALL Account sessions |
| Logout | Yes — Origin required, HTTP 204, current session revoked, cookie cleared |
| Forgot password | Yes — generic 202, limiter before lookup |
| Reset password | Yes — POST only, 1h token, no JWT, does not set `email_verified_at` |
| Change password | Yes — Bearer; 401 on wrong current password is not treated as access-token expiry |
| Origin-only CSRF | Yes — `POST /auth/refresh` and `POST /auth/logout`; no `X-CSRF-Token` |
| Password show/hide | Yes — `PasswordInput` |
| Required-field `*` | Yes — register / forgot / reset / change-password |

Register → verify mailbox → activate Account → login → `/app` remains the AUTH-001 product path.

---

## 4. Security state

- Access JWT: 15 minutes, frontend memory only (Zustand; not `localStorage` / `sessionStorage`).
- Refresh secret: opaque CSPRNG in HttpOnly cookie; HMAC-SHA-256 with dedicated `SESSION_REFRESH_SECRET`.
- Reset token: HMAC-SHA-256 with dedicated `PASSWORD_RESET_SECRET`.
- Cookie CSRF: Origin allowlist only on refresh/logout.
- Password-reset User write: `set_tenant_context` on the same `AsyncSession` / transaction as the User SELECT/UPDATE.
- Independent SA-AUTH-002 implementation review (after corrective 401 handling + required tests): **ACCEPT**.
- Residual accepted in AUTH-002 freeze: already-issued access JWTs remain valid until `exp` (max 15 minutes) after session revocation.

---

## 5. Current frontend state

Production `/app` (RequireAuth + AppShell):

- Home, Documents (session-memory list + upload helper), Understand (not connected; link to `/dev` preview), Reminders (empty shell), Account, Change Password, Settings.
- No Family, Billing, Entitlement, or Archive nav on `/app`.
- Family label exists only on `/dev/home-dashboard` (development showcase).
- HSA-08 visual preview exists at `/dev/hsa-understanding`, not as production Understand.

Auth UX present: Login (Remember Me, Forgot password?), Register, Check Email, Verify Email, Forgot Password, generic Check Email, Reset Password, Change Password, logout via `POST /auth/logout`.

`apiClient` / `refreshClient`: `withCredentials: true`.

---

## 6. Scope boundaries (confirmed not introduced)

Completed waves did **not** introduce:

- Passkeys / WebAuthn
- Family production UI or Family-as-Tenant
- Entitlement
- Billing / Stripe
- C2
- AI document analysis engine
- Document list/search engine (Documents page is session-memory + upload, not search)
- Reminders engine (empty page only)
- Account email change
- Device/session management UI

---

## 7. Intentionally deferred / OPEN (not defects)

| Item | Status |
|---|---|
| Production CORS origins (`CORS_ALLOWED_ORIGINS` beyond local) | OPEN |
| Redis limiter fail-open when Redis is down | OPEN (frozen fail-open) |
| Passkeys | DEFERRED → **SA-AUTH-002b** |
| Device/session management UI | DEFERRED |
| 15-minute access JWT residual after revocation | ACCEPTED residual (AUTH-002 §9.10) |
| Production SMTP / domain / `PUBLIC_APP_ORIGIN` | OPEN (operational config) |
| Document list/search API | FUTURE |
| AI document understanding integration into `/app` | FUTURE (HSA-08 preview only under `/dev`) |
| Reminders engine | FUTURE |
| Git commit of the completed waves | NOT DONE (working tree dirty; no staging) |

---

## 8. Local development ports

Frozen local pair (AUTH-002):

| Service | URL / bind |
|---|---|
| SmartArchive Vite | `http://localhost:5174` |
| API | `http://localhost:8001` (`frontend/.env.local` → `VITE_API_BASE_URL=http://localhost:8001/api/v1`) |
| CORS allowlist (example) | includes `http://localhost:5173` and `http://localhost:5174` |
| `PUBLIC_APP_ORIGIN` | `http://localhost:5174` |
| Postgres (compose override) | host `localhost:5433` → container `5432` |
| Redis (compose override) | host `localhost:6380` → container `6379` |

Note (inventory only): `frontend/vite.config.ts` still declares `server.port: 5173`. The AUTH-002 freeze and CORS/`PUBLIC_APP_ORIGIN` use **5174**. Do not change this in the checkpoint; record it for resume.

AI-COS already occupies 5432 / 6379 / 8000, which is why the override remaps SmartArchive.

---

## 9. Test status (last verified; not re-run for this checkpoint)

| Suite | Result |
|---|---|
| Backend pytest (full) | **72 passed** |
| AUTH-001 + AUTH-002 subset | **43 passed** |
| Frontend vitest | **76 passed** |
| Ruff | clean |
| ESLint | 0 errors, 4 pre-existing warnings (`LocaleProvider`, `ThemeProvider`, `test-utils`) |
| TypeScript (`tsc -b`) | passed |

Independent SA-AUTH-002 implementation review: **ACCEPT** (corrective 401 handling and required security tests A–G inspected).

---

## 10. Independent review / Founder closure

| Item | Status |
|---|---|
| SA-UX-009 | Founder closed |
| SA-AUTH-001 v1.2 | Founder closed |
| SA-AUTH-002 v1.2 implementation review | ACCEPT |
| SA-AUTH-002 v1.2 | Founder closed (this checkpoint) |

---

## 11. Git working-tree status

**Branch:** `main`. **Not staged. Not committed. Not pushed** for these waves.

HEAD on remote-tracking history ends at pre-Slice-1/AUTH work (`bce4c78` and earlier Milestone 1.5 test/infra commits). All Slice 1 / UX-009 / AUTH-001 / AUTH-002 implementation lives in the **dirty working tree**.

### A. Slice 1 (typical)

Untracked: `backend/alembic/versions/0002_account_personal_tenant_trial_history.py`, `backend/app/core/slice1_legacy_preflight.py`, `backend/app/models/account.py`, `backend/app/models/trial_history.py`, `backend/app/tests/test_slice1_account.py`.

Modified: `backend/app/models/user.py`, `backend/app/core/tenancy.py`, `backend/app/core/dependencies.py`, `backend/app/security/jwt.py`, `backend/app/repositories/user_repository.py`, `backend/app/tests/test_rls_isolation.py`, `backend/app/tests/test_authorize.py`, related CI/config.

### B. SA-UX-009 (typical)

Frontend Weave/app shell: `frontend/src/components/`, `frontend/src/layouts/`, `frontend/src/locales/`, `frontend/src/providers/`, `frontend/src/pages/app/` (Home, Documents, Account, Settings, Understand/Reminders shells), `frontend/src/styles/`, `frontend/src/test/`, `frontend/public/`, `design/`, plus modified `App.tsx`, `AppRoutes.tsx`, `index.css`, `tailwind.config.js`, `package.json`.

### C. SA-AUTH-001 (typical)

Untracked: `backend/alembic/versions/0003_account_email_verification.py`, `backend/app/models/account_email_verification_token.py`, `backend/app/mailer/`, `backend/app/core/exceptions.py`, `backend/app/security/email_verification.py`, `backend/app/tests/test_email_verification.py`, `frontend/src/pages/VerifyEmail.tsx`, `CheckEmail.tsx`, `Register.tsx` and their tests.

Modified: `backend/app/routers/v1/auth.py`, `backend/app/services/auth_service.py`, `backend/app/schemas/auth.py`, `backend/app/core/rate_limit.py`, `backend/app/core/config.py`, `.env.example`.

### D. SA-AUTH-002 (typical)

Untracked: `backend/alembic/versions/0004_account_sessions_password_reset.py`, `backend/app/models/account_password_reset_token.py`, `backend/app/models/account_session.py`, `backend/app/security/origin.py`, `backend/app/security/refresh_cookie.py`, `backend/app/tests/test_sa_auth_002.py`, `backend/app/tests/test_sa_auth_002_rls_reset.py`, `backend/app/tests/verification_helpers.py`, `frontend/src/pages/ForgotPassword.tsx`, `ForgotPasswordCheckEmail.tsx`, `ResetPassword.tsx`, `frontend/src/pages/app/ChangePasswordPage.tsx` (+ test), `frontend/src/api/client.test.ts`, `frontend/src/api/auth.test.ts`.

Modified: `frontend/src/api/client.ts`, `frontend/src/pages/Login.tsx`, `frontend/src/store/authStore.ts`, auth router/service/schemas (shared with AUTH-001).

### E. Documentation

Untracked trees include `documentation/Auth/`, `documentation/UX/`, `documentation/Architecture/`, `documentation/adr/ADR-006`–`ADR-009`, catalog/index/roadmap files, `AI_CONTEXT/`, and many domain folders (Business, Compliance, Security, etc.).

Modified: `documentation/SA-ARCH-001.md`, `documentation/adr/ADR-001`–`ADR-005`, `documentation/SA-ARCH-006_Integration_Standalone_Reminders.docx`.

This checkpoint file: `documentation/STATUS/SA-SMARTARCHIVE-2026-08-17_CHECKPOINT.md`.

### F. Other unrelated / pre-existing dirty work

Examples (not an exhaustive dump): `AI_CONTEXT/` binaries and zips, ChatGPT PNGs, Word pilots, `onboarding/`, `onboarding.zip`, `zip one packege/`, `final products UI Smart/`, Weave PDFs, `backend/coverage.xml`, `frontend/tsconfig.tsbuildinfo`, `docker-compose.override.yml`, `infrastructure/DR_RUNBOOK.md`, `frontend/src/pages/DocumentUnderstanding.tsx` and other `/dev` showcases, `frontend/src/api/files.ts`, `backend/app/routers/v1/health.py`.

**Do not** treat the whole dirty tree as one commit. Resume step 1 is git/governance cleanup of completed waves.

---

## 12. Recommended resume order (do not start now)

1. Git/governance cleanup of completed waves (separate Slice 1, UX-009, AUTH-001, AUTH-002 from unrelated files; never commit `.env`, `coverage.xml`, secrets).
2. Review / prepare logical commits.
3. Founder approval.
4. Commit completed work (only after Founder authorization).
5. Future SmartArchive product planning against the next approved roadmap.
6. SA-AUTH-002b Passkeys only if Founder chooses it.
7. Core document/product functionality according to that roadmap.

---

## 13. Exact next action when SmartArchive resumes

Founder-authorized **git/governance cleanup** of the dirty working tree for the four closed waves (Slice 1, SA-UX-009, SA-AUTH-001, SA-AUTH-002), then logical commits **only after explicit Founder commit authorization**.

Do not implement Passkeys, C2, Family, Entitlement, Billing, HSA-08 production integration, search, or reminders until a later authorized wave.

This checkpoint does not authorize implementation, staging, commit, or push.
