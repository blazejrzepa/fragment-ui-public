"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@fragment_ui/ui";
import { TestHistoryChart } from "./TestHistoryChart";
import type { ComponentTestCell, TestCategory } from "@/types/quality";

interface TestChartsSectionProps {
  heatmap: ComponentTestCell[];
  categoryFilter?: TestCategory | "all";
}

export function TestChartsSection({ heatmap, categoryFilter }: TestChartsSectionProps) {
  // Group data by component and category
  const chartsData = React.useMemo(() => {
    const grouped = new Map<string, Map<TestCategory, ComponentTestCell>>();
    
    heatmap.forEach((cell) => {
      if (categoryFilter !== "all" && cell.category !== categoryFilter) {
        return;
      }
      if (!grouped.has(cell.component)) {
        grouped.set(cell.component, new Map());
      }
      grouped.get(cell.component)!.set(cell.category, cell);
    });
    
    return Array.from(grouped.entries()).map(([component, categories]) => ({
      component,
      categories: Array.from(categories.entries()).map(([category, cell]) => ({
        category,
        cell,
      })),
    }));
  }, [heatmap, categoryFilter]);

  if (chartsData.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-medium mb-4">Test History Trends</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chartsData.map(({ component, categories }) =>
          categories.map(({ category, cell }) => (
            <Card key={`${component}-${category}`}>
              <CardHeader>
                <CardTitle className="text-base">
                  {component} · {category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TestHistoryChart component={component} category={category} />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

