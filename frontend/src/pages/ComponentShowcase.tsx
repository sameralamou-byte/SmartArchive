import { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Chip,
  CitationChip,
  AISuggestion,
  ConfidenceThread,
  Container,
  EnterpriseSidebar,
  HomeRail,
  Input,
  LocaleSwitcher,
  SourceTraceView,
  Stack,
  ThreadIndicator,
  Toggle,
  UnderstandBar,
  Icon,
} from "../components";
import { useLocale } from "../providers/LocaleProvider";
import { useTheme } from "../providers/ThemeProvider";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border py-8 first:border-t-0 first:pt-0">
      <h2 className="mb-4 font-display text-heading-2 font-bold">{title}</h2>
      {children}
    </section>
  );
}

export default function ComponentShowcase() {
  const { theme, toggleTheme } = useTheme();
  const { locale, dir } = useLocale();
  const [toggleOn, setToggleOn] = useState(true);
  const [alertVisible, setAlertVisible] = useState(true);

  return (
    <div className="min-h-screen bg-surface-page pb-16">
      <header className="sticky top-0 z-10 flex flex-col gap-3 border-b border-border bg-surface-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-mono text-overline uppercase tracking-wide text-text-muted">
            Weave · Core UI Components — QA harness
          </p>
          <p className="text-caption text-text-muted">theme={theme} · locale={locale} · dir={dir}</p>
        </div>
        <Stack direction="row" gap={2} className="flex-wrap">
          <LocaleSwitcher />
          <Button variant="secondary" size="sm" onClick={toggleTheme}>
            {theme === "light" ? "Dark mode" : "Light mode"}
          </Button>
        </Stack>
      </header>

      <Container width="wide" className="py-8">
        <Section title="Understand Bar — same component, two densities">
          <Stack gap={4}>
            <UnderstandBar
              density="home"
              onUpload={() => {}}
              onScan={() => {}}
              onVoice={() => {}}
            />
            <UnderstandBar density="enterprise" onUpload={() => {}} onVoice={() => {}} />
          </Stack>
        </Section>

        <Section title="Buttons, inputs & controls">
          <Card>
            <Stack direction="row" gap={3} className="mb-4 flex-wrap">
              <Button>Ask SmartArchive</Button>
              <Button variant="secondary">Translate document</Button>
              <Button variant="ghost">Explain more</Button>
              <Button disabled>Processing…</Button>
            </Stack>
            <Stack direction="row" gap={4} className="flex-wrap">
              <Input placeholder="Ask anything…" startAdornment={<Icon name="search" size={16} />} className="max-w-xs" />
              <Toggle checked={toggleOn} onChange={setToggleOn} label="Notifications" />
              <Checkbox aria-label="Accept" defaultChecked />
            </Stack>
          </Card>
        </Section>

        <Section title="Cards, badges & chips">
          <Stack direction="row" gap={4} className="flex-wrap items-start">
            <Card className="w-64">
              <p className="text-overline uppercase tracking-wide text-text-muted">Contract</p>
              <p className="mt-1 font-bold text-text-primary">Siemens Service Agreement 2024</p>
              <p className="mt-1 text-caption text-text-muted">€450,000 · expires in 45 days</p>
              <Badge tone="warning" className="mt-3">Expiring soon</Badge>
            </Card>
            <Stack gap={2}>
              <Stack direction="row" gap={2}>
                <Badge tone="success">Verified</Badge>
                <Badge tone="warning">Needs attention</Badge>
                <Badge tone="critical">Overdue</Badge>
                <Badge tone="info">Info</Badge>
              </Stack>
              <Chip>Contracts</Chip>
            </Stack>
          </Stack>
        </Section>

        <Section title="Icon system — outline default, filled active">
          <Stack direction="row" gap={3}>
            <Icon name="search" />
            <Icon name="document" />
            <Icon name="spark" variant="filled" className="text-accent" />
            <Icon name="workflow" />
            <Icon name="shield" />
          </Stack>
        </Section>

        <Section title="Confidence visualization">
          <Card>
            <Stack gap={4}>
              <ConfidenceThread value={0.92} level="high" subject="Renewal date extracted" />
              <ConfidenceThread value={0.61} level="medium" subject="Vendor match" />
              <ConfidenceThread value={0.28} level="low" subject="Clause interpretation" />
            </Stack>
          </Card>
        </Section>

        <Section title="AI-suggested treatment & source traceability">
          <Card className="mb-4">
            <p className="mb-3 text-body-m">Rental contract renewed 5 Jun 2026, signed by both parties.</p>
            <AISuggestion trailing={<CitationChip href="#src">Clause 4.2, p.3</CitationChip>}>
              This renewal date is 21 days out — want a reminder set automatically?
            </AISuggestion>
            <ThreadIndicator state="processing" className="mt-4" />
          </Card>
          <SourceTraceView
            document={
              <>
                <p className="text-overline uppercase tracking-wide text-text-muted">Original document — authoritative</p>
                <p className="mt-2 font-bold">2. Term</p>
                <p className="mt-1 text-caption text-text-muted">
                  The term of this Agreement shall commence on January 1, 2024 and continue until{" "}
                  <span className="rounded-sm bg-accent-tint px-1">December 31, 2026, per Clause 4.2</span>.
                </p>
              </>
            }
            explanation={
              <>
                <p className="text-overline uppercase tracking-wide text-text-muted">AI explanation — commentary</p>
                <p className="mt-2 text-body-m">This agreement renews annually unless cancelled 90 days before term end.</p>
                <CitationChip href="#src" className="mt-3">Jump to Clause 4.2, p.3 →</CitationChip>
              </>
            }
          />
        </Section>

        <Section title="Thread states (motion)">
          <Stack direction="row" gap={6} className="flex-wrap">
            <ThreadIndicator state="processing" />
            <ThreadIndicator state="completion" label="Done" />
            <ThreadIndicator state="waiting" />
            <ThreadIndicator state="error" />
          </Stack>
        </Section>

        <Section title="Alerts">
          {alertVisible && (
            <Alert tone="critical" onDismiss={() => setAlertVisible(false)} className="mb-3">
              Upload failed — the file exceeds the 50MB limit.
            </Alert>
          )}
          <Alert tone="success">Document verified and archived.</Alert>
        </Section>

        <Section title="Navigation">
          <Stack direction="row" gap={4} className="flex-wrap items-start">
            <div className="h-64 overflow-hidden rounded-md border border-border">
              <EnterpriseSidebar
                activeKey="knowledge"
                items={[
                  { key: "overview", icon: "workflow", label: "Overview" },
                  { key: "knowledge", icon: "search", label: "Knowledge" },
                  { key: "workflows", icon: "workflow", label: "Workflows" },
                  { key: "governance", icon: "shield", label: "Governance" },
                ]}
              />
            </div>
            <div className="w-72 overflow-hidden rounded-md border border-border">
              <HomeRail
                activeKey="home"
                items={[
                  { key: "home", icon: "document", label: "Home" },
                  { key: "documents", icon: "document", label: "Documents" },
                  { key: "timeline", icon: "workflow", label: "Timeline" },
                ]}
              />
            </div>
          </Stack>
        </Section>
      </Container>
    </div>
  );
}
