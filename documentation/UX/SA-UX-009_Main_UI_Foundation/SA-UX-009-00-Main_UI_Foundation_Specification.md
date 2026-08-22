# SA-UX-009 — Main UI Foundation Specification

| Field | Value |
|---|---|
| Document ID | SA-UX-009 |
| Title | Main UI Foundation Specification |
| Version | 1.0 |
| Status | **Draft — specification only.** Independent review required before any frontend implementation is authorized. |
| Date | 2026-08-16 |
| Owner | Product / UX — SmartArchive Home (HSA) application shell |
| Classification | Internal |
| Authority | Founder authorization to prepare this specification after Slice 1 PostgreSQL verification passed |
| Related | ADR-002, ADR-004, ADR-008, ADR-009 (Approved v1.1), SA-ARCH-011, SA-ARCH-012, SA-ARCH-013, SA-TRACE-001, SA-ARCH-014 (Draft), Slice 1 implementation, SA-DESIGN-HSA08-FREEZE-001 |

**This document does not authorize implementation.** It does not modify frontend, backend, database, authentication, RLS, `authorize()`, HSA-08, Family, Entitlement, Billing, or C2.

HSA-08 remains frozen and out of scope. This specification is **not** the HSA-08 Implementation Design Package. It defines the first visible **application shell** so SmartArchive Home can appear in the browser while existing architecture and Slice 1 remain unchanged.

---

## Purpose

Make the main SmartArchive **Home** product visible as an authenticated application, without pretending unfinished backend capabilities exist, and without introducing Family, billing, or Enterprise Command Center as the personal product.

Experience principle (Master Project Context, HSA): **Tell me what matters.** HSA must not feel like a small enterprise dashboard.

Identity model (ADR-009 / Slice 1), used correctly and **not** exposed as database jargon to the normal user:

```text
Account  →  Personal Tenant (private archive)  →  User
```

Isolation remains `organization_id` / Personal Tenant (ADR-002). JWT `account_id` is identity context only and must not replace `org_id`. `authorize()` remains the only permission gate (ADR-004). TrialHistory is a ledger and is not consulted for login, register, or UI gating.

---

## A. Current frontend state

Inspected (read-only) on 2026-08-16.

### Current routes (`frontend/src/routes/AppRoutes.tsx`)

| Route | Page | Auth | Data | Role |
|---|---|---|---|---|
| `/` | Redirect to `/login` | No | — | Public entry |
| `/login` | `Login.tsx` | No | Static form; **does not call** `POST /api/v1/auth/login` | Placeholder sign-in |
| `/dashboard` | `Dashboard.tsx` | No | Static “Milestone 1 placeholder” copy | Placeholder, not the Home concept |
| `/dev/components` | `ComponentShowcase.tsx` | No | QA harness | Dev-only Weave component gallery |
| `/dev/home-dashboard` | `HomeDashboard.tsx` | No | Demo content; banner says not connected to real data | HSA Home **concept**; includes a **Family** rail item — must not be copied into the product shell |
| `/dev/enterprise-command-center` | `EnterpriseCommandCenter.tsx` | No | Demo ESA nav (Overview / Knowledge / Workflows / Governance / Administration) | ESA concept — **out of this foundation** |
| `/dev/hsa-understanding` | `DocumentUnderstanding.tsx` | No | Frozen HSA-08 storyline, demo German original, no backend | **Development-only** understanding experience |
| `*` | `NotFound.tsx` | No | Static | Fallback |

There is **no** authenticated layout, **no** route guard, **no** register page, **no** product `/app` tree.

### Current useful UI (concept / components)

- Weave tokens: `frontend/src/styles/tokens.css`, `tailwind.config.js` (surfaces, rose-copper accent, thread-gold, type scale, 4px spacing).
- Theme (`ThemeProvider`) and locale (`LocaleProvider`, EN/DE/AR + additional catalog files, RTL via `dir`).
- Primitives: `Button`, `Input`, `Card`, `Alert`, `Badge`, `Chip`, `Toggle`, `Checkbox`, `Container`, `Stack`, `Icon`.
- Home-density: `HomeRail`, `UnderstandBar` (home density), `DocumentListItem`, `StatTile`.
- Understanding language (HSA-08 components, **do not restyle**): `WeaveThread`, `WeaveNode`, `DocumentMarginalia`, `SourceTraceView`, `CitationChip`, `ConfidenceThread`, `AISuggestion`, `ThreadIndicator`.
- Axios client already attaches `Authorization: Bearer` from `useAuthStore`.
- Auth store is **in-memory only** (access + refresh). Refresh of the browser tab clears the session. Comment in `authStore.ts` defers httpOnly cookies to a later production decision — **this specification does not invent cookie auth**.

