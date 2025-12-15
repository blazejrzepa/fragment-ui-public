"use client";

import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent, CodeBlock, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";

export default function AccordionPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="accordion" className="text-3xl font-medium mb-4">Accordion</h1>
      </div>
      <p className="mb-6 intro-text">
        Show and hide sections of content.
      </p>
      
      
      {/* Basic Accordion */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-md" suppressHydrationWarning>
            <Accordion type="single" collapsible className="w-full">
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
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@fragment_ui/ui"

export function AccordionDemo() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-md">
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
  )
}`}</CodeBlock>
        </div>
      </div>

      {/* Accordion with 6 items */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-md" suppressHydrationWarning>
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
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@fragment_ui/ui"

export function AccordionSixItemsDemo() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-md">
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
  )
}`}</CodeBlock>
        </div>
      </div>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">{`npx shadcn@latest add https://fragmentui.com/r/accordion.json`}</CodeBlock>
      
      <Collapsible>
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation">
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

      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/disclosure-accordion--docs">Storybook</StorybookLink>
        </li>
      </ul>

    </DocumentContent>
  );
}
