/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Weave design tokens — see src/styles/tokens.css for the actual
        // light/dark values. Tailwind utilities (bg-surface-card, text-accent,
        // border-border, ...) resolve to these CSS custom properties so a
        // component never hard-codes a hex.
        "surface-page": "var(--surface-page)",
        "surface-card": "var(--surface-card)",
        "surface-recessed": "var(--surface-recessed)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "text-disabled": "var(--text-disabled)",
        border: "var(--border)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "accent-tint": "var(--accent-tint)",
        "accent-graphic": "var(--accent-graphic)",
        "on-accent": "var(--on-accent)",
        "accent-2": "var(--accent-2)",
        "accent-2-hover": "var(--accent-2-hover)",
        "accent-2-tint": "var(--accent-2-tint)",
        success: "var(--success)",
        "success-bg": "var(--success-bg)",
        warning: "var(--warning)",
        "warning-bg": "var(--warning-bg)",
        critical: "var(--critical)",
        "critical-bg": "var(--critical-bg)",
        info: "var(--info)",
        "info-bg": "var(--info-bg)",
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
        mono: "var(--font-mono)",
      },
      fontSize: {
        "display-xl": "var(--text-display-xl)",
        "display-l": "var(--text-display-l)",
        "heading-1": "var(--text-heading-1)",
        "heading-2": "var(--text-heading-2)",
        "heading-3": "var(--text-heading-3)",
        "body-l": "var(--text-body-l)",
        "body-m": "var(--text-body-m)",
        caption: "var(--text-caption)",
        overline: "var(--text-overline)",
        data: "var(--text-data)",
      },
      borderRadius: {
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
        pill: "var(--r-pill)",
      },
      transitionDuration: {
        fast: "150ms",
        base: "220ms",
        panel: "280ms",
      },
      boxShadow: {
        1: "0 1px 2px rgba(var(--shadow-rgb), 0.06), 0 6px 18px rgba(var(--shadow-rgb), 0.05)",
        2: "0 4px 12px rgba(var(--shadow-rgb), 0.12)",
        3: "0 12px 32px rgba(var(--shadow-rgb), 0.18)",
      },
    },
  },
  plugins: [],
};
