import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import clsx from "clsx";
import { Spinner } from "./spinner";
import { ChevronDown } from "lucide-react";

const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;

export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  error?: boolean;
  loading?: boolean;
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(function SelectTrigger({ className, children, error, loading, ...props }, ref) {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      suppressHydrationWarning
      className={clsx(
        "flex h-[calc(var(--space-8)+var(--space-2))] items-center justify-between rounded-[var(--radius-sm)] border bg-[color:var(--color-surface-1)] px-[var(--space-3)] text-[var(--typography-size-sm)] focus:outline-none disabled:opacity-60",
        error
          ? "border-[color:var(--color-status-error-border)]"
          : "border-[color:var(--color-border-base)]",
        loading && "pr-10",
        // Default to w-full if no width specified in className
        !className?.includes("w-") && "w-full",
        className
      )}
      {...props}
    >
      {children}
      {loading ? (
        <div className="absolute right-3">
          <Spinner size="sm" />
        </div>
      ) : (
        <ChevronDown className="h-4 w-4 opacity-50" />
      )}
    </SelectPrimitive.Trigger>
  );
});

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(function SelectContent({ className, children, position = "popper", sideOffset = 2, ...props }, ref) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        position={position}
        sideOffset={sideOffset}
        className={clsx(
          "relative z-50 min-w-[8rem] overflow-hidden rounded-[var(--radius-sm)] border border-[color:var(--color-border-base)] bg-[color:var(--color-surface-1)] shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          position === "popper" && "w-[var(--radix-select-trigger-width)]",
          className
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-[var(--space-1)]">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(function SelectItem({ className, children, ...props }, ref) {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={clsx(
        "relative flex w-full cursor-pointer select-none items-center rounded-[var(--radius-sm)] py-[var(--space-1-5)] pl-[var(--space-2)] pr-[var(--space-2)] text-[var(--typography-size-sm)] outline-none focus:bg-[color:var(--color-surface-2)] data-[disabled]:pointer-events-none data-[disabled]:opacity-60",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});

const SelectGroup = SelectPrimitive.Group;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(function SelectLabel({ className, ...props }, ref) {
  return (
    <SelectPrimitive.Label
      ref={ref}
      className={clsx(
        "px-[var(--space-2)] py-[var(--space-1-5)] text-[10px] font-medium text-[color:var(--color-fg-muted)]",
        className
      )}
      {...props}
    />
  );
});

export { Select, SelectValue, SelectTrigger, SelectContent, SelectItem, SelectGroup, SelectLabel };

