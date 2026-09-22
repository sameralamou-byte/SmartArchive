import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { verifyEmail } from "../api/auth";
import { Alert, Button } from "../components";
import { useLocale } from "../providers/LocaleProvider";
import { HsaAuthLayout } from "./HsaAuthLayout";

type Status = "working" | "success" | "failure";

export default function VerifyEmail() {
  const { t } = useLocale();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token] = useState(() => searchParams.get("token"));
  const [status, setStatus] = useState<Status>("working");

  useEffect(() => {
    navigate("/verify-email", { replace: true });
    if (!token) {
      setStatus("failure");
      return;
    }
    let cancelled = false;
    verifyEmail(token)
      .then(() => {
        if (!cancelled) setStatus("success");
      })
      .catch(() => {
        if (!cancelled) setStatus("failure");
      });
    return () => {
      cancelled = true;
    };
  }, [navigate, token]);

  return (
    <HsaAuthLayout>
        {status === "working" && <p className="text-body-m text-text-muted">{t("app.loading")}</p>}
        {status === "success" && (
          <>
            <Alert tone="success">{t("app.verify.success")}</Alert>
            <Link to="/login" className="mt-6 block">
              <Button type="button" className="w-full">
                {t("app.verify.signIn")}
              </Button>
            </Link>
          </>
        )}
        {status === "failure" && (
          <>
            <Alert tone="critical">{t("app.verify.invalid")}</Alert>
            <p className="mt-4 text-body-m text-text-muted">
              <Link to="/register/check-email" className="text-accent no-underline hover:underline">
                {t("app.verify.resend")}
              </Link>
            </p>
            <p className="mt-2 text-body-m text-text-muted">
              <Link to="/login" className="text-accent no-underline hover:underline">
                {t("app.verify.signIn")}
              </Link>
            </p>
          </>
        )}
    </HsaAuthLayout>
  );
}
