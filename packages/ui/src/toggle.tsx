"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import clsx from "clsx";

export interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> {}

export const Toggle = React.memo(
  React.forwardRef<
    React.ElementRef<typeof TogglePrimitive.Root>,
    ToggleProps
  >(function Toggle({ className, ...props }, ref) {
    return (
      <TogglePrimitive.Root
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center rounded-[var(--radius-sm)] px-[var(--space-3)] py-[var(--space-1-5)] text-sm font-medium",
          "text-[color:var(--color-fg-base)]",
          "bg-[color:var(--color-surface-1)]",
          "border border-[color:var(--color-border-base)]",
          "hover:bg-[color:var(--color-surface-2)] hover:border-[color:var(--color-border-base)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-primary)]",
          "disabled:pointer-events-none disabled:opacity-50",
          "data-[state=on]:bg-[color:var(--color-brand-primary)] data-[state=on]:text-white data-[state=on]:border-[color:var(--color-brand-primary)]",
          "transition-colors duration-[var(--motion-duration-base)]",
          className
        )}
        {...props}
      />
    );
  })
);

Toggle.displayName = TogglePrimitive.Root.displayName;

