import { Link } from "react-router-dom";
import { cn } from "../../utils/cn";

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <Link to="/" className={cn("inline-flex items-center gap-2", className)}>
      <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-sm">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h10M4 17h16" />
        </svg>
        <div className="absolute -bottom-1 -end-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white" />
      </div>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="text-base font-bold tracking-tight text-ink-900">R-Buffer</span>
          <span className="text-[10px] uppercase tracking-wider text-ink-500">Digital Marketplace</span>
        </div>
      )}
    </Link>
  );
}