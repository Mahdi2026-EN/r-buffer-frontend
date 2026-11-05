import { useState } from "react";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { Card, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input, Textarea } from "../../components/ui/Input";
import { useToast } from "../../components/ui/Toast";

export function ContactPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    toast(t("contact.sent"), "success");
    setForm({ name: "", email: "", subject: "", message: "" });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">{t("contact.title")}</h1>
        <p className="mt-3 text-base text-ink-500">{t("contact.subtitle")}</p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardBody className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-ink-500">{t("contact.address")}</p>
                <p className="mt-1 text-sm text-ink-800">Kabul, Afghanistan</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-ink-500">{t("contact.phone")}</p>
                <p className="mt-1 text-sm text-ink-800">+93 700 000 000</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-ink-500">{t("contact.emailLabel")}</p>
                <p className="mt-1 text-sm text-ink-800">support@rbuffer.io</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-ink-500">{t("contact.hours")}</p>
                <p className="mt-1 text-sm text-ink-800">{t("contact.officeHours")}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label={t("contact.name")}
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Input
                  label={t("contact.email")}
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <Input
                label={t("contact.subject")}
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
              <Textarea
                label={t("contact.message")}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={5}
              />
              <Button type="submit" variant="primary" size="md" loading={loading} leftIcon={<Send className="h-4 w-4" />}>
                {t("contact.send")}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}