import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "../../i18n/I18nProvider";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { StatusBadge } from "../../components/ui/Badge";
import { LoadingState } from "../../components/ui/States";
import { orderService } from "../../services/api";
import type { Order, OrderStatus } from "../../types";

export function OrderDetailsPage() {
  const { t, locale } = useI18n();
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getMine(id ?? "")
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingState />;

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p>{t("states.notFound")}</p>
      </div>
    );
  }

  const statusLabel = (s: OrderStatus) =>
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

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link to="/orders" className="inline-flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        {t("orders.backToOrders")}
      </Link>

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">#{order.id}</h1>
          <StatusBadge status={order.status} label={statusLabel(order.status)} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-base font-semibold text-ink-900">{t("orders.orderDetails")}</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-ink-100 p-4">
                <div>
                  <p className="text-sm font-semibold text-ink-900">{item.productName[locale]}</p>
                  <p className="text-xs text-ink-500">{t("orders.quantity")}: {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-ink-900">{item.unitPrice * item.quantity}</p>
              </div>
            ))}
            <div className="flex justify-between border-t border-ink-100 pt-4 text-base font-semibold">
              <span>{t("common.total")}</span>
              <span>{order.total}</span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-ink-900">{t("orders.timeline")}</h2>
          </CardHeader>
          <CardBody>
            <ol className="space-y-3">
              {order.timeline.map((tl, i) => (
                <li key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className={`h-2.5 w-2.5 rounded-full ${i === order.timeline.length - 1 ? "bg-brand-500" : "bg-ink-300"}`} />
                    {i < order.timeline.length - 1 && <span className="w-px flex-1 bg-ink-200" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-900">{statusLabel(tl.status)}</p>
                    <p className="text-xs text-ink-500">{new Date(tl.date).toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ol>
          </CardBody>
        </Card>
      </div>

      {order.adminNote && (
        <Card>
          <CardBody>
            <h3 className="text-sm font-semibold text-ink-900">{t("orders.adminNote")}</h3>
            <p className="mt-2 text-sm text-ink-600">{order.adminNote}</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
