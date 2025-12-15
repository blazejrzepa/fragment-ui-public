import type { Meta, StoryObj } from "@storybook/react";
import { DataTable } from "@fragment_ui/blocks";

const meta: Meta<typeof DataTable> = {
  title: "Blocks/DataTable",
  component: DataTable,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof DataTable>;

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

export const Default: Story = {
  args: {
    data: sampleData,
    columns,
  },
};

export const WithSearch: Story = {
  args: {
    data: sampleData,
    columns,
    searchable: true,
    searchPlaceholder: "Search users...",
  },
};

export const WithCustomPageSize: Story = {
  args: {
    data: sampleData,
    columns,
    pageSize: 3,
  },
};

export const WithoutSearch: Story = {
  args: {
    data: sampleData,
    columns,
    searchable: false,
  },
};

