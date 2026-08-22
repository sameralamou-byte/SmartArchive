import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from "react";

const CHIP_CLASSES =
  "inline-flex items-center gap-1.5 rounded-pill bg-accent-tint px-2.5 py-1 text-caption " +
  "font-bold font-mono text-accent no-underline transition-colors duration-fast " +
  "hover:bg-accent hover:text-on-accent focus-visible:outline focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-accent";

export type ChipButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
export type ChipLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

/** Generic pill chip — the base the CitationChip (see CitationChip.tsx) is built from. */
export const Chip = forwardRef<HTMLButtonElement, ChipButtonProps>(function Chip(
  { className = "", ...rest },
  ref,
) {
  return <button ref={ref} type="button" className={`${CHIP_CLASSES} ${className}`} {...rest} />;
});

export const ChipLink = forwardRef<HTMLAnchorElement, ChipLinkProps>(function ChipLink(
  { className = "", ...rest },
  ref,
) {
  return <a ref={ref} className={`${CHIP_CLASSES} ${className}`} {...rest} />;
});
