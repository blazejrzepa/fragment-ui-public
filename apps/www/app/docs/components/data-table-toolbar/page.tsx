"use client";

import { DataTableToolbar } from "@fragment_ui/blocks";
import { CodeBlock, DocumentContent } from "@fragment_ui/ui";
import { useState } from "react";
import { Plus, Download, Trash2 } from "lucide-react";

export default function DataTableToolbarPage() {
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    status: "",
    role: "",
  });

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium" id="page">DataTableToolbar</h1>
      </div>
      <p className="mb-6 intro-text">
        Search, filters, columns, and actions for tables.
      </p>
      
      <h2 id="overview">Overview</h2>
      <p>
        DataTableToolbar is a composable block that provides a complete toolbar interface
        for data tables. It includes search input, filter controls, primary and secondary
        actions, and bulk action support. Perfect for enterprise data management interfaces.
      </p>
      
      
      {/* Basic Toolbar with Search */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[10rem] p-10">
          <div className="w-full max-w-4xl border rounded-lg p-4">
            <DataTableToolbar
              search={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search users..."
            />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { DataTableToolbar } from "@fragment_ui/blocks";
import { useState } from "react";

const [search, setSearch] = useState("");

<DataTableToolbar
  search={search}
  onSearchChange={setSearch}
  searchPlaceholder="Search users..."
/>`}</CodeBlock>
        </div>
      </div>
      
      <div className="space-y-6 my-6">

        <div>
          <h3 className="text-lg font-semibold mb-2">Toolbar with Filters</h3>
          <div className="border rounded-lg p-4">
            <DataTableToolbar
              search={search}
              onSearchChange={setSearch}
              filters={[
                {
                  id: "status",
                  label: "Status",
                  type: "select",
                  options: [
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                    { value: "pending", label: "Pending" },
                  ],
                },
                {
                  id: "role",
                  label: "Role",
                  type: "select",
                  options: [
                    { value: "admin", label: "Admin" },
                    { value: "user", label: "User" },
                    { value: "editor", label: "Editor" },
                  ],
                },
              ]}
              filterValues={filterValues}
              onFilterChange={setFilterValues}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Toolbar with Actions</h3>
          <div className="border rounded-lg p-4">
            <DataTableToolbar
              search={search}
              onSearchChange={setSearch}
              primaryActions={[
                {
                  id: "add",
                  label: "Add User",
                  onClick: () => alert("Add user"),
                },
              ]}
              secondaryActions={[
                {
                  id: "export",
                  label: "Export",
                  onClick: () => alert("Export"),
                },
                {
                  id: "bulk-delete",
                  label: "Delete Selected",
                  onClick: () => alert("Delete selected"),
                },
              ]}
              selectedCount={3}
            />
          </div>
        </div>
      </div>
      
      
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">npx shadcn@latest add /r/data-table-toolbar.json</CodeBlock>
      <h2 id="code-examples">Code Examples</h2>
      <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { DataTableToolbar } from "@fragment_ui/blocks";
import { useState } from "react";
import { Plus, Download } from "lucide-react";

function UsersTable() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: "", role: "" });

  return (
    <DataTableToolbar
      search={search}
      onSearchChange={setSearch}
      filters={[
        {
          id: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ],
        },
      ]}
      filterValues={filters}
      onFilterChange={setFilters}
      primaryActions={[
        {
          id: "add",
          label: "Add User",
          onClick: () => handleAdd(),
        },
      ]}
      secondaryActions={[
        {
          id: "export",
          label: "Export",
          onClick: () => handleExport(),
        },
      ]}
      selectedCount={selectedRows.size}
  );
}`}</CodeBlock>
      
      <h2 id="props">Props</h2>
      <ul>
        <li><code>search</code> - Search value (optional)</li>
        <li><code>searchPlaceholder</code> - Search placeholder text (default: "Search...")</li>
        <li><code>onSearchChange</code> - Search change handler (optional)</li>
        <li><code>filters</code> - Filters configuration array (optional)</li>
        <li><code>filterValues</code> - Current filter values (optional)</li>
        <li><code>onFilterChange</code> - Filter change handler (optional)</li>
        <li><code>primaryActions</code> - Primary action buttons (optional)</li>
        <li><code>secondaryActions</code> - Secondary action buttons (optional)</li>
        <li><code>selectedCount</code> - Number of selected items for bulk actions (optional)</li>
        <li><code>showClearFilters</code> - Show clear filters button (default: true)</li>
        <li><code>className</code> - Additional className (optional)</li>
      </ul>
      
      <h2 id="features">Features</h2>
      <ul>
        <li>Search input with icon</li>
        <li>Multiple filter types (select, text, date)</li>
        <li>Primary and secondary action buttons</li>
        <li>Bulk action support with selected count</li>
        <li>Clear filters functionality</li>
        <li>Responsive layout</li>
        <li>Fully accessible</li>
      </ul>
      
      <h2 id="related-blocks">Related Blocks</h2>
      <ul>
        <li><a href="/docs/components/pagination-footer">PaginationFooter</a> - Use together for complete table controls</li>
        <li><a href="/docs/templates/users-list-template">UsersListTemplate</a> - Complete template using DataTableToolbar</li>
        <li><a href="/docs/components/data-table">DataTable</a> - Table component to use with toolbar</li>
      </ul>
      
      <h2 id="accessibility">Accessibility</h2>
      <p>
        DataTableToolbar uses semantic HTML and proper form controls. All inputs are keyboard
        accessible and include proper labels. Action buttons have appropriate ARIA labels.
      </p>

    </DocumentContent>
  );
}

