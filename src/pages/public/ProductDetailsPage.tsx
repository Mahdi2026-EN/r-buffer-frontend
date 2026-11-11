
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShoppingBag, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "../../i18n/I18nProvider";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { orderService, productService, categoryService } from "../../services/api";
import { authService } from "../../services/auth";
import { ApiError } from "../../services/http";
import { useToast } from "../../components/ui/Toast";
import { ProductCard } from "../../components/public/ProductCard";
import type { Category, Product, User } from "../../types";
import { LoadingState } from "../../components/ui/States";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

/**
 * Converts the image path returned by the backend into a usable URL.
 * Supports both absolute URLs and backend-relative image paths.
 */
function productImageUrl(image?: string | null): string | null {
  if (!image?.trim()) return null;

  const imagePath = image.trim();

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  const serverOrigin = API_BASE_URL.replace(/\/+$/, "").replace(/\/api$/i, "");
  const normalizedPath = imagePath.startsWith("/")
    ? imagePath
    : `/${imagePath}`;

  return `${serverOrigin}${normalizedPath}`;
}

export function ProductDetailsPage() {
  const { t, locale } = useI18n();
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setNotFound(false);
    setProduct(null);
    setQty(1);

    Promise.all([
      productService.getById(id ?? ""),
      productService.list(),
      categoryService.listPublic(),
    ])
      .then(([p, all, cats]) => {
        if (!active) return;

        setProduct(p);
        setCategories(cats);
        setRelated(
          all
            .filter((x) => x.categoryId === p.categoryId && x.id !== p.id)
            .slice(0, 4)
        );
      })
      .catch(() => {
        if (active) setNotFound(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    authService
      .me()
      .then((u) => {
        if (active) setUser(u);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20">
        <LoadingState />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-ink-900">
          {t("states.notFound")}
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          {t("states.notFoundDesc")}
        </p>
        <Link
          to="/products"
          className="mt-4 inline-block text-brand-700 hover:text-brand-800"
        >
          ← {t("products.backToProducts")}
        </Link>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.categoryId);
  const imageUrl = productImageUrl(product.image);
  const total = product.price * qty;
  const credit = user?.credit ?? 0;
  const hasEnoughCredit = credit >= total;
  const inStock = product.available && product.stock >= qty;

  async function handleConfirm() {
    if (!product) return;

    if (!user) {
      navigate("/login", {
        state: { from: `/products/${product.id}` },
      });
      return;
    }

    setSubmitting(true);

    try {
      await orderService.create([
        { productId: product.id, quantity: qty },
      ]);

      await authService.me().catch(() => undefined);

      toast("Order placed successfully.", "success");
      setOpen(false);
      navigate("/orders");
    } catch (e) {
      const message =
        e instanceof ApiError ? e.message : "Failed to place order.";

      toast(message, "error");
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
        {/* Product image */}
        <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
          <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-100 to-brand-50">
            {/* Fallback remains visible if no image exists or loading fails */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-9xl font-bold text-brand-600/20">
                {product.name[locale]?.charAt(0) || "?"}
              </span>
            </div>

            {imageUrl && (
              <img
                src={imageUrl}
                alt={product.name[locale] || "Product image"}
                loading="eager"
                className="absolute inset-0 z-10 h-full w-full object-contain"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            )}

            {product.featured && (
              <div className="absolute top-4 start-4 z-20">
                <Badge tone="brand">Featured</Badge>
              </div>
            )}
          </div>
        </div>

        {/* Product information */}
        <div>
          {category && (
            <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
              {category.name[locale]}
            </span>
          )}

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-900">
            {product.name[locale]}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-ink-900">
              {product.price}
            </span>
            <span className="text-sm text-ink-500">
              {t("products.credits")} · {t("products.perItem")}
            </span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            {product.available && product.stock > 0 ? (
              <Badge tone="success">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {t("products.available")}
              </Badge>
            ) : (
              <Badge tone="danger">
                {t("products.outOfStock")}
              </Badge>
            )}
          </div>

          <div className="mt-6 rounded-xl border border-ink-200 bg-ink-50/50 p-4">
            <h2 className="text-sm font-semibold text-ink-900">
              {t("products.description")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              {product.description[locale]}
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <h2 className="text-sm font-semibold text-amber-900">
              {t("products.purchaseNote")}
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-amber-800">
              {t("products.purchaseNoteDesc")}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg border border-ink-200 bg-white">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="h-10 w-10 rounded-s-lg text-ink-600 hover:bg-ink-50"
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span className="w-12 text-center text-sm font-medium">
                {qty}
              </span>

              <button
                onClick={() =>
                  setQty(Math.min(product.stock || 1, qty + 1))
                }
                className="h-10 w-10 rounded-e-lg text-ink-600 hover:bg-ink-50"
                aria-label="Increase quantity"
                disabled={qty >= product.stock}
              >
                +
              </button>
            </div>

            <Button
              variant="primary"
              size="lg"
              leftIcon={<ShoppingBag className="h-4 w-4" />}
              disabled={!inStock}
              onClick={() => setOpen(true)}
            >
              {t("products.purchase")} · {total}
            </Button>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight text-ink-900">
            {t("products.related")}
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Purchase confirmation */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t("products.purchase")}
        description={product.name[locale]}
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
              <span className="text-ink-600">
                {t("products.price")}
              </span>
              <span className="font-medium text-ink-900">
                {product.price}
              </span>
            </div>

            <div className="mt-2 flex justify-between text-sm">
              <span className="text-ink-600">
                {t("products.quantity")}
              </span>
              <span className="font-medium text-ink-900">
                {qty}
              </span>
            </div>

            <div className="mt-2 flex justify-between border-t border-ink-200 pt-2 text-base">
              <span className="font-semibold text-ink-900">
                {t("common.total")}
              </span>
              <span className="font-bold text-ink-900">
                {total}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-ink-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Wallet className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs text-ink-500">
                  {t("dashboard.currentCredit")}
                </p>
                <p className="text-sm font-semibold text-ink-900">
                  {credit}
                </p>
              </div>
            </div>

            {!hasEnoughCredit && (
              <Link
                to="/credit"
                className="text-xs font-medium text-brand-700 hover:underline"
              >
                {t("dashboard.addCredit")}
              </Link>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
