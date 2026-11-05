import { useState } from "react";
import { Save, Lock, User } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { StatusBadge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { mockUsers } from "../../services/mockData";
import { useToast } from "../../components/ui/Toast";

export function ProfilePage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const user = mockUsers[0];
  const [info, setInfo] = useState({ fullName: user.fullName, email: user.email, phone: user.phone });
  const [password, setPassword] = useState({ current: "", next: "", confirm: "" });

  function saveInfo(e: React.FormEvent) {
    e.preventDefault();
    toast(t("profile.profileUpdated"), "success");
  }

  function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (password.next !== password.confirm) return;
    setPassword({ current: "", next: "", confirm: "" });
    toast(t("profile.passwordUpdated"), "success");
  }

  const statusLabel =
    user.status === "approved"
      ? t("profile.statusApproved")
      : user.status === "pending"
        ? t("profile.statusPending")
        : user.status === "denied"
          ? t("profile.statusDenied")
          : t("profile.statusSuspended");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">{t("profile.title")}</h1>
        <p className="mt-1 text-sm text-ink-500">{t("profile.subtitle")}</p>
      </div>

      <Card>
        <CardHeader className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
            <User className="h-4 w-4" />
          </div>
          <h2 className="text-base font-semibold text-ink-900">{t("profile.personalInfo")}</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={saveInfo} className="space-y-4">
            <Input
              label={t("auth.fullName")}
              value={info.fullName}
              onChange={(e) => setInfo({ ...info, fullName: e.target.value })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label={t("auth.email")}
                type="email"
                value={info.email}
                onChange={(e) => setInfo({ ...info, email: e.target.value })}
              />
              <Input
                label={t("auth.phone")}
                type="tel"
                value={info.phone}
                onChange={(e) => setInfo({ ...info, phone: e.target.value })}
              />
            </div>
            <div className="grid gap-4 border-t border-ink-100 pt-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-ink-500">{t("profile.registrationDate")}</p>
                <p className="mt-1 text-sm text-ink-900">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-ink-500">{t("profile.accountStatus")}</p>
                <div className="mt-1">
                  <StatusBadge status={user.status} label={statusLabel} />
                </div>
              </div>
            </div>
            <Button type="submit" variant="primary" size="md" leftIcon={<Save className="h-4 w-4" />}>
              {t("profile.updateProfile")}
            </Button>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
            <Lock className="h-4 w-4" />
          </div>
          <h2 className="text-base font-semibold text-ink-900">{t("profile.changePassword")}</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={savePassword} className="space-y-4">
            <Input
              label={t("profile.currentPassword")}
              type="password"
              required
              value={password.current}
              onChange={(e) => setPassword({ ...password, current: e.target.value })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label={t("profile.newPassword")}
                type="password"
                required
                value={password.next}
                onChange={(e) => setPassword({ ...password, next: e.target.value })}
              />
              <Input
                label={t("profile.confirmNewPassword")}
                type="password"
                required
                value={password.confirm}
                onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                error={password.confirm && password.next !== password.confirm ? "Passwords do not match" : undefined}
              />
            </div>
            <Button type="submit" variant="primary" size="md" leftIcon={<Save className="h-4 w-4" />}>
              {t("profile.changePasswordButton")}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}