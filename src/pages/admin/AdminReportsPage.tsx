import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useI18n } from "../../i18n/I18nProvider";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Input";
import { useState } from "react";
import { creditChartData, ordersChartData, productActivityData, userChartData } from "../../services/mockData";

type ReportKey = "users" | "orders" | "products" | "payments" | "credit";

export function AdminReportsPage() {
  const { t } = useI18n();
  const [report, setReport] = useState<ReportKey>("orders");

  const data: any = {
    users: userChartData,
    orders: ordersChartData,
    payments: creditChartData,
    credit: creditChartData,
    products: productActivityData,
  }[report];

  const isMulti = report === "credit" || report === "payments";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">{t("admin.reports")}</h1>
          <p className="mt-1 text-sm text-ink-500">View detailed reports across all platform activity</p>
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
          <Button variant="outline" size="md">{t("admin.reportsTab.export")}</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-ink-900 capitalize">{report} Report</h2>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={360}>
            {isMulti ? (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eceff3" />
                <XAxis dataKey="month" stroke="#828ea3" fontSize={12} />
                <YAxis stroke="#828ea3" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="added" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="used" fill="#3a66f5" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eceff3" />
                <XAxis dataKey="month" stroke="#828ea3" fontSize={12} />
                <YAxis stroke="#828ea3" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey={report === "users" ? "registered" : "orders"} stroke="#3a66f5" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardBody>
            <p className="text-xs uppercase tracking-wider text-ink-500">This Month</p>
            <p className="mt-2 text-2xl font-bold text-ink-900">+24%</p>
            <p className="mt-1 text-xs text-emerald-600">↑ Growth vs last month</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs uppercase tracking-wider text-ink-500">Total Records</p>
            <p className="mt-2 text-2xl font-bold text-ink-900">1,234</p>
            <p className="mt-1 text-xs text-ink-500">All time</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs uppercase tracking-wider text-ink-500">Active</p>
            <p className="mt-2 text-2xl font-bold text-ink-900">892</p>
            <p className="mt-1 text-xs text-ink-500">Currently active</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}