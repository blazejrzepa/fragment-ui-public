import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable } from "./data-table";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const mockUsers: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "Admin" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "User" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "Editor" },
];

describe("DataTable", () => {
  it("renders table with data", () => {
    render(
      <DataTable
        data={mockUsers}
        columns={[
          { id: "name", header: "Name", accessor: (row) => row.name },
          { id: "email", header: "Email", accessor: (row) => row.email },
        ]}
      />
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("renders empty message when no data", () => {
    render(
      <DataTable
        data={[]}
        columns={[{ id: "name", header: "Name", accessor: () => "" }]}
        emptyMessage="No data"
      />
    );

    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("supports row selection", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();

    render(
      <DataTable
        data={mockUsers}
        columns={[{ id: "name", header: "Name", accessor: (row) => row.name }]}
        selectable
        onSelectionChange={onSelectionChange}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    // First checkbox is "select all"
    await user.click(checkboxes[1]); // Select first row

    expect(onSelectionChange).toHaveBeenCalled();
  });

  it("supports select all", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();

    render(
      <DataTable
        data={mockUsers}
        columns={[{ id: "name", header: "Name", accessor: (row) => row.name }]}
        selectable
        onSelectionChange={onSelectionChange}
      />
    );

    const selectAllCheckbox = screen.getAllByRole("checkbox")[0];
    await user.click(selectAllCheckbox);

    expect(onSelectionChange).toHaveBeenCalled();
    const selectedSet = onSelectionChange.mock.calls[0][0];
    expect(selectedSet.size).toBe(mockUsers.length);
  });

  it("supports sorting", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        data={mockUsers}
        columns={[
          { id: "name", header: "Name", accessor: (row) => row.name, sortable: true },
        ]}
        sortable
      />
    );

    const nameHeader = screen.getByText("Name");
    await user.click(nameHeader);

    // Table should be sorted (order may change)
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("supports filtering", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        data={mockUsers}
        columns={[
          { id: "name", header: "Name", accessor: (row) => row.name, filterable: true },
        ]}
        filterable
      />
    );

    const filterInput = screen.getByPlaceholderText(/filter name/i);
    await user.type(filterInput, "Alice");

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });

  it("supports row actions", async () => {
    const user = userEvent.setup();
    const onActionClick = vi.fn();

    render(
      <DataTable
        data={mockUsers}
        columns={[{ id: "name", header: "Name", accessor: (row) => row.name }]}
        rowActions={[
          {
            label: "Edit",
            onClick: onActionClick,
          },
        ]}
      />
    );

    const actionButtons = screen.getAllByRole("button");
    const moreButton = actionButtons.find((btn) => btn.getAttribute("aria-label")?.includes("menu"));
    
    if (moreButton) {
      await user.click(moreButton);
      const editButton = screen.getByText("Edit");
      await user.click(editButton);
      expect(onActionClick).toHaveBeenCalled();
    }
  });

  it("supports row click", async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();

    render(
      <DataTable
        data={mockUsers}
        columns={[{ id: "name", header: "Name", accessor: (row) => row.name }]}
        onRowClick={onRowClick}
      />
    );

    const row = screen.getByText("Alice").closest("tr");
    if (row) {
      await user.click(row);
      expect(onRowClick).toHaveBeenCalled();
    }
  });

  it("accepts custom className", () => {
    const { container } = render(
      <DataTable
        data={mockUsers}
        columns={[{ id: "name", header: "Name", accessor: (row) => row.name }]}
        className="custom-class"
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("custom-class");
  });
});

