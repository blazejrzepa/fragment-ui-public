"use client";

import * as React from "react";
import { MetricCard } from "@fragment_ui/ui";
import { Chart } from "@fragment_ui/ui";
import clsx from "clsx";

export interface AnalyticsMetric {
  id: string;
  title: string;
  value: string | number;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: React.ReactNode;
}

export interface AnalyticsChart {
  id: string;
  title: string;
  type: "line" | "bar" | "area" | "pie";
  data: any; // Chart data structure
  height?: number;
}

export interface AnalyticsDashboardProps {
  title?: string;
  description?: string;
  metrics: AnalyticsMetric[];
  charts: AnalyticsChart[];
  dateRange?: {
    value: string;
    onChange: (value: string) => void;
    options: Array<{ label: string; value: string }>;
  };
  className?: string;
}

export function AnalyticsDashboard({
  title,
  description,
  metrics = [],
  charts = [],
  dateRange,
  className,
}: AnalyticsDashboardProps) {
  return (
    <section className={clsx("py-8 space-y-6", className)}>
      {(title || description || dateRange) && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
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
          {dateRange && (
            <select
              value={dateRange.value}
              onChange={(e) => dateRange.onChange(e.target.value)}
              className="px-4 py-2 rounded-lg border border-[color:var(--color-border-base)] bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-brand-primary)]"
            >
              {dateRange.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            title={metric.title}
            value={metric.value}
            description={metric.description}
            trend={metric.trend}
            trendValue={metric.trendValue}
            icon={metric.icon}
          />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {charts.map((chart) => (
          <div
            key={chart.id}
            className="p-6 rounded-lg bg-[color:var(--color-surface-1)] border border-[color:var(--color-border-base)]"
          >
            <h3 className="text-lg font-semibold text-[color:var(--color-fg-base)] mb-4">
              {chart.title}
            </h3>
            <div style={{ height: chart.height || 300 }}>
              <Chart type={chart.type} data={chart.data} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

