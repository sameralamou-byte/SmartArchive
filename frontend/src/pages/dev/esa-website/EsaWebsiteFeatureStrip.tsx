import { Icon, type IconName } from "../../../components";

/** Shared ESA marketing capability strip — identical on Solutions and Industries. */
export const ESA_FEATURE_STRIP = [
  {
    icon: "document" as const satisfies IconName,
    title: "Capture Without Limits",
    body: "Any document. Any format. From anywhere in the world.",
  },
  {
    icon: "spark" as const satisfies IconName,
    title: "Understand with AI",
    body: "Extract meaning, context and value — automatically.",
  },
  {
    icon: "workflow" as const satisfies IconName,
    title: "Automate Workflows",
    body: "From manual work to intelligent processes.",
  },
  {
    icon: "shield" as const satisfies IconName,
    title: "Secure by Design",
    body: "Protect what matters with enterprise-grade security.",
  },
  {
    icon: "search" as const satisfies IconName,
    title: "Turn Information into Opportunities",
    body: "Empower your people. Drive better decisions.",
  },
] as const;

export function EsaWebsiteFeatureStrip() {
  return (
    <div id="esa-feature-strip" className="esa-solutions-hero__strip">
      <div className="esa-solutions-hero__strip-grid">
        {ESA_FEATURE_STRIP.map((feature) => (
          <div key={feature.title} className="esa-solutions-hero__strip-item">
            <Icon name={feature.icon} size={32} className="text-accent" />
            <p className="esa-solutions-hero__strip-title font-display text-heading-3 font-bold text-[color:var(--esa-mkt-text)]">
              {feature.title}
            </p>
            <p className="mt-2 text-body-m text-text-secondary">{feature.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
