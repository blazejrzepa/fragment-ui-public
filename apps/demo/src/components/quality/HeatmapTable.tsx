"use client";

import React, { useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Tooltip,
} from "@fragment_ui/ui";
import type { ComponentTestCell, TestCategory } from "@/types/quality";
import { CheckCircle2, AlertTriangle, XCircle, Minus, Loader2, Component, Eye, TestTube, PlayCircle, Image, Gauge, Smartphone, MousePointer, Circle } from "lucide-react";

interface HeatmapTableProps {
  data: ComponentTestCell[];
  categoryFilter?: TestCategory | "all";
  testStatus?: Record<string, { status: string; progress?: string }>;
  onCellClick?: (component: string, category: TestCategory) => void;
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

const categoryIcons: Record<TestCategory, React.ReactNode> = {
  a11y: <Eye className="w-4 h-4" />,
  unit: <TestTube className="w-4 h-4" />,
  e2e: <PlayCircle className="w-4 h-4" />,
  visual: <Image className="w-4 h-4" />,
  performance: <Gauge className="w-4 h-4" />,
  responsive: <Smartphone className="w-4 h-4" />,
  interactions: <MousePointer className="w-4 h-4" />,
  states: <Circle className="w-4 h-4" />,
};

const categories: TestCategory[] = [
  "a11y",
  "unit",
  "e2e",
  "visual",
  "performance",
  "responsive",
  "interactions",
  "states",
];

const getStatusIcon = (status: ComponentTestCell["status"]) => {
  switch (status) {
    case "pass":
      return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    case "warn":
      return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    case "fail":
      return <XCircle className="w-4 h-4 text-red-600" />;
    case "missing":
      return <Minus className="w-4 h-4 text-gray-400" />;
  }
};

export function HeatmapTable({
  data,
  categoryFilter = "all",
  testStatus = {},
  onCellClick,
}: HeatmapTableProps) {
  // Group data by component
  const groupedData = useMemo(() => {
    const grouped = new Map<string, Map<TestCategory, ComponentTestCell>>();
    
    data.forEach((cell) => {
      if (!grouped.has(cell.component)) {
        grouped.set(cell.component, new Map());
      }
      grouped.get(cell.component)!.set(cell.category, cell);
    });
    
    return grouped;
  }, [data]);

  // Get unique components
  const components = useMemo(() => {
    return Array.from(groupedData.keys()).sort();
  }, [groupedData]);

  // Filter components if category filter is set
  const filteredComponents = useMemo(() => {
    if (categoryFilter === "all") return components;
    return components.filter((comp) => {
      const cell = groupedData.get(comp)?.get(categoryFilter);
      return cell && cell.status !== "missing";
    });
  }, [components, groupedData, categoryFilter]);

  const getCell = (component: string, category: TestCategory) => {
    return groupedData.get(component)?.get(category);
  };

  return (
    <div className="border rounded-lg overflow-hidden" style={{ borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)" }}>
      <style jsx global>{`
        .heatmap-row:hover td {
          background-color: var(--color-surface-1) !important;
        }
        .heatmap-row:hover td.sticky-cell {
          background-color: var(--color-surface-1) !important;
        }
        .heatmap-row:hover td[data-cell] {
          background-color: var(--color-surface-1) !important;
        }
      `}</style>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-[color:var(--background-primary)] z-10">
            <TableRow style={{ borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)" }}>
              <TableHead 
                className="min-w-[120px] sticky left-0 bg-[color:var(--background-primary)] z-20"
                scope="row"
              >
                Component
              </TableHead>
              {categories.map((category) => (
                <TableHead
                  key={category}
                  className="text-center min-w-[80px]"
                  scope="col"
                  aria-describedby="heatmap-legend"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span style={{ color: "var(--foreground-tertiary)" }}>
                      {categoryIcons[category]}
                    </span>
                    <span>{categoryLabels[category]}</span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredComponents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={categories.length + 1} className="text-center py-8" style={{ color: "var(--foreground-secondary)" }}>
                  No components found matching the current filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredComponents.map((component) => (
                <TableRow 
                  key={component}
                  className="heatmap-row"
                  style={{ borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)" }}
                >
                  <TableCell
                    className="font-normal sticky left-0 sticky-cell z-10 transition-colors"
                    scope="row"
                    style={{ 
                      color: "var(--foreground-primary)",
                      backgroundColor: "var(--background-primary)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Component className="w-4 h-4 flex-shrink-0" style={{ color: "var(--foreground-tertiary)" }} />
                      <span>{component}</span>
                    </div>
                  </TableCell>
                  {categories.map((category) => {
                    const cell = getCell(component, category);
                    const status = cell?.status || "missing";
                    const issues = cell?.issues || 0;
                    const topIssues = cell?.topIssues || [];
                    
                    // Check if this test is currently running
                    const statusKey = `${component}:${category}`;
                    const testRunStatus = testStatus[statusKey];
                    const isRunning = testRunStatus?.status === "running";
                    const isCompleted = testRunStatus?.status === "completed";
                    const isError = testRunStatus?.status === "error";
                    const progress = testRunStatus?.progress;

                    return (
                      <TableCell
                        key={category}
                        className="text-center cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                        data-cell="true"
                        style={{ backgroundColor: "transparent" }}
                        onClick={() => onCellClick?.(component, category)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onCellClick?.(component, category);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`${component} ${categoryLabels[category]} test: ${isRunning ? "running" : status}`}
                        data-ui-id={`heatmap:${component}:${category}`}
                      >
                        <Tooltip
                          content={
                            isRunning
                              ? `${component} · ${categoryLabels[category]}: Running... ${progress || ""}`
                              : isError
                              ? `${component} · ${categoryLabels[category]}: Error - ${progress || ""}`
                              : topIssues.length > 0
                              ? `${component} · ${categoryLabels[category]}: ${status.toUpperCase()} — ${topIssues.slice(0, 3).join(", ")}`
                              : `${component} · ${categoryLabels[category]}: ${status.toUpperCase()}`
                          }
                        >
                          <div className="flex items-center justify-center gap-1">
                            {isRunning ? (
                              <Loader2 className="w-4 h-4 animate-spin text-brand" />
                            ) : isError ? (
                              <XCircle className="w-4 h-4 text-red-600" />
                            ) : (
                              getStatusIcon(status)
                            )}
                            {!isRunning && issues > 0 && (
                              <span className="text-xs" style={{ color: "var(--foreground-secondary)" }}>
                                {issues}
                              </span>
                            )}
                            {isRunning && progress && (
                              <span className="text-xs" style={{ color: "var(--foreground-secondary)" }}>
                                ...
                              </span>
                            )}
                          </div>
                        </Tooltip>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div id="heatmap-legend" className="sr-only">
        Status legend: CheckCircle2 (green) = pass, AlertTriangle (yellow) = warn, XCircle (red) = fail, Minus (gray) = missing
      </div>
    </div>
  );
}

