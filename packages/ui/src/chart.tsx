"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import clsx from "clsx";

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartProps {
  title?: string;
  description?: string;
  data: ChartDataPoint[];
  type?: "line" | "bar" | "area" | "pie" | "donut";
  height?: number;
  className?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  // For external chart libraries integration
  renderChart?: (data: ChartDataPoint[], options: ChartOptions) => React.ReactNode;
}

export interface ChartOptions {
  type: ChartProps["type"];
  height: number;
  showLegend: boolean;
  showGrid: boolean;
  colors?: string[];
}

/**
 * Chart component - wrapper for chart libraries
 * 
 * This component provides a consistent interface for charts while allowing
 * integration with external chart libraries (e.g., recharts, chart.js, victory).
 * 
 * If no renderChart function is provided, it renders a simple placeholder.
 * 
 * @example
 * ```tsx
 * <Chart
 *   title="Revenue"
 *   data={[
 *     { label: "Jan", value: 1000 },
 *     { label: "Feb", value: 1500 },
 *   ]}
 *   type="line"
 * />
 * ```
 */
export const Chart = React.memo(
  React.forwardRef<HTMLDivElement, ChartProps>(
    function Chart(
      {
        title,
        description,
        data = [],
        type = "line",
        height = 300,
        className,
        showLegend = true,
        showGrid = true,
        renderChart,
      },
      ref
    ) {
      // Ensure data is always an array
      const safeData = Array.isArray(data) ? data : [];
      
      const options: ChartOptions = {
        type,
        height,
        showLegend,
        showGrid,
      };

      const renderPlaceholder = () => {
        if (safeData.length === 0) {
          return (
            <div className="flex items-center justify-center h-full text-[color:var(--color-fg-muted)]">
              No data available
            </div>
          );
        }
        
        const maxValue = Math.max(...safeData.map((d) => d.value), 0);
        const barHeight = height / safeData.length;

        if (type === "bar") {
          return (
            <div className="flex items-end justify-between h-full gap-2">
              {safeData.map((point, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className="w-full bg-[color:var(--color-brand-primary)] rounded-t transition-all"
                    style={{
                      height: `${(point.value / maxValue) * 100}%`,
                      minHeight: point.value > 0 ? "4px" : "0",
                    }}
                  />
                  <span className="text-xs text-[color:var(--color-fg-muted)]">
                    {point.label}
                  </span>
                </div>
              ))}
            </div>
          );
        }

        if (type === "line" || type === "area") {
          const points = safeData.map((point, index) => ({
            x: (index / (safeData.length - 1 || 1)) * 100,
            y: 100 - (point.value / maxValue) * 100,
            value: point.value,
            label: point.label,
          }));

          return (
            <div className="relative h-full">
              {showGrid && (
                <div className="absolute inset-0 flex flex-col justify-between">
                  {[0, 25, 50, 75, 100].map((y) => (
                    <div
                      key={y}
                      className="border-t border-[color:var(--color-border-base)] opacity-30"
                    />
                  ))}
                </div>
              )}
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {type === "area" && (
                  <polygon
                    points={`0,100 ${points.map((p) => `${p.x},${p.y}`).join(" ")} 100,100`}
                    fill="currentColor"
                    className="text-[color:var(--color-brand-primary)] opacity-20"
                  />
                )}
                <polyline
                  points={points.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="none"
                  stroke="currentColor"
                  className="text-[color:var(--color-brand-primary)]"
                  strokeWidth="2"
                />
                {points.map((point, index) => (
                  <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r="2"
                    fill="currentColor"
                    className="text-[color:var(--color-brand-primary)]"
                  />
                ))}
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-[color:var(--color-fg-muted)]">
                {safeData.map((point, index) => (
                  <span key={index}>{point.label}</span>
                ))}
              </div>
            </div>
          );
        }

        // Default: simple list
        return (
          <div className="space-y-2">
            {safeData.map((point, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[color:var(--color-fg-base)]">
                      {point.label}
                    </span>
                    <span className="text-sm font-medium text-[color:var(--color-fg-base)]">
                      {point.value}
                    </span>
                  </div>
                  <div className="h-2 bg-[color:var(--color-surface-2)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[color:var(--color-brand-primary)] transition-all"
                      style={{
                        width: `${(point.value / maxValue) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      };

      const content = renderChart ? renderChart(safeData, options) : renderPlaceholder();

      if (title || description) {
        return (
          <Card ref={ref} className={className}>
            {(title || description) && (
              <CardHeader>
                {title && <CardTitle>{title}</CardTitle>}
                {description && (
                  <p className="text-sm text-[color:var(--color-fg-muted)]">
                    {description}
                  </p>
                )}
              </CardHeader>
            )}
            <CardContent>
              <div style={{ height: `${height}px` }}>{content}</div>
              {showLegend && safeData.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-4">
                  {safeData.map((point, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{
                          backgroundColor:
                            point.color ||
                            `var(--color-brand-primary)`,
                        }}
                      />
                      <span className="text-xs text-[color:var(--color-fg-muted)]">
                        {point.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      }

      return (
        <div
          ref={ref}
          className={clsx("relative", className)}
          style={{ height: `${height}px` }}
        >
          {content}
        </div>
      );
    }
  )
);

Chart.displayName = "Chart";

