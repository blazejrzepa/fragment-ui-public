"use client";

import { KpiStrip } from "@fragment_ui/blocks";
import { CodeBlock, DocumentContent } from "@fragment_ui/ui";

export default function KpiStripPage() {
  const sampleMetrics = [
    { id: "users", title: "Total Users", value: "12,345", trend: "up" as const, trendValue: "+12%", description: "Active users this month" },
    { id: "revenue", title: "Revenue", value: "$45,678", trend: "up" as const, trendValue: "+8%", description: "Monthly recurring revenue" },
    { id: "orders", title: "Orders", value: "1,234", trend: "up" as const, trendValue: "+5%", description: "Orders this week" },
    { id: "conversion", title: "Conversion", value: "3.2%", trend: "up" as const, trendValue: "+0.5%", description: "Conversion rate" },
  ];

  const twoColumnMetrics = sampleMetrics.slice(0, 2);
  const threeColumnMetrics = sampleMetrics.slice(0, 3);

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="kpi-strip" className="text-3xl font-medium mb-4">
          KpiStrip
        </h1>
      </div>
      <p className="mb-6 intro-text">Horizontal row of KPI cards.</p>
      
      <h2 id="overview">Overview</h2>
      <p>
        KpiStrip is a lightweight block for displaying metrics in a grid layout. It's designed to be composable
        and reusable across different contexts. Use it in dashboards, reports, or any place where you need to
        display key metrics.
      </p>
      
      {/* 4 Columns (Default) */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[10rem] p-10">
          <div className="w-full max-w-6xl border rounded-lg p-4">
            <KpiStrip metrics={sampleMetrics} columns={4} />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { KpiStrip } from "@fragment_ui/blocks";

const metrics = [
  { id: "revenue", title: "Total Revenue", value: "$45,231", trend: "up", trendValue: "+20.1%" },
  { id: "users", title: "Active Users", value: "2,350", trend: "up", trendValue: "+12.5%" },
];

<KpiStrip metrics={metrics} columns={4} />`}
          </CodeBlock>
        </div>
      </div>
      
      <div className="space-y-6 my-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">3 Columns</h3>
          <div className="border rounded-lg p-4">
            <KpiStrip metrics={threeColumnMetrics} columns={3} />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">2 Columns</h3>
          <div className="border rounded-lg p-4">
            <KpiStrip metrics={twoColumnMetrics} columns={2} />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">With Custom Gap</h3>
          <div className="border rounded-lg p-4">
            <KpiStrip metrics={sampleMetrics} columns={4} gap="lg" />
          </div>
        </div>
      </div>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">
        npx shadcn@latest add /r/kpi-strip.json
      </CodeBlock>
      <h2 id="code-examples">Code Examples</h2>
      <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
        {`import { KpiStrip } from "@fragment_ui/blocks";

// Basic usage
<KpiStrip metrics={metrics} columns={4} />

// 2 columns
<KpiStrip metrics={metrics} columns={2} />

// With custom gap
<KpiStrip metrics={metrics} columns={4} gap="lg" />

// Clickable metric
<KpiStrip
  metrics={[
    {
      id: "users",
      title: "Users",
      value: "1,234",
      trend: "up",
      trendValue: "+12%",
      onClick: () => console.log("Metric clicked"),
    },
  ]}
  columns={4}
/>`}
      </CodeBlock>
      
      <h2 id="props">Props</h2>
      <ul>
        <li>
          <code>metrics</code> - Array of KPI metrics to display (required)
        </li>
        <li>
          <code>columns</code> - Number of columns: 2 | 3 | 4 (default: 4)
        </li>
        <li>
          <code>gap</code> - Gap between cards: "sm" | "md" | "lg" (default: "md")
        </li>
        <li>
          <code>className</code> - Additional className for container (optional)
        </li>
      </ul>

      <h3 id="metric-props">Metric Object</h3>
      <ul>
        <li>
          <code>id</code> - Unique identifier (required)
        </li>
        <li>
          <code>title</code> - Metric title (required)
        </li>
        <li>
          <code>value</code> - Metric value as string or number (required)
        </li>
        <li>
          <code>description</code> - Optional description text
        </li>
        <li>
          <code>trend</code> - Trend direction: "up" | "down" | "neutral" (optional)
        </li>
        <li>
          <code>trendValue</code> - Trend value as string, e.g., "+12%" (optional)
        </li>
        <li>
          <code>icon</code> - Optional icon element (optional)
        </li>
        <li>
          <code>onClick</code> - Click handler for the metric card (optional)
        </li>
      </ul>
      
      <h2 id="features">Features</h2>
      <ul>
        <li>Responsive grid layout (1 column on mobile, multiple on desktop)</li>
        <li>Configurable column count (2, 3, or 4)</li>
        <li>Customizable gap between cards</li>
        <li>Uses MetricCard component from @fragment_ui/ui</li>
        <li>Supports trend indicators and icons</li>
        <li>Clickable metrics with onClick handler</li>
        <li>Fully accessible</li>
      </ul>
      
      <h2 id="related-blocks">Related Blocks</h2>
      <ul>
        <li>
          <a href="/docs/components/kpi-dashboard">KPIDashboard</a> - Full dashboard with title and description
        </li>
        <li>
          <a href="/docs/templates/dashboard-template">DashboardTemplate</a> - Complete dashboard template using KpiStrip
        </li>
        <li>
          <a href="/docs/components/metric-card">MetricCard</a> - Individual metric card component
        </li>
      </ul>
      
      <h2 id="accessibility">Accessibility</h2>
      <p>
        KpiStrip uses MetricCard components which are fully accessible with proper ARIA attributes. Clickable metrics
        support keyboard navigation.
      </p>
    </DocumentContent>
  );
}

