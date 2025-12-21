"use client";

import { Skeleton, DocumentContent, CodeBlock, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";

const skeletonTextCode = `import { Skeleton } from "@fragment_ui/ui";

export function SkeletonTextDemo() {
  return (
    <div className="space-y-[var(--space-2)]">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[150px]" />
    </div>
  );
}`;

const skeletonCardCode = `import { Skeleton } from "@fragment_ui/ui";

export function SkeletonCardDemo() {
  return (
    <div className="w-64 space-y-[var(--space-3)]">
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <div className="space-y-[var(--space-2)]">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}`;

export default function SkeletonPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-[var(--space-4)] mb-[var(--space-1)]">
        <h1 id="skeleton">Skeleton</h1>
      </div>
      <p className="mb-[var(--space-6)] intro-text">Placeholder UI while content is loading.</p>
      
      <ExampleSection
        id="skeleton-text"
        title="Text"
        code={skeletonTextCode}
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <div className="w-full max-w-md space-y-[var(--space-2)]">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add skeleton`}
      </CodeBlock>

      <ExampleSection
        id="skeleton-card"
        title="Card"
        code={skeletonCardCode}
        marginTop="mt-[var(--space-8)]"
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <div className="w-64 space-y-[var(--space-3)]">
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-[var(--space-2)]">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </ExampleSection>

      <h2 id="api-reference">API Reference</h2>
      <div className="mt-[var(--space-4)] border border-[color:var(--color-border-base)] rounded-[var(--radius-lg)] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Component</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Props</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Default</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>Skeleton</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Loading placeholder component (accepts all standard HTML div props)</td>
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
          <h3>Intent</h3>
          <p>
            <code>Skeleton</code> is a component for displaying a placeholder while content is loading. Use it when you need to show loading states that match the shape and size of the content that will appear. Skeletons provide better user experience than blank spaces or spinners by giving users a preview of the content structure.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Loading states for content</li>
            <li>Placeholders for cards or lists</li>
            <li>Text loading indicators</li>
            <li>Image loading placeholders</li>
            <li>Any scenario requiring loading placeholders</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "Skeleton"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>className?</code> – string. Additional CSS classes for sizing and styling (optional)</li>
          </ul>
          <p><strong>Note:</strong> Skeleton accepts all standard HTML div props. Use <code>className</code> to control width, height, and shape to match your content.</p>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Skeleton",
  "props": {
    "className": "h-4 w-[250px]"
  }
}`}</CodeBlock>
          <p className="mt-6"><strong>Card skeleton example:</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "div",
  "props": { "className": "w-64 space-y-3" },
  "children": [
    {
      "type": "component",
      "component": "Skeleton",
      "props": {
        "className": "h-[125px] w-full rounded-xl"
      }
    },
    {
      "type": "component",
      "component": "div",
      "props": { "className": "space-y-2" },
      "children": [
        {
          "type": "component",
          "component": "Skeleton",
          "props": { "className": "h-4 w-full" }
        },
        {
          "type": "component",
          "component": "Skeleton",
          "props": { "className": "h-4 w-3/4" }
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
