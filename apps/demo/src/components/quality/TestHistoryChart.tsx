"use client";

import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { TestHistoryEntry, TestCategory, ComponentTestHistory } from "@/types/quality";

interface TestHistoryChartProps {
  component?: string;
  category?: TestCategory;
  history?: ComponentTestHistory;
}

export function TestHistoryChart({ component, category, history: historyProp }: TestHistoryChartProps) {
  const [history, setHistory] = useState<TestHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If history is provided as prop, use it directly
    if (historyProp?.entries) {
      setHistory(historyProp.entries);
      setLoading(false);
      return;
    }

    // Otherwise fetch from API
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/tests/history?component=${encodeURIComponent(component!)}&category=${category!}`
        );
        if (response.ok) {
          const data = await response.json();
          setHistory(data.entries || []);
        }
      } catch (error) {
        console.error("Error fetching test history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (component && category) {
      fetchHistory();
    }
  }, [component, category, historyProp]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
          Loading chart data...
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
          No history data available
        </div>
      </div>
    );
  }

  // Transform data for chart
  const chartData = history
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((entry) => {
      const date = new Date(entry.timestamp);
      return {
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        timestamp: date.getTime(),
        passRate: entry.passRate * 100, // Convert to percentage
        passed: entry.passedTests,
        failed: entry.failedTests,
        total: entry.totalTests,
        issues: entry.issues,
        status: entry.status,
      };
    });

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className="rounded-lg border p-3 shadow-md"
          style={{
            backgroundColor: "var(--background-primary)",
            borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)",
          }}
        >
          <p className="text-sm font-medium mb-2">{data.date}</p>
          <div className="space-y-1 text-xs">
            <p>
              <span style={{ color: "var(--foreground-secondary)" }}>Status: </span>
              <span
                style={{
                  color:
                    data.status === "pass"
                      ? "#22c55e"
                      : data.status === "warn"
                      ? "#eab308"
                      : "#ef4444",
                }}
              >
                {data.status.toUpperCase()}
              </span>
            </p>
            <p>
              <span style={{ color: "var(--foreground-secondary)" }}>Pass Rate: </span>
              <span style={{ color: "var(--foreground-primary)" }}>
                {data.passRate.toFixed(1)}%
              </span>
            </p>
            <p>
              <span style={{ color: "var(--foreground-secondary)" }}>Passed: </span>
              <span style={{ color: "#22c55e" }}>{data.passed}</span>
            </p>
            <p>
              <span style={{ color: "var(--foreground-secondary)" }}>Failed: </span>
              <span style={{ color: "#ef4444" }}>{data.failed}</span>
            </p>
            {data.issues > 0 && (
              <p>
                <span style={{ color: "var(--foreground-secondary)" }}>Issues: </span>
                <span style={{ color: "#ef4444" }}>{data.issues}</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPassRate" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-brand-primary)"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="var(--color-brand-primary)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="color-mix(in srgb, var(--foreground-primary) 5%, transparent)"
          />
          <XAxis
            dataKey="date"
            tick={{ fill: "var(--foreground-secondary)", fontSize: 12 }}
            axisLine={{ stroke: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)" }}
          />
          <YAxis
            tick={{ fill: "var(--foreground-secondary)", fontSize: 12 }}
            axisLine={{ stroke: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)" }}
            domain={[0, 100]}
            label={{
              value: "Pass Rate (%)",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fill: "var(--foreground-secondary)" },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="passRate"
            stroke="var(--color-brand-primary)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPassRate)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
