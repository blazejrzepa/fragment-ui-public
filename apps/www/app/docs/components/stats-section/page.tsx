"use client";

import { StatsSection } from "@fragment_ui/blocks";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock, DocumentContent } from "@fragment_ui/ui";

export default function StatsSectionPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="stats-section" className="text-3xl font-medium mb-4">Stats Section</h1>
      </div>
      <p className="mb-6 intro-text">
        Section that highlights key stats and numbers.
      </p>
      <h2 id="overview">Overview</h2>
      <p>
        Stats Section displays statistics in a grid or horizontal layout with optional trend indicators
        (up, down, neutral). Supports 2, 3, or 4 column layouts.
      </p>

      
      {/* Default Stats Grid */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[10rem] p-10">
          <div className="w-full max-w-6xl">
            <StatsSection
              title="Overview"
              items={[
                { label: "Total Users", value: "1,200", trend: "up", trendValue: "+12%" },
                { label: "Revenue", value: "$15,000", trend: "up", trendValue: "+8%" },
                { label: "Active Sessions", value: "450", trend: "down", trendValue: "-3%" },
                { label: "Conversion Rate", value: "3.2%", trend: "neutral", trendValue: "0%" },
              ]}
              layout="grid"
              columns={4}
            />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { StatsSection } from "@fragment_ui/blocks";

<StatsSection
  title="Overview"
  items={[
    { label: "Total Users", value: "1,200", trend: "up", trendValue: "+12%" },
    { label: "Revenue", value: "$15,000", trend: "up", trendValue: "+8%" },
    { label: "Active Sessions", value: "450", trend: "down", trendValue: "-3%" },
    { label: "Conversion Rate", value: "3.2%", trend: "neutral", trendValue: "0%" },
  ]}
  layout="grid"
  columns={4}
/>`}
          </CodeBlock>
        </div>
      </div>
      
      <div className="space-y-6 my-6">

        <div>
          <h3 id="three-columns" className="text-lg font-semibold mb-2">Three Columns</h3>
          <StatsSection
            title="Key Metrics"
            items={[
              { label: "Total Users", value: "1,200", trend: "up", trendValue: "+12%" },
              { label: "Revenue", value: "$15,000", trend: "up", trendValue: "+8%" },
              { label: "Active Sessions", value: "450", trend: "down", trendValue: "-3%" },
            ]}
            layout="grid"
            columns={3}
          />
        </div>

        <div>
          <h3 id="horizontal-layout" className="text-lg font-semibold mb-2">Horizontal Layout</h3>
          <StatsSection
            title="Dashboard Stats"
            items={[
              { label: "Total Users", value: "1,200", trend: "up", trendValue: "+12%" },
              { label: "Revenue", value: "$15,000", trend: "up", trendValue: "+8%" },
              { label: "Active Sessions", value: "450", trend: "down", trendValue: "-3%" },
              { label: "Conversion Rate", value: "3.2%", trend: "neutral", trendValue: "0%" },
            ]}
            layout="horizontal"
          />
        </div>

        <div>
          <h3 id="without-trends" className="text-lg font-semibold mb-2">Without Trends</h3>
          <StatsSection
            title="Simple Stats"
            items={[
              { label: "Total Users", value: "1,200" },
              { label: "Revenue", value: "$15,000" },
              { label: "Active Sessions", value: "450" },
              { label: "Conversion Rate", value: "3.2%" },
            ]}
            layout="grid"
            columns={4}
          />
        </div>
      </div>

      <h2 id="code-examples">Code Examples</h2>
      <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
        {`import { StatsSection } from "@fragment_ui/blocks";

function Dashboard() {
  return (
    <StatsSection
      title="Overview"
      items={[
        { label: "Total Users", value: "1,200", trend: "up", trendValue: "+12%" },
        { label: "Revenue", value: "$15,000", trend: "up", trendValue: "+8%" },
        { label: "Active Sessions", value: "450", trend: "down", trendValue: "-3%" },
        { label: "Conversion Rate", value: "3.2%", trend: "neutral", trendValue: "0%" },
      ]}
      layout="grid"
      columns={4}
    />
  );
}`}
      </CodeBlock>

      <h2 id="props">Props</h2>
      <ul>
        <li>
          <code>title</code> - Section title (optional)
        </li>
        <li>
          <code>items</code> - Array of stat items (required)
        </li>
        <li>
          <code>layout</code> - Layout type: "grid" | "horizontal" (optional, default: "grid")
        </li>
        <li>
          <code>columns</code> - Number of columns: 2 | 3 | 4 (optional, default: 4)
        </li>
        <li>
          <code>className</code> - Additional CSS classes (optional)
        </li>
      </ul>

      <h3 id="statitem">StatItem</h3>
      <ul>
        <li>
          <code>label</code> - Stat label (required)
        </li>
        <li>
          <code>value</code> - Stat value (required)
        </li>
        <li>
          <code>trend</code> - Trend direction: "up" | "down" | "neutral" (optional)
        </li>
        <li>
          <code>trendValue</code> - Trend value display (optional, e.g., "+12%")
        </li>
      </ul>

      
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">npx shadcn@latest add /r/stats-section.json</CodeBlock>
      <h2 id="accessibility">Accessibility</h2>
      <p>
        Stats section uses semantic HTML with proper structure. Trend indicators use color and symbols
        for visual indication while maintaining text-based information. Compliant with WCAG 2.1.
      </p>

      <h2 id="links">Links</h2>
      <ul>
        <li>
        </li>
      </ul>

    </DocumentContent>
  );
}

