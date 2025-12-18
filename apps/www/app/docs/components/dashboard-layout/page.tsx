"use client";

import { DashboardLayout } from "@fragment_ui/blocks";
import { DashboardWidgets, WidgetContainer } from "@fragment_ui/blocks";
import { MetricCard, ActivityFeed, QuickActions, FilterBar, Chart, DocumentContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";

export default function DashboardLayoutPage() {
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

  const sampleNotifications = [
    {
      id: "1",
      type: "success" as const,
      title: "Payment successful",
      message: "Your payment has been processed.",
      timestamp: new Date(),
    },
  ];

  const chartData = [
    { label: "Jan", value: 1000 },
    { label: "Feb", value: 1500 },
    { label: "Mar", value: 1200 },
    { label: "Apr", value: 1800 },
  ];

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Dashboard Layout</h1>
      </div>
      <p className="mb-6 intro-text">
        A dashboard-ready page structure and spacing.
      </p>
      <h2 id="overview">Overview</h2>
      <p>
        DashboardLayout provides a flexible structure for building dashboards. It includes optional header and sidebar,
        and supports custom content or default tabs. Combine with dashboard widgets, metric cards, charts, and other
        components to create rich dashboard experiences.
      </p>
      
      
      {/* Basic Dashboard Layout */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-6xl border rounded-lg overflow-hidden">
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { DashboardLayout } from "@fragment_ui/blocks";

<DashboardLayout />`}</CodeBlock>
        </div>
      </div>
      
      <div className="space-y-6 my-6">

        <div>
          <h3 className="text-lg font-semibold mb-2">Dashboard with Widgets</h3>
          <div className="border rounded-lg overflow-hidden p-4">
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
                  type: "metric",
                  span: 1,
                  content: "Metric 3",
                },
                {
                  id: "4",
                  type: "metric",
                  span: 1,
                  content: "Metric 4",
                },
                {
                  id: "5",
                  type: "custom",
                  title: "Revenue Chart",
                  content: (
                    <Chart
                      data={chartData}
                      type="line"
                      height={200}
                      showLegend={false}
                    />
                  ),
                  span: 2,
                },
                {
                  id: "6",
                  type: "activity",
                  title: "Recent Activity",
                  span: 2,
                  content: "Activity items",
                },
              ]}
              columns={12}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Dashboard with Filter Bar</h3>
          <div className="border rounded-lg overflow-hidden">
            <FilterBar
              filters={[
                {
                  id: "search",
                  type: "search",
                  placeholder: "Search...",
                  value: "",
                  onChange: () => {},
                },
                {
                  id: "status",
                  type: "select",
                  label: "Status",
                  options: [
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ],
                  value: "",
                  onChange: () => {},
                },
              ]}
              onClear={() => {}}
            />
            <div className="p-4">
              <p className="text-sm text-[color:var(--color-fg-muted)]">
                Filtered content would appear here
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Complete Dashboard Example</h3>
          <div className="border rounded-lg overflow-hidden">
            <DashboardLayout
              header={
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-semibold">Dashboard</h1>
                  <QuickActions
                    actions={[
                      { id: "1", label: "New", icon: "➕", onClick: () => {} },
                      { id: "2", label: "Export", icon: "📤", onClick: () => {} },
                    ]}
                    layout="list"
                  />
                </div>
              }
              sidebar={
                <nav className="space-y-2">
                  <a href="#" className="block p-2 rounded hover:bg-[color:var(--color-surface-2)]">Overview</a>
                  <a href="#" className="block p-2 rounded hover:bg-[color:var(--color-surface-2)]">Analytics</a>
                  <a href="#" className="block p-2 rounded hover:bg-[color:var(--color-surface-2)]">Settings</a>
                </nav>
              }
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <WidgetContainer title="Revenue Chart" onRefresh={() => alert("Refreshing...")}>
                    <p className="text-sm text-[color:var(--color-fg-muted)]">Chart content goes here.</p>
                  </WidgetContainer>
                  <WidgetContainer title="Recent Activity">
                    <ul className="text-sm list-disc list-inside text-[color:var(--color-fg-muted)]">
                      <li>User Jane created a dashboard</li>
                      <li>Report exported</li>
                    </ul>
                  </WidgetContainer>
                </div>
                <WidgetContainer title="Notifications">
                  <p className="text-sm text-[color:var(--color-fg-muted)]">No new notifications.</p>
                </WidgetContainer>
              </div>
            </DashboardLayout>
          </div>
        </div>
      </div>
      
      
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">npx shadcn@latest add /r/dashboard-layout.json</CodeBlock>
      <h2 id="code-examples">Code Examples</h2>
      <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { DashboardLayout } from "@fragment_ui/blocks";
import { DashboardWidgets, WidgetContainer } from "@fragment_ui/blocks";
import { MetricCard, ActivityFeed, Chart, QuickActions } from "@fragment_ui/ui";

// Basic usage with default tabs

// With custom sidebar and header
<DashboardLayout
  header={<div>Custom Header</div>}
  sidebar={<nav>Custom Sidebar</nav>}
>
  <div>Custom Content</div>
</DashboardLayout>

// Complete dashboard with widgets
<DashboardLayout
  header={
    <div className="flex items-center justify-between">
      <h1>Dashboard</h1>
      <QuickActions
        actions={[
          { id: "1", label: "New", icon: "➕", onClick: () => {} },
        ]}
    </div>
  }
  sidebar={<nav>Sidebar</nav>}
>
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
        content: (
          <WidgetContainer title="Chart">
          </WidgetContainer>
        ),
        span: 2,
      },
    ]}
    columns={12}
</DashboardLayout>`}</CodeBlock>
      
      <h2 id="features">Features</h2>
      <ul>
        <li>Header section (optional)</li>
        <li>Sidebar navigation (optional)</li>
        <li>Main content area</li>
        <li>Default tabs interface if no children provided</li>
        <li>Responsive layout</li>
        <li>Fully accessible structure</li>
        <li>Works seamlessly with dashboard widgets and components</li>
      </ul>

      <h2 id="dashboard-components">Dashboard Components</h2>
      <p>
        Build rich dashboards by combining DashboardLayout with these components:
      </p>
      <ul>
        <li><a href="/docs/components/metric-card">MetricCard</a> - Display KPIs and metrics</li>
        <li><a href="/docs/components/activity-feed">ActivityFeed</a> - Recent activity timeline</li>
        <li><a href="/docs/components/quick-actions">QuickActions</a> - Quick action buttons</li>
        <li><a href="/docs/components/filter-bar">FilterBar</a> - Filter controls</li>
        <li><a href="/docs/components/widget-container">WidgetContainer</a> - Widget wrapper</li>
        <li><a href="/docs/components/dashboard-widgets">DashboardWidgets</a> - Widget collection</li>
      </ul>
      
      <h2 id="props">Props</h2>
      <ul>
        <li><code>sidebar</code> - Optional sidebar content</li>
        <li><code>header</code> - Optional header content</li>
        <li><code>children</code> - Main content (defaults to tabs if not provided)</li>
        <li><code>defaultTab</code> - Default tab value (default: "overview")</li>
      </ul>
      
      <h2 id="accessibility">Accessibility</h2>
      <p>
        The layout uses semantic HTML elements and is fully accessible with proper ARIA landmarks.
        All dashboard components follow accessibility best practices.
      </p>
      
      

    </DocumentContent>
  );
}

