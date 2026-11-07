import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { StatusBadge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/States";
import { Button } from "../../components/ui/Button";
import { orderService } from "../../services/api";
import type { Order } from "../../types";
import { Pagination } from "../../components/ui/Pagination";

export function OrdersPage() {
  const { t, locale } = useI18n();
  const [items, setItems] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    orderService.listMine().then(setItems).catch(() => undefined);
  }, []);

  const statusLabel = (s: Order["status"]) =>
    s === "pending"
      ? t("orders.statusPending")
      : s === "approved"
        ? t("orders.statusApproved")
        : s === "processing"
          ? t("orders.statusProcessing")
          : s === "completed"
            ? t("orders.statusCompleted")
            : s === "rejected"
              ? t("orders.statusRejected")
              : t("orders.statusCancelled");

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const paginated = items.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">{t("orders.title")}</h1>
        <p className="mt-1 text-sm text-ink-500">{t("orders.subtitle")}</p>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState title={t("orders.noOrders")} />
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-ink-900">{t("orders.title")}</h2>
          </CardHeader>

          {/* Desktop table */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead className="border-b border-ink-100 bg-ink-50/50">
                <tr>
                  <th className="px-5 py-3 text-start text-xs font-medium uppercase tracking-wider text-ink-500">{t("orders.id")}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium uppercase tracking-wider text-ink-500">{t("orders.product")}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium uppercase tracking-wider text-ink-500">{t("orders.total")}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium uppercase tracking-wider text-ink-500">{t("orders.date")}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium uppercase tracking-wider text-ink-500">{t("orders.status")}</th>
                  <th className="px-5 py-3 text-end text-xs font-medium uppercase tracking-wider text-ink-500">{t("common.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {paginated.map((o) => (
                  <tr key={o.id} className="hover:bg-ink-50/50">
                    <td className="px-5 py-3.5 text-sm font-medium text-ink-900">{o.id}</td>
                    <td className="px-5 py-3.5 text-sm text-ink-700">{o.items[0].productName[locale]}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-ink-900">{o.total}</td>
                    <td className="px-5 py-3.5 text-sm text-ink-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={o.status} label={statusLabel(o.status)} /></td>
                    <td className="px-5 py-3.5 text-end">
                      <Link to={`/orders/${o.id}`}>
                        <Button variant="ghost" size="sm" leftIcon={<Eye className="h-4 w-4" />}>
                          {t("orders.details")}
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-ink-100 md:hidden">
            {paginated.map((o) => (
              <Link key={o.id} to={`/orders/${o.id}`} className="block px-5 py-4 hover:bg-ink-50">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{o.id}</p>
                    <p className="mt-0.5 text-xs text-ink-500">{o.items[0].productName[locale]}</p>
                  </div>
                  <StatusBadge status={o.status} label={statusLabel(o.status)} />
                </div>
                <div className="mt-2 flex justify-between text-xs text-ink-500">
                  <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                  <span className="font-semibold text-ink-900">{o.total} {t("products.credits")}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="border-t border-ink-100 px-5 py-3">
            <Pagination page={page} totalPages={totalPages} total={items.length} pageSize={pageSize} onPageChange={setPage} />
          </div>
        </Card>
      )}
    </div>
  );
}