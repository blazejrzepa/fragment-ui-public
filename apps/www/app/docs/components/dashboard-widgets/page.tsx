"use client";

import { DashboardWidgets } from "@fragment_ui/blocks";
import { MetricCard, ActivityFeed, Chart, DocumentContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";

export default function DashboardWidgetsPage() {
  const sampleActivities = [
    {
      id: "1",
      type: "action" as const,
      title: "John Doe created a new project",
      timestamp: new Date(Date.now() - 5 * 60000),
      user: { name: "John Doe" },
    },
    {
      id: "2",
      type: "update" as const,
      title: "Jane Smith updated settings",
      timestamp: new Date(Date.now() - 30 * 60000),
      user: { name: "Jane Smith" },
    },
  ];

  const chartData = [
    { label: "Jan", value: 1000 },
    { label: "Feb", value: 1500 },
    { label: "Mar", value: 1200 },
  ];

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Dashboard Widgets</h1>
      </div>
      <p className="mb-6 intro-text">
        A set of reusable dashboard panels/widgets.
      </p>
      <h2 id="overview">Overview</h2>
      <p>
        DashboardWidgets provides a flexible grid system for organizing dashboard widgets. Supports
        different column layouts (4, 6, or 12 columns) and widget spanning. Each widget can be wrapped
        in a WidgetContainer or displayed as custom content.
      </p>

      
      {/* Default Dashboard Widgets */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-6xl">
            <DashboardWidgets
              widgets={[
                {
                  id: "1",
                  type: "metric",
                  span: 1,
                  content: "Metric 1",
                },
                {
                  id: "2",
                  type: "metric",
                  span: 1,
                  content: "Metric 2",
                },
                {
                  id: "3",
                  type: "activity",
                  title: "Recent Activity",
                  span: 2,
                  content: "Activity feed",
                },
              ]}
              columns={12}
            />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { DashboardWidgets } from "@fragment_ui/blocks";
import { MetricCard, ActivityFeed } from "@fragment_ui/ui";

<DashboardWidgets
  widgets={[
    {
      id: "1",
      type: "metric",
      span: 1,
    },
    {
      id: "2",
      type: "metric",
      span: 1,
    },
    {
      id: "3",
      type: "activity",
      title: "Recent Activity",
      span: 2,
    },
  ]}
  columns={12}
/>`}</CodeBlock>
        </div>
      </div>
      
      <div className="space-y-6 my-6">

        <div>
          <h3 className="text-lg font-semibold mb-2">Mixed Widget Types</h3>
          <DashboardWidgets
            widgets={[
              {
                id: "1",
                type: "metric",
                span: 1,
                content: "KPI value",
              },
              {
                id: "2",
                type: "custom",
                title: "Chart",
                span: 2,
                content: "Chart placeholder",
              },
              {
                id: "3",
                type: "activity",
                title: "Activity",
                span: 1,
                content: "Activity details",
              },
            ]}
            columns={12}
          />
        </div>
      </div>

      <h2 id="code-examples">Code Examples</h2>
      <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { DashboardWidgets } from "@fragment_ui/blocks";
import { MetricCard, Chart, ActivityFeed } from "@fragment_ui/ui";

function Dashboard() {
  return (
    <DashboardWidgets
      widgets={[
        {
          id: "1",
          type: "metric",
          span: 1,
        },
        {
          id: "2",
          type: "custom",
          title: "Chart",
          span: 2,
        },
        {
          id: "3",
          type: "activity",
          title: "Activity",
          span: 1,
        },
      ]}
      columns={12}
  );
}`}</CodeBlock>

      <h2 id="props">Props</h2>
      <ul>
        <li>
          <code>widgets</code> - Array of widget objects (required)
        </li>
        <li>
          <code>columns</code> - Grid columns: 4 | 6 | 12 (optional, default: 12)
        </li>
        <li>
          <code>className</code> - Additional CSS classes (optional)
        </li>
      </ul>

      <h3>DashboardWidget</h3>
      <ul>
        <li>
          <code>id</code> - Unique identifier (required)
        </li>
        <li>
          <code>type</code> - Widget type: "metric" | "activity" | "quickActions" | "notifications" | "custom" (required)
        </li>
        <li>
          <code>title</code> - Widget title (optional)
        </li>
        <li>
          <code>content</code> - Widget content (required)
        </li>
        <li>
          <code>span</code> - Grid span: 1 | 2 | 3 | 4 (optional, default: 1)
        </li>
        <li>
          <code>minHeight</code> - Minimum height (optional)
        </li>
      </ul>

      
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">npx shadcn@latest add /r/dashboard-widgets.json</CodeBlock>
      <h2 id="accessibility">Accessibility</h2>
      <p>
        DashboardWidgets uses semantic HTML with proper grid structure. All widgets are keyboard accessible
        and follow accessibility best practices. Compliant with WCAG 2.1.
      </p>

      

    </DocumentContent>
  );
}

