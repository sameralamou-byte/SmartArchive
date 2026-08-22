import type { ReactNode } from "react";
import { NavItem } from "./NavItem";
import type { IconName } from "../icons";

export interface EnterpriseNavEntry {
  key: string;
  icon: IconName;
  label: string;
  href?: string;
}

export interface EnterpriseSidebarProps {
  items: EnterpriseNavEntry[];
  activeKey: string;
  onNavigate?: (key: string) => void;
  /** Content rendered above the nav list, e.g. a logo/org switcher. Desktop (lg+) only. */
  header?: ReactNode;
  className?: string;
}

/**
 * Persistent, dense sidebar — Enterprise's navigation structure (Weave
 * Foundation §E/§L). Responsive per the approved breakpoint rules: a
 * horizontal scrollable strip on mobile, an icon-only rail on tablet, the
 * full labeled sidebar from laptop up.
 */
export function EnterpriseSidebar({
  items,
  activeKey,
  onNavigate,
  header,
  className = "",
}: EnterpriseSidebarProps) {
  return (
    <nav
      aria-label="Primary"
      className={
        "flex shrink-0 gap-0.5 border-border bg-surface-recessed " +
        "flex-row overflow-x-auto border-b p-2 " +
        "lg:h-full lg:w-60 lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-e lg:p-3 " +
        className
      }
    >
      {header && <div className="mb-3 hidden lg:block">{header}</div>}
      {items.map((item) => (
        <NavItem
          key={item.key}
          icon={item.icon}
          label={item.label}
          active={item.key === activeKey}
          href={item.href ?? "#"}
          compactBelowLg
          onClick={(e) => {
            if (onNavigate) {
              e.preventDefault();
              onNavigate(item.key);
            }
          }}
        />
      ))}
    </nav>
  );
}
