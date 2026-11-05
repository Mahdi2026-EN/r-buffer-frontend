
import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { Card, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { StatusBadge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { DataTable, type Column } from "../../components/admin/DataTable";
import { useToast } from "../../components/ui/Toast";
import { authService } from "../../services/auth";
import { apiRequest, ApiError } from "../../services/http";
import type { User } from "../../types";
import { EmptyState } from "../../components/ui/States";

interface BackendUser {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  credit: number | string;
  createdAt: string;
  lastLoginAt?: string | null;
}

function mapBackendUser(raw: BackendUser): User {
  const statusMap: Record<string, User["status"]> = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "denied",
    SUSPENDED: "suspended",
  };

  return {
    id: String(raw.id),
    fullName: raw.fullName,
    email: raw.email,
    phone: raw.phone ?? "",
    role: raw.role === "ADMIN" ? "admin" : "user",
    status: statusMap[raw.status] || "pending",
    credit: Number(raw.credit || 0),
    createdAt: raw.createdAt,
    lastLogin: raw.lastLoginAt || undefined,
  };
}

export function RegistrationsPage() {
  const { t } = useI18n();
  const { toast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [confirm, setConfirm] = useState<{
    user: User;
    type: "approve" | "deny";
  } | null>(null);

  // Load real pending registrations from Spring Boot.
  useEffect(() => {
    let active = true;

    async function loadPendingUsers() {
      try {
        const token = authService.getToken();

        if (!token) {
          throw new Error("Please sign in again.");
        }

        const response = await apiRequest<BackendUser[]>(
          "/admin/users/pending",
          { method: "GET" },
          token,
        );

        if (active) {
          setUsers(response.map(mapBackendUser));
        }
      } catch (error) {
        if (active) {
          const message =
            error instanceof Error
              ? error.message
              : "Could not load registrations.";

          toast(message, "error");
        }
      } finally {
        if (active) {
          setLoadingUsers(false);
        }
      }
    }

    loadPendingUsers();

    return () => {
      active = false;
    };
  }, [toast]);

  const pending = users.filter(
    (u) => u.status === "pending" && u.role === "user",
  );

  // Approve or reject a user through the real backend.
  async function applyAction() {
    if (!confirm || actionLoading) return;

    setActionLoading(true);

    try {
      const token = authService.getToken();

      if (!token) {
        throw new Error("Please sign in again.");
      }

      const action =
        confirm.type === "approve" ? "approve" : "reject";

      await apiRequest(
        `/admin/users/${confirm.user.id}/${action}`,
        { method: "PATCH" },
        token,
      );

      setUsers((prev) =>
        prev.filter((u) => u.id !== confirm.user.id),
      );

      setConfirm(null);

      toast(
        confirm.type === "approve"
          ? "User approved successfully."
          : "User rejected successfully.",
        "success",
      );
    } catch (error) {
      let message = "Could not update the user's status.";

      if (error instanceof ApiError) {
        message = error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast(message, "error");
    } finally {
      setActionLoading(false);
    }
  }

  const columns: Column<User>[] = [
    {
      key: "name",
      header: t("admin.name"),
      cell: (u) => (
        <div>
          <p className="font-medium text-ink-900">
            {u.fullName}
          </p>
          <p className="text-xs text-ink-500">
            {u.email}
          </p>
        </div>
      ),
    },
    {
      key: "phone",
      header: t("admin.phone"),
      cell: (u) => u.phone || "—",
    },
    {
      key: "date",
      header: t("admin.registrationDate"),
      cell: (u) =>
        new Date(u.createdAt).toLocaleDateString(),
    },
    {
      key: "status",
      header: t("common.status"),
      cell: (u) => (
        <StatusBadge
          status={u.status}
          label={t("status.pending")}
        />
      ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      className: "text-end",
      cell: (u) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Check className="h-4 w-4" />}
            onClick={() =>
              setConfirm({ user: u, type: "approve" })
            }
          >
            {t("admin.approve")}
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<X className="h-4 w-4" />}
            onClick={() =>
              setConfirm({ user: u, type: "deny" })
            }
          >
            {t("admin.deny")}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
          {t("admin.registrations")}
        </h1>

        <p className="mt-1 text-sm text-ink-500">
          Review pending account registrations
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-ink-900">
            {loadingUsers ? "Loading..." : `${pending.length} pending`}
          </h2>
        </CardHeader>

        {loadingUsers ? (
          <div className="p-6 text-center text-sm text-ink-500">
            Loading registrations...
          </div>
        ) : (
          <DataTable
            columns={columns}
            rows={pending}
            empty={
              <EmptyState title="No pending registrations" />
            }
            rowKey={(u) => u.id}
          />
        )}
      </Card>

      <Modal
        open={!!confirm}
        onClose={() => {
          if (!actionLoading) setConfirm(null);
        }}
        title={
          confirm?.type === "approve"
            ? t("admin.approve")
            : t("admin.deny")
        }
        description={confirm?.user.fullName ?? ""}
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="md"
              disabled={actionLoading}
              onClick={() => setConfirm(null)}
            >
              {t("common.cancel")}
            </Button>

            <Button
              variant={
                confirm?.type === "approve"
                  ? "primary"
                  : "danger"
              }
              size="md"
              loading={actionLoading}
              onClick={applyAction}
            >
              {t("common.confirm")}
            </Button>
          </div>
        }
      >
        <div className="rounded-lg border border-ink-100 bg-ink-50 p-3 text-sm">
          <p className="text-xs text-ink-500">Email</p>
          <p className="font-medium text-ink-900">
            {confirm?.user.email}
          </p>
        </div>
      </Modal>
    </div>
  );
}
