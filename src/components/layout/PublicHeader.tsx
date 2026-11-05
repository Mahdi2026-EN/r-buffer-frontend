import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/Button";
import { LanguageSelector } from "../ui/LanguageSelector";
import { Logo } from "./Logo";
import { useI18n } from "../../i18n/I18nProvider";
import { cn } from "../../utils/cn";

export function PublicHeader() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { to: "/", label: t("nav.home") },
    { to: "/products", label: t("nav.products") },
    { to: "/how-it-works", label: t("nav.howItWorks") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
    { to: "/faq", label: t("nav.faq") },
    { to: "/announcements", label: t("nav.announcements") },
  ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "px-3 py-2 text-sm font-medium transition-colors rounded-md",
      isActive ? "text-brand-700 bg-brand-50" : "text-ink-700 hover:text-ink-900 hover:bg-ink-50",
    );

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur transition-shadow",
        scrolled ? "border-ink-200 shadow-sm" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === "/"} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSelector />
          <Link to="/login">
            <Button variant="ghost" size="md">
              {t("nav.login")}
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="md">
              {t("nav.register")}
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSelector compact />
          <button
            onClick={() => setOpen((s) => !s)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-ink-200 bg-white text-ink-700"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink-100 bg-white lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === "/"} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-ink-100 pt-3">
              <Link to="/login">
                <Button variant="outline" size="md" fullWidth>
                  {t("nav.login")}
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="md" fullWidth>
                  {t("nav.register")}
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}