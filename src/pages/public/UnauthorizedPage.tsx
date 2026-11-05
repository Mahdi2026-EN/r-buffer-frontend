import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { Button } from "../../components/ui/Button";

export function UnauthorizedPage() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-ink-900">{t("states.unauthorized")}</h1>
        <p className="mt-2 text-sm text-ink-500">{t("states.unauthorizedDesc")}</p>
        <Link to="/" className="mt-6 inline-block">
          <Button variant="primary" size="md">
            {t("states.goHome")}
          </Button>
        </Link>
      </div>
    </div>
  );
}