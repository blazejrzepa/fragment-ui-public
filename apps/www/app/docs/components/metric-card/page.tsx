"use client";

import { CodeBlock, DocumentContent, MetricCard, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { Users, TrendingUp } from "lucide-react";

export default function MetricCardPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">
          Metric Card
        </h1>
      </div>
      <p className="mb-6 intro-text">A reusable metric card for dashboards.</p>
      
      {/* Preview */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="flex flex-col gap-8 w-full max-w-md">
            <div className="flex flex-col gap-4">
              <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Default</p>
              <MetricCard title="Total Revenue" value="$45,231" description="From last month" />
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>With Trend Badge</p>
              <MetricCard
                title="New Subscriptions"
                value="4,682"
                description="Since Last week"
                trend="up"
                trendValue="+15.54%"
                icon={<Users className="h-4 w-4" />}
                footerPlacement="content"
              />
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>With Icon</p>
              <MetricCard
                title="Total Revenue"
                value="$15,231.89"
                description="Since Last week"
                icon={<TrendingUp className="h-4 w-4" />}
              />
            </div>
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { MetricCard } from "@fragment_ui/ui";
import { Users, TrendingUp } from "lucide-react";

<MetricCard title="Total Revenue" value="$45,231" description="From last month" />

<MetricCard
  title="New Subscriptions"
  value="4,682"
  description="Since Last week"
  trend="up"
  trendValue="+15.54%"
  icon={<Users className="h-4 w-4" />}
  footerPlacement="content"
/>`}
          </CodeBlock>
        </div>
      </div>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">
        {`npx shadcn@latest add https://fragmentui.com/r/metric-card.json`}
      </CodeBlock>

      <Collapsible>
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <p><strong>Intent</strong></p>
          <p>
            <code>MetricCard</code> is a specialized card component for displaying key performance indicators (KPIs) and metrics.<br />
            Use it when you need to display dashboard metrics, statistics, or KPIs with optional icons, trend indicators, descriptions, and click handlers. The component provides a consistent, visually appealing way to present numerical data with context.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Dashboard KPI displays</li>
            <li>Analytics and metrics visualization</li>
            <li>Statistics cards in reports</li>
            <li>Performance indicators</li>
            <li>Financial metrics and revenue displays</li>
            <li>User activity and engagement metrics</li>
            <li>Any scenario requiring metric visualization with trends</li>
          </ul>

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "MetricCard"</code>.
          </p>
          <p>Props for <code>MetricCard</code>:</p>
          <ul>
            <li><code>title</code> – Metric title: <code>string</code> (required)</li>
            <li><code>value</code> – Metric value: <code>string | number</code> (required)</li>
            <li><code>icon?</code> – Icon element or string: <code>React.ReactNode</code> (optional)</li>
            <li><code>trend?</code> – Trend direction: "up" | "down" | "neutral" (optional)</li>
            <li><code>trendValue?</code> – Trend value display: <code>string</code> (optional, e.g., "+20.1%")</li>
            <li><code>description?</code> – Additional description text: <code>string</code> (optional)</li>
            <li><code>footer?</code> – Footer content: <code>React.ReactNode</code> (optional)</li>
            <li><code>footerPlacement?</code> – Footer placement: "header" | "content" (optional, default: "header")</li>
            <li><code>onClick?</code> – Click handler: <code>() =&gt; void</code> (optional)</li>
            <li><code>className?</code> – Additional CSS classes (optional)</li>
          </ul>
          <p><strong>Note:</strong> When <code>trend</code> and <code>trendValue</code> are provided without <code>footer</code>, the trend is automatically rendered as a badge in the footer (when <code>footerPlacement="content"</code>). When <code>onClick</code> is provided, the card becomes clickable with hover effects.</p>

          <p><strong>Example</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "MetricCard",
  "props": {
    "title": "New Subscriptions",
    "value": "4,682",
    "description": "Since Last week",
    "trend": "up",
    "trendValue": "+15.54%",
    "footerPlacement": "content"
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>

      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/core-metric-card--docs">Storybook</StorybookLink>
        </li>
      </ul>
    </DocumentContent>
  );
}
