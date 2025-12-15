import * as React from "react";
import clsx from "clsx";
import { Spinner } from "./spinner";

type Variant = "solid" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
}

const classesBy = {
  base: "inline-flex items-center justify-center select-none rounded-[var(--radius-sm,8px)] font-medium",
  transition: "transition-all duration-[var(--motion-duration-base,200ms)] ease-[var(--motion-easing-ease-in-out,cubic-bezier(0.4,0,0.2,1))]",
  focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-surface-1)]",
  size: {
    sm: "h-8 px-[var(--space-3,12px)] gap-[var(--space-2,8px)] text-sm leading-[1.5]",
    md: "h-10 px-[var(--space-4,16px)] gap-[var(--space-2,8px)] text-sm leading-[1.5]",
    lg: "h-12 px-[var(--space-6,24px)] gap-[var(--space-2,8px)] text-base leading-[1.5]",
  },
  variant: {
    solid:
      "bg-[color:var(--color-button-solid-bg)] text-[color:var(--color-button-solid-text)] shadow-[var(--shadow-sm,0_1px_2px_rgba(0,0,0,.1))] hover:opacity-90 hover:shadow-[var(--shadow-md,0_4px_10px_rgba(0,0,0,.15))] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50 disabled:hover:shadow-[var(--shadow-sm,0_1px_2px_rgba(0,0,0,.1))]",
    outline:
      "border border-[color:var(--color-border-base)] bg-transparent text-[color:var(--color-fg-base)] hover:bg-[color:var(--color-surface-2)] hover:border-[color:var(--color-border-base)] active:bg-[color:var(--color-surface-2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent",
    ghost:
      "bg-transparent text-[color:var(--color-fg-base)] hover:bg-[color:var(--color-surface-2)] active:bg-[color:var(--color-surface-2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent",
  },
} as const;

export const Button = React.memo(
  React.forwardRef<HTMLButtonElement, ButtonProps>(
    function Button(
      {
        variant = "solid",
        size = "md",
        leadingIcon,
        trailingIcon,
        className,
        children,
        loading = false,
        loadingText,
        disabled,
        ...props
      },
      ref
    ) {
      const isDisabled = disabled || loading;
      const spinnerSize = size === "sm" ? "sm" : size === "lg" ? "md" : "sm";
      
      const cls = clsx(
        classesBy.base,
        classesBy.transition,
        classesBy.focus,
        classesBy.size[size],
        classesBy.variant[variant],
        className
      );
      // Extract children from props to prevent it from being spread into the button element
      // React.createElement passes children in props, but we want to render it explicitly
      const { children: propsChildren, ...restProps } = props as any;
      const finalChildren = children || propsChildren;
      
      // Check if children is a fragment with multiple elements (for justify-between support)
      const isFragment = React.isValidElement(finalChildren) && 
        finalChildren.type === React.Fragment;
      const childrenArray = React.Children.toArray(finalChildren);
      const hasMultipleChildren = childrenArray.length > 1;
      const shouldWrapInSpan = !isFragment && !hasMultipleChildren;

      return (
        <button 
          ref={ref} 
          className={cls} 
          disabled={isDisabled}
          data-button-variant={variant}
          {...restProps}
        >
          {loading ? (
            <>
              <Spinner size={spinnerSize} className="mr-2" />
              <span>{loadingText || finalChildren}</span>
            </>
          ) : (
            <>
              {leadingIcon ? <span>{leadingIcon}</span> : null}
              {shouldWrapInSpan ? <span>{finalChildren}</span> : finalChildren}
              {trailingIcon ? <span>{trailingIcon}</span> : null}
            </>
          )}
        </button>
      );
    }
  )
);

