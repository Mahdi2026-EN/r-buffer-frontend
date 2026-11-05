import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface BaseProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  required?: boolean;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, BaseProps {}

const baseFieldClasses =
  "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 disabled:opacity-60 disabled:bg-ink-50";

export function Input({ label, error, hint, leftIcon, rightIcon, required, className, id, ...props }: InputProps) {
  const inputId = id ?? `input-${Math.random().toString(36).slice(2, 9)}`;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-ink-700">
          {label}
          {required && <span className="ms-1 text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-ink-400">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            baseFieldClasses,
            error ? "border-red-400 focus:border-red-500 focus:ring-red-500/30" : "border-ink-200",
            leftIcon && "ps-10",
            rightIcon && "pe-10",
            className,
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute inset-y-0 end-0 flex items-center pe-3 text-ink-400">{rightIcon}</span>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {hint && !error && <p className="text-xs text-ink-500">{hint}</p>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseProps {}

export function Textarea({ label, error, hint, required, className, id, ...props }: TextareaProps) {
  const inputId = id ?? `ta-${Math.random().toString(36).slice(2, 9)}`;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-ink-700">
          {label}
          {required && <span className="ms-1 text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        rows={4}
        className={cn(
          baseFieldClasses,
          error ? "border-red-400 focus:border-red-500 focus:ring-red-500/30" : "border-ink-200",
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      {hint && !error && <p className="text-xs text-ink-500">{hint}</p>}
    </div>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, BaseProps {
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  hint,
  required,
  options,
  placeholder,
  className,
  id,
  ...props
}: SelectProps) {
  const inputId = id ?? `sel-${Math.random().toString(36).slice(2, 9)}`;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-ink-700">
          {label}
          {required && <span className="ms-1 text-red-500">*</span>}
        </label>
      )}
      <select
        id={inputId}
        className={cn(
          baseFieldClasses,
          "appearance-none pe-10 bg-no-repeat bg-[length:16px_16px]",
          "bg-[url('data:image/svg+xml;utf8,<svg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%235f6b80%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]",
          "[background-position:end_0.75rem_center]",
          error ? "border-red-400 focus:border-red-500 focus:ring-red-500/30" : "border-ink-200",
          className,
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {hint && !error && <p className="text-xs text-ink-500">{hint}</p>}
    </div>
  );
}