"use client";

import { Separator, DocumentContent, CodeBlock, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const separatorHorizontalCode = `import { Separator } from "@fragment_ui/ui";

export function SeparatorHorizontalDemo() {
  return (
    <div className="w-full">
      <div className="py-[var(--space-2)]">Content above</div>
      <Separator />
      <div className="py-[var(--space-2)]">Content below</div>
    </div>
  );
}`;

const separatorVerticalCode = `import { Separator } from "@fragment_ui/ui";

export function SeparatorVerticalDemo() {
  return (
    <div className="flex h-20 items-center">
      <div className="px-[var(--space-4)]">Left</div>
      <Separator orientation="vertical" />
      <div className="px-[var(--space-4)]">Right</div>
    </div>
  );
}`;

export default function SeparatorPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="separator">Separator</h1>
      </div>
      <p className="mb-6 intro-text">Visually divide groups of content or actions.</p>
      
      <ExampleSection
        id="separator-horizontal"
        title="Horizontal"
        code={separatorHorizontalCode}
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="w-full max-w-md">
            <div className="py-[var(--space-2)]">Content above</div>
            <Separator />
            <div className="py-[var(--space-2)]">Content below</div>
          </div>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add separator`}
      </CodeBlock>

      <ExampleSection
        id="separator-vertical"
        title="Vertical"
        code={separatorVerticalCode}
        marginTop="mt-8"
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="flex h-20 items-center justify-center w-full">
            <div className="px-[var(--space-4)]">Left</div>
            <Separator orientation="vertical" />
            <div className="px-[var(--space-4)]">Right</div>
          </div>
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
            <tr>
              <td className="py-2 px-4"><code>Separator</code></td>
              <td className="py-2 px-4"><code>orientation?, decorative?, className?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Visual divider component for separating content</td>
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
            <code>Separator</code> is a component for visually dividing content into sections. Use it when you need to create visual separation between content areas, menu items, or sections. The component supports both horizontal and vertical orientations and is accessible via Radix UI.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Dividing content sections</li>
            <li>Separating menu items</li>
            <li>Creating visual breaks in lists</li>
            <li>Dividing sidebar sections</li>
            <li>Any scenario requiring visual separation</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "Separator"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>orientation?</code> – "horizontal" | "vertical" (default: "horizontal"). Separator orientation (optional)</li>
            <li><code>decorative?</code> – boolean (default: true). Whether separator is decorative (hidden from screen readers) (optional)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "div",
  "children": [
    {
      "type": "element",
      "tag": "div",
      "children": "Content above"
    },
    {
      "type": "component",
      "component": "Separator"
    },
    {
      "type": "element",
      "tag": "div",
      "children": "Content below"
    }
  ]
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
