"use client";

/**
 * Metrics Dashboard Page
 * 
 * Displays:
 * - TTFUI (Time to First UI) metrics
 * - Acceptance Rate metrics
 * - A11y Violations metrics
 * - Recent submissions table
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@fragment_ui/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@fragment_ui/ui";

interface MetricDataPoint {
  timestamp: number;
  value: number;
  date: string;
}

interface RecentSubmission {
  id: string;
  type: string;
  status: string;
  author: string;
  createdAt: string;
  score?: number;
  a11yViolations: number;
}

interface MetricsData {
  ttfui: MetricDataPoint[];
  acceptanceRate: MetricDataPoint[];
  a11yViolations: MetricDataPoint[];
  recentSubmissions: RecentSubmission[];
}

export default function MetricsPage() {
  const [data, setData] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
  }, [days]);

  async function fetchMetrics() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/metrics?days=${days}`);
      if (!response.ok) {
        throw new Error("Failed to fetch metrics");
      }
      const metricsData = await response.json();
      setData(metricsData);
    } catch (err: any) {
      setError(err.message || "Failed to load metrics");
    } finally {
      setLoading(false);
    }
  }

  // Calculate averages
  const avgTTFUI = data?.ttfui.length
    ? Math.round(data.ttfui.reduce((sum, m) => sum + m.value, 0) / data.ttfui.length)
    : 0;
  const avgAcceptanceRate = data?.acceptanceRate.length
    ? Math.round(
        data.acceptanceRate.reduce((sum, m) => sum + m.value, 0) /
          data.acceptanceRate.length
      )
    : 0;
  const totalA11yViolations = data?.a11yViolations.length
    ? data.a11yViolations.reduce((sum, m) => sum + m.value, 0)
    : 0;

  // Simple line chart component
  function SimpleLineChart({
    data,
    title,
    unit,
  }: {
    data: MetricDataPoint[];
    title: string;
    unit: string;
  }) {
    if (!data || data.length === 0) {
      return (
        <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">
          No data available
        </div>
      );
    }

    const maxValue = Math.max(...data.map((d) => d.value), 1);
    const minValue = Math.min(...data.map((d) => d.value), 0);
    const range = maxValue - minValue || 1;

    // Sort by timestamp
    const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);

    return (
      <div className="h-32 relative">
        <svg
          className="w-full h-full"
          viewBox="0 0 300 100"
          preserveAspectRatio="none"
        >
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            points={sortedData
              .map(
                (d, i) =>
                  `${(i / (sortedData.length - 1 || 1)) * 300},${
                    100 - ((d.value - minValue) / range) * 80
                  }`
              )
              .join(" ")}
          />
        </svg>
        <div className="absolute bottom-0 left-0 right-0 text-xs text-muted-foreground flex justify-between">
          <span>
            {new Date(sortedData[0]?.timestamp).toLocaleDateString()}
          </span>
          <span>
            {new Date(
              sortedData[sortedData.length - 1]?.timestamp
            ).toLocaleDateString()}
          </span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Metrics Dashboard</h1>
        <p>Loading metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Metrics Dashboard</h1>
        <div className="text-red-500">Error: {error}</div>
        <button
          onClick={fetchMetrics}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Metrics Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setDays(7)}
            className={`px-4 py-2 rounded ${
              days === 7 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            7 days
          </button>
          <button
            onClick={() => setDays(30)}
            className={`px-4 py-2 rounded ${
              days === 30 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            30 days
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Average TTFUI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgTTFUI}ms</div>
            <p className="text-sm text-muted-foreground mt-2">
              Time to First UI
            </p>
            <SimpleLineChart
              data={data?.ttfui || []}
              title="TTFUI"
              unit="ms"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acceptance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgAcceptanceRate}%</div>
            <p className="text-sm text-muted-foreground mt-2">
              Submissions with score ≥ 80%
            </p>
            <SimpleLineChart
              data={data?.acceptanceRate || []}
              title="Acceptance Rate"
              unit="%"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>A11y Violations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalA11yViolations}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Total violations in last {days} days
            </p>
            <SimpleLineChart
              data={data?.a11yViolations || []}
              title="A11y Violations"
              unit="count"
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.recentSubmissions && data.recentSubmissions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>A11y Violations</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-mono text-xs">
                      {submission.id.substring(0, 8)}
                    </TableCell>
                    <TableCell>{submission.type}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          submission.status === "verified"
                            ? "bg-green-100 text-green-800"
                            : submission.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {submission.status}
                      </span>
                    </TableCell>
                    <TableCell>{submission.author}</TableCell>
                    <TableCell>
                      {submission.score !== undefined ? (
                        <span
                          className={
                            submission.score >= 80
                              ? "text-green-600 font-semibold"
                              : submission.score >= 60
                              ? "text-yellow-600"
                              : "text-red-600"
                          }
                        >
                          {submission.score}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {submission.a11yViolations > 0 ? (
                        <span className="text-red-600">
                          {submission.a11yViolations}
                        </span>
                      ) : (
                        <span className="text-green-600">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No recent submissions</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

