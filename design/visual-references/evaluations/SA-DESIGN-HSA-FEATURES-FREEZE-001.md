# SmartArchive HSA Features — Approved Visual Freeze

**Document ID:** SA-DESIGN-HSA-FEATURES-FREEZE-001
**Version:** 1.1
**Status:** FROZEN (Founder-approved visual direction)
**Date:** 2026-09-21
**Route:** `/dev/founder-page-review/hsa-website/features`
**Implementation:** `frontend/src/pages/dev/hsa-website/HsaWebsiteFeatures.tsx` with shared `HsaWebsiteHeader` / `HsaWebsiteFooter`

## 1. What this closes

Founder approved and froze the **v1 Features composition** as the approved visual direction. A later v2 four-anchor redesign was discarded. Do not redesign, regenerate the approved landscape scene, or change Features copy/layout without Founder.

This freeze is **HSA Features only**. It does not freeze unbuilt HSA marketing pages (Life (Use Cases), Privacy & Control, Pricing, About — stubs only). It does not reopen the HSA Home freeze (`SA-DESIGN-HSA-HOME-FREEZE-001`) or How It Works freeze (`SA-DESIGN-HSA-HOW-IT-WORKS-FREEZE-001`) except to list this page as protected. It does not reopen `SA-DESIGN-HSA08-FREEZE-001` (in-product Weave language) and does not touch ESA.

This record supersedes the live Features state from `89447e7` with the restored v1 poster plus header/caption clearance and navy spacer (not plum).

## 2. Checkpoint

HSA Features is one continuous full-bleed landscape scene (not separate DOM sections). Understand and Find are the dominant moments; Capture, Life Categories, Sharing, Devices, four breadth thumbnails, and Privacy & Control stay smaller supporting moments in the artwork. Labels, captions, handwritten aside, and the Personal / Family / Small Business / School / Workshop / Store row stay in the image. Real HTML overlay is the shared HSA header (three-dot mark, Features active) plus a restrained navy scrim. A small top spacer (`padding-top: 5.75rem`) on `--hsa-veil` (`#080d28`) keeps Get Started off the baked “Your documents. Your life. Your control.” caption. Site footer sits below the scene.

Approved still (do not regenerate): `design/visual-references/03-hsa/HSA-FEATURES-2026-09-21-v1-approved.webp`. Production serve: `/assets/hsa/hsa_features.webp` (baked top wordmark covered on the production copy only so the live header does not stack; original backup `hsa_features.original.webp`). `HSA-FEATURES-2026-09-21-v2-redesign.webp` is not live. Mark is HSA’s circular three-dot blue → purple → magenta cluster — not the ESA A-arrow, not a green/teal leaf.

Nav (shared header, 7 items; Home, How It Works, and Features are frozen as pages): Home / How It Works / Features / Life (Use Cases) / Privacy & Control / Pricing / About.

## 3. Protected list (cross-product)

**Protected approved visual directions (do not redesign without Founder):**

- **ESA:** Home, Solutions, Industries, Security, Resources, About. ESA How It Works is not in this freeze.
- **HSA:** Home, How It Works, Features. Unbuilt HSA marketing pages are not frozen.

## 4. Governance

Same rule as other page freezes: this record establishes approved visual direction for the HSA Features dev preview. It does not authorize other HSA marketing pages, invent stats/certs, or mix ESA visuals into HSA. Hold — do not start the next HSA page in the same session as this freeze.
