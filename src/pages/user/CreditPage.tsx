import { useEffect, useState } from "react";
import { Plus, Wallet, TrendingDown, TrendingUp } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input, Select, Textarea } from "../../components/ui/Input";
import { creditService, paymentRequestService } from "../../services/api";
import { authService } from "../../services/auth";
import type { CreditTransaction, PaymentMethod } from "../../types";
import { useToast } from "../../components/ui/Toast";
import { Badge } from "../../components/ui/Badge";

export function CreditPage() {
  const { t, locale } = useI18n();
  const { toast } = useToast();
  const user = authService.getCurrentUser()!;
  const [history, setHistory] = useState<CreditTransaction[]>([]);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ amount: "", method: "" as PaymentMethod | "", reference: "", note: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    creditService.listMine().then(setHistory).catch(() => undefined);
  }, []);

  const totalAdded = history.filter((c) => c.type === "added").reduce((s, c) => s + c.amount, 0);
  const totalUsed = history.filter((c) => c.type === "used").reduce((s, c) => s + c.amount, 0);

  const methodOptions = [
    { value: "", label: t("credit.selectMethod") },
    { value: "cash", label: t("credit.methodCash") },
    { value: "card", label: t("credit.methodCard") },
    { value: "bank", label: t("credit.methodBank") },
    { value: "other", label: t("credit.methodOther") },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount < 10) {
      setError(t("credit.minAmount"));
      return;
    }
    if (!form.method || !form.reference) return;
    setSubmitting(true);
    await paymentRequestService.create({
      amount,
      method: form.method,
      reference: form.reference,
      note: form.note,
    });
    setSubmitting(false);
    setOpen(false);
    setForm({ amount: "", method: "", reference: "", note: "" });
    toast(t("credit.requestSubmitted"), "success");
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">{t("credit.title")}</h1>
          <p className="mt-1 text-sm text-ink-500">{t("credit.subtitle")}</p>
        </div>
        <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setOpen(true)}>
          {t("credit.addCreditTitle")}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardBody>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-ink-500">{t("credit.current")}</p>
                <p className="mt-2 text-3xl font-bold text-ink-900">{user.credit.toLocaleString()}</p>
              </div>
              <Wallet className="h-6 w-6 text-brand-600" />
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-ink-500">{t("credit.added")}</p>
                <p className="mt-2 text-3xl font-bold text-emerald-600">+{totalAdded.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-ink-500">{t("credit.used")}</p>
                <p className="mt-2 text-3xl font-bold text-ink-700">−{totalUsed.toLocaleString()}</p>
              </div>
              <TrendingDown className="h-6 w-6 text-ink-600" />
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-ink-900">{t("credit.history")}</h2>
        </CardHeader>
        <CardBody className="p-0">
          {history.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-ink-500">{t("credit.historyEmpty")}</p>
          ) : (
            <div className="divide-y divide-ink-100">
              {history.map((c) => (
                <div key={c.id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        c.type === "added" ? "bg-emerald-50 text-emerald-700" : "bg-ink-100 text-ink-700"
                      }`}
                    >
                      {c.type === "added" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink-900">{c.description}</p>
                      <p className="text-xs text-ink-500">{new Date(c.createdAt).toLocaleDateString(locale === "fa" || locale === "ps" ? "en-US" : "en-US")}</p>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className={`text-sm font-semibold ${c.type === "added" ? "text-emerald-600" : "text-ink-700"}`}>
                      {c.type === "added" ? "+" : "−"}{c.amount}
                    </p>
                    <Badge tone={c.type === "added" ? "success" : "neutral"}>
                      {c.type === "added" ? t("credit.added") : t("credit.used")}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t("credit.addCreditTitle")}
        description={t("credit.addCreditSub")}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="md" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button form="addCreditForm" type="submit" variant="primary" size="md" loading={submitting}>
              {t("credit.submit")}
            </Button>
          </div>
        }
      >
        <form id="addCreditForm" onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t("credit.amount")}
            type="number"
            required
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            error={error}
            placeholder="100"
          />
          <Select
            label={t("credit.paymentMethod")}
            required
            value={form.method}
            onChange={(e) => setForm({ ...form, method: e.target.value as PaymentMethod })}
            options={methodOptions}
          />
          <Input
            label={t("credit.reference")}
            required
            value={form.reference}
            onChange={(e) => setForm({ ...form, reference: e.target.value })}
            placeholder="TX-..."
          />
          <Textarea
            label={t("credit.note")}
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder={t("common.optional")}
            rows={3}
          />
        </form>
      </Modal>
    </div>
  );
}