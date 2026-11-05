import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Locale, TranslationTree } from "./types";
import { LOCALES } from "./types";
import { translations } from "./translations";

type I18nContextType = {
  locale: Locale;
  dir: "ltr" | "rtl";
  setLocale: (locale: Locale) => void;
  t: (key: string, fallback?: string) => string;
};

const I18nContext = createContext<I18nContextType | null>(null);

function getByPath(tree: TranslationTree, path: string): string | undefined {
  const parts = path.split(".");
  let current: string | TranslationTree | undefined = tree;
  for (const p of parts) {
    if (typeof current !== "object" || current === null) return undefined;
    current = (current as TranslationTree)[p];
  }
  return typeof current === "string" ? current : undefined;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("rbuffer-locale") : null;
    if (stored === "en" || stored === "fa" || stored === "ps") return stored;
    return "en";
  });

  const dir = useMemo(() => LOCALES.find((l) => l.code === locale)?.dir ?? "ltr", [locale]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    window.localStorage.setItem("rbuffer-locale", locale);
  }, [locale, dir]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
  }, []);

  const t = useCallback(
    (key: string, fallback?: string) => {
      const tree = translations[locale];
      const found = getByPath(tree, key);
      if (found) return found;
      // fallback to English
      const en = getByPath(translations.en, key);
      if (en) return en;
      return fallback ?? key;
    },
    [locale],
  );

  const value = useMemo(() => ({ locale, dir, setLocale, t }), [locale, dir, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}