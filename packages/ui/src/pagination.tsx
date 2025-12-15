"use client";

import * as React from "react";
import clsx from "clsx";
import { Button } from "./button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showFirstLast?: boolean;
  maxVisible?: number;
}

export const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  function Pagination(
    {
      currentPage,
      totalPages,
      onPageChange,
      className,
      showFirstLast = true,
      maxVisible = 5,
    },
    ref
  ) {
    const getPageNumbers = () => {
      const pages: (number | string)[] = [];
      const half = Math.floor(maxVisible / 2);

      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= half + 1) {
          for (let i = 1; i <= maxVisible - 1; i++) {
            pages.push(i);
          }
          pages.push("ellipsis");
          pages.push(totalPages);
        } else if (currentPage >= totalPages - half) {
          pages.push(1);
          pages.push("ellipsis");
          for (let i = totalPages - (maxVisible - 2); i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push("ellipsis");
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push("ellipsis");
          pages.push(totalPages);
        }
      }

      return pages;
    };

    const pages = getPageNumbers();

    return (
      <nav ref={ref} className={clsx("flex items-center gap-2", className)}>
        {showFirstLast && (
          <Button
            key="first"
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            aria-label="First page"
          >
            ««
          </Button>
        )}
        <Button
          key="prev"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          ‹
        </Button>

        {pages.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-[color:var(--color-fg-muted)]"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "solid" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              aria-label={`Page ${pageNum}`}
              aria-current={currentPage === pageNum ? "page" : undefined}
            >
              {pageNum}
            </Button>
          );
        })}

        <Button
          key="next"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          ›
        </Button>
        {showFirstLast && (
          <Button
            key="last"
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Last page"
          >
            »»
          </Button>
        )}
      </nav>
    );
  }
);


