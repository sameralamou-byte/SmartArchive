import type { HTMLAttributes } from "react";

export type BadgeTone = "success" | "warning" | "critical" | "info" | "neutral";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

// Semantic color, kept separate from the brand accent (Weave Foundation §B) —
// literal class strings only, see Card.tsx's note on why.
const TONES: Record<BadgeTone, string> = {
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  critical: "bg-critical-bg text-critical",
  info: "bg-info-bg text-info",
  neutral: "bg-accent-2-tint text-text-secondary",
};

export function Badge({ tone = "neutral", className = "", ...rest }: BadgeProps) {
  return (
    <span
      className={
        `inline-flex items-center rounded-pill px-2.5 py-1 text-caption font-bold ${TONES[tone]} ` +
        className
      }
      {...rest}
    />
  );
}