### What is not real yet

- Login/register do not hit the API.
- No document list UI against Postgres (and **no list API** exists).
- Home “Needs your attention”, “Coming up”, and demo documents are fiction.
- `/dev/home-dashboard` Family item contradicts ADR-009 product UI for this wave (Family is entitlement, not a nav destination).

---

## B. Main UI architecture

### Product surface

This foundation is **SmartArchive Home (HSA)** — one person’s private archive (Personal Tenant). It is not ESA. Do not wrap Home in `EnterpriseSidebar` or ESA destinations.

### Shell (authenticated)

```text
┌─────────────────────────────────────────────────────────────┐
│ Header: mark “SmartArchive” · archive label · account menu    │
├──────────────┬──────────────────────────────────────────────┤
│ Nav          │ Main content (Container width="content"       │
│ (sidebar lg+ │  for Home/Account; "wide" for Documents)      │
│  HomeRail    │  Loading / Empty / Error states live here     │
│  below lg)   │                                               │
└──────────────┴──────────────────────────────────────────────┘
```

- **Header:** product name, human-readable archive title (from register `organization_name` only if a future API returns it; until then use the user’s `full_name` + “’s archive”), account menu (Account, Settings, Log out).
- **Nav:** Home, Documents, Understand, Reminders, Archive, Account, Settings — see §D for status of each.
- **Main:** one primary column; calm density; no operational widget grid.
- **Loading:** existing Spinner-less pattern — muted body text + disabled primary actions; do not invent skeleton libraries.
- **Empty:** one sentence + one honest next action (or none if the action has no API).
- **Error:** `Alert` tone `critical` or `warning`; do not dump stack traces; 401 returns the user to `/login`.
- **Logout:** `useAuthStore.clear()` and navigate to `/login`. No backend logout endpoint exists; do not invent one.

### Layout choice (reuse, do not redesign)

- **Below `lg`:** existing `HomeRail` as a bottom primary nav (Home’s approved shape).
- **`lg` and up:** a **Home** vertical nav using `NavItem` (copper thread active state). Do **not** use `EnterpriseSidebar` compact-tablet ESA behavior as the Home product chrome.
- Content: existing `Container`.

Public screens (`/login`, `/register`) stay full-viewport, no app chrome.

---

## C. Route map

### Proposed product routes (future implementation)

| Route | Screen | Guard |
|---|---|---|
| `/login` | Sign in | Public; if already authed → `/app` |
| `/register` | Create account | Public; if already authed → `/app` |
| `/` | Redirect | Authed → `/app`; else → `/login` |
| `/app` | Home | Authenticated |
| `/app/documents` | Document list foundation | Authenticated |
| `/app/documents/:id` | Document detail / preview entry | Authenticated |
| `/app/understand` | Understand shell | Authenticated |
| `/app/reminders` | Reminders foundation | Authenticated |
| `/app/archive` | Archive foundation | Authenticated |
| `/app/account` | Account | Authenticated |
| `/app/settings` | Settings | Authenticated |
| `*` | Not found | Same chrome if authed, else public |

### Routes that remain as they are (untouched until a later Founder decision)

| Route | Disposition |
|---|---|
| `/dev/components` | Stay dev-only QA harness. Do not promote. |
| `/dev/home-dashboard` | Stay concept/review. Do not wire as production Home. Do not copy Family item. |
| `/dev/enterprise-command-center` | Stay ESA concept. Out of this foundation. |
| `/dev/hsa-understanding` | Stay **development-only** HSA-08 storyline. See §G. |
| `/dashboard` | On implementation, **redirect** `/dashboard` → `/app`. Do not keep two homes. |

No other product routes in this wave (no `/family`, `/billing`, `/admin`, `/enterprise`).

---

## D. Navigation map

User-facing labels. Internal names in parentheses are for implementers only.

