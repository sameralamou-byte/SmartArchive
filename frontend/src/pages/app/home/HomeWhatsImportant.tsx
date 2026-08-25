import type { Ref } from "react";

import { Button, Card, ThreadIndicator, WeaveNode } from "../../../components";
import { useLocale } from "../../../providers/LocaleProvider";

interface HomeWhatsImportantProps {
  nodeRef?: Ref<HTMLSpanElement>;
  onOpenUnderstand: () => void;
}

/**
 * Contextual tile beside the document — visually distinct from the Thread stepper.
 * Waiting state only until understanding is connected (Final Concept).
 */
export default function HomeWhatsImportant({ nodeRef, onOpenUnderstand }: HomeWhatsImportantProps) {
  const { t } = useLocale();

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex items-center gap-2">
        <WeaveNode ref={nodeRef} />
        <h3 className="font-display text-heading-3 font-bold text-text-primary">{t("app.home.whatsImportantTitle")}</h3>
      </div>
      <Card recessed elevation={1} className="p-4">
        <ThreadIndicator state="waiting" label={t("app.home.understandingPending")} />
        <p className="mt-3 text-body-m text-text-muted">{t("app.home.whatsImportantBody")}</p>
        <p className="mt-2 text-body-m text-text-secondary">{t("hsa.document.languageNote")}</p>
      </Card>
      <div className="rounded-md border border-border bg-surface-page p-4">
        <h4 className="font-display text-body-l font-bold text-text-primary">{t("app.home.nextActionTitle")}</h4>
        <p className="mt-2 text-body-m text-text-muted">{t("app.home.nextActionWaiting")}</p>
        <Button type="button" size="sm" variant="secondary" className="mt-4" onClick={onOpenUnderstand}>
          {t("app.home.openUnderstand")}
        </Button>
      </div>
    </div>
  );
}
