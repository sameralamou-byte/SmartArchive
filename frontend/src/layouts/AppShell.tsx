import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import { logoutAccount } from "../api/auth";
import { HomeRail, NavItem } from "../components";
import { useLocale } from "../providers/LocaleProvider";
import { useAuthStore } from "../store/authStore";

const PRIMARY_NAV = [
  { key: "home", to: "/app", icon: "spark" as const, labelKey: "app.nav.home" },
  { key: "documents", to: "/app/documents", icon: "document" as const, labelKey: "app.nav.documents" },
  { key: "understand", to: "/app/understand", icon: "search" as const, labelKey: "app.nav.understand" },
  { key: "reminders", to: "/app/reminders", icon: "workflow" as const, labelKey: "app.nav.reminders" },
];

function activeKey(pathname: string): string {
  if (pathname.startsWith("/app/documents")) return "documents";
  if (pathname.startsWith("/app/understand")) return "understand";
  if (pathname.startsWith("/app/reminders")) return "reminders";
  if (pathname.startsWith("/app/account")) return "account";
  if (pathname.startsWith("/app/settings")) return "settings";
  return "home";
}

export default function AppShell() {
  const { t } = useLocale();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const clear = useAuthStore((state) => state.clear);
  const [menuOpen, setMenuOpen] = useState(false);
  const current = activeKey(location.pathname);
  const archiveLabel = t("app.archiveLabel", { name: user?.full_name ?? "" });

  function go(to: string) {
    setMenuOpen(false);
    navigate(to);
  }

  async function logout() {
    setMenuOpen(false);
    try {
      await logoutAccount();
    } catch {
      /* still sign out locally */
    }
    clear();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-surface-page lg:flex">
      <nav
        aria-label={t("app.nav.primary")}
        className="hidden shrink-0 flex-col border-e border-border bg-surface-recessed p-3 lg:flex lg:w-60"
      >
        <div className="mb-4 px-2.5 pt-1">
          <p className="font-display text-body-l font-bold text-text-primary">{t("app.brand")}</p>
          <p className="truncate text-caption text-text-muted">{archiveLabel}</p>
        </div>
        {PRIMARY_NAV.map((item) => (
          <NavItem
            key={item.key}
            icon={item.icon}
            label={t(item.labelKey)}
            href={item.to}
            active={current === item.key}
            onClick={(event) => {
              event.preventDefault();
              go(item.to);
            }}
          />
        ))}
      </nav>

      <div className="flex min-w-0 flex-1 flex-col pb-24 lg:pb-0">
        <header className="flex items-center justify-between gap-3 border-b border-border bg-surface-card px-4 py-3 sm:px-6">
          <div className="min-w-0 lg:hidden">
            <p className="font-display text-body-l font-bold text-text-primary">{t("app.brand")}</p>
            <p className="truncate text-caption text-text-muted">{archiveLabel}</p>
          </div>
          <div className="relative ms-auto">
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              aria-label={t("app.header.accountMenu")}
              onClick={() => setMenuOpen((open) => !open)}
              className="rounded-sm px-2 py-1 text-end text-body-m font-bold text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span className="block leading-tight">{user?.full_name}</span>
              {user?.email ? (
                <span className="block text-caption font-normal text-text-muted">{user.email}</span>
              ) : null}
            </button>
            {menuOpen && (
              <div
                role="menu"
                className="absolute end-0 z-20 mt-1 w-44 rounded-md border border-border bg-surface-card p-1 shadow-2"
              >
                <Link
                  role="menuitem"
                  to="/app/account"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-sm px-3 py-2 text-body-m text-text-primary no-underline hover:bg-surface-recessed"
                >
                  {t("app.nav.account")}
                </Link>
                <Link
                  role="menuitem"
                  to="/app/settings"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-sm px-3 py-2 text-body-m text-text-primary no-underline hover:bg-surface-recessed"
                >
                  {t("app.nav.settings")}
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => void logout()}
                  className="block w-full rounded-sm px-3 py-2 text-start text-body-m text-text-primary hover:bg-surface-recessed"
                >
                  {t("app.nav.logout")}
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>

      <HomeRail
        className="fixed inset-x-0 bottom-0 lg:hidden"
        activeKey={current}
        onNavigate={(key) => {
          const item = PRIMARY_NAV.find((entry) => entry.key === key);
          if (item) go(item.to);
        }}
        items={PRIMARY_NAV.map((item) => ({
          key: item.key,
          icon: item.icon,
          label: t(item.labelKey),
          href: item.to,
        }))}
      />
    </div>
  );
}
