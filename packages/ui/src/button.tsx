import * as React from "react";
import clsx from "clsx";
import { Spinner } from "./spinner";

type Variant = "solid" | "outline" | "ghost" | "secondary";
type Size = "sm" | "md" | "lg";
type Radius = "none" | "sm" | "md" | "lg" | "full";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Render as a child element (e.g. `next/link`) to avoid invalid nested interactive elements.
   * When enabled, `Button` will clone the single child element and apply button styles + content.
   *
   * @example
   * ```tsx
   * <Button asChild variant="secondary">
   *   <Link href="/docs/setup">Setup</Link>
   * </Button>
   * ```
   */
  asChild?: boolean;
  variant?: Variant;
  size?: Size;
  radius?: Radius;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
}

const radiusClasses = {
  none: "rounded-none",
  sm: "rounded-[var(--radius-sm)]",
  md: "rounded-[var(--radius-md)]",
  lg: "rounded-[var(--radius-lg)]",
  full: "rounded-full",
} as const;

const classesBy = {
  base: "inline-flex items-center justify-center select-none font-medium",
  transition: "transition-all duration-[var(--motion-duration-base,200ms)] ease-[var(--motion-easing-ease-in-out,cubic-bezier(0.4,0,0.2,1))]",
  focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-surface-1)]",
  size: {
    sm: "h-[var(--space-8)] px-[var(--space-3)] gap-[var(--space-2)] leading-[1.5]",
    md: "h-[calc(var(--space-8)+var(--space-2))] px-[var(--space-4)] gap-[var(--space-2)] leading-[1.5]",
    lg: "h-[calc(var(--space-8)+var(--space-4))] px-[var(--space-6)] gap-[var(--space-2)] leading-[1.5]",
  },
  variant: {
    solid:
      "bg-[color:var(--color-button-solid-bg)] text-[color:var(--color-button-solid-text)] shadow-[var(--shadow-sm,0_1px_2px_rgba(0,0,0,.1))] hover:bg-[color:var(--color-button-solid-hover)] hover:shadow-[var(--shadow-md,0_4px_10px_rgba(0,0,0,.15))] active:bg-[color:var(--color-button-solid-hover)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50 disabled:hover:shadow-[var(--shadow-sm,0_1px_2px_rgba(0,0,0,.1))]",
    outline:
      "border border-[color:var(--color-border-base)] bg-transparent text-[color:var(--color-fg-base)] hover:bg-[color:var(--color-surface-2)] hover:border-[color:var(--color-border-base)] active:bg-[color:var(--color-surface-2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent",
    ghost:
      "bg-transparent text-[color:var(--color-fg-base)] hover:bg-[color:var(--color-surface-1)] active:bg-[color:var(--color-surface-1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent",
    secondary:
      "bg-[color:var(--color-surface-1)] text-[color:var(--color-fg-base)] !border-0 hover:bg-[color:var(--color-surface-2)] active:bg-[color:var(--color-surface-2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[color:var(--color-surface-1)]",
  },
} as const;

