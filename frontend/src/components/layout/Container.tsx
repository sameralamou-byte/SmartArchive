import type { HTMLAttributes } from "react";

export type ContainerWidth = "content" | "wide" | "full";

const WIDTHS: Record<ContainerWidth, string> = {
  content: "max-w-3xl",
  wide: "max-w-6xl",
  full: "max-w-none",
};

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  width?: ContainerWidth;
}

/** Responsive content container — mobile/tablet/laptop/desktop per Weave §L. */
export function Container({ width = "wide", className = "", ...rest }: ContainerProps) {
  return <div className={`mx-auto w-full ${WIDTHS[width]} px-4 sm:px-6 ${className}`} {...rest} />;
}
