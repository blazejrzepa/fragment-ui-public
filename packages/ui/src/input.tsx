import * as React from "react";
import clsx from "clsx";
import { Spinner } from "./spinner";

type Size = "sm" | "md" | "lg";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "children"> {
  size?: Size;
  loading?: boolean;
  error?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const classesBy = {
  base: "flex items-center flex-1 rounded-[var(--radius-sm,8px)] bg-[color:var(--color-surface-2)] placeholder:text-[color:var(--color-fg-muted)] text-[color:var(--color-fg-base)] focus:outline-none disabled:opacity-60",
  size: {
    sm: "h-8 py-1.5 px-3 text-sm",
    md: "h-10 py-2 px-4 text-sm",
    lg: "h-12 py-3 px-4 text-base",
  },
  state: {
    default: "",
    error: "",
  },
} as const;

export const Input = React.memo(
  React.forwardRef<HTMLInputElement, InputProps>(
    function Input(
      {
        className,
        size = "md",
        loading,
        error,
        leadingIcon,
        trailingIcon,
        style,
        ...props
      },
      ref
    ) {
      return (
        <div className="relative flex items-center w-full">
          {leadingIcon && (
            <span className="absolute left-[var(--space-3,12px)] flex items-center pointer-events-none z-10" style={{ width: "16px", height: "16px" }}>
              {leadingIcon}
            </span>
          )}
          <input
            ref={ref}
            className={clsx(
              classesBy.base,
              classesBy.size[size],
              error ? classesBy.state.error : classesBy.state.default,
              leadingIcon && "pl-[calc(var(--space-3,12px)+16px+var(--space-1,4px))]",
              (trailingIcon || loading) && "pr-[calc(var(--space-3,12px)+16px+var(--space-1,4px))]",
              className
            )}
            style={{
              fontFamily: "Geist, sans-serif",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "160%",
              color: "var(--color-fg-base)",
              ...style,
            }}
            {...props}
          />
          {loading && (
            <div className="absolute right-[var(--space-3,12px)] top-1/2 -translate-y-1/2 pointer-events-none z-10" style={{ width: "16px", height: "16px" }}>
              <Spinner size="sm" />
            </div>
          )}
          {trailingIcon && !loading && (
            <span className="absolute right-[var(--space-3,12px)] top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10" style={{ width: "16px", height: "16px" }}>
              {trailingIcon}
            </span>
          )}
        </div>
      );
    }
  )
);

