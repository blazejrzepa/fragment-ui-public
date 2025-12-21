"use client";

import registry from "@fragment_ui/registry/registry.json";
import Link from "next/link";
import { DocumentContent } from "@fragment_ui/ui";

// Helper function to capitalize first letter of each word
function formatTitle(name: string): string {
  return name
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// List of all available blocks (from docs/components/[block]/page.tsx)
// This is the source of truth for all blocks with documentation pages
const ALL_BLOCKS = [
  "app-shell",
  "authentication-block",
  "benefits-section",
  "card-grid",
  "comparison-section",
  "cta-section",
  "dashboard-layout",
  "dashboard-widgets",
  "data-table-toolbar",
  "documentation-header",
  "documentation-layout",
  "documentation-sidebar",
  "empty-state",
  "faq-section",
  "feature-grid-section",
  "footer-section",
  "form-container",
  "hero-section",
  "kpi-dashboard",
  "kpi-strip",
  "link-card",
  "navigation-header",
  "pagination-footer",
  "pricing-table",
  "settings-screen",
  "stats-section",
  "testimonials-section",
  "widget-container",
];

// Components/blocks hidden during development
const HIDDEN_COMPONENTS = [
  "analytics-dashboard",
  "card-grid",
  "dashboard-layout",
  "dashboard-widgets",
  "data-table-toolbar",
  "filter-bar",
  "form-container",
  "comparison-section",
  "stats-section",
  "testimonials-section",
  "widget-container",
];

export default function Blocks() {
  // Filter out hidden blocks
  const items = ALL_BLOCKS.filter((k) => !HIDDEN_COMPONENTS.includes(k.toLowerCase())).sort();

  return (
    <main className="components-page">
      <DocumentContent as="article" className="w-full max-w-none">
        <h1>Blocks</h1>
        <p className="intro-text">
          Explore all the blocks available in the library.
        </p>
        <div className="grid grid-cols-3 gap-3 mt-[var(--space-6)]">
          {items.map((k) => (
            <Link
              key={k}
              href={`/docs/components/${k}`}
              className="text-[color:var(--foreground-primary)] hover:underline transition-all py-1"
              style={{
                textUnderlineOffset: "3px",
              }}
              prefetch={false}
            >
              {formatTitle(k)}
            </Link>
          ))}
        </div>
      </DocumentContent>
    </main>
  );
}

