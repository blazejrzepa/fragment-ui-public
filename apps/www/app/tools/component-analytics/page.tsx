"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fragment_ui/ui";
import { DocLayout } from "../../../src/components/doc-layout";
import { TrendingUp, TrendingDown, Minus, BarChart3, Download, Filter } from "lucide-react";

interface ComponentUsageStats {
  componentName: string;
  totalInstalls: number;
  totalViews: number;
  totalUses: number;
  activeRepositories: number;
  latestVersion?: string;
  firstSeen: number;
  lastSeen: number;
  trend: "increasing" | "decreasing" | "stable";
  popularity: number;
}

interface ComponentAnalyticsData {
  period: string;
  startDate: number;
  endDate: number;
  components: ComponentUsageStats[];
  totals: {
    totalComponents: number;
    totalInstalls: number;
    totalViews: number;
    totalUses: number;
    totalRepositories: number;
  };
  mostPopular: ComponentUsageStats[];
  trendingUp: ComponentUsageStats[];
  trendingDown: ComponentUsageStats[];
}

export default function ComponentAnalyticsPage() {
  const [data, setData] = React.useState<ComponentAnalyticsData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [period, setPeriod] = React.useState("monthly");
  const [sortBy, setSortBy] = React.useState("popularity");

  React.useEffect(() => {
    fetchData();
  }, [period, sortBy]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/component-usage?period=${period}&sortBy=${sortBy}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch component analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  if (loading || !data) {
    return (
      <DocLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </DocLayout>
    );
  }

  return (
    <DocLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Component Usage Analytics</h1>
        <p className="text-[color:var(--color-fg-muted)]">
          Track component installations, usage, and adoption trends across your organization
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <label className="text-sm font-medium">Period:</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-1.5 rounded-md border border-[color:var(--color-border-base)] bg-[color:var(--color-surface-1)] text-sm"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-md border border-[color:var(--color-border-base)] bg-[color:var(--color-surface-1)] text-sm"
          >
            <option value="popularity">Popularity</option>
            <option value="installs">Installs</option>
            <option value="uses">Uses</option>
            <option value="repositories">Repositories</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[color:var(--color-fg-muted)]">
              Total Components
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totals.totalComponents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[color:var(--color-fg-muted)]">
              Total Installs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.totals.totalInstalls)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[color:var(--color-fg-muted)]">
              Total Uses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.totals.totalUses)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[color:var(--color-fg-muted)]">
              Active Repositories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totals.totalRepositories}</div>
          </CardContent>
        </Card>
      </div>

      {/* Trending Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Trending Up
            </CardTitle>
            <CardDescription>Components with increasing usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.trendingUp.map((component) => (
                <div
                  key={component.componentName}
                  className="flex items-center justify-between p-3 rounded-md bg-[color:var(--color-surface-2)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="font-medium capitalize">{component.componentName}</div>
                    {getTrendIcon(component.trend)}
                  </div>
                  <div className="text-sm text-[color:var(--color-fg-muted)]">
                    {formatNumber(component.totalUses)} uses
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              Trending Down
            </CardTitle>
            <CardDescription>Components with decreasing usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.trendingDown.length > 0 ? (
                data.trendingDown.map((component) => (
                  <div
                    key={component.componentName}
                    className="flex items-center justify-between p-3 rounded-md bg-[color:var(--color-surface-2)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="font-medium capitalize">{component.componentName}</div>
                      {getTrendIcon(component.trend)}
                    </div>
                    <div className="text-sm text-[color:var(--color-fg-muted)]">
                      {formatNumber(component.totalUses)} uses
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[color:var(--color-fg-muted)] text-center py-4">
                  No components trending down
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Component List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                All Components
              </CardTitle>
              <CardDescription>Detailed usage statistics for all components</CardDescription>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-[color:var(--color-border-base)] hover:bg-[color:var(--color-surface-2)]">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[color:var(--color-border-base)]">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Component</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">Popularity</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">Installs</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">Views</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">Uses</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">Repos</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm">Trend</th>
                </tr>
              </thead>
              <tbody>
                {data.components.map((component) => (
                  <tr
                    key={component.componentName}
                    className="border-b border-[color:var(--color-border-base)] hover:bg-[color:var(--color-surface-2)]"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium capitalize">{component.componentName}</div>
                      {component.latestVersion && (
                        <div className="text-xs text-[color:var(--color-fg-muted)]">
                          v{component.latestVersion}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-[color:var(--color-surface-2)] rounded-full h-2">
                          <div
                            className="bg-[color:var(--color-brand-primary)] h-2 rounded-full"
                            style={{ width: `${component.popularity}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{component.popularity}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-sm">
                      {formatNumber(component.totalInstalls)}
                    </td>
                    <td className="py-3 px-4 text-right text-sm">
                      {formatNumber(component.totalViews)}
                    </td>
                    <td className="py-3 px-4 text-right text-sm">
                      {formatNumber(component.totalUses)}
                    </td>
                    <td className="py-3 px-4 text-right text-sm">
                      {component.activeRepositories}
                    </td>
                    <td className="py-3 px-4 text-center">{getTrendIcon(component.trend)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DocLayout>
  );
}

