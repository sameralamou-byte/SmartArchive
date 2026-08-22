import { forwardRef, type InputHTMLAttributes } from "react";

export type CheckboxProps = InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className = "", ...rest },
  ref,
) {
  return (
    <span className="relative inline-flex h-5 w-5 shrink-0">
      <input
        ref={ref}
        type="checkbox"
        className={
          "peer h-5 w-5 shrink-0 appearance-none rounded-[5px] border-[1.5px] border-accent " +
          "bg-surface-card checked:bg-accent focus-visible:outline focus-visible:outline-2 " +
          "focus-visible:outline-offset-2 focus-visible:outline-accent cursor-pointer " +
          className
        }
        {...rest}
      />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--on-accent)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute inset-0 hidden h-5 w-5 p-[3px] peer-checked:block"
        aria-hidden
      >
        <path d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
});
