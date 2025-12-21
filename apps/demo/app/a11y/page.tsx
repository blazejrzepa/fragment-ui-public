"use client";

/**
 * A11y Telemetry Dashboard
 * 
 * Displays accessibility statistics from Playground renders
 */

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fragment_ui/ui";
import type { A11yStats } from "./types";

export default function A11yPage() {
  const [stats, setStats] = useState<A11yStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      setLoading(true);
      const response = await fetch("/api/a11y-stats?limit=100");
      if (!response.ok) {
        throw new Error("Failed to load stats");
      }
      const data = await response.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message || "Failed to load stats");
    } finally {
      setLoading(false);
    }
  }

  // Calculate aggregate statistics
  const totalRenders = stats.length;
  const rendersWithViolations = stats.filter((s) => s.violations > 0).length;
  const totalViolations = stats.reduce((sum, s) => sum + s.violations, 0);
  const totalCritical = stats.reduce((sum, s) => sum + s.critical, 0);
  const totalSerious = stats.reduce((sum, s) => sum + s.serious, 0);

  // Most common violations
  const violationsByRule: Record<string, number> = {};
  stats.forEach((stat) => {
    Object.entries(stat.violationsByRule).forEach(([rule, count]) => {
      violationsByRule[rule] = (violationsByRule[rule] || 0) + (count as number);
    });
  });
  const topViolations = Object.entries(violationsByRule)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">A11y Telemetry</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">A11y Telemetry</h1>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">A11y Telemetry Dashboard</h1>
        <p className="text-muted-foreground">
          Accessibility statistics from Playground renders
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Renders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRenders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">With Violations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {rendersWithViolations}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalRenders > 0
                ? `${Math.round((rendersWithViolations / totalRenders) * 100)}%`
                : "0%"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Violations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalViolations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Critical/Serious</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">
              {totalCritical + totalSerious}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalCritical} critical, {totalSerious} serious
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Violations */}
      {topViolations.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Most Common Violations</CardTitle>
            <CardDescription>Top 10 accessibility issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topViolations.map(([rule, count]) => (
                <div key={rule} className="flex items-center justify-between">
                  <code className="text-sm">{rule}</code>
                  <span className="font-semibold">{count as number}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Renders</CardTitle>
          <CardDescription>Last 50 renders with a11y data</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.length === 0 ? (
            <p className="text-muted-foreground">No data yet. Generate some components in the Playground!</p>
          ) : (
            <div className="space-y-2">
              {stats.slice(0, 50).map((stat) => (
                <div
                  key={stat.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="flex-1">
                    <div className="text-sm">
                      {new Date(stat.timestamp).toLocaleString()}
                    </div>
                    {stat.viewId && (
                      <div className="text-xs text-muted-foreground">
                        View: {stat.viewId.substring(0, 8)}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        {stat.violations} violation{stat.violations !== 1 ? "s" : ""}
                      </div>
                      {(stat.critical > 0 || stat.serious > 0) && (
                        <div className="text-xs text-red-600">
                          {stat.critical + stat.serious} critical/serious
                        </div>
                      )}
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      {stat.passes} passed
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