export const Button = React.memo(
  React.forwardRef<HTMLButtonElement, ButtonProps>(
    function Button(
      {
        asChild = false,
        variant = "solid",
        size = "md",
        radius = "sm",
        leadingIcon,
        trailingIcon,
        className,
        children,
        loading = false,
        loadingText,
        disabled,
        type,
        ...props
      },
      ref
    ) {
      const isDisabled = disabled || loading;
      const spinnerSize = size === "sm" ? "sm" : size === "lg" ? "md" : "sm";
      
      // Extract children from props to prevent it from being spread into the button element
      // React.createElement passes children in props, but we want to render it explicitly
      const { children: propsChildren, ...restProps } = props as any;
      const finalChildren = children || propsChildren;
      
      // Check if children is a fragment with multiple elements (for justify-between support)
      const isFragment = React.isValidElement(finalChildren) && 
        finalChildren.type === React.Fragment;
      const childrenArray = React.Children.toArray(finalChildren);
      const hasMultipleChildren = childrenArray.length > 1;
      
      // Check if button has only icon (no text children)
      // Icon-only button: has icon as leadingIcon/trailingIcon with no children, OR has only React element as children (icon component)
      // Helper function to recursively check for text content in React elements
      const hasTextInElement = (element: React.ReactNode): boolean => {
        if (typeof element === 'string') {
          return element.trim() !== '';
        }
        if (typeof element === 'number') {
          return true;
        }
        if (React.isValidElement(element)) {
          // Check children of the element
          if (element.props?.children) {
            const elementChildren = React.Children.toArray(element.props.children);
            return elementChildren.some(child => hasTextInElement(child));
          }
        }
        return false;
      };
      
      const hasTextContent = childrenArray.some(child => hasTextInElement(child));
      
      // Check if children contains only React elements (icons) without text
      const hasOnlyReactElements = childrenArray.length > 0 && 
        childrenArray.every(child => React.isValidElement(child)) &&
        !hasTextContent;
      
      // Button is icon-only if:
      // 1. Has leadingIcon/trailingIcon and no text children, OR
      // 2. Has only React elements (icons) as children and no leadingIcon/trailingIcon
      const hasOnlyIcon = 
        ((leadingIcon || trailingIcon) && (!finalChildren || !hasTextContent)) ||
        (hasOnlyReactElements && !leadingIcon && !trailingIcon);
      
      // Size classes for icon-only buttons (square buttons)
      const iconOnlySizeClasses = {
        sm: "h-[var(--space-8)] w-[var(--space-8)] p-[var(--space-0)] gap-[var(--space-0)]",
        md: "h-[calc(var(--space-8)+var(--space-2))] w-[calc(var(--space-8)+var(--space-2))] p-[var(--space-0)] gap-[var(--space-0)]",
        lg: "h-[calc(var(--space-8)+var(--space-4))] w-[calc(var(--space-8)+var(--space-4))] p-[var(--space-0)] gap-[var(--space-0)]",
      } as const;
      
      const cls = clsx(
        classesBy.base,
        classesBy.transition,
        classesBy.focus,
        hasOnlyIcon ? iconOnlySizeClasses[size] : classesBy.size[size],
        radiusClasses[radius],
        classesBy.variant[variant],
        className
      );
      
      // Font size styles - use inline style for CSS variables to ensure they work
      const fontSizeStyle = hasOnlyIcon ? {} : {
        fontSize: size === "sm" ? "12px" : size === "md" ? "var(--typography-size-sm)" : "var(--typography-size-md)"
      };
      
      const shouldWrapInSpan = !isFragment && !hasMultipleChildren;

      // --- asChild mode (clone a single child element, e.g. next/link) ---
      if (asChild) {
        if (!React.isValidElement(finalChildren)) {
          // Fallback to regular button rendering if usage is incorrect
          // (prevents runtime crash in production)
          return (
            <button
              ref={ref}
              className={cls}
              style={fontSizeStyle}
              disabled={isDisabled}
              data-button-variant={variant}
              type={type}
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

        const child = finalChildren as React.ReactElement<any>;
        const {
          className: childClassName,
          style: childStyle,
          onClick: childOnClick,
          children: childChildren,
          ...childRest
        } = child.props || {};

        const { onClick: restOnClick, style: restStyle, ...restNoClickNoStyle } = restProps as any;

        const labelChildren = childChildren;
        const labelIsFragment = React.isValidElement(labelChildren) && labelChildren.type === React.Fragment;
        const labelChildrenArray = React.Children.toArray(labelChildren);
        const labelHasMultipleChildren = labelChildrenArray.length > 1;
        const shouldWrapLabelInSpan = !labelIsFragment && !labelHasMultipleChildren;

        const composedChildren = loading ? (
          <>
            <Spinner size={spinnerSize} className="mr-2" />
            <span>{loadingText || labelChildren}</span>
          </>
        ) : (
          <>
            {leadingIcon ? <span>{leadingIcon}</span> : null}
            {shouldWrapLabelInSpan ? <span>{labelChildren}</span> : labelChildren}
            {trailingIcon ? <span>{trailingIcon}</span> : null}
          </>
        );

        const disabledClasses = isDisabled ? "pointer-events-none opacity-50" : "";
        const mergedClassName = clsx(cls, disabledClasses, childClassName);
        const mergedStyle = { ...(childStyle || {}), ...(fontSizeStyle || {}), ...(restStyle || {}) };

        const mergedOnClick = (event: any) => {
          if (isDisabled) {
            event?.preventDefault?.();
            event?.stopPropagation?.();
            return;
          }
          childOnClick?.(event);
          restOnClick?.(event);
        };

        return React.cloneElement(
          child,
          {
            ...childRest,
            ...restNoClickNoStyle,
            className: mergedClassName,
            style: mergedStyle,
            onClick: mergedOnClick,
            "data-button-variant": variant,
            ...(isDisabled ? { "aria-disabled": true, tabIndex: -1 } : null),
          },
          composedChildren
        );
      }

      // --- regular button ---
      return (
        <button 
          ref={ref} 
          className={cls}
          style={fontSizeStyle}
          disabled={isDisabled}
          data-button-variant={variant}
          type={type}
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

