import { forwardRef, type ButtonHTMLAttributes } from "react";

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { checked, onChange, label, className = "", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={
        "relative inline-flex h-[1.35rem] w-[2.4rem] shrink-0 rounded-pill transition-colors duration-fast " +
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent " +
        (checked ? "bg-accent " : "bg-surface-recessed ") +
        className
      }
      {...rest}
    >
      <span
        className={
          "absolute top-[0.15rem] h-[1.05rem] w-[1.05rem] rounded-full bg-surface-card transition-[inset-inline-start] duration-fast " +
          (checked ? "start-[calc(100%-1.2rem)]" : "start-[0.15rem]")
        }
      />
    </button>
  );
});
