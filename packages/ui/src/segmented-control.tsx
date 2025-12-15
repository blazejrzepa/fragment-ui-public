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
  sm: "h-8 text-xs px-2",
  md: "h-10 text-sm px-3",
  lg: "h-12 text-base px-4",
};

const variantClasses = {
  default: {
    container: "bg-[color:var(--color-surface-2)] p-1",
    item: {
      base: "text-[color:var(--color-fg-base)]",
      active:
        "bg-[color:var(--color-surface-1)] text-[color:var(--color-fg-base)] shadow-sm",
    },
  },
  outline: {
    container: "border border-[color:var(--color-border-base)] p-1",
    item: {
      base: "text-[color:var(--color-fg-base)]",
      active:
        "bg-[color:var(--color-brand-primary)] text-white border-[color:var(--color-brand-primary)]",
    },
  },
  filled: {
    container: "bg-[color:var(--color-surface-1)] p-1 border border-[color:var(--color-border-base)]",
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
        onValueChange={handleValueChange as (value: string[]) => void}
        disabled={disabled}
        className={clsx(
          "inline-flex items-center rounded-[var(--radius-md)]",
          variantStyle.container,
          className
        )}
      >
        {safeOptions.map((option) => (
          <ToggleGroupPrimitive.Item
            key={option.value}
            value={option.value}
            disabled={disabled || option.disabled}
            className={clsx(
              "inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-sm)] font-medium",
              "transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              sizeClasses[size],
              variantStyle.item.base,
              "data-[state=on]:font-semibold",
              variant === "default" &&
                "data-[state=on]:bg-[color:var(--color-surface-1)] data-[state=on]:text-[color:var(--color-fg-base)] data-[state=on]:shadow-sm",
              variant === "outline" &&
                "data-[state=on]:bg-[color:var(--color-brand-primary)] data-[state=on]:text-white data-[state=on]:border data-[state=on]:border-[color:var(--color-brand-primary)]",
              variant === "filled" &&
                "data-[state=on]:bg-[color:var(--color-brand-primary)] data-[state=on]:text-white"
            )}
            aria-label={option.label}
          >
            {option.icon && (
              <span className="flex-shrink-0" aria-hidden="true">
                {option.icon}
              </span>
            )}
            <span>{option.label}</span>
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
      onValueChange={handleValueChange as (value: string) => void}
      disabled={disabled}
      className={clsx(
        "inline-flex items-center rounded-[var(--radius-md)]",
        variantStyle.container,
        className
      )}
    >
      {safeOptions.map((option) => (
        <ToggleGroupPrimitive.Item
          key={option.value}
          value={option.value}
          disabled={disabled || option.disabled}
          className={clsx(
            "inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-sm)] font-medium",
            "transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50",
            sizeClasses[size],
            variantStyle.item.base,
            "data-[state=on]:font-semibold",
            variant === "default" &&
              "data-[state=on]:bg-[color:var(--color-surface-1)] data-[state=on]:text-[color:var(--color-fg-base)] data-[state=on]:shadow-sm",
            variant === "outline" &&
              "data-[state=on]:bg-[color:var(--color-brand-primary)] data-[state=on]:text-white data-[state=on]:border data-[state=on]:border-[color:var(--color-brand-primary)]",
            variant === "filled" &&
              "data-[state=on]:bg-[color:var(--color-brand-primary)] data-[state=on]:text-white"
          )}
          aria-label={option.label}
        >
          {option.icon && (
            <span className="flex-shrink-0" aria-hidden="true">
              {option.icon}
            </span>
          )}
          <span>{option.label}</span>
        </ToggleGroupPrimitive.Item>
      ))}
    </ToggleGroupPrimitive.Root>
  );
})
);

SegmentedControl.displayName = "SegmentedControl";

