import { Outlet } from "react-router-dom";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bell, CreditCard, LogOut, Menu, Package, Receipt, User, Wallet, X } from "lucide-react";
import { Button } from "../ui/Button";
import { LanguageSelector } from "../ui/LanguageSelector";
import { Logo } from "./Logo";
import { cn } from "../../utils/cn";
import { useI18n } from "../../i18n/I18nProvider";
import { authService } from "../../services/auth";
import { notificationService } from "../../services/api";
import type { Notification, User as AppUser } from "../../types";

export function DashboardLayout() {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [user, setUser] = useState<AppUser | null>(authService.getCurrentUser());
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Refresh the session user (credit changes) and notifications whenever the page changes
  useEffect(() => {
    setOpen(false);
    setNotifOpen(false);

    authService.me().then(setUser).catch(() => undefined);
    notificationService.listMine().then(setNotifications).catch(() => undefined);
  }, [location.pathname]);

  function logout() {
    authService.logout();
    navigate("/login");
  }

  const navItems = [
    { to: "/dashboard", icon: <Wallet className="h-4 w-4" />, label: t("nav.dashboard") },
    { to: "/products", icon: <Package className="h-4 w-4" />, label: t("nav.browseProducts") },
    { to: "/credit", icon: <CreditCard className="h-4 w-4" />, label: t("nav.credit") },
    { to: "/payment-requests", icon: <Receipt className="h-4 w-4" />, label: t("nav.paymentRequests") },
    { to: "/orders", icon: <Package className="h-4 w-4" />, label: t("nav.myOrders") },
    { to: "/notifications", icon: <Bell className="h-4 w-4" />, label: t("nav.notifications") },
    { to: "/profile", icon: <User className="h-4 w-4" />, label: t("nav.profile") },
  ];

  const unread = notifications.filter((n) => !n.read).length;
  const name = user?.fullName ?? "";

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      isActive ? "bg-brand-50 text-brand-700" : "text-ink-700 hover:bg-ink-100",
    );

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-4 border-b border-ink-100">
        <Logo />
        <button onClick={() => setOpen(false)} className="lg:hidden text-ink-500 hover:text-ink-900" aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={navLinkClass}>
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-ink-100 p-3">
        <div className="flex items-center gap-3 rounded-lg bg-ink-50 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-white font-semibold text-sm">
            {name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold text-ink-900">{name}</p>
            <p className="truncate text-xs text-ink-500">{user?.email}</p>
          </div>
          <button onClick={logout} className="text-ink-400 hover:text-red-600 transition-colors" aria-label={t("nav.logout")}>
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-ink-50">
      <aside className="hidden w-64 shrink-0 border-r border-ink-200 bg-white lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/50" onClick={() => setOpen(false)} />
          <aside className="absolute start-0 top-0 h-full w-72 max-w-[85vw] bg-white shadow-xl">{sidebar}</aside>
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-ink-200 bg-white text-ink-700 lg:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-base font-semibold text-ink-900 sm:text-lg">{t("nav.dashboard")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector compact />
            <div className="relative">
              <button onClick={() => setNotifOpen((s) => !s)} className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-ink-200 bg-white text-ink-700 hover:bg-ink-50" aria-label="Notifications">
                <Bell className="h-4 w-4" />
                {unread > 0 && (
                  <span className="absolute -top-1 -end-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {unread}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute end-0 top-full z-30 mt-2 w-80 max-w-[90vw] overflow-hidden rounded-xl border border-ink-200 bg-white shadow-lg fade-in">
                  <div className="border-b border-ink-100 px-4 py-3">
                    <h3 className="text-sm font-semibold text-ink-900">{t("notifications.title")}</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 && (
                      <p className="px-4 py-6 text-center text-sm text-ink-500">{t("notifications.noNotifications")}</p>
                    )}
                    {notifications.slice(0, 4).map((n) => (
                      <Link
                        key={n.id}
                        to="/notifications"
                        onClick={() => setNotifOpen(false)}
                        className="block border-b border-ink-100 px-4 py-3 hover:bg-ink-50 last:border-0"
                      >
                        <p className="text-sm font-medium text-ink-900">{n.title[locale]}</p>
                        <p className="mt-0.5 text-xs text-ink-500">{n.body[locale]}</p>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-ink-100 p-2">
                    <Link to="/notifications" onClick={() => setNotifOpen(false)} className="block rounded-md px-2 py-1.5 text-center text-sm font-medium text-brand-700 hover:bg-brand-50">
                      {t("dashboard.viewAll")}
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link to="/profile">
              <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-white font-semibold text-sm sm:flex">
                {name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
              </div>
            </Link>
            <Button variant="ghost" size="sm" leftIcon={<LogOut className="h-4 w-4" />} onClick={logout} className="hidden sm:inline-flex">
              {t("nav.logout")}
            </Button>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
