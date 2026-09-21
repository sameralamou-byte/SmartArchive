export const ESA_WEBSITE_BASE = "/dev/founder-page-review/esa-website";

export const ESA_HOME_ASSETS = {
  hero: "/assets/esa/esa_home_hero.webp",
} as const;

export const ESA_SOLUTIONS_ASSETS = {
  hero: "/assets/esa/esa_solutions_hero.webp?v=8",
} as const;

export const ESA_INDUSTRIES_ASSETS = {
  hero: "/assets/esa/esa_industries_hero.webp?v=8",
} as const;

/** Independent sector stills — not cropped from the Industries hero reference. */
export const ESA_INDUSTRY_CARDS = [
  {
    id: "manufacturing",
    title: "Manufacturing & Industrial",
    src: "/assets/esa/esa_industry_manufacturing.webp",
    alt: "Night-time factory floor with CNC machines and industrial lighting.",
  },
  {
    id: "energy",
    title: "Energy & Utilities",
    src: "/assets/esa/esa_industry_energy.webp",
    alt: "Wind turbines and solar panels at dusk.",
  },
  {
    id: "construction",
    title: "Construction & Real Estate",
    src: "/assets/esa/esa_industry_construction.webp",
    alt: "High-rise construction site with a crane at night.",
  },
  {
    id: "logistics",
    title: "Logistics & Transportation",
    src: "/assets/esa/esa_industry_logistics.webp",
    alt: "Warehouse aisles and pallet racks under cool dock lighting.",
  },
  {
    id: "healthcare",
    title: "Healthcare & Life Sciences",
    src: "/assets/esa/esa_industry_healthcare.webp",
    alt: "Laboratory bench with a microscope and glassware.",
  },
  {
    id: "financial",
    title: "Financial Services",
    src: "/assets/esa/esa_industry_financial.webp",
    alt: "Glass office towers in a financial district at blue hour.",
  },
  {
    id: "government",
    title: "Government & Public Sector",
    src: "/assets/esa/esa_industry_government.webp",
    alt: "Civic building with columns and a dome at dusk.",
  },
  {
    id: "education",
    title: "Education & Research",
    src: "/assets/esa/esa_industry_education.webp",
    alt: "University campus building at dusk.",
  },
  {
    id: "cities",
    title: "Cities & Municipal Management",
    src: "/assets/esa/esa_industry_cities.webp",
    alt: "Municipal waterfront skyline at night.",
  },
] as const;

export const ESA_SECURITY_ASSETS = {
  hero: "/assets/esa/esa_security_hero.webp?v=3",
} as const;

export const ESA_RESOURCES_ASSETS = {
  hero: "/assets/esa/esa_resources_hero.webp?v=1",
  featured: "/assets/esa/esa_resources_featured.webp?v=1",
} as const;

export const ESA_ABOUT_ASSETS = {
  hero: "/assets/esa/esa_about_hero.webp?v=3",
  team: "/assets/esa/esa_about_team.webp?v=2",
  wave: "/assets/esa/esa_about_wave.svg?v=1",
} as const;

/** Layer stills are independent ESA-family images — not crops of a mockup. */
export const ESA_SECURITY_LAYERS = [
  {
    id: "data-protection",
    title: "Data Protection",
    icon: "shield" as const,
    src: "/assets/esa/esa_security_layer_data.webp?v=3",
    alt: "Data center racks with cool industrial lighting.",
    body: "Encryption at rest and in transit.",
  },
  {
    id: "access-identity",
    title: "Access & Identity",
    icon: "eye" as const,
    src: "/assets/esa/esa_security_layer_access.webp?v=3",
    alt: "Access-control gates in a dark enterprise corridor.",
    body: "Access control and identity management.",
  },
  {
    id: "threat-detection",
    title: "Threat Detection",
    icon: "scan" as const,
    src: "/assets/esa/esa_security_layer_threat.webp?v=3",
    alt: "Operations wall of monitors with abstract network maps.",
    body: "Continuous monitoring for threats.",
  },
  {
    id: "compliance",
    title: "Compliance",
    icon: "document" as const,
    src: "/assets/esa/esa_security_layer_compliance.webp?v=3",
    alt: "Governed records and document fragments in a dark archive hall.",
    body: "Data governance and an attributable record.",
  },
  {
    id: "secure-ai",
    title: "Secure AI",
    icon: "spark" as const,
    src: "/assets/esa/esa_security_layer_ai.webp?v=3",
    alt: "Ambient network of light threads through dark architecture. No AI face.",
    body: "Responsible use, with a named human still deciding.",
  },
] as const;

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
