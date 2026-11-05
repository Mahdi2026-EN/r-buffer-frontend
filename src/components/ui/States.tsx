import { AlertCircle, Inbox, Loader2, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../utils/cn";
import { useI18n } from "../../i18n/I18nProvider";

export function LoadingState({ label, className }: { label?: string; className?: string }) {
  const { t } = useI18n();
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-ink-500", className)}>
      <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      {label && <p className="mt-3 text-sm">{label}</p>}
      {!label && <p className="mt-3 text-sm">{t("states.loading")}</p>}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  const { t } = useI18n();
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100 text-ink-500">
        {icon ?? <Inbox className="h-7 w-7" />}
      </div>
      <h3 className="mt-4 text-base font-semibold text-ink-800">{title ?? t("states.empty")}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink-500">{description ?? t("states.emptyDesc")}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title,
  description,
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  const { t } = useI18n();
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
        <AlertCircle className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-ink-800">{title ?? t("states.error")}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink-500">{description ?? t("states.errorDesc")}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
        >
          <RefreshCw className="h-4 w-4" />
          {t("states.retry")}
        </button>
      )}
    </div>
  );
}