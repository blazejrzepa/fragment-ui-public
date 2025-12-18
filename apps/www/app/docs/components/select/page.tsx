"use client";

import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem, SelectGroup, SelectLabel, CodeBlock, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";
import { Apple, Banana, Cherry, Grape, Citrus } from "lucide-react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const selectCode = `"use client";

import { 
  Select, 
  SelectValue, 
  SelectTrigger, 
  SelectContent, 
  SelectItem,
  SelectGroup,
  SelectLabel
} from "@fragment_ui/ui";

export function SelectDemo() {
  return (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Choose" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Citrus Fruits</SelectLabel>
          <SelectItem value="orange">Orange</SelectItem>
          <SelectItem value="lemon">Lemon</SelectItem>
          <SelectItem value="lime">Lime</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Berries</SelectLabel>
          <SelectItem value="strawberry">Strawberry</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}`;

const selectIconsCode = `"use client";

import { 
  Select, 
  SelectValue, 
  SelectTrigger, 
  SelectContent, 
  SelectItem
} from "@fragment_ui/ui";
import { Apple, Banana, Cherry, Grape, Citrus } from "lucide-react";

export function SelectWithIcons() {
  return (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Choose" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">
          <div className="flex items-center gap-[var(--space-2)]">
            <Apple className="h-4 w-4" />
            <span>Apple</span>
          </div>
        </SelectItem>
        <SelectItem value="banana">
          <div className="flex items-center gap-[var(--space-2)]">
            <Banana className="h-4 w-4" />
            <span>Banana</span>
          </div>
        </SelectItem>
        <SelectItem value="cherry">
          <div className="flex items-center gap-[var(--space-2)]">
            <Cherry className="h-4 w-4" />
            <span>Cherry</span>
          </div>
        </SelectItem>
        <SelectItem value="grape">
          <div className="flex items-center gap-[var(--space-2)]">
            <Grape className="h-4 w-4" />
            <span>Grape</span>
          </div>
        </SelectItem>
        <SelectItem value="orange">
          <div className="flex items-center gap-[var(--space-2)]">
            <Citrus className="h-4 w-4" />
            <span>Orange</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}`;

export default function SelectPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="select">Select</h1>
      </div>
      <p className="mb-6 intro-text">Choose a single option from a dropdown.</p>
      
      <ExampleSection
        id="select-example"
        title="Example"
        code={selectCode}
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Choose" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Citrus Fruits</SelectLabel>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="lemon">Lemon</SelectItem>
                <SelectItem value="lime">Lime</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Berries</SelectLabel>
                <SelectItem value="strawberry">Strawberry</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add select`}
      </CodeBlock>

      <ExampleSection
        id="select-icons"
        title="With Icons"
        code={selectIconsCode}
        marginTop="mt-8"
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Choose" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">
                <div className="flex items-center gap-[var(--space-2)]">
                  <Apple className="h-4 w-4" />
                  <span>Apple</span>
                </div>
              </SelectItem>
              <SelectItem value="banana">
                <div className="flex items-center gap-[var(--space-2)]">
                  <Banana className="h-4 w-4" />
                  <span>Banana</span>
                </div>
              </SelectItem>
              <SelectItem value="cherry">
                <div className="flex items-center gap-[var(--space-2)]">
                  <Cherry className="h-4 w-4" />
                  <span>Cherry</span>
                </div>
              </SelectItem>
              <SelectItem value="grape">
                <div className="flex items-center gap-[var(--space-2)]">
                  <Grape className="h-4 w-4" />
                  <span>Grape</span>
                </div>
              </SelectItem>
              <SelectItem value="orange">
                <div className="flex items-center gap-[var(--space-2)]">
                  <Citrus className="h-4 w-4" />
                  <span>Orange</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
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
              <td className="py-2 px-4"><code>Select</code></td>
              <td className="py-2 px-4"><code>value?, defaultValue?, onValueChange?, disabled?, className?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Root container for select component</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>SelectTrigger</code></td>
              <td className="py-2 px-4"><code>error?, loading?, className?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Button that opens the dropdown</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>SelectValue</code></td>
              <td className="py-2 px-4"><code>placeholder?, className?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Displays selected value or placeholder</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>SelectContent</code></td>
              <td className="py-2 px-4"><code>position?, sideOffset?, className?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Dropdown content container</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>SelectItem</code></td>
              <td className="py-2 px-4"><code>value, disabled?, className?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Individual option item</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>SelectGroup</code></td>
              <td className="py-2 px-4"><code>className?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Group container for organizing items</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>SelectLabel</code></td>
              <td className="py-2 px-4"><code>className?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Group label</td>
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
            <code>Select</code> is a component for choosing one option from a dropdown list. Use it when you need to provide users with a dropdown selection interface. The component supports grouped options, icons, search functionality, and is fully accessible with keyboard navigation.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Form fields with dropdown options</li>
            <li>Settings and configuration selectors</li>
            <li>Filter or sort dropdowns</li>
            <li>Language or region selectors</li>
            <li>Any scenario requiring single selection from a list</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "Select"</code> and nested sub-components.
          </p>
          <p><strong>Props:</strong></p>
          <p>Props for <code>Select</code>:</p>
          <ul>
            <li><code>value?</code> – string. Selected value (optional, for controlled component)</li>
            <li><code>defaultValue?</code> – string. Initial value (optional)</li>
            <li><code>onValueChange?</code> – function. Callback when value changes: <code>(value: string) {'=>'} void</code> (optional)</li>
            <li><code>disabled?</code> – boolean. Disable the select (optional)</li>
          </ul>
          <p>Props for <code>SelectTrigger</code>:</p>
          <ul>
            <li><code>error?</code> – boolean. Show error state (optional)</li>
            <li><code>loading?</code> – boolean. Show loading spinner (optional)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>
          <p>Props for <code>SelectValue</code>:</p>
          <ul>
            <li><code>placeholder?</code> – string. Placeholder text (optional)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>
          <p>Props for <code>SelectItem</code>:</p>
          <ul>
            <li><code>value</code> – string. Item value (required)</li>
            <li><code>disabled?</code> – boolean. Disable the item (optional)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Select",
  "children": [
    {
      "type": "component",
      "component": "SelectTrigger",
      "children": {
        "type": "component",
        "component": "SelectValue",
        "props": {
          "placeholder": "Choose"
        }
      }
    },
    {
      "type": "component",
      "component": "SelectContent",
      "children": [
        {
          "type": "component",
          "component": "SelectItem",
          "props": {
            "value": "option1"
          },
          "children": "Option 1"
        },
        {
          "type": "component",
          "component": "SelectItem",
          "props": {
            "value": "option2"
          },
          "children": "Option 2"
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
