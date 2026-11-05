import { Link } from "react-router-dom";
import { useI18n } from "../../i18n/I18nProvider";
import { Badge } from "../ui/Badge";
import type { Product } from "../../types";

export function ProductCard({ product }: { product: Product }) {
  const { t, locale } = useI18n();
  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-ink-200 bg-white transition-all hover:border-brand-300 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-brand-100 to-brand-50">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl font-bold text-brand-600/30">
            {product.name[locale].charAt(0)}
          </span>
        </div>
        {product.featured && (
          <div className="absolute top-3 start-3">
            <Badge tone="brand">Featured</Badge>
          </div>
        )}
        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink-900/50">
            <Badge tone="neutral" className="!bg-white">{t("products.outOfStock")}</Badge>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-sm font-semibold text-ink-900 group-hover:text-brand-700">
          {product.name[locale]}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-500">
          {product.description[locale]}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-base font-bold text-ink-900">{product.price} <span className="text-xs font-normal text-ink-500">{t("products.credits")}</span></span>
          <span className="text-xs text-ink-500">{t("products.viewDetails")}</span>
        </div>
      </div>
    </Link>
  );
}