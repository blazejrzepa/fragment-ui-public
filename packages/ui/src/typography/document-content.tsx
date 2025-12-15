import * as React from "react";
import clsx from "clsx";

export interface DocumentContentProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * HTML element to render as
   * @default "article"
   */
  as?: "article" | "div" | "section";
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * DocumentContent component - replaces .prose class
 * Provides typography styles for documentation content using DS tokens
 * 
 * @example
 * ```tsx
 * <DocumentContent>
 *   <Heading level={1}>Title</Heading>
 *   <Paragraph>Content...</Paragraph>
 * </DocumentContent>
 * ```
 */
export const DocumentContent = React.memo(
  React.forwardRef<HTMLElement, DocumentContentProps>(
    function DocumentContent({ as: Component = "article", className, children, ...props }, ref) {
      const baseClasses = clsx(
        "document-content",
        "max-w-none min-w-0",
        // Typography styles applied via CSS class
        className
      );

      return (
        <Component ref={ref as any} className={baseClasses} {...props}>
          {children}
        </Component>
      );
    }
  )
);

DocumentContent.displayName = "DocumentContent";

