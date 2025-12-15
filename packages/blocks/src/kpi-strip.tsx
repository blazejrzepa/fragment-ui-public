"use client";

import * as React from "react";
import { MetricCard } from "@fragment_ui/ui";
import clsx from "clsx";

export interface KpiStripMetric {
  id: string;
  title: string;
  value: string | number;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface KpiStripProps {
  /**
   * Array of KPI metrics to display
   */
  metrics: KpiStripMetric[];
  /**
   * Number of columns in the grid
   * @default 4
   */
  columns?: 2 | 3 | 4;
  /**
   * Additional className for container
   */
  className?: string;
  /**
   * Gap between cards
   * @default "md"
   */
  gap?: "sm" | "md" | "lg";
}

/**
 * KpiStrip - Standalone, reusable row of KPI cards
 * 
 * A composable block for displaying key performance indicators in a horizontal strip.
 * Can be used independently or as part of larger dashboard layouts.
 * 
 * @example
 * ```tsx
 * <KpiStrip
 *   metrics={[
 *     { id: "users", title: "Users", value: "1,234", trend: "up", trendValue: "+12%" },
 *     { id: "revenue", title: "Revenue", value: "$5,678", trend: "up", trendValue: "+8%" },
 *   ]}
 *   columns={4}
 * />
 * ```
 */
export function KpiStrip({
  metrics = [],
  columns = 4,
  className,
  gap = "md",
}: KpiStripProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  const gapClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  if (metrics.length === 0) {
    return null;
  }

  return (
    <div className={clsx("grid", gridCols[columns], gapClasses[gap], className)}>
      {metrics.map((metric) => (
        <MetricCard
          key={metric.id}
          title={metric.title}
          value={metric.value}
          description={metric.description}
          trend={metric.trend}
          trendValue={metric.trendValue}
          icon={metric.icon}
          onClick={metric.onClick}
        />
      ))}
    </div>
  );
}

