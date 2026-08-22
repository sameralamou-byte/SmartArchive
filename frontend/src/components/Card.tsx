import type { HTMLAttributes } from "react";

export type CardElevation = 1 | 2 | 3;

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: CardElevation;
  /** Use the recessed surface (hover/inset panels) instead of the card surface. */
  recessed?: boolean;
}

// Tailwind's class scanner needs literal class strings — never interpolate
// utility names, or the generated CSS won't include them.
const ELEVATION: Record<CardElevation, string> = {
  1: "shadow-1",
  2: "shadow-2",
  3: "shadow-3",
};

export function Card({ elevation = 1, recessed = false, className = "", ...rest }: CardProps) {
  return (
    <div
      className={
        `rounded-md border border-border p-6 ${ELEVATION[elevation]} ` +
        (recessed ? "bg-surface-recessed " : "bg-surface-card ") +
        className
      }
      {...rest}
    />
  );
}
