import { useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/States";
import { mockUsers } from "../../services/mockData";
import { notificationService } from "../../services/api";
import type { Notification } from "../../types";
import { useToast } from "../../components/ui/Toast";
import { cn } from "../../utils/cn";

export function NotificationsPage() {
  const { t, locale } = useI18n();
  const { toast } = useToast();
  const user = mockUsers[0];
  const [items, setItems] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    notificationService.listByUser(user.id).then(setItems);
  }, [user.id]);

  const filtered = filter === "unread" ? items.filter((n) => !n.read) : items;

  async function markAll() {
    await notificationService.markAllRead(user.id);
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    toast("All notifications marked as read", "success");
  }

  async function markOne(id: string) {
    await notificationService.markRead(id);
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">{t("notifications.title")}</h1>
          <p className="mt-1 text-sm text-ink-500">{t("notifications.subtitle")}</p>
        </div>
        <Button variant="outline" size="sm" leftIcon={<CheckCheck className="h-4 w-4" />} onClick={markAll}>
          {t("notifications.markAll")}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            filter === "all" ? "bg-brand-100 text-brand-700" : "text-ink-600 hover:bg-ink-100",
          )}
        >
          {t("notifications.all")}
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            filter === "unread" ? "bg-brand-100 text-brand-700" : "text-ink-600 hover:bg-ink-100",
          )}
        >
          {t("notifications.unread")}
        </button>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState icon={<Bell className="h-6 w-6" />} title={t("notifications.noNotifications")} />
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-ink-900">
              {filtered.length} {filter === "unread" ? t("notifications.unread").toLowerCase() : ""}
            </h2>
          </CardHeader>
          <div className="divide-y divide-ink-100">
            {filtered.map((n) => (
              <button
                key={n.id}
                onClick={() => markOne(n.id)}
                className={cn(
                  "flex w-full items-start gap-3 px-5 py-4 text-start transition-colors hover:bg-ink-50",
                  !n.read && "bg-brand-50/40",
                )}
              >
                <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", n.read ? "bg-ink-300" : "bg-brand-500")} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink-900">{n.title[locale]}</p>
                  <p className="mt-1 text-sm text-ink-600">{n.body[locale]}</p>
                  <p className="mt-1 text-xs text-ink-400">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}