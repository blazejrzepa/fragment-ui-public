"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@fragment_ui/ui";

export interface BundleSizeData {
  component: string;
  size: number;
  gzipped: number;
  sizeFormatted: string;
  gzippedFormatted: string;
}

export interface BundleSizeChartProps {
  data: BundleSizeData[];
  title?: string;
  maxItems?: number;
}

export function BundleSizeChart({ data, title = "Bundle Sizes", maxItems = 20 }: BundleSizeChartProps) {
  const sortedData = React.useMemo(() => {
    return [...data].sort((a, b) => b.gzipped - a.gzipped).slice(0, maxItems);
  }, [data, maxItems]);

  const maxSize = React.useMemo(() => {
    return Math.max(...sortedData.map((d) => d.gzipped), 1);
  }, [sortedData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sortedData.map((item) => {
            const percentage = (item.gzipped / maxSize) * 100;
            return (
              <div key={item.component} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-mono font-medium">{item.component}</span>
                  <span className="text-[color:var(--color-fg-muted)]">
                    {item.gzippedFormatted}
                  </span>
                </div>
                <div className="h-2 bg-[color:var(--color-surface-2)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[color:var(--color-brand-primary)] transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

