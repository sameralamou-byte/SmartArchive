import { useEffect, useState, type ReactNode } from "react";

import { SmartArchiveWordmark } from "./SmartArchiveWordmark";

export interface PublicSiteHeaderProps {
  children?: ReactNode;
  nav?: ReactNode;
  showMark?: boolean;
}

/**
 * Sticky public-site header. Switches wordmark (and bar) contrast when a
 * `[data-header-theme="dark"]` section scrolls under the header band.
 */
export function PublicSiteHeader({ children, nav, showMark = false }: PublicSiteHeaderProps) {
  const [overDark, setOverDark] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const targets = document.querySelectorAll("[data-header-theme='dark']");
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setOverDark(entries.some((entry) => entry.isIntersecting));
      },
      { root: null, rootMargin: "-56px 0px 0px 0px", threshold: 0 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      data-theme={overDark ? "dark" : "light"}
      className={`sticky top-0 z-30 border-b backdrop-blur transition-colors duration-base ${
        overDark
          ? "border-esa-border bg-esa-midnight/95 [&_nav_a]:text-esa-text-muted [&_nav_a]:hover:text-esa-teal"
          : "border-border bg-surface-page/95 [&_nav_a]:text-text-secondary [&_nav_a]:hover:text-accent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <SmartArchiveWordmark variant={overDark ? "dark" : "light"} showMark={showMark} />
        {nav}
        {children ? <div className="flex items-center gap-2">{children}</div> : null}
      </div>
    </header>
  );
}
