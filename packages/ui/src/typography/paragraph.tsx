import * as React from "react";
import clsx from "clsx";

export interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /**
   * Text size variant
   * @default "md"
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  /**
   * Paragraph variant
   * - "default": Standard body text
   * - "intro": Larger intro paragraph (typically first paragraph)
   * @default "default"
   */
  variant?: "default" | "intro";
  /**
   * Additional CSS classes
   */
  className?: string;
}

const sizeClasses = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
} as const;

/**
 * Paragraph component for body text with DS typography
 * 
 * @example
 * ```tsx
 * <Paragraph variant="intro">Introduction text</Paragraph>
 * <Paragraph size="md">Body text content</Paragraph>
 * ```
 */
export const Paragraph = React.memo(
  React.forwardRef<HTMLParagraphElement, ParagraphProps>(
    function Paragraph({ size = "md", variant = "default", className, children, ...props }, ref) {
      const sizeClass = sizeClasses[size];
      
      const baseClasses = clsx(
        "font-sans", // Use Geist font
        sizeClass,
        variant === "intro" 
          ? "font-light text-[color:var(--color-fg-muted)] mb-6"
          : "font-light text-[color:var(--color-fg-muted)] mb-4",
        className
      );

      return (
        <p ref={ref} className={baseClasses} {...props}>
          {children}
        </p>
      );
    }
  )
);

Paragraph.displayName = "Paragraph";

