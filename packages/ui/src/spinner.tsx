import * as React from "react";
import clsx from "clsx";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
} as const;

export const Spinner = React.memo(
  React.forwardRef<HTMLDivElement, SpinnerProps>(
    function Spinner({ size = "md", className, ...props }, ref) {
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

