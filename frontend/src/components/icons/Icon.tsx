import type { SVGProps } from "react";

/**
 * Weave icon system — 24px grid, 1.75px stroke, round caps/joins, single
 * continuous line wherever the glyph allows.
 *
 * Resting icons are neutral ink (text-secondary), not colored. Filled copper
 * is reserved for "this is selected" — pass variant="filled" for that state,
 * never as the default.
 */

export type IconName =
  | "search"
  | "document"
  | "spark"
  | "workflow"
  | "shield"
  | "upload"
  | "scan"
  | "voice"
  | "eye"
  | "eyeOff"
  | "users"
  | "lightbulb"
  | "chart";

export type IconVariant = "outline" | "filled";
export type IconSize = 16 | 20 | 24 | 32;

const PATHS: Record<IconName, string> = {
  search: "M10.5 16.5a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM15 15l5 5",
  document: "M6 3h8l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM14 3v5h5",
  spark: "M12 3l1.8 4.8L18.6 9.6 13.8 11.4 12 16.2 10.2 11.4 5.4 9.6 10.2 7.8Z",
  workflow: "M4 12c3-6 6 6 9 0s5-4 7-2",
  shield:
    "M12 3c4 1.5 7 1.5 7 1.5v6.5c0 5-3 8-7 9.5-4-1.5-7-4.5-7-9.5V4.5S8 4.5 12 3Z",
  upload: "M12 16V4M7 9l5-5 5 5M5 20h14",
  scan: "M3 6h18M3 6v13h18V6M3 6l4-3h10l4 3",
  voice: "M9 3h6a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3ZM5 11a7 7 0 0 0 14 0M12 18v3",
  eye: "M2.5 12s3.6-6.5 9.5-6.5S21.5 12 21.5 12 17.9 18.5 12 18.5 2.5 12 2.5 12ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  eyeOff:
    "M4 4l16 16M9.9 9.9A3 3 0 0 0 14 14.1M6.1 6.5C4.2 7.9 2.5 12 2.5 12S6.1 18.5 12 18.5c1.5 0 2.9-.4 4.1-1M9.2 5.4A10.4 10.4 0 0 1 12 5.5c5.9 0 9.5 6.5 9.5 6.5a17.6 17.6 0 0 1-3.2 3.9",
  users:
    "M8.5 11a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4ZM3.2 19.6c0-3 2.4-5.4 5.3-5.4h0c2.9 0 5.3 2.4 5.3 5.4M16.6 10.8a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2ZM14.4 14.4c2.6.3 4.6 2.4 4.6 5.2",
  lightbulb:
    "M9 18h6M10 21h4M8.4 14.1A5.4 5.4 0 1 1 15.6 14.1C15.6 15.8 14.1 16.7 14 18H10C9.9 16.7 8.4 15.8 8.4 14.1Z",
  chart: "M4 20V5M4 20h16M8 20v-6M12 20V8M16 20v-9",
};

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  variant?: IconVariant;
  size?: IconSize;
  /** Accessible label. Omit (default) when the icon sits beside visible text — it stays decorative. */
  label?: string;
}

export function Icon({
  name,
  variant = "outline",
  size = 20,
  label,
  className,
  ...rest
}: IconProps) {
  const filled = variant === "filled";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
