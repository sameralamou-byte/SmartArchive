export const HSA_WEBSITE_BASE = "/dev/founder-page-review/hsa-website";

/** Production scene — baked header/left copy cropped out. Family, five cards, books, wall note stay in the artwork. */
export const HSA_HOME_ASSETS = {
  hero: "/assets/hsa/hsa_home_hero.webp?v=3",
  mosaic: "/assets/hsa/hsa_life_mosaic.webp?v=1",
  understand: "/assets/hsa/hsa_home_understand.webp?v=1",
  documents: "/assets/hsa/hsa_home_documents.webp?v=2",
  attention: "/assets/hsa/hsa_home_attention.webp?v=1",
  privacy: "/assets/hsa/hsa_home_privacy.webp?v=1",
} as const;

export const HSA_NAV = [
  { to: HSA_WEBSITE_BASE, label: "Home", end: true },
  { to: `${HSA_WEBSITE_BASE}/how-it-works`, label: "How It Works", end: false },
  { to: `${HSA_WEBSITE_BASE}/features`, label: "Features", end: false },
  { to: `${HSA_WEBSITE_BASE}/life`, label: "Life (Use Cases)", end: false },
  { to: `${HSA_WEBSITE_BASE}/privacy-and-control`, label: "Privacy & Control", end: false },
  { to: `${HSA_WEBSITE_BASE}/pricing`, label: "Pricing", end: false },
  { to: `${HSA_WEBSITE_BASE}/about`, label: "About", end: false },
] as const;
