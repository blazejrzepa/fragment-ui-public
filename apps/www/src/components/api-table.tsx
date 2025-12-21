import * as React from "react";

interface ApiTableColumn {
  header: string;
  accessor: string;
  className?: string;
}

interface ApiTableRow {
  [key: string]: React.ReactNode;
}

interface ApiTableProps {
  columns: ApiTableColumn[];
  data: ApiTableRow[];
  className?: string;
}

/**
 * ApiTable - Reusable component for API reference tables
 * Follows Design System standards with proper tokens and Tailwind classes
 */
export function ApiTable({ columns, data, className }: ApiTableProps) {
  return (
    <div className={`mt-[var(--space-4)] border border-[color:var(--color-border-base)] rounded-[var(--radius-lg)] overflow-hidden ${className || ""}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[color:var(--color-border-base)]">
            {columns.map((column) => (
              <th
                key={column.accessor}
                className={`text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)] font-semibold ${column.className || ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-[color:var(--color-border-base)] last:border-b-0"
            >
              {columns.map((column) => (
                <td
                  key={column.accessor}
                  className={`py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)] ${column.className || ""}`}
                >
                  {row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

