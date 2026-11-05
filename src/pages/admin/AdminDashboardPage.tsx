
import { useEffect, useState } from "react";
import {
  Users,
  Wallet,
  ShoppingBag,
  CheckCircle2,
  Clock4,
  AlertCircle,
  Package,
} from "lucide-react";

import { useI18n } from "../../i18n/I18nProvider";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { StatCard } from "../../components/admin/StatCard";
import { useToast } from "../../components/ui/Toast";
import { authService } from "../../services/auth";
import { apiRequest } from "../../services/http";

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

export function AdminDashboardPage() {
  const { t, locale } = useI18n();
  const { toast } = useToast();

  const [users, setUsers] = useState<BackendUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadDashboardUsers() {
      try {
        const token = authService.getToken();

        if (!token) {
          throw new Error("Please sign in again.");
        }

        const response = await apiRequest<BackendUser[]>(
          "/admin/users",
          { method: "GET" },
          token,
        );

        if (active) {
          setUsers(response);
          setLoadError(false);
        }
      } catch (error) {
        if (active) {
          setLoadError(true);

          toast(
            error instanceof Error
              ? error.message
              : "Could not load dashboard information.",
            "error",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboardUsers();

    return () => {
      active = false;
    };
  }, []);

  // Only count normal customer accounts, not administrators.
  const customerUsers = users.filter(
    (user) => user.role === "USER",
  );

  const totalUsers = customerUsers.length;

  const pendingUsers = customerUsers.filter(
    (user) => user.status === "PENDING",
  ).length;

  const approvedUsers = customerUsers.filter(
    (user) => user.status === "APPROVED",
  ).length;

  const totalCredit = customerUsers.reduce(
    (sum, user) => sum + Number(user.credit || 0),
    0,
  );

  const statValue = (value: number | string) => {
    if (loading) return "...";
    if (loadError) return "—";
    return value;
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
          {t("admin.dashboard")}
        </h1>

        <p className="mt-1 text-sm text-ink-500">
          {t("admin.overview")}
        </p>
      </div>

      {/* Real user statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label={t("admin.totalUsers")}
          value={statValue(totalUsers)}
          tone="brand"
        />

        <StatCard
          icon={<Clock4 className="h-5 w-5" />}
          label={t("admin.pendingRegistrations")}
          value={statValue(pendingUsers)}
          tone="warning"
        />

        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label={t("admin.approvedUsers")}
          value={statValue(approvedUsers)}
          tone="success"
        />

        <StatCard
          icon={<Wallet className="h-5 w-5" />}
          label={t("admin.totalCredit")}
          value={
            loading || loadError
              ? statValue("—")
              : totalCredit.toLocaleString()
          }
          tone="info"
        />

        {/* Not connected to real backend data yet */}
        <StatCard
          icon={<AlertCircle className="h-5 w-5" />}
          label={t("admin.pendingPayments")}
          value="—"
          tone="warning"
        />

        <StatCard
          icon={<ShoppingBag className="h-5 w-5" />}
          label={t("admin.totalOrders")}
          value="—"
          tone="brand"
        />

        <StatCard
          icon={<Clock4 className="h-5 w-5" />}
          label={t("admin.pendingOrders")}
          value="—"
          tone="warning"
        />

        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label={t("admin.completedOrders")}
          value="—"
          tone="success"
        />

        <StatCard
          icon={<Package className="h-5 w-5" />}
          label={t("admin.productsCount")}
          value="—"
          tone="neutral"
        />
      </div>

      {/* Charts: real historical data is not connected yet */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[
          t("admin.ordersChart"),
          t("admin.creditChart"),
          t("admin.usersChart"),
          t("admin.productActivity"),
        ].map((title) => (
          <Card key={title}>
            <CardHeader>
              <h2 className="text-base font-semibold text-ink-900">
                {title}
              </h2>
            </CardHeader>

            <CardBody>
              <div className="flex h-[260px] items-center justify-center text-center text-sm text-ink-500">
                Real chart data is not connected yet.
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Recent activity: waiting for real order/payment endpoints */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-ink-900">
              {t("admin.recentActivity")}
            </h2>
          </CardHeader>

          <CardBody>
            <p className="py-6 text-center text-sm text-ink-500">
              No real order activity available yet.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-ink-900">
              {t("admin.pendingPayments")}
            </h2>
          </CardHeader>

          <CardBody>
            <p className="py-6 text-center text-sm text-ink-500">
              No real payment information available yet.
            </p>
          </CardBody>
        </Card>
      </div>

      <p className="text-center text-xs text-ink-400">
        {locale === "fa"
          ? "داده‌های داشبورد از پایگاه داده دریافت می‌شوند"
          : locale === "ps"
            ? "د ډشبورډ معلومات له ډیټابیس څخه ترلاسه کېږي"
            : "Dashboard user statistics are retrieved from the database"}
      </p>
    </div>
  );
}
