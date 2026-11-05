import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-xl border border-ink-200 bg-white shadow-sm", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("border-b border-ink-100 px-5 py-4", className)}>
      {children}
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

export function CardFooter({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("border-t border-ink-100 px-5 py-3 bg-ink-50/40 rounded-b-xl", className)}>{children}</div>;
}