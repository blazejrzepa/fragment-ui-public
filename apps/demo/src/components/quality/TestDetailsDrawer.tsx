"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Button,
  Badge,
  ScrollArea,
  Card,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@fragment_ui/ui";
import type { TestCategory, TestStatus, TestDetails, ComponentTestHistory } from "@/types/quality";
import { ExternalLink, RefreshCw, Ticket, History } from "lucide-react";

interface TestDetailsDrawerProps {
  component: string | null;
  category: TestCategory | null;
  status: TestStatus | null;
  onClose: () => void;
  onRerun?: (component: string, category: TestCategory) => void;
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

export function TestDetailsDrawer({
  component,
  category,
  status,
  onClose,
  onRerun,
  runningTests = false,
}: TestDetailsDrawerProps) {
  const [details, setDetails] = useState<TestDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ComponentTestHistory | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (!component || !category) {
      setDetails(null);
      setHistory(null);
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/tests/details?component=${encodeURIComponent(component)}&category=${encodeURIComponent(category)}`
        );
        if (response.ok) {
          const data = await response.json();
          setDetails(data);
        }
      } catch (error) {
        console.error("Error fetching test details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const response = await fetch(
          `/api/tests/history?component=${encodeURIComponent(component)}&category=${encodeURIComponent(category)}`
        );
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchDetails();
    fetchHistory();
  }, [component, category]);

  if (!component || !category) return null;

  const getStatusColor = (status: TestStatus) => {
    switch (status) {
      case "pass":
        return "text-green-600";
      case "warn":
        return "text-yellow-600";
      case "fail":
        return "text-red-600";
      case "missing":
        return "text-gray-400";
    }
  };

  return (
    <Dialog open={!!component} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogTitle>
          {component} · {categoryLabels[category]}
        </DialogTitle>
        <DialogDescription>
          Test details and results for {component} in {categoryLabels[category]} category
        </DialogDescription>

        <div className="mt-4">
          <div className="flex items-center gap-2 mb-4">
            <Badge
              variant={status === "pass" ? "solid" : status === "warn" ? "outline" : "subtle"}
              className={getStatusColor(status || "missing")}
            >
              {status?.toUpperCase() || "MISSING"}
            </Badge>
            <div className="flex-1" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRerun?.(component, category)}
              disabled={runningTests}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${runningTests ? "animate-spin" : ""}`} />
              {runningTests ? "Running..." : "Rerun"}
            </Button>
            <Button variant="outline" size="sm">
              <Ticket className="w-4 h-4 mr-2" />
              Create Ticket
            </Button>
          </div>

          <Tabs defaultValue="summary">
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="history">
                <History className="w-4 h-4 mr-2" />
                History
              </TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="visual">Visual</TabsTrigger>
              <TabsTrigger value="a11y">A11y</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand mx-auto mb-2"></div>
                      <p className="text-sm text-[color:var(--foreground-secondary)]">Loading details...</p>
                    </div>
                  ) : details ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-[color:var(--foreground-secondary)]">Status:</span>
                          <Badge variant="outline" className="ml-2">{details.status.toUpperCase()}</Badge>
                        </div>
                        <div>
                          <span className="text-sm text-[color:var(--foreground-secondary)]">Pass Rate:</span>
                          <span className="ml-2 text-sm font-medium">
                            {Math.round(details.summary.passRate * 100)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-[color:var(--foreground-secondary)]">Fails:</span>
                          <span className="ml-2 text-sm font-medium">{details.summary.fails}</span>
                        </div>
                        <div>
                          <span className="text-sm text-[color:var(--foreground-secondary)]">Warnings:</span>
                          <span className="ml-2 text-sm font-medium">{details.summary.warns}</span>
                        </div>
                      </div>
                      {details.issues && details.issues.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold mb-2">Issues ({details.issues.length})</h4>
                          <div className="space-y-2">
                            {details.issues.map((issue) => (
                              <div
                                key={issue.id}
                                className="p-2 border rounded"
                                style={{ borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)" }}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge
                                    variant="solid"
                                    className={
                                      issue.severity === "critical"
                                        ? "bg-red-600"
                                        : issue.severity === "high"
                                        ? "bg-orange-600"
                                        : "bg-yellow-600"
                                    }
                                  >
                                    {issue.severity}
                                  </Badge>
                                  <span className="text-sm font-medium">{issue.title}</span>
                                </div>
                                <p className="text-xs text-[color:var(--foreground-secondary)]">{issue.short}</p>
                                {issue.links && (
                                  <div className="flex gap-2 mt-2">
                                    {issue.links.story && (
                                      <a
                                        href={issue.links.story}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                        Story
                                      </a>
                                    )}
                                    {issue.links.chromatic && (
                                      <a
                                        href={issue.links.chromatic}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                        Chromatic
                                      </a>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-[color:var(--foreground-secondary)]">
                      Summary information for {component} · {categoryLabels[category]} will be displayed here.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              {loadingHistory ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand mx-auto mb-2"></div>
                  <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>Loading history...</p>
                </div>
              ) : history ? (
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold mb-2">History ({history.entries.length} runs)</h4>
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Pass Rate</TableHead>
                              <TableHead>Passed</TableHead>
                              <TableHead>Failed</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {history.entries.map((entry, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="text-xs">
                                  {new Date(entry.timestamp).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      entry.status === "pass"
                                        ? "solid"
                                        : entry.status === "warn"
                                        ? "outline"
                                        : "subtle"
                                    }
                                    className={getStatusColor(entry.status)}
                                  >
                                    {entry.status.toUpperCase()}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-xs">
                                  {Math.round(entry.passRate * 100)}%
                                </TableCell>
                                <TableCell className="text-xs text-green-600">
                                  {entry.passedTests}
                                </TableCell>
                                <TableCell className="text-xs text-red-600">
                                  {entry.failedTests}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
                      No history available yet. Run tests to start tracking history.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="logs" className="mt-4">
              <ScrollArea className="h-[400px]">
                <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--color-surface-2)" }}>
                  <pre className="text-xs font-mono whitespace-pre-wrap">
                    {details?.logs || `[${new Date().toISOString()}] Running tests for ${component}...
[${new Date().toISOString()}] Category: ${categoryLabels[category]}
[${new Date().toISOString()}] Status: ${status?.toUpperCase() || "MISSING"}
[${new Date().toISOString()}] Test execution completed.`}
                  </pre>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="visual" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-[color:var(--foreground-secondary)]">
                    Visual regression results and diffs will be displayed here.
                  </p>
                  <div className="mt-4">
                    <a
                      href={`https://www.chromatic.com/test?component=${component}&category=${category}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open in Chromatic
                    </a>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="a11y" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand mx-auto mb-2"></div>
                      <p className="text-sm text-[color:var(--foreground-secondary)]">Loading A11y results...</p>
                    </div>
                  ) : details?.a11yResults && details.a11yResults.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold">
                          Violations ({details.a11yResults.length})
                        </h4>
                        <Badge variant="outline" className="bg-red-50 text-red-700">
                          {details.a11yResults.filter((v) => v.impact === "critical" || v.impact === "high").length} Critical
                        </Badge>
                      </div>
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Rule ID</TableHead>
                              <TableHead>Impact</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Help</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {details.a11yResults.map((violation, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="font-mono text-xs">
                                  {violation.id}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="solid"
                                    className={
                                      violation.impact === "critical" || violation.impact === "high"
                                        ? "bg-red-600"
                                        : "bg-yellow-600"
                                    }
                                  >
                                    {violation.impact}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm">
                                  {violation.description}
                                </TableCell>
                                <TableCell>
                                  {violation.helpUrl ? (
                                    <a
                                      href={violation.helpUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                      Help
                                    </a>
                                  ) : (
                                    <span className="text-xs text-[color:var(--foreground-secondary)]">-</span>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      {details.a11yResults.some((v) => v.nodes && v.nodes.length > 0) && (
                        <div className="mt-4">
                          <h5 className="text-sm font-semibold mb-2">Affected Nodes</h5>
                          <div className="space-y-2">
                            {details.a11yResults.map((violation, idx) =>
                              violation.nodes?.map((node, nodeIdx) => (
                                <div
                                  key={`${idx}-${nodeIdx}`}
                                  className="p-2 border rounded text-xs"
                                  style={{ borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)" }}
                                >
                                  <div className="font-mono mb-1">{node.html}</div>
                                  <div className="text-[color:var(--foreground-secondary)]">
                                    Target: {node.target.join(", ")}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-[color:var(--foreground-secondary)] mb-2">
                        {category === "a11y"
                          ? "No accessibility violations found."
                          : "A11y results are only available for accessibility tests."}
                      </p>
                      {category !== "a11y" && (
                        <p className="text-xs text-[color:var(--foreground-secondary)]">
                          Switch to A11y category to view accessibility test results.
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

