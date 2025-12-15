"use client";

import { Pagination, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";
import { useState } from "react";

export default function PaginationPage() {
  const [page, setPage] = useState(1);

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">
          Pagination
        </h1>
      </div>
      <p className="mb-6 intro-text">Navigate through pages of results.</p>
      
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="flex flex-col gap-8 items-center">
            <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
            <Pagination currentPage={5} totalPages={20} onPageChange={setPage} />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { Pagination } from "@fragment_ui/ui";
import { useState } from "react";

const [page, setPage] = useState(1);

<Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
<Pagination currentPage={5} totalPages={20} onPageChange={setPage} />`}
          </CodeBlock>
        </div>
      </div>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">
        {`npx shadcn@latest add https://fragmentui.com/r/pagination.json`}
      </CodeBlock>

      <Collapsible>
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <p><strong>Intent</strong></p>
          <p>
            <code>Pagination</code> is a component for navigating through pages of results.<br />
            Use it when you need to allow users to navigate through large datasets, search results, or any content that is divided into multiple pages. The component provides page numbers, previous/next buttons, and optional first/last buttons for efficient navigation.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Search results and filtered content</li>
            <li>Data tables with multiple pages</li>
            <li>Content lists that exceed a single page</li>
            <li>Any paginated dataset or collection</li>
            <li>Navigation through sequential content</li>
          </ul>

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Pagination"</code>.
          </p>
          <p>Props:</p>
          <ul>
            <li><code>currentPage</code> – current active page number (required)</li>
            <li><code>totalPages</code> – total number of pages (required)</li>
            <li><code>onPageChange</code> – callback function when page changes, receives new page number (required)</li>
            <li><code>showFirstLast?</code> – show first/last page buttons (optional, default: <code>true</code>)</li>
            <li><code>maxVisible?</code> – maximum number of visible page buttons (optional, default: <code>5</code>)</li>
            <li><code>className?</code> – additional CSS classes (optional)</li>
          </ul>

          <p><strong>Example</strong></p>
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

      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/core-pagination--docs">Storybook</StorybookLink>
        </li>
      </ul>
    </DocumentContent>
  );
}


