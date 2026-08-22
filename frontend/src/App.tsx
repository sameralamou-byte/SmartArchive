import { useEffect, useState, type ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";

import { refreshSession } from "./api/auth";
import { LocaleProvider, useLocale } from "./providers/LocaleProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import AppRoutes from "./routes/AppRoutes";
import { useAuthStore } from "./store/authStore";

function SessionBootstrap({ children }: { children: ReactNode }) {
  const { t } = useLocale();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const [ready, setReady] = useState(Boolean(accessToken));

  useEffect(() => {
    if (accessToken) {
      setReady(true);
      return;
    }
    let cancelled = false;
    refreshSession()
      .then((token) => {
        if (!cancelled) setAccessToken(token);
      })
      .catch(() => {
        /* no persistent session */
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken, setAccessToken]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-page">
        <p className="text-body-m text-text-muted">{t("app.loading")}</p>
      </div>
    );
  }
  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <BrowserRouter>
          <SessionBootstrap>
            <AppRoutes />
          </SessionBootstrap>
        </BrowserRouter>
      </LocaleProvider>
    </ThemeProvider>
  );
}
