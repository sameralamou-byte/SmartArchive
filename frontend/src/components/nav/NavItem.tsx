import type { AnchorHTMLAttributes } from "react";
import { Icon, type IconName } from "../icons";

export interface NavItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  icon: IconName;
  label: string;
  active?: boolean;
  /** Hide the label text below the lg breakpoint (EnterpriseSidebar's icon-only tablet rail). Label stays available to assistive tech via title/aria-label. */
  compactBelowLg?: boolean;
}

/**
 * Same active-state language everywhere it appears: a short copper thread
 * beside the current item, not a filled block (Weave Foundation §E).
 */
export function NavItem({
  icon,
  label,
  active = false,
  compactBelowLg = false,
  className = "",
  ...rest
}: NavItemProps) {
  return (
    <a
      aria-current={active ? "page" : undefined}
      title={compactBelowLg ? label : undefined}
      className={
        "relative flex shrink-0 items-center gap-2.5 rounded-sm px-2.5 py-2 text-body-m no-underline " +
        (active
          ? "bg-accent-tint font-bold text-accent-hover"
          : "text-text-secondary hover:bg-surface-recessed") +
        " " +
        className
      }
      {...rest}
    >
      {active && (
        <span
          aria-hidden
          className="absolute start-[-0.5rem] top-1/2 h-[1.1rem] w-[3px] -translate-y-1/2 rounded-sm bg-accent max-lg:hidden"
        />
      )}
      <Icon
        name={icon}
        size={20}
        variant={active ? "filled" : "outline"}
        className={active ? "text-accent" : undefined}
      />
      <span className={compactBelowLg ? "hidden lg:inline" : undefined}>{label}</span>
    </a>
  );
}
