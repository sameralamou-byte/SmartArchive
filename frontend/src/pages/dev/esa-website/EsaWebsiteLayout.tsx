import { type ReactNode } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import { Button } from "../../../components";
import { SmartArchiveWordmark } from "../../../components/SmartArchiveWordmark";
import { ESA_NAV, ESA_WEBSITE_BASE } from "./esaWebsiteAssets";
import "./esaWebsitePreview.css";

function navClass(isActive: boolean) {
  return [
    "whitespace-nowrap no-underline transition-colors duration-fast",
    isActive ? "font-bold text-accent" : "text-[color:var(--esa-mkt-text-muted)] hover:text-accent",
  ].join(" ");
}

export function EsaWebsiteHeader({ actions }: { actions: ReactNode }) {
  return (
    <header
      className="sticky top-0 z-30 border-b border-white/10 backdrop-blur transition-colors duration-base"
      style={{ backgroundColor: "color-mix(in srgb, var(--esa-mkt-navy) 88%, transparent)" }}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-3 sm:px-6">
        <Link to={ESA_WEBSITE_BASE} className="no-underline" aria-label="SmartArchive ESA">
          <SmartArchiveWordmark variant="dark" showMark />
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

  return (
    <div className="esa-website-preview">
      <p className="border-b border-white/10 bg-[color:var(--esa-mkt-midnight)] px-4 py-2 text-center text-caption text-[color:var(--esa-mkt-text-muted)]">
        Development preview — reconstruction, not a recovered original · production pages unchanged · Awaiting Founder review ·{" "}
        <Link className="font-bold text-accent" to="/dev/founder-page-review">
          Comparison board
        </Link>
      </p>

      <EsaWebsiteHeader
        actions={
          <Button type="button" variant="primary" size="sm" onClick={() => navigate("/register")}>
            Contact Sales
          </Button>
        }
      />

      <Outlet />

      <footer className="border-t border-white/10 bg-[color:var(--esa-mkt-midnight)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 sm:px-6">
          <SmartArchiveWordmark variant="dark" showMark />
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
