import { Link } from "react-router-dom";

import { HSA_HOME_ASSETS, HSA_WEBSITE_BASE } from "./hsaWebsiteAssets";

const TRUST = [
  {
    label: "Your data stays yours",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <rect x="6" y="11" width="12" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
    ),
  },
  {
    label: "Built for real life",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <circle cx="9" cy="8" r="2.6" />
        <path d="M4 19c.3-2.8 2.4-4.6 5-4.6s4.7 1.8 5 4.6" />
        <circle cx="16.5" cy="9.2" r="2.1" />
        <path d="M14.8 19c.3-2 1.7-3.4 3.7-3.6" />
      </svg>
    ),
  },
  {
    label: "Private. Secure. Trusted.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M12 3c4 1.5 7 1.5 7 1.5v6.5c0 5-3 8-7 9.5-4-1.5-7-4.5-7-9.5V4.5S8 4.5 12 3Z" />
      </svg>
    ),
  },
] as const;

const WORLD_PARTS = [
  "Home & Family",
  "Freelancers",
  "Small Businesses & Shops",
  "Workshops & Trades",
  "Schools & Education",
  "Clubs & Small Organizations",
] as const;

const HOW_STEPS = ["Capture", "Understand", "Organize", "Connect", "Remind", "Act"] as const;

const PAPER_TYPES = [
  "Letters",
  "Bills",
  "Bank papers",
  "Insurance",
  "School papers",
  "Residence",
  "Licences",
  "Reminders",
] as const;

