"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import clsx from "clsx";

export interface VirtualTableColumn<T> {
  id: string;
  header: string;
  accessor: (row: T, index: number) => React.ReactNode;
  width?: number | string;
  className?: string;
}

export interface VirtualTableProps<T> {
  data: T[];
  columns: VirtualTableColumn<T>[];
  rowHeight?: number;
  containerHeight?: number;
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: T, index: number) => string);
  onRowClick?: (row: T, index: number) => void;
  getRowKey?: (row: T, index: number) => string | number;
  emptyMessage?: string;
}

/**
 * VirtualTable - Efficiently renders large tables using virtual scrolling
 * Only renders visible rows, perfect for thousands of rows
 */
export function VirtualTable<T extends Record<string, any>>({
  data,
  columns,
  rowHeight = 48,
  containerHeight = 400,
  className,
  headerClassName,
  rowClassName,
  onRowClick,
  getRowKey,
  emptyMessage = "No data available",
}: VirtualTableProps<T>) {
  const getRowClass = React.useCallback(
    (row: T, index: number) => {
      if (typeof rowClassName === "function") {
        return rowClassName(row, index);
      }
      return rowClassName;
    },
    [rowClassName]
  );

  const renderRow = React.useCallback(
    (row: T, index: number) => {
      const rowKey = getRowKey ? getRowKey(row, index) : index;
      const rowClass = getRowClass(row, index);

      return (
        <TableRow
          key={rowKey}
          className={clsx(
            onRowClick && "cursor-pointer hover:bg-[color:var(--color-surface-2)]",
            rowClass
          )}
          onClick={() => onRowClick?.(row, index)}
        >
          {columns.map((column) => (
            <TableCell
              key={column.id}
              className={column.className}
              style={column.width ? { width: column.width } : undefined}
            >
              {column.accessor(row, index)}
            </TableCell>
          ))}
        </TableRow>
      );
    },
    [columns, getRowClass, onRowClick, getRowKey]
  );

  if (data.length === 0) {
    return (
      <div className={clsx("rounded-[var(--radius-md)] border border-[color:var(--color-fg-muted)]", className)}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className={headerClassName}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        </Table>
        <div className="p-8 text-center text-[color:var(--color-fg-muted)]">
          {emptyMessage}
        </div>
      </div>
    );
  }

  // Virtual scrolling implementation
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = React.useState(0);
  const overscan = 5;

  // Calculate visible range
  const visibleRange = React.useMemo(() => {
    const start = scrollTop;
    const end = scrollTop + containerHeight;
    const startIndex = Math.max(0, Math.floor(start / rowHeight) - overscan);
    const endIndex = Math.min(data.length - 1, Math.ceil(end / rowHeight) + overscan);
    return { start: startIndex, end: endIndex };
  }, [scrollTop, containerHeight, rowHeight, data.length, overscan]);

  // Total height for scroll container
  const totalHeight = data.length * rowHeight;

  // Handle scroll
  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Render visible rows
  const visibleRows = React.useMemo(() => {
    const rows: Array<{ row: T; index: number; offset: number }> = [];
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      rows.push({
        row: data[i],
        index: i,
        offset: i * rowHeight,
      });
    }
    return rows;
  }, [data, visibleRange, rowHeight]);

  return (
    <div className={clsx("rounded-[var(--radius-md)] border border-[color:var(--color-fg-muted)]", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.id}
                className={headerClassName}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
      </Table>
      <div
        ref={containerRef}
        className="border-t border-[color:var(--color-fg-muted)]"
        style={{ height: containerHeight, overflow: "auto" }}
        onScroll={handleScroll}
      >
        <div style={{ minHeight: totalHeight }}>
          <Table>
            <TableBody>
              {/* Render only visible rows for performance with large datasets */}
              {visibleRows.map(({ row, index }) => {
                const rowKey = getRowKey ? getRowKey(row, index) : index;
                return renderRow(row, index);
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

