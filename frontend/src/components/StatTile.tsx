import type { ReactNode } from "react";

export type StatTone = "neutral" | "success" | "warning" | "critical";

export interface StatTileProps {
  label: string;
  value: string | number;
  /** e.g. "+12% this week" or "Requires attention" — context for the number, never the number alone. */
  sub?: ReactNode;
  tone?: StatTone;
  className?: string;
}

// Literal class strings only — see Card.tsx's note on why interpolated
// Tailwind class names silently fail to generate.
const SUB_TONE: Record<StatTone, string> = {
  neutral: "text-text-muted",
  success: "text-success",
  warning: "text-warning",
  critical: "text-critical",
};

/**
 * The one data primitive Home never needed — a glanceable operational
 * number. Every tile answers "what's happening," never decoration: always
 * label + value + one line of context, never a bare number (Weave Foundation
 * §I's "never a meaningless percentage" rule, generalized to any metric).
 */
export function StatTile({ label, value, sub, tone = "neutral", className = "" }: StatTileProps) {
  return (
    <div className={`rounded-md border border-border bg-surface-card p-4 shadow-1 ${className}`}>
      <p className="text-overline uppercase tracking-wide text-text-muted">{label}</p>
      <p className="mt-1 font-mono text-display-l font-bold tabular-nums text-text-primary">
        {value}
      </p>
      {sub && <p className={`mt-1 text-caption ${SUB_TONE[tone]}`}>{sub}</p>}
    </div>
  );
}
