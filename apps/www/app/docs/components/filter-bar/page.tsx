"use client";

import { useState } from "react";
import { FilterBar, DocumentContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";

export default function FilterBarPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Filter Bar</h1>
      </div>
      <p className="mb-6 intro-text">
        A ready filter header for lists/tables.
      </p>
      <h2 id="overview">Overview</h2>
      <p>
        FilterBar provides a consistent interface for filtering and searching data. Supports search inputs,
        select dropdowns, date pickers, and a clear filters button.
      </p>

      
      {/* Default Filter Bar */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-4xl">
            <FilterBar
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
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`"use client"

import { FilterBar } from "@fragment_ui/ui"
import { useState } from "react"

export function FilterBarDemo() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [date, setDate] = useState("")

  return (
    <FilterBar
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
        setSearch("")
        setStatus("")
        setDate("")
      }}
    />
  )
}`}</CodeBlock>
        </div>
      </div>

      <h2 id="props">Props</h2>
      <ul>
        <li>
          <code>filters</code> - Array of filter objects (required)
        </li>
        <li>
          <code>onClear</code> - Clear all filters handler (optional)
        </li>
        <li>
          <code>showClearButton</code> - Show clear button (optional, default: true)
        </li>
        <li>
          <code>className</code> - Additional CSS classes (optional)
        </li>
      </ul>

      <h3>Filter</h3>
      <ul>
        <li>
          <code>id</code> - Unique identifier (required)
        </li>
        <li>
          <code>type</code> - Filter type: "search" | "select" | "date" | "toggle" (required)
        </li>
        <li>
          <code>label</code> - Filter label (optional)
        </li>
        <li>
          <code>placeholder</code> - Placeholder text (optional)
        </li>
        <li>
          <code>options</code> - Options for select filter (optional)
        </li>
        <li>
          <code>value</code> - Current filter value (optional)
        </li>
        <li>
          <code>onChange</code> - Value change handler (optional)
        </li>
      </ul>

      
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">npx shadcn@latest add /r/filter-bar.json</CodeBlock>
      <h2 id="accessibility">Accessibility</h2>
      <p>
        FilterBar uses semantic HTML with proper form controls. All inputs are keyboard accessible
        and include proper labels. Compliant with WCAG 2.1.
      </p>

      <h2 id="links">Links</h2>
      <ul>
        <li>
        </li>
      </ul>

    </DocumentContent>
  );
}

