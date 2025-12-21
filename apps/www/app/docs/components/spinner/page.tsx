"use client";

import { Spinner, DocumentContent, CodeBlock, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";

const spinnerSizesCode = `import { Spinner } from "@fragment_ui/ui";

export function SpinnerSizesDemo() {
  return (
    <div className="flex gap-[var(--space-4)] items-center">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  );
}`;

export default function SpinnerPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-[var(--space-4)] mb-[var(--space-1)]">
        <h1 id="spinner">Spinner</h1>
      </div>
      <p className="mb-[var(--space-6)] intro-text">Indicate that something is loading.</p>
      
      <ExampleSection
        id="spinner-sizes"
        title="Sizes"
        code={spinnerSizesCode}
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <div className="flex gap-[var(--space-4)] items-center justify-center w-full">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </div>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add spinner`}
      </CodeBlock>

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
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>Spinner</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>size?, className?, children?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Loading spinner component (accepts all standard HTML div props)</td>
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
            <code>Spinner</code> is a component for indicating loading in progress. Use it when you need to show that an operation is in progress or content is being loaded. The component provides visual feedback with a smooth animation and is accessible for screen readers.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Loading states for async operations</li>
            <li>Content loading indicators</li>
            <li>Form submission feedback</li>
            <li>Data fetching states</li>
            <li>Any scenario requiring loading indication</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "Spinner"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>size?</code> – "sm" | "md" | "lg" (default: "md"). Size of the spinner (optional)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
            <li><code>children?</code> – ReactNode. Custom content to spin (optional)</li>
          </ul>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Spinner",
  "props": {
    "size": "md"
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
