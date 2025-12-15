import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import clsx from "clsx";

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {}

export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(function Label({ className, ...props }, ref) {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={clsx(
        "text-sm font-medium leading-none text-[color:var(--color-fg-base)] peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
});

Label.displayName = LabelPrimitive.Root.displayName;

