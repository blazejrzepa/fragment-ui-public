"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";
import clsx from "clsx";

export interface WidgetContainerProps {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  onRefresh?: () => void;
}

export function WidgetContainer({
  title,
  children,
  actions,
  footer,
  className,
  collapsible = false,
  defaultCollapsed = false,
  onRefresh,
}: WidgetContainerProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  return (
    <Card className={clsx("h-full flex flex-col", className)}>
      {(title || actions || onRefresh || collapsible) && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          {title && <CardTitle>{title}</CardTitle>}
          <div className="flex items-center gap-2">
            {actions}
            {onRefresh && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                aria-label="Refresh"
              >
                ↻
              </Button>
            )}
            {collapsible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-label={isCollapsed ? "Expand" : "Collapse"}
              >
                {isCollapsed ? "↓" : "↑"}
              </Button>
            )}
          </div>
        </CardHeader>
      )}
      {!isCollapsed && (
        <CardContent className="flex-1 overflow-auto">
          {children}
        </CardContent>
      )}
      {footer && !isCollapsed && (
        <div className="px-6 pb-4 border-t border-[color:var(--color-border-base)] pt-4">
          {footer}
        </div>
      )}
    </Card>
  );
}