| Nav item | Route | Status | Honesty rule |
|---|---|---|---|
| **Home** | `/app` | **Functional now** (shell + real greeting from `GET /users/me`) | Attention / timeline blocks are empty or “Coming later” — not demo documents |
| **Documents** | `/app/documents` | **UI foundation + partial API** | Upload may call existing `POST /api/v1/files` **only if** MinIO is available; **list is not available** (no GET collection). Empty state is the truthful default |
| **Understand** | `/app/understand` | **UI foundation** | Does not run document AI. May link to `/dev/hsa-understanding` as a labeled development preview |
| **Reminders** | `/app/reminders` | **UI foundation only** | No reminders API. Empty state only. HSA-08 demo “Add a reminder” is local UI on the dev page, not product persistence |
| **Archive** | `/app/archive` | **UI foundation only** | Same Personal Tenant as Documents. No folders/categories API. Do not invent a second archive |
| **Account** | `/app/account` | **Functional now** (read-only profile from `GET /users/me` + logout) | No Family, no billing, no `account_id` / `organization_id` in the chrome |
| **Settings** | `/app/settings` | **Functional now** (local theme + locale) | No server-side settings API. ADR-008 locale cascade is not redesigned here |

**Do not add:** Family, Billing, Entitlement, KYC, Enterprise, Governance, Workflows, Knowledge Search.

---

## E. Screen-by-screen specification

### E.1 Sign in (`/login`)

- Fields: **Email**, **Password** only.
- Do **not** require Organization. Slice 1 login is Account email → Personal Tenant. Optional `organization_slug` is fail-closed when supplied; the Home UI does not expose it.
- Submit: `POST /api/v1/auth/login` `{ email, password }`. Store tokens in `useAuthStore`. Then `GET /users/me`. Navigate to `/app`.
- Errors: 401 → “Email or password is incorrect.” 429 → existing rate-limit message. Network → `Alert`.
- Link to `/register`.
- Replace the current static `Login.tsx` form behavior; keep calm visual language (or retokenize to Weave surfaces — implementation choice, not a brand redesign).

### E.2 Create account (`/register`) — new page, existing API

- Fields: Full name, Email, Password, **Archive name** (maps to API `organization_name`; never labeled “Organization” or “Tenant” for Home users).
- Submit: `POST /api/v1/auth/register`. On 201, immediately `POST /auth/login` (register does not return tokens). Then `/app`.
- 409: “An account with this email already exists.”
- Do not write TrialHistory in the UI. Do not mention trials.

### E.3 Home (`/app`)

- Greeting using `full_name` from `/users/me` (existing `HomeDashboard` greeting pattern, real name).
- Primary action: `UnderstandBar` density `home`. **Upload** may navigate to Documents with upload intent. **Scan** and **Voice**: visible if already in the component, but they are **deferred** (no API) — either hide or show a non-blocking “Not available yet” and do not fake processing.
- **Needs your attention:** empty state: “Nothing needs your attention yet.” No fake Stadt Frankfurt rows.
- **Recent documents:** empty until a list API exists. Optional: if this session just uploaded a file, show that one id from client memory only, labeled as “Just uploaded” — do not imply a full library.
- **Coming up:** empty: “Reminders will appear here.” No fake dates.

### E.4 Documents (`/app/documents`)

- List UI using `DocumentListItem`.
- **Empty state (default, truthful):** “Your archive has no documents yet.” If upload is enabled in this wave: one `Button` “Upload a document”.
- **Upload:** `POST /api/v1/files` (multipart), Bearer token, `authorize("document.create")` on the server. First registered user is Personal Tenant admin (`is_superuser` of **own** archive only). Failure 403/422 shown via `Alert`. Success: stay on Documents; without a list API, show the returned `DocumentRead` as a single row (id, title, created_at) in session state.
- **Selection:** click row → `/app/documents/:id` if an id is known; otherwise no-op.
- **Do not** call non-existent `GET /api/v1/files`.

### E.5 Document detail (`/app/documents/:id`)

- Title + filename + mime + size from `DocumentRead` if still in session, else “Document unavailable” (no GET-by-id metadata endpoint beyond download-url).
- **Preview entry:** `GET /api/v1/files/{id}/download-url` then open/download. This is **file access**, not AI understanding.
- **Understand this document:** button to `/app/understand?document=:id`. Understand shell explains that AI understanding is not product-backed yet; optional secondary control “Open development understanding preview” → `/dev/hsa-understanding` (demo document, not this file).
- Delete: existing `DELETE /api/v1/files/{id}` may be offered behind a confirm dialog. 204 removes the session row.

### E.6 Understand (`/app/understand`)

- Product shell, not the frozen HSA-08 canvas.
- Copy: understanding is commentary beside an original; human decides (HSA-08 principle). No fake confidence percentages.
- If `?document=` is present: show the filename if known; state that live understanding is not connected.
- If absent: “Choose a document from Documents first.”
- Development preview: text link to `/dev/hsa-understanding` with the same honesty as today’s demo banner. **Do not** mount `DocumentUnderstanding` as the production page.

