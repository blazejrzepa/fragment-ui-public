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
  base: "flex items-center flex-1 rounded-[var(--radius-sm)] bg-[color:var(--color-surface-1)] placeholder:text-[color:var(--color-fg-base)] text-[color:color-mix(in_oklab,var(--color-fg-base)_90%,transparent)] focus:outline-none disabled:opacity-60 font-medium",
  size: {
    sm: "h-[var(--space-8)] py-[calc(var(--space-1)+2px)] px-[var(--space-3)] text-[var(--typography-size-sm)]",
    md: "h-[calc(var(--space-8)+var(--space-2))] py-[var(--space-2)] px-[var(--space-4)] text-[var(--typography-size-sm)]",
    lg: "h-[calc(var(--space-8)+var(--space-4))] py-[var(--space-3)] px-[var(--space-4)] text-[var(--typography-size-md)]",
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
              lineHeight: "160%",
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

