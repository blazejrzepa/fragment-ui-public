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
import { Checkbox } from "./checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { Input } from "./input";
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, GripVertical } from "lucide-react";
import clsx from "clsx";

export type SortDirection = "asc" | "desc" | null;

// Separate component for row actions to ensure stable IDs for hydration
function RowActionsMenu<T extends Record<string, any>>({
  row,
  index,
  rowKey,
  actions,
}: {
  row: T;
  index: number;
  rowKey: string | number;
  actions: RowAction<T>[];
}) {
  const menuId = React.useId();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild suppressHydrationWarning>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action, actionIndex) => {
          const disabled = action.disabled?.(row, index) ?? false;
          return (
            <DropdownMenuItem
              key={actionIndex}
              disabled={disabled}
              onClick={() => action.onClick(row, index)}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export interface DataTableColumn<T> {
  id: string;
  header: string;
  accessor: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  className?: string;
  headerClassName?: string;
  cellClassName?: string | ((row: T, index: number) => string);
}

export interface RowAction<T> {
  label: string;
  onClick: (row: T, index: number) => void;
  disabled?: (row: T, index: number) => boolean;
  icon?: React.ReactNode;
}

export interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowKey?: (row: T, index: number) => string | number;
  selectable?: boolean;
  selectedRows?: Set<string | number>;
  onSelectionChange?: (selected: Set<string | number>) => void;
  sortable?: boolean;
  defaultSort?: { columnId: string; direction: SortDirection };
  onSortChange?: (columnId: string | null, direction: SortDirection) => void;
  filterable?: boolean;
  filters?: Record<string, string>;
  onFilterChange?: (filters: Record<string, string>) => void;
  resizable?: boolean;
  rowActions?: RowAction<T>[];
  onRowClick?: (row: T, index: number) => void;
  emptyMessage?: string;
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: T, index: number) => string);
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  getRowKey,
  selectable = false,
  selectedRows: controlledSelectedRows,
  onSelectionChange,
  sortable = false,
  defaultSort,
  onSortChange,
  filterable = false,
  filters: controlledFilters,
  onFilterChange,
  resizable = false,
  rowActions,
  onRowClick,
  emptyMessage = "No data available",
  className,
  headerClassName,
  rowClassName,
}: DataTableProps<T>) {
  const [internalSelectedRows, setInternalSelectedRows] = React.useState<Set<string | number>>(new Set());
  const [internalSort, setInternalSort] = React.useState<{ columnId: string; direction: SortDirection } | null>(
    defaultSort ? { columnId: defaultSort.columnId, direction: defaultSort.direction } : null
  );
  const [internalFilters, setInternalFilters] = React.useState<Record<string, string>>({});
  const [columnWidths, setColumnWidths] = React.useState<Record<string, number>>({});
  const [resizingColumn, setResizingColumn] = React.useState<string | null>(null);

  const selectedRows = controlledSelectedRows ?? internalSelectedRows;
  const setSelectedRows = onSelectionChange
    ? (newSelected: Set<string | number>) => onSelectionChange(newSelected)
    : setInternalSelectedRows;

  const filters = controlledFilters ?? internalFilters;
  const setFilters = onFilterChange
    ? (newFilters: Record<string, string>) => onFilterChange(newFilters)
    : setInternalFilters;

  // Get row key
  const getKey = React.useCallback(
    (row: T, index: number): string | number => {
      if (getRowKey) return getRowKey(row, index);
      if ("id" in row && (typeof row.id === "string" || typeof row.id === "number")) return row.id;
      return index;
    },
    [getRowKey]
  );

  // Filter data
  const filteredData = React.useMemo(() => {
    if (!filterable || Object.keys(filters).length === 0) return data;

    return data.filter((row) => {
      return columns.every((column) => {
        if (!column.filterable || !filters[column.id]) return true;
        const value = column.accessor(row, 0);
        const filterValue = filters[column.id].toLowerCase();
        return String(value).toLowerCase().includes(filterValue);
      });
    });
  }, [data, filters, columns, filterable]);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortable || !internalSort || !internalSort.direction) return filteredData;

    const column = columns.find((col) => col.id === internalSort!.columnId);
    if (!column || !column.sortable) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = column.accessor(a, 0);
      const bValue = column.accessor(b, 0);

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;

      return internalSort!.direction === "asc" ? comparison : -comparison;
    });
  }, [filteredData, internalSort, columns, sortable]);

  // Selection handlers
  const handleSelectAll = React.useCallback(() => {
    const allKeys = sortedData.map((row, index) => getKey(row, index));
    if (selectedRows.size === sortedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(allKeys));
    }
  }, [sortedData, selectedRows, setSelectedRows, getKey]);

  const handleSelectRow = React.useCallback(
    (rowKey: string | number) => {
      const newSelected = new Set(selectedRows);
      if (newSelected.has(rowKey)) {
        newSelected.delete(rowKey);
      } else {
        newSelected.add(rowKey);
      }
      setSelectedRows(newSelected);
    },
    [selectedRows, setSelectedRows]
  );

  // Sort handlers
  const handleSort = React.useCallback(
    (columnId: string) => {
      const column = columns.find((col) => col.id === columnId);
      if (!column || !column.sortable) return;

      let newDirection: SortDirection = "asc";
      if (internalSort?.columnId === columnId) {
        if (internalSort.direction === "asc") {
          newDirection = "desc";
        } else if (internalSort.direction === "desc") {
          newDirection = null;
        }
      }

      const newSort = newDirection ? { columnId, direction: newDirection } : null;
      setInternalSort(newSort);
      onSortChange?.(columnId, newDirection);
    },
    [internalSort, columns, onSortChange]
  );

  // Filter handlers
  const handleFilterChange = React.useCallback(
    (columnId: string, value: string) => {
      const newFilters = { ...filters };
      if (value) {
        newFilters[columnId] = value;
      } else {
        delete newFilters[columnId];
      }
      setFilters(newFilters);
    },
    [filters, setFilters]
  );

  // Resize handlers
  const handleResizeStart = React.useCallback(
    (e: React.MouseEvent, columnId: string) => {
      e.preventDefault();
      setResizingColumn(columnId);
      const startX = e.clientX;
      const column = columns.find((col) => col.id === columnId);
      const startWidth = columnWidths[columnId] || (column?.width ? Number(column.width) : 150);

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const diff = moveEvent.clientX - startX;
        const newWidth = Math.max(column?.minWidth || 50, Math.min(column?.maxWidth || 1000, startWidth + diff));
        setColumnWidths((prev) => ({ ...prev, [columnId]: newWidth }));
      };

      const handleMouseUp = () => {
        setResizingColumn(null);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [columns, columnWidths]
  );

  // Get row class
  const getRowClass = React.useCallback(
    (row: T, index: number): string => {
      if (typeof rowClassName === "function") {
        return rowClassName(row, index);
      }
      return rowClassName || "";
    },
    [rowClassName]
  );

  const allSelected = sortedData.length > 0 && selectedRows.size === sortedData.length;
  const someSelected = selectedRows.size > 0 && selectedRows.size < sortedData.length;

  return (
    <div className={clsx("w-full", className)}>
      {/* Filters */}
      {filterable && (
        <div className="mb-4 flex gap-2 flex-wrap">
          {columns
            .filter((col) => col.filterable)
            .map((column) => (
              <Input
                key={column.id}
                placeholder={`Filter ${column.header}...`}
                value={filters[column.id] || ""}
                onChange={(e) => handleFilterChange(column.id, e.target.value)}
                className="w-[200px]"
              />
            ))}
        </div>
      )}

      <div className="rounded-md border border-[color:var(--color-border-base)] mt-2.5 mb-2.5">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12 pl-4">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                    className={clsx(
                      someSelected && "data-[state=checked]:bg-[color:var(--color-brand-primary)] data-[state=checked]:border-[color:var(--color-brand-primary)]",
                      !allSelected && !someSelected && "data-[state=checked]:bg-[color:var(--color-brand-primary)] data-[state=checked]:border-[color:var(--color-brand-primary)]"
                    )}
                  />
                </TableHead>
              )}
              {rowActions && <TableHead className="w-12" />}
              {columns.map((column) => {
                const columnWidth = columnWidths[column.id] || column.width;
                const isSorted = internalSort?.columnId === column.id;
                const sortDirection = isSorted ? internalSort.direction : null;

                return (
                  <TableHead
                    key={column.id}
                    className={clsx(
                      column.sortable && "cursor-pointer select-none",
                      column.headerClassName,
                      headerClassName
                    )}
                    style={columnWidth ? { width: columnWidth } : undefined}
                  >
                    <div className="flex items-center gap-2">
                      {column.sortable ? (
                        <button
                          onClick={() => handleSort(column.id)}
                          className="flex items-center gap-1"
                        >
                          <span>{column.header}</span>
                          {sortDirection === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : sortDirection === "desc" ? (
                            <ArrowDown className="h-4 w-4" />
                          ) : (
                            <ArrowUpDown className="h-4 w-4 opacity-50" />
                          )}
                        </button>
                      ) : (
                        <span>{column.header}</span>
                      )}
                      {resizable && column.resizable !== false && (
                        <div
                          className={clsx(
                            "ml-auto cursor-col-resize hover:bg-[color:var(--color-brand-primary)] w-1 h-4 rounded",
                            resizingColumn === column.id && "bg-[color:var(--color-brand-primary)]"
                          )}
                          onMouseDown={(e) => handleResizeStart(e, column.id)}
                        />
                      )}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, index) => {
                const rowKey = getKey(row, index);
                const isSelected = selectedRows.has(rowKey);
                const rowClass = getRowClass(row, index);

                return (
                  <TableRow
                    key={rowKey}
                    className={clsx(
                      isSelected && "bg-[color:var(--color-surface-2)]",
                      onRowClick && "cursor-pointer",
                      rowClass
                    )}
                    onClick={() => onRowClick?.(row, index)}
                  >
                    {selectable && (
                      <TableCell className="pl-4">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleSelectRow(rowKey)}
                          aria-label={`Select row ${index + 1}`}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                    )}
                    {rowActions && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <RowActionsMenu row={row} index={index} rowKey={rowKey} actions={rowActions} />
                      </TableCell>
                    )}
                    {columns.map((column) => {
                      const columnWidth = columnWidths[column.id] || column.width;
                      const cellClass =
                        typeof column.cellClassName === "function"
                          ? column.cellClassName(row, index)
                          : column.cellClassName;

                      return (
                        <TableCell
                          key={column.id}
                          className={cellClass}
                          style={columnWidth ? { width: columnWidth } : undefined}
                        >
                          {column.accessor(row, index)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

