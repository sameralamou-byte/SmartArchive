import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import { Button } from "../../../components";
import { SmartArchiveWordmark } from "../../../components/SmartArchiveWordmark";
import { HSA_NAV, HSA_WEBSITE_BASE } from "./hsaWebsiteAssets";
import "./hsaWebsitePreview.css";

function navClass(isActive: boolean, overDark: boolean) {
  if (overDark) {
    return [
      "whitespace-nowrap no-underline transition-colors duration-fast",
      isActive ? "font-bold text-accent-2" : "text-[color:var(--esa-text-muted)] hover:text-accent-2",
    ].join(" ");
  }
  return [
    "whitespace-nowrap no-underline transition-colors duration-fast",
    isActive ? "font-bold text-[color:var(--esa-surface)]" : "text-text-secondary hover:text-accent",
  ].join(" ");
}

export function HsaWebsiteHeader({ actions }: { actions: ReactNode }) {
  const [overDark, setOverDark] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const targets = document.querySelectorAll("[data-header-theme='dark']");
    if (targets.length === 0) {
      setOverDark(false);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        setOverDark(entries.some((entry) => entry.isIntersecting));
      },
      { root: null, rootMargin: "-56px 0px 0px 0px", threshold: 0 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-30 border-b backdrop-blur transition-colors duration-base ${
        overDark ? "border-white/10" : "border-border"
      }`}
      style={{ backgroundColor: overDark ? "var(--esa-midnight)" : "color-mix(in srgb, var(--surface-page) 94%, transparent)" }}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-3 sm:px-6">
        <Link to={HSA_WEBSITE_BASE} className="no-underline" aria-label="SmartArchive Home">
          <SmartArchiveWordmark variant={overDark ? "dark" : "light"} showMark />
        </Link>
        <nav className="flex max-w-full flex-1 items-center gap-5 overflow-x-auto text-body-m md:justify-center" aria-label="SmartArchive">
          {HSA_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => navClass(isActive, overDark)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">{actions}</div>
      </div>
    </header>
  );
}

export default function HsaWebsiteLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    const el = document.getElementById(id);
    el?.scrollIntoView({ block: "start" });
  }, [location.pathname, location.hash]);

  return (
    <div className="hsa-website-preview">
      <p className="border-b border-accent-2 bg-[color:var(--esa-surface)] px-4 py-2 text-center text-caption text-[color:var(--esa-text)]">
        Development preview — production pages unchanged · Awaiting Founder review ·{" "}
        <Link className="font-bold text-accent-2" to="/dev/founder-page-review">
          Comparison board
        </Link>
      </p>

      <HsaWebsiteHeader
        actions={
          <>
            <Button type="button" variant="secondary" size="sm" onClick={() => navigate("/login")}>
              Sign in
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={() => navigate("/register")}>
              Start for free
            </Button>
          </>
        }
      />

      <Outlet />

      <footer className="border-t border-border bg-[color:var(--surface-card)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 sm:px-6">
          <SmartArchiveWordmark variant="light" showMark />
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-caption text-text-secondary" aria-label="Footer">
            {HSA_NAV.map((item) => (
              <Link key={item.to} to={item.to} className="no-underline hover:text-accent">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
