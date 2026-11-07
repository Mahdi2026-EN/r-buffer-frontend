import { useEffect, useState } from "react";
import { Search, Filter as FilterIcon, UserCheck, ShieldOff } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { Card, CardBody } from "../../components/ui/Card";
import { Input, Select } from "../../components/ui/Input";
import { StatusBadge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { DataTable, type Column } from "../../components/admin/DataTable";
import { userService } from "../../services/api";
import type { User } from "../../types";
import { Pagination } from "../../components/ui/Pagination";
import { useToast } from "../../components/ui/Toast";

export function UsersPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    userService.list().then(setUsers).catch(() => undefined);
  }, []);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState<{ user: User; action: "suspend" | "activate" } | null>(null);
  const pageSize = 6;

  const filtered = users
    .filter((u) => u.role === "user")
    .filter((u) => {
      if (status && u.status !== status) return false;
      if (search && !`${u.fullName} ${u.email} ${u.phone}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const statusLabel = (s: User["status"]) =>
    s === "approved"
      ? t("status.approved")
      : s === "pending"
        ? t("status.pending")
        : s === "denied"
          ? t("status.denied")
          : t("status.suspended");

  async function doAction() {
    if (!confirm) return;
    const newStatus = confirm.action === "suspend" ? "suspended" : "approved";
    await userService.updateStatus(confirm.user, newStatus);
    setUsers((prev) => prev.map((u) => (u.id === confirm.user.id ? { ...u, status: newStatus } : u)));
    setConfirm(null);
    toast(t("admin.success"), "success");
  }

  const columns: Column<User>[] = [
    {
      key: "name",
      header: t("admin.name"),
      cell: (u) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
            {u.fullName.split(" ").map((s) => s[0]).join("").slice(0, 2)}
          </div>
          <div>
            <p className="font-medium text-ink-900">{u.fullName}</p>
            <p className="text-xs text-ink-500">{u.email}</p>
          </div>
        </div>
      ),
    },
    { key: "phone", header: t("admin.phone"), cell: (u) => u.phone },
    {
      key: "role",
      header: t("admin.role"),
      cell: (u) => <span className="capitalize">{u.role}</span>,
    },
    {
      key: "status",
      header: t("common.status"),
      cell: (u) => <StatusBadge status={u.status} label={statusLabel(u.status)} />,
    },
    {
      key: "date",
      header: t("admin.registrationDate"),
      cell: (u) => new Date(u.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      header: t("common.actions"),
      className: "text-end",
      cell: (u) => (
        <div className="flex justify-end gap-1">
          {u.status === "approved" ? (
            <Button variant="ghost" size="sm" leftIcon={<ShieldOff className="h-4 w-4" />} onClick={() => setConfirm({ user: u, action: "suspend" })}>
              {t("admin.suspend")}
            </Button>
          ) : (
            <Button variant="ghost" size="sm" leftIcon={<UserCheck className="h-4 w-4" />} onClick={() => setConfirm({ user: u, action: "activate" })}>
              {t("admin.activate")}
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">{t("admin.users")}</h1>
        <p className="mt-1 text-sm text-ink-500">Manage user accounts and access</p>
      </div>

      <Card>
        <CardBody>
          <div className="grid gap-3 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("admin.searchPlaceholder")}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="lg:col-span-3">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { value: "", label: t("common.all") },
                  { value: "approved", label: t("status.approved") },
                  { value: "pending", label: t("status.pending") },
                  { value: "denied", label: t("status.denied") },
                  { value: "suspended", label: t("status.suspended") },
                ]}
              />
            </div>
            <div className="lg:col-span-2">
              <Button variant="outline" size="md" fullWidth leftIcon={<FilterIcon className="h-4 w-4" />}>
                {t("common.filter")}
              </Button>
            </div>
          </div>
        </CardBody>
        <DataTable
          columns={columns}
          rows={paginated}
          empty="No users found"
          rowKey={(u) => u.id}
        />
        <div className="border-t border-ink-100 px-5 py-3">
          <Pagination page={page} totalPages={totalPages} total={filtered.length} pageSize={pageSize} onPageChange={setPage} />
        </div>
      </Card>

      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={t("modal.confirmTitle")}
        description={confirm?.action === "suspend" ? t("admin.confirmDeny") : t("admin.confirmApprove")}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="md" onClick={() => setConfirm(null)}>
              {t("common.cancel")}
            </Button>
            <Button variant={confirm?.action === "suspend" ? "danger" : "primary"} size="md" onClick={doAction}>
              {t("common.confirm")}
            </Button>
          </div>
        }
      >
        <p className="text-sm text-ink-600">
          {confirm && (confirm.action === "suspend" ? `Suspend ${confirm.user.fullName}?` : `Activate ${confirm.user.fullName}?`)}
        </p>
      </Modal>
    </div>
  );
}

