import { useEffect, useState } from "react";
import { Users, Wallet, ShoppingBag, CheckCircle2, Clock4, AlertCircle, Package } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { StatCard } from "../../components/admin/StatCard";
import { useToast } from "../../components/ui/Toast";
import { statsService, type AdminStats } from "../../services/api";
import { ApiError } from "../../services/http";
import { LoadingState } from "../../components/ui/States";

export function AdminDashboardPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    statsService.get()
      .then(setStats)
      .catch((error) => {
        setLoadError(true);
        toast(error instanceof ApiError ? error.message : "Could not load dashboard information.", "error");
      })
      .finally(() => setLoading(false));
  }, []);

  const value = (n: number | string | undefined) => (loading ? "..." : loadError || n === undefined ? "—" : n);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">{t("admin.dashboard")}</h1>
        <p className="mt-1 text-sm text-ink-500">{t("admin.overview")}</p>
      </div>

      {loading && <LoadingState />}

      {!loading && stats && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={<Users className="h-5 w-5" />} label={t("admin.totalUsers")} value={value(stats.totalUsers)} tone="brand" />
            <StatCard icon={<Clock4 className="h-5 w-5" />} label={t("admin.pendingRegistrations")} value={value(stats.pendingUsers)} tone="warning" />
            <StatCard icon={<CheckCircle2 className="h-5 w-5" />} label={t("admin.approvedUsers")} value={value(stats.approvedUsers)} tone="success" />
            <StatCard icon={<Wallet className="h-5 w-5" />} label={t("admin.totalCredit")} value={stats.totalCredit.toLocaleString()} tone="info" />
            <StatCard icon={<AlertCircle className="h-5 w-5" />} label={t("admin.pendingPayments")} value={value(stats.pendingPayments)} tone="warning" />
            <StatCard icon={<ShoppingBag className="h-5 w-5" />} label={t("admin.totalOrders")} value={value(stats.totalOrders)} tone="brand" />
            <StatCard icon={<Clock4 className="h-5 w-5" />} label={t("admin.pendingOrders")} value={value(stats.pendingOrders)} tone="warning" />
            <StatCard icon={<Package className="h-5 w-5" />} label={t("admin.productsCount")} value={value(stats.productsCount)} tone="neutral" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <h2 className="text-base font-semibold text-ink-900">{t("admin.recentActivity")}</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {stats.productActivity.length === 0 && (
                    <p className="py-6 text-center text-sm text-ink-500">{t("dashboard.noOrders")}</p>
                  )}
                  {stats.productActivity.map((p) => (
                    <div key={p.name} className="flex items-center justify-between rounded-lg border border-ink-100 p-3">
                      <span className="text-sm font-medium text-ink-900">{p.name}</span>
                      <span className="text-sm text-ink-600">{p.value}</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-base font-semibold text-ink-900">{t("admin.completedOrders")}</h2>
              </CardHeader>
              <CardBody>
                <p className="text-4xl font-bold text-ink-900">{value(stats.completedOrders)}</p>
              </CardBody>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
