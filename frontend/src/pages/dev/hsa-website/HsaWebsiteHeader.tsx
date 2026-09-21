import { Link, NavLink } from "react-router-dom";

import { HSA_NAV } from "./hsaWebsiteAssets";
import { HsaWebsiteWordmark } from "./HsaWebsiteWordmark";

/**
 * Shared HSA marketing header — every HSA website page reuses this.
 * Not the ESA header. Overlay on Home; solid on future pages.
 */
export function HsaWebsiteHeader({ overlay }: { overlay: boolean }) {
  return (
    <header className={overlay ? "hsa-website-header" : "hsa-website-header hsa-website-header--solid"}>
      <div className="hsa-website-header__inner">
        <HsaWebsiteWordmark />
        <nav className="hsa-website-nav" aria-label="Human SmartArchive">
          {HSA_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "is-active" : undefined)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Link className="hsa-btn hsa-btn--primary hsa-btn--header" to="/register">
          Get Started
        </Link>
      </div>
    </header>
  );
}
