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

const accordionSixItemsCode = `import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@fragment_ui/ui"

export function AccordionSixItemsDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-5xl">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="overview">
          <AccordionTrigger>Overview</AccordionTrigger>
          <AccordionContent>
            Get a comprehensive overview of the platform. Understand the core concepts, architecture, and how different components work together to deliver a seamless experience.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="installation">
          <AccordionTrigger>Installation</AccordionTrigger>
          <AccordionContent>
            Step-by-step installation instructions for various environments. Includes system requirements, dependencies, and troubleshooting tips for common setup issues.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="configuration">
          <AccordionTrigger>Configuration</AccordionTrigger>
          <AccordionContent>
            Learn how to configure settings, customize preferences, and optimize performance. Detailed guides for advanced configuration options and best practices.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="usage">
          <AccordionTrigger>Usage Examples</AccordionTrigger>
          <AccordionContent>
            Practical examples and code snippets demonstrating common use cases. Real-world scenarios with detailed explanations to help you implement features effectively.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="api">
          <AccordionTrigger>API Reference</AccordionTrigger>
          <AccordionContent>
            Complete API documentation with endpoints, parameters, and response formats. Includes authentication methods, rate limits, and example requests for each endpoint.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="troubleshooting">
          <AccordionTrigger>Troubleshooting</AccordionTrigger>
          <AccordionContent>
            Common issues and their solutions. Debugging tips, error code references, and step-by-step guides to resolve problems quickly and efficiently.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}`;


export default function AccordionPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="accordion">Accordion</h1>
      </div>
      <p className="mb-6 intro-text">
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

      {/* Accordion with 6 items */}
      <ExampleSection
        id="accordion-6-items"
        title="Accordion with 6 Items"
        code={accordionSixItemsCode}
        marginTop="mt-8"
        maxWidth="max-w-5xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-5xl">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="overview">
              <AccordionTrigger>Overview</AccordionTrigger>
              <AccordionContent>
                Get a comprehensive overview of the platform. Understand the core concepts, architecture, and how different components work together to deliver a seamless experience.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="installation">
              <AccordionTrigger>Installation</AccordionTrigger>
              <AccordionContent>
                Step-by-step installation instructions for various environments. Includes system requirements, dependencies, and troubleshooting tips for common setup issues.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="configuration">
              <AccordionTrigger>Configuration</AccordionTrigger>
              <AccordionContent>
                Learn how to configure settings, customize preferences, and optimize performance. Detailed guides for advanced configuration options and best practices.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="usage">
              <AccordionTrigger>Usage Examples</AccordionTrigger>
              <AccordionContent>
                Practical examples and code snippets demonstrating common use cases. Real-world scenarios with detailed explanations to help you implement features effectively.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="api">
              <AccordionTrigger>API Reference</AccordionTrigger>
              <AccordionContent>
                Complete API documentation with endpoints, parameters, and response formats. Includes authentication methods, rate limits, and example requests for each endpoint.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="troubleshooting">
              <AccordionTrigger>Troubleshooting</AccordionTrigger>
              <AccordionContent>
                Common issues and their solutions. Debugging tips, error code references, and step-by-step guides to resolve problems quickly and efficiently.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ExampleSection>

      {/* API Reference */}
      <h2 id="api" className="mt-8">API Reference</h2>
      <div className="mt-4 border border-[color:var(--color-border-base)] rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-2 px-4 font-semibold text-sm">Component</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Prop</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Type</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Default</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>Accordion</code></td>
              <td className="py-2 px-4"><code>type</code></td>
              <td className="py-2 px-4">
                <div className="flex gap-1 flex-wrap">
                  <code>"single"</code>
                  <code>"multiple"</code>
                </div>
              </td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Type of accordion behavior</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>Accordion</code></td>
              <td className="py-2 px-4"><code>collapsible</code></td>
              <td className="py-2 px-4"><code>boolean</code></td>
              <td className="py-2 px-4"><code>false</code></td>
              <td className="py-2 px-4 text-sm">Allow all items to be closed (only for type="single")</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>Accordion</code></td>
              <td className="py-2 px-4"><code>defaultValue</code></td>
              <td className="py-2 px-4"><code>string | string[]</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Default open item value(s)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>Accordion</code></td>
              <td className="py-2 px-4"><code>value</code></td>
              <td className="py-2 px-4"><code>string | string[]</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Controlled open item value(s)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>Accordion</code></td>
              <td className="py-2 px-4"><code>onValueChange</code></td>
              <td className="py-2 px-4"><code>(value: string | string[]) =&gt; void</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Callback when value changes</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>Accordion</code></td>
              <td className="py-2 px-4"><code>className</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Additional CSS classes</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>AccordionItem</code></td>
              <td className="py-2 px-4"><code>value</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Unique identifier for the item (required)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>AccordionItem</code></td>
              <td className="py-2 px-4"><code>className</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Additional CSS classes</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>AccordionTrigger</code></td>
              <td className="py-2 px-4"><code>children</code></td>
              <td className="py-2 px-4"><code>React.ReactNode</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Trigger content (required)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>AccordionTrigger</code></td>
              <td className="py-2 px-4"><code>className</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Additional CSS classes</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>AccordionContent</code></td>
              <td className="py-2 px-4"><code>children</code></td>
              <td className="py-2 px-4"><code>React.ReactNode</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Content to display when expanded (required)</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>AccordionContent</code></td>
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
