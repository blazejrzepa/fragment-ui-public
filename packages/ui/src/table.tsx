import * as React from "react";
import clsx from "clsx";

export interface TableProps
  extends React.TableHTMLAttributes<HTMLTableElement> {}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  function Table({ className, ...props }, ref) {
    return (
      <div className="relative w-full overflow-auto">
        <table
          ref={ref}
          className={clsx("w-full caption-bottom text-sm border-collapse", className)}
          {...props}
        />
      </div>
    );
  }
);

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(function TableHeader({ className, ...props }, ref) {
  return (
    <thead
      ref={ref}
      className={clsx("[&_tr]:border-b border-[color:var(--color-border-base)]", className)}
      {...props}
    />
  );
});

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(function TableBody({ className, ...props }, ref) {
  return (
    <tbody
      ref={ref}
      className={clsx("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
});

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(function TableRow({ className, ...props }, ref) {
  return (
    <tr
      ref={ref}
      className={clsx(
        "border-b border-[color:var(--color-border-base)] transition-colors duration-[var(--motion-duration-base)] hover:bg-[color:var(--color-surface-2)]",
        className
      )}
      {...props}
    />
  );
});

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(function TableHead({ className, ...props }, ref) {
  return (
    <th
      ref={ref}
      className={clsx(
        "h-10 pl-[var(--space-3)] pr-[var(--space-2)] text-left align-middle font-medium text-[color:var(--color-fg-base)] whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
});

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(function TableCell({ className, ...props }, ref) {
  return (
    <td
      ref={ref}
      className={clsx(
        "pl-[var(--space-3)] pr-[var(--space-2)] py-[var(--space-2)] align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
});

export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(function TableCaption({ className, ...props }, ref) {
  return (
    <caption
      ref={ref}
      className={clsx(
        "mt-[var(--space-4)] text-sm text-[color:var(--color-fg-muted)]",
        className
      )}
      {...props}
    />
  );
});

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(function TableFooter({ className, ...props }, ref) {
  return (
    <tfoot
      ref={ref}
      className={clsx(
        "bg-[color:var(--color-surface-2)] border-t border-[color:var(--color-border-base)] font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
});

