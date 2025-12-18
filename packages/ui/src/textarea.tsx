import * as React from "react";
import clsx from "clsx";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.memo(
  React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    function Textarea({ className, error, ...props }, ref) {
      return (
        <textarea
          ref={ref}
          className={clsx(
            "min-h-[80px] w-full rounded-[var(--radius-md)] border bg-[color:var(--color-surface-1)] px-[var(--space-3)] py-[var(--space-2)] text-[var(--typography-size-sm)] text-[color:var(--color-fg-base)] placeholder:text-[color:var(--color-fg-muted)] focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed resize-y",
            error
              ? "border-[color:var(--color-status-error-border)]"
              : "border-[color:var(--color-fg-muted)]",
            className
          )}
          {...props}
        />
      );
    }
  )
);

