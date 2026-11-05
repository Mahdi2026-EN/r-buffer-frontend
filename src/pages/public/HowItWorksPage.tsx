import { Lightbulb, ShieldCheck } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";

export function HowItWorksPage() {
  const { t } = useI18n();
  const steps = [
    { num: 1, title: t("howItWorks.step1Title"), desc: t("howItWorks.step1Desc") },
    { num: 2, title: t("howItWorks.step2Title"), desc: t("howItWorks.step2Desc") },
    { num: 3, title: t("howItWorks.step3Title"), desc: t("howItWorks.step3Desc") },
    { num: 4, title: t("howItWorks.step4Title"), desc: t("howItWorks.step4Desc") },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">{t("howItWorks.title")}</h1>
        <p className="mt-3 text-base text-ink-500">{t("howItWorks.subtitle")}</p>
      </div>

      <div className="mt-12 space-y-6">
        {steps.map((step) => (
          <div
            key={step.num}
            className="flex flex-col gap-4 rounded-2xl border border-ink-200 bg-white p-6 sm:flex-row sm:items-center"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white shadow">
              {step.num}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink-900">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-600">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-amber-800">
          <Lightbulb className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-amber-900">{t("howItWorks.tipTitle")}</h3>
          <p className="mt-1 text-sm leading-relaxed text-amber-800">{t("howItWorks.tipDesc")}</p>
        </div>
        <ShieldCheck className="hidden h-6 w-6 text-amber-400 sm:block" />
      </div>
    </div>
  );
}