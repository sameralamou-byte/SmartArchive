import { forwardRef, type ReactNode } from "react";

/**
 * Frozen HSA-08 C — Document Marginalia.
 * Marks one relevant source sentence and names why it matters.
 * Commentary only — never replaces the original wording.
 * The mark is the Thread origin.
 */
export interface DocumentMarginaliaProps {
  children: ReactNode;
  note: string;
  className?: string;
}

export const DocumentMarginalia = forwardRef<HTMLElement, DocumentMarginaliaProps>(
  function DocumentMarginalia({ children, note, className = "" }, ref) {
    return (
      <span className={className}>
        <mark
          ref={ref}
          data-hsa-thread-origin=""
          className="bg-transparent text-inherit underline decoration-info decoration-1 underline-offset-4"
        >
          {children}
        </mark>
        <span className="ms-2 align-middle text-caption text-info">{note}</span>
      </span>
    );
  },
);
