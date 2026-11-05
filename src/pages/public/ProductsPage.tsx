import { useMemo, useState } from "react";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { Input, Select } from "../../components/ui/Input";
import { ProductCard } from "../../components/public/ProductCard";
import { EmptyState } from "../../components/ui/States";
import { mockCategories, mockProducts } from "../../services/mockData";
import { Button } from "../../components/ui/Button";
type SortOption = "newest" | "priceLow" | "priceHigh" | "name";

export function ProductsPage() {
  const { t, locale } = useI18n();
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = [...mockProducts];
    if (search) {
      const s = search.toLowerCase();
      list = list.filter((p) =>
        [p.name.en, p.name.fa, p.name.ps, p.description.en, p.description.fa, p.description.ps]
          .join(" ")
          .toLowerCase()
          .includes(s),
      );
    }
    if (categoryId) list = list.filter((p) => p.categoryId === categoryId);
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    if (!isNaN(min)) list = list.filter((p) => p.price >= min);
    if (!isNaN(max)) list = list.filter((p) => p.price <= max);

    switch (sort) {
      case "priceLow":
        list.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name":
        list.sort((a, b) => a.name[locale].localeCompare(b.name[locale]));
        break;
      default:
        list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    return list;
  }, [search, categoryId, sort, minPrice, maxPrice, locale]);

  const categoryOptions = [
    { value: "", label: t("products.allCategories") },
    ...mockCategories.map((c) => ({ value: c.id, label: c.name[locale] })),
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "newest", label: t("products.sortNewest") },
    { value: "priceLow", label: t("products.sortPriceLow") },
    { value: "priceHigh", label: t("products.sortPriceHigh") },
    { value: "name", label: t("products.sortName") },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-ink-900">{t("products.title")}</h1>
        <p className="mt-2 text-sm text-ink-500">{t("products.subtitle")}</p>
      </div>

      <div className="mb-6 rounded-xl border border-ink-200 bg-white p-4">
        <div className="grid gap-3 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("products.searchPlaceholder")}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="lg:col-span-3">
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              options={categoryOptions}
            />
          </div>
          <div className="lg:col-span-3">
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              options={sortOptions.map((o) => ({ value: o.value, label: o.label }))}
            />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={() => setShowFilters((s) => !s)}
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-600 hover:text-ink-900"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {t("common.filter")}
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch("");
              setCategoryId("");
              setMinPrice("");
              setMaxPrice("");
              setSort("newest");
            }}
          >
            {t("common.cancel")}
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4 grid gap-3 border-t border-ink-100 pt-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              label={t("products.price") + " (min)"}
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
            />
            <Input
              label={t("products.price") + " (max)"}
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="1000"
            />
          </div>
        )}
      </div>

      <p className="mb-4 text-sm text-ink-500">
        {filtered.length} {t("pagination.results")}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Filter className="h-6 w-6" />}
          title={t("products.noResults")}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}