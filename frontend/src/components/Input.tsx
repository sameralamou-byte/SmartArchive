import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Icon or element placed at the logical start (left in LTR, right in RTL). */
  startAdornment?: ReactNode;
  /** Control placed at the logical end, inside the field (e.g. show/hide password). */
  endAdornment?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { startAdornment, endAdornment, className = "", ...rest },
  ref,
) {
  return (
    <div className="relative flex items-center">
      {startAdornment && (
        <span className="pointer-events-none absolute start-3 flex items-center text-text-muted">
          {startAdornment}
        </span>
      )}
      <input
        ref={ref}
        className={
          "w-full rounded-md border border-border bg-surface-page text-text-primary " +
          "font-body text-body-m placeholder:text-text-muted " +
          "py-2.5 px-3.5 focus-visible:outline focus-visible:outline-2 " +
          "focus-visible:outline-offset-[-1px] focus-visible:outline-accent " +
          (startAdornment ? "ps-9 " : "") +
          (endAdornment ? "pe-10 " : "") +
          className
        }
        {...rest}
      />
      {endAdornment && (
        <span className="absolute end-2 flex items-center text-text-muted">{endAdornment}</span>
      )}
    </div>
  );
});
