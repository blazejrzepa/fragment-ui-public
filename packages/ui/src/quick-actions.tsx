"use client";

import * as React from "react";
import { Button } from "./button";
import { Card } from "./card";
import clsx from "clsx";

// Conditional Next.js Link import - fallback to anchor tag if not available
let Link: React.ComponentType<{ href: string; children: React.ReactNode; className?: string }>;
try {
  Link = require("next/link").default;
} catch {
  Link = ({ href, children, className, ...props }: { href: string; children: React.ReactNode; className?: string; [key: string]: any }) => (
    <a href={href} className={className} {...props}>{children}</a>
  );
}

export interface QuickAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  onClick?: () => void;
  href?: string;
  variant?: "solid" | "outline" | "ghost";
  disabled?: boolean;
}

export interface QuickActionsProps {
  actions: QuickAction[];
  columns?: 2 | 3 | 4;
  layout?: "grid" | "list";
  className?: string;
}

export const QuickActions = React.memo(
  React.forwardRef<HTMLDivElement, QuickActionsProps>(
    function QuickActions(
      { actions, columns = 3, layout = "grid", className },
      ref
    ) {
      const gridCols = {
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      };

      if (layout === "list") {
        return (
          <div ref={ref} className={clsx("space-y-2", className)}>
            {actions.map((action) =>
              action.href ? (
                <Link key={action.id} href={action.href}>
                  <Button
                    variant={action.variant || "solid"}
                    disabled={action.disabled}
                    className="w-full justify-start"
                    data-action-id={action.id}
                    data-action-kind="quickAction"
                  >
                    {action.icon && <span className="mr-2">{action.icon}</span>}
                    <div className="flex-1 text-left">
                      <div className="font-medium">{action.label}</div>
                      {action.description && (
                        <div className="text-xs text-[color:var(--color-fg-muted)]">
                          {action.description}
                        </div>
                      )}
                    </div>
                  </Button>
                </Link>
              ) : (
                <Button
                  key={action.id}
                  variant={action.variant || "solid"}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className="w-full justify-start"
                  data-action-id={action.id}
                  data-action-kind="quickAction"
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  <div className="flex-1 text-left">
                    <div className="font-medium">{action.label}</div>
                    {action.description && (
                      <div className="text-xs text-[color:var(--color-fg-muted)]">
                        {action.description}
                      </div>
                    )}
                  </div>
                </Button>
              )
            )}
          </div>
        );
      }

      return (
        <div
          ref={ref}
          className={clsx("grid gap-4", gridCols[columns], className)}
        >
          {actions.map((action) => (
            <Card
              key={action.id}
              className={clsx(
                "p-4 cursor-pointer hover:shadow-lg transition-shadow",
                action.disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={action.disabled ? undefined : action.onClick}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                {action.icon && (
                  <div className="text-2xl text-[color:var(--color-brand-primary)]">
                    {action.icon}
                  </div>
                )}
                <div className="font-medium text-[color:var(--color-fg-base)]">
                  {action.label}
                </div>
                {action.description && (
                  <p className="text-xs text-[color:var(--color-fg-muted)]">
                    {action.description}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      );
    }
  )
);

QuickActions.displayName = "QuickActions";

