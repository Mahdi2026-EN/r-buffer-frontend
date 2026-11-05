import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "../../utils/cn";

type ToastType = "success" | "error" | "info";
type Toast = { id: number; type: ToastType; message: string };

type ToastContextType = {
  toast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  const iconFor = (type: ToastType) => {
    if (type === "success") return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
    if (type === "error") return <AlertCircle className="h-5 w-5 text-red-600" />;
    return <Info className="h-5 w-5 text-sky-600" />;
  };

  const bgFor = (type: ToastType) => {
    if (type === "success") return "bg-emerald-50 border-emerald-200";
    if (type === "error") return "bg-red-50 border-red-200";
    return "bg-sky-50 border-sky-200";
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-md fade-in",
              bgFor(t.type),
            )}
          >
            <div className="mt-0.5">{iconFor(t.type)}</div>
            <p className="flex-1 text-sm text-ink-800">{t.message}</p>
            <button
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              className="text-ink-400 hover:text-ink-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}