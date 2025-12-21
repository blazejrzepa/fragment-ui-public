"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import clsx from "clsx";

export interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface SegmentedControlSingleProps {
  options?: SegmentedControlOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  multiple?: false;
  variant?: "default" | "outline" | "filled";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

interface SegmentedControlMultipleProps {
  options?: SegmentedControlOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  multiple: true;
  variant?: "default" | "outline" | "filled";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

export type SegmentedControlProps =
  | SegmentedControlSingleProps
  | SegmentedControlMultipleProps;

const sizeClasses = {
  sm: "h-[var(--space-8)] px-[var(--space-3)] leading-[1.5]",
  md: "h-[calc(var(--space-8)+var(--space-2))] px-[var(--space-4)] leading-[1.5]",
  lg: "h-[calc(var(--space-8)+var(--space-4))] px-[var(--space-6)] leading-[1.5]",
};

const variantClasses = {
  default: {
    container: "bg-[color:var(--color-surface-1)] !p-0 ring-1 ring-inset ring-[color:var(--color-border-base)] gap-[var(--space-0)]",
    item: {
      base: "text-[color:var(--color-fg-base)]",
      active:
        "bg-[color:var(--color-brand-primary)] text-white shadow-xs",
    },
  },
  outline: {
    container: "ring-1 ring-inset ring-[color:var(--color-border-base)] !p-0 gap-[var(--space-0)]",
    item: {
      base: "text-[color:var(--color-fg-base)]",
      active:
        "bg-[color:var(--color-brand-primary)] text-white ring-1 ring-inset ring-[color:var(--color-brand-primary)]",
    },
  },
  filled: {
    container: "bg-[color:var(--color-surface-1)] !p-0 ring-1 ring-inset ring-[color:var(--color-border-base)] gap-[var(--space-0)]",
    item: {
      base: "text-[color:var(--color-fg-muted)]",
      active:
        "bg-[color:var(--color-brand-primary)] text-white",
    },
  },
};

export const SegmentedControl = React.memo(
  React.forwardRef<
    HTMLDivElement,
    SegmentedControlProps
  >(function SegmentedControl(props, ref) {
  const {
    options,
    value,
    defaultValue,
    onChange,
    multiple = false,
    variant = "default",
    size = "md",
    disabled = false,
    className,
  } = props;

  // Ensure options is always an array
  const safeOptions = React.useMemo(() => {
    if (!options || !Array.isArray(options)) {
      return [];
    }
    return options;
  }, [options]);

  const handleValueChange = React.useCallback(
    (newValue: string | string[]) => {
      if (onChange) {
        onChange(newValue as any);
      }
    },
    [onChange]
  );

  const variantStyle = variantClasses[variant];

  if (multiple) {
    return (
      <ToggleGroupPrimitive.Root
        ref={ref}
        type="multiple"
        value={value as string[]}
        defaultValue={defaultValue as string[]}
        onValueChange={handleValueChange as (value: string[]) => void}
        disabled={disabled}
        className={clsx(
          "flex items-center rounded-[var(--radius-sm)]",
          variantStyle.container,
          className
        )}
        style={{ padding: 0 }}
      >
        {safeOptions.map((option) => (
          <ToggleGroupPrimitive.Item
            key={option.value}
            value={option.value}
            disabled={disabled || option.disabled}
            className={clsx(
              "inline-flex items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-sm)] font-semibold flex-1",
              "transition-all duration-[var(--motion-duration-base)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              sizeClasses[size],
              variantStyle.item.base,
              variant === "default" &&
                "data-[state=on]:bg-[color:var(--color-brand-primary)] data-[state=on]:text-white data-[state=on]:shadow-xs",
              variant === "outline" &&
                "data-[state=on]:bg-[color:var(--color-brand-primary)] data-[state=on]:text-white data-[state=on]:ring-1 data-[state=on]:ring-inset data-[state=on]:ring-[color:var(--color-brand-primary)]",
              variant === "filled" &&
                "data-[state=on]:bg-[color:var(--color-brand-primary)] data-[state=on]:text-white"
            )}
            style={{
              fontSize: size === "sm" ? "12px" : size === "md" ? "var(--typography-size-sm)" : "var(--typography-size-md)"
            }}
            aria-label={option.label || option.value}
          >
            {option.icon && (
              <span className="flex-shrink-0" aria-hidden="true">
                {option.icon}
              </span>
            )}
            {option.label && <span>{option.label}</span>}
          </ToggleGroupPrimitive.Item>
        ))}
      </ToggleGroupPrimitive.Root>
    );
  }

  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      type="single"
      value={value as string}
      defaultValue={defaultValue as string}
      onValueChange={handleValueChange as (value: string) => void}
      disabled={disabled}
      className={clsx(
        "flex items-center rounded-[var(--radius-sm)]",
        variantStyle.container,
        className
      )}
      style={{ padding: 0 }}
    >
      {safeOptions.map((option) => (
          <ToggleGroupPrimitive.Item
            key={option.value}
            value={option.value}
            disabled={disabled || option.disabled}
            className={clsx(
              "inline-flex items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-sm)] font-semibold flex-1",
              "transition-all duration-[var(--motion-duration-base)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              sizeClasses[size],
              variantStyle.item.base,
              variant === "default" &&
                "data-[state=on]:bg-[color:var(--color-brand-primary)] data-[state=on]:text-white data-[state=on]:shadow-xs",
              variant === "outline" &&
                "data-[state=on]:bg-[color:var(--color-brand-primary)] data-[state=on]:text-white data-[state=on]:ring-1 data-[state=on]:ring-inset data-[state=on]:ring-[color:var(--color-brand-primary)]",
              variant === "filled" &&
                "data-[state=on]:bg-[color:var(--color-brand-primary)] data-[state=on]:text-white"
            )}
            style={{
              fontSize: size === "sm" ? "12px" : size === "md" ? "var(--typography-size-sm)" : "var(--typography-size-md)"
            }}
            aria-label={option.label || option.value}
          >
          {option.icon && (
            <span className="flex-shrink-0" aria-hidden="true">
              {option.icon}
            </span>
          )}
          {option.label && <span>{option.label}</span>}
        </ToggleGroupPrimitive.Item>
      ))}
    </ToggleGroupPrimitive.Root>
  );
})
);

SegmentedControl.displayName = "SegmentedControl";

