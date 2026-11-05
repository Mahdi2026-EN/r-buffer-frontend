import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn";
import { useI18n } from "../../i18n/I18nProvider";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, total, pageSize, onPageChange }: PaginationProps) {
  const { t } = useI18n();
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-ink-500">
        {t("pagination.showing")}{" "}
        <span className="font-medium text-ink-700">
          {start}-{end}
        </span>{" "}
        {t("pagination.of")} <span className="font-medium text-ink-700">{total}</span> {t("pagination.results")}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-ink-200 bg-white text-ink-600 hover:bg-ink-50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous"
        >
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
        </button>
        {pages.map((p, i) => {
          const prev = pages[i - 1];
          const gap = prev && p - prev > 1;
          return (
            <div key={p} className="flex items-center gap-1">
              {gap && <span className="px-1 text-ink-400">...</span>}
              <button
                onClick={() => onPageChange(p)}
                className={cn(
                  "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors",
                  p === page
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-ink-200 bg-white text-ink-700 hover:bg-ink-50",
                )}
              >
                {p}
              </button>
            </div>
          );
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-ink-200 bg-white text-ink-600 hover:bg-ink-50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next"
        >
          <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
}