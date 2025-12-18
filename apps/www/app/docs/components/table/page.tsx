"use client";

import { DocumentContent, CodeBlock, DataTable, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";

const tableCode = `import { DataTable } from "@fragment_ui/ui";

const columns = [
  { id: "name", header: "Name", accessor: (row) => row.name },
  { id: "email", header: "Email", accessor: (row) => row.email },
  { id: "role", header: "Role", accessor: (row) => row.role },
];

const rows = [
  { id: "1", name: "Alice", email: "alice@example.com", role: "Admin" },
  { id: "2", name: "Bob", email: "bob@example.com", role: "Editor" },
  { id: "3", name: "Charlie", email: "charlie@example.com", role: "Viewer" },
];

<DataTable columns={columns} data={rows} />`;

const sampleColumns = [
  { id: "name", header: "Name", accessor: (row: typeof sampleRows[number]) => row.name },
  { id: "email", header: "Email", accessor: (row: typeof sampleRows[number]) => row.email },
  { id: "role", header: "Role", accessor: (row: typeof sampleRows[number]) => row.role },
];

const sampleRows = [
  { id: "1", name: "Alice", email: "alice@example.com", role: "Admin" },
  { id: "2", name: "Bob", email: "bob@example.com", role: "Editor" },
  { id: "3", name: "Charlie", email: "charlie@example.com", role: "Viewer" },
];

export default function TablePage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="table">Table</h1>
      </div>
      <p className="mb-6 intro-text">Display structured data in rows and columns.</p>
      
      <ExampleSection
        id="table-example"
        title="Example"
        code={tableCode}
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="w-full max-w-4xl">
            <DataTable columns={sampleColumns} data={sampleRows} />
          </div>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add table`}
      </CodeBlock>

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
              <td className="py-2 px-4"><code>DataTable</code></td>
              <td className="py-2 px-4"><code>columns, data, sortable?, onSortChange?, selectable?, selectedRows?, onSelectionChange?, filterable?, filters?, onFilterChange?, resizable?, rowActions?, onRowClick?, emptyMessage?, className?, headerClassName?, rowClassName?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Data table component with sorting, filtering, selection, and row actions</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>DataTableColumn</code></td>
              <td className="py-2 px-4"><code>id, header, accessor, sortable?, filterable?, resizable?, width?, minWidth?, maxWidth?, className?, headerClassName?, cellClassName?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Column definition interface</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>RowAction</code></td>
              <td className="py-2 px-4"><code>label, onClick, disabled?, icon?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Row action definition interface</td>
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
            <code>DataTable</code> is a component for displaying tabular data with sorting and actions. Use it when you need to present structured data in rows and columns, with support for sorting, filtering, and row actions. The component provides a clean, accessible interface for data presentation.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Data dashboards</li>
            <li>Admin panels</li>
            <li>User lists or directories</li>
            <li>Reports and analytics</li>
            <li>Any scenario requiring tabular data display</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "DataTable"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>columns</code> – array. Array of column definitions (required)</li>
            <li><code>data</code> – array. Array of row data objects (required)</li>
            <li><code>sortable?</code> – boolean. Enable column sorting (optional, default: false)</li>
            <li><code>defaultSort?</code> – object. Default sort configuration: <code>{'{'} columnId: string, direction: "asc" | "desc" | null {'}'}</code> (optional)</li>
            <li><code>onSortChange?</code> – function. Callback when sorting changes: <code>(columnId: string | null, direction: "asc" | "desc" | null) {'=>'} void</code> (optional)</li>
            <li><code>selectable?</code> – boolean. Enable row selection (optional, default: false)</li>
            <li><code>selectedRows?</code> – Set. Controlled selected rows (optional)</li>
            <li><code>onSelectionChange?</code> – function. Callback when selection changes: <code>(selected: Set&lt;string | number&gt;) {'=>'} void</code> (optional)</li>
            <li><code>filterable?</code> – boolean. Enable column filtering (optional, default: false)</li>
            <li><code>filters?</code> – object. Controlled filters (optional)</li>
            <li><code>onFilterChange?</code> – function. Callback when filters change: <code>(filters: Record&lt;string, string&gt;) {'=>'} void</code> (optional)</li>
            <li><code>resizable?</code> – boolean. Enable column resizing (optional, default: false)</li>
            <li><code>rowActions?</code> – array. Array of row action definitions (optional)</li>
            <li><code>onRowClick?</code> – function. Callback when row is clicked: <code>(row: T, index: number) {'=>'} void</code> (optional)</li>
            <li><code>emptyMessage?</code> – string. Message to display when table is empty (optional, default: "No data available")</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
            <li><code>headerClassName?</code> – string. Additional CSS classes for header (optional)</li>
            <li><code>rowClassName?</code> – string | function. Additional CSS classes for rows (optional)</li>
          </ul>
          <p><strong>Note:</strong> Each column should have <code>id</code>, <code>header</code>, and <code>accessor</code> function. Each row should have a unique <code>id</code>.</p>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "DataTable",
  "props": {
    "columns": [
      {
        "id": "name",
        "header": "Name",
        "accessor": "row => row.name"
      },
      {
        "id": "email",
        "header": "Email",
        "accessor": "row => row.email"
      },
      {
        "id": "role",
        "header": "Role",
        "accessor": "row => row.role"
      }
    ],
    "data": [
      {
        "id": "1",
        "name": "Alice",
        "email": "alice@example.com",
        "role": "Admin"
      },
      {
        "id": "2",
        "name": "Bob",
        "email": "bob@example.com",
        "role": "Editor"
      }
    ],
    "sortable": true
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
