import type { HTMLAttributes, ReactNode } from "react";

/**
 * Source traceability layout primitive (Weave Foundation §J amendment): the
 * original document pane is always authoritative and always present — an AI
 * explanation panel is never allowed to occupy the full view without it.
 *
 * This is a layout shell only; it doesn't know about documents or AI models —
 * Home/Enterprise product screens fill in the actual content.
 */

export interface SourceTraceViewProps extends HTMLAttributes<HTMLDivElement> {
  /** The original document — rendered on the recessed "authoritative" surface. */
  document: ReactNode;
  /** The AI's commentary — rendered on the standard card surface, always adjacent, never covering the document. */
  explanation: ReactNode;
}

export function SourceTraceView({ document, explanation, className = "", ...rest }: SourceTraceViewProps) {
  return (
    <div className={`grid grid-cols-1 gap-4 overflow-visible md:grid-cols-2 ${className}`} {...rest}>
      <div className="overflow-visible rounded-md border border-border bg-surface-recessed p-4">{document}</div>
      <div className="overflow-visible rounded-md border border-border bg-surface-card p-4">{explanation}</div>
    </div>
  );
}
