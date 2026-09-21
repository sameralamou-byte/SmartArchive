import { HSA_LIFE_ASSETS } from "./hsaWebsiteAssets";

const CHAPTERS = [
  {
    id: "home-family",
    title: "Home & Family",
    headline: "A busy household. A lot to keep track of.",
    body: "From insurance and bills to school letters and family records — HSA helps you stay on top of what matters.",
    tagline: "A more organized home. A smoother tomorrow.",
  },
  {
    id: "freelancers",
    title: "Freelancers",
    headline: "Big ideas. Real paperwork.",
    body: "Contracts, invoices, expenses and tax documents — HSA keeps your independent work organized, so you can focus on what you do best.",
    tagline: "Less admin. More freedom.",
  },
  {
    id: "small-business",
    title: "Small Businesses & Shops",
    headline: "Keep your business running.",
    body: "Supplier invoices, licenses, leases, receipts and employee documents — all in one place, easy to find when you need them.",
    tagline: "Less admin. For what moves you.",
  },
  {
    id: "workshops",
    title: "Workshops & Trades",
    headline: "Tools, people, projects — and paperwork.",
    body: "Supplies, equipment records, inspection documents, supplier paperwork and job records — HSA helps keep your operation organized and on track.",
    tagline: "Everything that keeps jobs moving.",
  },
  {
    id: "schools",
    title: "Schools & Education",
    headline: "A safe, organized learning environment.",
    body: "Enrollment records, permissions, fees and official documents — HSA helps you manage the administrative side, so you can focus on the people who matter most.",
    tagline: "Less paperwork. More possibilities for every student.",
  },
  {
    id: "clubs",
    title: "Clubs & Small Organizations",
    headline: "People together. Things organized.",
    body: "Member records, event documents, agreements and finances — HSA helps your community run smoothly, all year round.",
    tagline: "Organized communities. Brighter tomorrows.",
  },
] as const;

/**
 * Photographic journey is one uncropped backdrop.
 * Opening, six chapters, and closing copy are real HTML — not baked pixels.
 */
export default function HsaWebsiteLife() {
  return (
    <main className="hsa-life-page" aria-label="Life (Use Cases)">
      <div className="hsa-life-page__stage">
        <img
          className="hsa-life-page__photo"
          src={HSA_LIFE_ASSETS.scene}
          alt="A continuous Life journey across home and family, freelance work, a small shop, a workshop, a school, and a community team, connected by a quiet thread of light."
        />
        <div className="hsa-life-page__copy">
          <section className="hsa-life-open" aria-labelledby="hsa-life-open-heading">
            <h1 id="hsa-life-open-heading">
              Different lives.
              <br />
              The same need for clarity.
            </h1>
            <p>
              Real paperwork. Real responsibilities. One place that brings it all together.
            </p>
          </section>
          <p className="hsa-life-tag hsa-life-tag--open">For all the moments that matter.</p>

          {CHAPTERS.map((chapter) => (
            <article key={chapter.id} className={`hsa-life-ch hsa-life-ch--${chapter.id}`}>
              <div className="hsa-life-ch__text">
                <h2>{chapter.title}</h2>
                <p className="hsa-life-ch__headline">{chapter.headline}</p>
                <p className="hsa-life-ch__body">{chapter.body}</p>
              </div>
              <p className="hsa-life-tag">{chapter.tagline}</p>
            </article>
          ))}

          <section className="hsa-life-close" aria-labelledby="hsa-life-close-heading">
            <h2 id="hsa-life-close-heading">
              However your world works,
              <br />
              HSA helps keep it together.
            </h2>
            <p>Same clarity. More possibilities.</p>
          </section>
          <p className="hsa-life-tag hsa-life-tag--close">Different lives. A more organized tomorrow.</p>
        </div>
      </div>
    </main>
  );
}
