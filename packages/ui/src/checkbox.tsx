import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import clsx from "clsx";

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {}

export const Checkbox = React.memo(
  React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    CheckboxProps
  >(function Checkbox({ className, ...props }, ref) {
    return (
      <CheckboxPrimitive.Root
        ref={ref}
        className={clsx(
          "peer h-4 w-4 shrink-0 rounded-[var(--radius-sm)] border border-[color:var(--color-border-base)]",
          "bg-[color:var(--color-surface-1)]",
          "ring-offset-background",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-primary)] focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-60 disabled:border-[color:var(--color-fg-muted)]",
          "data-[state=checked]:bg-[color:var(--color-brand-primary)] data-[state=checked]:text-white data-[state=checked]:border-[color:var(--color-brand-primary)]",
          "hover:border-[color:var(--color-brand-primary)] data-[state=checked]:hover:bg-[color:var(--color-brand-primary)]",
          "transition-colors duration-[var(--motion-duration-base)]",
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={clsx("flex items-center justify-center text-white")}
        >
          <Check className="h-3 w-3 stroke-[2.5]" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  })
);

