import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShoppingBag, Wallet } from "lucide-react";
import { useState } from "react";
import { useI18n } from "../../i18n/I18nProvider";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { mockCategories, mockProducts, mockUsers } from "../../services/mockData";
import { orderService } from "../../services/api";
import { useToast } from "../../components/ui/Toast";
import { ProductCard } from "../../components/public/ProductCard";

export function ProductDetailsPage() {
  const { t, locale } = useI18n();
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const product = mockProducts.find((p) => p.id === id);
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-ink-900">{t("states.notFound")}</h1>
        <p className="mt-2 text-sm text-ink-500">{t("states.notFoundDesc")}</p>
        <Link to="/products" className="mt-4 inline-block text-brand-700 hover:text-brand-800">
          ← {t("products.backToProducts")}
        </Link>
      </div>
    );
  }

  const category = mockCategories.find((c) => c.id === product.categoryId);
  const related = mockProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);
  const user = mockUsers[0];
  const total = product.price * qty;
  const hasEnoughCredit = user.credit >= total;

  async function handleConfirm() {
    if (!product) return;
    if (!hasEnoughCredit) {
      toast("Insufficient credit. Please add credit to your account.", "error");
      return;
    }
    setSubmitting(true);
    try {
      await orderService.create({
        userId: user.id,
        items: [
          {
            productId: product.id,
            productName: product.name,
            quantity: qty,
            unitPrice: product.price,
          },
        ],
        total,
      });
      toast("Order placed successfully.", "success");
      setOpen(false);
      navigate("/orders");
    } catch (e) {
      toast("Failed to place order.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/products"
        className="inline-flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        {t("products.backToProducts")}
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
          <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-100 to-brand-50">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-9xl font-bold text-brand-600/20">{product.name[locale].charAt(0)}</span>
            </div>
            {product.featured && (
              <div className="absolute top-4 start-4">
                <Badge tone="brand">Featured</Badge>
              </div>
            )}
          </div>
        </div>

        <div>
          {category && (
            <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
              {category.name[locale]}
            </span>
          )}
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-900">{product.name[locale]}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-ink-900">{product.price}</span>
            <span className="text-sm text-ink-500">{t("products.credits")} · {t("products.perItem")}</span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            {product.available ? (
              <Badge tone="success">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {t("products.available")}
              </Badge>
            ) : (
              <Badge tone="danger">{t("products.outOfStock")}</Badge>
            )}
          </div>

          <div className="mt-6 rounded-xl border border-ink-200 bg-ink-50/50 p-4">
            <h2 className="text-sm font-semibold text-ink-900">{t("products.description")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">{product.description[locale]}</p>
          </div>

          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <h2 className="text-sm font-semibold text-amber-900">{t("products.purchaseNote")}</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-amber-800">{t("products.purchaseNoteDesc")}</p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg border border-ink-200 bg-white">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="h-10 w-10 text-ink-600 hover:bg-ink-50 rounded-s-lg"
              >
                −
              </button>
              <span className="w-12 text-center text-sm font-medium">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="h-10 w-10 text-ink-600 hover:bg-ink-50 rounded-e-lg"
              >
                +
              </button>
            </div>
            <Button
              variant="primary"
              size="lg"
              leftIcon={<ShoppingBag className="h-4 w-4" />}
              disabled={!product.available}
              onClick={() => setOpen(true)}
            >
              {t("products.purchase")} · {total}
            </Button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight text-ink-900">{t("products.related")}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t("products.purchase")}
        description={product.name[locale]}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="md" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleConfirm}
              loading={submitting}
              disabled={!hasEnoughCredit}
              rightIcon={<ArrowRight className="h-4 w-4 rtl:rotate-180" />}
            >
              {t("common.confirm")}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="rounded-xl bg-ink-50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">{t("products.price")}</span>
              <span className="font-medium text-ink-900">{product.price}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-ink-600">{t("products.quantity")}</span>
              <span className="font-medium text-ink-900">{qty}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-ink-200 pt-2 text-base">
              <span className="font-semibold text-ink-900">{t("common.total")}</span>
              <span className="font-bold text-ink-900">{total}</span>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-ink-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-ink-500">{t("dashboard.currentCredit")}</p>
                <p className="text-sm font-semibold text-ink-900">{user.credit}</p>
              </div>
            </div>
            {!hasEnoughCredit && (
              <Link to="/credit" className="text-xs font-medium text-brand-700 hover:underline">
                {t("dashboard.addCredit")}
              </Link>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}