"use client";

import * as React from "react";
import { Button } from "@fragment_ui/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@fragment_ui/ui";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import clsx from "clsx";

export interface PaginationFooterProps {
  /**
   * Current page (1-based)
   */
  currentPage: number;
  /**
   * Total number of pages
   */
  totalPages: number;
  /**
   * Total number of items
   */
  totalItems?: number;
  /**
   * Items per page
   */
  pageSize: number;
  /**
   * Available page sizes
   */
  pageSizeOptions?: number[];
  /**
   * Page change handler
   */
  onPageChange: (page: number) => void;
  /**
   * Page size change handler
   */
  onPageSizeChange?: (pageSize: number) => void;
  /**
   * Show page size selector
   */
  showPageSizeSelector?: boolean;
  /**
   * Show item count info
   */
  showItemCount?: boolean;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * PaginationFooter - Pagination controls for data tables
 * 
 * Provides pagination controls with:
 * - First/Previous/Next/Last buttons
 * - Page number display
 * - Page size selector
 * - Item count information
 * 
 * @example
 * ```tsx
 * <PaginationFooter
 *   currentPage={1}
 *   totalPages={10}
 *   totalItems={100}
 *   pageSize={10}
 *   onPageChange={setPage}
 *   onPageSizeChange={setPageSize}
 * />
 * ```
 */
export function PaginationFooter({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
  showPageSizeSelector = true,
  showItemCount = true,
  className,
}: PaginationFooterProps) {
  const startItem = totalItems ? (currentPage - 1) * pageSize + 1 : undefined;
  const endItem = totalItems
    ? Math.min(currentPage * pageSize, totalItems)
    : undefined;

  const handleFirstPage = () => {
    if (currentPage > 1) {
      onPageChange(1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleLastPage = () => {
    if (currentPage < totalPages) {
      onPageChange(totalPages);
    }
  };

  return (
    <div
      className={clsx(
        "flex items-center justify-between gap-4 mt-4",
        className
      )}
    >
      {/* Left: Item count and page size */}
      <div className="flex items-center gap-4">
        {showItemCount && totalItems !== undefined && (
          <div className="text-sm text-[color:var(--color-fg-muted)]">
            Showing {startItem} to {endItem} of {totalItems} items
          </div>
        )}
        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-[color:var(--color-fg-muted)]">
              Show:
            </span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Right: Pagination controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleFirstPage}
          disabled={currentPage === 1}
          aria-label="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1 px-2">
          <span className="text-sm text-[color:var(--color-fg-base)]">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLastPage}
          disabled={currentPage >= totalPages}
          aria-label="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

