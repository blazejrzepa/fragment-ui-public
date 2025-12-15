"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@fragment_ui/ui";
import { Pagination } from "@fragment_ui/ui";
import { Input } from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";
import clsx from "clsx";

export interface DataTableColumn<T> {
  id: string;
  header: string;
  accessor: (row: T) => React.ReactNode;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  className?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 10,
  searchable = true,
  searchPlaceholder = "Search...",
  className,
  onRowClick,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "asc"
  );

  const filteredData = React.useMemo(() => {
    let result = [...data];

    // Search filter
    if (search && searchable) {
      const searchLower = search.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchLower)
        )
      );
    }

    // Sort
    if (sortColumn) {
      const column = columns.find((col) => col.id === sortColumn);
      if (column?.sortable) {
        result.sort((a, b) => {
          const aVal = String(column.accessor(a) || "");
          const bVal = String(column.accessor(b) || "");
          const comparison = aVal.localeCompare(bVal);
          return sortDirection === "asc" ? comparison : -comparison;
        });
      }
    }

    return result;
  }, [data, search, sortColumn, sortDirection, columns, searchable]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, pageSize]);

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className={clsx("space-y-4", className)}>
      {searchable && (
        <div className="flex items-center gap-2">
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          {search && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearch("")}
            >
              Clear
            </Button>
          )}
        </div>
      )}

      <div className="rounded-[var(--radius-md)] border border-[#19191B]">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className={clsx(
                    column.sortable && "cursor-pointer select-none hover:bg-[color:var(--color-surface-2)]"
                  )}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && sortColumn === column.id && (
                      <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-[color:var(--color-fg-muted)]"
                >
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow
                  key={index}
                  className={clsx(
                    onRowClick && "cursor-pointer hover:bg-[color:var(--color-surface-2)]"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {column.accessor(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-[color:var(--color-fg-muted)]">
            Showing {paginatedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
            {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
            {filteredData.length} results
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}


