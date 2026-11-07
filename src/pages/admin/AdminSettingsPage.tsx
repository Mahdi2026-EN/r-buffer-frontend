import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Input";
import { cn } from "../../utils/cn";
import { useToast } from "../../components/ui/Toast";
import type { Locale } from "../../i18n/types";
import { settingsService } from "../../services/api";
import { ApiError } from "../../services/http";

type Tab = "general" | "localization" | "appearance" | "system";

export function AdminSettingsPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("general");
  const [general, setGeneral] = useState({ siteName: "", email: "", phone: "" });
  const [loc, setLoc] = useState<{ default: Locale; supported: Locale[] }>({ default: "en", supported: ["en", "fa", "ps"] });
  const [appearance, setAppearance] = useState<{ theme: "light" | "dark" | "auto" }>({ theme: "light" });
  const [system, setSystem] = useState({ notifications: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    settingsService.get().then((s) => {
      setGeneral({ siteName: s.siteName, email: s.contactEmail, phone: s.contactPhone });
      setLoc({ default: s.defaultLanguage, supported: s.supportedLanguages });
      setAppearance({ theme: s.theme });
      setSystem({ notifications: s.enableNotifications });
    }).catch(() => undefined);
  }, []);

  async function save() {
    setSaving(true);
    try {
      await settingsService.update({
        siteName: general.siteName,
        contactEmail: general.email,
        contactPhone: general.phone,
        defaultLanguage: loc.default,
        supportedLanguages: loc.supported,
        theme: appearance.theme,
        enableNotifications: system.notifications,
      });
      toast(t("admin.success"), "success");
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "Could not save the settings.", "error");
    } finally {
      setSaving(false);
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "general", label: t("admin.settingsTab.general") },
    { key: "localization", label: t("admin.settingsTab.localization") },
    { key: "appearance", label: t("admin.settingsTab.appearance") },
    { key: "system", label: t("admin.settingsTab.system") },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">{t("admin.settings")}</h1>
        <p className="mt-1 text-sm text-ink-500">Configure platform settings</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <nav className="space-y-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-start text-sm font-medium transition-colors",
                  tab === t.key ? "bg-brand-50 text-brand-700" : "text-ink-700 hover:bg-ink-100",
                )}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="lg:col-span-9">
          {tab === "general" && (
            <Card>
              <CardHeader><h2 className="text-base font-semibold text-ink-900">{t("admin.settingsTab.general")}</h2></CardHeader>
              <CardBody className="space-y-4">
                <Input label={t("admin.settingsTab.siteName")} value={general.siteName} onChange={(e) => setGeneral({ ...general, siteName: e.target.value })} />
                <Input label="Email" type="email" value={general.email} onChange={(e) => setGeneral({ ...general, email: e.target.value })} />
                <Input label="Phone" value={general.phone} onChange={(e) => setGeneral({ ...general, phone: e.target.value })} />
                <Button variant="primary" size="md" leftIcon={<Save className="h-4 w-4" />} onClick={save} loading={saving}>{t("admin.settingsTab.saveBtn")}</Button>
              </CardBody>
            </Card>
          )}

          {tab === "localization" && (
            <Card>
              <CardHeader><h2 className="text-base font-semibold text-ink-900">{t("admin.settingsTab.localization")}</h2></CardHeader>
              <CardBody className="space-y-4">
                <Select
                  label={t("admin.settingsTab.defaultLanguage")}
                  value={loc.default}
                  onChange={(e) => setLoc({ ...loc, default: e.target.value as Locale })}
                  options={[
                    { value: "en", label: "English" },
                    { value: "fa", label: "دری" },
                    { value: "ps", label: "پښتو" },
                  ]}
                />
                <div>
                  <p className="block text-sm font-medium text-ink-700">{t("admin.settingsTab.supportedLanguages")}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(["en", "fa", "ps"] as Locale[]).map((l) => (
                      <button
                        key={l}
                        onClick={() =>
                          setLoc({
                            ...loc,
                            supported: loc.supported.includes(l) ? loc.supported.filter((x) => x !== l) : [...loc.supported, l],
                          })
                        }
                        className={cn(
                          "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                          loc.supported.includes(l)
                            ? "border-brand-300 bg-brand-50 text-brand-700"
                            : "border-ink-200 bg-white text-ink-600",
                        )}
                      >
                        {l === "en" ? "English" : l === "fa" ? "دری" : "پښتو"}
                      </button>
                    ))}
                  </div>
                </div>
                <Button variant="primary" size="md" leftIcon={<Save className="h-4 w-4" />} onClick={save}>{t("admin.settingsTab.saveBtn")}</Button>
              </CardBody>
            </Card>
          )}

          {tab === "appearance" && (
            <Card>
              <CardHeader><h2 className="text-base font-semibold text-ink-900">{t("admin.settingsTab.appearance")}</h2></CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <p className="block text-sm font-medium text-ink-700">{t("admin.settingsTab.theme")}</p>
                  <div className="mt-2 flex gap-2">
                    {(["light", "dark", "auto"] as const).map((th) => (
                      <button
                        key={th}
                        onClick={() => setAppearance({ theme: th })}
                        className={cn(
                          "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                          appearance.theme === th ? "border-brand-300 bg-brand-50 text-brand-700" : "border-ink-200 bg-white text-ink-600",
                        )}
                      >
                        {th === "light" ? t("admin.settingsTab.light") : th === "dark" ? t("admin.settingsTab.dark") : t("admin.settingsTab.auto")}
                      </button>
                    ))}
                  </div>
                </div>
                <Button variant="primary" size="md" leftIcon={<Save className="h-4 w-4" />} onClick={save}>{t("admin.settingsTab.saveBtn")}</Button>
              </CardBody>
            </Card>
          )}

          {tab === "system" && (
            <Card>
              <CardHeader><h2 className="text-base font-semibold text-ink-900">{t("admin.settingsTab.system")}</h2></CardHeader>
              <CardBody className="space-y-4">
                <label className="flex items-center justify-between rounded-lg border border-ink-200 bg-white p-4">
                  <div>
                    <p className="text-sm font-medium text-ink-900">{t("admin.settingsTab.notifications")}</p>
                    <p className="text-xs text-ink-500">Enable system notifications</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSystem({ ...system, notifications: !system.notifications })}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      system.notifications ? "bg-brand-600" : "bg-ink-200",
                    )}
                  >
                    <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform", system.notifications ? "translate-x-6 rtl:-translate-x-6" : "translate-x-1 rtl:-translate-x-1")} />
                  </button>
                </label>
                <Button variant="primary" size="md" leftIcon={<Save className="h-4 w-4" />} onClick={save}>{t("admin.settingsTab.saveBtn")}</Button>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
