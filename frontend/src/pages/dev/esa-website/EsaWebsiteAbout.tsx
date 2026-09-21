import { Link, useNavigate } from "react-router-dom";

import { Button, Icon, type IconName } from "../../../components";
import { ESA_ABOUT_ASSETS, ESA_WEBSITE_BASE } from "./esaWebsiteAssets";

/**
 * Copy transcribed from ESA-ABOUT-2026-09-21-v1-approved.
 * Top-right PEOPLE / INFORMATION tagline stays in the hero artwork.
 * Team photo and particle-wave graphic are independent generated assets,
 * not crops of the approved mockup.
 */

const VALUES: {
  icon: IconName;
  title: string;
  body: string;
}[] = [
  {
    icon: "users",
    title: "Human Accountability",
    body: "AI can recommend. A named human decides. Everything is attributable and auditable.",
  },
  {
    icon: "lightbulb",
    title: "Useful Intelligence",
    body: "Turn complex information into clear, practical insight people can use.",
  },
  {
    icon: "shield",
    title: "Trust by Design",
    body: "Security, governance and transparency built in from the start.",
  },
  {
    icon: "chart",
    title: "Real-World Impact",
    body: "Help organizations work smarter, move faster and achieve more with their information.",
  },
];

export default function EsaWebsiteAbout() {
  const navigate = useNavigate();

  return (
    <main>
      <section className="esa-solutions-hero esa-about-hero" aria-label="SmartArchive ESA about">
        <div className="esa-solutions-hero__stage">
          <img
            className="esa-about-hero__photo"
            src={ESA_ABOUT_ASSETS.hero}
            alt="Collaborative office with a city skyline, document-intelligence threads, and a PEOPLE INFORMATION INTELLIGENCE A BRIGHTER TOMORROW tagline in the artwork."
          />
          <div className="esa-solutions-hero__content">
            <div className="esa-about-hero__copy relative flex flex-1 flex-col justify-start">
              <p className="text-overline font-bold uppercase tracking-[0.14em] text-accent">ABOUT SMARTARCHIVE ESA</p>
              <h1 className="mt-3 font-display text-display-xl font-bold leading-[1.05] text-[color:var(--esa-mkt-text)]">
                Built Around
                <br />
                Information.
                <br />
                Designed Around <span className="text-accent">People.</span>
              </h1>
              <p className="mt-4 text-body-l text-text-secondary">
                We help organizations turn complex information into trusted, usable intelligence — while keeping
                people accountable for the decisions that matter.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => document.getElementById("esa-about-values")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Our Mission
                </Button>
                <Button type="button" variant="secondary" onClick={() => navigate("/register")}>
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="esa-about-story" className="esa-about-story scroll-mt-24">
        <div className="esa-about-story__inner">
          <div>
            <p className="text-overline font-bold uppercase tracking-[0.14em] text-accent">OUR STORY</p>
            <h2 className="mt-2 font-display text-heading-2 font-bold text-[color:var(--esa-mkt-text)]">
              A Clearer Future for <span className="text-accent">Information.</span>
            </h2>
          </div>
          <p className="esa-about-story__body text-body-l text-text-secondary">
            Organizations create more information than ever, yet too much of it remains fragmented across documents,
            systems and workflows. SmartArchive ESA is being built to make that information easier to understand,
            organize and put to work — without removing human responsibility from important decisions.
          </p>
        </div>
      </section>

      <section id="esa-about-values" className="esa-about-values scroll-mt-24">
        <div className="esa-about-values__intro">
          <div>
            <p className="text-overline font-bold uppercase tracking-[0.14em] text-accent">MISSION &amp; VALUES</p>
            <h2 className="mt-2 font-display text-heading-2 font-bold text-[color:var(--esa-mkt-text)]">
              Guided by Purpose. <span className="text-accent">Driven by People.</span>
            </h2>
          </div>
          <p className="esa-about-values__lede text-body-l text-text-secondary">
            Our mission and values shape how we build, how we work, and how we partner with our customers.
          </p>
        </div>
        <ul className="esa-about-values__grid">
          {VALUES.map((item) => (
            <li key={item.title} className="esa-about-values-card">
              <span className="esa-about-values-card__icon" aria-hidden="true">
                <Icon name={item.icon} size={22} />
              </span>
              <p className="esa-about-values-card__title font-display font-bold">{item.title}</p>
              <p className="esa-about-values-card__body text-body-m text-text-secondary">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="esa-about-people">
        <div className="esa-about-people__copy">
          <p className="text-overline font-bold uppercase tracking-[0.14em] text-accent">THE PEOPLE BEHIND THE MISSION</p>
          <h2 className="mt-2 font-display text-heading-2 font-bold text-[color:var(--esa-mkt-text)]">
            A Collaborative Approach to a <span className="text-accent">Smarter Tomorrow.</span>
          </h2>
          <p className="mt-3 text-body-l text-text-secondary">
            SmartArchive ESA brings together people with deep expertise in product, engineering, information and
            business — united by a shared belief that information can create real value when technology and people
            work together.
          </p>
        </div>
        <figure className="esa-about-people__frame">
          <img
            className="esa-about-people__photo"
            src={ESA_ABOUT_ASSETS.team}
            alt="Anonymous team collaborating in a glass office with a city skyline. Independent ESA still, not a crop of the About hero."
          />
          <figcaption className="esa-about-people__caption">
            DIFFERENT PERSPECTIVES.
            <br />
            A BRIGHTER TOMORROW.
          </figcaption>
        </figure>
      </section>

      <section id="esa-about-trust" className="esa-about-trust scroll-mt-24">
        <div className="esa-about-trust__copy">
          <p className="text-overline font-bold uppercase tracking-[0.14em] text-accent">TRUST IN EVERYTHING WE DO</p>
          <h2 className="mt-2 font-display text-heading-2 font-bold text-[color:var(--esa-mkt-text)]">
            Information <span className="text-accent">You Can Trust.</span>
          </h2>
          <p className="mt-3 text-body-l text-text-secondary">
            Security, governance and responsible use are at the core of SmartArchive ESA. Learn more about our
            approach to security and responsible AI.
          </p>
        </div>
        <div className="esa-about-trust__action">
          <Link to={`${ESA_WEBSITE_BASE}/security`} className="esa-about-trust__link">
            Visit Our Security Page →
          </Link>
        </div>
      </section>

      <section className="esa-about-close">
        <svg
          className="esa-about-close__flow"
          viewBox="0 0 1600 520"
          preserveAspectRatio="xMaxYMid slice"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <filter id="esa-about-close-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="esa-about-close-glow-strong" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="14" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="esa-about-close-volume" x="-20%" y="-40%" width="140%" height="180%">
              <feGaussianBlur stdDeviation="18" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
              </feMerge>
            </filter>
            <linearGradient id="esa-about-close-magenta-vol" x1="12%" y1="80%" x2="92%" y2="18%">
              <stop offset="0%" stopColor="#e6299b" stopOpacity="0" />
              <stop offset="22%" stopColor="#e6299b" stopOpacity="0.55" />
              <stop offset="58%" stopColor="#ff4fc0" stopOpacity="0.42" />
              <stop offset="100%" stopColor="#7aa2ff" stopOpacity="0.12" />
            </linearGradient>
            <linearGradient id="esa-about-close-blue-vol" x1="18%" y1="70%" x2="100%" y2="8%">
              <stop offset="0%" stopColor="#4a7dff" stopOpacity="0" />
              <stop offset="28%" stopColor="#4a7dff" stopOpacity="0.5" />
              <stop offset="72%" stopColor="#8eb0ff" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#c5d6ff" stopOpacity="0.18" />
            </linearGradient>
            <linearGradient id="esa-about-close-magenta" x1="0%" y1="70%" x2="100%" y2="20%">
              <stop offset="0%" stopColor="#e6299b" stopOpacity="0" />
              <stop offset="24%" stopColor="#e6299b" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#ff4fc0" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#8eb0ff" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="esa-about-close-blue" x1="8%" y1="60%" x2="100%" y2="10%">
              <stop offset="0%" stopColor="#4a7dff" stopOpacity="0" />
              <stop offset="22%" stopColor="#4a7dff" stopOpacity="0.9" />
              <stop offset="78%" stopColor="#8eb0ff" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#d7e4ff" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          <ellipse
            cx="1020"
            cy="230"
            rx="460"
            ry="150"
            fill="#3865e0"
            opacity="0.18"
            filter="url(#esa-about-close-volume)"
          />
          <ellipse
            cx="860"
            cy="300"
            rx="300"
            ry="110"
            fill="#e6299b"
            opacity="0.16"
            filter="url(#esa-about-close-volume)"
          />
          <path
            d="M360 410 C 620 370, 900 265, 1180 175 C 1360 115, 1500 78, 1640 62 L 1640 132 C 1500 146, 1365 180, 1195 235 C 920 330, 650 415, 375 448 Z"
            fill="url(#esa-about-close-magenta-vol)"
            filter="url(#esa-about-close-glow-strong)"
          />
          <path
            d="M400 345 C 680 280, 980 160, 1260 95 C 1420 58, 1540 38, 1640 32 L 1640 92 C 1530 96, 1415 116, 1272 150 C 1005 220, 710 325, 420 380 Z"
            fill="url(#esa-about-close-blue-vol)"
            filter="url(#esa-about-close-glow-strong)"
          />
          <g strokeLinecap="round" fill="none">
            <path d="M340 400 C 640 345, 960 210, 1280 120 S 1560 62, 1640 54" stroke="url(#esa-about-close-blue)" strokeWidth="7" opacity="0.2" />
            <path d="M330 422 C 620 372, 940 248, 1240 150 S 1540 78, 1640 70" stroke="url(#esa-about-close-magenta)" strokeWidth="8" opacity="0.26" filter="url(#esa-about-close-glow-strong)" />
            <path d="M370 358 C 670 288, 1000 155, 1320 88 S 1580 38, 1640 32" stroke="url(#esa-about-close-blue)" strokeWidth="2.5" opacity="0.88" filter="url(#esa-about-close-glow)" />
            <path d="M350 382 C 650 328, 970 195, 1290 112 S 1565 52, 1640 44" stroke="url(#esa-about-close-magenta)" strokeWidth="2.9" opacity="0.95" filter="url(#esa-about-close-glow)" />
            <path d="M345 404 C 635 352, 955 228, 1265 138 S 1550 72, 1640 64" stroke="#e6299b" strokeWidth="1.7" opacity="0.82" filter="url(#esa-about-close-glow)" />
            <path d="M390 340 C 695 268, 1030 138, 1350 72 S 1590 28, 1640 24" stroke="#7aa2ff" strokeWidth="1.55" opacity="0.78" />
            <path d="M380 350 C 685 280, 1015 148, 1335 80 S 1585 32, 1640 28" stroke="#4a7dff" strokeWidth="1.3" opacity="0.72" />
            <path d="M360 370 C 660 312, 985 180, 1305 100 S 1572 46, 1640 38" stroke="#ff4fc0" strokeWidth="1.45" opacity="0.74" />
            <path d="M325 430 C 610 385, 925 268, 1220 168 S 1525 90, 1640 80" stroke="#c42d86" strokeWidth="1.2" opacity="0.55" />
            <path d="M405 328 C 715 252, 1050 122, 1370 62 S 1598 22, 1640 18" stroke="#8eb0ff" strokeWidth="1.15" opacity="0.64" />
            <path d="M415 318 C 730 238, 1070 108, 1390 52 S 1605 16, 1640 12" stroke="#4a7dff" strokeWidth="0.95" opacity="0.46" />
            <path d="M320 442 C 600 400, 910 286, 1200 185 S 1510 102, 1640 90" stroke="#e6299b" strokeWidth="1.05" opacity="0.5" />
            <path d="M400 336 C 705 260, 1040 130, 1360 68 S 1594 24, 1640 20" stroke="#b8ccff" strokeWidth="0.9" opacity="0.52" />
            <path d="M355 392 C 645 340, 965 208, 1280 122 S 1560 58, 1640 50" stroke="#ff7ad0" strokeWidth="1.1" opacity="0.6" />
            <path d="M375 364 C 675 298, 995 165, 1325 90 S 1582 36, 1640 30" stroke="#3865e0" strokeWidth="1.2" opacity="0.52" />
            <path d="M335 416 C 625 365, 950 240, 1255 148 S 1545 76, 1640 68" stroke="#4a7dff" strokeWidth="0.85" opacity="0.34" />
            <path d="M425 308 C 745 225, 1090 95, 1410 44 S 1610 12, 1640 8" stroke="#d7e4ff" strokeWidth="0.8" opacity="0.4" />
            <path d="M348 412 C 632 360, 948 236, 1250 146 S 1542 74, 1640 66" stroke="#e6299b" strokeWidth="0.9" opacity="0.44" />
            <path d="M385 346 C 690 274, 1022 142, 1342 76 S 1588 30, 1640 26" stroke="#8eb0ff" strokeWidth="1.05" opacity="0.58" />
          </g>
          <g filter="url(#esa-about-close-glow)">
            <circle cx="510" cy="372" r="2.2" fill="#e6299b" />
            <circle cx="600" cy="342" r="1.4" fill="#ff4fc0" />
            <circle cx="690" cy="308" r="2.9" fill="#4a7dff" />
            <circle cx="780" cy="268" r="1.6" fill="#8eb0ff" />
            <circle cx="860" cy="232" r="3.3" fill="#e6299b" />
            <circle cx="940" cy="198" r="1.5" fill="#7aa2ff" />
            <circle cx="1020" cy="168" r="2.5" fill="#ff4fc0" />
            <circle cx="1100" cy="140" r="3.7" fill="#4a7dff" />
            <circle cx="1180" cy="118" r="1.7" fill="#e6299b" />
            <circle cx="1260" cy="98" r="2.6" fill="#8eb0ff" />
            <circle cx="1335" cy="84" r="1.4" fill="#ff4fc0" />
            <circle cx="1410" cy="72" r="2.3" fill="#4a7dff" />
            <circle cx="1485" cy="62" r="3" fill="#c5d6ff" />
            <circle cx="1555" cy="54" r="1.6" fill="#e6299b" />
            <circle cx="1610" cy="48" r="2.1" fill="#7aa2ff" />
            <circle cx="555" cy="358" r="1.1" fill="#8eb0ff" />
            <circle cx="820" cy="248" r="1.2" fill="#4a7dff" />
            <circle cx="900" cy="214" r="1.8" fill="#ff4fc0" />
            <circle cx="1060" cy="154" r="1.3" fill="#e6299b" />
            <circle cx="1140" cy="128" r="1.1" fill="#d7e4ff" />
            <circle cx="1220" cy="108" r="2" fill="#4a7dff" />
            <circle cx="1300" cy="90" r="1.2" fill="#e6299b" />
            <circle cx="1375" cy="78" r="1.5" fill="#8eb0ff" />
            <circle cx="1450" cy="66" r="1.1" fill="#ff4fc0" />
            <circle cx="1520" cy="58" r="1.8" fill="#4a7dff" />
            <circle cx="730" cy="292" r="1.3" fill="#ff7ad0" />
            <circle cx="980" cy="182" r="1.1" fill="#3865e0" />
            <circle cx="1288" cy="112" r="1.4" fill="#e6299b" />
            <circle cx="1580" cy="70" r="1.2" fill="#8eb0ff" />
            <circle cx="640" cy="330" r="1" fill="#4a7dff" />
            <circle cx="748" cy="278" r="4.2" fill="#ff4fc0" />
            <circle cx="888" cy="216" r="3.8" fill="#8eb0ff" />
            <circle cx="1088" cy="148" r="4.6" fill="#4a7dff" />
            <circle cx="1232" cy="108" r="3.4" fill="#e6299b" />
            <circle cx="1398" cy="76" r="3.9" fill="#c5d6ff" />
          </g>
        </svg>
        <div className="esa-about-close__copy">
          <p className="text-overline font-bold uppercase tracking-[0.14em] text-accent">READY TO MOVE FORWARD</p>
          <h2 className="mt-2 font-display text-heading-2 font-bold text-[color:var(--esa-mkt-text)]">
            Build a Smarter <span className="text-accent">Information Future.</span>
          </h2>
          <p className="mt-3 text-body-l text-text-secondary">
            Turn complex information into trusted, usable intelligence — while keeping people at the center of the
            decisions that matter.
          </p>
          <div className="mt-6">
            <Button type="button" variant="primary" onClick={() => navigate("/register")}>
              Contact Sales →
            </Button>
          </div>
        </div>
        <p className="esa-about-close__tagline">
          PEOPLE.
          <br />
          INFORMATION.
          <br />
          POSSIBILITIES.
        </p>
      </section>
    </main>
  );
}
