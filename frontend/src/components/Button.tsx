import { forwardRef, type ButtonHTMLAttributes } from "react";

/**
 * Buttons are the only fully-round element in the system — that's the tell
 * that something is an action, not a container (Weave Foundation §D/§F).
 */

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "sm";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-pill font-body font-bold " +
  "transition-colors duration-fast focus-visible:outline focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-hover disabled:bg-surface-recessed disabled:text-text-disabled",
  secondary:
    "bg-transparent border-[1.5px] border-accent text-accent hover:bg-accent-tint disabled:border-surface-recessed disabled:text-text-disabled",
  ghost:
    "bg-transparent text-accent underline underline-offset-2 hover:text-accent-hover disabled:text-text-disabled disabled:no-underline",
};

const SIZES: Record<ButtonSize, string> = {
  md: "px-5 py-2.5 text-body-m",
  sm: "px-3.5 py-1.5 text-caption",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className = "", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    />
  );
});
