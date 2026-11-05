import { Link } from "react-router-dom";
import { Home, SearchX } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { Button } from "../../components/ui/Button";

export function NotFoundPage() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-100 text-ink-500">
          <SearchX className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-ink-900">{t("states.notFound")}</h1>
        <p className="mt-2 text-sm text-ink-500">{t("states.notFoundDesc")}</p>
        <Link to="/" className="mt-6 inline-block">
          <Button variant="primary" size="md" leftIcon={<Home className="h-4 w-4" />}>
            {t("states.goHome")}
          </Button>
        </Link>
      </div>
    </div>
  );
}