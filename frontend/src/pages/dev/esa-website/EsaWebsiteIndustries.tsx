import { Button } from "../../../components";
import { EsaWebsiteFeatureStrip } from "./EsaWebsiteFeatureStrip";
import { ESA_INDUSTRIES_ASSETS, ESA_INDUSTRY_CARDS } from "./esaWebsiteAssets";

/**
 * Copy transcribed from ESA-INDUSTRIES-2026-09-21-v1-approved.
 * Draft for Founder review — not locked copywriting.
 *
 * Hero scene is one cinematic artwork (factory / lab / city, floating
 * document cards, threads, right-edge tagline). Do not rebuild those
 * cards as DOM. Sector photos are independent assets, not crops of the
 * approved hero reference.
 */

export default function EsaWebsiteIndustries() {
  return (
    <main>
      <section className="esa-solutions-hero esa-industries-hero" aria-label="SmartArchive ESA industries">
        <div className="esa-solutions-hero__stage">
          <img
            className="esa-industries-hero__photo"
            src={ESA_INDUSTRIES_ASSETS.hero}
            alt="Factory, laboratory and city district connected by document-intelligence threads. Floating cards stay in the artwork. No AI face or character."
          />
          <div className="esa-solutions-hero__content">
            <div className="esa-industries-hero__copy relative flex flex-1 flex-col justify-start">
              <p className="text-overline font-bold uppercase tracking-[0.14em] text-accent">INDUSTRIES WE SERVE</p>
              <h1 className="mt-3 font-display text-display-xl font-bold leading-[1.05] text-[color:var(--esa-mkt-text)]">
                Every Industry
                <br />
                Runs on Information.
                <br />
                <span className="text-accent">We Keep It Working.</span>
              </h1>
              <p className="mt-4 text-body-l text-text-secondary">
                Secure, intelligent document solutions tailored to the unique needs of every industry — from
                manufacturers to governments, from cities to life sciences.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => document.getElementById("esa-industries-grid")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Explore Industries
                </Button>
                <Button type="button" variant="secondary">
                  Talk to Our Experts
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div id="esa-industries-grid" className="esa-industries-grid">
          <ul className="esa-industries-grid__list">
            {ESA_INDUSTRY_CARDS.map((industry) => (
              <li key={industry.id} className="esa-industries-card">
                <img className="esa-industries-card__photo" src={industry.src} alt={industry.alt} />
                <p className="esa-industries-card__title font-display font-bold">{industry.title}</p>
              </li>
            ))}
          </ul>
        </div>

        <EsaWebsiteFeatureStrip />
      </section>
    </main>
  );
}
