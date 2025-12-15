import * as React from "react";
import clsx from "clsx";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const Kbd = React.memo(
  React.forwardRef<HTMLElement, KbdProps>(function Kbd({ className, children, ...props }, ref) {
    return (
      <kbd
        ref={ref}
        className={clsx(
          "pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-[color:var(--color-border-base)] bg-[color:var(--color-surface-1)] px-1.5 font-mono text-[10px] font-medium text-[color:var(--color-fg-muted)] opacity-100",
          className
        )}
        {...props}
      >
        {children}
      </kbd>
    );
  })
);

Kbd.displayName = "Kbd";

export interface KbdGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const KbdGroup = React.memo(
  React.forwardRef<HTMLDivElement, KbdGroupProps>(function KbdGroup(
    { className, children, ...props },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={clsx("inline-flex items-center gap-1", className)}
        {...props}
      >
        {children}
      </div>
    );
  })
);

KbdGroup.displayName = "KbdGroup";

