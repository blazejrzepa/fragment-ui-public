"use client";

import * as React from "react";
import { MetricCard } from "@fragment_ui/ui";
import clsx from "clsx";

export interface KPIMetric {
  id: string;
  title: string;
  value: string | number;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface KPIDashboardProps {
  title?: string;
  description?: string;
  metrics: KPIMetric[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function KPIDashboard({
  title,
  description,
  metrics = [],
  columns = 4,
  className,
}: KPIDashboardProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <section className={clsx("py-8", className)}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-bold text-[color:var(--color-fg-base)] mb-2">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm text-[color:var(--color-fg-muted)]">
              {description}
            </p>
          )}
        </div>
      )}
      <div className={clsx("grid gap-4", gridCols[columns])}>
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
    </section>
  );
}

