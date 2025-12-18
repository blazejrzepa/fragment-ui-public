"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import clsx from "clsx";

export interface ToggleGroupProps {
  variant?: "outline" | "default";
  spacing?: "default" | "0";
}

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps & React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
>(function ToggleGroup({ className, variant = "outline", spacing = "default", ...props }, ref) {
  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      data-variant={variant}
      data-spacing={spacing}
      className={clsx(
        "inline-flex items-center",
        spacing === "default" && "gap-[var(--space-1)]",
        spacing === "0" && "gap-0",
        className
      )}
      {...props}
    />
  );
});

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

export interface ToggleGroupItemProps {
  variant?: "outline" | "default";
  spacing?: "default" | "0";
}

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps & React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(function ToggleGroupItem(
  { className, variant = "outline", spacing = "default", ...props },
  ref
) {
  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      data-variant={variant}
      data-spacing={spacing}
      className={clsx(
        "inline-flex items-center justify-center gap-[var(--space-2)] text-sm font-medium",
        "whitespace-nowrap",
        "disabled:pointer-events-none disabled:opacity-50",
        "outline-none transition-[color,box-shadow] duration-[var(--motion-duration-base)]",
        "focus-visible:z-10",
        // Base styles
        "h-9 px-[var(--space-3)]",
        // Default spacing styles
        spacing === "default" && [
          "rounded-[var(--radius-sm)]",
          "border border-[color:var(--color-border-base)]",
          "bg-transparent",
          "text-[color:var(--color-fg-base)]",
          "shadow-sm",
          "hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-fg-base)]",
          "data-[state=on]:bg-[color:var(--color-surface-2)] data-[state=on]:text-[color:var(--color-fg-base)]",
          "focus-visible:border-[color:var(--color-brand-primary)] focus-visible:ring-[color:var(--color-brand-primary)]/50 focus-visible:ring-[3px]",
        ],
        // Spacing 0 (no gaps, connected buttons)
        spacing === "0" && [
          "rounded-none shadow-none",
          "first:rounded-l-md last:rounded-r-md",
          variant === "outline" && [
            "border border-[color:var(--color-border-base)]",
            "border-l-0 first:border-l",
            "bg-transparent",
            "text-[color:var(--color-fg-base)]",
            "hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-fg-base)]",
            "data-[state=on]:bg-[color:var(--color-surface-2)] data-[state=on]:text-[color:var(--color-fg-base)]",
            "focus-visible:border-[color:var(--color-brand-primary)] focus-visible:ring-[color:var(--color-brand-primary)]/50 focus-visible:ring-[3px]",
          ],
        ],
        className
      )}
      {...props}
    />
  );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };

