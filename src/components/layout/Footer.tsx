import { Link } from "react-router-dom";
import { useI18n } from "../../i18n/I18nProvider";
import { Logo } from "./Logo";
import { Send } from "lucide-react";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-ink-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-ink-500">{t("footer.aboutText")}</p>
            <div className="mt-5 flex items-center gap-3">
              {["Twitter","Facebook","Instagram","LinkedIn"].map((s) => (
                <a key={s} href="#" aria-label={s} className="text-ink-400 hover:text-brand-600 transition-colors">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-ink-200 text-xs font-semibold uppercase">
                    {s[0]}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold text-ink-900">{t("footer.quickLinks")}</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/products" className="text-ink-500 hover:text-ink-900 transition-colors">
                  {t("nav.products")}
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-ink-500 hover:text-ink-900 transition-colors">
                  {t("nav.howItWorks")}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-ink-500 hover:text-ink-900 transition-colors">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link to="/announcements" className="text-ink-500 hover:text-ink-900 transition-colors">
                  {t("nav.announcements")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold text-ink-900">{t("footer.support")}</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/contact" className="text-ink-500 hover:text-ink-900 transition-colors">
                  {t("footer.contact")}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-ink-500 hover:text-ink-900 transition-colors">
                  {t("nav.faq")}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-ink-500 hover:text-ink-900 transition-colors">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-ink-500 hover:text-ink-900 transition-colors">
                  {t("footer.privacy")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="text-sm font-semibold text-ink-900">{t("footer.newsletter")}</h4>
            <p className="mt-2 text-sm text-ink-500">{t("footer.newsletterDesc")}</p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-4 flex flex-col gap-2 sm:flex-row"
            >
              <input
                type="email"
                placeholder={t("footer.emailPlaceholder")}
                className="h-10 flex-1 rounded-lg border border-ink-200 bg-white px-3 text-sm placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
              >
                <Send className="h-4 w-4" />
                {t("footer.subscribe")}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-ink-100 pt-6 sm:flex-row">
          <p className="text-xs text-ink-500">
            © {new Date().getFullYear()} R-Buffer. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-2 text-xs text-ink-500">
            <span>{t("footer.languages")}:</span>
            <span>English</span>
            <span>·</span>
            <span>دری</span>
            <span>·</span>
            <span>پښتو</span>
          </div>
        </div>
      </div>
    </footer>
  );
}