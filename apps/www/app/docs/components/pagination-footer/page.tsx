"use client";

import { PaginationFooter } from "@fragment_ui/blocks";
import { CodeBlock, DocumentContent } from "@fragment_ui/ui";
import { useState } from "react";

export default function PaginationFooterPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium" id="page">
          PaginationFooter
        </h1>
      </div>
      <p className="mb-6 intro-text">Pagination controls placed at the bottom.</p>
      
      <h2 id="overview">Overview</h2>
      <p>
        PaginationFooter is a composable block that provides pagination controls for data tables. It includes
        first/previous/next/last buttons, page number display, page size selector, and item count information. Perfect
        for enterprise data management interfaces.
      </p>
      
      {/* Basic Pagination */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[10rem] p-10">
          <div className="w-full max-w-4xl border rounded-lg p-4">
            <PaginationFooter
              currentPage={currentPage}
              totalPages={10}
              totalItems={100}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { PaginationFooter } from "@fragment_ui/blocks";
import { useState } from "react";

const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
const totalItems = 100;
const totalPages = Math.ceil(totalItems / pageSize);

<PaginationFooter
  currentPage={currentPage}
  totalPages={totalPages}
  totalItems={totalItems}
  pageSize={pageSize}
  onPageChange={setCurrentPage}
  onPageSizeChange={setPageSize}
/>`}
          </CodeBlock>
        </div>
      </div>
      
      <div className="space-y-6 my-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Without Page Size Selector</h3>
          <div className="border rounded-lg p-4">
            <PaginationFooter
              currentPage={2}
              totalPages={5}
              totalItems={50}
              pageSize={10}
              onPageChange={setCurrentPage}
              showPageSizeSelector={false}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Without Item Count</h3>
          <div className="border rounded-lg p-4">
            <PaginationFooter
              currentPage={3}
              totalPages={8}
              pageSize={20}
              onPageChange={setCurrentPage}
              showItemCount={false}
            />
          </div>
        </div>
      </div>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">
        npx shadcn@latest add /r/pagination-footer.json
      </CodeBlock>
      <h2 id="code-examples">Code Examples</h2>
      <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
        {`import { PaginationFooter } from "@fragment_ui/blocks";
import { useState } from "react";

function DataTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalItems = 100;
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <PaginationFooter
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      pageSize={pageSize}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
      pageSizeOptions={[10, 20, 50, 100]}
    />
  );
}`}
      </CodeBlock>
      
      <h2 id="props">Props</h2>
      <ul>
        <li>
          <code>currentPage</code> - Current page number (1-based, required)
        </li>
        <li>
          <code>totalPages</code> - Total number of pages (required)
        </li>
        <li>
          <code>totalItems</code> - Total number of items (optional)
        </li>
        <li>
          <code>pageSize</code> - Items per page (required)
        </li>
        <li>
          <code>pageSizeOptions</code> - Available page sizes (default: [10, 20, 50, 100])
        </li>
        <li>
          <code>onPageChange</code> - Page change handler (required)
        </li>
        <li>
          <code>onPageSizeChange</code> - Page size change handler (optional)
        </li>
        <li>
          <code>showPageSizeSelector</code> - Show page size selector (default: true)
        </li>
        <li>
          <code>showItemCount</code> - Show item count info (default: true)
        </li>
        <li>
          <code>className</code> - Additional className (optional)
        </li>
      </ul>
      
      <h2 id="features">Features</h2>
      <ul>
        <li>First/Previous/Next/Last navigation buttons</li>
        <li>Page number display</li>
        <li>Page size selector</li>
        <li>Item count information</li>
        <li>Disabled states for boundary pages</li>
        <li>Responsive layout</li>
        <li>Fully accessible with ARIA labels</li>
      </ul>
      
      <h2 id="related-blocks">Related Blocks</h2>
      <ul>
        <li>
          <a href="/docs/components/data-table-toolbar">DataTableToolbar</a> - Use together for complete table controls
        </li>
        <li>
          <a href="/docs/templates/users-list-template">UsersListTemplate</a> - Complete template using PaginationFooter
        </li>
        <li>
          <a href="/docs/components/data-table">DataTable</a> - Table component to use with pagination
        </li>
      </ul>
      
      <h2 id="accessibility">Accessibility</h2>
      <p>
        PaginationFooter uses semantic HTML and proper ARIA labels for all navigation buttons. All controls are keyboard
        accessible and support focus states.
      </p>
    </DocumentContent>
  );
}

