import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input, Select, Textarea } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { Badge } from "../../components/ui/Badge";
import { useToast } from "../../components/ui/Toast";
import { contentService } from "../../services/api";
import type { Announcement } from "../../types";
import type { Locale } from "../../i18n/types";

interface FormData {
  titleEn: string; titleFa: string; titlePs: string;
  bodyEn: string; bodyFa: string; bodyPs: string;
  language: Locale | "all"; published: boolean;
}
const blank: FormData = {
  titleEn: "", titleFa: "", titlePs: "",
  bodyEn: "", bodyFa: "", bodyPs: "",
  language: "all", published: true,
};

export function AdminAnnouncementsPage() {
  const { t, locale } = useI18n();
  const { toast } = useToast();
  const [items, setItems] = useState<Announcement[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState<FormData>(blank);
  const [del, setDel] = useState<Announcement | null>(null);

  useEffect(() => {
    contentService.listAnnouncements().then(setItems);
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(blank);
    setOpen(true);
  }
  function openEdit(a: Announcement) {
    setEditing(a);
    setForm({
      titleEn: a.title.en, titleFa: a.title.fa, titlePs: a.title.ps,
      bodyEn: a.body.en, bodyFa: a.body.fa, bodyPs: a.body.ps,
      language: a.language, published: a.published,
    });
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      title: { en: form.titleEn, fa: form.titleFa, ps: form.titlePs },
      body: { en: form.bodyEn, fa: form.bodyFa, ps: form.bodyPs },
      language: form.language,
      published: form.published,
    };
    if (editing) {
      const updated = await contentService.updateAnnouncement(editing.id, data);
      if (updated) {
        setItems((prev) => prev.map((a) => (a.id === editing.id ? updated : a)));
      }
    } else {
      const created = await contentService.createAnnouncement(data);
      setItems((prev) => [created, ...prev]);
    }
    setOpen(false);
    toast(t("admin.success"), "success");
  }

  async function doDelete() {
    if (!del) return;
    await contentService.deleteAnnouncement(del.id);
    setItems((prev) => prev.filter((a) => a.id !== del.id));
    setDel(null);
    toast(t("admin.success"), "success");
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">{t("admin.announcements")}</h1>
          <p className="mt-1 text-sm text-ink-500">Manage platform announcements</p>
        </div>
        <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          {t("admin.addAnnouncement")}
        </Button>
      </div>

      <Card>
        <CardHeader><h2 className="text-base font-semibold text-ink-900">{items.length} announcements</h2></CardHeader>
        <CardBody className="space-y-3">
          {items.map((a) => (
            <div key={a.id} className="rounded-xl border border-ink-100 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-ink-900">{a.title[locale]}</p>
                  <p className="mt-1 text-xs text-ink-500 line-clamp-2">{a.body[locale]}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge tone={a.published ? "success" : "neutral"}>{a.published ? "Published" : "Draft"}</Badge>
                    <span className="text-xs text-ink-400">{a.createdAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" leftIcon={<Pencil className="h-4 w-4" />} onClick={() => openEdit(a)}>{t("common.edit")}</Button>
                  <button onClick={() => setDel(a)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? t("common.edit") : t("admin.addAnnouncement")}
        size="xl"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="md" onClick={() => setOpen(false)}>{t("common.cancel")}</Button>
            <Button form="annForm" type="submit" variant="primary" size="md">{t("common.save")}</Button>
          </div>
        }
      >
        <form id="annForm" onSubmit={save} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Input label="Title (EN)" required value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
            <Input label="عنوان (دری)" required value={form.titleFa} onChange={(e) => setForm({ ...form, titleFa: e.target.value })} />
            <Input label="سرلیک (پښتو)" required value={form.titlePs} onChange={(e) => setForm({ ...form, titlePs: e.target.value })} />
          </div>
          <Textarea label="Body (EN)" required value={form.bodyEn} onChange={(e) => setForm({ ...form, bodyEn: e.target.value })} rows={3} />
          <Textarea label="متن (دری)" required value={form.bodyFa} onChange={(e) => setForm({ ...form, bodyFa: e.target.value })} rows={3} />
          <Textarea label="متن (پښتو)" required value={form.bodyPs} onChange={(e) => setForm({ ...form, bodyPs: e.target.value })} rows={3} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Select
              label="Audience"
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value as Locale | "all" })}
              options={[
                { value: "all", label: "All Languages" },
                { value: "en", label: "English only" },
                { value: "fa", label: "دری فقط" },
                { value: "ps", label: "پښتو یوازې" },
              ]}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-ink-700">Status</label>
              <button
                type="button"
                onClick={() => setForm({ ...form, published: !form.published })}
                className={`inline-flex h-10 items-center rounded-lg border px-3 text-sm ${form.published ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-ink-200 bg-white text-ink-700"}`}
              >
                {form.published ? "Published" : "Draft"}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!del}
        onClose={() => setDel(null)}
        title={t("modal.confirmTitle")}
        description={del?.title[locale]}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="md" onClick={() => setDel(null)}>{t("common.cancel")}</Button>
            <Button variant="danger" size="md" onClick={doDelete}>{t("common.confirm")}</Button>
          </div>
        }
      >
        <p className="text-sm text-ink-600">{t("admin.confirmDelete")}</p>
      </Modal>
    </div>
  );
}

void CardBody;