### E.7 Reminders (`/app/reminders`)

- Empty state only: “Reminders will live here when they are saved from a document you understand.”
- No create/edit/delete. No local fake persistence in the product shell (the HSA-08 demo may keep its in-page confirm flow on `/dev/hsa-understanding` only).

### E.8 Archive (`/app/archive`)

- Framing: “This is your private archive.” One person, one Personal Tenant.
- Empty / same limitation as Documents. Do not show other people’s archives, Family members, or org switchers.
- Folders/tags/categories exist in the database schema (migration 0001) but **have no API** — do not draw a fake folder tree.

### E.9 Account (`/app/account`)

- Show: full name, email, active status (if useful).
- Do **not** show: `id`, `account_id`, `organization_id`, `org_id`, `is_superuser`, JWT payload, TrialHistory.
- Label the archive in human language (“Your archive”), never “Personal Tenant” or “Organization” in Home chrome.
- Log out control.
- No edit-profile API — name/email are read-only until a later wave.

### E.10 Settings (`/app/settings`)

- Appearance: existing theme toggle (persisted in `localStorage` key `smartarchive.theme` — already implemented).
- Language: existing `LocaleSwitcher` (ADR-008 cascade is not redesigned; this is client locale for UI strings).
- No notification, billing, KYC, or Family settings.

### Shared states

| State | Behavior |
|---|---|
| Loading | Disable submit; muted “Loading…” in main, not a blocking ESA spinner wall |
| Empty | One heading, one sentence, optional single primary action **only if an API exists** |
| Error | `Alert`; 401 → login; 403 → “You can’t do that in this archive.” |
| Not found | Existing calm `NotFound` copy, inside shell if authed |

---

## F. Account / Personal Tenant integration

| Concern | UI rule |
|---|---|
| Account | Durable identity. User sees email / name, not UUID. |
| Personal Tenant | The private archive the user is in. Isolation is `org_id` on the token; UI never says `org_id`. |
| User | The person signed in (`sub`). One User per Account (Slice 1). |
| JWT | `sub`, `org_id`, `account_id` remain distinct. Client may decode only to attach the Bearer token; **do not render claims**. |
| `GET /users/me` | Today returns `id`, `email`, `full_name`, `is_active`, `organization_id`. **Do not display `organization_id`.** Do not add fields in this spec (no fake Account API). |
| Family | **Absent.** No nav, no copy, no member list. |
| TrialHistory | **Absent from UI.** Does not affect login/register. |
| `is_superuser` | Admin of **this** Personal Tenant only. Not shown as a badge. Not a platform super-admin. |

Login must not keep the current “Organization” required field. That field is pre-Slice 1 and would train users on the wrong model.

---

## G. Existing `/dev/hsa-understanding` integration

| Rule | Detail |
|---|---|
| Status | Development / review surface. Demo content. No backend. Frozen HSA-08 A+C visual principles apply **inside this page**. |
| Not the final UI | Must not be redirected to as production Understand. |
| How a user reaches Understand (product) | Nav **Understand** or “Understand this document” on a document row → `/app/understand`. |
| How a document is selected | From Documents (when an id exists). Understand shell does not browse a fake corpus. |
| How the existing experience fits | Optional, clearly labeled **development preview** link from `/app/understand` to `/dev/hsa-understanding`. Keep the demo banner. Keep German original as authority in that demo. |
| What remains development-only | WeaveThread, marginalia storyline, in-page reminder confirm, locale QA strip, theme QA strip, all demo copy. |
| HSA-08 | **Untouched.** Do not restyle Thread/Node/Marginalia. Do not “productize” the demo document. |

This foundation does **not** replace the still-required HSA-08 Implementation Design Package for production understanding UI.

---

## H. Backend / API dependencies

Existing v1 surface (`/api/v1`), inspected:

| Method | Path | UI use | Notes |
|---|---|---|---|
| POST | `/auth/register` | Register screen | Creates Organization + Account + User atomically |
| POST | `/auth/login` | Login screen | Email + password; optional slug **not** in Home UI |
| POST | `/auth/refresh` | Silent refresh if implemented | Do not invent a new token model |
| GET | `/users/me` | Header, Account, Home greeting | No `account_id` in payload |
| POST | `/files` | Documents upload | Requires auth + `document.create`; MinIO |
| GET | `/files/{id}/download-url` | Detail download/preview | Requires `document.read` |
| DELETE | `/files/{id}` | Optional delete | Requires `document.delete` |
| GET | `/health`, `/live`, `/ready` | Not in product chrome | Ops only |

