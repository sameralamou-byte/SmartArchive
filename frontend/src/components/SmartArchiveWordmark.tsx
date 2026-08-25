import { WeaveMark } from "./WeaveMark";

export type WordmarkVariant = "light" | "dark";

export interface SmartArchiveWordmarkProps {
  /** light = petrol Smart on light surfaces; dark = cream Smart on dark surfaces */
  variant?: WordmarkVariant;
  showMark?: boolean;
  className?: string;
}

/**
 * Global SmartArchive wordmark — Smart always high-contrast; Archive stays gold.
 */
export function SmartArchiveWordmark({ variant = "light", showMark = false, className = "" }: SmartArchiveWordmarkProps) {
  const smartClass = variant === "dark" ? "text-esa-text" : "text-[color:var(--esa-surface)]";

  return (
    <span className={`inline-flex items-center gap-2 font-display text-body-l font-bold ${className}`}>
      {showMark ? <WeaveMark className="h-7 w-7 shrink-0" /> : null}
      <span>
        <span className={smartClass}>Smart</span>
        <span className="text-accent-2">Archive</span>
      </span>
    </span>
  );
}
