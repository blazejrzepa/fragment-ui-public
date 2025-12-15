"use client";

import * as React from "react";
import { Input, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@fragment_ui/ui";
import { Search, Filter, X, Download, Plus } from "lucide-react";
import clsx from "clsx";

export interface DataTableToolbarFilter {
  id: string;
  label: string;
  type?: "select" | "text" | "date";
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export interface DataTableToolbarAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "solid" | "outline" | "ghost";
  disabled?: boolean;
}

export interface DataTableToolbarProps {
  /**
   * Search value
   */
  search?: string;
  /**
   * Search placeholder
   */
  searchPlaceholder?: string;
  /**
   * Search change handler
   */
  onSearchChange?: (value: string) => void;
  /**
   * Filters configuration
   */
  filters?: DataTableToolbarFilter[];
  /**
   * Current filter values
   */
  filterValues?: Record<string, string>;
  /**
   * Filter change handler
   */
  onFilterChange?: (filters: Record<string, string>) => void;
  /**
   * Primary actions (e.g., "Add", "Create")
   */
  primaryActions?: DataTableToolbarAction[];
  /**
   * Secondary actions (e.g., "Export", "Bulk actions")
   */
  secondaryActions?: DataTableToolbarAction[];
  /**
   * Number of selected items (for bulk actions)
   */
  selectedCount?: number;
  /**
   * Show clear filters button
   */
  showClearFilters?: boolean;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * DataTableToolbar - Toolbar for data tables with search, filters, and actions
 * 
 * Provides a comprehensive toolbar for data tables with:
 * - Search input
 * - Filter controls
 * - Primary and secondary actions
 * - Bulk action support
 * 
 * @example
 * ```tsx
 * <DataTableToolbar
 *   search={search}
 *   onSearchChange={setSearch}
 *   filters={[
 *     { id: "status", label: "Status", type: "select", options: [...] },
 *   ]}
 *   primaryActions={[
 *     { id: "add", label: "Add User", onClick: handleAdd },
 *   ]}
 * />
 * ```
 */
export function DataTableToolbar({
  search = "",
  searchPlaceholder = "Search...",
  onSearchChange,
  filters = [],
  filterValues = {},
  onFilterChange,
  primaryActions = [],
  secondaryActions = [],
  selectedCount = 0,
  showClearFilters = true,
  className,
}: DataTableToolbarProps) {
  const hasActiveFilters = Object.values(filterValues).some((v) => v && v !== "");
  const hasSearch = search && search !== "";

  const handleClearFilters = () => {
    if (onSearchChange) {
      onSearchChange("");
    }
    if (onFilterChange) {
      const cleared: Record<string, string> = {};
      filters.forEach((f) => {
        cleared[f.id] = "";
      });
      onFilterChange(cleared);
    }
  };

  const handleFilterValueChange = (filterId: string, value: string) => {
    if (onFilterChange) {
      onFilterChange({
        ...filterValues,
        [filterId]: value,
      });
    }
  };

  return (
    <div className={clsx("flex flex-col gap-4 mb-4", className)}>
      {/* Top row: Search and Primary Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[color:var(--color-fg-muted)]" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Primary Actions */}
        {primaryActions.length > 0 && (
          <div className="flex items-center gap-2">
            {primaryActions.map((action) => (
              <Button
                key={action.id}
                variant={action.variant || "solid"}
                onClick={action.onClick}
                disabled={action.disabled}
                className="gap-2"
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom row: Filters and Secondary Actions */}
      {(filters.length > 0 || secondaryActions.length > 0 || (hasActiveFilters && showClearFilters)) && (
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filters */}
          {filters.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {filters.map((filter) => {
                if (filter.type === "select" && filter.options) {
                  return (
                    <Select
                      key={filter.id}
                      value={filterValues[filter.id] || ""}
                      onValueChange={(value) => handleFilterValueChange(filter.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={filter.label} />
                      </SelectTrigger>
                      <SelectContent>
                        {filter.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }
                return (
                  <Input
                    key={filter.id}
                    type={filter.type === "date" ? "date" : "text"}
                    placeholder={filter.placeholder || filter.label}
                    value={filterValues[filter.id] || ""}
                    onChange={(e) => handleFilterValueChange(filter.id, e.target.value)}
                    className="w-[180px]"
                  />
                );
              })}
            </div>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && showClearFilters && (
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}

          {/* Secondary Actions */}
          {secondaryActions.length > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              {secondaryActions.map((action) => (
                <Button
                  key={action.id}
                  variant={action.variant || "outline"}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className="gap-2"
                >
                  {action.icon}
                  {action.label}
                  {selectedCount > 0 && action.id.includes("bulk") && (
                    <span className="ml-1">({selectedCount})</span>
                  )}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

