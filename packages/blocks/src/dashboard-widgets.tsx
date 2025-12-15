"use client";

import * as React from "react";
import { MetricCard } from "@fragment_ui/ui";
import { ActivityFeed } from "@fragment_ui/ui";
import { QuickActions } from "@fragment_ui/ui";
import { WidgetContainer } from "./widget-container";
import clsx from "clsx";

export interface DashboardWidget {
  id: string;
  type: "metric" | "activity" | "quickActions" | "custom";
  title?: string;
  content: React.ReactNode;
  span?: 1 | 2 | 3 | 4; // Grid span
  minHeight?: string;
}

export interface DashboardWidgetsProps {
  widgets: DashboardWidget[];
  columns?: 4 | 6 | 12;
  className?: string;
}

export function DashboardWidgets({
  widgets,
  columns = 12,
  className,
}: DashboardWidgetsProps) {
  const gridCols = {
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
    12: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  const getSpanClass = (span: number, totalColumns: number) => {
    if (totalColumns === 12) {
      const spanMap: Record<number, string> = {
        1: "col-span-1",
        2: "col-span-1 md:col-span-2",
        3: "col-span-1 md:col-span-2 lg:col-span-3",
        4: "col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4",
      };
      return spanMap[span] || spanMap[1];
    }
    // For 4 and 6 column grids, use simpler span logic
    return span === 1 ? "" : `col-span-${span}`;
  };

  return (
    <div
      className={clsx(
        "grid gap-4",
        gridCols[columns],
        className
      )}
    >
      {widgets.map((widget) => (
        <div
          key={widget.id}
          className={clsx(
            getSpanClass(widget.span || 1, columns),
            widget.minHeight && `min-h-[${widget.minHeight}]`
          )}
        >
          {widget.type === "custom" ? (
            widget.content
          ) : (
            <WidgetContainer title={widget.title}>
              {widget.content}
            </WidgetContainer>
          )}
        </div>
      ))}
    </div>
  );
}

