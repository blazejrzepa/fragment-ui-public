import type { Meta, StoryObj } from "@storybook/react";
import { FilterBar } from "./filter-bar";
import { useState } from "react";

const meta: Meta<typeof FilterBar> = {
  title: "Core/FilterBar",
  component: FilterBar,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      element: "#root",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FilterBar>;

const FilterBarWithState = (args: any) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");

  return (
    <FilterBar
      {...args}
      filters={[
        {
          id: "search",
          type: "search",
          placeholder: "Search...",
          value: search,
          onChange: setSearch,
        },
        {
          id: "status",
          type: "select",
          label: "Status",
          options: [
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
            { value: "pending", label: "Pending" },
          ],
          value: status,
          onChange: setStatus,
        },
        {
          id: "date",
          type: "date",
          label: "Date",
          value: date,
          onChange: setDate,
        },
      ]}
      onClear={() => {
        setSearch("");
        setStatus("");
        setDate("");
      }}
    />
  );
};

export const Default: Story = {
  render: FilterBarWithState,
};

export const SearchOnly: Story = {
  args: {
    filters: [
      {
        id: "search",
        type: "search",
        placeholder: "Search projects...",
        value: "",
        onChange: () => {},
      },
    ],
    showClearButton: false,
  },
};

export const MultipleFilters: Story = {
  render: FilterBarWithState,
};

export const WithoutClearButton: Story = {
  args: {
    filters: [
      {
        id: "search",
        type: "search",
        placeholder: "Search...",
        value: "",
        onChange: () => {},
      },
      {
        id: "status",
        type: "select",
        label: "Status",
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ],
        value: "",
        onChange: () => {},
      },
    ],
    showClearButton: false,
  },
};

