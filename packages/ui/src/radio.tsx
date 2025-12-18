import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import clsx from "clsx";

export const RadioGroup = React.memo(
  React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
  >(function RadioGroup({ className, ...props }, ref) {
    return (
      <RadioGroupPrimitive.Root
        ref={ref}
        className={clsx("flex flex-col gap-[var(--space-2)]", className)}
        {...props}
      />
    );
  })
);

export const RadioGroupItem = React.memo(
  React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
  >(function RadioGroupItem({ className, ...props }, ref) {
    return (
      <RadioGroupPrimitive.Item
        ref={ref}
        className={clsx(
          "aspect-square h-4 w-4 rounded-full border border-[color:var(--color-fg-muted)] text-brand ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
          className
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <div className="h-2.5 w-2.5 rounded-full bg-brand" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
    );
  })
);

export interface RadioProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label?: string;
  description?: string;
}

export const Radio = React.memo(
  React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Item>,
    RadioProps
  >(function Radio({ label, description, className, id, ...props }, ref) {
  const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="flex items-start gap-[var(--space-2)]">
      <RadioGroupItem ref={ref} id={radioId} className={clsx("mt-0.5", className)} {...props} />
      <div className="flex-1">
        {label && (
          <label
            htmlFor={radioId}
            className="text-sm font-medium text-[color:var(--color-fg-base)] cursor-pointer block"
          >
            {label}
          </label>
        )}
        {description && (
          <p className="text-xs text-[color:var(--color-fg-muted)] mt-0.5">
            {description}
          </p>
        )}
      </div>
    </div>
  );
})
);

