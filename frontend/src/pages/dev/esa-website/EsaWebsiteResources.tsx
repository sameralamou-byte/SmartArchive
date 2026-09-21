import { Button, Icon, type IconName } from "../../../components";
import { ESA_RESOURCES_ASSETS } from "./esaWebsiteAssets";

/**
 * Copy transcribed from ESA-RESOURCES-2026-09-21-v1-approved.
 * Category wall, IDEAS tagline, and PEOPLE spines stay in the artwork.
 */

const RESOURCE_CARDS: {
  icon: IconName;
  title: string;
  body: string;
}[] = [
  { icon: "document", title: "Insights & Articles", body: "Trends, perspectives and expert insights." },
  { icon: "scan", title: "Guides & Reports", body: "In-depth resources and practical guidance." },
  { icon: "eye", title: "Customer Stories", body: "Real-world applications across industries." },
  { icon: "workflow", title: "Product & Technical", body: "Documentation, APIs and technical resources." },
  { icon: "spark", title: "News & Updates", body: "Latest announcements and company news." },
];

const ADVANTAGES: {
  icon: IconName;
  title: string;
  body: string;
}[] = [
  { icon: "spark", title: "Stay Informed", body: "Get the latest insights on document intelligence." },
  { icon: "eye", title: "Learn from Experience", body: "Explore real-world perspectives and use cases." },
  { icon: "workflow", title: "Put Knowledge into Action", body: "Turn insights into measurable business outcomes." },
  { icon: "scan", title: "Plan for What's Next", body: "Understand trends and emerging opportunities." },
];

export default function EsaWebsiteResources() {
  return (
    <main>
      <section className="esa-solutions-hero esa-resources-hero" aria-label="SmartArchive ESA resources">
        <div className="esa-solutions-hero__stage">
          <img
            className="esa-resources-hero__photo"
            src={ESA_RESOURCES_ASSETS.hero}
            alt="Person viewing a resource-category wall — White Papers, Case Studies, Industry Insights, Technical Guides, Product Resources — with city skyline, connecting threads, and book-spine stack in the artwork."
          />
          <div className="esa-solutions-hero__content">
            <div className="esa-resources-hero__copy relative flex flex-1 flex-col justify-start">
              <p className="text-overline font-bold uppercase tracking-[0.14em] text-accent">
                INSIGHTS. KNOWLEDGE. PROGRESS.
              </p>
              <h1 className="mt-3 font-display text-display-xl font-bold leading-[1.05] text-[color:var(--esa-mkt-text)]">
                Knowledge That
                <br />
                Moves Your Business
                <br />
                <span className="text-accent">Forward.</span>
              </h1>
              <p className="mt-4 text-body-l text-text-secondary">
                Explore expert insights, practical guides and real-world perspectives on enterprise document
                intelligence — and what&apos;s next.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => document.getElementById("esa-resources-find")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Browse Resources
                </Button>
                <Button type="button" variant="secondary">
                  Explore by Topic
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="esa-resources-find" className="esa-resources-find scroll-mt-24">
        <div className="esa-resources-find__intro">
          <div>
            <p className="text-overline font-bold uppercase tracking-[0.14em] text-accent">EXPLORE OUR RESOURCES</p>
            <h2 className="mt-2 font-display text-heading-2 font-bold text-[color:var(--esa-mkt-text)]">
              Find What <span className="text-accent">You Need</span>
            </h2>
          </div>
          <div className="esa-resources-find__lead">
            <p className="text-body-l text-text-secondary">
              Practical knowledge. Real perspectives. Resources to help you get more from your information.
            </p>
            <a className="esa-resources-find__more" href="#esa-resources-featured">
              View all resources →
            </a>
          </div>
        </div>
        <ul className="esa-resources-find__grid">
          {RESOURCE_CARDS.map((card) => (
            <li key={card.title} className="esa-resources-find-card">
              <Icon name={card.icon} size={24} className="text-accent" />
              <p className="esa-resources-find-card__title font-display font-bold">{card.title}</p>
              <p className="mt-2 text-body-m text-text-secondary">{card.body}</p>
              <span className="esa-resources-find-card__arrow" aria-hidden="true">
                →
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section id="esa-resources-featured" className="esa-resources-featured scroll-mt-24">
        <div className="esa-resources-featured__copy">
          <p className="text-overline font-bold uppercase tracking-[0.14em] text-accent">FEATURED RESOURCE</p>
          <h2 className="mt-2 font-display text-heading-2 font-bold text-[color:var(--esa-mkt-text)]">
            Building a Smarter Information Future
          </h2>
          <p className="mt-3 text-body-l text-text-secondary">
            Discover how AI-powered document intelligence is helping organizations unlock new possibilities across
            industries.
          </p>
          <div className="mt-6">
            <Button type="button" variant="primary">
              Read the Featured Insight
            </Button>
          </div>
        </div>
        <article className="esa-resources-featured__card">
          <img
            className="esa-resources-featured__photo"
            src={ESA_RESOURCES_ASSETS.featured}
            alt="Open glowing book with floating document pages over a city library."
          />
          <div className="esa-resources-featured__card-copy">
            <p className="text-overline font-bold uppercase tracking-[0.14em] text-accent">INSIGHTS</p>
            <h3 className="mt-2 font-display font-bold text-[color:var(--esa-mkt-text)]">
              From Documents to Opportunities
            </h3>
            <p className="mt-2 text-body-m text-text-secondary">
              How intelligent information management drives efficiency, compliance and growth.
            </p>
            <a className="esa-resources-find__more mt-3 inline-block" href="#esa-resources-advantage">
              Read more →
            </a>
          </div>
        </article>
      </section>

      <section id="esa-resources-advantage" className="esa-resources-advantage scroll-mt-24">
        <p className="text-overline font-bold uppercase tracking-[0.14em] text-accent">YOUR RESOURCE ADVANTAGE</p>
        <h2 className="mt-2 font-display text-heading-2 font-bold text-[color:var(--esa-mkt-text)]">
          Smarter Knowledge. <span className="text-accent">Greater Possibilities.</span>
        </h2>
        <p className="esa-resources-advantage__lead mt-3 text-body-l text-text-secondary">
          The right information at the right time helps you move faster, make better decisions and achieve more.
        </p>
        <ul className="esa-resources-advantage__row">
          {ADVANTAGES.map((item) => (
            <li key={item.title} className="esa-resources-advantage__item">
              <Icon name={item.icon} size={32} className="text-accent" />
              <p className="esa-resources-advantage__title font-display font-bold">{item.title}</p>
              <p className="mt-2 text-body-m text-text-secondary">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
