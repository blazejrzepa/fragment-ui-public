"use client";

import { Radio, RadioGroup, DocumentContent, CodeBlock, Label, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const radioCode = `import { Radio, RadioGroup, Label } from "@fragment_ui/ui";
import { useState } from "react";

export function RadioDemo() {
  const [value, setValue] = useState("option1");
  
  return (
    <div className="flex flex-col gap-[var(--space-4)] w-full">
      <RadioGroup value={value} onValueChange={setValue}>
        <div className="flex items-center gap-[var(--space-2)]">
          <Radio value="option1" id="option1" />
          <Label htmlFor="option1">Option 1</Label>
        </div>
        <div className="flex items-center gap-[var(--space-2)]">
          <Radio value="option2" id="option2" />
          <Label htmlFor="option2">Option 2</Label>
        </div>
        <div className="flex items-center gap-[var(--space-2)]">
          <Radio value="option3" id="option3" disabled />
          <Label htmlFor="option3" className="opacity-50">Option 3 (disabled)</Label>
        </div>
      </RadioGroup>
      <p className="text-sm text-[color:var(--color-fg-muted)]">
        Selected: {value}
      </p>
    </div>
  );
}`;

export default function RadioPage() {
  const [value, setValue] = useState("option1");

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="radio">Radio</h1>
      </div>
      <p className="mb-6 intro-text">Select exactly one option from a group.</p>
      
      <ExampleSection
        id="radio-example"
        title="Example"
        code={radioCode}
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="w-full max-w-md">
            <RadioGroup value={value} onValueChange={setValue}>
              <div className="flex items-center gap-[var(--space-2)]">
                <Radio value="option1" id="option1" />
                <Label htmlFor="option1">Option 1</Label>
              </div>
              <div className="flex items-center gap-[var(--space-2)]">
                <Radio value="option2" id="option2" />
                <Label htmlFor="option2">Option 2</Label>
              </div>
              <div className="flex items-center gap-[var(--space-2)]">
                <Radio value="option3" id="option3" disabled />
                <Label htmlFor="option3" className="opacity-50">Option 3 (disabled)</Label>
              </div>
            </RadioGroup>
            <p className="mt-[var(--space-2)] text-sm text-[color:var(--color-fg-muted)]">
              Selected: {value}
            </p>
          </div>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add radio`}
      </CodeBlock>

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
              <td className="py-2 px-4"><code>RadioGroup</code></td>
              <td className="py-2 px-4"><code>value?, defaultValue?, onValueChange?, disabled?, className?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Container for radio buttons</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>Radio</code></td>
              <td className="py-2 px-4"><code>value, id, label?, description?, disabled?, className?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Radio button component (use within RadioGroup)</td>
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
          <h3>Intent</h3>
          <p>
            <code>Radio</code> is a component for selecting one option from a set. Use it when you need to provide users with mutually exclusive choices, such as form options, settings, or preferences. Radio buttons are grouped together, and only one option can be selected at a time.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Form fields with mutually exclusive options</li>
            <li>Settings and preferences</li>
            <li>Filter or sort options</li>
            <li>Payment method selection</li>
            <li>Any scenario requiring single selection from multiple options</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "RadioGroup"</code> and nested <code>Radio</code> components.
          </p>
          <p><strong>Props:</strong></p>
          <p>Props for <code>RadioGroup</code>:</p>
          <ul>
            <li><code>value?</code> – string. Selected value (optional)</li>
            <li><code>defaultValue?</code> – string. Initial value (optional)</li>
            <li><code>onValueChange?</code> – function. Callback when value changes: <code>(value: string) {'=>'} void</code> (optional)</li>
            <li><code>disabled?</code> – boolean. Disable all radios in group (optional)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>
          <p>Props for <code>Radio</code>:</p>
          <ul>
            <li><code>value</code> – string. Radio value (required)</li>
            <li><code>id</code> – string. Unique identifier (required for accessibility)</li>
            <li><code>label?</code> – string. Label text (optional)</li>
            <li><code>description?</code> – string. Description text (optional)</li>
            <li><code>disabled?</code> – boolean. Disable the radio (optional)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>
          <p>Always pair with a <code>Label</code> component using the <code>htmlFor</code> prop matching the radio <code>id</code> for proper accessibility.</p>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "RadioGroup",
  "props": {
    "value": "option1",
    "onValueChange": "handleValueChange"
  },
  "children": [
    {
      "type": "component",
      "component": "div",
      "props": { "className": "flex items-center gap-2" },
      "children": [
        {
          "type": "component",
          "component": "Radio",
          "props": {
            "value": "option1",
            "id": "option1"
          }
        },
        {
          "type": "component",
          "component": "Label",
          "props": { "htmlFor": "option1" },
          "children": "Option 1"
        }
      ]
    }
  ]
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
