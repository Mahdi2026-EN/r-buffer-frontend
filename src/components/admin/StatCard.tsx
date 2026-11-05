import type { ReactNode } from "react";
import { Card, CardBody } from "../ui/Card";
import { cn } from "../../utils/cn";

const toneClasses = {
  brand: "bg-brand-50 text-brand-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
  info: "bg-sky-50 text-sky-700",
  neutral: "bg-ink-100 text-ink-700",
};

export function StatCard({
  icon,
  label,
  value,
  trend,
  tone = "brand",
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: { value: string; positive: boolean };
  tone?: keyof typeof toneClasses;
}) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-ink-500">{label}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-ink-900">{value}</p>
            {trend && (
              <p className={cn("mt-1 text-xs font-medium", trend.positive ? "text-emerald-600" : "text-red-600")}>
                {trend.value}
              </p>
            )}
          </div>
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", toneClasses[tone])}>{icon}</div>
        </div>
      </CardBody>
    </Card>
  );
}