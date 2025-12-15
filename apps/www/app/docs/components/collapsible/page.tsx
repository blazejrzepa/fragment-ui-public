"use client";

import { Collapsible, CollapsibleTrigger, CollapsibleContent, DocumentContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";

export default function CollapsiblePage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Collapsible</h1>
      </div>
      <p className="mb-6 intro-text">
        Expand or collapse a content area.
      </p>
      
      
      {/* Default */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <Collapsible className="w-full max-w-md">
            <CollapsibleTrigger className="w-full text-left">
              <span className="font-medium">Can I use this in my project?</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2">
              <p className="text-sm text-[color:var(--color-fg-muted)]">
                Yes. Free to use for personal and commercial projects. No attribution required.
              </p>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@fragment_ui/ui";

<Collapsible className="w-full">
  <CollapsibleTrigger className="w-full text-left">
    <span className="font-medium">Can I use this in my project?</span>
  </CollapsibleTrigger>
  <CollapsibleContent className="mt-2 space-y-2">
    <p className="text-sm text-[color:var(--color-fg-muted)]">
      Yes. Free to use for personal and commercial projects. No attribution required.
    </p>
  </CollapsibleContent>
</Collapsible>`}</CodeBlock>
        </div>
      </div>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">{`npx shadcn@latest add https://fragmentui.com/r/collapsible.json`}</CodeBlock>

      <Collapsible>
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <p><strong>Intent</strong></p>
          <p>
            <code>Collapsible</code> is a component for showing and hiding content sections.<br />
            Use it when you need to expand or collapse content areas, create accordion-like interfaces, show/hide details, or organize content into collapsible sections.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>FAQ sections and help documentation</li>
            <li>Accordion-style content organization</li>
            <li>Show/hide details or additional information</li>
            <li>Collapsible navigation menus</li>
            <li>Expandable form sections or settings panels</li>
          </ul>

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Collapsible"</code>. Collapsible is a composable component with sub-components:
          </p>
          <ul>
            <li><code>Collapsible</code> – main container (required)</li>
            <li><code>CollapsibleTrigger</code> – clickable element to toggle content (required)</li>
            <li><code>CollapsibleContent</code> – collapsible content area (required)</li>
          </ul>
          <p>Props:</p>
          <ul>
            <li><code>open?</code> – controlled open state (optional)</li>
            <li><code>onOpenChange?</code> – callback when open state changes (optional)</li>
            <li><code>disabled?</code> – disable the collapsible (optional)</li>
            <li><code>defaultOpen?</code> – initial open state (optional)</li>
            <li><code>showIcon?</code> – show chevron icon in trigger (optional, default: true)</li>
            <li><code>asChild?</code> – use child element as trigger (optional, for custom triggers like Button)</li>
          </ul>

          <p><strong>Example</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Collapsible",
  "props": {
    "defaultOpen": false
  },
  "children": [
    {
      "type": "component",
      "component": "CollapsibleTrigger",
      "children": "Can I use this in my project?"
    },
    {
      "type": "component",
      "component": "CollapsibleContent",
      "children": "Yes. Free to use for personal and commercial projects."
    }
  ]
}`}</CodeBlock>
          <p className="mt-6"><strong>With Button trigger:</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Collapsible",
  "children": [
    {
      "type": "component",
      "component": "CollapsibleTrigger",
      "props": {
        "asChild": true,
        "showIcon": false
      },
      "children": {
        "type": "component",
        "component": "Button",
        "props": {
          "variant": "outline"
        },
        "children": "Toggle Content"
      }
    },
    {
      "type": "component",
      "component": "CollapsibleContent",
      "children": "This is the collapsible content."
    }
  ]
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
      
      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/core-collapsible--docs">Storybook</StorybookLink>
        </li>
      </ul>


    </DocumentContent>
  );
}

