
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input, Textarea } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { Badge } from "../../components/ui/Badge";
import { categoryService } from "../../services/api";
import type { Category } from "../../types";
import { useToast } from "../../components/ui/Toast";

interface FormData {
  nameEn: string;
  nameFa: string;
  namePs: string;
  descEn: string;
  descFa: string;
  descPs: string;
  order: string;
}

const blank: FormData = {
  nameEn: "",
  nameFa: "",
  namePs: "",
  descEn: "",
  descFa: "",
  descPs: "",
  order: "0",
};

export function AdminCategoriesPage() {
  const { t, locale } = useI18n();
  const { toast } = useToast();

  // Categories now come from the real backend
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<FormData>(blank);
  const [del, setDel] = useState<Category | null>(null);

  // Load categories from Spring Boot when the page opens
  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        setLoading(true);
        setLoadError("");

        const categories = await categoryService.list();

        if (!cancelled) {
          setItems(categories);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);

        if (!cancelled) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Could not load categories from the server."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(blank);
    setOpen(true);
  }

  function openEdit(c: Category) {
    setEditing(c);

    setForm({
      nameEn: c.name.en,
      nameFa: c.name.fa,
      namePs: c.name.ps,
      descEn: c.description?.en ?? "",
      descFa: c.description?.fa ?? "",
      descPs: c.description?.ps ?? "",
      order: String(c.order),
    });

    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();

    const data = {
      name: {
        en: form.nameEn,
        fa: form.nameFa,
        ps: form.namePs,
      },
      description: {
        en: form.descEn,
        fa: form.descFa,
        ps: form.descPs,
      },
      order: parseInt(form.order, 10),
      active: true,
    };

    try {
      if (editing) {
        const updated = await categoryService.update(editing.id, data);

        setItems((prev) =>
          prev.map((c) => (c.id === editing.id ? updated : c))
        );
      } else {
        const created = await categoryService.create(data);

        setItems((prev) => [...prev, created]);
      }

      setOpen(false);
      toast(t("admin.success"), "success");
    } catch (error) {
      console.error("Failed to save category:", error);
      toast(
        error instanceof Error ? error.message : "Failed to save category",
        "error"
      );
    }
  }

  async function doDelete() {
    if (!del) return;

    try {
      await categoryService.delete(del.id);

      setItems((prev) => prev.filter((c) => c.id !== del.id));

      setDel(null);
      toast(t("admin.success"), "success");
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast(
        error instanceof Error ? error.message : "Failed to delete category",
        "error"
      );
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
            {t("admin.categories")}
          </h1>

          <p className="mt-1 text-sm text-ink-500">
            Organize products into categories
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={openCreate}
        >
          {t("admin.addCategory")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-ink-900">
            {loading ? "Loading categories..." : `${items.length} categories`}
          </h2>
        </CardHeader>

        <div className="divide-y divide-ink-100">
          {loading && (
            <p className="px-5 py-8 text-center text-sm text-ink-500">
              Loading categories from the server...
            </p>
          )}

          {!loading && loadError && (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-red-600">{loadError}</p>

              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="mt-3"
              >
                Try again
              </Button>
            </div>
          )}

          {!loading && !loadError && items.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-ink-500">
              No categories found. Create your first category.
            </p>
          )}

          {!loading &&
            !loadError &&
            items.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-lg font-bold text-brand-700">
                    {c.name[locale].charAt(0)}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-ink-900">
                      {c.name[locale]}
                    </p>

                    <p className="text-xs text-ink-500">
                      {c.description?.[locale]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge tone="neutral">Order: {c.order}</Badge>

                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Pencil className="h-4 w-4" />}
                    onClick={() => openEdit(c)}
                  >
                    {t("common.edit")}
                  </Button>

                  <button
                    onClick={() => setDel(c)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? t("admin.editCategory") : t("admin.addCategory")}
        description="Multilingual category data"
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setOpen(false)}
            >
              {t("common.cancel")}
            </Button>

            <Button
              form="catForm"
              type="submit"
              variant="primary"
              size="md"
            >
              {t("common.save")}
            </Button>
          </div>
        }
      >
        <form id="catForm" onSubmit={save} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              label="Name (English)"
              required
              value={form.nameEn}
              onChange={(e) =>
                setForm({ ...form, nameEn: e.target.value })
              }
            />

            <Input
              label="نام (دری)"
              required
              value={form.nameFa}
              onChange={(e) =>
                setForm({ ...form, nameFa: e.target.value })
              }
            />

            <Input
              label="نوم (پښتو)"
              required
              value={form.namePs}
              onChange={(e) =>
                setForm({ ...form, namePs: e.target.value })
              }
            />
          </div>

          <Textarea
            label="Description (English)"
            value={form.descEn}
            onChange={(e) =>
              setForm({ ...form, descEn: e.target.value })
            }
            rows={2}
          />

          <Textarea
            label="توضیحات (دری)"
            value={form.descFa}
            onChange={(e) =>
              setForm({ ...form, descFa: e.target.value })
            }
            rows={2}
          />

          <Textarea
            label="تفصیل (پښتو)"
            value={form.descPs}
            onChange={(e) =>
              setForm({ ...form, descPs: e.target.value })
            }
            rows={2}
          />

          <Input
            label="Order"
            type="number"
            value={form.order}
            onChange={(e) =>
              setForm({ ...form, order: e.target.value })
            }
          />
        </form>
      </Modal>

      <Modal
        open={!!del}
        onClose={() => setDel(null)}
        title={t("modal.confirmTitle")}
        description={del?.name[locale]}
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setDel(null)}
            >
              {t("common.cancel")}
            </Button>

            <Button
              variant="danger"
              size="md"
              onClick={doDelete}
            >
              {t("common.confirm")}
            </Button>
          </div>
        }
      >
        <p className="text-sm text-ink-600">
          {t("admin.confirmDelete")}
        </p>
      </Modal>
    </div>
  );
}

void CardBody;
