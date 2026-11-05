import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, X } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { StatusBadge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Textarea } from "../../components/ui/Input";
import { mockOrders, mockUsers } from "../../services/mockData";
import { orderService } from "../../services/api";
import type { Order, OrderStatus } from "../../types";
import { useState } from "react";
import { useToast } from "../../components/ui/Toast";

export function AdminOrderDetailsPage() {
  const { t, locale } = useI18n();
  const { id } = useParams();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | undefined>(mockOrders.find((o) => o.id === id));
  const [confirm, setConfirm] = useState<{ type: "approve" | "process" | "complete" | "reject" | "cancel"; note: string } | null>(null);

  if (!order) return <div className="p-8 text-center">Not found</div>;

  const user = mockUsers.find((u) => u.id === order.userId);
  const statusLabel = (s: OrderStatus) =>
    s === "pending" ? t("orders.statusPending") : s === "approved" ? t("orders.statusApproved") : s === "processing" ? t("orders.statusProcessing") : s === "completed" ? t("orders.statusCompleted") : s === "rejected" ? t("orders.statusRejected") : t("orders.statusCancelled");

  async function applyAction() {
    if (!confirm) return;
    let newStatus: OrderStatus = order!.status;
    if (confirm.type === "approve") newStatus = "approved";
    if (confirm.type === "process") newStatus = "processing";
    if (confirm.type === "complete") newStatus = "completed";
    if (confirm.type === "reject") newStatus = "rejected";
    if (confirm.type === "cancel") newStatus = "cancelled";
    const updated = await orderService.updateStatus(order!.id, newStatus, confirm.note);
    setOrder(updated);
    setConfirm(null);
    toast(t("admin.success"), "success");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link to="/admin/orders" className="inline-flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> Back to Orders
      </Link>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-ink-900">{order.id}</h1>
        <StatusBadge status={order.status} label={statusLabel(order.status)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><h2 className="text-base font-semibold text-ink-900">Items</h2></CardHeader>
          <CardBody className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-ink-100 p-4">
                <div>
                  <p className="text-sm font-semibold text-ink-900">{item.productName[locale]}</p>
                  <p className="text-xs text-ink-500">Qty: {item.quantity} · Unit: {item.unitPrice}</p>
                </div>
                <p className="text-sm font-bold">{item.unitPrice * item.quantity}</p>
              </div>
            ))}
            <div className="flex justify-between border-t border-ink-100 pt-4 text-base font-semibold">
              <span>Total</span><span>{order.total}</span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h2 className="text-base font-semibold text-ink-900">Customer</h2></CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm"><span className="text-ink-500">Name:</span> <span className="font-medium">{user?.fullName}</span></p>
            <p className="text-sm"><span className="text-ink-500">Email:</span> <span className="font-medium">{user?.email}</span></p>
            <p className="text-sm"><span className="text-ink-500">Phone:</span> <span className="font-medium">{user?.phone}</span></p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader><h2 className="text-base font-semibold text-ink-900">Actions</h2></CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-2">
            {order.status === "pending" && (
              <>
                <Button variant="primary" size="sm" leftIcon={<Check className="h-4 w-4" />} onClick={() => setConfirm({ type: "approve", note: "" })}>
                  {t("admin.approve")}
                </Button>
                <Button variant="outline" size="sm" leftIcon={<X className="h-4 w-4" />} onClick={() => setConfirm({ type: "reject", note: "" })}>
                  {t("admin.reject")}
                </Button>
              </>
            )}
            {order.status === "approved" && (
              <Button variant="primary" size="sm" onClick={() => setConfirm({ type: "process", note: "" })}>
                {t("admin.startProcessing")}
              </Button>
            )}
            {order.status === "processing" && (
              <Button variant="primary" size="sm" leftIcon={<Check className="h-4 w-4" />} onClick={() => setConfirm({ type: "complete", note: "" })}>
                {t("admin.complete")}
              </Button>
            )}
            {(order.status === "pending" || order.status === "approved") && (
              <Button variant="outline" size="sm" leftIcon={<X className="h-4 w-4" />} onClick={() => setConfirm({ type: "cancel", note: "" })}>
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
        description={confirm ? `Change order to ${confirm.type}` : ""}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="md" onClick={() => setConfirm(null)}>{t("common.cancel")}</Button>
            <Button variant={confirm?.type === "reject" || confirm?.type === "cancel" ? "danger" : "primary"} size="md" onClick={applyAction}>{t("common.confirm")}</Button>
          </div>
        }
      >
        {(confirm?.type === "reject" || confirm?.type === "cancel") && (
          <Textarea label={t("admin.note")} value={confirm.note} onChange={(e) => setConfirm({ ...confirm, note: e.target.value })} rows={3} />
        )}
        {confirm && confirm.type !== "reject" && confirm.type !== "cancel" && (
          <p className="text-sm text-ink-600">Are you sure you want to change the status to {confirm.type}?</p>
        )}
      </Modal>
    </div>
  );
}