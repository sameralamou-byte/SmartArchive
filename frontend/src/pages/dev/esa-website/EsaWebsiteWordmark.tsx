import { ESA_MARK } from "./esaWebsiteAssets";

/**
 * ESA marketing wordmark recovered from the Founder-approved Solutions
 * reference (geometric A-arrow + SmartArchive ESA + tagline).
 * Mark asset is cropped from that approved artwork — not a new logo.
 */
export function EsaWebsiteWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img src={ESA_MARK} alt="" width={36} height={34} className="h-9 w-9 object-contain" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-body-l font-bold tracking-tight">
          <span className="text-[color:var(--esa-mkt-text)]">SmartArchive</span>{" "}
          <span className="text-accent">ESA</span>
        </span>
        <span className="mt-1 text-[10px] font-medium tracking-[0.02em] text-[color:var(--esa-mkt-text-muted)]">
          Enterprise Document Intelligence
        </span>
      </span>
    </span>
  );
}
