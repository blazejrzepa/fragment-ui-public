"use client";

import { WidgetContainer } from "@fragment_ui/blocks";
import { MetricCard, Chart, DocumentContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";

export default function WidgetContainerPage() {
  const chartData = [
    { label: "Jan", value: 1000 },
    { label: "Feb", value: 1500 },
    { label: "Mar", value: 1200 },
  ];

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Widget Container</h1>
      </div>
      <p className="mb-6 intro-text">
        A consistent wrapper for dashboard widgets.
      </p>
      <h2 id="overview">Overview</h2>
      <p>
        WidgetContainer provides a consistent wrapper for dashboard widgets with optional title, actions,
        refresh button, collapsible functionality, and footer. Use it to wrap any dashboard content.
      </p>

      
      {/* Default Widget */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-2xl">
            <WidgetContainer title="Revenue Overview">
              <div className="space-y-4">
                <MetricCard title="MRR" value="$24k" trend="up" trendValue="+5%" />
              </div>
            </WidgetContainer>
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { WidgetContainer } from "@fragment_ui/blocks";
import { MetricCard } from "@fragment_ui/ui";

<WidgetContainer title="Revenue Overview">
  <div className="space-y-4">
    <MetricCard title="MRR" value="$24k" trend="up" trendValue="+5%" />
  </div>
</WidgetContainer>`}</CodeBlock>
        </div>
      </div>
      
      <div className="space-y-6 my-6">

        <div>
          <h3 className="text-lg font-semibold mb-2">With Actions and Refresh</h3>
          <WidgetContainer
            title="Analytics"
            actions={<button className="text-sm text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg-base)]">View All</button>}
            onRefresh={() => alert("Refreshing...")}
          >
            <div className="p-4">
              <p className="text-sm text-[color:var(--color-fg-muted)]">Analytics summary content</p>
            </div>
          </WidgetContainer>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Collapsible Widget</h3>
          <WidgetContainer
            title="Collapsible Widget"
            collapsible
            defaultCollapsed={false}
          >
            <div className="p-4">
              <p>This widget can be collapsed</p>
              <p className="mt-2 text-sm text-[color:var(--color-fg-muted)]">
                Click the collapse button to hide/show content
              </p>
            </div>
          </WidgetContainer>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">With Footer</h3>
          <WidgetContainer
            title="Widget with Footer"
            footer={
              <div className="text-sm text-[color:var(--color-fg-muted)]">
                Last updated: {new Date().toLocaleString()}
              </div>
            }
          >
            <div className="p-4">Main content area</div>
          </WidgetContainer>
        </div>
      </div>

      <h2 id="code-examples">Code Examples</h2>
      <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { WidgetContainer } from "@fragment_ui/blocks";
import { MetricCard, Chart } from "@fragment_ui/ui";

function Dashboard() {
  return (
    <WidgetContainer
      title="Revenue Overview"
      onRefresh={() => refreshData()}
      actions={<button>View All</button>}
    >
      <div className="p-4">Widget content</div>
    </WidgetContainer>
  );
}`}</CodeBlock>

      <h2 id="props">Props</h2>
      <ul>
        <li>
          <code>title</code> - Widget title (optional)
        </li>
        <li>
          <code>children</code> - Widget content (required)
        </li>
        <li>
          <code>actions</code> - Action buttons/elements (optional)
        </li>
        <li>
          <code>footer</code> - Footer content (optional)
        </li>
        <li>
          <code>collapsible</code> - Enable collapse functionality (optional)
        </li>
        <li>
          <code>defaultCollapsed</code> - Start collapsed (optional, default: false)
        </li>
        <li>
          <code>onRefresh</code> - Refresh handler (optional, shows refresh button)
        </li>
        <li>
          <code>className</code> - Additional CSS classes (optional)
        </li>
      </ul>

      
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">npx shadcn@latest add /r/widget-container.json</CodeBlock>
      <h2 id="accessibility">Accessibility</h2>
      <p>
        WidgetContainer uses semantic HTML with proper structure. Collapse and refresh buttons include
        proper ARIA labels. Compliant with WCAG 2.1.
      </p>

      <h2 id="links">Links</h2>
      <ul>
        <li>
        </li>
      </ul>

    </DocumentContent>
  );
}

