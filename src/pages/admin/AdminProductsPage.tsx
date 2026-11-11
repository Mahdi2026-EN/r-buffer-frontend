
import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, ImagePlus, X } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { Card, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input, Select, Textarea } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { Badge } from "../../components/ui/Badge";
import { DataTable, type Column } from "../../components/admin/DataTable";
import { categoryService, productService } from "../../services/api";
import type { Category, Product } from "../../types";
import { Pagination } from "../../components/ui/Pagination";
import { useToast } from "../../components/ui/Toast";

interface FormData {
  nameEn: string;
  nameFa: string;
  namePs: string;
  descEn: string;
  descFa: string;
  descPs: string;
  categoryId: string;
  price: string;
  stock: string;
  featured: boolean;
}

const blankForm: FormData = {
  nameEn: "",
  nameFa: "",
  namePs: "",
  descEn: "",
  descFa: "",
  descPs: "",
  categoryId: "",
  price: "",
  stock: "",
  featured: false,
};

// Converts a backend image path into a browser-accessible URL.
function productImageUrl(image?: string | null): string {
  if (!image) return "";

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  const apiBase = (
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8080/api"
  ).replace(/\/+$/, "");

  const serverOrigin = apiBase.replace(/\/api\/?$/, "");

  return `${serverOrigin}${image.startsWith("/") ? image : `/${image}`}`;
}

