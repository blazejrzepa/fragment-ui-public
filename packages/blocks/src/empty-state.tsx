"use client";

import * as React from "react";
import { Button } from "@fragment_ui/ui";
import clsx from "clsx";

export interface EmptyStateProps {
  /**
   * Icon or illustration to display
   */
  icon?: React.ReactNode;
  /**
   * Main title/heading
   */
  title?: string;
  /**
   * Description text
   */
  description?: string;
  /**
   * Primary action button
   */
  action?: {
    label: string;
    onClick: () => void;
    variant?: "solid" | "outline" | "ghost";
  };
  /**
   * Secondary action button
   */
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: "solid" | "outline" | "ghost";
  };
  /**
   * Additional className for container
   */
  className?: string;
  /**
   * Size variant
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
}

/**
 * EmptyState - Standalone empty state component
 * 
 * Displays an empty state message with optional icon, description, and actions.
 * Useful for empty lists, tables, search results, etc.
 * 
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<Inbox className="w-12 h-12" />}
 *   title="No items found"
 *   description="Get started by creating your first item."
 *   action={{
 *     label: "Create Item",
 *     onClick: () => handleCreate(),
 *   }}
 * />
 * ```
 */
export function EmptyState({
  icon,
  title = "No items found",
  description,
  action,
  secondaryAction,
  className,
  size = "md",
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      icon: "w-8 h-8",
      title: "text-lg",
      description: "text-sm",
      spacing: "py-8",
    },
    md: {
      icon: "w-12 h-12",
      title: "text-xl",
      description: "text-base",
      spacing: "py-12",
    },
    lg: {
      icon: "w-16 h-16",
      title: "text-2xl",
      description: "text-lg",
      spacing: "py-16",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center text-center",
        currentSize.spacing,
        className
      )}
    >
      {icon && (
        <div
          className={clsx(
            "mb-4 text-[color:var(--color-fg-muted)]",
            currentSize.icon
          )}
        >
          {icon}
        </div>
      )}

      {title && (
        <h3
          className={clsx(
            "font-semibold text-[color:var(--color-fg-base)] mb-2",
            currentSize.title
          )}
        >
          {title}
        </h3>
      )}

      {description && (
        <p
          className={clsx(
            "text-[color:var(--color-fg-muted)] mb-6 max-w-md",
            currentSize.description
          )}
        >
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="flex gap-3">
          {action && (
            <Button
              variant={action.variant || "solid"}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant={secondaryAction.variant || "outline"}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

