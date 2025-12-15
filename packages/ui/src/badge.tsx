import * as React from "react";
import clsx from "clsx";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "solid" | "outline" | "subtle";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const badgeClasses = {
  base: "inline-flex items-center justify-center rounded-full font-medium transition-colors",
  size: {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  },
  variant: {
    solid: "bg-[color:var(--color-brand-primary)] text-[color:var(--color-brand-primary-600)]",
    outline: "border border-[color:var(--color-border-base)] text-[color:var(--color-fg-base)]",
    subtle: "bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)]",
  },
} as const;

export const Badge = React.memo(
  React.forwardRef<HTMLDivElement, BadgeProps>(
    function Badge({ variant = "solid", size = "md", className, children, ...props }, ref) {
      return (
        <div
          ref={ref}
          className={clsx(
            badgeClasses.base,
            badgeClasses.size[size],
            badgeClasses.variant[variant],
            className
          )}
          {...props}
        >
          {children}
        </div>
      );
    }
  )
);

