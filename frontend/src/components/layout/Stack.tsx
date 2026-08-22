import type { HTMLAttributes } from "react";

export type StackGap = 1 | 2 | 3 | 4 | 6 | 8;

const GAP: Record<StackGap, string> = {
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  6: "gap-6",
  8: "gap-8",
};

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column";
  gap?: StackGap;
}

/** Lay out sibling elements with the 4px spacing scale — never per-element margins. */
export function Stack({ direction = "column", gap = 4, className = "", ...rest }: StackProps) {
  return (
    <div
      className={`flex ${direction === "row" ? "flex-row items-center" : "flex-col"} ${GAP[gap]} ${className}`}
      {...rest}
    />
  );
}
