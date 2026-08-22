import type { ReactNode } from "react";
import { useLocale } from "../providers/LocaleProvider";

export interface AISuggestionProps {
  children: ReactNode;
  /** Optional citation chip or other trailing element (see CitationChip). */
  trailing?: ReactNode;
  className?: string;
}

/**
 * Human-authored content is the unmarked default (Weave Foundation §J).
 * AI-suggested content is the exception, and looks like one — a gold
 * thread-rule, never a chat-bubble-and-avatar.
 */
export function AISuggestion({ children, trailing, className = "" }: AISuggestionProps) {
  const { t } = useLocale();
  return (
    <div className={`border-s-[3px] border-accent-2 ps-3.5 ${className}`}>
      <span className="mb-1 flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-wide text-text-secondary">
        <span aria-hidden>●</span>
        {t("aiSuggestion.tag")}
      </span>
      <p className="text-body-m text-text-primary">
        {children}
        {trailing && <> {trailing}</>}
      </p>
    </div>
  );
}
