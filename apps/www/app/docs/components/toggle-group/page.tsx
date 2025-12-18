"use client";

import { ToggleGroup, ToggleGroupItem, DocumentContent, CodeBlock, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { ExampleSection } from "../../../../src/components/example-section";

const toggleGroupCode = `import { ToggleGroup, ToggleGroupItem } from "@fragment_ui/ui";
import { AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from "lucide-react";

// Single selection
<ToggleGroup type="single" defaultValue="center">
  <ToggleGroupItem value="left" aria-label="Align left">
    <AlignLeft className="h-4 w-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="center" aria-label="Align center">
    <AlignCenter className="h-4 w-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="right" aria-label="Align right">
    <AlignRight className="h-4 w-4" />
  </ToggleGroupItem>
</ToggleGroup>

// Multiple selection
<ToggleGroup type="multiple" defaultValue={["bold", "italic"]}>
  <ToggleGroupItem value="bold" aria-label="Toggle bold">
    <Bold className="h-4 w-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="italic" aria-label="Toggle italic">
    <Italic className="h-4 w-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="underline" aria-label="Toggle underline">
    <Underline className="h-4 w-4" />
  </ToggleGroupItem>
</ToggleGroup>

// Outline variant with connected buttons
<ToggleGroup type="single" defaultValue="last-year" variant="outline" spacing="0">
  <ToggleGroupItem value="last-year" aria-label="Last Year" variant="outline" spacing="0">
    Last Year
  </ToggleGroupItem>
  <ToggleGroupItem value="last-6-months" aria-label="Last 6 months" variant="outline" spacing="0">
    Last 6 months
  </ToggleGroupItem>
  <ToggleGroupItem value="last-month" aria-label="Last Month" variant="outline" spacing="0">
    Last Month
  </ToggleGroupItem>
</ToggleGroup>`;

export default function ToggleGroupPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="toggle-group">Toggle Group</h1>
      </div>
      <p className="mb-6 intro-text">Manage multiple related toggles together.</p>
      
      <ExampleSection
        id="toggle-group-example"
        title="Example"
        code={toggleGroupCode}
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="flex flex-col gap-[var(--space-8)] items-center">
          <ToggleGroup type="single" defaultValue="center">
            <ToggleGroupItem value="left" aria-label="Align left">
              <AlignLeft className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Align center">
              <AlignCenter className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Align right">
              <AlignRight className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          
          <ToggleGroup type="multiple" defaultValue={["bold", "italic"]}>
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
              <Bold className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
              <Italic className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Toggle underline">
              <Underline className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          
          <ToggleGroup type="single" defaultValue="last-year" variant="outline" spacing="0">
            <ToggleGroupItem value="last-year" aria-label="Last Year" variant="outline" spacing="0">
              Last Year
            </ToggleGroupItem>
            <ToggleGroupItem value="last-6-months" aria-label="Last 6 months" variant="outline" spacing="0">
              Last 6 months
            </ToggleGroupItem>
            <ToggleGroupItem value="last-month" aria-label="Last Month" variant="outline" spacing="0">
              Last Month
            </ToggleGroupItem>
          </ToggleGroup>
          </div>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add toggle-group`}
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
            <tr>
              <td className="py-2 px-4"><code>ToggleGroup</code></td>
              <td className="py-2 px-4"><code>type, value?, defaultValue?, onValueChange?, variant?, spacing?, className?</code></td>
              <td className="py-2 px-4">variant: "outline", spacing: "default"</td>
              <td className="py-2 px-4 text-sm">Container for toggle group items</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>ToggleGroupItem</code></td>
              <td className="py-2 px-4"><code>value, variant?, spacing?, disabled?, aria-label?, className?</code></td>
              <td className="py-2 px-4">variant: "outline", spacing: "default"</td>
              <td className="py-2 px-4 text-sm">Individual toggle item</td>
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
            <code>ToggleGroup</code> is a component for selecting one or multiple options from a related set of choices. Use it when you need to allow users to toggle between related options, such as text formatting controls, alignment options, or filter selections. The component supports both single and multiple selection modes, with visual feedback for active states.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Text formatting controls (bold, italic, underline)</li>
            <li>Alignment options (left, center, right, justify)</li>
            <li>Filter or view mode toggles</li>
            <li>Time period selectors (day, week, month, year)</li>
            <li>Any set of related mutually exclusive or multiple selectable options</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "ToggleGroup"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>ToggleGroup</code> – Container component (required):
              <ul>
                <li><code>type</code> – string. Selection mode: "single" | "multiple" (required)</li>
                <li><code>value?</code> – string | string[]. Controlled value: string for single, string[] for multiple (optional)</li>
                <li><code>defaultValue?</code> – string | string[]. Uncontrolled default value: string for single, string[] for multiple (optional)</li>
                <li><code>onValueChange?</code> – function. Callback when value changes: <code>(value: string | string[]) {'=>'} void</code> (optional)</li>
                <li><code>variant?</code> – string. Visual variant: "outline" | "default" (optional, default: "outline")</li>
                <li><code>spacing?</code> – string. Spacing between items: "default" (with gaps) | "0" (connected buttons) (optional, default: "default")</li>
              </ul>
            </li>
            <li><code>ToggleGroupItem</code> – Individual toggle item (required):
              <ul>
                <li><code>value</code> – string. Unique value for this item (required)</li>
                <li><code>variant?</code> – string. Visual variant: "outline" | "default" (optional, default: "outline")</li>
                <li><code>spacing?</code> – string. Spacing: "default" | "0" (optional, default: "default")</li>
                <li><code>disabled?</code> – boolean. Disable this item (optional)</li>
                <li><code>aria-label?</code> – string. Accessibility label, required for icon-only items (optional)</li>
              </ul>
            </li>
          </ul>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "ToggleGroup",
  "props": {
    "type": "single",
    "defaultValue": "center",
    "variant": "outline"
  },
  "children": [
    {
      "type": "component",
      "component": "ToggleGroupItem",
      "props": {
        "value": "left",
        "aria-label": "Align left"
      },
      "children": {
        "type": "icon",
        "name": "AlignLeft"
      }
    },
    {
      "type": "component",
      "component": "ToggleGroupItem",
      "props": {
        "value": "center",
        "aria-label": "Align center"
      },
      "children": {
        "type": "icon",
        "name": "AlignCenter"
      }
    }
  ]
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
