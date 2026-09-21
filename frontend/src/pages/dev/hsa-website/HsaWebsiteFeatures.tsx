import { HSA_FEATURES_ASSETS } from "./hsaWebsiteAssets";

/**
 * Entire page is one continuous uncropped landscape scene.
 * Labels, captions, handwritten aside, and capability moments stay in the artwork.
 * Real HTML overlay is the shared HSA header only.
 */
export default function HsaWebsiteFeatures() {
  return (
    <main className="hsa-features-page" aria-label="Features">
      <img
        className="hsa-features-page__photo"
        src={HSA_FEATURES_ASSETS.scene}
        alt="A continuous HSA Features landscape: Understand and Find as the large central moments, with Connect and Remind beside them, and Capture, Categories, Share, Devices, Privacy, and four life-breadth thumbnails staying in the artwork."
      />
    </main>
  );
}
