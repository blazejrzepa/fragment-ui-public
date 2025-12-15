"use client";

import { SegmentedControl, DocumentContent, CodeBlock } from "@fragment_ui/ui";
import { List, Grid, Calendar } from "lucide-react";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";

export default function SegmentedControlPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">
          Segmented Control
        </h1>
      </div>
      <p className="mb-6 intro-text">Switch between a few related views.</p>

      {/* Default Variant */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[200px] p-10">
          <SegmentedControl
            options={[
              { value: "list", label: "List" },
              { value: "grid", label: "Grid" },
              { value: "calendar", label: "Calendar" },
            ]}
            defaultValue="list"
          />
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { SegmentedControl } from "@fragment_ui/ui";

<SegmentedControl
  options={[
    { value: "list", label: "List" },
    { value: "grid", label: "Grid" },
    { value: "calendar", label: "Calendar" },
  ]}
  defaultValue="list"
/>`}
          </CodeBlock>
        </div>
      </div>

      {/* With Icons */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[200px] p-10">
          <SegmentedControl
            options={[
              { value: "list", label: "List", icon: <List size={16} /> },
              { value: "grid", label: "Grid", icon: <Grid size={16} /> },
              { value: "calendar", label: "Calendar", icon: <Calendar size={16} /> },
            ]}
            defaultValue="grid"
            variant="outline"
          />
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { SegmentedControl } from "@fragment_ui/ui";
import { List, Grid, Calendar } from "lucide-react";

<SegmentedControl
  options={[
    { value: "list", label: "List", icon: <List size={16} /> },
    { value: "grid", label: "Grid", icon: <Grid size={16} /> },
    { value: "calendar", label: "Calendar", icon: <Calendar size={16} /> },
  ]}
  defaultValue="grid"
  variant="outline"
/>`}
          </CodeBlock>
        </div>
      </div>

      <h2 id="api">API</h2>
      <div className="overflow-x-auto my-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left p-2 font-semibold">Prop</th>
              <th className="text-left p-2 font-semibold">Type</th>
              <th className="text-left p-2 font-semibold">Default</th>
              <th className="text-left p-2 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="p-2 font-mono text-sm">options</td>
              <td className="p-2 text-sm">SegmentedControlOption[]</td>
              <td className="p-2 text-sm">-</td>
              <td className="p-2 text-sm">Array of options to display</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="p-2 font-mono text-sm">value</td>
              <td className="p-2 text-sm">string | string[]</td>
              <td className="p-2 text-sm">-</td>
              <td className="p-2 text-sm">Controlled value</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="p-2 font-mono text-sm">defaultValue</td>
              <td className="p-2 text-sm">string | string[]</td>
              <td className="p-2 text-sm">-</td>
              <td className="p-2 text-sm">Uncontrolled default value</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="p-2 font-mono text-sm">onChange</td>
              <td className="p-2 text-sm">(value: string | string[]) =&gt; void</td>
              <td className="p-2 text-sm">-</td>
              <td className="p-2 text-sm">Callback when value changes</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="p-2 font-mono text-sm">multiple</td>
              <td className="p-2 text-sm">boolean</td>
              <td className="p-2 text-sm">false</td>
              <td className="p-2 text-sm">Allow multiple selection</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="p-2 font-mono text-sm">variant</td>
              <td className="p-2 text-sm">"default" | "outline" | "filled"</td>
              <td className="p-2 text-sm">"default"</td>
              <td className="p-2 text-sm">Visual variant</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="p-2 font-mono text-sm">size</td>
              <td className="p-2 text-sm">"sm" | "md" | "lg"</td>
              <td className="p-2 text-sm">"md"</td>
              <td className="p-2 text-sm">Size of the control</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="p-2 font-mono text-sm">disabled</td>
              <td className="p-2 text-sm">boolean</td>
              <td className="p-2 text-sm">false</td>
              <td className="p-2 text-sm">Disable the entire control</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="features">Features</h2>
      <ul className="list-disc list-inside space-y-1 my-4">
        <li>iOS-style segmented control interface</li>
        <li>Single or multiple selection modes</li>
        <li>Three visual variants: default, outline, filled</li>
        <li>Three sizes: sm, md, lg</li>
        <li>Icon support for better visual recognition</li>
        <li>Keyboard navigation support</li>
        <li>Fully accessible (ARIA compliant)</li>
        <li>Disabled states for options or entire control</li>
        <li>Controlled and uncontrolled modes</li>
      </ul>

      <h2 id="when-to-use">When to Use</h2>
      <ul className="list-disc list-inside space-y-1 my-4">
        <li>
          <strong>View Selection:</strong> Switching between different views (list, grid, calendar)
        </li>
        <li>
          <strong>Filters:</strong> Applying multiple filters simultaneously
        </li>
        <li>
          <strong>Sorting:</strong> Choosing sort order or criteria
        </li>
        <li>
          <strong>Options:</strong> Selecting from a small set of mutually exclusive options
        </li>
        <li>
          <strong>Settings:</strong> Toggling between different settings or modes
        </li>
      </ul>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">
        npx shadcn@latest add /r/segmented-control.json
      </CodeBlock>
    </DocumentContent>
  );
}

