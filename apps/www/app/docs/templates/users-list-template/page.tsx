"use client";

import { UsersListTemplate } from "@fragment_ui/blocks";
import { DocLayout } from "../../../../src/components/doc-layout";
import { CodeBlock } from "@fragment_ui/ui";
import { StabilityBadge } from "@fragment_ui/ui";
import { useState } from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@fragment_ui/ui";
import { Plus, Download, Trash2 } from "lucide-react";

export default function UsersListTemplatePage() {
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    status: "",
    role: "",
  });
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const sampleUsers = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: ["Admin", "User", "Editor"][i % 3],
    status: ["Active", "Inactive", "Pending"][i % 3],
  }));

  const totalPages = Math.ceil(sampleUsers.length / pageSize);

  return (
    <DocLayout>
      <div className="flex items-center gap-4 mb-4">
        <h1 id="users-list-template" className="text-3xl font-medium">UsersListTemplate</h1>
        <StabilityBadge stability="stable" />
      </div>
      <p 
        className="mb-6 text-[color:var(--foreground-secondary)] font-normal"
        style={{
          fontFamily: "Geist, sans-serif",
          fontSize: "var(--typography-size-md)",
          fontStyle: "normal",
          lineHeight: "160%",
          color: "var(--foreground-secondary)",
        }}
      >
        Complete users list page template with table, search, filters, pagination, and actions.
        A full-screen template for displaying and managing lists of data with comprehensive controls.
      </p>
      
      <h2 id="overview">Overview</h2>
      <p>
        UsersListTemplate is a ready-to-use template that combines AppShell, DataTableToolbar,
        DataTable, and PaginationFooter into a complete users list page. It includes sidebar
        navigation, header, search, filters, table with selection, and pagination.
      </p>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">npx shadcn@latest add /r/users-list-template.json</CodeBlock>
      
      <h2 id="examples">Examples</h2>
      <div className="space-y-6 my-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Complete Users List Template</h3>
          <div className="border rounded-lg overflow-hidden">
            <UsersListTemplate
              sidebarHeader={<div className="text-lg font-semibold">Dashboard</div>}
              sidebar={
                <SidebarGroup>
                  <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton>Users</SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              }
              headerLinks={[
                { label: "Overview", href: "/" },
                { label: "Users", href: "/users" },
              ]}
              data={sampleUsers}
              columns={[
                { id: "name", header: "Name", accessor: (row) => row.name, sortable: true },
                { id: "email", header: "Email", accessor: (row) => row.email, sortable: true },
                { id: "role", header: "Role", accessor: (row) => row.role, sortable: true },
                { id: "status", header: "Status", accessor: (row) => row.status, sortable: true },
              ]}
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
                {
                  id: "role",
                  label: "Role",
                  type: "select",
                  options: [
                    { value: "admin", label: "Admin" },
                    { value: "user", label: "User" },
                  ],
                },
              ]}
              filterValues={filterValues}
              onFilterChange={setFilterValues}
              primaryActions={[
                {
                  id: "add",
                  label: "Add User",
                  icon: <Plus className="h-4 w-4" />,
                  onClick: () => alert("Add user"),
                },
              ]}
              secondaryActions={[
                {
                  id: "export",
                  label: "Export",
                  icon: <Download className="h-4 w-4" />,
                  onClick: () => alert("Export"),
                },
                {
                  id: "bulk-delete",
                  label: "Delete Selected",
                  icon: <Trash2 className="h-4 w-4" />,
                  onClick: () => alert("Delete selected"),
                },
              ]}
              selectedRows={selectedRows}
              onSelectionChange={setSelectedRows}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={sampleUsers.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        </div>
      </div>
      
      <h2 id="code-examples">Code Examples</h2>
      <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { UsersListTemplate } from "@fragment_ui/blocks";
import { useState } from "react";
import { Plus } from "lucide-react";

function UsersPage() {
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const users = [...]; // Your data
  const totalPages = Math.ceil(users.length / pageSize);

  return (
    <UsersListTemplate
      sidebar={<NavigationMenu />}
      data={users}
      columns={[
        { id: "name", header: "Name", accessor: (row) => row.name },
        { id: "email", header: "Email", accessor: (row) => row.email },
      ]}
      search={search}
      onSearchChange={setSearch}
      primaryActions={[
        {
          id: "add",
          label: "Add User",
          icon: <Plus className="h-4 w-4" />,
          onClick: () => handleAdd(),
        },
      ]}
      selectedRows={selectedRows}
      onSelectionChange={setSelectedRows}
      currentPage={currentPage}
      totalPages={totalPages}
      pageSize={pageSize}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
    />
  );
}`}</CodeBlock>
      
      <h2 id="props">Props</h2>
      <ul>
        <li><code>sidebar</code> - Sidebar navigation content (optional)</li>
        <li><code>sidebarHeader</code> - Sidebar header (optional)</li>
        <li><code>sidebarFooter</code> - Sidebar footer (optional)</li>
        <li><code>headerLinks</code> - Header navigation links (optional)</li>
        <li><code>data</code> - Table data array (required)</li>
        <li><code>columns</code> - Table columns configuration (required)</li>
        <li><code>search</code> - Search value (optional)</li>
        <li><code>onSearchChange</code> - Search change handler (optional)</li>
        <li><code>filters</code> - Filters configuration (optional)</li>
        <li><code>filterValues</code> - Current filter values (optional)</li>
        <li><code>onFilterChange</code> - Filter change handler (optional)</li>
        <li><code>primaryActions</code> - Primary action buttons (optional)</li>
        <li><code>secondaryActions</code> - Secondary action buttons (optional)</li>
        <li><code>selectedRows</code> - Selected rows (optional)</li>
        <li><code>onSelectionChange</code> - Selection change handler (optional)</li>
        <li><code>currentPage</code> - Current page (default: 1)</li>
        <li><code>totalPages</code> - Total pages (optional)</li>
        <li><code>totalItems</code> - Total items (optional)</li>
        <li><code>pageSize</code> - Items per page (default: 10)</li>
        <li><code>onPageChange</code> - Page change handler (optional)</li>
        <li><code>onPageSizeChange</code> - Page size change handler (optional)</li>
        <li><code>onRowClick</code> - Row click handler (optional)</li>
        <li><code>emptyMessage</code> - Empty state message (default: "No users found")</li>
      </ul>
      
      <h2 id="features">Features</h2>
      <ul>
        <li>Complete page layout with AppShell</li>
        <li>Search and filter functionality</li>
        <li>Table with selection support</li>
        <li>Pagination controls</li>
        <li>Primary and secondary actions</li>
        <li>Empty state handling</li>
        <li>Fully accessible</li>
      </ul>
      
      <h2 id="related-blocks">Related Blocks</h2>
      <ul>
        <li><a href="/docs/components/app-shell">AppShell</a> - Base shell component</li>
        <li><a href="/docs/components/data-table-toolbar">DataTableToolbar</a> - Toolbar component</li>
        <li><a href="/docs/components/pagination-footer">PaginationFooter</a> - Pagination component</li>
        <li><a href="/docs/components/data-table">DataTable</a> - Table component</li>
      </ul>
      
      <h2 id="accessibility">Accessibility</h2>
      <p>
        UsersListTemplate inherits accessibility from all its component parts.
        All controls are keyboard accessible and follow ARIA best practices.
      </p>

    </DocLayout>
  );
}

