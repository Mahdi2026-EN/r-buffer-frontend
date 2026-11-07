import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, CreditCard, Package, Plus, Wallet } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { StatusBadge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { creditService, notificationService, orderService, paymentRequestService } from "../../services/api";
import { authService } from "../../services/auth";
import type { CreditTransaction, Notification, Order, PaymentRequest } from "../../types";

export function DashboardPage() {
  const { t, locale } = useI18n();
  const [user, setUser] = useState(authService.getCurrentUser()!);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentPayments, setRecentPayments] = useState<PaymentRequest[]>([]);
  const [credit, setCredit] = useState<CreditTransaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    orderService.listMine().then((o) => setRecentOrders(o.slice(0, 4))).catch(() => undefined);
    paymentRequestService.listMine().then((p) => setRecentPayments(p.slice(0, 4))).catch(() => undefined);
    creditService.listMine().then(setCredit).catch(() => undefined);
    notificationService.listMine().then(setNotifications).catch(() => undefined);
    authService.me().then(setUser).catch(() => undefined);
  }, []);

  // Totals for the current calendar month
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const thisMonth = credit.filter((c) => new Date(c.createdAt) >= monthStart);
  const addedThisMonth = thisMonth.filter((c) => c.type === "added").reduce((s, c) => s + c.amount, 0);
  const usedThisMonth = thisMonth.filter((c) => c.type === "used").reduce((s, c) => s + c.amount, 0);

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

  const methodLabel = (m: PaymentRequest["method"]) =>
    m === "cash" ? t("credit.methodCash") : m === "card" ? t("credit.methodCard") : m === "bank" ? t("credit.methodBank") : t("credit.methodOther");

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
          {t("dashboard.welcome")}, {user.fullName.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-ink-500">{t("dashboard.welcomeSub")}</p>
      </div>

      {/* Credit card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 p-6 text-white sm:p-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/70">{t("dashboard.currentCredit")}</p>
              <p className="mt-2 text-4xl font-bold sm:text-5xl">{(user.credit ?? 0).toLocaleString()}</p>
              <p className="mt-1 text-xs text-white/70">{t("products.credits")}</p>
            </div>
            <Wallet className="h-10 w-10 text-white/30" />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/20 pt-5">
            <div>
              <p className="text-xs text-white/70">{t("dashboard.addedThisMonth")}</p>
              <p className="mt-1 text-lg font-semibold">+{addedThisMonth.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-white/70">{t("dashboard.usedThisMonth")}</p>
              <p className="mt-1 text-lg font-semibold">−{usedThisMonth.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-6">
            <Link to="/credit">
              <Button variant="secondary" size="sm" leftIcon={<Plus className="h-4 w-4" />} className="!bg-white !text-brand-700 hover:!bg-brand-50">
                {t("dashboard.addCredit")}
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-ink-900">{t("dashboard.quickActions")}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { to: "/credit", icon: <CreditCard className="h-5 w-5" />, label: t("dashboard.addCredit") },
            { to: "/products", icon: <Package className="h-5 w-5" />, label: t("dashboard.browseProducts") },
            { to: "/orders", icon: <Package className="h-5 w-5" />, label: t("dashboard.myOrders") },
            { to: "/payment-requests", icon: <CreditCard className="h-5 w-5" />, label: t("dashboard.paymentRequests") },
          ].map((a, i) => (
            <Link
              key={i}
              to={a.to}
              className="group flex items-center justify-between rounded-xl border border-ink-200 bg-white p-4 transition-all hover:border-brand-300 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  {a.icon}
                </div>
                <span className="text-sm font-medium text-ink-900">{a.label}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-ink-400 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-ink-900">{t("dashboard.recentOrders")}</h2>
            <Link to="/orders" className="text-xs font-medium text-brand-700 hover:text-brand-800">
              {t("dashboard.viewAll")}
            </Link>
          </CardHeader>
          <CardBody>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-ink-500">{t("dashboard.noOrders")}</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((o) => (
                  <Link
                    key={o.id}
                    to={`/orders/${o.id}`}
                    className="flex items-center justify-between rounded-lg border border-ink-100 p-3 hover:bg-ink-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-ink-900">{o.id}</p>
                      <p className="text-xs text-ink-500">{o.items[0].productName[locale]}</p>
                    </div>
                    <div className="text-end">
                      <StatusBadge status={o.status} label={statusLabel(o.status)} />
                      <p className="mt-1 text-xs text-ink-500">{o.total} {t("products.credits")}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-ink-900">{t("dashboard.recentPayments")}</h2>
            <Link to="/payment-requests" className="text-xs font-medium text-brand-700 hover:text-brand-800">
              {t("dashboard.viewAll")}
            </Link>
          </CardHeader>
          <CardBody>
            {recentPayments.length === 0 ? (
              <p className="text-sm text-ink-500">{t("dashboard.noPayments")}</p>
            ) : (
              <div className="space-y-3">
                {recentPayments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg border border-ink-100 p-3">
                    <div>
                      <p className="text-sm font-medium text-ink-900">+{p.amount}</p>
                      <p className="text-xs text-ink-500">{methodLabel(p.method)} · {p.reference}</p>
                    </div>
                    <StatusBadge status={p.status} label={p.status === "pending" ? t("status.pending") : p.status === "approved" ? t("status.approved") : t("status.rejected")} />
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Notifications preview */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink-900">{t("dashboard.notifications")}</h2>
          <Link to="/notifications" className="text-xs font-medium text-brand-700 hover:text-brand-800">
            {t("dashboard.viewAll")}
          </Link>
        </CardHeader>
        <CardBody>
          <div className="space-y-2">
            {notifications.length === 0 && (
              <p className="py-4 text-center text-sm text-ink-500">{t("notifications.noNotifications")}</p>
            )}
            {notifications
              .slice(0, 3)
              .map((n) => (
                <div key={n.id} className="flex items-start gap-3 rounded-lg p-3 hover:bg-ink-50">
                  <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-ink-300" : "bg-brand-500"}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink-900">{n.title[locale]}</p>
                    <p className="text-xs text-ink-500">{n.body[locale]}</p>
                  </div>
                </div>
              ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}