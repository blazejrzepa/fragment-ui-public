"use client";

import { DatePicker, CodeBlock, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent, Badge } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";
import { useState } from "react";

const datePickerSingleCode = `import { DatePicker } from "@fragment_ui/ui";
import { useState } from "react";

export function DatePickerSingleDemo() {
  const [date, setDate] = useState<Date | undefined>();
  
  return (
    <DatePicker
      mode="single"
      value={date}
      onChange={setDate}
      placeholder="Pick a date"
    />
  );
}`;

const datePickerRangeCode = `import { DatePicker } from "@fragment_ui/ui";
import { useState } from "react";

export function DatePickerRangeDemo() {
  const [range, setRange] = useState<{ from?: Date; to?: Date } | undefined>();
  
  return (
    <DatePicker
      mode="range"
      value={range}
      onChange={setRange}
      placeholder="Pick a date range"
    />
  );
}`;

export default function DatePickerPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [range, setRange] = useState<{ from?: Date; to?: Date } | undefined>(undefined);

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="date-picker">DatePicker</h1>
      </div>
      <p className="mb-6 intro-text">Select a single date from a calendar.</p>
      
      <ExampleSection
        id="date-picker-single"
        title="Single Date"
        code={datePickerSingleCode}
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="w-full max-w-md">
            <DatePicker
              mode="single"
              value={date}
              onChange={setDate}
              placeholder="Pick a date"
            />
            {date && (
              <p className="mt-[var(--space-2)] text-sm text-[color:var(--color-fg-muted)]">
                Selected: {date.toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </ExampleSection>

      <ExampleSection
        id="date-picker-range"
        title="Date Range"
        code={datePickerRangeCode}
        marginTop="mt-8"
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="w-full max-w-md">
            <DatePicker
              mode="range"
              value={range}
              onChange={setRange}
              placeholder="Pick a date range"
            />
          </div>
        </div>
      </ExampleSection>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add date-picker`}
      </CodeBlock>

      <h2 id="accessibility" className="mt-8">Accessibility</h2>
      <p>
        DatePicker uses Radix UI Popover and react-day-picker, both of which are
        fully accessible with keyboard navigation, ARIA attributes, and screen reader support.
      </p>

      {/* API Reference */}
      <h2 id="api" className="mt-8">API Reference</h2>
      <div className="mt-4 border border-[color:var(--color-border-base)] rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-2 px-4 font-semibold text-sm">Prop</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Type</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Default</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>mode</code></td>
              <td className="py-2 px-4"><code>"single" | "range"</code></td>
              <td className="py-2 px-4"><code>"single"</code></td>
              <td className="py-2 px-4 text-sm">Selection mode: single date or date range</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>value</code></td>
              <td className="py-2 px-4"><code>Date | {"{ from?: Date; to?: Date }"} | undefined</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Selected date or range</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>onChange</code></td>
              <td className="py-2 px-4"><code>(date: Date | undefined) =&gt; void | (range: {"{ from?: Date; to?: Date }"} | undefined) =&gt; void</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Callback when date or range changes</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>placeholder</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4"><code>"Pick a date"</code></td>
              <td className="py-2 px-4 text-sm">Placeholder text for the input</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>disabled</code></td>
              <td className="py-2 px-4"><code>boolean</code></td>
              <td className="py-2 px-4"><code>false</code></td>
              <td className="py-2 px-4 text-sm">Disable date selection</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>minDate</code></td>
              <td className="py-2 px-4"><code>Date</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Minimum selectable date</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>maxDate</code></td>
              <td className="py-2 px-4"><code>Date</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Maximum selectable date</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>className</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Additional CSS classes</td>
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
            <code>DatePicker</code> is a component for selecting dates or date ranges quickly. Use it when you need to provide users with an intuitive way to pick dates in forms, filters, or scheduling interfaces. It combines a text input with a calendar popover for easy date selection.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Date input fields in forms</li>
            <li>Date range filters</li>
            <li>Scheduling and booking interfaces</li>
            <li>Event date selection</li>
            <li>Any interface requiring date selection</li>
          </ul>

          <p><strong>UI-DSL Usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "DatePicker"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>mode</code> – Selection mode: <code>"single"</code> for single date selection or <code>"range"</code> for date range selection (default: <code>"single"</code>)</li>
            <li><code>value</code> – Selected date (for <code>mode="single"</code>) or date range object with <code>from</code> and <code>to</code> properties (for <code>mode="range"</code>)</li>
            <li><code>onChange</code> – Callback function that receives the selected date or range when the selection changes</li>
            <li><code>placeholder?</code> – Placeholder text displayed in the input field (default: <code>"Pick a date"</code>)</li>
            <li><code>disabled?</code> – Boolean to disable date selection and prevent user interaction</li>
            <li><code>minDate?</code> – Minimum date that can be selected (prevents selection of dates before this date)</li>
            <li><code>maxDate?</code> – Maximum date that can be selected (prevents selection of dates after this date)</li>
            <li><code>className?</code> – Additional CSS classes to apply to the component</li>
          </ul>

          <h3>Single Date Selection</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "DatePicker",
  "props": {
    "mode": "single",
    "value": "2025-01-15",
    "onChange": "handleDateChange",
    "placeholder": "Pick a date"
  }
}`}</CodeBlock>

          <h3>Date Range Selection</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "DatePicker",
  "props": {
    "mode": "range",
    "value": {
      "from": "2025-01-15",
      "to": "2025-01-22"
    },
    "onChange": "handleRangeChange",
    "placeholder": "Pick a date range"
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
