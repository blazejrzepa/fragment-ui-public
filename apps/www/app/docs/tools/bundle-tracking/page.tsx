"use client";

import * as React from "react";
import { DocLayout } from "../../../../src/components/doc-layout";
import { BundleSizeChart } from "../../../../src/components/bundle-tracking/bundle-size-chart";
import { BundleSizeTable } from "../../../../src/components/bundle-tracking/bundle-size-table";
import { BundleSizeHistory } from "../../../../src/components/bundle-tracking/bundle-size-history";
import { Separator, Button } from "@fragment_ui/ui";
import { Card, CardHeader, CardTitle, CardContent } from "@fragment_ui/ui";

interface BundleSizeData {
  component: string;
  size: number;
  gzipped: number;
  sizeFormatted: string;
  gzippedFormatted: string;
}

interface BundleSizeResponse {
  timestamp: string;
  version: string;
  components: BundleSizeData[];
  package: {
    package: string;
    size: number;
    gzipped: number;
    sizeFormatted: string;
    gzippedFormatted: string;
  } | null;
  summary: {
    totalComponents: number;
    totalSize: number;
    totalGzipped: number;
    averageSize: number;
    averageGzipped: number;
  };
}

interface HistoricalData {
  timestamp: string;
  version: string;
  summary: {
    totalComponents: number;
    totalSize: number;
    totalGzipped: number;
    averageSize: number;
    averageGzipped: number;
  };
}

export default function BundleTrackingPage() {
  const [currentData, setCurrentData] = React.useState<BundleSizeResponse | null>(null);
  const [history, setHistory] = React.useState<HistoricalData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load current data
        const currentResponse = await fetch("/bundle-sizes/current.json");
        if (currentResponse.ok) {
          const current = await currentResponse.json();
          setCurrentData(current);
        }

        // Load history
        const historyResponse = await fetch("/bundle-sizes/history.json");
        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          setHistory(historyData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load bundle size data");
        console.error("Error loading bundle size data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <DocLayout>
        <h1>Bundle Size Tracking</h1>
        <p>Loading bundle size data...</p>
      </DocLayout>
    );
  }

  if (error) {
    return (
      <DocLayout>
        <h1>Bundle Size Tracking</h1>
        <div className="p-4 rounded-lg bg-[color:var(--color-accent-red)]/10 border border-[color:var(--color-accent-red)]/20">
          <p className="text-sm text-[color:var(--color-accent-red)]">{error}</p>
        </div>
        <p className="mt-4">
          To generate bundle size data, run: <code>pnpm bundle:analyze</code>
        </p>
      </DocLayout>
    );
  }

  if (!currentData) {
    return (
      <DocLayout>
        <h1>Bundle Size Tracking</h1>
        <div className="p-4 rounded-lg bg-[color:var(--color-surface-2)] border border-[color:var(--color-border-base)]">
          <p className="text-sm">
            No bundle size data available. Run <code>pnpm bundle:analyze</code> to generate data.
          </p>
        </div>
      </DocLayout>
    );
  }

  return (
    <DocLayout>
      <h1>Bundle Size Tracking</h1>
      <h2 id="overview">Overview</h2>
      <p>
        Track and monitor bundle sizes for Fragment UI components. This helps identify
        size regressions and optimize component imports.
      </p>
      
      <div className="p-4 rounded-lg bg-[color:var(--color-surface-2)] border border-[color:var(--color-border-base)] mb-6">
        <p className="text-sm font-medium mb-2">⚠️ Important Note</p>
        <p className="text-sm text-[color:var(--color-fg-muted)]">
          This tool analyzes <strong>source file sizes</strong> as a proxy for bundle sizes. 
          The actual bundle sizes after compilation, tree-shaking, and minification may differ. 
          For accurate production bundle sizes, use tools like <code>webpack-bundle-analyzer</code> or <code>rollup-plugin-visualizer</code>.
        </p>
      </div>

      <div className="my-8 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Components</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{currentData.summary.totalComponents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Size (gzipped)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatBytes(currentData.summary.totalGzipped)}
              </div>
              <div className="text-sm text-[color:var(--color-fg-muted)] mt-1">
                {formatBytes(currentData.summary.totalSize)} minified
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Average Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatBytes(currentData.summary.averageGzipped)}
              </div>
              <div className="text-sm text-[color:var(--color-fg-muted)] mt-1">
                per component
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Bundle Size Chart */}
        <BundleSizeChart data={currentData.components} title="Component Bundle Sizes" />

        <Separator />

        {/* Bundle Size Table */}
        <BundleSizeTable data={currentData.components} title="Detailed Bundle Sizes" />

        {history.length > 0 && (
          <>
            <Separator />
            <BundleSizeHistory history={history} />
          </>
        )}
      </div>

      <h2 id="usage">Usage</h2>
      <p>To analyze bundle sizes, run:</p>
      <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto">
        <code>pnpm bundle:analyze</code>
      </pre>

      <h2 id="features">Features</h2>
      <ul>
        <li>✅ Individual component bundle sizes</li>
        <li>✅ Gzipped and minified sizes</li>
        <li>✅ Historical tracking</li>
        <li>✅ Visual charts and tables</li>
        <li>✅ Search and sort functionality</li>
      </ul>

      <h2 id="interpretation">Interpreting Results</h2>
      <p>
        Bundle sizes are measured for each component individually based on source file sizes. 
        The gzipped size is an estimate based on source file compression. 
        <strong>Note:</strong> These are approximations - actual production bundle sizes may vary 
        due to tree-shaking, dead code elimination, and bundler optimizations.
      </p>
      <p>
        Use the historical data to track size changes over time and identify potential regressions. 
        For production bundle analysis, consider using dedicated bundle analysis tools.
      </p>
    </DocLayout>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

