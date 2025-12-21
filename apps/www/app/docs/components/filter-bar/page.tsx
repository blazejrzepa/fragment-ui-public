"use client";

import { useState } from "react";
import { FilterBar, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent, CodeBlock } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";

const filterBarCode = `"use client";

import { FilterBar } from "@fragment_ui/ui";
import { useState } from "react";

export function FilterBarDemo() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");

  return (
    <FilterBar
      filters={[
        {
          id: "search",
          type: "search",
          placeholder: "Search...",
          value: search,
          onChange: setSearch,
        },
        {
          id: "status",
          type: "select",
          label: "Status",
          options: [
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
            { value: "pending", label: "Pending" },
          ],
          value: status,
          onChange: setStatus,
        },
        {
          id: "date",
          type: "date",
          label: "Date",
          value: date,
          onChange: setDate,
        },
      ]}
      onClear={() => {
        setSearch("");
        setStatus("");
        setDate("");
      }}
    />
  );
}`;

export default function FilterBarPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-[var(--space-4)] mb-[var(--space-1)]">
        <h1 id="filter-bar">Filter Bar</h1>
      </div>
      <p className="mb-[var(--space-6)] intro-text">Filter lists or tables by multiple criteria.</p>

      <ExampleSection
        id="filter-bar-example"
        title="Filter Bar Example"
        code={filterBarCode}
        marginTop="mt-[var(--space-4)]"
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <div className="w-full max-w-4xl">
            <FilterBar
              filters={[
                {
                  id: "search",
                  type: "search",
                  placeholder: "Search...",
                  value: search,
                  onChange: setSearch,
                },
                {
                  id: "status",
                  type: "select",
                  label: "Status",
                  options: [
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                    { value: "pending", label: "Pending" },
                  ],
                  value: status,
                  onChange: setStatus,
                },
                {
                  id: "date",
                  type: "date",
                  label: "Date",
                  value: date,
                  onChange: setDate,
                },
              ]}
              onClear={() => {
                setSearch("");
                setStatus("");
                setDate("");
              }}
            />
          </div>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add filter-bar`}
      </CodeBlock>

      {/* API Reference */}
      <h2 id="api" className="mt-[var(--space-8)]">API Reference</h2>
      <div className="mt-[var(--space-4)] border border-[color:var(--color-border-base)] rounded-[var(--radius-lg)] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Prop</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Type</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Default</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>filters</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>FilterConfig[]</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Array of filter configuration objects</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>onClear</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>() {'=>'} void</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Callback function called when clear button is clicked</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Additional CSS classes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-[var(--space-4)] border border-[color:var(--color-border-base)] rounded-[var(--radius-lg)] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Filter Property</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Type</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Required</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>id</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>✓</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Unique identifier for the filter</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>type</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>"search" | "select" | "date"</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>✓</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Type of filter input</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>value</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>✓</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Current filter value</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>onChange</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>(value: string) {'=>'} void</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>✓</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Callback when filter value changes</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>placeholder</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Placeholder text (for search type)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>label</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Filter label (for select and date types)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>options</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>{"{ value: string; label: string }[]"}</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Array of options (required for select type)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Collapsible className="mt-8">
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation" className="m-0">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <p><strong>Intent</strong></p>
          <p>
            <code>FilterBar</code> is a component for providing a ready filter header for lists/tables. Use it when you need to provide users with a consistent interface for filtering and searching data. The FilterBar supports search inputs, select dropdowns, date pickers, and a clear filters button, making it ideal for data tables, lists, and any interface requiring multiple filter options.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Data tables with filtering</li>
            <li>List views with search and filters</li>
            <li>Dashboard filter panels</li>
            <li>Any interface requiring multiple filter options</li>
          </ul>

          <p><strong>UI-DSL Usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "FilterBar"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>filters</code> – Array of filter configuration objects, each defining a filter input (required)</li>
            <li><code>onClear</code> – Callback function called when the clear filters button is clicked (required)</li>
            <li><code>className?</code> – Additional CSS classes to apply to the component (optional)</li>
          </ul>
          <p>Each filter object in the <code>filters</code> array should include:</p>
          <ul>
            <li><code>id</code> – Unique identifier for the filter (required)</li>
            <li><code>type</code> – Filter type: <code>"search"</code> for text search, <code>"select"</code> for dropdown selection, or <code>"date"</code> for date picker (required)</li>
            <li><code>value</code> – Current filter value (required)</li>
            <li><code>onChange</code> – Callback function that receives the new filter value when it changes (required)</li>
            <li><code>placeholder?</code> – Placeholder text displayed in the input (optional, typically used for search type)</li>
            <li><code>label?</code> – Label text displayed above the filter input (optional, typically used for select and date types)</li>
            <li><code>options?</code> – Array of option objects with <code>value</code> and <code>label</code> properties (required for select type)</li>
          </ul>

          <h3>Basic Filter Bar</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "FilterBar",
  "props": {
    "filters": [
      {
        "id": "search",
        "type": "search",
        "placeholder": "Search...",
        "value": "",
        "onChange": "handleSearchChange"
      },
      {
        "id": "status",
        "type": "select",
        "label": "Status",
        "options": [
          { "value": "active", "label": "Active" },
          { "value": "inactive", "label": "Inactive" }
        ],
        "value": "",
        "onChange": "handleStatusChange"
      }
    ],
    "onClear": "handleClearFilters"
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
