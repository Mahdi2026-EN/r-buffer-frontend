import { useEffect, useState } from "react";
import { Search, TrendingUp, TrendingDown } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Badge } from "../../components/ui/Badge";
import { creditService, userService } from "../../services/api";
import type { CreditTransaction, User } from "../../types";
import { useToast } from "../../components/ui/Toast";
import { ApiError } from "../../services/http";

export function AdminCreditPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState<CreditTransaction[]>([]);
  const [adjust, setAdjust] = useState<{ user: User; type: "add" | "remove"; amount: string; note: string } | null>(null);
  const [saving, setSaving] = useState(false);

  function reload() {
    userService.list().then(setUsers).catch(() => undefined);
    creditService.listAll().then(setHistory).catch(() => undefined);
  }

  useEffect(() => {
    reload();
  }, []);

  const customers = users.filter((u) => u.role === "user");
  const totalCredit = customers.reduce((s, u) => s + u.credit, 0);
  const filtered = customers.filter((u) =>
    `${u.fullName} ${u.email}`.toLowerCase().includes(search.toLowerCase()),
  );

  async function applyAdjustment() {
    if (!adjust || saving) return;
    const amount = parseFloat(adjust.amount);
    if (isNaN(amount) || amount <= 0) return;

    setSaving(true);
    try {
      await creditService.adjust(adjust.user.id, adjust.type, amount, adjust.note);
      setAdjust(null);
      toast(t("admin.success"), "success");
      reload();
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "Could not change the credit.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">{t("admin.credit")}</h1>
        <p className="mt-1 text-sm text-ink-500">{t("admin.overview")}</p>
      </div>

      <Card>
        <CardBody>
          <div className="grid gap-3 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("admin.searchPlaceholder")} leftIcon={<Search className="h-4 w-4" />} />
            </div>
            <div className="lg:col-span-4">
              <div className="rounded-lg bg-brand-50 p-3">
                <p className="text-xs text-brand-700">{t("admin.totalCredit")}</p>
                <p className="mt-0.5 text-2xl font-bold text-brand-900">{totalCredit.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardBody>
        <div className="divide-y divide-ink-100">
          {filtered.map((u) => (
            <div key={u.id} className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                  {u.fullName.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-900">{u.fullName}</p>
                  <p className="text-xs text-ink-500">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base font-bold text-ink-900">{u.credit.toLocaleString()}</span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" leftIcon={<TrendingUp className="h-4 w-4 text-emerald-600" />} onClick={() => setAdjust({ user: u, type: "add", amount: "", note: "" })}>
                    {t("admin.addCredit")}
                  </Button>
                  <Button variant="ghost" size="sm" leftIcon={<TrendingDown className="h-4 w-4 text-red-600" />} onClick={() => setAdjust({ user: u, type: "remove", amount: "", note: "" })}>
                    {t("admin.removeCredit")}
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="px-5 py-8 text-center text-sm text-ink-500">{t("admin.noUsers")}</p>}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-ink-900">{t("admin.creditActivity")}</h2>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-ink-100">
            {history.slice(0, 15).map((c) => (
              <div key={c.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-ink-900">{c.userName}</p>
                  <p className="text-xs text-ink-500">{c.description}</p>
                </div>
                <div className="text-end">
                  <p className={`text-sm font-semibold ${c.type === "added" ? "text-emerald-600" : "text-ink-700"}`}>
                    {c.type === "added" ? "+" : "−"}{c.amount}
                  </p>
                  <Badge tone={c.type === "added" ? "success" : "neutral"}>{new Date(c.createdAt).toLocaleString()}</Badge>
                </div>
              </div>
            ))}
            {history.length === 0 && <p className="px-5 py-8 text-center text-sm text-ink-500">{t("admin.noActivity")}</p>}
          </div>
        </CardBody>
      </Card>

      <Modal
        open={!!adjust}
        onClose={() => setAdjust(null)}
        title={adjust?.type === "add" ? t("admin.addCredit") : t("admin.removeCredit")}
        description={adjust?.user.fullName}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="md" onClick={() => setAdjust(null)}>{t("common.cancel")}</Button>
            <Button variant={adjust?.type === "add" ? "primary" : "danger"} size="md" onClick={applyAdjustment} loading={saving}>
              {t("common.confirm")}
            </Button>
          </div>
        }
      >
        {adjust && (
          <div className="space-y-3">
            <Input label={t("admin.amount")} type="number" min="0" value={adjust.amount} onChange={(e) => setAdjust({ ...adjust, amount: e.target.value })} />
            <Input label={t("admin.note")} value={adjust.note} onChange={(e) => setAdjust({ ...adjust, note: e.target.value })} placeholder={t("admin.reason")} />
          </div>
        )}
      </Modal>
    </div>
  );
}
