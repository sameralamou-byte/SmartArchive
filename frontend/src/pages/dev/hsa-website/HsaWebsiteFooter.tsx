import { Link, useLocation } from "react-router-dom";

import { HSA_NAV, HSA_WEBSITE_BASE, hsaSiteBase } from "./hsaWebsiteAssets";
import { HsaWebsiteWordmark } from "./HsaWebsiteWordmark";

/** Shared HSA marketing footer — not the ESA footer. */
export function HsaWebsiteFooter() {
  const base = hsaSiteBase(useLocation().pathname);
  return (
    <footer className="hsa-website-footer">
      <div className="hsa-website-footer__inner">
        <HsaWebsiteWordmark />
        <nav className="hsa-website-footer__nav" aria-label="HSA footer">
          {HSA_NAV.map((item) => (
            <Link key={item.label} to={item.to.replace(HSA_WEBSITE_BASE, base)}>
              {item.label}
            </Link>
          ))}
          {/* TEMPORARY contact — sameralamou@gmail.com is a placeholder until
           * the company/domain is established and real per-product support
           * emails exist. Replace this href once that happens. */}
          <a href="mailto:sameralamou@gmail.com">Contact</a>
        </nav>
        <Link className="hsa-btn hsa-btn--primary hsa-btn--header" to="/register">
          Get Started
        </Link>
      </div>
      <p className="hsa-website-footer__note">Your world, organized.</p>
    </footer>
  );
}
