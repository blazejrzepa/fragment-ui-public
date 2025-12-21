"use client";

import { useState } from "react";
import { SegmentedControl, DocumentContent, CodeBlock, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";
import { List, Grid, Calendar } from "lucide-react";

const segmentedControlCode = `import { SegmentedControl } from "@fragment_ui/ui";

export function SegmentedControlDemo() {
  return (
    <SegmentedControl
      options={[
        { value: "list", label: "List" },
        { value: "grid", label: "Grid" },
        { value: "calendar", label: "Calendar" },
      ]}
      defaultValue="list"
    />
  );
}`;

const segmentedControlIconsCode = `import { SegmentedControl } from "@fragment_ui/ui";
import { List, Grid, Calendar } from "lucide-react";

export function SegmentedControlIconsDemo() {
  return (
    <SegmentedControl
      options={[
        { value: "list", label: "List", icon: <List className="h-4 w-4" /> },
        { value: "grid", label: "Grid", icon: <Grid className="h-4 w-4" /> },
        { value: "calendar", label: "Calendar", icon: <Calendar className="h-4 w-4" /> },
      ]}
      defaultValue="list"
    />
  );
}`;

const segmentedControlOutlineCode = `import { SegmentedControl } from "@fragment_ui/ui";

export function SegmentedControlOutlineDemo() {
  return (
    <SegmentedControl
      variant="outline"
      options={[
        { value: "list", label: "List" },
        { value: "grid", label: "Grid" },
        { value: "calendar", label: "Calendar" },
      ]}
      defaultValue="list"
    />
  );
}`;

export default function SegmentedControlPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="segmented-control">Segmented Control</h1>
      </div>
      <p className="mb-6 intro-text">Switch between a few related views.</p>

      <ExampleSection
        id="segmented-control-example"
        title="Example"
        code={segmentedControlCode}
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <SegmentedControl
            options={[
              { value: "list", label: "List" },
              { value: "grid", label: "Grid" },
              { value: "calendar", label: "Calendar" },
            ]}
            defaultValue="list"
          />
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add segmented-control`}
      </CodeBlock>

      <ExampleSection
        id="segmented-control-icons"
        title="With Icons"
        code={segmentedControlIconsCode}
        marginTop="mt-[var(--space-8)]"
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <SegmentedControl
            options={[
              { value: "list", label: "List", icon: <List className="h-4 w-4" /> },
              { value: "grid", label: "Grid", icon: <Grid className="h-4 w-4" /> },
              { value: "calendar", label: "Calendar", icon: <Calendar className="h-4 w-4" /> },
            ]}
            defaultValue="list"
          />
        </div>
      </ExampleSection>

      <ExampleSection
        id="segmented-control-outline"
        title="Outline Variant"
        code={segmentedControlOutlineCode}
        marginTop="mt-[var(--space-8)]"
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <SegmentedControl
            variant="outline"
            options={[
              { value: "list", label: "List" },
              { value: "grid", label: "Grid" },
              { value: "calendar", label: "Calendar" },
            ]}
            defaultValue="list"
          />
        </div>
      </ExampleSection>

      <ExampleSection
        id="segmented-control-sizes"
        title="Sizes"
        code={`import { SegmentedControl } from "@fragment_ui/ui";
import { List, Grid, Calendar } from "lucide-react";

export function SegmentedControlSizesDemo() {
  return (
    <>
      <SegmentedControl
        size="sm"
        options={[
          { value: "list", label: "List", icon: <List className="h-4 w-4" /> },
          { value: "grid", label: "Grid", icon: <Grid className="h-4 w-4" /> },
          { value: "calendar", label: "Calendar", icon: <Calendar className="h-4 w-4" /> },
        ]}
        defaultValue="list"
      />
      <SegmentedControl
        size="md"
        options={[
          { value: "list", label: "List", icon: <List className="h-4 w-4" /> },
          { value: "grid", label: "Grid", icon: <Grid className="h-4 w-4" /> },
          { value: "calendar", label: "Calendar", icon: <Calendar className="h-4 w-4" /> },
        ]}
        defaultValue="list"
      />
    </>
  );
}`}
        marginTop="mt-[var(--space-8)]"
      >
        <div className="flex flex-col gap-4 items-center justify-center w-full">
          <SegmentedControl
            size="sm"
            options={[
              { value: "list", label: "List", icon: <List className="h-4 w-4" /> },
              { value: "grid", label: "Grid", icon: <Grid className="h-4 w-4" /> },
              { value: "calendar", label: "Calendar", icon: <Calendar className="h-4 w-4" /> },
            ]}
            defaultValue="list"
          />
          <SegmentedControl
            size="md"
            options={[
              { value: "list", label: "List", icon: <List className="h-4 w-4" /> },
              { value: "grid", label: "Grid", icon: <Grid className="h-4 w-4" /> },
              { value: "calendar", label: "Calendar", icon: <Calendar className="h-4 w-4" /> },
            ]}
            defaultValue="list"
          />
        </div>
      </ExampleSection>

      <h2 id="api-reference">API Reference</h2>
      <div className="mt-[var(--space-4)] border border-[color:var(--color-border-base)] rounded-[var(--radius-lg)] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)] font-semibold">Prop</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)] font-semibold">Type</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)] font-semibold">Default</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)] font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>options?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>SegmentedControlOption[]</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">[]</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Array of option objects (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>value?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string | string[]</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Selected value(s) for controlled component (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>defaultValue?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string | string[]</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Initial value(s) for uncontrolled component (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>onChange?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>(value: string | string[]) {'=>'} void</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Callback when value changes (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>multiple?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">false</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Allow multiple selection (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>variant?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>"default" | "outline" | "filled"</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">"default"</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Visual variant (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>size?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>"sm" | "md" | "lg"</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">"md"</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Size variant (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>disabled?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">false</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Disable the control (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Additional CSS classes (optional)</td>
            </tr>
          </tbody>
        </table>
        <div className="p-4 border-t border-[color:var(--color-border-base)]">
          <p className="text-sm font-semibold mb-2">SegmentedControlOption interface:</p>
          <ul className="text-sm space-y-1">
            <li><code>value</code> – string. Option value (required)</li>
            <li><code>label</code> – string. Option label (required)</li>
            <li><code>icon?</code> – ReactNode. Icon element (optional)</li>
            <li><code>disabled?</code> – boolean. Disable this option (optional)</li>
          </ul>
        </div>
      </div>

      <Collapsible className="mt-[var(--space-8)]">
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation" className="m-0">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-[var(--space-4)]">
          <h3>Intent</h3>
          <p>
            <code>SegmentedControl</code> is a component for switching between a few related views. Use it when you need to provide users with a way to toggle between different views, modes, or options. The component displays multiple options as segments, with one active segment at a time (or multiple in multiple mode).
          </p>

          <h3>When to use</h3>
          <ul>
            <li>View mode toggles (list, grid, calendar)</li>
            <li>Filter or sort options</li>
            <li>Display format selection</li>
            <li>Settings or preference toggles</li>
            <li>Any scenario requiring segmented selection</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "SegmentedControl"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>options?</code> – array. Array of option objects (optional, default: []). Each option should include:
              <ul>
                <li><code>value</code> – string. Option value (required)</li>
                <li><code>label</code> – string. Option label (required)</li>
                <li><code>icon?</code> – ReactNode. Icon element (optional)</li>
                <li><code>disabled?</code> – boolean. Disable this option (optional)</li>
              </ul>
            </li>
            <li><code>value?</code> – string | string[]. Selected value(s) for controlled component (optional)</li>
            <li><code>defaultValue?</code> – string | string[]. Initial value(s) for uncontrolled component (optional)</li>
            <li><code>onChange?</code> – function. Callback when value changes: <code>(value: string | string[]) {'=>'} void</code> (optional)</li>
            <li><code>multiple?</code> – boolean. Allow multiple selection (optional, default: false)</li>
            <li><code>variant?</code> – string. Visual variant: "default" | "outline" | "filled" (optional, default: "default")</li>
            <li><code>size?</code> – string. Size variant: "sm" | "md" | "lg" (optional, default: "md")</li>
            <li><code>disabled?</code> – boolean. Disable the control (optional, default: false)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "SegmentedControl",
  "props": {
    "options": [
      { "value": "list", "label": "List" },
      { "value": "grid", "label": "Grid" },
      { "value": "calendar", "label": "Calendar" }
    ],
    "defaultValue": "list"
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
