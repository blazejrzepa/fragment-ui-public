"use client";

import React, { useState } from "react";
import { Card, CardContent, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from "@fragment_ui/ui";
import type { IssueItem, Severity } from "@/types/quality";
import { ExternalLink, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface IssuesFeedProps {
  data: IssueItem[];
  onIssueClick?: (issue: IssueItem) => void;
  severityFilter?: Severity | "all";
}

const severityColors: Record<Severity, string> = {
  critical: "bg-red-600 text-white",
  high: "bg-orange-600 text-white",
  medium: "bg-yellow-600 text-white",
  low: "bg-blue-600 text-white",
};

const categoryLabels: Record<string, string> = {
  a11y: "A11y",
  unit: "Unit",
  e2e: "E2E",
  visual: "Visual",
  performance: "Perf",
  responsive: "RWD",
  interactions: "Inter.",
  states: "States",
};

export function IssuesFeed({ data, onIssueClick, severityFilter }: IssuesFeedProps) {
  const [filter, setFilter] = useState<"all" | "critical" | "high">("all");

  const filteredIssues = data.filter((issue) => {
    // First apply internal filter
    let passes = true;
    if (filter === "critical") passes = issue.severity === "critical";
    if (filter === "high") passes = issue.severity === "critical" || issue.severity === "high";
    
    // Then apply external severity filter if provided
    if (severityFilter && severityFilter !== "all") {
      passes = passes && issue.severity === severityFilter;
    }
    
    return passes;
  });

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Issues Feed</h3>
          <Badge variant="outline">{filteredIssues.length}</Badge>
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="critical">Critical</TabsTrigger>
            <TabsTrigger value="high">High+</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-4 space-y-3 max-h-[600px] overflow-y-auto">
          {filteredIssues.length === 0 ? (
            <div className="text-center py-8" style={{ color: "var(--foreground-secondary)" }}>
              <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No issues found</p>
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <Card
                key={issue.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onIssueClick?.(issue)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          className={severityColors[issue.severity]}
                          variant="solid"
                        >
                          {issue.severity}
                        </Badge>
                        <Badge variant="outline">
                          {categoryLabels[issue.category] || issue.category}
                        </Badge>
                        <span className="text-sm font-medium">{issue.component}</span>
                      </div>
                      <h4 className="text-sm font-semibold mb-1">{issue.title}</h4>
                      <p className="text-xs mb-2" style={{ color: "var(--foreground-secondary)" }}>
                        {issue.short}
                      </p>
                      <div className="flex items-center gap-3 text-xs" style={{ color: "var(--foreground-secondary)" }}>
                        <span>
                          {formatDistanceToNow(new Date(issue.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                        {issue.links?.pr && (
                          <a
                            href={issue.links.pr}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 hover:text-foreground"
                          >
                            <ExternalLink className="w-3 h-3" />
                            PR
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

