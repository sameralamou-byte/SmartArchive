import { Icon, type IconName } from "../icons";

export interface HomeNavEntry {
  key: string;
  icon: IconName;
  label: string;
  href?: string;
}

export interface HomeRailProps {
  items: HomeNavEntry[];
  activeKey: string;
  onNavigate?: (key: string) => void;
  className?: string;
}

/**
 * A handful of destinations, large touch targets — Home's navigation
 * structure (Weave Foundation §E). Same icon language and active color as
 * EnterpriseSidebar, deliberately simpler shape.
 */
export function HomeRail({ items, activeKey, onNavigate, className = "" }: HomeRailProps) {
  return (
    <nav
      aria-label="Primary"
      className={`flex items-center justify-around border-t border-border bg-surface-card px-4 py-3 ${className}`}
    >
      {items.map((item) => {
        const active = item.key === activeKey;
        return (
          <a
            key={item.key}
            href={item.href ?? "#"}
            aria-current={active ? "page" : undefined}
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate(item.key);
              }
            }}
            className={
              "flex flex-col items-center gap-1 text-caption no-underline " +
              (active ? "text-accent font-bold" : "text-text-muted")
            }
          >
            <Icon name={item.icon} size={24} variant={active ? "filled" : "outline"} />
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
