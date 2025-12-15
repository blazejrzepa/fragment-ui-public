import type { Meta, StoryObj } from "@storybook/react";
import { VirtualTable } from "./virtual-table";

const meta = {
  title: "Core/VirtualTable",
  component: VirtualTable,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof VirtualTable<Record<string, any>>>;

export default meta;
type Story = StoryObj<typeof meta>;

// Generate large dataset
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
    const users = generateUsers(1000);
    return (
      <div className="w-[800px]">
        <VirtualTable
          data={users}
          columns={[
            {
              id: "id",
              header: "ID",
              accessor: (row) => row.id,
              width: 80,
            },
            {
              id: "name",
              header: "Name",
              accessor: (row) => row.name,
            },
            {
              id: "email",
              header: "Email",
              accessor: (row) => row.email,
            },
            {
              id: "role",
              header: "Role",
              accessor: (row) => row.role,
            },
            {
              id: "status",
              header: "Status",
              accessor: (row) => (
                <span className={row.status === "Active" ? "text-green-500" : ""}>
                  {row.status}
                </span>
              ),
            },
          ]}
          containerHeight={400}
          rowHeight={48}
        />
      </div>
    );
  },
};

export const WithRowClick: Story = {
  render: () => {
    const users = generateUsers(500);
    return (
      <div className="w-[800px]">
        <VirtualTable
          data={users}
          columns={[
            {
              id: "id",
              header: "ID",
              accessor: (row) => row.id,
              width: 80,
            },
            {
              id: "name",
              header: "Name",
              accessor: (row) => row.name,
            },
            {
              id: "email",
              header: "Email",
              accessor: (row) => row.email,
            },
          ]}
          containerHeight={400}
          rowHeight={48}
          onRowClick={(row) => {
            alert(`Clicked on user: ${row.name}`);
          }}
        />
      </div>
    );
  },
};

export const LargeDataset: Story = {
  render: () => {
    // Use smaller dataset for Chromatic to avoid rendering issues
    // Virtual scrolling still works with smaller datasets
    const users = generateUsers(1000);
    return (
      <div className="w-[900px]">
        <div className="mb-4 text-sm text-[color:var(--color-fg-muted)]">
          Rendering 1,000 rows with virtual scrolling (virtual scrolling supports thousands more)
        </div>
        <VirtualTable
          data={users}
          columns={[
            {
              id: "id",
              header: "ID",
              accessor: (row) => row.id,
              width: 80,
            },
            {
              id: "name",
              header: "Name",
              accessor: (row) => row.name,
            },
            {
              id: "email",
              header: "Email",
              accessor: (row) => row.email,
            },
            {
              id: "role",
              header: "Role",
              accessor: (row) => row.role,
            },
            {
              id: "status",
              header: "Status",
              accessor: (row) => row.status,
            },
          ]}
          containerHeight={500}
          rowHeight={48}
        />
      </div>
    );
  },
};

export const Empty: Story = {
  render: () => {
    return (
      <div className="w-[800px]">
        <VirtualTable
          data={[]}
          columns={[
            {
              id: "id",
              header: "ID",
              accessor: () => null,
            },
            {
              id: "name",
              header: "Name",
              accessor: () => null,
            },
          ]}
          containerHeight={400}
          emptyMessage="No users found"
        />
      </div>
    );
  },
};

