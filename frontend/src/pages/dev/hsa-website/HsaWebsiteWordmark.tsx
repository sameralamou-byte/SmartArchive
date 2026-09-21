import { Link } from "react-router-dom";

import { HSA_WEBSITE_BASE } from "./hsaWebsiteAssets";

/** HSA three-dot cluster — not the ESA A-arrow, not the Weave constellation. */
function HsaClusterMark() {
  return (
    <svg viewBox="0 0 36 24" className="hsa-wordmark__mark" aria-hidden>
      <circle cx="7" cy="16" r="5.2" fill="#4C7AD8" />
      <circle cx="18" cy="7" r="5.2" fill="#7B6AD4" />
      <circle cx="29" cy="16" r="5.2" fill="#9A58C7" />
    </svg>
  );
}

export function HsaWebsiteWordmark() {
  return (
    <Link to={HSA_WEBSITE_BASE} className="hsa-wordmark" aria-label="HSA Human SmartArchive Home">
      <HsaClusterMark />
      <span>
        <span className="hsa-wordmark__name">HSA</span>
        <span className="hsa-wordmark__sub">Human SmartArchive</span>
      </span>
    </Link>
  );
}
