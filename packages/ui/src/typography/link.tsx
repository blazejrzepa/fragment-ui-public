import * as React from "react";
import clsx from "clsx";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Link URL
   */
  href: string;
  /**
   * Whether link is external (opens in new tab)
   * @default false
   */
  external?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Link component with DS typography and styling
 * 
 * @example
 * ```tsx
 * <Link href="/docs">Documentation</Link>
 * <Link href="https://example.com" external>External Link</Link>
 * ```
 */
export const Link = React.memo(
  React.forwardRef<HTMLAnchorElement, LinkProps>(
    function Link({ href, external = false, className, children, ...props }, ref) {
      const baseClasses = clsx(
        "font-sans text-[color:var(--foreground-primary)]",
        "underline underline-offset-4",
        "hover:opacity-80",
        "transition-opacity",
        className
      );

      return (
        <a
          ref={ref}
          href={href}
          className={baseClasses}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          {...props}
        >
          {children}
        </a>
      );
    }
  )
);

Link.displayName = "Link";

