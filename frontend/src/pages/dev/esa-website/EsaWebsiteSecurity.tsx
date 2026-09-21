import { Button, Icon, type IconName } from "../../../components";
import { ESA_SECURITY_ASSETS, ESA_SECURITY_LAYERS } from "./esaWebsiteAssets";

/**
 * Security marketing page — built from the written Founder spec
 * (no approved ESA-SECURITY still on disk). Draft for review.
 * HUD labels and the TRUST tagline stay in the artwork, not the DOM.
 */

const ADVANTAGES: {
  icon: IconName;
  title: string;
  body: string;
}[] = [
  { icon: "shield", title: "Build Trust", body: "Protection people can verify." },
  { icon: "workflow", title: "Enable Collaboration", body: "Share work without losing control." },
  { icon: "scan", title: "Stay Resilient", body: "Keep operations going when conditions change." },
  { icon: "spark", title: "Drive Innovation", body: "Use information with a named human still deciding." },
];

export default function EsaWebsiteSecurity() {
  return (
    <main>
      <section className="esa-solutions-hero esa-security-hero" aria-label="SmartArchive ESA security">
        <div className="esa-solutions-hero__stage">
          <img
            className="esa-security-hero__photo"
            src={ESA_SECURITY_ASSETS.hero}
            alt="Security operations center with a central shield, document-intelligence threads, and floating security HUD cards in the artwork. No AI face or character."
          />
          <div className="esa-solutions-hero__content">
            <div className="esa-security-hero__copy relative flex flex-1 flex-col justify-start">
              <p className="text-overline font-bold uppercase tracking-[0.14em] text-accent">SECURITY BY DESIGN</p>
              <h1 className="mt-3 font-display text-display-xl font-bold leading-[1.05] text-[color:var(--esa-mkt-text)]">
                Your Information Deserves
                <br />
                the Highest Level of
                <br />
                <span className="text-accent">Protection.</span>
              </h1>
              <p className="mt-4 text-body-l text-text-secondary">
                Protect what matters with enterprise-grade security. AI recommends. A named human decides. The
                decision is attributable and auditable.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => document.getElementById("esa-security-layers")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Our Security Approach
                </Button>
                <Button type="button" variant="secondary">
                  Talk to Our Security Experts
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="esa-security-layers" className="esa-security-layers scroll-mt-24">
        <div className="esa-security-layers__intro">
          <div>
            <p className="text-overline font-bold uppercase tracking-[0.14em] text-accent">
              A STRONGER, SAFER FOUNDATION
            </p>
            <h2 className="mt-2 font-display text-heading-2 font-bold text-[color:var(--esa-mkt-text)]">
              Security at Every Layer
            </h2>
          </div>
          <div className="esa-security-layers__lead">
            <p className="text-body-l text-text-secondary">
              Information is protected at every layer — how it is stored, who can reach it, how it is watched,
              how it is governed, and how it is used.
            </p>
            <a className="esa-security-layers__more" href="#esa-security-advantage">
              Learn more about our security approach →
            </a>
          </div>
        </div>
        <ul className="esa-security-layers__grid">
          {ESA_SECURITY_LAYERS.map((layer) => (
            <li key={layer.id} className="esa-security-layer-card">
              <img className="esa-security-layer-card__photo" src={layer.src} alt={layer.alt} />
              <div className="esa-security-layer-card__body">
                <Icon name={layer.icon} size={24} className="text-accent" />
                <p className="esa-security-layer-card__title font-display font-bold">{layer.title}</p>
                <p className="mt-2 text-body-m text-text-secondary">{layer.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="esa-security-advantage" className="esa-security-advantage scroll-mt-24">
        <p className="text-overline font-bold uppercase tracking-[0.14em] text-accent">YOUR ADVANTAGE</p>
        <h2 className="mt-2 font-display text-heading-2 font-bold text-[color:var(--esa-mkt-text)]">
          More Security. More Possibilities.
        </h2>
        <p className="esa-security-advantage__lead mt-3 text-body-l text-text-secondary">
          Stronger protection makes more work possible — trust, collaboration, resilience, and innovation.
        </p>
        <ul className="esa-security-advantage__row">
          {ADVANTAGES.map((item) => (
            <li key={item.title} className="esa-security-advantage__item">
              <Icon name={item.icon} size={32} className="text-accent" />
              <p className="esa-security-advantage__title font-display font-bold">{item.title}</p>
              <p className="mt-2 text-body-m text-text-secondary">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
