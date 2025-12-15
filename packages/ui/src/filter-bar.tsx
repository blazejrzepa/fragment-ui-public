"use client";

import * as React from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Select } from "./select";
import clsx from "clsx";

export interface FilterOption {
  value: string;
  label: string;
}

export interface Filter {
  id: string;
  type: "search" | "select" | "date" | "toggle";
  label?: string;
  placeholder?: string;
  options?: FilterOption[];
  value?: string;
  onChange?: (value: string) => void;
}

export interface FilterBarProps {
  filters: Filter[];
  onClear?: () => void;
  showClearButton?: boolean;
  className?: string;
}

export const FilterBar = React.memo(
  React.forwardRef<HTMLDivElement, FilterBarProps>(
    function FilterBar(
      { filters = [], onClear, showClearButton = true, className },
      ref
    ) {
      // Ensure filters is always an array
      const safeFilters = Array.isArray(filters) ? filters : [];
      
      return (
        <div
          ref={ref}
          className={clsx(
            "flex flex-wrap items-center gap-4 p-4 bg-[color:var(--color-surface-1)] border-b border-[color:var(--color-border-base)]",
            className
          )}
        >
          {safeFilters.map((filter) => {
            if (filter.type === "search") {
              return (
                <Input
                  key={filter.id}
                  type="search"
                  placeholder={filter.placeholder || "Search..."}
                  value={filter.value || ""}
                  onChange={(e) => filter.onChange?.(e.target.value)}
                  className="min-w-[200px]"
                />
              );
            }

            if (filter.type === "select") {
              return (
                <div key={filter.id} className="flex items-center gap-2">
                  {filter.label && (
                    <label className="text-sm text-[color:var(--color-fg-muted)]">
                      {filter.label}:
                    </label>
                  )}
                  <Select
                    value={filter.value || ""}
                    onValueChange={filter.onChange}
                  >
                    <option value="">All</option>
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
              );
            }

            if (filter.type === "date") {
              return (
                <div key={filter.id} className="flex items-center gap-2">
                  {filter.label && (
                    <label className="text-sm text-[color:var(--color-fg-muted)]">
                      {filter.label}:
                    </label>
                  )}
                  <Input
                    type="date"
                    value={filter.value || ""}
                    onChange={(e) => filter.onChange?.(e.target.value)}
                  />
                </div>
              );
            }

            return null;
          })}

          {showClearButton && onClear && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="ml-auto"
            >
              Clear Filters
            </Button>
          )}
        </div>
      );
    }
  )
);

FilterBar.displayName = "FilterBar";

