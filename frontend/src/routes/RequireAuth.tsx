import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { fetchCurrentUser } from "../api/auth";
import { getApiErrorMessage, isEmailNotVerified, isUnauthorized } from "../api/errors";
import { Alert } from "../components";
import { useLocale } from "../providers/LocaleProvider";
import { useAuthStore, type AuthUser } from "../store/authStore";

function toAuthUser(user: {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  email_verified: boolean;
}): AuthUser {
  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    is_active: user.is_active,
    email_verified: user.email_verified,
  };
}

export default function RequireAuth() {
  const { t } = useLocale();
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const clear = useAuthStore((state) => state.clear);
  const [loading, setLoading] = useState(Boolean(accessToken) && !user);
  const [error, setError] = useState<string | null>(null);
  const [blockedUnverified, setBlockedUnverified] = useState(false);

  useEffect(() => {
    if (!accessToken || user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchCurrentUser()
      .then((profile) => {
        if (cancelled) return;
        if (!profile.email_verified) {
          clear();
          setBlockedUnverified(true);
          return;
        }
        setUser(toAuthUser(profile));
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (isEmailNotVerified(err) || isUnauthorized(err)) {
          clear();
          setBlockedUnverified(isEmailNotVerified(err));
          return;
        }
        setError(getApiErrorMessage(err, t("app.networkError")));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken, user, setUser, clear, t]);

  if (blockedUnverified) {
    return <Navigate to="/login" replace />;
  }
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-page">
        <p className="text-body-m text-text-muted">{t("app.loading")}</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <Alert tone="critical">{error}</Alert>
      </div>
    );
  }
  if (!user || user.email_verified === false) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
