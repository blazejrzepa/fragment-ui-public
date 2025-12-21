"use client";

import { DocLayout } from "../../../../../src/components/doc-layout";
import { DataTable } from "@fragment_ui/ui";
import { useState } from "react";

export default function SortableListExample() {
  const items = [
    { id: 1, name: "Item A", value: 100, category: "Category 1" },
    { id: 2, name: "Item B", value: 200, category: "Category 2" },
    { id: 3, name: "Item C", value: 150, category: "Category 1" },
    { id: 4, name: "Item D", value: 300, category: "Category 3" },
  ];

  return (
    <DocLayout>
      <h1 id="sortable-list" className="text-[length:var(--typography-display-md-size)] font-medium mb-[var(--space-1)]">Sortable List</h1>
      <p className="mb-[var(--space-6)] intro-text text-[color:var(--foreground-secondary)] font-normal">
        Sortable List example demonstrating Fragment UI components and patterns.
      </p>

      <h2>Example</h2>
      <div className="my-[var(--space-6)]">
        <DataTable
          data={items}
          columns={[
            { id: "name", header: "Name", accessor: (row) => row.name, sortable: true, filterable: true },
            { id: "value", header: "Value", accessor: (row) => row.value, sortable: true },
            { id: "category", header: "Category", accessor: (row) => row.category, sortable: true, filterable: true },
          ]}
          sortable
          filterable
        />
      </div>
    </DocLayout>
  );
}

