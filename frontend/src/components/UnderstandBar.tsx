import { type InputHTMLAttributes, forwardRef } from "react";
import { Icon } from "./icons";
import { useLocale } from "../providers/LocaleProvider";

export type UnderstandBarDensity = "home" | "enterprise";

export interface UnderstandBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  density: UnderstandBarDensity;
  onUpload?: () => void;
  onScan?: () => void;
  onVoice?: () => void;
}

/**
 * One component, not two (Weave Foundation §F amendment). "Ask SmartArchive
 * anything" on Home and "Universal Knowledge Search" on Enterprise are the
 * same underlying action wearing the §K density rules — same pill shape,
 * same leading spark, same input methods, same focus ring.
 */
export const UnderstandBar = forwardRef<HTMLInputElement, UnderstandBarProps>(function UnderstandBar(
  { density, onUpload, onScan, onVoice, className = "", placeholder, ...rest },
  ref,
) {
  const { t } = useLocale();
  const isHome = density === "home";
  const resolvedPlaceholder =
    placeholder ?? t(isHome ? "understandBar.home.placeholder" : "understandBar.enterprise.placeholder");

  return (
    <div
      className={
        "flex w-full items-center gap-2.5 rounded-pill border-[1.5px] border-border bg-surface-card shadow-1 " +
        "focus-within:border-accent focus-within:outline focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-accent " +
        (isHome ? "max-w-lg px-5 py-3.5 " : "max-w-md px-4 py-2 ") +
        className
      }
    >
      <span
        className={
          "flex shrink-0 items-center justify-center rounded-full bg-accent-tint text-accent " +
          (isHome ? "h-9 w-9" : "h-7 w-7")
        }
      >
        <Icon name="spark" size={isHome ? 20 : 16} />
      </span>
      <input
        ref={ref}
        type="text"
        placeholder={resolvedPlaceholder}
        className={
          "min-w-0 flex-1 bg-transparent font-body text-text-primary placeholder:text-text-muted focus:outline-none " +
          (isHome ? "text-body-l" : "text-body-m")
        }
        {...rest}
      />
      <span className="flex shrink-0 items-center gap-2.5 text-text-secondary">
        {onUpload && (
          <button type="button" onClick={onUpload} aria-label={t("understandBar.upload")}>
            <Icon name="upload" size={isHome ? 20 : 16} />
          </button>
        )}
        {isHome && onScan && (
          <button type="button" onClick={onScan} aria-label={t("understandBar.scan")}>
            <Icon name="scan" size={20} />
          </button>
        )}
        {onVoice && (
          <button type="button" onClick={onVoice} aria-label={t("understandBar.voice")}>
            <Icon name="voice" size={isHome ? 20 : 16} />
          </button>
        )}
      </span>
    </div>
  );
});
