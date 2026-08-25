# SA-SMARTARCHIVE-2026-08-24 — Two-Week Execution Routing

| Field | Value |
|---|---|
| Document ID | SA-SMARTARCHIVE-2026-08-24-ROUTING |
| Status | **FOUNDER DECISION — EFFECTIVE IMMEDIATELY** |
| Date | 2026-08-24 |
| Authority | Founder |
| Related | SA-UI-STRATEGY-001 v1.0 (still the UI procedure). This file is the **sprint tool-routing overlay**. It does not rewrite HSA-08, ADRs, or AUTH. |

**This file does not authorize product UI, Page 3 implementation, Page 4, Stage 2 DI implementation, ESA, or extra Cursor usage.**

---

## 1. Tool roles (this sprint)

| Role | Seat | May | Must not |
|---|---|---|---|
| **PRIMARY** | Claude | Architecture, main implementation, technical planning, repository work, integration | Treat Cursor usage limits as a stop-the-project event |
| **SECONDARY** | Cursor | Controlled isolated tasks, verification, work that fits remaining usage | `GenerateImage` retries; become a single point of failure |
| **INDEPENDENT REVIEW** | ChatGPT | Architecture review, governance, test strategy, reconciliation, Founder support | Freeze or implement |
| **IMAGE GENERATION** | Independent route (not Cursor-only) | Page 3 hero and later photography | Wait on Cursor monthly limit; purchase Cursor usage solely to unblock Page 3 |

Founder remains the only DECIDE authority (SA-UI-STRATEGY-001 §3).

---

## 2. Cursor evaluation (locked)

**Verdict: RELIABLE FOR SECONDARY EXECUTION**

- Completed: `documentation/UX/SA-UI-MICRO-LOG.md` (608 bytes; no unrelated app files).
- Failed critical path: `GenerateImage` interrupted after 1604638 ms; no PNG; followed `Total usage limit reached You've reached your monthly limit.`
- **No further Cursor image-generation retries** unless Founder specifically requests them.

---

## 3. Priority order

1. **Page 3** — complete the approved direction. Do not redesign. PHOTO-FIRST, one hero, Page 1 protagonist, 16:9 master, asset gate, then implementation. Phase 6: **OPEN — `page3_hero_private_archive.png` does not exist.** Independent image route required.
2. **Email / domain** — Resend sandbox / verified domain is the remaining blocker for transactional mail. SMTP code working is not domain verification.
3. **Backend integration tests** — disposable PostgreSQL only. Never `TEST_DATABASE_URL` → live SmartArchive dev DB. Do not fake coverage. Current recorded: 26 passed / 46 skipped / 62.46% vs 70% required.
4. **Technical test cycle** — after the test DB is safe. Keep auth / storage / persistence / MinIO / OCR / AI / index / search / recall distinct. Do not claim Stage 2 intelligence exists until implemented and tested.

**SA-DI-001** — prepare architecture only. Required languages: DE, EN, AR, FR, ES, RU, UK + extensible. **Do not implement** the Stage 2 stack until tool evaluation and architecture are approved.

**Page 4** — not authorized. Phase 0 Intake only. Do not invent purpose.

**AI-COS** — Priority 2 in its **own** repository/workspace. Do not mix SmartArchive assumptions into AI-COS.

**ESA** — Priority 3. No major ESA implementation until HSA/SmartArchive and AI-COS hit the agreed milestone.

---

## 4. Two-week target

Complete the maximum **verified** HSA/SmartArchive and AI-COS work, then move toward ESA. Target, not a license to skip gates.

No silent completion. No invented PASS. No unnecessary redesign. No tool dependency that can stop the project for weeks.

---

## 5. Operating rule

Use the best available tool for each task. If Claude can execute → Claude. If Cursor can execute reliably → Cursor. If another tool is better → use it. If Founder approval is required → stop and ask.

**Founder is final authority.**
