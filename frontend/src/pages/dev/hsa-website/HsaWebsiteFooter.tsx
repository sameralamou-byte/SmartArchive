import { Link } from "react-router-dom";

import { HSA_NAV } from "./hsaWebsiteAssets";
import { HsaWebsiteWordmark } from "./HsaWebsiteWordmark";

/** Shared HSA marketing footer — not the ESA footer. */
export function HsaWebsiteFooter() {
  return (
    <footer className="hsa-website-footer">
      <div className="hsa-website-footer__inner">
        <HsaWebsiteWordmark />
        <nav className="hsa-website-footer__nav" aria-label="HSA footer">
          {HSA_NAV.map((item) => (
            <Link key={item.to} to={item.to}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="hsa-btn hsa-btn--primary hsa-btn--header" to="/register">
          Get Started
        </Link>
      </div>
      <p className="hsa-website-footer__note">Your world, organized.</p>
    </footer>
  );
}
