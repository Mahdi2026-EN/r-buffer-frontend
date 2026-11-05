import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { cn } from "../../utils/cn";

export function FaqPage() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(0);
  const items = [t("faq.q1"), t("faq.q2"), t("faq.q3"), t("faq.q4"), t("faq.q5")];
  const answers = [t("faq.a1"), t("faq.a2"), t("faq.a3"), t("faq.a4"), t("faq.a5")];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">{t("faq.title")}</h1>
        <p className="mt-3 text-base text-ink-500">{t("faq.subtitle")}</p>
      </div>

      <div className="mt-10 space-y-3">
        {items.map((q, i) => (
          <div key={i} className="rounded-xl border border-ink-200 bg-white">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between px-4 py-4 text-start"
            >
              <span className="text-sm font-semibold text-ink-900">{q}</span>
              <ChevronDown className={cn("h-4 w-4 text-ink-400 transition-transform", open === i && "rotate-180")} />
            </button>
            {open === i && <div className="border-t border-ink-100 px-4 py-4 text-sm text-ink-600">{answers[i]}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}