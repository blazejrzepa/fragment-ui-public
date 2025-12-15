"use client";

import * as React from "react";
import { AppShell } from "../app-shell";
import { DataTableToolbar } from "../data-table-toolbar";
import { PaginationFooter } from "../pagination-footer";
import { DataTable } from "@fragment_ui/ui";
import { EmptyState } from "../empty-state";
import { NavigationHeader } from "../navigation-header";
import type { AppShellProps } from "../app-shell";
import type { DataTableColumn } from "@fragment_ui/ui";
import { Users } from "lucide-react";

export interface UsersListTemplateProps<T extends Record<string, any>> {
  /**
   * Sidebar navigation content
   */
  sidebar?: React.ReactNode;
  /**
   * Sidebar header (logo, title)
   */
  sidebarHeader?: React.ReactNode;
  /**
   * Sidebar footer (user menu, etc.)
   */
  sidebarFooter?: React.ReactNode;
  /**
   * Header navigation links
   */
  headerLinks?: Array<{ label: string; href: string }>;
  /**
   * Header logo text
   */
  headerLogoText?: string;
  /**
   * Table data
   */
  data: T[];
  /**
   * Table columns
   */
  columns: DataTableColumn<T>[];
  /**
   * Search value
   */
  search?: string;
  /**
   * Search change handler
   */
  onSearchChange?: (value: string) => void;
  /**
   * Filters configuration
   */
  filters?: Array<{
    id: string;
    label: string;
    type?: "select" | "text" | "date";
    options?: Array<{ value: string; label: string }>;
  }>;
  /**
   * Current filter values
   */
  filterValues?: Record<string, string>;
  /**
   * Filter change handler
   */
  onFilterChange?: (filters: Record<string, string>) => void;
  /**
   * Primary actions (e.g., "Add User")
   */
  primaryActions?: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  }>;
  /**
   * Secondary actions (e.g., "Export", "Bulk Delete")
   */
  secondaryActions?: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  }>;
  /**
   * Selected rows
   */
  selectedRows?: Set<string | number>;
  /**
   * Selection change handler
   */
  onSelectionChange?: (selected: Set<string | number>) => void;
  /**
   * Current page (1-based)
   */
  currentPage?: number;
  /**
   * Total number of pages
   */
  totalPages?: number;
  /**
   * Total number of items
   */
  totalItems?: number;
  /**
   * Items per page
   */
  pageSize?: number;
  /**
   * Page change handler
   */
  onPageChange?: (page: number) => void;
  /**
   * Page size change handler
   */
  onPageSizeChange?: (pageSize: number) => void;
  /**
   * Row click handler
   */
  onRowClick?: (row: T, index: number) => void;
  /**
   * Empty state message
   */
  emptyMessage?: string;
  /**
   * Additional AppShell props
   */
  appShellProps?: Omit<AppShellProps, "sidebar" | "sidebarHeader" | "sidebarFooter" | "header" | "children">;
}

/**
 * UsersListTemplate - Complete users list page template
 * 
 * A full-screen template for displaying a list of users (or any data) in a table
 * with search, filters, pagination, and actions.
 * 
 * @example
 * ```tsx
 * <UsersListTemplate
 *   sidebar={<NavigationMenu />}
 *   data={users}
 *   columns={columns}
 *   search={search}
 *   onSearchChange={setSearch}
 *   primaryActions={[
 *     { id: "add", label: "Add User", onClick: handleAdd },
 *   ]}
 *   currentPage={1}
 *   totalPages={10}
 *   onPageChange={setPage}
 * />
 * ```
 */
export function UsersListTemplate<T extends Record<string, any>>({
  sidebar,
  sidebarHeader,
  sidebarFooter,
  headerLinks,
  headerLogoText = "Dashboard",
  data,
  columns,
  search = "",
  onSearchChange,
  filters = [],
  filterValues = {},
  onFilterChange,
  primaryActions = [],
  secondaryActions = [],
  selectedRows,
  onSelectionChange,
  currentPage = 1,
  totalPages = 1,
  totalItems,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  emptyMessage = "No users found",
  appShellProps,
}: UsersListTemplateProps<T>) {
  const header = headerLinks ? (
    <NavigationHeader
      logoText={headerLogoText}
      links={headerLinks}
    />
  ) : undefined;

  const selectedCount = selectedRows?.size || 0;

  // Calculate paginated data
  const paginatedData = React.useMemo(() => {
    if (!onPageChange || !pageSize) {
      return data;
    }
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }, [data, currentPage, pageSize, onPageChange]);

  return (
    <AppShell
      sidebar={sidebar}
      sidebarHeader={sidebarHeader}
      sidebarFooter={sidebarFooter}
      header={header}
      {...appShellProps}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Users</h1>
          <p className="text-sm text-[color:var(--color-fg-muted)]">
            Manage your users and their permissions
          </p>
        </div>

        {data.length === 0 ? (
          <EmptyState
            icon={<Users className="w-12 h-12 text-[color:var(--color-fg-muted)]" />}
            title={emptyMessage}
            description="Get started by adding your first user."
            action={
              primaryActions[0]
                ? {
                    label: primaryActions[0].label,
                    onClick: primaryActions[0].onClick,
                  }
                : undefined
            }
          />
        ) : (
          <>
            <DataTableToolbar
              search={search}
              onSearchChange={onSearchChange}
              filters={filters}
              filterValues={filterValues}
              onFilterChange={onFilterChange}
              primaryActions={primaryActions}
              secondaryActions={secondaryActions}
              selectedCount={selectedCount}
            />

            <DataTable
              data={paginatedData}
              columns={columns}
              selectable={!!onSelectionChange}
              selectedRows={selectedRows}
              onSelectionChange={onSelectionChange}
              onRowClick={onRowClick}
              emptyMessage={emptyMessage}
            />

            {onPageChange && (
              <PaginationFooter
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={pageSize || 10}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
              />
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}

