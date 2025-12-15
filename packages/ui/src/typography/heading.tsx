import * as React from "react";
import clsx from "clsx";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * Heading level (1-6)
   * @default 1
   */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Size variant
   * Display sizes for large headings, text sizes for smaller headings
   */
  size?: "display-2xl" | "display-xl" | "display-lg" | "display-md" | "display-sm" | "display-xs" | "2xl" | "xl" | "lg" | "md" | "sm" | "xs";
  /**
   * Additional CSS classes
   */
  className?: string;
}

const sizeClasses = {
  "display-2xl": "text-display-2xl",
  "display-xl": "text-display-xl",
  "display-lg": "text-display-lg",
  "display-md": "text-display-md",
  "display-sm": "text-display-sm",
  "display-xs": "text-display-xs",
  "2xl": "text-2xl",
  "xl": "text-xl",
  "lg": "text-lg",
  "md": "text-md",
  "sm": "text-sm",
  "xs": "text-xs",
} as const;

const defaultSizesByLevel: Record<number, keyof typeof sizeClasses> = {
  1: "display-lg",
  2: "xl",
  3: "lg",
  4: "md",
  5: "sm",
  6: "xs",
};

/**
 * TypographyHeading component for semantic headings with DS typography
 * 
 * @example
 * ```tsx
 * <TypographyHeading level={1} size="display-lg">Main Title</TypographyHeading>
 * <TypographyHeading level={2} size="xl">Section Title</TypographyHeading>
 * ```
 */
export const TypographyHeading = React.memo(
  React.forwardRef<HTMLHeadingElement, HeadingProps>(
    function TypographyHeading({ level = 1, size, className, children, ...props }, ref) {
      const effectiveSize = size || defaultSizesByLevel[level];
      const sizeClass = sizeClasses[effectiveSize];
      
      const baseClasses = clsx(
        "font-medium text-[color:var(--foreground-primary)]",
        "font-sans", // Use Geist font
        sizeClass,
        className
      );

      const Component = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

      return React.createElement(Component, { ref, className: baseClasses, ...props }, children);
    }
  )
);

TypographyHeading.displayName = "TypographyHeading";

