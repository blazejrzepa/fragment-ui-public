import * as React from "react";
import clsx from "clsx";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
} as const;

export const Spinner = React.memo(
  React.forwardRef<HTMLDivElement, SpinnerProps>(
    function Spinner({ size = "md", className, children, ...props }, ref) {
      // If children are provided, wrap them in a spinning container
      if (children) {
        return (
          <div
            ref={ref}
            className={clsx(
              "inline-flex items-center justify-center animate-spin",
              sizeClasses[size],
              className
            )}
            role="status"
            aria-label="Loading"
            {...props}
          >
            {children}
          </div>
        );
      }
      
      // Default spinner without children
      return (
        <div
          ref={ref}
          className={clsx(
            "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
            sizeClasses[size],
            className
          )}
          role="status"
          aria-label="Loading"
          {...props}
        >
          <span className="sr-only">Loading...</span>
        </div>
      );
    }
  )
);

