import { useLocale } from "../providers/LocaleProvider";

/**
 * The one animation the brand owns, as a state machine — not a generic
 * infinite loop (Weave Foundation §M amendment). The thread means something
 * different in each state, and stops meaning it the moment the state changes.
 */

export type ThreadState = "processing" | "completion" | "waiting" | "error";

export interface ThreadIndicatorProps {
  state: ThreadState;
  /** Optional label override; defaults to a sensible per-state string. */
  label?: string;
  className?: string;
}

function ThreadGlyph({ state }: { state: ThreadState }) {
  if (state === "completion") {
    return (
      <svg width="52" height="14" viewBox="0 0 60 12" fill="none" aria-hidden>
        <path
          d="M2 8c8-8 12 8 20 0s12-8 20 0"
          stroke="var(--accent-2)"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <circle
          cx="42"
          cy="6"
          r={4}
          fill="var(--success)"
          className="motion-safe:animate-[thread-settle_0.5s_ease-out]"
          style={{ transformOrigin: "center" }}
        />
      </svg>
    );
  }
  if (state === "waiting") {
    return (
      <svg width="52" height="14" viewBox="0 0 60 12" fill="none" aria-hidden className="opacity-35">
        <path
          d="M2 8c8-8 12 8 20 0s12-8 20 0"
          stroke="var(--text-muted)"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (state === "error") {
    return (
      <svg width="52" height="14" viewBox="0 0 60 12" fill="none" aria-hidden>
        <path
          d="M2 8c8-8 12 8 20 0"
          stroke="var(--critical)"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <path d="M30 4l12 4" stroke="var(--critical)" strokeWidth={2} strokeLinecap="round" />
      </svg>
    );
  }
  // processing
  return (
    <svg width="52" height="14" viewBox="0 0 60 12" fill="none" aria-hidden>
      <path
        d="M2 8c8-8 12 8 20 0s12-8 20 0"
        stroke="var(--accent-2)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray={30}
        className="motion-safe:animate-[thread-dash_1.4s_linear_infinite]"
      />
    </svg>
  );
}

export function ThreadIndicator({ state, label, className = "" }: ThreadIndicatorProps) {
  const { t } = useLocale();
  const defaultLabel =
    state === "processing"
      ? t("thread.processing")
      : state === "waiting"
        ? t("thread.waiting")
        : state === "error"
          ? t("thread.error")
          : undefined;
  const text = label ?? defaultLabel;

  return (
    <div className={`flex items-center gap-2.5 text-body-m text-text-muted ${className}`}>
      <ThreadGlyph state={state} />
      {text && <span className={state === "error" ? "text-critical" : ""}>{text}</span>}
    </div>
  );
}
