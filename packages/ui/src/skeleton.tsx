import * as React from "react";
import clsx from "clsx";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton = React.memo(
  React.forwardRef<HTMLDivElement, SkeletonProps>(
    function Skeleton({ className, ...props }, ref) {
      return (
        <div
          ref={ref}
          className={clsx(
            "animate-pulse rounded-[var(--radius-md)] bg-[color:var(--color-surface-2)]",
            className
          )}
          {...props}
        />
      );
    }
  )
);

