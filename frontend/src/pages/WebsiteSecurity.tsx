import { useNavigate } from "react-router-dom";

import { Button, Icon, PublicSiteHeader } from "../components";
import { useLocale } from "../providers/LocaleProvider";

/**
 * Public SmartArchive Website — Page 3, "Your documents. Protected by
 * design." Founder-approved, FROZEN 2026-08-23. Shared-platform trust page —
 * explains privacy, control, storage, transparency, document lifecycle, and
 * user responsibility through calm visual storytelling and small real-UI
 * touches, not generic security iconography. Does not modify Page 1 or
 * Page 2. Uses only the existing Weave tokens (petrol/teal, gold accent-2,
 * coral accent used sparingly, sage/cream neutrals) — no new tokens needed.
 *
 * No unsupported security claims: copy stays deliberately non-specific
 * (matches the "Protected with best practices" discipline already
 * established on Page 1) — no invented certifications, encryption specs,
 * or statistics.
 */

const LIFECYCLE_STEPS = ["uploaded", "understood", "stored", "yourCall"] as const;

export default function WebsiteSecurity() {
  const { t } = useLocale();
  const navigate = useNavigate();

  return (
    <div className="bg-surface-page text-text-primary">
      <PublicSiteHeader>
        <Button type="button" variant="secondary" size="sm" onClick={() => navigate("/")}>
          {t("page2.nav.backHome")}
        </Button>
        <Button type="button" variant="primary" size="sm" onClick={() => navigate("/register")}>
          {t("website.nav.startFree")}
        </Button>
      </PublicSiteHeader>

      {/* ---------- Hero ---------- */}
      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-overline font-bold uppercase tracking-wide text-accent">{t("page3.hero.eyebrow")}</p>
            <h1 className="mt-2 font-display text-display-l font-bold leading-tight">{t("page3.hero.headline")}</h1>
            <p className="mt-4 max-w-md text-body-l text-text-secondary">{t("page3.hero.sub")}</p>
          </div>

          {/* Small real-UI touch, not a generic padlock illustration */}
          <div className="rounded-lg border border-border bg-surface-card p-5 shadow-2">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Icon name="document" size={20} className="text-text-muted" />
                <p className="font-display text-body-m font-bold">{t("website.hub.doc.insurance.title")}</p>
              </div>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-tint text-overline font-bold text-accent">A</span>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-caption font-bold text-accent-2">
              <Icon name="shield" size={16} />
              {t("page3.hero.privateTag")}
            </p>
            <p className="mt-2 text-overline text-text-muted">{t("page2.demoLabel")}</p>
          </div>
        </div>
      </section>

      {/* ---------- Privacy ---------- */}
      <section className="mt-14 border-t border-border bg-surface-recessed py-14">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <Icon name="shield" size={24} className="text-accent-2" />
          <h2 className="mt-3 font-display text-heading-1 font-bold">{t("page3.privacy.title")}</h2>
          <p className="mt-2 text-body-l text-text-secondary">{t("page3.privacy.body")}</p>
        </div>
      </section>

      {/* ---------- Control ---------- */}
      <section className="py-14">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="font-display text-heading-1 font-bold">{t("page3.control.title")}</h2>
          <p className="mt-2 text-body-l text-text-secondary">{t("page3.control.body")}</p>
          <p className="mx-auto mt-6 max-w-sm rounded-md bg-accent-2-tint py-3 text-center font-display font-bold text-accent-2">
            {t("page2.advice.decide")}
          </p>
        </div>
      </section>

      {/* ---------- Storage ---------- */}
      <section className="border-t border-border bg-surface-recessed py-14">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="font-display text-heading-1 font-bold">{t("page3.storage.title")}</h2>
          <p className="mt-2 text-body-l text-text-secondary">{t("page3.storage.body")}</p>
        </div>
      </section>

      {/* ---------- Transparency ---------- */}
      <section className="py-14">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="font-display text-heading-1 font-bold">{t("page3.transparency.title")}</h2>
          <p className="mt-2 text-body-l text-text-secondary">{t("page3.transparency.body")}</p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-body-m font-bold text-info">
            <Icon name="link" size={16} /> {t("page2.analysis.sourceLink")}
          </p>
          <p className="mt-1 text-overline text-text-muted">{t("page2.demoLabel")}</p>
        </div>
      </section>

      {/* ---------- Document lifecycle ---------- */}
      <section className="border-t border-border bg-surface-recessed py-14">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="font-display text-heading-1 font-bold">{t("page3.lifecycle.title")}</h2>
          <p className="mt-2 max-w-lg text-body-l text-text-secondary mx-auto">{t("page3.lifecycle.body")}</p>
          <div className="mt-2 flex justify-center">
            <span className="rounded-pill border border-dashed border-concept bg-concept-bg px-2.5 py-1 text-overline font-bold text-concept">
              {t("page2.conceptLabel")}
            </span>
          </div>
          <div className="mt-8 flex flex-col items-center gap-2 lg:flex-row lg:flex-wrap lg:justify-center lg:gap-4">
            {LIFECYCLE_STEPS.map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-2 lg:flex-row lg:items-start">
                <div className="flex w-40 flex-col items-center gap-2 text-center lg:w-28">
                  <span className="h-3 w-3 rounded-full border-2 border-dashed border-concept" />
                  <p className="text-caption font-bold">{t(`page3.lifecycle.step.${step}`)}</p>
                </div>
                {i < LIFECYCLE_STEPS.length - 1 && (
                  <span className="text-concept lg:mt-1.5" aria-hidden>
                    <span className="lg:hidden">↓</span>
                    <span className="hidden lg:inline">→</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- User responsibility ---------- */}
      <section data-header-theme="dark" className="relative overflow-hidden py-16 text-center" style={{ background: "var(--esa-midnight)" }}>
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <Icon name="person" size={24} className="text-esa-teal" />
          <h2 className="mt-3 font-display text-heading-2 font-bold text-esa-text">{t("page3.responsibility.title")}</h2>
          <p className="mt-2 text-body-l text-esa-text-muted">{t("page3.responsibility.body")}</p>
        </div>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section data-header-theme="dark" className="py-14 text-center text-[color:#EAF3F1]" style={{ background: "#0F3D3E" }}>
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="font-display text-heading-1 font-bold">{t("page3.cta.line1")}</h2>
          <p className="mt-1 font-display text-heading-2 font-bold text-white/85">{t("page3.cta.line2")}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button type="button" variant="primary" onClick={() => navigate("/register")}>
              {t("website.nav.startFree")}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="!border-white/40 !text-white hover:!bg-white/10"
              onClick={() => navigate("/")}
            >
              {t("page2.nav.backHome")}
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-caption text-text-muted">© SmartArchive</footer>
    </div>
  );
}
