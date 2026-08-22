import type { ReactNode } from "react";
import { Icon, type IconName } from "./icons";

export interface DocumentListItemProps {
  icon: IconName;
  title: string;
  subtitle?: string;
  /** A badge, date, or short action — whatever the row needs to communicate at a glance. */
  trailing?: ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * A calm document/attention row — the shared shape behind "Today" and
 * "Recent Documents" on Home. Deliberately plain: identity, one line of
 * context, one trailing fact. Not a data-table row — Enterprise's denser
 * equivalent is a separate concern, not this component stretched thinner.
 */
export function DocumentListItem({
  icon,
  title,
  subtitle,
  trailing,
  onClick,
  className = "",
}: DocumentListItemProps) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      type={onClick ? "button" : undefined}
      className={
        "flex w-full items-start gap-3 rounded-md py-3 text-start " +
        (onClick ? "hover:bg-surface-recessed transition-colors duration-fast " : "") +
        className
      }
    >
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-recessed text-text-secondary">
        <Icon name={icon} size={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-body-l font-bold text-text-primary">{title}</span>
        {subtitle && <span className="mt-0.5 block text-body-m text-text-muted">{subtitle}</span>}
      </span>
      {trailing && <span className="shrink-0 pt-1">{trailing}</span>}
    </Tag>
  );
}