**Does not exist — do not fake:**

- Document **list** or search
- GET document metadata by id (except via download-url + prior `DocumentRead`)
- Reminders CRUD
- Understanding / OCR / AI job UI APIs
- Account update, avatar, locale-on-server
- Folders / categories / tags APIs
- Family, Entitlement, Billing, Trial eligibility APIs
- Logout endpoint

Rate limits (production, unchanged): register 5/60s, login 10/60s per IP.

---

## I. Reusable existing components

Reuse as-is (Weave language):

- `HomeRail`, `NavItem`, `UnderstandBar` (home density), `DocumentListItem`
- `Button`, `Input`, `Alert`, `Badge`, `Card`, `Container`, `Stack`, `Icon`
- `ThemeProvider`, `LocaleProvider`, `LocaleSwitcher`
- `apiClient`, `useAuthStore`

Reuse only on `/dev/hsa-understanding` (do not fork):

- `WeaveThread`, `WeaveNode`, `DocumentMarginalia`, `SourceTraceView`, `CitationChip`, `ConfidenceThread`, `AISuggestion`

Do **not** reuse as Home chrome:

- `EnterpriseSidebar` and ESA `NAV` keys
- `HomeDashboard` Family rail item
- `EnterpriseCommandCenter` density and StatTile operational grid
- Demo banners as product UI (keep them on `/dev/*` only)

---

## J. Components / routes requiring future implementation

New (when implementation is authorized):

- Authenticated `AppShell` (header + nav + outlet)
- Route guard
- `/register` page
- Product pages under `/app/*` listed in §C
- Session-scoped “just uploaded” document row helper (client-only, until a list API exists)

Likely edits to existing files (implementation wave only — **not now**): see §P.

---

## K. Explicitly deferred functionality

- Family membership, invitations, seats, Family View
- Entitlement, trials in UI, TrialHistory display
- Billing, Stripe, C2 commercial content, KYC
- ESA Command Center as the logged-in Home
- Document AI / OCR / classification / extraction in product Understand
- Promoting `/dev/hsa-understanding` to production
- Voice, scan, semantic search
- Reminders engine and notification delivery
- Folder/tag taxonomy UI
- httpOnly cookie session (noted in auth store; not this spec)
- Extending `UserRead` with `account_id` (not required for this shell)
- Document list API (requires separate Founder authorization; this spec does not create it)
- HSA-08 Implementation Design Package
- Slice 2

---

## L. Security / auth boundaries

- All `/app/*` routes require a valid access token. Missing/invalid token → `/login`.
- API 401 → clear store → `/login`. Do not retry forever.
- Never put tokens in `localStorage` in this wave (existing store rule).
- Never display `account_id`, `org_id`, or raw JWT.
- Never send a forged `organization_id` from the client to “switch archives.” Tenant context is server-side from the token (ADR-002).
- `authorize()` stays on the server. The UI does not implement RBAC matrices.
- Superuser applies only to the user’s own Personal Tenant — no platform admin console.
- `/dev/*` may remain unauthenticated **for now** (current behavior). Product `/app/*` must not.
- Do not log passwords or tokens.
- Upload validation and antivirus hook stay on the server.

---

## M. Responsive behavior

Follow existing Weave / Master Context rules; do not shrink a desktop ESA dashboard.

| Breakpoint | Behavior |
|---|---|
| Default / mobile | Bottom `HomeRail`; header compact; `Container` padding `px-4`; single column |
| `sm`+ | Wider padding; UnderstandBar full width up to `max-w-lg` |
| `lg`+ | Vertical Home nav; rail hidden; desktop-first reading width (`Container` `content` on Home) |

Desktop/laptop is the primary HSA environment (HSA-08 freeze: everyday computer). Mobile must remain usable, not a mini Command Center.

Motion: existing `duration-fast` / `base` only. No decorative motion.

RTL: `LocaleProvider` `dir` already exists; shell must not assume LTR-only padding (use logical `border-e` as `EnterpriseSidebar` already does).

---

## N. Acceptance criteria

Implementation is **not** started. When a later wave is authorized, it passes only if:

