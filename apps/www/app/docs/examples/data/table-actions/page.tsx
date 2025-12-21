"use client";

import { DocLayout } from "../../../../../src/components/doc-layout";
import { DataTable } from "@fragment_ui/ui";
import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";

export default function TableActionsExample() {
  const [selected, setSelected] = useState<Set<string | number>>(new Set());

  const users = [
    { id: 1, name: "Alice", email: "alice@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Bob", email: "bob@example.com", role: "User", status: "Active" },
    { id: 3, name: "Charlie", email: "charlie@example.com", role: "Editor", status: "Inactive" },
  ];

  return (
    <DocLayout>
      <h1 id="table-actions" className="text-[length:var(--typography-display-md-size)] font-medium mb-[var(--space-1)]">Table Actions</h1>
      <p className="mb-[var(--space-6)] intro-text">
        Table Actions example demonstrating Fragment UI components and patterns.
      </p>

      <h2>Example</h2>
      <div className="my-[var(--space-6)]">
        <DataTable
          data={users}
          columns={[
            { id: "id", header: "ID", accessor: (row) => row.id, sortable: true, width: 80 },
            { id: "name", header: "Name", accessor: (row) => row.name, sortable: true, filterable: true, width: 200 },
            { id: "email", header: "Email", accessor: (row) => row.email, sortable: true, filterable: true, width: 250 },
            { id: "role", header: "Role", accessor: (row) => row.role, sortable: true, width: 120 },
            { id: "status", header: "Status", accessor: (row) => row.status, sortable: true, width: 120 },
          ]}
          selectable
          selectedRows={selected}
          onSelectionChange={setSelected}
          sortable
          filterable
          rowActions={[
            {
              label: "Edit",
              icon: <Edit className="h-4 w-4" />,
              onClick: (row) => alert(`Edit ${row.name}`),
            },
            {
              label: "Delete",
              icon: <Trash2 className="h-4 w-4" />,
              onClick: (row) => alert(`Delete ${row.name}`),
            },
          ]}
        />
      </div>
    </DocLayout>
  );
}

