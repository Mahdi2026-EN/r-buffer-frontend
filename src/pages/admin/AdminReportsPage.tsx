import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useI18n } from "../../i18n/I18nProvider";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Select } from "../../components/ui/Input";
import { statsService, type AdminStats } from "../../services/api";
import { useToast } from "../../components/ui/Toast";
import { ApiError } from "../../services/http";

type ReportKey = "users" | "orders" | "products" | "payments" | "credit";

export function AdminReportsPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [report, setReport] = useState<ReportKey>("orders");
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    statsService.get()
      .then(setStats)
      .catch((error) => toast(error instanceof ApiError ? error.message : "Could not load reports.", "error"));
  }, []);

  // Shape the daily series for the selected chart; the labels are the day of month
  const daily = (stats?.daily ?? []).map((d) => ({
    day: d.date.slice(5),
    orders: d.orders,
    registered: d.registered,
    added: Number(d.added),
    used: Number(d.used),
  }));

  const isBars = report === "products" || report === "payments" || report === "credit";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">{t("admin.reports")}</h1>
          <p className="mt-1 text-sm text-ink-500">{t("admin.overview")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={report}
            onChange={(e) => setReport(e.target.value as ReportKey)}
            options={[
              { value: "users", label: t("admin.reportsTab.users") },
              { value: "orders", label: t("admin.reportsTab.orders") },
              { value: "products", label: t("admin.reportsTab.products") },
              { value: "payments", label: t("admin.reportsTab.payments") },
              { value: "credit", label: t("admin.reportsTab.credit") },
            ]}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-ink-900">{t(`admin.reportsTab.${report}`)}</h2>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={360}>
            {report === "products" ? (
              <BarChart data={stats?.productActivity ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eceff3" />
                <XAxis dataKey="name" stroke="#828ea3" fontSize={12} />
                <YAxis stroke="#828ea3" fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#3a66f5" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : report === "credit" || report === "payments" ? (
              <BarChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eceff3" />
                <XAxis dataKey="day" stroke="#828ea3" fontSize={12} />
                <YAxis stroke="#828ea3" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="added" name={t("dashboard.addedThisMonth")} fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="used" name={t("dashboard.usedThisMonth")} fill="#3a66f5" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eceff3" />
                <XAxis dataKey="day" stroke="#828ea3" fontSize={12} />
                <YAxis stroke="#828ea3" fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey={report === "users" ? "registered" : "orders"}
                  stroke="#3a66f5"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
          {isBars && report === "products" && (stats?.productActivity.length ?? 0) === 0 && (
            <p className="mt-4 text-center text-sm text-ink-500">{t("dashboard.noOrders")}</p>
          )}
        </CardBody>
      </Card>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardBody>
              <p className="text-xs uppercase tracking-wider text-ink-500">{t("admin.totalUsers")}</p>
              <p className="mt-2 text-2xl font-bold text-ink-900">{stats.totalUsers}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-xs uppercase tracking-wider text-ink-500">{t("admin.totalOrders")}</p>
              <p className="mt-2 text-2xl font-bold text-ink-900">{stats.totalOrders}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-xs uppercase tracking-wider text-ink-500">{t("admin.totalCredit")}</p>
              <p className="mt-2 text-2xl font-bold text-ink-900">{stats.totalCredit.toLocaleString()}</p>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
