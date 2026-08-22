import { useLocale } from "../providers/LocaleProvider";

/**
 * A thread, not a generic progress bar — it fills toward a node, and it's
 * never shown without the label next to it. Reuses the semantic scale on
 * purpose: a low-confidence answer *is* a warning, not a separate visual
 * language (Weave Foundation §I).
 */

export type ConfidenceLevel = "high" | "medium" | "low";

export interface ConfidenceThreadProps {
  /** 0-1 */
  value: number;
  level: ConfidenceLevel;
  /** What was assessed, e.g. "Renewal date extracted". */
  subject: string;
  className?: string;
}

const LEVEL_COLOR: Record<ConfidenceLevel, string> = {
  high: "var(--success)",
  medium: "var(--warning)",
  low: "var(--critical)",
};

const LEVEL_LABEL_KEY: Record<ConfidenceLevel, string> = {
  high: "confidence.high",
  medium: "confidence.medium",
  low: "confidence.low",
};

export function ConfidenceThread({ value, level, subject, className = "" }: ConfidenceThreadProps) {
  const { t } = useLocale();
  const color = LEVEL_COLOR[level];
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between text-body-m">
        <span className="text-text-primary">{subject}</span>
        <span style={{ color }}>{t(LEVEL_LABEL_KEY[level])}</span>
      </div>
      <div
        className="relative h-[0.45rem] overflow-visible rounded-pill bg-surface-recessed"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={subject}
      >
        <div
          className="relative h-full rounded-pill"
          style={{ width: `${pct}%`, background: color }}
        >
          <span
            className="absolute end-[-3px] top-1/2 h-[0.7rem] w-[0.7rem] -translate-y-1/2 rounded-full"
            style={{ background: color, boxShadow: "0 0 0 3px var(--surface-card)" }}
          />
        </div>
      </div>
    </div>
  );
}
