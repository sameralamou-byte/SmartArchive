import { useState } from "react";
import {
  AISuggestion,
  Badge,
  Button,
  CitationChip,
  ConfidenceThread,
  DocumentListItem,
  EnterpriseSidebar,
  StatTile,
  UnderstandBar,
} from "../components";
import { useLocale, type Locale } from "../providers/LocaleProvider";
import { useTheme } from "../providers/ThemeProvider";

const LOCALES: { value: Locale; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "de", label: "DE" },
  { value: "ar", label: "AR" },
];

const NAV = [
  { key: "overview", icon: "workflow" as const, label: "Overview" },
  { key: "knowledge", icon: "search" as const, label: "Knowledge" },
  { key: "workflows", icon: "workflow" as const, label: "Workflows" },
  { key: "governance", icon: "shield" as const, label: "Governance" },
  { key: "admin", icon: "document" as const, label: "Administration" },
];

function SectionCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-border bg-surface-card p-5 shadow-1">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-heading-3 font-bold text-text-primary">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

export default function EnterpriseCommandCenter() {
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale } = useLocale();
  const [nav, setNav] = useState("overview");

  return (
    <div className="min-h-screen bg-surface-page lg:flex">
      <EnterpriseSidebar
        activeKey={nav}
        onNavigate={setNav}
        items={NAV}
        header={
          <div>
            <p className="font-display text-body-l font-bold text-text-primary">SmartArchive</p>
            <p className="text-caption text-text-muted">Enterprise</p>
          </div>
        }
      />

      <div className="min-w-0 flex-1">
        {/* Minimal QA strip — not part of the product. */}
        <div className="flex items-center justify-between border-b border-border bg-surface-card px-4 py-2 text-caption text-text-muted">
          <span>Demo content — Enterprise Command Center concept, not connected to real data</span>
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

        <div className="mx-auto w-full max-w-[100rem] px-4 py-6 sm:px-6">
          {/* 1 — Enterprise identity/context */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-heading-1 font-bold text-text-primary">
                Meridian Industrial GmbH
              </h1>
              <p className="text-body-m text-text-muted">Operations — Ops Team</p>
            </div>
            <Badge tone="success">98% operational</Badge>
          </div>

          {/* 2 — Compact Understand Bar */}
          <UnderstandBar density="enterprise" onUpload={() => {}} onVoice={() => {}} className="mb-6" />

          {/* 3 — Operational attention / priority area */}
          <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile label="Documents" value="128,421" sub="+12% this week" tone="neutral" />
            <StatTile label="AI tasks" value="34" sub="In progress" tone="neutral" />
            <StatTile label="Approvals pending" value="12" sub="Needs a decision" tone="warning" />
            <StatTile label="Alerts" value="7" sub="Requires attention" tone="critical" />
          </div>

          {/* Dense two-column body — this is the "may expose complexity" layer */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
              {/* 4 — AI intelligence / insights */}
              <SectionCard title="AI insights">
                <p className="mb-3 text-body-m text-text-primary">
                  12 contracts matched your last query — 4 expire within 90 days.
                </p>
                <ConfidenceThread
                  value={0.58}
                  level="medium"
                  subject="Vendor match — Nordfeld Systems AG"
                  className="mb-3"
                />
                <AISuggestion trailing={<CitationChip href="#dup-docs">3 groups →</CitationChip>}>
                  3 duplicate document groups detected — merge to keep records clean?
                </AISuggestion>
              </SectionCard>

              {/* 5 — Documents & knowledge activity */}
              <SectionCard
                title="Documents & knowledge activity"
                action={
                  <Button variant="ghost" size="sm">
                    View all
                  </Button>
                }
              >
                <div className="divide-y divide-border">
                  <DocumentListItem
                    icon="document"
                    title="Nordfeld Systems AG — Service Agreement 2024"
                    subtitle="€450,000 · expires in 45 days"
                    trailing={<Badge tone="neutral">Contract</Badge>}
                  />
                  <DocumentListItem
                    icon="document"
                    title="Nordfeld Systems AG — Maintenance Contract"
                    subtitle="€120,000 · expires in 60 days"
                    trailing={<Badge tone="neutral">Contract</Badge>}
                  />
                  <DocumentListItem
                    icon="document"
                    title="ABC Solutions GmbH — Software License"
                    subtitle="€80,000 · expires in 75 days"
                    trailing={<Badge tone="info">License</Badge>}
                  />
                </div>
              </SectionCard>

              {/* 6 — Human-review queue */}
              <SectionCard
                title="Needs human review"
                action={
                  <Button variant="ghost" size="sm">
                    Open queue (12)
                  </Button>
                }
              >
                <div className="flex flex-col gap-4">
                  <div>
                    <ConfidenceThread
                      value={0.31}
                      level="low"
                      subject="Invoice INV-2026-0015 — amount extracted"
                    />
                    <p className="mt-1.5 text-body-m text-text-muted">
                      Please confirm — the total was handwritten.
                    </p>
                  </div>
                  <div>
                    <ConfidenceThread
                      value={0.64}
                      level="medium"
                      subject="Contract renewal — cancellation clause"
                    />
                    <p className="mt-1.5 text-body-m text-text-muted">
                      Please confirm the notice period — wording is ambiguous.
                    </p>
                  </div>
                </div>
              </SectionCard>
            </div>

            <div className="flex flex-col gap-4">
              {/* 7 — Workflow / automation status */}
              <SectionCard title="Workflow status">
                <div className="divide-y divide-border">
                  <DocumentListItem
                    icon="workflow"
                    title="Invoice processing"
                    subtitle="1,248 processed today · 92% high confidence · 104 human review"
                    trailing={<Badge tone="success">Active</Badge>}
                  />
                  <DocumentListItem
                    icon="workflow"
                    title="Contract review"
                    subtitle="38 in progress"
                    trailing={<Badge tone="success">Active</Badge>}
                  />
                  <DocumentListItem
                    icon="workflow"
                    title="Employee onboarding documents"
                    subtitle="Awaiting policy update"
                    trailing={<Badge tone="warning">Paused</Badge>}
                  />
                </div>
              </SectionCard>

              {/* 8 — Risk / compliance exceptions */}
              <SectionCard title="Risk &amp; compliance exceptions">
                <div className="divide-y divide-border">
                  <DocumentListItem
                    icon="shield"
                    title="3 duplicate document groups detected"
                    subtitle="Knowledge base — may cause conflicting records"
                    trailing={<Badge tone="warning">Review</Badge>}
                  />
                  <DocumentListItem
                    icon="shield"
                    title="2 unusual invoice patterns flagged"
                    subtitle="Finance — amounts outside normal range"
                    trailing={<Badge tone="critical">Investigate</Badge>}
                  />
                  <DocumentListItem
                    icon="shield"
                    title="4 compliance exceptions pending review"
                    subtitle="Retention policy — approaching deadline"
                    trailing={<Badge tone="warning">Review</Badge>}
                  />
                </div>
              </SectionCard>

              {/* 9 — Recent organizational activity */}
              <SectionCard title="Recent activity">
                <div className="flex flex-col gap-3">
                  {[
                    { who: "System", what: "Invoice INV-2026-0017 processed", when: "2 min ago" },
                    { who: "Ops Team", what: "Contract review completed", when: "15 min ago" },
                    { who: "Finance Team", what: "New document uploaded", when: "1 hour ago" },
                  ].map((a) => (
                    <div key={a.what} className="flex items-baseline gap-3 text-body-m">
                      <span className="w-24 shrink-0 font-mono text-data text-text-muted">
                        {a.when}
                      </span>
                      <span className="text-text-primary">{a.what}</span>
                      <span className="text-text-muted">— {a.who}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
