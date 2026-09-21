import { HSA_HOW_IT_WORKS_ASSETS } from "./hsaWebsiteAssets";

/**
 * Entire page is one continuous uncropped scene. Captions, light-thread,
 * handwritten asides, and the bottom icon row stay in the artwork.
 * Real HTML overlay is the shared HSA header only.
 */
export default function HsaWebsiteHowItWorks() {
  return (
    <main className="hsa-how-page" aria-label="How It Works">
      <img
        className="hsa-how-page__photo"
        src={HSA_HOW_IT_WORKS_ASSETS.scene}
        alt="A continuous How It Works scene: capturing a document with a phone, reading an insurance letter, organizing papers and family photos along a thread of light, a reminder notification, and a quiet evening together. Handwritten asides and a Personal, Family, Small Business, School, Workshop, and Store row stay in the artwork."
      />
    </main>
  );
}