1. An authenticated user can sign in with Slice 1 credentials and see `/app` with their real name.
2. Unauthenticated users cannot open `/app/*`.
3. Navigation matches §D; **Family is absent**.
4. Documents empty state does not show demo Stadt Frankfurt / fake files.
5. No client call is made to a non-existent list/reminders/understand API.
6. `/dev/hsa-understanding` still exists, still shows the demo banner, and is not the default Understand page.
7. Account page shows name/email and logout only — no tenant UUIDs, no billing.
8. HSA does not use ESA sidebar destinations.
9. Existing backend tests, RLS, `authorize()`, and Slice 1 constraints remain unchanged.
10. Independent review of this specification was completed before coding began.

---

## O. Implementation sequence (future UI wave)

Do not execute until Founder authorizes implementation.

1. **Auth wiring** — login, register, guard, logout, `GET /users/me` into shell header. Redirect `/` and `/dashboard`.
2. **AppShell** — header + Home nav + outlet; loading/error/empty primitives.
3. **Home** — real greeting; honest empty sections; UnderstandBar navigation only.
4. **Account + Settings** — read-only profile; theme/locale.
5. **Documents** — empty + optional upload to existing `POST /files`; detail/download if id known.
6. **Understand / Reminders / Archive shells** — copy + empty states; preview link to `/dev/hsa-understanding`.
7. **Stop.** Do not add Family, list API, or HSA-08 productionization without new authorization.

---

## P. Files that would be modified during implementation

**Would be modified or added** (future wave only):

- `frontend/src/routes/AppRoutes.tsx`
- `frontend/src/pages/Login.tsx`
- `frontend/src/pages/Dashboard.tsx` (redirect or remove from product path)
- New: `Register.tsx`, `AppShell`, `/app` pages (Home, Documents, Understand, Reminders, Archive, Account, Settings)
- Possibly `frontend/src/store/authStore.ts` (hydrate user profile, not token persistence model)
- Locale JSON for new product strings
- Tests for shell/guard/login

**`/dev/*` pages** should stay; Home product must not replace them in-place.

---

## Q. Files that must NOT be modified

During the future UI wave **and** now:

| Area | Paths / rules |
|---|---|
| Slice 1 / identity | Account, TrialHistory, User binding, Alembic 0002, `slice1_legacy_preflight.py` |
| Auth semantics | `auth_service.py` login/register rules, JWT claim meanings |
| Isolation | RLS policies, `tenancy.py` `org_id` session var |
| Authorization | `authorize.py` |
| HSA-08 | `DocumentUnderstanding.tsx`, WeaveThread, DocumentMarginalia, freeze records; do not restyle Thread/Node |
| Family / commercial | No Family UI, Entitlement, Billing, Stripe, C2 |
| Architecture ADRs / SA-ARCH-011–014 | Do not rewrite to fit the shell |
| ESA concept | `EnterpriseCommandCenter.tsx` — do not turn it into Home |
| Backend APIs | Do not add list/reminders/understand endpoints in the UI wave unless separately authorized |

---

## R. Risks / open questions

1. **No document list API.** The Documents screen cannot show a real library. Founder must later authorize a small authenticated list endpoint, or accept session-only “just uploaded” rows. This spec does not create the API.
2. **`UserRead` includes `organization_id` and omits `account_id`.** UI must not display the UUID. Is a later, additive `GET` profile (human archive title, no internals) wanted? Not in this spec.
3. **In-memory tokens.** Refreshing the tab signs the user out. Cookie/session work is a separate security decision.
4. **MinIO.** Upload fails without object storage. Empty Documents remains valid.
5. **`/dev/hsa-understanding` unauthenticated.** Acceptable for review; confirm whether production builds should hide `/dev/*`.
6. **UnderstandBar Scan/Voice.** Hide vs. “not available yet”? Recommend hide in product shell to avoid fake AI.
7. **Archive vs Documents.** Two nav items, one Tenant, no folders API. Risk of duplicate empty screens. Alternative (Founder): merge Archive into Documents for this wave.
8. **Register `organization_name`.** Need a Home-friendly label (“Archive name”) without implying a company org.
9. **First user `is_superuser`.** Upload likely works; a future non-admin user in the same tenant is out of Slice 1 (one User per Account). Do not build member admin UI.
10. **HomeDashboard Family item.** Concept page must not leak into product nav; leave the concept page untouched until a later edit is authorized.

---

## Specification freeze note

This document is ready for **independent review**. No React, APIs, migrations, or git write beyond adding this file.

**Do not declare the Main UI Foundation implemented.** Implementation starts only after Founder authorization of a UI wave that cites this specification.
