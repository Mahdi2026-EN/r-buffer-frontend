import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "brand";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-ink-100 text-ink-700 ring-ink-200",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  danger: "bg-red-50 text-red-700 ring-red-200",
  info: "bg-sky-50 text-sky-700 ring-sky-200",
  brand: "bg-brand-50 text-brand-700 ring-brand-200",
};

export function Badge({
  tone = "neutral",
  children,
  className,
  leftIcon,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  leftIcon?: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        toneClasses[tone],
        className,
      )}
    >
      {leftIcon}
      {children}
    </span>
  );
}

type Status = "pending" | "approved" | "rejected" | "suspended" | "denied" | "processing" | "completed" | "cancelled" | "active" | "inactive";

const statusMap: Record<Status, { tone: Tone; dot: string }> = {
  pending: { tone: "warning", dot: "bg-amber-500" },
  approved: { tone: "success", dot: "bg-emerald-500" },
  rejected: { tone: "danger", dot: "bg-red-500" },
  suspended: { tone: "neutral", dot: "bg-ink-400" },
  denied: { tone: "danger", dot: "bg-red-500" },
  processing: { tone: "info", dot: "bg-sky-500" },
  completed: { tone: "success", dot: "bg-emerald-500" },
  cancelled: { tone: "neutral", dot: "bg-ink-400" },
  active: { tone: "success", dot: "bg-emerald-500" },
  inactive: { tone: "neutral", dot: "bg-ink-400" },
};

export function StatusBadge({ status, label }: { status: Status; label: string }) {
  const cfg = statusMap[status];
  return (
    <Badge tone={cfg.tone}>
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {label}
    </Badge>
  );
}