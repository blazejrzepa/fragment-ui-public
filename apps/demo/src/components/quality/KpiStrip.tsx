"use client";

import React from "react";
import { Card, CardContent, Progress, Badge, Tooltip, Button } from "@fragment_ui/ui";
import { Play } from "lucide-react";
import type { KpiSummary, TestCategory } from "@/types/quality";

interface KpiStripProps {
  data: KpiSummary[];
  onSelectCategory?: (category: TestCategory | "all") => void;
  onRunCategoryTests?: (category: TestCategory) => void;
  runningTests?: boolean;
}

const categoryLabels: Record<TestCategory, string> = {
  a11y: "A11y",
  unit: "Unit",
  e2e: "E2E",
  visual: "Visual",
  performance: "Perf",
  responsive: "RWD",
  interactions: "Inter.",
  states: "States",
};

const getStatusColor = (passRate: number, isGate?: boolean) => {
  if (isGate && passRate < 1.0) {
    return "text-red-600";
  }
  if (passRate >= 0.95) return "text-green-600";
  if (passRate >= 0.85) return "text-yellow-600";
  return "text-red-600";
};

const getProgressColor = (passRate: number, isGate?: boolean) => {
  if (isGate && passRate < 1.0) {
    return "bg-red-600";
  }
  if (passRate >= 0.95) return "bg-green-600";
  if (passRate >= 0.85) return "bg-yellow-600";
  return "bg-red-600";
};

export function KpiStrip({ data, onSelectCategory, onRunCategoryTests, runningTests }: KpiStripProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6 overflow-x-auto">
      {data.map((kpi) => {
        const passPercent = Math.round(kpi.passRate * 100);
        const statusColor = getStatusColor(kpi.passRate, kpi.isGate);
        const progressColor = getProgressColor(kpi.passRate, kpi.isGate);

        return (
          <Tooltip
            key={kpi.category}
            content={`${categoryLabels[kpi.category]}: ${passPercent}% pass · ${kpi.fails} fails · ${kpi.warns} warnings`}
          >
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onSelectCategory?.(kpi.category)}
              style={{
                borderColor: kpi.isGate && kpi.passRate < 1.0 ? "var(--color-status-error)" : undefined,
                borderWidth: kpi.isGate && kpi.passRate < 1.0 ? "2px" : undefined,
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{categoryLabels[kpi.category]}</span>
                  <div className="flex items-center gap-2">
                    {kpi.isGate && (
                      <Badge variant="outline" className="text-xs">
                        Gate
                      </Badge>
                    )}
                    {onRunCategoryTests && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRunCategoryTests(kpi.category);
                        }}
                        disabled={runningTests}
                        title={`Run ${categoryLabels[kpi.category]} tests`}
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className={`text-2xl font-bold mb-2 ${statusColor}`}>
                  {passPercent}%
                </div>
                <Progress 
                  value={kpi.passRate * 100} 
                  className="h-2 mb-2"
                  color={
                    kpi.isGate && kpi.passRate < 1.0
                      ? "error"
                      : kpi.passRate >= 0.95
                      ? "success"
                      : kpi.passRate >= 0.85
                      ? "warning"
                      : "error"
                  }
                />
                <div className="flex items-center justify-between text-xs" style={{ color: "var(--foreground-secondary)" }}>
                  <span>{kpi.fails + kpi.warns} issues</span>
                  <span>{kpi.total} tests</span>
                </div>
              </CardContent>
            </Card>
          </Tooltip>
        );
      })}
    </div>
  );
}

