"use client";

import { DocumentContent, CodeBlock, DataTable } from "@fragment_ui/ui";

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
      <h1 className="text-3xl font-medium mb-4" id="page">
        Table
      </h1>
      <p className="mb-6 intro-text">Display tabular data with sorting and actions.</p>
      
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[200px] p-10">
          <div className="w-full max-w-4xl">
            <DataTable columns={sampleColumns} data={sampleRows} />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { DataTable } from "@fragment_ui/ui";

const columns = [
                { id: "name", header: "Name", accessor: (row) => row.name },
                { id: "email", header: "Email", accessor: (row) => row.email },
                { id: "role", header: "Role", accessor: (row) => row.role },
];

const rows = [
  { id: "1", name: "Alice", email: "alice@example.com", role: "Admin" },
  { id: "2", name: "Bob", email: "bob@example.com", role: "Editor" },
];

<DataTable columns={columns} data={rows} />`}
          </CodeBlock>
        </div>
      </div>
    </DocumentContent>
  );
}

