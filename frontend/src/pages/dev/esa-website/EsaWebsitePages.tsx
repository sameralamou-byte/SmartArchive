/**
 * Stub pages -- Home, Solutions, How It Works, Industries, and Security are
 * real pages. Remaining nav items exist only so ESA_NAV doesn't link to a 404;
 * they intentionally say "not yet built" rather than inventing content, per
 * the master doc's honesty rule (never imply future functionality already exists).
 */
function EsaWebsiteStub({ title }: { title: string }) {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-overline font-bold uppercase tracking-wide text-accent">{title}</p>
        <h1 className="mt-2 font-display text-display-l font-bold text-[color:var(--esa-mkt-text)]">Not yet built</h1>
        <p className="mt-4 max-w-xl text-body-l text-text-secondary">
          Only the ESA home page has an approved reference image and content so far. This page has no reference,
          copy, or design decision behind it yet -- it exists only so navigation doesn&apos;t link to a 404.
        </p>
      </section>
    </main>
  );
}

export function EsaWebsiteResources() {
  return <EsaWebsiteStub title="Resources" />;
}

export function EsaWebsiteAbout() {
  return <EsaWebsiteStub title="About" />;
}
