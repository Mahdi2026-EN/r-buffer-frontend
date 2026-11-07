import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "../../i18n/I18nProvider";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { StatusBadge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Textarea } from "../../components/ui/Input";
import { orderService } from "../../services/api";
import type { Order, OrderStatus } from "../../types";
import { useToast } from "../../components/ui/Toast";
import { LoadingState } from "../../components/ui/States";
import { ApiError } from "../../services/http";

type Action = "approved" | "processing" | "completed" | "rejected" | "cancelled";

export function AdminOrderDetailsPage() {
  const { t, locale } = useI18n();
  const { id } = useParams();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState<{ action: Action; note: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    orderService.getAny(id ?? "")
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingState />;
  if (!order) return <div className="p-8 text-center">{t("states.notFound")}</div>;

  const statusLabel = (s: OrderStatus) =>
    s === "pending" ? t("orders.statusPending") : s === "approved" ? t("orders.statusApproved") : s === "processing" ? t("orders.statusProcessing") : s === "completed" ? t("orders.statusCompleted") : s === "rejected" ? t("orders.statusRejected") : t("orders.statusCancelled");

  async function applyAction() {
    if (!confirm || !order || saving) return;
    setSaving(true);
    try {
      const updated = await orderService.updateStatus(order.id, confirm.action, confirm.note);
      setOrder(updated);
      setConfirm(null);
      toast(t("admin.success"), "success");
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "Could not update the order.", "error");
    } finally {
      setSaving(false);
    }
  }

  const needsNote = confirm?.action === "rejected" || confirm?.action === "cancelled";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link to="/admin/orders" className="inline-flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t("admin.backToOrders")}
      </Link>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-ink-900">#{order.id}</h1>
        <StatusBadge status={order.status} label={statusLabel(order.status)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><h2 className="text-base font-semibold text-ink-900">{t("admin.items")}</h2></CardHeader>
          <CardBody className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-ink-100 p-4">
                <div>
                  <p className="text-sm font-semibold text-ink-900">{item.productName[locale]}</p>
                  <p className="text-xs text-ink-500">{t("orders.quantity")}: {item.quantity} · {item.unitPrice}</p>
                </div>
                <p className="text-sm font-bold">{item.unitPrice * item.quantity}</p>
              </div>
            ))}
            <div className="flex justify-between border-t border-ink-100 pt-4 text-base font-semibold">
              <span>{t("common.total")}</span><span>{order.total}</span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h2 className="text-base font-semibold text-ink-900">{t("admin.customer")}</h2></CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm"><span className="text-ink-500">{t("auth.fullName")}:</span> <span className="font-medium">{order.userName}</span></p>
            <p className="text-sm"><span className="text-ink-500">{t("auth.email")}:</span> <span className="font-medium">{order.userEmail}</span></p>
            <p className="text-sm"><span className="text-ink-500">{t("auth.phone")}:</span> <span className="font-medium">{order.userPhone}</span></p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader><h2 className="text-base font-semibold text-ink-900">{t("admin.actions")}</h2></CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-2">
            {order.status === "pending" && (
              <>
                <Button variant="primary" size="sm" leftIcon={<Check className="h-4 w-4" />} onClick={() => setConfirm({ action: "approved", note: "" })}>
                  {t("admin.approve")}
                </Button>
                <Button variant="outline" size="sm" leftIcon={<X className="h-4 w-4" />} onClick={() => setConfirm({ action: "rejected", note: "" })}>
                  {t("admin.reject")}
                </Button>
              </>
            )}
            {order.status === "approved" && (
              <Button variant="primary" size="sm" onClick={() => setConfirm({ action: "processing", note: "" })}>
                {t("admin.startProcessing")}
              </Button>
            )}
            {order.status === "processing" && (
              <Button variant="primary" size="sm" leftIcon={<Check className="h-4 w-4" />} onClick={() => setConfirm({ action: "completed", note: "" })}>
                {t("admin.complete")}
              </Button>
            )}
            {(order.status === "pending" || order.status === "approved") && (
              <Button variant="outline" size="sm" leftIcon={<X className="h-4 w-4" />} onClick={() => setConfirm({ action: "cancelled", note: "" })}>
                {t("admin.cancelOrder")}
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={t("modal.confirmTitle")}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="md" onClick={() => setConfirm(null)}>{t("common.cancel")}</Button>
            <Button variant={needsNote ? "danger" : "primary"} size="md" onClick={applyAction} loading={saving}>{t("common.confirm")}</Button>
          </div>
        }
      >
        {needsNote && confirm && (
          <Textarea label={t("admin.note")} value={confirm.note} onChange={(e) => setConfirm({ ...confirm, note: e.target.value })} rows={3} />
        )}
        {confirm && !needsNote && (
          <p className="text-sm text-ink-600">{t("admin.confirmStatusChange")}</p>
        )}
      </Modal>
    </div>
  );
}
