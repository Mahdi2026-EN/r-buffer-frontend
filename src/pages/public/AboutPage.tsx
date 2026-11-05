import { Heart, Lightbulb, ShieldCheck, Target } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { Card, CardBody } from "../../components/ui/Card";

export function AboutPage() {
  const { t } = useI18n();

  const values = [
    { icon: <ShieldCheck className="h-5 w-5" />, title: t("about.value1") },
    { icon: <Lightbulb className="h-5 w-5" />, title: t("about.value2") },
    { icon: <Heart className="h-5 w-5" />, title: t("about.value3") },
    { icon: <Target className="h-5 w-5" />, title: t("about.value4") },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">{t("about.title")}</h1>
        <p className="mt-3 text-base text-ink-500">{t("about.subtitle")}</p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <Card>
          <CardBody className="space-y-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <Target className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-ink-900">{t("about.missionTitle")}</h2>
            <p className="text-sm leading-relaxed text-ink-600">{t("about.missionText")}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="space-y-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Lightbulb className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-ink-900">{t("about.visionTitle")}</h2>
            <p className="text-sm leading-relaxed text-ink-600">{t("about.visionText")}</p>
          </CardBody>
        </Card>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold tracking-tight text-ink-900">{t("about.valuesTitle")}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {values.map((v, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-ink-200 bg-white p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                {v.icon}
              </div>
              <p className="text-sm font-medium text-ink-800">{v.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}