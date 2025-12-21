"use client";

import React from "react";
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Button } from "@fragment_ui/ui";
import { Search, X, Eye, TestTube, PlayCircle, Image, Gauge, Smartphone, MousePointer, Circle, Grid3x3, Filter } from "lucide-react";
import type { TestCategory, Severity } from "@/types/quality";

interface FiltersBarProps {
  searchQuery: string;
  categoryFilter: TestCategory | "all";
  severityFilter: Severity | "all";
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: TestCategory | "all") => void;
  onSeverityChange: (severity: Severity | "all") => void;
  onClear: () => void;
}

const categoryLabels: Record<TestCategory | "all", string> = {
  all: "All Categories",
  a11y: "A11y",
  unit: "Unit",
  e2e: "E2E",
  visual: "Visual",
  performance: "Perf",
  responsive: "RWD",
  interactions: "Inter.",
  states: "States",
};

const severityLabels: Record<Severity | "all", string> = {
  all: "All Severities",
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

const categoryIcons: Record<TestCategory | "all", React.ReactNode> = {
  all: <Grid3x3 className="w-4 h-4" />,
  a11y: <Eye className="w-4 h-4" />,
  unit: <TestTube className="w-4 h-4" />,
  e2e: <PlayCircle className="w-4 h-4" />,
  visual: <Image className="w-4 h-4" />,
  performance: <Gauge className="w-4 h-4" />,
  responsive: <Smartphone className="w-4 h-4" />,
  interactions: <MousePointer className="w-4 h-4" />,
  states: <Circle className="w-4 h-4" />,
};

export function FiltersBar({
  searchQuery,
  categoryFilter,
  severityFilter,
  onSearchChange,
  onCategoryChange,
  onSeverityChange,
  onClear,
}: FiltersBarProps) {
  const hasFilters = searchQuery || categoryFilter !== "all" || severityFilter !== "all";

  return (
    <div className="flex items-center gap-3 mb-4 flex-wrap">
      <div className="w-[200px] min-w-[200px] max-w-[200px] flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: "var(--foreground-secondary)" }} />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-8"
            style={{ 
              borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
              borderRadius: "4px",
              width: "200px",
              minWidth: "200px",
              maxWidth: "200px",
              height: "32px",
            }}
          />
        </div>
      </div>

      <Select value={categoryFilter} onValueChange={(v) => onCategoryChange(v as TestCategory | "all")}>
        <SelectTrigger 
          className="!w-[200px] min-w-[200px] max-w-[200px] flex-shrink-0 h-8" 
          style={{ 
            borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
            borderRadius: "4px",
            flexShrink: 0,
            width: "200px",
            minWidth: "200px",
            maxWidth: "200px",
            height: "32px",
          }}
        >
          <SelectValue placeholder="Category">
            <div className="flex items-center gap-2">
              <span style={{ color: "var(--foreground-tertiary)" }}>
                {categoryIcons[categoryFilter]}
              </span>
              <span>{categoryLabels[categoryFilter]}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent 
          className="!w-[200px] !min-w-[200px] !max-w-[200px]"
          style={{ 
            borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
            width: "200px",
            minWidth: "200px",
            maxWidth: "200px",
          }}
        >
          <SelectItem value="all">
            <div className="flex items-center gap-2">
              {categoryIcons.all}
              <span>All Categories</span>
            </div>
          </SelectItem>
          <SelectItem value="a11y">
            <div className="flex items-center gap-2">
              {categoryIcons.a11y}
              <span>A11y</span>
            </div>
          </SelectItem>
          <SelectItem value="unit">
            <div className="flex items-center gap-2">
              {categoryIcons.unit}
              <span>Unit</span>
            </div>
          </SelectItem>
          <SelectItem value="e2e">
            <div className="flex items-center gap-2">
              {categoryIcons.e2e}
              <span>E2E</span>
            </div>
          </SelectItem>
          <SelectItem value="visual">
            <div className="flex items-center gap-2">
              {categoryIcons.visual}
              <span>Visual</span>
            </div>
          </SelectItem>
          <SelectItem value="performance">
            <div className="flex items-center gap-2">
              {categoryIcons.performance}
              <span>Performance</span>
            </div>
          </SelectItem>
          <SelectItem value="responsive">
            <div className="flex items-center gap-2">
              {categoryIcons.responsive}
              <span>Responsive</span>
            </div>
          </SelectItem>
          <SelectItem value="interactions">
            <div className="flex items-center gap-2">
              {categoryIcons.interactions}
              <span>Interactions</span>
            </div>
          </SelectItem>
          <SelectItem value="states">
            <div className="flex items-center gap-2">
              {categoryIcons.states}
              <span>States</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      <Select value={severityFilter} onValueChange={(v) => onSeverityChange(v as Severity | "all")}>
        <SelectTrigger 
          className="!w-[200px] min-w-[200px] max-w-[200px] flex-shrink-0 h-8" 
          style={{ 
            borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
            borderRadius: "4px",
            flexShrink: 0,
            width: "200px",
            minWidth: "200px",
            maxWidth: "200px",
            height: "32px",
          }}
        >
          <SelectValue placeholder="Severity">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" style={{ color: "var(--foreground-tertiary)" }} />
              <span>{severityLabels[severityFilter]}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent 
          className="!w-[200px] !min-w-[200px] !max-w-[200px]"
          style={{ 
            borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
            width: "200px",
            minWidth: "200px",
            maxWidth: "200px",
          }}
        >
          <SelectItem value="all">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" style={{ color: "var(--foreground-tertiary)" }} />
              <span>All Severities</span>
            </div>
          </SelectItem>
          <SelectItem value="critical">Critical</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="w-4 h-4 mr-2" />
          Clear
        </Button>
      )}
    </div>
  );
}

