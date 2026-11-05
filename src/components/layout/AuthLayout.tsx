import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { LanguageSelector } from "../ui/LanguageSelector";
import { Logo } from "./Logo";
import { useI18n } from "../../i18n/I18nProvider";

export function AuthLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  const { t } = useI18n();
  return (
    <div className="flex min-h-screen flex-col bg-ink-50">
      <header className="flex h-16 items-center justify-between border-b border-ink-200 bg-white px-4 sm:px-6 lg:px-8">
        <Logo />
        <LanguageSelector compact />
      </header>
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-ink-900">{title}</h1>
              <p className="mt-2 text-sm text-ink-500">{subtitle}</p>
            </div>
            {children}
          </div>
          <p className="mt-6 text-center text-xs text-ink-500">
            © {new Date().getFullYear()} R-Buffer ·{" "}
            <Link to="/" className="hover:text-ink-900">
              {t("nav.home")}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}