export function AdminProductsPage() {
  const { t, locale } = useI18n();
  const { toast } = useToast();

  const [items, setItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormData>(blankForm);
  const [del, setDel] = useState<Product | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);

  const pageSize = 6;

  useEffect(() => {
    productService.listAll().then(setItems).catch(console.error);
    categoryService.list().then(setCategories).catch(console.error);
  }, []);

  // Clean up temporary browser image previews.
  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const filtered = items.filter((p) =>
    !search ||
    [p.name.en, p.name.fa, p.name.ps]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  function resetImageSelection() {
    setImageFile(null);
    setImagePreview("");
  }

  function openCreate() {
    setEditing(null);
    setForm({ ...blankForm });
    resetImageSelection();
    setOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);

    setForm({
      nameEn: p.name.en,
      nameFa: p.name.fa,
      namePs: p.name.ps,
      descEn: p.description.en,
      descFa: p.description.fa,
      descPs: p.description.ps,
      categoryId: p.categoryId,
      price: String(p.price),
      stock: String(p.stock),
      featured: p.featured,
    });

    setImageFile(null);
    setImagePreview(productImageUrl(p.image));
    setOpen(true);
  }

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast("Please select a JPEG, PNG, or WebP image.", "error");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast("Image size must not exceed 5 MB.", "error");
      event.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();

    if (saving) return;

    setSaving(true);

    try {
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
        categoryId: form.categoryId,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
        available: parseInt(form.stock, 10) > 0,
        featured: form.featured,

        // Preserve the existing image unless a new one is uploaded.
        image: editing?.image ?? "",
      };

      let savedProduct: Product;

      if (editing) {
        savedProduct = await productService.update(
          editing.id,
          data,
        );
      } else {
        savedProduct = await productService.create(data);
      }

      // Upload the selected image after the product has an ID.
      if (imageFile) {
        savedProduct = await productService.uploadImage(
          savedProduct.id,
          imageFile,
        );
      }

      setItems((prev) => {
        if (editing) {
          return prev.map((p) =>
            p.id === savedProduct.id ? savedProduct : p,
          );
        }

        return [savedProduct, ...prev];
      });

      setOpen(false);
      resetImageSelection();

      toast(t("admin.success"), "success");
    } finally {
      setSaving(false);
    }
  }

  async function doDelete() {
    if (!del) return;

    await productService.delete(del.id);

    setItems((prev) =>
      prev.filter((p) => p.id !== del.id),
    );

    setDel(null);

    toast(t("admin.success"), "success");
  }

  const columns: Column<Product>[] = [
    {
      key: "name",
      header: t("admin.productName"),
      cell: (p) => (
        <div className="flex items-center gap-3">
          {p.image ? (
            <img
              src={productImageUrl(p.image)}
              alt={p.name[locale]}
              className="h-12 w-12 rounded-lg object-cover border border-ink-100"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-brand-100 to-brand-50 text-sm font-bold text-brand-700">
              {p.name[locale].charAt(0)}
            </div>
          )}

          <div>
            <p className="font-medium text-ink-900">
              {p.name[locale]}
            </p>

            {p.featured && (
              <Badge tone="brand" className="mt-0.5">
                Featured
              </Badge>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: t("admin.category"),
      cell: (p) =>
        categories.find((c) => c.id === p.categoryId)?.name[locale] ?? "—",
    },
    {
      key: "price",
      header: t("admin.price"),
      cell: (p) => `${p.price} ${t("products.credits")}`,
    },
    {
      key: "available",
      header: t("admin.available"),
      cell: (p) =>
        p.available ? (
          <Badge tone="success">{t("products.available")}</Badge>
        ) : (
          <Badge tone="danger">{t("products.outOfStock")}</Badge>
        ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      className: "text-end",
      cell: (p) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Pencil className="h-4 w-4" />}
            onClick={() => openEdit(p)}
          >
            {t("common.edit")}
          </Button>

          <button
            type="button"
            onClick={() => setDel(p)}
            className="text-red-600 hover:bg-red-50 rounded-md h-8 w-8 inline-flex items-center justify-center"
            aria-label={`Delete ${p.name.en}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const catOptions = categories.map((c) => ({
    value: c.id,
    label: c.name[locale],
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-6">

      {/* Page heading */}
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
            {t("admin.products")}
          </h1>

          <p className="mt-1 text-sm text-ink-500">
            Manage your product catalog
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={openCreate}
        >
          {t("admin.addProduct")}
        </Button>
      </div>

      {/* Product table */}
      <Card>
        <CardBody>
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={t("admin.searchPlaceholder")}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </CardBody>

        <DataTable
          columns={columns}
          rows={paginated}
          empty="No products"
          rowKey={(p) => p.id}
        />

        <div className="border-t border-ink-100 px-5 py-3">
          <Pagination
            page={page}
            totalPages={totalPages}
            total={filtered.length}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        </div>
      </Card>

      {/* Add / Edit product modal */}
      <Modal
        open={open}
        onClose={() => {
          if (!saving) {
            setOpen(false);
            resetImageSelection();
          }
        }}
        title={editing ? t("admin.editProduct") : t("admin.addProduct")}
        description="Multilingual product data"
        size="xl"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setOpen(false);
                resetImageSelection();
              }}
              disabled={saving}
            >
              {t("common.cancel")}
            </Button>

            <Button
              form="productForm"
              type="submit"
              variant="primary"
              size="md"
              disabled={saving}
            >
              {saving ? "Saving..." : t("common.save")}
            </Button>
          </div>
        }
      >
        <form
          id="productForm"
          onSubmit={save}
          className="space-y-6"
        >

          {/* Product image upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-ink-700">
              Product image
            </label>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">

              {imagePreview ? (
                <div className="relative h-40 w-40 overflow-hidden rounded-xl border border-ink-200 bg-ink-50">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      resetImageSelection();
                    }}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-red-600 shadow"
                    aria-label="Remove selected image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="productImage"
                  className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-300 bg-ink-50 text-ink-500 hover:border-brand-400 hover:bg-brand-50"
                >
                  <ImagePlus className="h-9 w-9" />
                  <span className="text-sm font-medium">
                    Choose image
                  </span>
                </label>
              )}

              <div className="space-y-3">
                <input
                  id="productImage"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-ink-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:font-medium file:text-brand-700 hover:file:bg-brand-100"
                />

                <p className="text-xs text-ink-500">
                  Supported formats: JPEG, PNG, WebP.
                  Maximum size: 5 MB.
                </p>

                {imageFile && (
                  <p className="text-xs text-ink-600">
                    Selected: {imageFile.name}
                  </p>
                )}

                {editing?.image && !imageFile && (
                  <p className="text-xs text-ink-500">
                    Current image will be kept unless you select a replacement.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Multilingual names */}
          <div className="grid gap-4 sm:grid-cols-3">
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
          <div className="space-y-3">
            <Textarea
              label="Description (English)"
              required
              value={form.descEn}
              onChange={(e) =>
                setForm({ ...form, descEn: e.target.value })
              }
              rows={2}
            />

            <Textarea
              label="توضیحات (دری)"
              required
              value={form.descFa}
              onChange={(e) =>
                setForm({ ...form, descFa: e.target.value })
              }
              rows={2}
            />

            <Textarea
              label="تفصیل (پښتو)"
              required
              value={form.descPs}
              onChange={(e) =>
                setForm({ ...form, descPs: e.target.value })
              }
              rows={2}
            />
          </div>

          {/* Product details */}
          <div className="grid gap-4 sm:grid-cols-4">
            <Select
              label={t("admin.category")}
              required
              value={form.categoryId}
              onChange={(e) =>
                setForm({ ...form, categoryId: e.target.value })
              }
              options={[
                { value: "", label: "—" },
                ...catOptions,
              ]}
            />

            <Input
              label={t("admin.price")}
              type="number"
              min="0"
              step="0.01"
              required
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
            />

            <Input
              label={t("admin.quantity")}
              type="number"
              min="0"
              step="1"
              required
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: e.target.value })
              }
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-ink-700">
                Featured
              </label>

              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    featured: !form.featured,
                  })
                }
                className={`inline-flex h-10 items-center rounded-lg border px-3 text-sm ${
                  form.featured
                    ? "border-brand-300 bg-brand-50 text-brand-700"
                    : "border-ink-200 bg-white text-ink-700"
                }`}
              >
                {form.featured ? "Yes" : "No"}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
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
