/** SmartArchive weave symbol — shared across public pages and wordmark. */
export function WeaveMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <circle cx="16" cy="16" r="2.2" fill="var(--accent-2)" />
      <circle cx="16" cy="6" r="1.6" fill="var(--accent-2)" />
      <circle cx="26" cy="12" r="1.6" fill="var(--accent-2)" />
      <circle cx="24" cy="24" r="1.6" fill="var(--accent-2)" />
      <circle cx="8" cy="24" r="1.6" fill="var(--accent-2)" />
      <circle cx="6" cy="12" r="1.6" fill="var(--accent-2)" />
      <g stroke="var(--accent-2)" strokeWidth="1.1" opacity="0.85">
        <line x1="16" y1="16" x2="16" y2="7.4" />
        <line x1="16" y1="16" x2="25.2" y2="12.4" />
        <line x1="16" y1="16" x2="23.3" y2="22.9" />
        <line x1="16" y1="16" x2="8.7" y2="22.9" />
        <line x1="16" y1="16" x2="6.8" y2="12.4" />
      </g>
    </svg>
  );
}
