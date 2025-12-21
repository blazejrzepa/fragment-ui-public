"use client";

import React, { useEffect, useState, useMemo, useImperativeHandle, forwardRef } from "react";
import { KpiStrip } from "./KpiStrip";
import { HeatmapTable } from "./HeatmapTable";
import { IssuesFeed } from "./IssuesFeed";
import { TestDetailsDrawer } from "./TestDetailsDrawer";
import { FiltersBar } from "./FiltersBar";
import type {
  KpiSummary,
  ComponentTestCell,
  IssueItem,
  TestCategory,
  Severity,
} from "@/types/quality";
import { toast, Button } from "@fragment_ui/ui";
import { Play, RefreshCw } from "lucide-react";

interface QualityDashboardProps {
  onRunAllTests?: () => void;
  runningTests?: boolean;
}

export interface QualityDashboardRef {
  runAllTests: () => Promise<void>;
  runningTests: boolean;
}

export const QualityDashboard = forwardRef<QualityDashboardRef, QualityDashboardProps>(
  function QualityDashboard({ onRunAllTests, runningTests: externalRunningTests }, ref) {
  const [kpi, setKpi] = useState<KpiSummary[]>([]);
  const [heatmap, setHeatmap] = useState<ComponentTestCell[]>([]);
  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<TestCategory | "all">("all");
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCell, setSelectedCell] = useState<{
    component: string;
    category: TestCategory;
    status: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [internalRunningTests, setInternalRunningTests] = useState(false);
  
  // Use external runningTests if provided, otherwise use internal state
  const runningTests = externalRunningTests !== undefined ? externalRunningTests : internalRunningTests;
  const [lastRunTime, setLastRunTime] = useState<Date | null>(null);
  const [testStatus, setTestStatus] = useState<Record<string, { status: string; progress?: string }>>({});
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Track dashboard view (only on initial load)
      if (!lastRunTime && typeof window !== "undefined") {
        try {
          const { track } = await import("@fragment_ui/telemetry/client");
          track("custom", "quality_view_opened", { from: "playground" });
        } catch (e) {
          // Telemetry not available, continue
        }
      }

      const [kpiRes, heatmapRes, issuesRes] = await Promise.all([
        fetch("/api/tests/summary"),
        fetch("/api/tests/components"),
        fetch(`/api/tests/issues${severityFilter !== "all" ? `?severity=${severityFilter}` : ""}`),
      ]);

      const [kpiData, heatmapData, issuesData] = await Promise.all([
        kpiRes.json(),
        heatmapRes.json(),
        issuesRes.json(),
      ]);

      setKpi(kpiData);
      setHeatmap(heatmapData);
      setIssues(issuesData);
    } catch (error) {
      console.error("Error fetching quality data:", error);
      toast.error("Failed to load quality data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Check if there's an active test run from previous session
    if (typeof window !== "undefined") {
      try {
        const storedRunId = localStorage.getItem("quality-test-run-id");
        const storedRunStatus = localStorage.getItem("quality-test-run-status");
        if (storedRunId && storedRunStatus) {
          const status = JSON.parse(storedRunStatus);
          if (status.overallStatus === "running") {
            // Resume polling for this run
            setCurrentRunId(storedRunId);
            if (externalRunningTests === undefined) {
              setInternalRunningTests(true);
            }
            console.log("[QualityDashboard] Resuming test run:", storedRunId);
          }
        }
      } catch (e) {
        console.error("[QualityDashboard] Error loading test session:", e);
      }
    }
  }, [severityFilter]);

  // Poll test status when tests are running
  useEffect(() => {
    if (!runningTests) return;

    const pollStatus = async () => {
      try {
        const response = await fetch("/api/tests/status");
        if (response.ok) {
          const status = await response.json();
          setTestStatus(status.tests || {});
          
          // Save run status to localStorage for persistence
          if (typeof window !== "undefined" && status.runId) {
            try {
              localStorage.setItem("quality-test-run-id", status.runId);
              localStorage.setItem("quality-test-run-status", JSON.stringify({
                overallStatus: status.overallStatus,
                startedAt: status.startedAt,
                completedAt: status.completedAt,
              }));
            } catch (e) {
              console.error("[QualityDashboard] Error saving test session:", e);
            }
          }
          
          // If run is completed, refresh data and stop polling
          if (status.overallStatus === "completed" || status.overallStatus === "error") {
            if (externalRunningTests === undefined) {
              setInternalRunningTests(false);
            }
            setCurrentRunId(null);
            // Clear localStorage
            if (typeof window !== "undefined") {
              localStorage.removeItem("quality-test-run-id");
              localStorage.removeItem("quality-test-run-status");
            }
            await fetchData();
            setLastRunTime(new Date());
          }
        }
      } catch (error) {
        console.error("Error polling test status:", error);
      }
    };

    const interval = setInterval(pollStatus, 1000); // Poll every second
    pollStatus(); // Initial poll

    return () => clearInterval(interval);
  }, [runningTests]);

  // Filter heatmap data by search query
  const filteredHeatmap = useMemo(() => {
    if (!searchQuery) return heatmap;
    const query = searchQuery.toLowerCase();
    return heatmap.filter((cell) =>
      cell.component.toLowerCase().includes(query)
    );
  }, [heatmap, searchQuery]);

  // Filter issues by search query
  const filteredIssues = useMemo(() => {
    let filtered = issues;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (issue) =>
          issue.component.toLowerCase().includes(query) ||
          issue.title.toLowerCase().includes(query) ||
          issue.short.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [issues, searchQuery]);

  const handleCategoryFilter = (category: TestCategory | "all") => {
    setCategoryFilter(category);
    // Track filter change
    if (typeof window !== "undefined") {
      try {
        import("@fragment_ui/telemetry/client").then(({ track }) => {
          track("custom", "quality_filter_changed", {
            category: category !== "all" ? category : undefined,
            severity: severityFilter !== "all" ? severityFilter : undefined,
            search: searchQuery || undefined,
          });
        });
      } catch (e) {
        // Telemetry not available
      }
    }
  };

  const handleSeverityFilter = (severity: Severity | "all") => {
    setSeverityFilter(severity);
    // Track filter change
    if (typeof window !== "undefined") {
      try {
        import("@fragment_ui/telemetry/client").then(({ track }) => {
          track("custom", "quality_filter_changed", {
            category: categoryFilter !== "all" ? categoryFilter : undefined,
            severity: severity !== "all" ? severity : undefined,
            search: searchQuery || undefined,
          });
        });
      } catch (e) {
        // Telemetry not available
      }
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // Track search (debounced would be better, but keeping it simple)
    if (typeof window !== "undefined" && query.length > 2) {
      try {
        import("@fragment_ui/telemetry/client").then(({ track }) => {
          track("custom", "quality_filter_changed", {
            category: categoryFilter !== "all" ? categoryFilter : undefined,
            severity: severityFilter !== "all" ? severityFilter : undefined,
            search: query,
          });
        });
      } catch (e) {
        // Telemetry not available
      }
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setSeverityFilter("all");
  };

  const handleCellClick = (component: string, category: TestCategory) => {
    const cell = heatmap.find(
      (c) => c.component === component && c.category === category
    );
    setSelectedCell({
      component,
      category,
      status: cell?.status || "missing",
    });

    // Track cell click
    if (typeof window !== "undefined") {
      try {
        import("@fragment_ui/telemetry/client").then(({ track }) => {
          track("custom", "quality_cell_opened", {
            component,
            category,
            status: cell?.status || "missing",
          });
        });
      } catch (e) {
        // Telemetry not available
      }
    }
  };

  const runTests = async (component?: string, category?: TestCategory) => {
    if (runningTests) {
      toast.info("Tests are already running...");
      return;
    }

    if (externalRunningTests === undefined) {
      setInternalRunningTests(true);
    }
    try {
      // Track test run
      if (typeof window !== "undefined") {
        try {
          const { track } = await import("@fragment_ui/telemetry/client");
          track("custom", "quality_tests_run", { component, category });
        } catch (e) {
          // Telemetry not available
        }
      }

      toast.info("Running tests... This may take several minutes. You can refresh the page and the session will continue.");

      // Start test run (don't wait for completion - it will run in background)
      const response = await fetch("/api/tests/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ component, category }),
      });

      const result = await response.json();

      if (result.success) {
        // Save runId for session persistence
        if (result.runId) {
          setCurrentRunId(result.runId);
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("quality-test-run-id", result.runId);
              localStorage.setItem("quality-test-run-status", JSON.stringify({
                overallStatus: "running",
                startedAt: new Date().toISOString(),
              }));
            } catch (e) {
              console.error("[QualityDashboard] Error saving run ID:", e);
            }
          }
        }
        
        // Don't wait for completion - polling will handle status updates
        // The tests will continue running in the background
        toast.info("Tests started. Monitoring progress...");
      } else {
        toast.error(result.error || "Failed to run tests");
        if (externalRunningTests === undefined) {
          setInternalRunningTests(false);
        }
      }
    } catch (error: any) {
      console.error("Error running tests:", error);
      toast.error(error.message || "Failed to run tests");
      if (externalRunningTests === undefined) {
        setInternalRunningTests(false);
      }
    }
    // Note: Don't set runningTests to false here - let polling handle it
  };

  const handleRerun = async (component: string, category: TestCategory) => {
    await runTests(component, category);
  };

  // Expose runAllTests function via ref
  useImperativeHandle(ref, () => ({
    runAllTests: () => runTests(),
    runningTests,
  }), [runningTests]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto mb-4"></div>
          <p style={{ color: "var(--foreground-secondary)" }}>Loading quality data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-auto w-full" style={{ backgroundColor: "var(--background-primary)" }}>
      <header className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-medium mb-2">Quality Overview</h1>
            <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
              Test results and component testing status
              {lastRunTime && (
                <span className="ml-2">
                  · Last run: {lastRunTime.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="solid"
              size="sm"
              onClick={() => {
                if (onRunAllTests) {
                  onRunAllTests();
                } else {
                  runTests();
                }
              }}
              disabled={runningTests}
              leadingIcon={runningTests ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            >
              {runningTests ? "Running..." : "Run All Tests"}
            </Button>
          </div>
        </div>
      </header>

      <FiltersBar
        searchQuery={searchQuery}
        categoryFilter={categoryFilter}
        severityFilter={severityFilter}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryFilter}
        onSeverityChange={handleSeverityFilter}
        onClear={handleClearFilters}
      />

      <KpiStrip 
        data={kpi} 
        onSelectCategory={handleCategoryFilter}
        onRunCategoryTests={(category) => runTests(undefined, category)}
        runningTests={runningTests}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <div className="xl:col-span-2 order-2 xl:order-1">
          <HeatmapTable
            data={filteredHeatmap}
            categoryFilter={categoryFilter}
            testStatus={testStatus}
            onCellClick={handleCellClick}
          />
        </div>
        <div className="xl:col-span-1 order-1 xl:order-2">
          <IssuesFeed
            data={filteredIssues}
            severityFilter={severityFilter}
            onIssueClick={(issue) => {
              setSelectedCell({
                component: issue.component,
                category: issue.category,
                status: "fail",
              });
              // Track issue click
              if (typeof window !== "undefined") {
                try {
                  import("@fragment_ui/telemetry/client").then(({ track }) => {
                    track("custom", "quality_issue_link_clicked", {
                      issueId: issue.id,
                      component: issue.component,
                      category: issue.category,
                      severity: issue.severity,
                    });
                  });
                } catch (e) {
                  // Telemetry not available
                }
              }
            }}
          />
        </div>
      </div>

      <TestDetailsDrawer
        component={selectedCell?.component || null}
        category={selectedCell?.category || null}
        status={(selectedCell?.status as any) || null}
        onClose={() => setSelectedCell(null)}
        onRerun={handleRerun}
        runningTests={runningTests}
      />
    </div>
  );
  }
);

