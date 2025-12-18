"use client";

import { Badge, Collapsible, CollapsibleTrigger, CollapsibleContent, CodeBlock, DocumentContent } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";

const variantsCode = `import { Badge } from "@fragment_ui/ui";

export function BadgeVariantsDemo() {
  return (
    <>
      <Badge variant="solid">Solid</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="subtle">Subtle</Badge>
    </>
  );
}`;

const sizesCode = `import { Badge } from "@fragment_ui/ui";

export function BadgeSizesDemo() {
  return (
    <>
      <Badge variant="solid" size="sm">Small</Badge>
      <Badge variant="solid" size="md">Medium</Badge>
      <Badge variant="solid" size="lg">Large</Badge>
    </>
  );
}`;

export default function BadgePage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="badge">Badge</h1>
      </div>
      <p className="mb-6 intro-text">Highlight small status or count indicators.</p>
      
      {/* Variants */}
      <ExampleSection
        id="badge-variants"
        title="Variants"
        code={variantsCode}
      >
        <div className="flex gap-2 items-center justify-center">
          <Badge variant="solid">Solid</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="subtle">Subtle</Badge>
        </div>
      </ExampleSection>

      {/* Sizes */}
      <ExampleSection
        id="badge-sizes"
        title="Sizes"
        code={sizesCode}
        marginTop="mt-8"
      >
        <div className="flex gap-2 items-center justify-center">
          <Badge variant="solid" size="sm">Small</Badge>
          <Badge variant="solid" size="md">Medium</Badge>
          <Badge variant="solid" size="lg">Large</Badge>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add badge`}
      </CodeBlock>

      {/* API Reference */}
      <h2 id="api" className="mt-8">API Reference</h2>
      <div className="mt-4 border border-[color:var(--color-border-base)] rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-2 px-4 font-semibold text-sm">Prop</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Type</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Default</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>variant</code></td>
              <td className="py-2 px-4">
                <div className="flex gap-1 flex-wrap">
                  <code>"solid"</code>
                  <code>"outline"</code>
                  <code>"subtle"</code>
                </div>
              </td>
              <td className="py-2 px-4"><code>"solid"</code></td>
              <td className="py-2 px-4 text-sm">Visual style variant of the badge</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>size</code></td>
              <td className="py-2 px-4">
                <div className="flex gap-1 flex-wrap">
                  <code>"sm"</code>
                  <code>"md"</code>
                  <code>"lg"</code>
                </div>
              </td>
              <td className="py-2 px-4"><code>"md"</code></td>
              <td className="py-2 px-4 text-sm">Size of the badge</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>children</code></td>
              <td className="py-2 px-4"><code>React.ReactNode</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Badge text content (required)</td>
            </tr>
            <tr>
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
            <code>Badge</code> is a small component for displaying status labels, tags, or categorical information. Use it when you need to show status indicators, categories, counts, or short text labels that should stand out from regular text.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Status indicators (active, pending, completed, etc.)</li>
            <li>Category tags and labels</li>
            <li>Notification counts and badges</li>
            <li>Feature flags and version indicators</li>
            <li>Short metadata labels</li>
          </ul>

          <p><strong>UI-DSL Usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Badge"</code>.
          </p>
          
          <p><strong>Props</strong></p>
          <ul>
            <li><code>variant?</code> – <code>"solid"</code> (default), <code>"outline"</code>, or <code>"subtle"</code>. Use <code>"solid"</code> for prominent labels, <code>"outline"</code> for bordered badges, and <code>"subtle"</code> for subtle background badges.</li>
            <li><code>size?</code> – <code>"sm"</code>, <code>"md"</code> (default), or <code>"lg"</code>. Size of the badge</li>
            <li><code>children</code> – string or React node. Badge text content (required)</li>
            <li><code>className?</code> – string. Additional CSS classes</li>
          </ul>

          <h3 className="mt-6 mb-4">Basic Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Badge",
  "props": {
    "variant": "solid",
    "size": "md"
  },
  "children": "New"
}`}</CodeBlock>

          <h3 className="mt-6 mb-4">Variants</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`[
  {
    "type": "component",
    "component": "Badge",
    "props": { "variant": "solid" },
    "children": "Active"
  },
  {
    "type": "component",
    "component": "Badge",
    "props": { "variant": "outline" },
    "children": "Pending"
  },
  {
    "type": "component",
    "component": "Badge",
    "props": { "variant": "subtle" },
    "children": "Draft"
  }
]`}</CodeBlock>

          <h3 className="mt-6 mb-4">Sizes</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`[
  {
    "type": "component",
    "component": "Badge",
    "props": { "variant": "solid", "size": "sm" },
    "children": "Small"
  },
  {
    "type": "component",
    "component": "Badge",
    "props": { "variant": "solid", "size": "md" },
    "children": "Medium"
  },
  {
    "type": "component",
    "component": "Badge",
    "props": { "variant": "solid", "size": "lg" },
    "children": "Large"
  }
]`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
