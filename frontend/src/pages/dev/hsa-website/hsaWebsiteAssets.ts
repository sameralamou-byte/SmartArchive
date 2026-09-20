export const HSA_WEBSITE_BASE = "/dev/founder-page-review/website";

export const HSA_PAGE1_ASSETS = {
  hero: "/assets/page1/page1_hero_human_document.png",
  forYourLife: "/assets/page1/page1_for_your_life_document_ecosystem.png",
  understand: "/assets/page1/page1_understand_hands_document.png",
  remember: "/assets/page1/page1_remember_phone_deadline.png",
  automate: "/assets/page1/page1_automate_invoice_workflow.png",
  connect: "/assets/page1/page1_connect_weave.png",
} as const;

// Approved 2026-09-20, SA-DESIGN-HSA-SECURITY-REF-001 -- first real
// reference this page has ever had (previously zero photography existed).
export const HSA_SECURITY_ASSETS = {
  hero: "/assets/hsa-security/hsa_security_hero.webp",
} as const;

export const HSA_NAV = [
  { to: HSA_WEBSITE_BASE, label: "Home", end: true },
  { to: `${HSA_WEBSITE_BASE}/how-it-works`, label: "How it works", end: false },
  { to: `${HSA_WEBSITE_BASE}/security`, label: "Security & Privacy", end: false },
  { to: `${HSA_WEBSITE_BASE}/for-home`, label: "For Home", end: false },
  { to: `${HSA_WEBSITE_BASE}/for-business`, label: "For Business", end: false },
  { to: `${HSA_WEBSITE_BASE}/about`, label: "About us", end: false },
] as const;

export const DEMO_LABEL = "Illustrative example · Demo data";
