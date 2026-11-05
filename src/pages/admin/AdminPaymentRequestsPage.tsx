import { useEffect, useState } from "react";
import { Check, Search, X } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { Card, CardBody } from "../../components/ui/Card";
import { Input, Select, Textarea } from "../../components/ui/Input";
import { StatusBadge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { DataTable, type Column } from "../../components/admin/DataTable";
import { mockUsers } from "../../services/mockData";
import { paymentRequestService } from "../../services/api";
import type { PaymentRequest } from "../../types";
import { Pagination } from "../../components/ui/Pagination";
import { useToast } from "../../components/ui/Toast";

export function AdminPaymentRequestsPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [items, setItems] = useState<PaymentRequest[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState<{ item: PaymentRequest; type: "approve" | "reject"; note: string } | null>(null);
  const pageSize = 6;

  useEffect(() => {
    paymentRequestService.list().then(setItems);
  }, []);

  const methodLabel = (m: PaymentRequest["method"]) =>
    m === "cash" ? t("credit.methodCash") : m === "card" ? t("credit.methodCard") : m === "bank" ? t("credit.methodBank") : t("credit.methodOther");

  const statusLabel = (s: PaymentRequest["status"]) =>
    s === "pending" ? t("status.pending") : s === "approved" ? t("status.approved") : t("status.rejected");

  const filtered = items.filter((p) => {
    if (status && p.status !== status) return false;
    const u = mockUsers.find((u) => u.id === p.userId);
    if (search && !`${u?.fullName} ${p.reference}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  async function applyAction() {
    if (!confirm) return;
    if (confirm.type === "approve") {
      await paymentRequestService.approve(confirm.item.id);
      setItems((prev) => prev.map((p) => (p.id === confirm.item.id ? { ...p, status: "approved", reviewedAt: new Date().toISOString() } : p)));
    } else {
      await paymentRequestService.reject(confirm.item.id, confirm.note);
      setItems((prev) =>
        prev.map((p) =>
          p.id === confirm.item.id ? { ...p, status: "rejected", adminNote: confirm.note, reviewedAt: new Date().toISOString() } : p,
        ),
      );
    }
    setConfirm(null);
    toast(t("admin.success"), "success");
  }

  const columns: Column<PaymentRequest>[] = [
    {
      key: "user",
      header: t("admin.user"),
      cell: (p) => {
        const u = mockUsers.find((u) => u.id === p.userId);
        return (
          <div>
            <p className="font-medium text-ink-900">{u?.fullName}</p>
            <p className="text-xs text-ink-500">{u?.email}</p>
          </div>
        );
      },
    },
    { key: "amount", header: t("admin.amount"), cell: (p) => <span className="font-semibold">+{p.amount}</span> },
    { key: "method", header: t("admin.method"), cell: (p) => methodLabel(p.method) },
    { key: "ref", header: t("admin.reference"), cell: (p) => <span className="font-mono text-xs">{p.reference}</span> },
    {
      key: "status",
      header: t("common.status"),
      cell: (p) => <StatusBadge status={p.status} label={statusLabel(p.status)} />,
    },
    {
      key: "actions",
      header: t("common.actions"),
      className: "text-end",
      cell: (p) =>
        p.status === "pending" ? (
          <div className="flex justify-end gap-2">
            <Button variant="primary" size="sm" leftIcon={<Check className="h-4 w-4" />} onClick={() => setConfirm({ item: p, type: "approve", note: "" })}>
              {t("admin.approve")}
            </Button>
            <Button variant="outline" size="sm" leftIcon={<X className="h-4 w-4" />} onClick={() => setConfirm({ item: p, type: "reject", note: "" })}>
              {t("admin.reject")}
            </Button>
          </div>
        ) : (
          <span className="text-xs text-ink-400">—</span>
        ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">{t("admin.paymentRequests")}</h1>
        <p className="mt-1 text-sm text-ink-500">Review and process user top-up requests</p>
      </div>

      <Card>
        <CardBody>
          <div className="grid gap-3 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("admin.searchPlaceholder")} leftIcon={<Search className="h-4 w-4" />} />
            </div>
            <div className="lg:col-span-3">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { value: "", label: t("common.all") },
                  { value: "pending", label: t("status.pending") },
                  { value: "approved", label: t("status.approved") },
                  { value: "rejected", label: t("status.rejected") },
                ]}
              />
            </div>
          </div>
        </CardBody>
        <DataTable columns={columns} rows={paginated} empty="No requests" rowKey={(p) => p.id} />
        <div className="border-t border-ink-100 px-5 py-3">
          <Pagination page={page} totalPages={totalPages} total={filtered.length} pageSize={pageSize} onPageChange={setPage} />
        </div>
      </Card>

      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm?.type === "approve" ? t("admin.approve") : t("admin.reject")}
        description={confirm?.item ? `${mockUsers.find((u) => u.id === confirm.item.userId)?.fullName} · +${confirm.item.amount}` : ""}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="md" onClick={() => setConfirm(null)}>
              {t("common.cancel")}
            </Button>
            <Button variant={confirm?.type === "approve" ? "primary" : "danger"} size="md" onClick={applyAction}>
              {t("common.confirm")}
            </Button>
          </div>
        }
      >
        {confirm?.type === "reject" && (
          <Textarea
            label={t("admin.note")}
            value={confirm.note}
            onChange={(e) => setConfirm({ ...confirm, note: e.target.value })}
            placeholder="Reason for rejection"
            rows={3}
          />
        )}
        {confirm?.type === "approve" && <p className="text-sm text-ink-600">This will add {confirm.item.amount} credits to the user's account.</p>}
      </Modal>
    </div>
  );
}