"use client";

import { Pagination, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent, CodeBlock, Badge } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";
import { useState } from "react";

const paginationCode = `import { Pagination } from "@fragment_ui/ui";
import { useState } from "react";

export function PaginationDemo() {
  const [page, setPage] = useState(1);
  
  return (
    <div className="flex flex-col gap-[var(--space-8)] items-center">
      <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
      <Pagination currentPage={5} totalPages={20} onPageChange={setPage} />
    </div>
  );
}`;

export default function PaginationPage() {
  const [page, setPage] = useState(1);

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="pagination">Pagination</h1>
        <Badge variant="subtle" size="md">Custom</Badge>
      </div>
      <p className="mb-6 intro-text">Navigate between pages of long lists.</p>
      
      <ExampleSection
        id="pagination-example"
        title="Example"
        code={paginationCode}
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <div className="flex flex-col gap-[var(--space-8)] items-center w-full">
            <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
            <Pagination currentPage={5} totalPages={20} onPageChange={setPage} />
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
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>Pagination</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>currentPage, totalPages, onPageChange, showFirstLast?, maxVisible?, className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Pagination component for navigating through pages</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add pagination`}
      </CodeBlock>

      <Collapsible className="mt-[var(--space-8)]">
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation" className="m-0">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-[var(--space-4)]">
          <h3>Intent</h3>
          <p>
            <code>Pagination</code> is a component for navigating through pages of results. Use it when you need to allow users to navigate through large datasets, search results, or any content that is divided into multiple pages. The component provides page numbers, previous/next buttons, and optional first/last buttons for efficient navigation.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Search results and filtered content</li>
            <li>Data tables with multiple pages</li>
            <li>Content lists that exceed a single page</li>
            <li>Any paginated dataset or collection</li>
            <li>Navigation through sequential content</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "Pagination"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>currentPage</code> – number. Current active page number (required)</li>
            <li><code>totalPages</code> – number. Total number of pages (required)</li>
            <li><code>onPageChange</code> – function. Callback when page changes: <code>(page: number) {'=>'} void</code> (required)</li>
            <li><code>showFirstLast?</code> – boolean (default: true). Show first/last page buttons (optional)</li>
            <li><code>maxVisible?</code> – number (default: 5). Maximum number of visible page buttons (optional)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Pagination",
  "props": {
    "currentPage": 1,
    "totalPages": 10,
    "onPageChange": "handlePageChange",
    "showFirstLast": true,
    "maxVisible": 5
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
