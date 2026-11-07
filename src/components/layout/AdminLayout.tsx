import { Outlet } from "react-router-dom";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Bell,
  ChevronDown,
  CreditCard,
  FileText,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  Tag,
  Users,
  X,
  Layers,
} from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "../../utils/cn";
import { useI18n } from "../../i18n/I18nProvider";
import { authService } from "../../services/auth";

export function AdminLayout() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  const navItems = [
    { to: "/admin", end: true, icon: <LayoutDashboard className="h-4 w-4" />, label: t("admin.dashboard") },
    { to: "/admin/users", icon: <Users className="h-4 w-4" />, label: t("admin.users") },
    { to: "/admin/registrations", icon: <UserPlusIcon />, label: t("admin.registrations") },
    { to: "/admin/payment-requests", icon: <CreditCard className="h-4 w-4" />, label: t("admin.paymentRequests") },
    { to: "/admin/credit", icon: <WalletIcon />, label: t("admin.credit") },
    { to: "/admin/products", icon: <Package className="h-4 w-4" />, label: t("admin.products") },
    { to: "/admin/categories", icon: <Tag className="h-4 w-4" />, label: t("admin.categories") },
    { to: "/admin/orders", icon: <ShoppingBag className="h-4 w-4" />, label: t("admin.orders") },
    { to: "/admin/content", icon: <Layers className="h-4 w-4" />, label: t("admin.content") },
    { to: "/admin/announcements", icon: <Bell className="h-4 w-4" />, label: t("admin.announcements") },
    { to: "/admin/reports", icon: <BarChart3 className="h-4 w-4" />, label: t("admin.reports") },
    { to: "/admin/settings", icon: <Settings className="h-4 w-4" />, label: t("admin.settings") },
  ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      isActive ? "bg-brand-50 text-brand-700" : "text-ink-700 hover:bg-ink-100",
    );

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-4 border-b border-ink-100">
        <Logo />
        <span className="ms-2 rounded-md bg-brand-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-700">
          Admin
        </span>
        <button onClick={() => setOpen(false)} className="ms-auto text-ink-500 hover:text-ink-900 lg:hidden" aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-ink-100 p-3">
        <Link to="/dashboard" className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-ink-500 hover:bg-ink-100">
          <FileText className="h-4 w-4" />
          Customer View
        </Link>
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
            <div className="hidden items-center gap-2 text-sm text-ink-500 sm:flex">
              <Globe className="h-4 w-4" />
              <span>{t("admin.dashboard")}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-ink-200 bg-white text-ink-700 hover:bg-ink-50" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </button>
            <div className="relative">
              <button onClick={() => setUserMenu((s) => !s)} className="inline-flex items-center gap-2 rounded-md border border-ink-200 bg-white px-2 py-1.5 text-sm font-medium text-ink-700 hover:bg-ink-50">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-white text-xs font-bold">SA</div>
                <span className="hidden sm:inline">Site Administrator</span>
                <ChevronDown className="h-3.5 w-3.5 text-ink-400" />
              </button>
              {userMenu && (
                <div className="absolute end-0 top-full z-30 mt-2 w-48 overflow-hidden rounded-lg border border-ink-200 bg-white shadow-lg fade-in">
                  <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-ink-700 hover:bg-ink-50" onClick={() => setUserMenu(false)}>
                    <Layers className="h-4 w-4" />
                    Customer view
                  </Link>
                  <Link to="/admin/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-ink-700 hover:bg-ink-50" onClick={() => setUserMenu(false)}>
                    <Settings className="h-4 w-4" />
                    {t("admin.settings")}
                  </Link>
                  <button onClick={() => { authService.logout(); navigate("/login"); }} className="flex w-full items-center gap-2 border-t border-ink-100 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="h-4 w-4" />
                    {t("nav.logout")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function UserPlusIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}