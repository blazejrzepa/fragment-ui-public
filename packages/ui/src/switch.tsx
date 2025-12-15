import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import clsx from "clsx";

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {}

export const Switch = React.memo(
  React.forwardRef<
    React.ElementRef<typeof SwitchPrimitive.Root>,
    SwitchProps
  >(function Switch({ className, ...props }, ref) {
    return (
      <SwitchPrimitive.Root
        ref={ref}
        className={clsx(
          "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-60 data-[state=checked]:bg-brand data-[state=unchecked]:bg-[color:var(--color-fg-muted)]",
          className
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          className={clsx(
            "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
          )}
        />
      </SwitchPrimitive.Root>
    );
  })
);

