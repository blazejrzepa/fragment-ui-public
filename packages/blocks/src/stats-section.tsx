"use client";

import * as React from "react";
import { Card, CardContent } from "@fragment_ui/ui";
import clsx from "clsx";

export interface StatItem {
  label: string;
  value: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export interface StatsSectionProps {
  title?: string;
  items: StatItem[];
  layout?: "grid" | "horizontal";
  columns?: 2 | 3 | 4;
  className?: string;
}

export function StatsSection({
  title,
  items = [],
  layout = "grid",
  columns = 4,
  className,
}: StatsSectionProps) {
  // Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];
  
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  const getTrendIcon = (trend?: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "↑";
      case "down":
        return "↓";
      default:
        return "→";
    }
  };

  const getTrendColor = (trend?: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "text-[color:var(--color-status-success-base)]";
      case "down":
        return "text-[color:var(--color-status-error-base)]";
      default:
        return "text-[color:var(--color-fg-muted)]";
    }
  };

  if (layout === "horizontal") {
    return (
      <section className={clsx("py-8", className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {title && (
            <h2 className="text-2xl font-semibold mb-6 text-[color:var(--color-fg-base)]">
              {title}
            </h2>
          )}
          <div className="flex flex-wrap gap-4">
            {safeItems.map((item, index) => (
              <Card key={index} className="flex-1 min-w-[200px]">
                <CardContent className="p-6">
                  <div className="text-sm text-[color:var(--color-fg-muted)] mb-1">
                    {item.label}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-2xl font-bold text-[color:var(--color-fg-base)]">
                      {item.value}
                    </div>
                    {item.trend && item.trendValue && (
                      <div
                        className={clsx(
                          "text-sm flex items-center gap-1",
                          getTrendColor(item.trend)
                        )}
                      >
                        <span>{getTrendIcon(item.trend)}</span>
                        <span>{item.trendValue}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={clsx("py-8", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-2xl font-semibold mb-6 text-[color:var(--color-fg-base)]">
            {title}
          </h2>
        )}
        <div className={clsx("grid gap-4", gridCols[columns])}>
          {safeItems.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="text-sm text-[color:var(--color-fg-muted)] mb-1">
                  {item.label}
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold text-[color:var(--color-fg-base)]">
                    {item.value}
                  </div>
                  {item.trend && item.trendValue && (
                    <div
                      className={clsx(
                        "text-sm flex items-center gap-1",
                        getTrendColor(item.trend)
                      )}
                    >
                      <span>{getTrendIcon(item.trend)}</span>
                      <span>{item.trendValue}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

