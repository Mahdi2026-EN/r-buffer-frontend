
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { Card, CardHeader } from "../../components/ui/Card";
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
  active: boolean;
}

const blank: FormData = {
  nameEn: "",
  nameFa: "",
  namePs: "",
  descEn: "",
  descFa: "",
  descPs: "",
  order: "0",
  active: true,
};

export function AdminCategoriesPage() {
  const { t, locale } = useI18n();
  const { toast } = useToast();

  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<FormData>(blank);
  const [del, setDel] = useState<Category | null>(null);

  // Load categories from the real Spring Boot backend.
  async function loadCategories() {
    try {
      setLoading(true);
      setLoadError("");

      const categories = await categoryService.list();
      setItems(categories);
    } catch (error) {
      console.error("Failed to load categories:", error);

      setLoadError(
        error instanceof Error
          ? error.message
          : "Could not load categories from the server."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
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

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  function openCreate() {
    setEditing(null);
    setForm({ ...blank });
    setOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);

    setForm({
      nameEn: category.name.en,
      nameFa: category.name.fa,
      namePs: category.name.ps,
      descEn: category.description?.en ?? "",
      descFa: category.description?.fa ?? "",
      descPs: category.description?.ps ?? "",
      order: String(category.order),
      active: category.active,
    });

    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();

    const data = {
      name: {
        en: form.nameEn.trim(),
        fa: form.nameFa.trim(),
        ps: form.namePs.trim(),
      },
      description: {
        en: form.descEn.trim(),
        fa: form.descFa.trim(),
        ps: form.descPs.trim(),
      },
      order: Number.parseInt(form.order, 10),
      active: form.active,
    };

    if (!Number.isInteger(data.order) || data.order < 0) {
      toast("Display order must be a non-negative number.", "error");
      return;
    }

    try {
      if (editing) {
        const updated = await categoryService.update(editing.id, data);

        setItems((previous) =>
          previous.map((category) =>
            category.id === editing.id ? updated : category
          )
        );
      } else {
        const created = await categoryService.create(data);

        setItems((previous) => [...previous, created]);
      }

      setOpen(false);
      setEditing(null);
      setForm({ ...blank });

      toast(t("admin.success"), "success");
    } catch (error) {
      console.error("Failed to save category:", error);

      toast(
        error instanceof Error
          ? error.message
          : "Failed to save category.",
        "error"
      );
    }
  }

  async function doDelete() {
    if (!del) return;

    try {
      await categoryService.delete(del.id);

      setItems((previous) =>
        previous.filter((category) => category.id !== del.id)
      );

      setDel(null);
      toast(t("admin.success"), "success");
    } catch (error) {
      console.error("Failed to delete category:", error);

      toast(
        error instanceof Error
          ? error.message
          : "Failed to delete category.",
        "error"
      );
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page heading */}
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

      {/* Categories list */}
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
                onClick={loadCategories}
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
            items.map((category) => (
              <div
                key={category.id}
                className="flex flex-col justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-lg font-bold text-brand-700">
                    {category.name[locale].charAt(0)}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-ink-900">
                      {category.name[locale]}
                    </p>

                    <p className="text-xs text-ink-500">
                      {category.description?.[locale]}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="neutral">
                    Order: {category.order}
                  </Badge>

                  <Badge tone={category.active ? "success" : "neutral"}>
                    {category.active ? "Active" : "Inactive"}
                  </Badge>

                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Pencil className="h-4 w-4" />}
                    onClick={() => openEdit(category)}
                  >
                    {t("common.edit")}
                  </Button>

                  <button
                    type="button"
                    onClick={() => setDel(category)}
                    aria-label={`Delete ${category.name.en}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </Card>

      {/* Create / Edit category modal */}
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
          {/* Multilingual names */}
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

          {/* Multilingual descriptions */}
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

          {/* Display order */}
          <Input
            label="Order"
            type="number"
            min="0"
            value={form.order}
            onChange={(e) =>
              setForm({ ...form, order: e.target.value })
            }
          />

          {/* Active status */}
          <div className="flex items-start gap-3 rounded-lg border border-ink-200 p-4">
            <input
              id="category-active"
              type="checkbox"
              checked={form.active}
              onChange={(e) =>
                setForm({ ...form, active: e.target.checked })
              }
              className="mt-1 h-4 w-4 rounded"
            />

            <div>
              <label
                htmlFor="category-active"
                className="cursor-pointer text-sm font-medium text-ink-800"
              >
                Active category
              </label>

              <p className="mt-1 text-xs text-ink-500">
                Active categories are visible to customers. Inactive
                categories remain available in the admin panel.
              </p>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation modal */}
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