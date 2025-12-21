"use client";

import { Collapsible, CollapsibleTrigger, CollapsibleContent, DocumentContent, CodeBlock, Badge } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const basicCode = `import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@fragment_ui/ui";

export function CollapsibleBasicDemo() {
  return (
    <Collapsible className="w-full">
      <CollapsibleTrigger className="w-full text-left">
        <span className="font-medium">Can I use this in my project?</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-[var(--space-2)] space-y-[var(--space-2)]">
        <p className="text-[length:var(--typography-size-sm)] text-[color:var(--color-fg-muted)]">
          Yes. Free to use for personal and commercial projects. No attribution required.
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
}`;

const multipleCode = `import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@fragment_ui/ui";

export function CollapsibleMultipleDemo() {
  return (
    <div className="flex flex-col gap-[var(--space-4)] w-full">
      <Collapsible className="w-full">
        <CollapsibleTrigger className="w-full text-left">
          <span className="font-medium">Is it accessible?</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-[var(--space-2)]">
          <p className="text-[length:var(--typography-size-sm)] text-[color:var(--color-fg-muted)]">
            Yes. The Collapsible component fully adheres to the WAI-ARIA design pattern, ensuring proper keyboard navigation and screen reader support.
          </p>
        </CollapsibleContent>
      </Collapsible>
      <Collapsible className="w-full">
        <CollapsibleTrigger className="w-full text-left">
          <span className="font-medium">Is it styled?</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-[var(--space-2)]">
          <p className="text-[length:var(--typography-size-sm)] text-[color:var(--color-fg-muted)]">
            Yes. The Collapsible comes with carefully crafted default styles that match the Fragment UI design system aesthetic.
          </p>
        </CollapsibleContent>
      </Collapsible>
      <Collapsible className="w-full">
        <CollapsibleTrigger className="w-full text-left">
          <span className="font-medium">Is it animated?</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-[var(--space-2)]">
          <p className="text-[length:var(--typography-size-sm)] text-[color:var(--color-fg-muted)]">
            Yes. The Collapsible features smooth, performant animations by default using CSS transitions.
          </p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}`;

export default function CollapsiblePage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-[var(--space-4)] mb-[var(--space-1)]">
        <h1 id="collapsible">Collapsible</h1>
      </div>
      <p className="mb-[var(--space-6)] intro-text">Toggle visibility of inline content sections.</p>
      
      {/* Basic */}
      <ExampleSection
        id="collapsible-basic"
        title="Example"
        code={basicCode}
        maxWidth="max-w-md"
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <Collapsible className="w-full">
            <CollapsibleTrigger className="w-full text-left">
              <span className="font-medium">Can I use this in my project?</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-[var(--space-2)] space-y-[var(--space-2)]">
              <p className="text-[length:var(--typography-size-sm)] text-[color:var(--color-fg-muted)]">
                Yes. Free to use for personal and commercial projects. No attribution required.
              </p>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ExampleSection>

      {/* Multiple Items */}
      <ExampleSection
        id="collapsible-multiple"
        title="Multiple Items"
        code={multipleCode}
        marginTop="mt-[var(--space-8)]"
        maxWidth="max-w-md"
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <div className="flex flex-col gap-[var(--space-4)] w-full">
            <Collapsible className="w-full">
              <CollapsibleTrigger className="w-full text-left">
                <span className="font-medium">Is it accessible?</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-[var(--space-2)]">
                <p className="text-[length:var(--typography-size-sm)] text-[color:var(--color-fg-muted)]">
                  Yes. The Collapsible component fully adheres to the WAI-ARIA design pattern, ensuring proper keyboard navigation and screen reader support.
                </p>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible className="w-full">
              <CollapsibleTrigger className="w-full text-left">
                <span className="font-medium">Is it styled?</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-[var(--space-2)]">
                <p className="text-[length:var(--typography-size-sm)] text-[color:var(--color-fg-muted)]">
                  Yes. The Collapsible comes with carefully crafted default styles that match the Fragment UI design system aesthetic.
                </p>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible className="w-full">
              <CollapsibleTrigger className="w-full text-left">
                <span className="font-medium">Is it animated?</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-[var(--space-2)]">
                <p className="text-[length:var(--typography-size-sm)] text-[color:var(--color-fg-muted)]">
                  Yes. The Collapsible features smooth, performant animations by default using CSS transitions.
                </p>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </ExampleSection>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add collapsible`}
      </CodeBlock>

      {/* API Reference */}
      <h2 id="api" className="mt-[var(--space-8)]">API Reference</h2>
      <div className="mt-[var(--space-4)] border border-[color:var(--color-border-base)] rounded-[var(--radius-lg)] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)] font-semibold">Component</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)] font-semibold">Prop</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)] font-semibold">Type</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)] font-semibold">Default</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)] font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>Collapsible</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>open</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Controlled open state</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>Collapsible</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>defaultOpen</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>false</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Initial open state</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>Collapsible</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>onOpenChange</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>(open: boolean) =&gt; void</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Callback when open state changes</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>Collapsible</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>disabled</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>false</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Disable the collapsible</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>CollapsibleTrigger</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>children</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>React.ReactNode</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Trigger content (required)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>CollapsibleTrigger</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>showIcon</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>true</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Show chevron icon in trigger</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>CollapsibleTrigger</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>asChild</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>false</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Use child element as trigger</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>CollapsibleTrigger</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Additional CSS classes</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>CollapsibleContent</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>children</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>React.ReactNode</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Content to display when expanded (required)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>CollapsibleContent</code></td>
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
            <code>Collapsible</code> is a component for showing and hiding content sections. Use it when you need to expand or collapse content areas, create accordion-like interfaces, show/hide details, or organize content into collapsible sections.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>FAQ sections and help documentation</li>
            <li>Accordion-style content organization</li>
            <li>Show/hide details or additional information</li>
            <li>Collapsible navigation menus</li>
            <li>Expandable form sections or settings panels</li>
          </ul>

          <p><strong>UI-DSL Usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Collapsible"</code>. Collapsible is a composable component with sub-components.
          </p>
          
          <p><strong>Props</strong></p>
          <ul>
            <li><code>open?</code> – boolean. Controlled open state</li>
            <li><code>defaultOpen?</code> – boolean (default: <code>false</code>). Initial open state</li>
            <li><code>onOpenChange?</code> – function. Callback when open state changes: <code>(open: boolean) =&gt; void</code></li>
            <li><code>disabled?</code> – boolean (default: <code>false</code>). Disable the collapsible</li>
            <li><code>showIcon?</code> – boolean (default: <code>true</code>). Show chevron icon in trigger</li>
            <li><code>asChild?</code> – boolean (default: <code>false</code>). Use child element as trigger (for custom triggers like Button)</li>
            <li><code>className?</code> – string. Additional CSS classes</li>
          </ul>
          <p>Collapsible sub-components:</p>
          <ul>
            <li><code>Collapsible</code> – main container (required)</li>
            <li><code>CollapsibleTrigger</code> – clickable element to toggle content (required)</li>
            <li><code>CollapsibleContent</code> – collapsible content area (required)</li>
          </ul>

          <h3 className="mt-[var(--space-6)] mb-[var(--space-4)]">Basic Example</h3>
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
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
