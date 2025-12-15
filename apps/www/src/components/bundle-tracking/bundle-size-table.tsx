"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@fragment_ui/ui";
import { Input } from "@fragment_ui/ui";

export interface BundleSizeData {
  component: string;
  size: number;
  gzipped: number;
  sizeFormatted: string;
  gzippedFormatted: string;
}

export interface BundleSizeTableProps {
  data: BundleSizeData[];
  title?: string;
}

export function BundleSizeTable({ data, title = "Bundle Size Details" }: BundleSizeTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"component" | "size" | "gzipped">("gzipped");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

  const filteredAndSorted = React.useMemo(() => {
    let filtered = data;

    if (searchQuery) {
      filtered = data.filter((item) =>
        item.component.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      if (sortBy === "component") {
        comparison = a.component.localeCompare(b.component);
      } else if (sortBy === "size") {
        comparison = a.size - b.size;
      } else {
        comparison = a.gzipped - b.gzipped;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [data, searchQuery, sortBy, sortOrder]);

  const handleSort = (column: "component" | "size" | "gzipped") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const SortIndicator = ({ column }: { column: "component" | "size" | "gzipped" }) => {
    if (sortBy !== column) return null;
    return <span>{sortOrder === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="mt-4">
          <Input
            type="search"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[color:var(--color-border-base)]">
                <th
                  className="text-left py-2 px-4 cursor-pointer hover:bg-[color:var(--color-surface-2)]"
                  onClick={() => handleSort("component")}
                >
                  Component <SortIndicator column="component" />
                </th>
                <th
                  className="text-right py-2 px-4 cursor-pointer hover:bg-[color:var(--color-surface-2)]"
                  onClick={() => handleSort("size")}
                >
                  Size (minified) <SortIndicator column="size" />
                </th>
                <th
                  className="text-right py-2 px-4 cursor-pointer hover:bg-[color:var(--color-surface-2)]"
                  onClick={() => handleSort("gzipped")}
                >
                  Size (gzipped) <SortIndicator column="gzipped" />
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.map((item) => (
                <tr
                  key={item.component}
                  className="border-b border-[color:var(--color-border-base)] hover:bg-[color:var(--color-surface-2)]"
                >
                  <td className="py-2 px-4 font-mono">{item.component}</td>
                  <td className="py-2 px-4 text-right text-[color:var(--color-fg-muted)]">
                    {item.sizeFormatted}
                  </td>
                  <td className="py-2 px-4 text-right font-medium">{item.gzippedFormatted}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[color:var(--color-border-base)] font-semibold">
                <td className="py-2 px-4">Total</td>
                <td className="py-2 px-4 text-right text-[color:var(--color-fg-muted)]">
                  {formatBytes(data.reduce((sum, item) => sum + item.size, 0))}
                </td>
                <td className="py-2 px-4 text-right">
                  {formatBytes(data.reduce((sum, item) => sum + item.gzipped, 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="mt-4 text-sm text-[color:var(--color-fg-muted)]">
          Showing {filteredAndSorted.length} of {data.length} components
        </div>
      </CardContent>
    </Card>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

