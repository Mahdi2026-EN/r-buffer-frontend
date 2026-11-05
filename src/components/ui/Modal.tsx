import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { cn } from "../../utils/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

export function Modal({ open, onClose, title, description, children, footer, size = "md" }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative w-full rounded-2xl bg-white shadow-2xl",
          sizeClasses[size],
        )}
      >
        {(title || description) && (
          <div className="flex items-start justify-between border-b border-ink-100 px-6 py-4">
            <div>
              {title && <h2 className="text-lg font-semibold text-ink-900">{title}</h2>}
              {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-ink-400 hover:text-ink-700 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="border-t border-ink-100 bg-ink-50/40 px-6 py-3 rounded-b-2xl">{footer}</div>}
      </div>
    </div>
  );
}