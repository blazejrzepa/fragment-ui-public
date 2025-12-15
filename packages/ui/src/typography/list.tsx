import * as React from "react";
import clsx from "clsx";

export interface ListProps extends React.HTMLAttributes<HTMLUListElement | HTMLOListElement> {
  /**
   * Whether to render as ordered list (ol) or unordered list (ul)
   * @default false
   */
  ordered?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * List component for ordered and unordered lists with DS typography
 * 
 * @example
 * ```tsx
 * <List>
 *   <li>Item 1</li>
 *   <li>Item 2</li>
 * </List>
 * 
 * <List ordered>
 *   <li>First</li>
 *   <li>Second</li>
 * </List>
 * ```
 */
export const List = React.memo(
  React.forwardRef<HTMLUListElement | HTMLOListElement, ListProps>(
    function List({ ordered = false, className, children, ...props }, ref) {
      const baseClasses = clsx(
        "font-sans font-light text-[color:var(--color-fg-muted)]",
        "text-md",
        "my-4 pl-6",
        "space-y-2",
        className
      );

      if (ordered) {
        return (
          <ol ref={ref as React.Ref<HTMLOListElement>} className={clsx(baseClasses, "list-decimal")} {...props}>
            {children}
          </ol>
        );
      }

      return (
        <ul ref={ref as React.Ref<HTMLUListElement>} className={clsx(baseClasses, "list-disc")} {...props}>
          {children}
        </ul>
      );
    }
  )
);

List.displayName = "List";

