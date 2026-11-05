import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import type { Category } from "../../types";

export function CategoryCard({ category }: { category: Category }) {
  const { locale } = useI18n();
  return (
    <Link
      to="/products"
      className="group flex items-center justify-between rounded-xl border border-ink-200 bg-white p-5 transition-all hover:border-brand-300 hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 text-brand-700 text-lg font-bold">
          {category.name[locale].charAt(0)}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink-900 group-hover:text-brand-700">{category.name[locale]}</h3>
          {category.description && (
            <p className="text-xs text-ink-500 line-clamp-1">{category.description[locale]}</p>
          )}
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-ink-400 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
    </Link>
  );
}