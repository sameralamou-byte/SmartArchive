/** HSA three-dot mark — warmer Home identity, not the ESA A-arrow or weave constellation. */
export function HsaThreeDotMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 42 14" className={className} aria-hidden>
      <circle cx="7" cy="7" r="5" fill="#4C7AD8" />
      <circle cx="21" cy="7" r="5" fill="#7B6AD4" />
      <circle cx="35" cy="7" r="5" fill="#9A58C7" />
    </svg>
  );
}
