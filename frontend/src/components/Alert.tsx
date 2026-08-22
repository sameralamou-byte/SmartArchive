import type { HTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "./icons";
import { useLocale } from "../providers/LocaleProvider";

export type AlertTone = "success" | "warning" | "critical" | "info";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone: AlertTone;
  children: ReactNode;
  onDismiss?: () => void;
}

// Literal class strings only — see Card.tsx's note on why interpolated
// Tailwind class names silently fail to generate.
const TONE_CLASSES: Record<AlertTone, { bg: string; text: string; icon: IconName }> = {
  success: { bg: "bg-success-bg", text: "text-success", icon: "shield" },
  warning: { bg: "bg-warning-bg", text: "text-warning", icon: "shield" },
  critical: { bg: "bg-critical-bg", text: "text-critical", icon: "shield" },
  info: { bg: "bg-info-bg", text: "text-info", icon: "shield" },
};

export function Alert({ tone, children, onDismiss, className = "", ...rest }: AlertProps) {
  const { t } = useLocale();
  const { bg, text } = TONE_CLASSES[tone];
  return (
    <div
      role={tone === "critical" ? "alert" : "status"}
      className={`flex items-start gap-2.5 rounded-md ${bg} px-4 py-3 text-body-m ${text} ${className}`}
      {...rest}
    >
      <Icon name="shield" size={20} className="mt-0.5 shrink-0" />
      <div className="flex-1">{children}</div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={t("alert.dismiss")}
          className={`shrink-0 rounded-sm ${text} opacity-70 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}
        >
          ✕
        </button>
      )}
    </div>
  );
}