export default function HsaWebsiteHome() {
  return (
    <main>
      <section className="hsa-home-hero" aria-label="Human SmartArchive">
        <div className="hsa-home-hero__stage">
          <img
            className="hsa-home-hero__photo"
            src={HSA_HOME_ASSETS.hero}
            alt="A family at a kitchen table reviewing papers together. Translucent Home, Family, Finances, Health, and Memories cards, a stack of labeled books, and a handwritten Good People Brighter Days note stay in the artwork."
          />
          <div className="hsa-home-hero__veil" aria-hidden />
          <div className="hsa-home-hero__content">
            <div className="hsa-home-hero__copy">
              <p className="hsa-home-hero__eyebrow">Your world, organized</p>
              <h1 className="hsa-home-hero__title">
                Everything That Matters.
                <br />
                <span className="hsa-home-hero__accent">Finally in One Place.</span>
              </h1>
              <p className="hsa-home-hero__body">
                HSA brings together the documents and information behind your life and work — and helps you stay ahead of
                what needs your attention.
              </p>
              <div className="hsa-home-hero__actions">
                <Link className="hsa-btn hsa-btn--primary" to="/register">
                  Get Started →
                </Link>
                <Link className="hsa-btn hsa-btn--ghost" to={`${HSA_WEBSITE_BASE}/how-it-works`}>
                  See How It Works
                </Link>
              </div>
              <ul className="hsa-home-hero__trust">
                {TRUST.map((item) => (
                  <li key={item.label}>
                    {item.icon}
                    {item.label}
                  </li>
                ))}
              </ul>
              <p className="hsa-home-hero__aside">
                Less paperwork.
                <br />
                More life.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hsa-band hsa-world" aria-labelledby="hsa-world-heading">
        <div className="hsa-band__intro">
          <p className="hsa-kicker">Who HSA is for</p>
          <h2 id="hsa-world-heading" className="hsa-heading">
            One SmartArchive. <span className="hsa-home-hero__accent">Many Parts of Your World.</span>
          </h2>
          <p className="hsa-lead">
            For everyday life and small work, including home and family.
          </p>
        </div>
        <figure className="hsa-world__frame">
          <img
            className="hsa-world__photo"
            src={HSA_HOME_ASSETS.mosaic}
            alt="A continuous scene across home and family, freelance work, a small shop, a workshop, a classroom, and a community gathering, connected by a quiet thread of light."
          />
          <ol className="hsa-world__labels">
            {WORLD_PARTS.map((part) => (
              <li key={part}>{part}</li>
            ))}
          </ol>
        </figure>
      </section>

      <section className="hsa-band hsa-how" aria-labelledby="hsa-how-heading">
        <div className="hsa-split">
          <img
            className="hsa-split__photo"
            src={HSA_HOME_ASSETS.understand}
            alt="A person reading an important letter at a warm home table."
          />
          <div className="hsa-split__copy">
            <p className="hsa-kicker">How HSA works</p>
            <h2 id="hsa-how-heading" className="hsa-heading">
              A real document. Then you decide.
            </h2>
            <p className="hsa-lead">
              Documents that belong to a real situation — understood, remembered, and kept in context.
            </p>
            <ol className="hsa-steps">
              {HOW_STEPS.map((step, index) => (
                <li key={step}>
                  <span className="hsa-steps__n">{String(index + 1).padStart(2, "0")}</span>
                  <strong>{step}</strong>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="hsa-band hsa-papers" aria-labelledby="hsa-papers-heading">
        <div className="hsa-band__intro">
          <p className="hsa-kicker">What HSA understands</p>
          <h2 id="hsa-papers-heading" className="hsa-heading">
            The papers behind your life and work.
          </h2>
          <p className="hsa-lead">Kept with the situation they belong to — not a pile, and not a dashboard.</p>
        </div>
        <figure className="hsa-papers__frame">
          <img
            className="hsa-papers__photo"
            src={HSA_HOME_ASSETS.documents}
            alt="Everyday documents on a wooden table: letters, bills, insurance, bank papers, and reminders."
          />
          <ul className="hsa-papers__types">
            {PAPER_TYPES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </figure>
      </section>

      <section className="hsa-band hsa-attention" aria-labelledby="hsa-attention-heading">
        <div className="hsa-split hsa-split--reverse">
          <img
            className="hsa-split__photo"
            src={HSA_HOME_ASSETS.attention}
            alt="A household bill beside a phone reminder in a warm kitchen."
          />
          <div className="hsa-split__copy">
            <p className="hsa-kicker">Attention</p>
            <h2 id="hsa-attention-heading" className="hsa-heading">
              Stay ahead of what needs you.
            </h2>
            <p className="hsa-lead">
              HSA helps you remember deadlines and the next useful step — quietly, beside the original document. You
              still decide.
            </p>
          </div>
        </div>
      </section>

      <section className="hsa-band hsa-privacy" aria-labelledby="hsa-privacy-heading">
        <div className="hsa-split">
          <img
            className="hsa-split__photo"
            src={HSA_HOME_ASSETS.privacy}
            alt="A person at home keeping a personal folder of documents private."
          />
          <div className="hsa-split__copy">
            <p className="hsa-kicker">Privacy &amp; control</p>
            <h2 id="hsa-privacy-heading" className="hsa-heading">
              Your information stays yours.
            </h2>
            <p className="hsa-lead">You decide what to store, what to share, and what to keep private.</p>
            <ul className="hsa-privacy__points">
              <li>Protected</li>
              <li>Under your control</li>
              <li>Access only by you</li>
            </ul>
            <p className="hsa-caption">
              These describe intent, not a specific technical mechanism or certification.
            </p>
          </div>
        </div>
      </section>

      <section className="hsa-cta" aria-labelledby="hsa-cta-heading">
        <p className="hsa-kicker">Get started</p>
        <h2 id="hsa-cta-heading" className="hsa-heading">
          Everything that matters. <span className="hsa-home-hero__accent">Finally in one place.</span>
        </h2>
        <p className="hsa-lead">Bring the documents behind your life and work together — and stay ahead of what needs your attention.</p>
        <div className="hsa-home-hero__actions">
          <Link className="hsa-btn hsa-btn--primary" to="/register">
            Get Started →
          </Link>
          <Link className="hsa-btn hsa-btn--ghost" to={`${HSA_WEBSITE_BASE}/how-it-works`}>
            See How It Works
          </Link>
        </div>
      </section>
    </main>
  );
}
