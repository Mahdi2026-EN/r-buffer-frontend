import { useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { Card, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input, Select, Textarea } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { Badge } from "../../components/ui/Badge";
import { DataTable, type Column } from "../../components/admin/DataTable";
import { mockCategories, mockProducts } from "../../services/mockData";
import { productService } from "../../services/api";
import type { Product } from "../../types";
import { Pagination } from "../../components/ui/Pagination";
import { useToast } from "../../components/ui/Toast";

interface FormData {
  nameEn: string; nameFa: string; namePs: string;
  descEn: string; descFa: string; descPs: string;
  categoryId: string; price: string; stock: string; featured: boolean;
}

const blankForm: FormData = {
  nameEn: "", nameFa: "", namePs: "",
  descEn: "", descFa: "", descPs: "",
  categoryId: "", price: "", stock: "", featured: false,
};

export function AdminProductsPage() {
  const { t, locale } = useI18n();
  const { toast } = useToast();
  const [items, setItems] = useState<Product[]>(mockProducts);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormData>(blankForm);
  const [del, setDel] = useState<Product | null>(null);
  const pageSize = 6;

  const filtered = items.filter((p) =>
    !search || [p.name.en, p.name.fa, p.name.ps].join(" ").toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  function openCreate() {
    setEditing(null);
    setForm(blankForm);
    setOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      nameEn: p.name.en, nameFa: p.name.fa, namePs: p.name.ps,
      descEn: p.description.en, descFa: p.description.fa, descPs: p.description.ps,
      categoryId: p.categoryId, price: String(p.price), stock: String(p.stock), featured: p.featured,
    });
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      name: { en: form.nameEn, fa: form.nameFa, ps: form.namePs },
      description: { en: form.descEn, fa: form.descFa, ps: form.descPs },
      categoryId: form.categoryId,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      available: parseInt(form.stock) > 0,
      featured: form.featured,
    };
    if (editing) {
      const updated = await productService.update(editing.id, data);
      setItems((prev) => prev.map((p) => (p.id === editing.id ? updated : p)));
      toast(t("admin.success"), "success");
    } else {
      const created = await productService.create(data);
      setItems((prev) => [created, ...prev]);
      toast(t("admin.success"), "success");
    }
    setOpen(false);
  }

  async function doDelete() {
    if (!del) return;
    await productService.delete(del.id);
    setItems((prev) => prev.filter((p) => p.id !== del.id));
    setDel(null);
    toast(t("admin.success"), "success");
  }

  const columns: Column<Product>[] = [
    {
      key: "name",
      header: t("admin.productName"),
      cell: (p) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-100 to-brand-50 text-sm font-bold text-brand-700">
            {p.name[locale].charAt(0)}
          </div>
          <div>
            <p className="font-medium text-ink-900">{p.name[locale]}</p>
            {p.featured && <Badge tone="brand" className="mt-0.5">Featured</Badge>}
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: t("admin.category"),
      cell: (p) => mockCategories.find((c) => c.id === p.categoryId)?.name[locale] ?? "—",
    },
    { key: "price", header: t("admin.price"), cell: (p) => `${p.price} ${t("products.credits")}` },
    {
      key: "available",
      header: t("admin.available"),
      cell: (p) => (p.available ? <Badge tone="success">{t("products.available")}</Badge> : <Badge tone="danger">{t("products.outOfStock")}</Badge>),
    },
    {
      key: "actions",
      header: t("common.actions"),
      className: "text-end",
      cell: (p) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" leftIcon={<Pencil className="h-4 w-4" />} onClick={() => openEdit(p)}>
            {t("common.edit")}
          </Button>
          <Button variant="ghost" size="sm" leftIcon={<Trash2 className="h-4 w-4 text-red-600" />}>
            <span className="sr-only">Delete</span>
          </Button>
          <button onClick={() => setDel(p)} className="text-red-600 hover:bg-red-50 rounded-md h-8 w-8 inline-flex items-center justify-center">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const catOptions = mockCategories.map((c) => ({ value: c.id, label: c.name[locale] }));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">{t("admin.products")}</h1>
          <p className="mt-1 text-sm text-ink-500">Manage your product catalog</p>
        </div>
        <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          {t("admin.addProduct")}
        </Button>
      </div>

      <Card>
        <CardBody>
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("admin.searchPlaceholder")} leftIcon={<Search className="h-4 w-4" />} />
        </CardBody>
        <DataTable columns={columns} rows={paginated} empty="No products" rowKey={(p) => p.id} />
        <div className="border-t border-ink-100 px-5 py-3">
          <Pagination page={page} totalPages={totalPages} total={filtered.length} pageSize={pageSize} onPageChange={setPage} />
        </div>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? t("admin.editProduct") : t("admin.addProduct")}
        description="Multilingual product data"
        size="xl"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="md" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button form="productForm" type="submit" variant="primary" size="md">
              {t("common.save")}
            </Button>
          </div>
        }
      >
        <form id="productForm" onSubmit={save} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Name (English)" required value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
            <Input label="نام (دری)" required value={form.nameFa} onChange={(e) => setForm({ ...form, nameFa: e.target.value })} />
            <Input label="نوم (پښتو)" required value={form.namePs} onChange={(e) => setForm({ ...form, namePs: e.target.value })} />
          </div>
          <div className="space-y-3">
            <Textarea label="Description (English)" required value={form.descEn} onChange={(e) => setForm({ ...form, descEn: e.target.value })} rows={2} />
            <Textarea label="توضیحات (دری)" required value={form.descFa} onChange={(e) => setForm({ ...form, descFa: e.target.value })} rows={2} />
            <Textarea label="تفصیل (پښتو)" required value={form.descPs} onChange={(e) => setForm({ ...form, descPs: e.target.value })} rows={2} />
          </div>
          <div className="grid gap-4 sm:grid-cols-4">
            <Select label={t("admin.category")} required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} options={[{ value: "", label: "—" }, ...catOptions]} />
            <Input label={t("admin.price")} type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <Input label={t("admin.quantity")} type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-ink-700">Featured</label>
              <button
                type="button"
                onClick={() => setForm({ ...form, featured: !form.featured })}
                className={`inline-flex h-10 items-center rounded-lg border px-3 text-sm ${form.featured ? "border-brand-300 bg-brand-50 text-brand-700" : "border-ink-200 bg-white text-ink-700"}`}
              >
                {form.featured ? "Yes" : "No"}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!del}
        onClose={() => setDel(null)}
        title={t("modal.confirmTitle")}
        description={del?.name[locale]}
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