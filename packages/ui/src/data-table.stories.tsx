import type { Meta, StoryObj } from "@storybook/react";
import { DataTable } from "./data-table";
import { Edit, Trash2, Copy } from "lucide-react";
import { useState } from "react";

const meta = {
  title: "Core/DataTable",
  component: DataTable,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const generateUsers = (count: number): User[] => {
  const roles = ["Admin", "User", "Editor", "Viewer"];
  const statuses = ["Active", "Inactive", "Pending"];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[i % roles.length],
    status: statuses[i % statuses.length],
  }));
};

export const Default: Story = {
  render: () => {
    const users = generateUsers(10);
    return (
      <div className="w-[800px]">
        <DataTable
          data={users}
          columns={[
            { id: "id", header: "ID", accessor: (row) => row.id },
            { id: "name", header: "Name", accessor: (row) => row.name },
            { id: "email", header: "Email", accessor: (row) => row.email },
            { id: "role", header: "Role", accessor: (row) => row.role },
            { id: "status", header: "Status", accessor: (row) => row.status },
          ]}
        />
      </div>
    );
  },
};

export const WithSelection: Story = {
  render: () => {
    const users = generateUsers(10);
    const [selected, setSelected] = useState<Set<string | number>>(new Set());
    
    return (
      <div className="w-[800px]">
        <div className="mb-4">
          <p className="text-sm text-[color:var(--color-fg-muted)]">
            Selected: {selected.size} row(s)
          </p>
        </div>
        <DataTable
          data={users}
          columns={[
            { id: "id", header: "ID", accessor: (row) => row.id },
            { id: "name", header: "Name", accessor: (row) => row.name },
            { id: "email", header: "Email", accessor: (row) => row.email },
            { id: "role", header: "Role", accessor: (row) => row.role },
            { id: "status", header: "Status", accessor: (row) => row.status },
          ]}
          selectable
          selectedRows={selected}
          onSelectionChange={setSelected}
        />
      </div>
    );
  },
};

export const WithSorting: Story = {
  render: () => {
    const users = generateUsers(10);
    return (
      <div className="w-[800px]">
        <DataTable
          data={users}
          columns={[
            { id: "id", header: "ID", accessor: (row) => row.id, sortable: true },
            { id: "name", header: "Name", accessor: (row) => row.name, sortable: true },
            { id: "email", header: "Email", accessor: (row) => row.email, sortable: true },
            { id: "role", header: "Role", accessor: (row) => row.role, sortable: true },
            { id: "status", header: "Status", accessor: (row) => row.status, sortable: true },
          ]}
          sortable
          defaultSort={{ columnId: "name", direction: "asc" }}
        />
      </div>
    );
  },
};

export const WithFiltering: Story = {
  render: () => {
    const users = generateUsers(20);
    return (
      <div className="w-[800px]">
        <DataTable
          data={users}
          columns={[
            { id: "id", header: "ID", accessor: (row) => row.id },
            { id: "name", header: "Name", accessor: (row) => row.name, filterable: true },
            { id: "email", header: "Email", accessor: (row) => row.email, filterable: true },
            { id: "role", header: "Role", accessor: (row) => row.role, filterable: true },
            { id: "status", header: "Status", accessor: (row) => row.status },
          ]}
          filterable
        />
      </div>
    );
  },
};

export const WithRowActions: Story = {
  render: () => {
    const users = generateUsers(10);
    return (
      <div className="w-[800px]">
        <DataTable
          data={users}
          columns={[
            { id: "id", header: "ID", accessor: (row) => row.id },
            { id: "name", header: "Name", accessor: (row) => row.name },
            { id: "email", header: "Email", accessor: (row) => row.email },
            { id: "role", header: "Role", accessor: (row) => row.role },
            { id: "status", header: "Status", accessor: (row) => row.status },
          ]}
          rowActions={[
            {
              label: "Edit",
              icon: <Edit className="h-4 w-4" />,
              onClick: (row) => console.log("Edit", row),
            },
            {
              label: "Copy",
              icon: <Copy className="h-4 w-4" />,
              onClick: (row) => console.log("Copy", row),
            },
            {
              label: "Delete",
              icon: <Trash2 className="h-4 w-4" />,
              onClick: (row) => console.log("Delete", row),
              disabled: (row) => row.role === "Admin",
            },
          ]}
        />
      </div>
    );
  },
};

export const WithResizing: Story = {
  render: () => {
    const users = generateUsers(10);
    return (
      <div className="w-[800px]">
        <DataTable
          data={users}
          columns={[
            { id: "id", header: "ID", accessor: (row) => row.id, width: 80, resizable: true, minWidth: 50, maxWidth: 150 },
            { id: "name", header: "Name", accessor: (row) => row.name, width: 200, resizable: true, minWidth: 100 },
            { id: "email", header: "Email", accessor: (row) => row.email, width: 250, resizable: true, minWidth: 150 },
            { id: "role", header: "Role", accessor: (row) => row.role, width: 120, resizable: true },
            { id: "status", header: "Status", accessor: (row) => row.status, width: 120, resizable: true },
          ]}
          resizable
        />
      </div>
    );
  },
};

export const FullFeatured: Story = {
  render: () => {
    const users = generateUsers(20);
    const [selected, setSelected] = useState<Set<string | number>>(new Set());
    
    return (
      <div className="w-[900px]">
        <div className="mb-4">
          <p className="text-sm text-[color:var(--color-fg-muted)]">
            Selected: {selected.size} row(s)
          </p>
        </div>
        <DataTable
          data={users}
          columns={[
            { id: "id", header: "ID", accessor: (row) => row.id, sortable: true, width: 80, resizable: true },
            { id: "name", header: "Name", accessor: (row) => row.name, sortable: true, filterable: true, width: 200, resizable: true },
            { id: "email", header: "Email", accessor: (row) => row.email, sortable: true, filterable: true, width: 250, resizable: true },
            { id: "role", header: "Role", accessor: (row) => row.role, sortable: true, filterable: true, width: 120, resizable: true },
            { id: "status", header: "Status", accessor: (row) => row.status, sortable: true, width: 120, resizable: true },
          ]}
          selectable
          selectedRows={selected}
          onSelectionChange={setSelected}
          sortable
          filterable
          resizable
          rowActions={[
            {
              label: "Edit",
              icon: <Edit className="h-4 w-4" />,
              onClick: (row) => console.log("Edit", row),
            },
            {
              label: "Delete",
              icon: <Trash2 className="h-4 w-4" />,
              onClick: (row) => console.log("Delete", row),
            },
          ]}
          onRowClick={(row) => console.log("Row clicked", row)}
        />
      </div>
    );
  },
};

export const Empty: Story = {
  render: () => {
    return (
      <div className="w-[800px]">
        <DataTable
          data={[]}
          columns={[
            { id: "id", header: "ID", accessor: () => "" },
            { id: "name", header: "Name", accessor: () => "" },
            { id: "email", header: "Email", accessor: () => "" },
          ]}
          emptyMessage="No users found"
        />
      </div>
    );
  },
};

