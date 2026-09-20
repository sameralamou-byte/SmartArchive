export const ESA_WEBSITE_BASE = "/dev/founder-page-review/esa-website";

export const ESA_HOME_ASSETS = {
  hero: "/assets/esa/esa_home_hero.webp",
} as const;

export const ESA_SOLUTIONS_ASSETS = {
  hero: "/assets/esa/esa_solutions_hero.webp?v=8",
} as const;

/** Geometric A-arrow recovered from the approved ESA Solutions reference. */
export const ESA_MARK = "/assets/esa/esa_mark.png";

export const ESA_NAV = [
  { to: `${ESA_WEBSITE_BASE}/solutions`, label: "Solutions", end: true },
  { to: `${ESA_WEBSITE_BASE}/industries`, label: "Industries", end: false },
  { to: `${ESA_WEBSITE_BASE}/how-it-works`, label: "How It Works", end: false },
  { to: `${ESA_WEBSITE_BASE}/security`, label: "Security", end: false },
  { to: `${ESA_WEBSITE_BASE}/resources`, label: "Resources", end: false },
  { to: `${ESA_WEBSITE_BASE}/about`, label: "About", end: false },
] as const;

export const DEMO_LABEL = "Illustrative example · Demo data";
