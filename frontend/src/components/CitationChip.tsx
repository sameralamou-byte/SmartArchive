import type { ReactNode } from "react";
import { ChipLink, type ChipLinkProps } from "./Chip";
import { useLocale } from "../providers/LocaleProvider";

export interface CitationChipProps extends Omit<ChipLinkProps, "children"> {
  /** e.g. "Clause 4.2, p.3" */
  children: ReactNode;
}

/**
 * Source traceability (Weave Foundation §J amendment): every AI-derived
 * statement gets one of these, jumping to and highlighting the exact source
 * location. The original document stays the record of truth — this chip is
 * how the AI's commentary points back to it, never replaces it.
 */
export function CitationChip({ children, className = "", ...rest }: CitationChipProps) {
  const { t } = useLocale();
  return (
    <ChipLink aria-label={`${t("citation.jumpTo")}: ${children}`} className={className} {...rest}>
      {children}
    </ChipLink>
  );
}
