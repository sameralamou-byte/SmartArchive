import { useMemo, useState } from "react";
import {
  AISuggestion,
  Badge,
  Button,
  CitationChip,
  ConfidenceThread,
  Container,
  DocumentListItem,
  HomeRail,
  UnderstandBar,
} from "../components";
import { useLocale, type Locale } from "../providers/LocaleProvider";
import { useTheme } from "../providers/ThemeProvider";

const LOCALES: { value: Locale; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "de", label: "DE" },
  { value: "ar", label: "AR" },
];

/** "Good afternoon" / "Good morning" / "Good evening" — the one personalization touch. Not overdone. */
function useGreeting() {
  return useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);
}

export default function HomeDashboard() {
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale } = useLocale();
  const greeting = useGreeting();
  const [tab, setTab] = useState("home");

  return (
    <div className="flex min-h-screen flex-col bg-surface-page">
      {/* Minimal QA strip — not part of the product, just how this concept is reviewed. */}
      <div className="flex items-center justify-between border-b border-border bg-surface-card px-4 py-2 text-caption text-text-muted">
        <span>Demo content — Home Dashboard concept, not connected to real data</span>
        <div className="flex items-center gap-2">
          {LOCALES.map((l) => (
            <button
              key={l.value}
              onClick={() => setLocale(l.value)}
              className={`rounded-sm px-1.5 ${locale === l.value ? "font-bold text-accent" : ""}`}
            >
              {l.label}
            </button>
          ))}
          <button onClick={toggleTheme} className="rounded-sm px-1.5">
            {theme === "light" ? "Dark" : "Light"}
          </button>
        </div>
      </div>

      <main className="flex-1 pb-24">
        <Container width="content" className="py-8 sm:py-12">
          {/* 1 — Greeting */}
          <h1 className="font-display text-display-l font-bold text-text-primary">
            {greeting}, Alex.
          </h1>
          <p className="mt-1 text-body-l text-text-muted">Here's what's on your mind today.</p>

          {/* 2 — Understand Bar, the primary action */}
          <UnderstandBar
            density="home"
            onUpload={() => {}}
            onScan={() => {}}
            onVoice={() => {}}
            className="mt-6"
          />

          {/* 3 — Today / Attention */}
          <section className="mt-10">
            <h2 className="font-display text-heading-3 font-bold text-text-primary">
              Needs your attention
            </h2>
            <div className="mt-2 divide-y divide-border">
              <DocumentListItem
                icon="document"
                title="Letter from Stadt Frankfurt am Main"
                subtitle="Deadline in 8 days"
                trailing={<Badge tone="warning">Action needed</Badge>}
              />
              <div className="py-3">
                <ConfidenceThread
                  value={0.42}
                  level="low"
                  subject="Electricity bill — due date extracted"
                />
                <p className="mt-1.5 text-body-m text-text-muted">
                  Due date: 12 March. Please confirm — the print was faint.
                </p>
              </div>
              <div className="py-3">
                <p className="mb-2 text-body-m text-text-primary">
                  Insurance document — renews in 21 days.
                </p>
                <AISuggestion trailing={<CitationChip href="#insurance-doc">Page 1 →</CitationChip>}>
                  Want a reminder set automatically, 7 days before renewal?
                </AISuggestion>
              </div>
            </div>
          </section>

          {/* 4 — Recent documents */}
          <section className="mt-10">
            <h2 className="font-display text-heading-3 font-bold text-text-primary">
              Recent documents
            </h2>
            <div className="mt-2 divide-y divide-border">
              <DocumentListItem
                icon="document"
                title="School registration"
                subtitle="Uploaded 12 Jun 2026"
                trailing={<Badge tone="info">Education</Badge>}
              />
              <DocumentListItem
                icon="document"
                title="Rental contract"
                subtitle="Uploaded 5 Jun 2026"
                trailing={<Badge tone="neutral">Contract</Badge>}
              />
              <DocumentListItem
                icon="document"
                title="Health insurance"
                subtitle="Uploaded 1 Jun 2026"
                trailing={<Badge tone="neutral">Insurance</Badge>}
              />
            </div>
            <Button variant="ghost" size="sm" className="mt-2">
              View all documents
            </Button>
          </section>

          {/* 8 — Timeline / reminders */}
          <section className="mt-10">
            <h2 className="font-display text-heading-3 font-bold text-text-primary">
              Coming up
            </h2>
            <div className="mt-3 space-y-4">
              {[
                { date: "18 Aug", label: "Government letter — registration deadline" },
                { date: "5 Sep", label: "Electricity bill — usually due" },
                { date: "1 Oct", label: "Insurance — renewal date" },
              ].map((item) => (
                <div key={item.label} className="flex items-baseline gap-4">
                  <span className="w-14 shrink-0 font-mono text-data text-text-muted">
                    {item.date}
                  </span>
                  <span className="text-body-m text-text-primary">{item.label}</span>
                </div>
              ))}
            </div>
          </section>
        </Container>
      </main>

      {/* 9 — Navigation: the approved Home rail, not an enterprise sidebar */}
      <HomeRail
        activeKey={tab}
        onNavigate={setTab}
        className="fixed inset-x-0 bottom-0"
        items={[
          { key: "home", icon: "spark", label: "Home" },
          { key: "documents", icon: "document", label: "Documents" },
          { key: "timeline", icon: "workflow", label: "Timeline" },
          { key: "family", icon: "shield", label: "Family" },
        ]}
      />
    </div>
  );
}
