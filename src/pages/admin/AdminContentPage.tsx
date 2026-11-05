import { useEffect, useState } from "react";
import { useI18n } from "../../i18n/I18nProvider";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Textarea } from "../../components/ui/Input";
import { useToast } from "../../components/ui/Toast";
import { contentService } from "../../services/api";
import type { CmsContent } from "../../types";
import type { Locale } from "../../i18n/types";

export function AdminContentPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [items, setItems] = useState<CmsContent[]>([]);
  const [tab, setTab] = useState<Locale>("en");

  useEffect(() => {
    contentService.listContent().then(setItems);
  }, []);

  async function save(item: CmsContent) {
    await contentService.updateContent(item.id, item.value);
    toast(t("admin.success"), "success");
  }

  function update(item: CmsContent, value: string) {
    setItems((prev) => prev.map((c) => (c.id === item.id ? { ...c, value: { ...c.value, [tab]: value } } : c)));
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">{t("admin.content")}</h1>
        <p className="mt-1 text-sm text-ink-500">Manage website content in all three languages</p>
      </div>

      <div className="flex items-center gap-1 rounded-xl border border-ink-200 bg-white p-1">
        {(["en", "fa", "ps"] as Locale[]).map((l) => (
          <button
            key={l}
            onClick={() => setTab(l)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${tab === l ? "bg-brand-100 text-brand-700" : "text-ink-600 hover:bg-ink-100"}`}
          >
            {l === "en" ? "English" : l === "fa" ? "دری" : "پښتو"}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-ink-900">Content Items</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="space-y-2 rounded-xl border border-ink-100 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-ink-500">
                  <span className="font-medium text-ink-700">{item.page}</span> · {item.section} · {item.key}
                </div>
                <Button size="sm" variant="primary" onClick={() => save(item)}>
                  {t("admin.saveChanges")}
                </Button>
              </div>
              <Textarea value={item.value[tab]} onChange={(e) => update(item, e.target.value)} rows={3} />
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}