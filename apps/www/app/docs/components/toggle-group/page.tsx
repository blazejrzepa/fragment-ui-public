"use client";

import { ToggleGroup, ToggleGroupItem, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";

export default function ToggleGroupPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Toggle Group</h1>
      </div>
      <p className="mb-6 intro-text">
        Toggle between multiple related options.
      </p>
      
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="flex flex-col gap-8 items-center">
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
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { ToggleGroup, ToggleGroupItem } from "@fragment_ui/ui";
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
</ToggleGroup>`}</CodeBlock>
        </div>
      </div>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">
        {`npx shadcn@latest add https://fragmentui.com/r/toggle-group.json`}
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
            <code>ToggleGroup</code> is a component for selecting one or multiple options from a related set of choices.<br />
            Use it when you need to allow users to toggle between related options, such as text formatting controls, alignment options, or filter selections. The component supports both single and multiple selection modes, with visual feedback for active states.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Text formatting controls (bold, italic, underline)</li>
            <li>Alignment options (left, center, right, justify)</li>
            <li>Filter or view mode toggles</li>
            <li>Time period selectors (day, week, month, year)</li>
            <li>Any set of related mutually exclusive or multiple selectable options</li>
          </ul>

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "ToggleGroup"</code>.
          </p>
          <p>Props:</p>
          <ul>
            <li><code>type</code> – selection mode: <code>"single"</code> or <code>"multiple"</code> (required)</li>
            <li><code>value?</code> – controlled value: string for single, string[] for multiple (optional)</li>
            <li><code>defaultValue?</code> – uncontrolled default value: string for single, string[] for multiple (optional)</li>
            <li><code>onValueChange?</code> – callback when value changes (optional)</li>
            <li><code>variant?</code> – visual variant: <code>"outline"</code> or <code>"default"</code> (optional, default: <code>"outline"</code>)</li>
            <li><code>spacing?</code> – spacing between items: <code>"default"</code> (with gaps) or <code>"0"</code> (connected buttons) (optional, default: <code>"default"</code>)</li>
            <li><code>className?</code> – additional CSS classes (optional)</li>
          </ul>

          <p><strong>ToggleGroupItem props</strong></p>
          <ul>
            <li><code>value</code> – unique value for this item (required)</li>
            <li><code>variant?</code> – visual variant: <code>"outline"</code> or <code>"default"</code> (optional, default: <code>"outline"</code>)</li>
            <li><code>spacing?</code> – spacing: <code>"default"</code> or <code>"0"</code> (optional, default: <code>"default"</code>)</li>
            <li><code>disabled?</code> – disable this item (optional)</li>
            <li><code>aria-label?</code> – accessibility label, required for icon-only items (optional)</li>
            <li><code>children</code> – content of the toggle item (required)</li>
          </ul>

          <p><strong>Example</strong></p>
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
      
      <h2 id="storybook">Storybook</h2>
      <ul>
        <li><StorybookLink path="/docs/core-togglegroup--docs">Storybook</StorybookLink></li>
      </ul>


    </DocumentContent>
  );
}

