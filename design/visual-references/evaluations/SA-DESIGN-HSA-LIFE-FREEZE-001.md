# SmartArchive HSA Life (Use Cases) — Approved Visual Freeze

**Document ID:** SA-DESIGN-HSA-LIFE-FREEZE-001
**Version:** 1.0
**Status:** FROZEN (Founder-approved visual direction)
**Date:** 2026-09-21
**Route:** `/dev/founder-page-review/hsa-website/life`
**Implementation:** `frontend/src/pages/dev/hsa-website/HsaWebsiteLife.tsx` with shared `HsaWebsiteHeader` / `HsaWebsiteFooter`

## 1. What this closes

Founder approved the Life (Use Cases) composition overall, required real HTML for every readable marketing line (not baked pixels), and supplied the Workshops & Trades correction. Do not redesign, regenerate the approved journey backdrop, or change Life copy/layout without Founder.

This freeze is **HSA Life (Use Cases) only**. It does not freeze unbuilt HSA marketing pages (Privacy & Control, Pricing, About — stubs only). It does not reopen the HSA Home freeze (`SA-DESIGN-HSA-HOME-FREEZE-001`), How It Works freeze (`SA-DESIGN-HSA-HOW-IT-WORKS-FREEZE-001`), or Features freeze (`SA-DESIGN-HSA-FEATURES-FREEZE-001`) except to list this page as protected. It does not reopen `SA-DESIGN-HSA08-FREEZE-001` (in-product Weave language) and does not touch ESA.

## 2. Checkpoint

HSA Life is one continuous full-bleed photographic journey (not a feature-card grid, dashboard, or separate S-curve sections). The image is backdrop and connecting thread only. Opening statement, six chapter titles/headlines/bodies/side taglines, and the closing statement are real HTML overlaid at the composition positions. Baked glyphs are painted out on the production copy only. Real HTML overlay also includes the shared HSA header (three-dot mark, Life (Use Cases) active) plus a restrained navy `--hsa-veil` (`#080d28`) scrim and a `padding-top: 5.75rem` spacer so Get Started does not cover opening copy. Site footer sits below the scene. Bottom scene thumbnails stay in the artwork — not rebuilt as a second DOM row.

Approved still (do not regenerate): `design/visual-references/03-hsa/HSA-LIFE-2026-09-21-v1-approved.webp`. Production serve: `/assets/hsa/hsa_life.webp` (baked marketing text covered on the production copy only; original backup `hsa_life.original.webp`). Mark is HSA’s circular three-dot blue → purple → magenta cluster — not the ESA A-arrow, not a green/teal leaf.

Nav (shared header, 7 items; Home, How It Works, Features, and Life (Use Cases) are frozen as pages): Home / How It Works / Features / Life (Use Cases) / Privacy & Control / Pricing / About.

Workshops & Trades uses Founder HTML, not the garbled reference pixels: headline “Tools, people, projects — and paperwork.” Body: “Supplies, equipment records, inspection documents, supplier paperwork and job records — HSA helps keep your operation organized and on track.”

Freeze commit on `origin` and `github` `main`: `1dc48da` (`feat(hsa-website): checkpoint approved Life visual; freeze HSA Life (Use Cases).`). A later local refine2 (production paint-out of leftover baked captions at crop edges + Small Business chalkboard left-edge shift so “Good People / Great Coffee” is fully visible) is **not** in this SHA, **not** on remotes, and **not** frozen.

## 3. Protected list (cross-product)

**Protected approved visual directions (do not redesign without Founder):**

- **ESA:** Home, Solutions, Industries, Security, Resources, About. ESA How It Works is not in this freeze.
- **HSA:** Home (`0b8d612`), How It Works (`a564d43`), Features (`be3b63a`), Life (Use Cases) (`1dc48da`). Unbuilt HSA marketing pages (Privacy & Control, Pricing, About) are not frozen.

## 4. Governance

Same rule as other page freezes: this record establishes approved visual direction for the HSA Life (Use Cases) dev preview. It does not authorize other HSA marketing pages, invent stats/certs, or mix ESA visuals into HSA. Hold — do not start the next HSA page in the same session as this freeze.
