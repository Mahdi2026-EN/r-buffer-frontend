import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

export interface Column<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  empty,
  rowKey,
}: {
  columns: Column<T>[];
  rows: T[];
  empty: ReactNode;
  rowKey: (row: T) => string;
}) {
  return (
    <div className="overflow-hidden">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead className="border-b border-ink-100 bg-ink-50/50">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={cn("px-5 py-3 text-start text-xs font-medium uppercase tracking-wider text-ink-500", c.className)}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-sm text-ink-500">
                  {empty}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={rowKey(row)} className="transition-colors hover:bg-ink-50/50">
                  {columns.map((c) => (
                    <td key={c.key} className={cn("px-5 py-3.5 text-sm text-ink-700", c.className)}>
                      {c.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Mobile cards */}
      <div className="divide-y divide-ink-100 md:hidden">
        {rows.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-ink-500">{empty}</div>
        ) : (
          rows.map((row) => (
            <div key={rowKey(row)} className="space-y-2 px-5 py-4">
              {columns.map((c, i) => (
                <div key={c.key} className="flex justify-between gap-3 text-sm">
                  {i === 0 ? (
                    <span className="font-semibold text-ink-900">{c.cell(row)}</span>
                  ) : (
                    <>
                      <span className="text-ink-500">{c.header}</span>
                      <span className="text-ink-700">{c.cell(row)}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}