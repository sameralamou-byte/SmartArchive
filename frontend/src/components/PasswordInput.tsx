import { useState } from "react";

import { Input, type InputProps } from "./Input";
import { Icon } from "./icons";
import { useLocale } from "../providers/LocaleProvider";

export type PasswordInputProps = Omit<InputProps, "type" | "endAdornment">;

export function PasswordInput(props: PasswordInputProps) {
  const { t } = useLocale();
  const [visible, setVisible] = useState(false);

  return (
    <Input
      {...props}
      type={visible ? "text" : "password"}
      endAdornment={
        <button
          type="button"
          aria-label={visible ? t("app.password.hide") : t("app.password.show")}
          aria-pressed={visible}
          className={
            "flex items-center rounded-md p-1 text-text-muted outline-none " +
            "hover:text-text-secondary " +
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
            "focus-visible:outline-accent"
          }
          onClick={() => setVisible((current) => !current)}
        >
          <Icon name={visible ? "eyeOff" : "eye"} size={20} />
        </button>
      }
    />
  );
}
