import { Check, ChevronDown, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../utils/cn";
import { useI18n } from "../../i18n/I18nProvider";
import { LOCALES, type Locale } from "../../i18n/types";

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const current = LOCALES.find((l) => l.code === locale)!;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((s) => !s)}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white text-sm font-medium text-ink-700 transition-colors hover:bg-ink-50",
          compact ? "h-8 px-2.5" : "h-9 px-3",
        )}
        aria-label="Language"
      >
        <Globe className="h-4 w-4 text-ink-500" />
        <span>{current.native}</span>
        {!compact && <ChevronDown className="h-3.5 w-3.5 text-ink-400" />}
      </button>
      {open && (
        <div className="absolute end-0 top-full z-30 mt-2 w-48 overflow-hidden rounded-lg border border-ink-200 bg-white shadow-lg fade-in">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLocale(l.code as Locale);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between px-3 py-2.5 text-sm transition-colors hover:bg-ink-50",
                l.code === locale && "bg-brand-50 text-brand-700",
              )}
            >
              <span className="flex items-center gap-2">
                <span className="text-base">{l.flag}</span>
                <span>{l.native}</span>
                <span className="text-xs text-ink-400">{l.label}</span>
              </span>
              {l.code === locale && <Check className="h-4 w-4 text-brand-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}