import { type ReactNode } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import { Button } from "../../../components";
import { ESA_NAV, ESA_WEBSITE_BASE } from "./esaWebsiteAssets";
import { EsaWebsiteWordmark } from "./EsaWebsiteWordmark";
import "./esaWebsitePreview.css";

function navClass(isActive: boolean) {
  return [
    "relative whitespace-nowrap no-underline transition-colors duration-fast",
    isActive
      ? "font-bold text-accent after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:bg-accent"
      : "text-[color:var(--esa-mkt-text-muted)] hover:text-accent",
  ].join(" ");
}

export function EsaWebsiteHeader({
  actions,
  overlay = false,
}: {
  actions: ReactNode;
  overlay?: boolean;
}) {
  return (
    <header
      className={
        overlay
          ? "absolute inset-x-0 top-0 z-30 border-b border-transparent bg-transparent"
          : "sticky top-0 z-30 border-b border-white/10 backdrop-blur transition-colors duration-base"
      }
      style={
        overlay
          ? undefined
          : { backgroundColor: "color-mix(in srgb, var(--esa-mkt-navy) 88%, transparent)" }
      }
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-3 sm:px-6">
        <Link to={ESA_WEBSITE_BASE} className="no-underline" aria-label="SmartArchive ESA">
          <EsaWebsiteWordmark />
        </Link>
        <nav className="flex max-w-full flex-1 items-center gap-5 overflow-x-auto text-body-m md:justify-center" aria-label="SmartArchive ESA">
          {ESA_NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => navClass(isActive)}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">{actions}</div>
      </div>
    </header>
  );
}

export default function EsaWebsiteLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const overlayHero = /\/esa-website\/solutions\/?$/.test(location.pathname);

  return (
    <div className={overlayHero ? "esa-website-preview esa-website-preview--solutions" : "esa-website-preview"}>
      <p className="border-b border-white/10 bg-[color:var(--esa-mkt-midnight)] px-4 py-2 text-center text-caption text-[color:var(--esa-mkt-text-muted)]">
        Development preview — reconstruction, not a recovered original · production pages unchanged · Awaiting Founder review ·{" "}
        <Link className="font-bold text-accent" to="/dev/founder-page-review">
          Comparison board
        </Link>
      </p>

      <div className={overlayHero ? "relative" : undefined}>
        <EsaWebsiteHeader
          overlay={overlayHero}
          actions={
            <Button type="button" variant="primary" size="sm" onClick={() => navigate("/register")}>
              Contact Sales
            </Button>
          }
        />

        <Outlet />
      </div>

      <footer className="esa-website-footer border-t border-white/10 bg-[color:var(--esa-mkt-midnight)]">
        <div className="esa-website-footer__inner mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 sm:px-6">
          <EsaWebsiteWordmark />
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-caption text-[color:var(--esa-mkt-text-muted)]" aria-label="Footer">
            {ESA_NAV.map((item) => (
              <Link key={item.to} to={item.to} className="no-underline hover:text-accent">
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="text-caption text-[color:var(--esa-mkt-text-muted)]">A smarter tomorrow. Together.</p>
        </div>
      </footer>
    </div>
  );
}
