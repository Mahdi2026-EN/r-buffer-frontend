import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { StatusBadge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/States";
import { paymentRequestService } from "../../services/api";
import type { PaymentRequest } from "../../types";
import { Pagination } from "../../components/ui/Pagination";

export function PaymentRequestsPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<PaymentRequest[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    paymentRequestService.listMine().then(setItems).catch(() => undefined);
  }, []);

  const methodLabel = (m: PaymentRequest["method"]) =>
    m === "cash" ? t("credit.methodCash") : m === "card" ? t("credit.methodCard") : m === "bank" ? t("credit.methodBank") : t("credit.methodOther");

  const statusLabel = (s: PaymentRequest["status"]) =>
    s === "pending" ? t("status.pending") : s === "approved" ? t("status.approved") : t("status.rejected");

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const paginated = items.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">{t("paymentRequests.title")}</h1>
          <p className="mt-1 text-sm text-ink-500">{t("paymentRequests.subtitle")}</p>
        </div>
        <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />} onClick={() => (window.location.href = "/credit")}>
          {t("paymentRequests.new")}
        </Button>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState title={t("paymentRequests.noRequests")} />
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-ink-900">{t("paymentRequests.title")}</h2>
          </CardHeader>
          <div className="divide-y divide-ink-100">
            {paginated.map((p) => (
              <div key={p.id} className="grid grid-cols-1 gap-3 px-5 py-4 sm:grid-cols-12 sm:items-center">
                <div className="sm:col-span-3">
                  <p className="text-sm font-semibold text-ink-900">+{p.amount}</p>
                  <p className="text-xs text-ink-500">{new Date(p.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="sm:col-span-3">
                  <p className="text-xs text-ink-500">{t("paymentRequests.method")}</p>
                  <p className="text-sm text-ink-800">{methodLabel(p.method)}</p>
                </div>
                <div className="sm:col-span-3">
                  <p className="text-xs text-ink-500">{t("paymentRequests.reference")}</p>
                  <p className="text-sm text-ink-800 font-mono">{p.reference}</p>
                </div>
                <div className="sm:col-span-3 flex sm:justify-end">
                  <StatusBadge status={p.status} label={statusLabel(p.status)} />
                </div>
                {p.status === "rejected" && p.adminNote && (
                  <div className="sm:col-span-12 rounded-lg bg-red-50 p-3 text-xs text-red-700">
                    <strong>{t("orders.adminNote")}:</strong> {p.adminNote}
                  </div>
                )}
              </div>
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