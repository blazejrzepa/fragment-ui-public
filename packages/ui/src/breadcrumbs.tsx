import * as React from "react";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  variant?: "slash" | "arrow";
  className?: string;
}

export const Breadcrumbs = React.memo(
  React.forwardRef<HTMLElement, BreadcrumbsProps>(
    function Breadcrumbs({ items, separator, variant = "slash", className, ...props }, ref) {
      const defaultSeparator = variant === "arrow" ? (
        <ChevronRight className="w-4 h-4 text-[color:var(--color-fg-muted)]/50" aria-hidden="true" />
      ) : (
        <span className="text-[color:var(--color-fg-muted)]/50" aria-hidden="true">
          /
        </span>
      );
      const SeparatorComponent = separator || defaultSeparator;

      return (
        <nav
          ref={ref}
          aria-label="Breadcrumb"
          className={clsx("flex items-center", className)}
          {...props}
        >
          <div className="flex items-center gap-2 text-sm text-[color:var(--color-fg-muted)] flex-wrap">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              const isClickable = !isLast && (item.href || item.onClick);

              return (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <span className="flex items-center px-1" aria-hidden="true">
                      {SeparatorComponent}
                    </span>
                  )}
                  <span className="flex items-center">
                    {isLast ? (
                      <span
                        className="text-[color:var(--color-fg-muted)]"
                        aria-current="page"
                      >
                        {item.label}
                      </span>
                    ) : isClickable ? (
                      item.href ? (
                        <a
                          href={item.href}
                          className="hover:text-[color:var(--color-brand-primary)] hover:underline transition-colors"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={item.onClick}
                          className="hover:text-[color:var(--color-brand-primary)] hover:underline transition-colors text-left"
                        >
                          {item.label}
                        </button>
                      )
                    ) : (
                      <span className="text-[color:var(--color-fg-muted)]">
                        {item.label}
                      </span>
                    )}
                  </span>
                </React.Fragment>
              );
            })}
          </div>
        </nav>
      );
    }
  )
);
