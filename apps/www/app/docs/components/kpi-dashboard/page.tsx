"use client";

import { KPIDashboard } from "@fragment_ui/blocks";
import { CodeBlock, DocumentContent } from "@fragment_ui/ui";

export default function KPIDashboardPage() {
  const sampleMetrics = [
    {
      id: "revenue",
      title: "Total Revenue",
      value: "$45,231",
      description: "From last month",
      trend: "up" as const,
      trendValue: "+20.1%",
    },
    {
      id: "users",
      title: "Active Users",
      value: "2,350",
      description: "Total active users",
      trend: "up" as const,
      trendValue: "+12.5%",
    },
    {
      id: "sales",
      title: "Sales",
      value: "$12,234",
      description: "This month",
      trend: "down" as const,
      trendValue: "-19%",
    },
    {
      id: "growth",
      title: "Growth",
      value: "+15%",
      description: "Quarter over quarter",
      trend: "up" as const,
      trendValue: "+5%",
    },
  ];

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">
          KPI Dashboard
        </h1>
      </div>
      <p className="mb-6 intro-text">Dashboard template focused on KPIs and trends.</p>
      <h2 id="overview">Overview</h2>
      <p>
        KPI Dashboard displays a collection of key performance indicators in a responsive grid layout. Each
        metric can include a value, description, trend indicator, and optional icon. Supports 2, 3, or 4
        column layouts that adapt to screen size.
      </p>
      
      {/* Default Layout */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-6xl">
            <KPIDashboard
              title="Key Metrics"
              description="Overview of your business performance"
              metrics={sampleMetrics}
              columns={4}
            />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { KPIDashboard } from "@fragment_ui/blocks";

const metrics = [
  { id: "revenue", title: "Total Revenue", value: "$45,231", trend: "up", trendValue: "+20.1%" },
  { id: "users", title: "Active Users", value: "2,350", trend: "up", trendValue: "+12.5%" },
];

<KPIDashboard
  title="Key Metrics"
  description="Overview of your business performance"
  metrics={metrics}
  columns={4}
/>`}
          </CodeBlock>
        </div>
      </div>
      
      <div className="space-y-6 my-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Three Columns</h3>
          <KPIDashboard title="Performance Metrics" metrics={sampleMetrics.slice(0, 3)} columns={3} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Two Columns</h3>
          <KPIDashboard metrics={sampleMetrics.slice(0, 2)} columns={2} />
        </div>
      </div>

      <h2 id="code-examples">Code Examples</h2>
      <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
        {`import { KPIDashboard } from "@fragment_ui/blocks";

function Dashboard() {
  return (
    <KPIDashboard
      title="Key Metrics"
      description="Overview of your business performance"
      metrics={[
        {
          id: "revenue",
          title: "Total Revenue",
          value: "$45,231",
          description: "From last month",
          trend: "up",
          trendValue: "+20.1%",
        },
        {
          id: "users",
          title: "Active Users",
          value: "2,350",
          description: "Total active users",
          trend: "up",
          trendValue: "+12.5%",
        },
      ]}
      columns={4}
    />
  );
}`}
      </CodeBlock>

      <h2 id="props">Props</h2>
      <ul>
        <li>
          <code>title</code> - Dashboard title (optional)
        </li>
        <li>
          <code>description</code> - Dashboard description (optional)
        </li>
        <li>
          <code>metrics</code> - Array of KPI metric objects (required)
        </li>
        <li>
          <code>columns</code> - Number of columns: 2 | 3 | 4 (optional, default: 4)
        </li>
        <li>
          <code>className</code> - Additional CSS classes (optional)
        </li>
      </ul>

      <h3>KPIMetric</h3>
      <ul>
        <li>
          <code>id</code> - Unique identifier for the metric (required)
        </li>
        <li>
          <code>title</code> - Metric title (required)
        </li>
        <li>
          <code>value</code> - Metric value, can be string or number (required)
        </li>
        <li>
          <code>description</code> - Metric description (optional)
        </li>
        <li>
          <code>trend</code> - Trend direction: "up" | "down" | "neutral" (optional)
        </li>
        <li>
          <code>trendValue</code> - Trend value to display (optional)
        </li>
        <li>
          <code>icon</code> - Icon element (optional)
        </li>
        <li>
          <code>onClick</code> - Click handler for the metric (optional)
        </li>
      </ul>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">
        npx shadcn@latest add /r/kpi-dashboard.json
      </CodeBlock>
      <h2 id="accessibility">Accessibility</h2>
      <p>
        KPI Dashboard uses semantic HTML with proper heading hierarchy. All metrics are keyboard accessible and
        screen reader friendly. Trend indicators use appropriate color coding for accessibility. Compliant with
        WCAG 2.1.
      </p>

      <h2 id="use-cases">Use Cases</h2>
      <ul>
        <li>Executive dashboards with key business metrics</li>
        <li>Analytics overview pages</li>
        <li>Performance monitoring dashboards</li>
        <li>Business intelligence applications</li>
        <li>Financial dashboards</li>
      </ul>
    </DocumentContent>
  );
}

