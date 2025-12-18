import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import clsx from "clsx";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverClose = PopoverPrimitive.Close;

export interface PopoverProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  children: React.ReactNode;
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  /**
   * Align the popover relative to the trigger
   * @default "center"
   */
  align?: "start" | "center" | "end";
  /**
   * Side of the trigger to render against
   * @default "bottom"
   */
  side?: "top" | "right" | "bottom" | "left";
  /**
   * Distance in pixels from the trigger
   * @default 4
   */
  sideOffset?: number;
  /**
   * Additional offset in pixels from the aligned edge
   * @default 0
   */
  alignOffset?: number;
  /**
   * Enable collision detection to automatically flip sides
   * @default true
   */
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  /**
   * Enable portal rendering (useful for z-index stacking)
   * @default true
   */
  portal?: boolean;
}

export const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(function PopoverContent(
  {
    className,
    align = "center",
    side = "bottom",
    sideOffset = 4,
    alignOffset = 0,
    collisionPadding = 8,
    portal = true,
    ...props
  },
  ref
) {
  const content = (
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      side={side}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      collisionPadding={collisionPadding}
      className={clsx(
        "z-50 rounded-[var(--radius-md)] border border-[color:var(--color-border-base)] bg-[color:var(--color-surface-1)] text-[color:var(--color-fg-base)] shadow-md outline-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  );

  if (portal) {
    return <PopoverPrimitive.Portal>{content}</PopoverPrimitive.Portal>;
  }

  return content;
});

// Convenience wrapper component
export function PopoverWrapper({ children, trigger, open, onOpenChange, ...props }: PopoverProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent {...props}>{children}</PopoverContent>
    </Popover>
  );
}

// Export Popover components for convenience
export { Popover, PopoverTrigger, PopoverClose };

