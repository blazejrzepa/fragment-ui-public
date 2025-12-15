"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@fragment_ui/ui";

export interface HistoricalData {
  timestamp: string;
  version: string;
  summary: {
    totalComponents: number;
    totalSize: number;
    totalGzipped: number;
    averageSize: number;
    averageGzipped: number;
  };
}

export interface BundleSizeHistoryProps {
  history: HistoricalData[];
}

export function BundleSizeHistory({ history }: BundleSizeHistoryProps) {
  const sortedHistory = React.useMemo(() => {
    return [...history].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [history]);

  const maxSize = React.useMemo(() => {
    return Math.max(...sortedHistory.map((h) => h.summary.totalGzipped), 1);
  }, [sortedHistory]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bundle Size History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedHistory.slice(0, 10).map((entry, index) => {
            const percentage = (entry.summary.totalGzipped / maxSize) * 100;
            const date = new Date(entry.timestamp);
            const dateStr = date.toLocaleDateString();
            const timeStr = date.toLocaleTimeString();

            return (
              <div key={entry.timestamp} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium">v{entry.version}</span>
                    <span className="text-[color:var(--color-fg-muted)] ml-2">
                      {dateStr} {timeStr}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatBytes(entry.summary.totalGzipped)}</div>
                    <div className="text-xs text-[color:var(--color-fg-muted)]">
                      {entry.summary.totalComponents} components
                    </div>
                  </div>
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
        {sortedHistory.length === 0 && (
          <div className="text-center py-8 text-[color:var(--color-fg-muted)]">
            No historical data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

