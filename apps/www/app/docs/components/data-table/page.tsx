"use client";

import { DocumentContent } from "@fragment_ui/ui";

import { DataTable } from "@fragment_ui/blocks";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";

export default function DataTablePage() {
  const sampleData = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User" },
    { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Admin" },
    { id: 5, name: "Charlie Wilson", email: "charlie@example.com", role: "User" },
  ];

  const columns = [
    {
      id: "name",
      header: "Name",
      accessor: (row: typeof sampleData[0]) => row.name,
      sortable: true,
    },
    {
      id: "email",
      header: "Email",
      accessor: (row: typeof sampleData[0]) => row.email,
      sortable: true,
    },
    {
      id: "role",
      header: "Role",
      accessor: (row: typeof sampleData[0]) => row.role,
      sortable: true,
    },
  ];

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="data-table" className="text-3xl font-medium mb-4">Data Table</h1>
      </div>
      <p className="mb-6 intro-text">
        A complete table setup for data-heavy screens.
      </p>
      
      <div className="space-y-4 my-6">
        <div>
          <h3 id="default-data-table" className="text-lg font-semibold mb-2">Default Data Table</h3>
          <DataTable
            data={sampleData}
            columns={columns}
            pageSize={5}
            searchable={true}
          />
        </div>
      </div>

      <h2 id="code-examples">Code Examples</h2>
      <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto">
        <code>{`import { DataTable } from "@fragment_ui/blocks";

const data = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
];

const columns = [
  {
    id: "name",
    header: "Name",
    accessor: (row) => row.name,
    sortable: true,
  },
  {
    id: "email",
    header: "Email",
    accessor: (row) => row.email,
    sortable: true,
  },
];

<DataTable
  data={data}
  columns={columns}
  pageSize={10}
  searchable={true}
  searchPlaceholder="Search users..."
  onRowClick={(row) => console.log(row)}
/>`}</code>
      </pre>

      <h2 id="props">Props</h2>
      <ul>
        <li>
          <code>data</code> - Array of data objects (required)
        </li>
        <li>
          <code>columns</code> - Array of column definitions with id, header,
          accessor, and optional sortable (required)
        </li>
        <li>
          <code>pageSize</code> - Number of items per page (default: 10)
        </li>
        <li>
          <code>searchable</code> - Enable search functionality (default: true)
        </li>
        <li>
          <code>searchPlaceholder</code> - Search input placeholder (default:
          "Search...")
        </li>
        <li>
          <code>onRowClick</code> - Callback when row is clicked (optional)
        </li>
        <li>
          <code>className</code> - Additional CSS classes
        </li>
      </ul>

      <h2 id="features">Features</h2>
      <ul>
        <li>Sortable columns</li>
        <li>Search/filter functionality</li>
        <li>Pagination with page info</li>
        <li>Clickable rows</li>
        <li>Responsive design</li>
        <li>Empty state handling</li>
        <li>Fully accessible</li>
      </ul>

      
      
      <h2 id="install">Install</h2>
      <pre>
        <code>npx shadcn@latest add /r/data-table.json</code>
      </pre>
      <h2 id="accessibility">Accessibility</h2>
      <p>
        Data table includes proper ARIA attributes, keyboard navigation for
        sorting, and is fully accessible for screen readers. Compliant with
        WCAG 2.1.
      </p>

      


    </DocumentContent>
  );
}

