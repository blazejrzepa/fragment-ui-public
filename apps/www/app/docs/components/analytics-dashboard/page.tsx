"use client";

import * as React from "react";
import { AnalyticsDashboard } from "@fragment_ui/blocks";
import { Chart, DocumentContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";

export default function AnalyticsDashboardPage() {
  const [dateRange, setDateRange] = React.useState("7d");

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

  const chartData1 = [
    { label: "Jan", value: 1000 },
    { label: "Feb", value: 1500 },
    { label: "Mar", value: 1200 },
    { label: "Apr", value: 1800 },
    { label: "May", value: 2000 },
  ];

  const chartData2 = [
    { label: "Q1", value: 4000 },
    { label: "Q2", value: 5000 },
    { label: "Q3", value: 4500 },
    { label: "Q4", value: 6000 },
  ];

  const sampleCharts = [
    {
      id: "revenue-chart",
      title: "Revenue Overview",
      type: "line" as const,
      data: chartData1,
      height: 300,
    },
    {
      id: "sales-chart",
      title: "Sales by Quarter",
      type: "bar" as const,
      data: chartData2,
      height: 300,
    },
  ];

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Analytics Dashboard</h1>
      </div>
      <p className="mb-6 intro-text">
        A full dashboard page for key metrics.
      </p>
      <h2 id="overview">Overview</h2>
      <p>
        Analytics Dashboard combines KPI metrics with interactive charts in a unified layout. Features include
        metric cards with trends, multiple chart types (line, bar, area, pie), and optional date range controls.
        Fully responsive and customizable.
      </p>

      
      {/* Basic Analytics Dashboard */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-6xl">
            <AnalyticsDashboard
              title="Analytics Overview"
              description="Track your key metrics and performance"
              metrics={sampleMetrics}
              charts={sampleCharts}
            />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { AnalyticsDashboard } from "@fragment_ui/blocks";
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";

const metrics = [
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
    trend: "up",
    trendValue: "+12.5%",
  },
];

const charts = [
  {
    id: "revenue-chart",
    title: "Revenue Overview",
    type: "line",
    data: [
      { label: "Jan", value: 1000 },
      { label: "Feb", value: 1500 },
      { label: "Mar", value: 1200 },
    ],
    height: 300,
  },
];

<AnalyticsDashboard
  title="Analytics Overview"
  description="Track your key metrics and performance"
  metrics={metrics}
  charts={charts}
/>`}</CodeBlock>
        </div>
      </div>

      <h2 id="props">Props</h2>
      <ul>
        <li>
          <code>title</code> - Dashboard title (optional)
        </li>
        <li>
          <code>description</code> - Dashboard description (optional)
        </li>
        <li>
          <code>metrics</code> - Array of analytics metric objects (required)
        </li>
        <li>
          <code>charts</code> - Array of chart objects (required)
        </li>
        <li>
          <code>dateRange</code> - Date range selector configuration (optional)
        </li>
        <li>
          <code>className</code> - Additional CSS classes (optional)
        </li>
      </ul>

      <h3>AnalyticsMetric</h3>
      <ul>
        <li>
          <code>id</code> - Unique identifier (required)
        </li>
        <li>
          <code>title</code> - Metric title (required)
        </li>
        <li>
          <code>value</code> - Metric value (required)
        </li>
        <li>
          <code>description</code> - Metric description (optional)
        </li>
        <li>
          <code>trend</code> - Trend direction: "up" | "down" | "neutral" (optional)
        </li>
        <li>
          <code>trendValue</code> - Trend value (optional)
        </li>
        <li>
          <code>icon</code> - Icon element (optional)
        </li>
      </ul>

      <h3>AnalyticsChart</h3>
      <ul>
        <li>
          <code>id</code> - Unique identifier (required)
        </li>
        <li>
          <code>title</code> - Chart title (required)
        </li>
        <li>
          <code>type</code> - Chart type: "line" | "bar" | "area" | "pie" (required)
        </li>
        <li>
          <code>data</code> - Chart data structure (required)
        </li>
        <li>
          <code>height</code> - Chart height in pixels (optional, default: 300)
        </li>
      </ul>

      <h3>DateRange</h3>
      <ul>
        <li>
          <code>value</code> - Current selected value (required)
        </li>
        <li>
          <code>onChange</code> - Change handler function (required)
        </li>
        <li>
          <code>options</code> - Array of date range options (required)
        </li>
      </ul>

      
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">npx shadcn@latest add /r/analytics-dashboard.json</CodeBlock>
      <h2 id="accessibility">Accessibility</h2>
      <p>
        Analytics Dashboard uses semantic HTML and proper ARIA labels. Charts are accessible with screen reader
        support and keyboard navigation. All metrics and controls are keyboard accessible. Compliant with WCAG 2.1.
      </p>

      <h2 id="use-cases">Use Cases</h2>
      <ul>
        <li>Business analytics dashboards</li>
        <li>Web analytics applications</li>
        <li>User analytics platforms</li>
        <li>Financial reporting dashboards</li>
        <li>Data visualization tools</li>
        <li>Performance monitoring systems</li>
      </ul>

    </DocumentContent>
  );
}

