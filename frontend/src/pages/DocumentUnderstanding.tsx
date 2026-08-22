import { useRef, useState } from "react";
import {
  AISuggestion,
  Alert,
  Button,
  CitationChip,
  ConfidenceThread,
  Container,
  DocumentMarginalia,
  LocaleSwitcher,
  SourceTraceView,
  WeaveNode,
  WeaveThread,
} from "../components";
import { useLocale } from "../providers/LocaleProvider";
import { useTheme } from "../providers/ThemeProvider";

/**
 * Demo original — German source text on purpose.
 * UI language and explanation language follow the selected locale.
 * The original is never translated or overwritten.
 */
const DEMO_ORIGINAL_PARAGRAPHS = [
  "Gemeinschaftshinweis (Demo)",
  "Bitte nehmen Sie am Nachbarschaftstreffen teil.",
  "Wir treffen uns im Gemeinschaftsraum.",
] as const;

const DEMO_ORIGINAL_POINT = "Bitte antworten Sie bis Freitag, den 23. Mai.";

/**
 * HSA-08 frozen storyline:
 * Document → Point → Explanation → Confidence → Suggested Action → Human Decision
 *
 * Dev/review surface — not production-promoted. No backend calls.
 */
export default function DocumentUnderstanding() {
  const { t } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const originalRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<HTMLElement>(null);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reminderSaved, setReminderSaved] = useState(false);

  function focusOriginal() {
    originalRef.current?.focus();
    originalRef.current?.scrollIntoView({ block: "nearest" });
  }

  function confirmReminder() {
    setReminderSaved(true);
    setConfirmOpen(false);
  }

  return (
    <div className="min-h-screen bg-surface-page">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface-card px-4 py-2 text-caption text-text-muted">
        <span>{t("hsa.demo.banner")}</span>
        <div className="flex flex-wrap items-center gap-2">
          <LocaleSwitcher />
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-sm px-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {theme === "light" ? t("hsa.qa.themeDark") : t("hsa.qa.themeLight")}
          </button>
        </div>
      </div>

      <main className="pb-12">
        <Container width="wide" className="py-8 sm:py-12">
          <h1 className="max-w-prose font-display text-display-l font-bold text-text-primary">
            {t("hsa.page.title")}
          </h1>
          <p className="mt-2 max-w-prose text-body-m text-text-muted">{t("hsa.document.languageNote")}</p>

          <div ref={frameRef} className="relative mt-8 overflow-visible">
            <WeaveThread frameRef={frameRef} originRef={originRef} nodeRef={nodeRef} />
            <SourceTraceView
              document={
                <article
                  ref={originalRef}
                  id="hsa-original-document"
                  lang="de"
                  tabIndex={-1}
                  className="min-w-0 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <h2 className="font-display text-heading-3 font-bold text-text-primary">
                    {t("hsa.document.originalLabel")}
                  </h2>
                  <div className="mt-3 space-y-3 font-body text-body-m leading-relaxed text-text-primary">
                    {DEMO_ORIGINAL_PARAGRAPHS.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    <p>
                      <DocumentMarginalia ref={originRef} note={t("hsa.marginalia.replyBy")}>
                        {DEMO_ORIGINAL_POINT}
                      </DocumentMarginalia>
                    </p>
                  </div>
                  <div className="mt-4">
                    <CitationChip
                      href="#hsa-original-document"
                      onClick={(event) => {
                        event.preventDefault();
                        focusOriginal();
                      }}
                    >
                      {t("hsa.document.viewOriginal")}
                    </CitationChip>
                  </div>
                </article>
              }
              explanation={
                <div className="flex min-w-0 flex-col gap-4">
                  <WeaveNode ref={nodeRef} />
                  <AISuggestion>{t("hsa.explanation.body")}</AISuggestion>
                  <ConfidenceThread level="high" value={0.8} subject={t("hsa.confidence.subject")} />

                  {!reminderSaved && !confirmOpen && (
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-fit max-w-full whitespace-normal"
                      onClick={() => setConfirmOpen(true)}
                    >
                      {t("hsa.action.addReminder")}
                    </Button>
                  )}

                  {confirmOpen && (
                    <div
                      role="dialog"
                      aria-modal="true"
                      aria-labelledby="hsa-confirm-title"
                      aria-describedby="hsa-confirm-prompt"
                      className="rounded-md border border-border bg-surface-recessed p-4"
                    >
                      <h3 id="hsa-confirm-title" className="font-display text-heading-3 font-bold text-text-primary">
                        {t("hsa.action.confirmTitle")}
                      </h3>
                      <p id="hsa-confirm-prompt" className="mt-2 text-body-m text-text-secondary">
                        {t("hsa.action.confirmPrompt")}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button type="button" onClick={confirmReminder}>
                          {t("hsa.action.confirm")}
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => setConfirmOpen(false)}>
                          {t("hsa.action.cancel")}
                        </Button>
                      </div>
                    </div>
                  )}

                  {reminderSaved && <Alert tone="success">{t("hsa.action.confirmed")}</Alert>}

                  <p className="text-body-m text-text-muted">{t("hsa.control.message")}</p>
                </div>
              }
            />
          </div>
        </Container>
      </main>
    </div>
  );
}
