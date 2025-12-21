"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent, CodeBlock, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent, Badge } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const accordionCode = `import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@fragment_ui/ui"

export function AccordionDemo() {
  return (
    <Accordion type="single" collapsible className="mx-auto max-w-sm">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. The Accordion component fully adheres to the WAI-ARIA design pattern, ensuring proper keyboard navigation, focus management, and screen reader support. It includes appropriate ARIA attributes such as \`aria-expanded\` and \`aria-controls\` to communicate state changes to assistive technologies.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. The Accordion comes with carefully crafted default styles that match the Fragment UI design system aesthetic. It uses design tokens for colors, spacing, and typography, ensuring consistent appearance across light and dark themes. The component automatically adapts to your theme settings.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. The Accordion features smooth, performant animations by default using CSS transitions. The expand and collapse animations are optimized for 60fps performance and follow motion design principles. You can customize or disable animations if needed through CSS overrides or component props.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}`;

export default function AccordionPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-[var(--space-4)] mb-[var(--space-1)]">
        <h1 id="accordion">Accordion</h1>
      </div>
      <p className="mb-[var(--space-6)] intro-text">
        Show and hide sections of content.
      </p>
      
      {/* Basic Accordion */}
      <ExampleSection
        id="accordion-example"
        title="Example"
        code={accordionCode}
      >
        <Accordion type="single" collapsible className="mx-auto max-w-sm">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. The Accordion component fully adheres to the WAI-ARIA design pattern, ensuring proper keyboard navigation, focus management, and screen reader support. It includes appropriate ARIA attributes such as <code>aria-expanded</code> and <code>aria-controls</code> to communicate state changes to assistive technologies.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it styled?</AccordionTrigger>
            <AccordionContent>
              Yes. The Accordion comes with carefully crafted default styles that match the Fragment UI design system aesthetic. It uses design tokens for colors, spacing, and typography, ensuring consistent appearance across light and dark themes. The component automatically adapts to your theme settings.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is it animated?</AccordionTrigger>
            <AccordionContent>
              Yes. The Accordion features smooth, performant animations by default using CSS transitions. The expand and collapse animations are optimized for 60fps performance and follow motion design principles. You can customize or disable animations if needed through CSS overrides or component props.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ExampleSection>

      {/* Install Section */}
      <h2 id="install">
        Install
      </h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add accordion`}
      </CodeBlock>

      {/* API Reference */}
      <h2 id="api" className="mt-[var(--space-8)]">API Reference</h2>
      <div className="mt-[var(--space-4)] border border-[color:var(--color-border-base)] rounded-[var(--radius-lg)] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Component</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Prop</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Type</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Default</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>Accordion</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>type</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">
                <div className="flex gap-[var(--space-1)] flex-wrap">
                  <code>"single"</code>
                  <code>"multiple"</code>
                </div>
              </td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Type of accordion behavior</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>Accordion</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>collapsible</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>false</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Allow all items to be closed (only for type="single")</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>Accordion</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>defaultValue</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string | string[]</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Default open item value(s)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>Accordion</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>value</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string | string[]</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Controlled open item value(s)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>Accordion</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>onValueChange</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>(value: string | string[]) =&gt; void</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Callback when value changes</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>Accordion</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Additional CSS classes</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>AccordionItem</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>value</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Unique identifier for the item (required)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>AccordionItem</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Additional CSS classes</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>AccordionTrigger</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>children</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>React.ReactNode</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Trigger content (required)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>AccordionTrigger</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Additional CSS classes</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>AccordionContent</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>children</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>React.ReactNode</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Content to display when expanded (required)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>AccordionContent</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Additional CSS classes</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <Collapsible className="mt-[var(--space-8)]">
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation" className="m-0">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-[var(--space-4)]">
          <p><strong>Intent</strong></p>
          <p>
            <code>Accordion</code> is a collapsible content component that allows users to expand and collapse sections.<br />
            Use it when you need to organize content into expandable sections, FAQ lists, or when you want to save vertical space while keeping content accessible.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>FAQ sections</li>
            <li>Collapsible documentation sections</li>
            <li>Settings panels</li>
            <li>Feature lists</li>
            <li>Multi-step forms</li>
            <li>Content organization</li>
          </ul>

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Accordion"</code>. For multiple items, create nested <code>AccordionItem</code> components.
          </p>
          <p>Props:</p>
          <ul>
            <li><code>type</code> – <code>"single"</code> (one open at a time) or <code>"multiple"</code> (multiple open)</li>
            <li><code>collapsible</code> – allow all items to be closed (boolean)</li>
          </ul>
          <p>Each <code>AccordionItem</code> requires:</p>
          <ul>
            <li><code>value</code> – unique identifier (string)</li>
            <li><code>AccordionTrigger</code> – the clickable header (string or ReactNode)</li>
            <li><code>AccordionContent</code> – the collapsible content (string or ReactNode)</li>
          </ul>

          <p><strong>Example</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Accordion",
  "props": {
    "type": "single",
    "collapsible": true
  },
  "children": [
    {
      "type": "component",
      "component": "AccordionItem",
      "props": {
        "value": "item-1"
      },
      "children": [
        {
          "type": "component",
          "component": "AccordionTrigger",
          "children": "Is it accessible?"
        },
        {
          "type": "component",
          "component": "AccordionContent",
          "children": "Yes. The Accordion component fully adheres to the WAI-ARIA design pattern."
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
