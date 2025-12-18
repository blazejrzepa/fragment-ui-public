"use client";

import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger> & {
    showIcon?: boolean;
  }
>(function CollapsibleTrigger({ className, showIcon = true, children, asChild, ...props }, ref) {
  // When asChild is used, we can't add the icon as a sibling element
  // because React.Children.only expects a single child
  if (asChild) {
    return (
      <CollapsiblePrimitive.Trigger
        ref={ref}
        className={clsx(
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-[var(--radius-sm)]",
          className
        )}
        asChild={asChild}
        {...props}
      >
        {children}
      </CollapsiblePrimitive.Trigger>
    );
  }

  return (
    <CollapsiblePrimitive.Trigger
      ref={ref}
      className={clsx(
        "flex items-center justify-between w-full gap-2",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-[var(--radius-sm)]",
        className
      )}
      {...props}
    >
      {children}
      {showIcon && (
        <ChevronDown className="h-4 w-4 transition-transform duration-[var(--motion-duration-base)] data-[state=open]:rotate-180" />
      )}
    </CollapsiblePrimitive.Trigger>
  );
});

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(function CollapsibleContent({ className, ...props }, ref) {
  return (
    <CollapsiblePrimitive.Content
      ref={ref}
      className={clsx(
        "overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
        className
      )}
      {...props}
    />
  );
});

export { Collapsible, CollapsibleTrigger, CollapsibleContent };

