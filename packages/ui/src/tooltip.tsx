import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import clsx from "clsx";

const TooltipProvider = TooltipPrimitive.Provider;
const TooltipRoot = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  delayDuration?: number;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  style?: React.CSSProperties;
}

export const Tooltip = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipProps
>(function Tooltip({ children, content, delayDuration = 500, className, side, sideOffset = 5, ...props }, ref) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <TooltipRoot>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipPrimitive.Content
          ref={ref}
          side={side}
          sideOffset={sideOffset}
          align="center"
          className={clsx(
            "z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className
          )}
          style={{
            backgroundColor: "var(--background-primary)",
            border: "1px solid color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
            borderRadius: "2px",
            padding: "4px 8px",
            fontSize: "11px",
            lineHeight: "1.4",
            color: "var(--foreground-primary)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            ...props.style,
          }}
          {...props}
        >
          {content}
        </TooltipPrimitive.Content>
      </TooltipRoot>
    </TooltipProvider>
  );
});

