import { useEffect, useState } from "react";
import { Search, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../../i18n/I18nProvider";
import { Card, CardBody } from "../../components/ui/Card";
import { Input, Select } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { StatusBadge } from "../../components/ui/Badge";
import { DataTable, type Column } from "../../components/admin/DataTable";
import { orderService } from "../../services/api";
import type { Order } from "../../types";
import { Pagination } from "../../components/ui/Pagination";

export function AdminOrdersPage() {
  const { t, locale } = useI18n();
  const [items, setItems] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    orderService.list().then(setItems);
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

  const filtered = items.filter((o) => {
    if (status && o.status !== status) return false;
    if (search && !o.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns: Column<Order>[] = [
    { key: "id", header: t("admin.orderId"), cell: (o) => <span className="font-medium">{o.id}</span> },
    {
      key: "user",
      header: t("admin.user"),
      cell: (o) => o.userName,
    },
    { key: "product", header: t("admin.productName"), cell: (o) => o.items[0].productName[locale] },
    { key: "total", header: t("common.total"), cell: (o) => `${o.total}` },
    { key: "date", header: t("common.date"), cell: (o) => new Date(o.createdAt).toLocaleDateString() },
    { key: "status", header: t("common.status"), cell: (o) => <StatusBadge status={o.status} label={statusLabel(o.status)} /> },
    {
      key: "actions",
      header: t("common.actions"),
      className: "text-end",
      cell: (o) => (
        <Link to={`/admin/orders/${o.id}`}>
          <Button variant="ghost" size="sm" leftIcon={<Eye className="h-4 w-4" />}>
            {t("admin.view")}
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">{t("admin.orders")}</h1>
        <p className="mt-1 text-sm text-ink-500">Review and manage all platform orders</p>
      </div>

      <Card>
        <CardBody>
          <div className="grid gap-3 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("admin.searchPlaceholder")} leftIcon={<Search className="h-4 w-4" />} />
            </div>
            <div className="lg:col-span-5">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { value: "", label: t("common.all") },
                  { value: "pending", label: t("orders.statusPending") },
                  { value: "approved", label: t("orders.statusApproved") },
                  { value: "processing", label: t("orders.statusProcessing") },
                  { value: "completed", label: t("orders.statusCompleted") },
                  { value: "rejected", label: t("orders.statusRejected") },
                  { value: "cancelled", label: t("orders.statusCancelled") },
                ]}
              />
            </div>
          </div>
        </CardBody>
        <DataTable columns={columns} rows={paginated} empty="No orders" rowKey={(o) => o.id} />
        <div className="border-t border-ink-100 px-5 py-3">
          <Pagination page={page} totalPages={totalPages} total={filtered.length} pageSize={pageSize} onPageChange={setPage} />
        </div>
      </Card>
    </div>
  );
}