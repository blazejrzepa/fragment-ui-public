"use client";

import { CodeBlock, DocumentContent, MetricCard, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";
import { Users, TrendingUp } from "lucide-react";

const metricCardCode = `import { MetricCard } from "@fragment_ui/ui";
import { Users, TrendingUp } from "lucide-react";

export function MetricCardDemo() {
  return (
    <div className="flex flex-col gap-[var(--space-8)] w-full">
      <div className="flex flex-col gap-[var(--space-4)]">
        <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Default</p>
        <MetricCard title="Total Revenue" value="$45,231" description="From last month" />
      </div>

      <div className="flex flex-col gap-[var(--space-4)]">
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

      <div className="flex flex-col gap-[var(--space-4)]">
        <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>With Icon</p>
        <MetricCard
          title="Total Revenue"
          value="$15,231.89"
          description="Since Last week"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>
    </div>
  );
}`;

export default function MetricCardPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="metric-card">Metric Card</h1>
      </div>
      <p className="mb-6 intro-text">Display a key metric with trend.</p>
      
      <ExampleSection
        id="metric-card-example"
        title="Example"
        code={metricCardCode}
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="flex flex-col gap-[var(--space-8)] w-full max-w-md">
            <div className="flex flex-col gap-[var(--space-4)]">
              <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Default</p>
              <MetricCard title="Total Revenue" value="$45,231" description="From last month" />
            </div>

            <div className="flex flex-col gap-[var(--space-4)]">
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

            <div className="flex flex-col gap-[var(--space-4)]">
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
      </ExampleSection>

      <h2 id="api-reference">API Reference</h2>
      <div className="mt-4 border border-[color:var(--color-border-base)] rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-2 px-4 font-semibold text-sm">Component</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Props</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Default</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>MetricCard</code></td>
              <td className="py-2 px-4"><code>title, value, icon?, trend?, trendValue?, description?, footer?, footerPlacement?, onClick?, className?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Card component for displaying KPIs and metrics</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add metric-card`}
      </CodeBlock>

      <Collapsible className="mt-8">
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation" className="m-0">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <h3>Intent</h3>
          <p>
            <code>MetricCard</code> is a specialized card component for displaying key performance indicators (KPIs) and metrics. Use it when you need to display dashboard metrics, statistics, or KPIs with optional icons, trend indicators, descriptions, and click handlers. The component provides a consistent, visually appealing way to present numerical data with context.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Dashboard KPI displays</li>
            <li>Analytics and metrics visualization</li>
            <li>Statistics cards in reports</li>
            <li>Performance indicators</li>
            <li>Financial metrics and revenue displays</li>
            <li>User activity and engagement metrics</li>
            <li>Any scenario requiring metric visualization with trends</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "MetricCard"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>title</code> – string. Metric title (required)</li>
            <li><code>value</code> – string | number. Metric value (required)</li>
            <li><code>icon?</code> – ReactNode. Icon element (optional)</li>
            <li><code>trend?</code> – "up" | "down" | "neutral". Trend direction (optional)</li>
            <li><code>trendValue?</code> – string. Trend value display, e.g., "+20.1%" (optional)</li>
            <li><code>description?</code> – string. Additional description text (optional)</li>
            <li><code>footer?</code> – ReactNode. Footer content (optional)</li>
            <li><code>footerPlacement?</code> – "header" | "content" (default: "header"). Footer placement (optional)</li>
            <li><code>onClick?</code> – function. Click handler: <code>() {'=>'} void</code> (optional)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>

          <h3>Example</h3>
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
    </DocumentContent>
  );
}
