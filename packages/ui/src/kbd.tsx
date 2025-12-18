import * as React from "react";
import clsx from "clsx";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const Kbd = React.memo(
  React.forwardRef<HTMLElement, KbdProps>(function Kbd({ className, children, ...props }, ref) {
    return (
      <kbd
        data-slot="kbd"
        ref={ref}
        className={clsx(
          // Inspired by shadcn/ui `kbd`, but using Fragment UI tokens.
          // Visual goals:
          // - muted pill-like keycap
          // - consistent min size and centered content
          // - sans typography (docs style), not monospace
          "pointer-events-none inline-flex shrink-0 box-border h-5 w-fit min-w-5 select-none items-center justify-center gap-[var(--space-1)] rounded-[4px] border border-[color:var(--color-border-base)] bg-[color:var(--color-surface-1)] px-[var(--space-1)] font-sans text-[length:var(--typography-size-xs)] font-medium leading-none text-[color:var(--color-fg-muted)]",
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
        data-slot="kbd-group"
        ref={ref}
        className={clsx(
          // Keep the "+" separator readable and aligned with keys by default.
          "inline-flex items-center gap-[var(--space-1)] text-[color:var(--color-fg-muted)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  })
);

KbdGroup.displayName = "KbdGroup";

