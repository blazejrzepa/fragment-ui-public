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

// List of all available components (from docs/components/[component]/page.tsx)
// This is the source of truth for all components with documentation pages
const ALL_COMPONENTS = [
  "accordion",
  "alert",
  "aspect-ratio",
  "avatar",
  "badge",
  "breadcrumbs",
  "button",
  "calendar",
  "card",
  "carousel",
  "checkbox",
  "collapsible",
  "color-picker",
  "combobox",
  "command-palette",
  "context-menu",
  "data-table",
  "date-picker",
  "dialog",
  "dropdown-menu",
  "file-upload",
  "form-container",
  "form-field",
  "hover-card",
  "input",
  "kbd",
  "menubar",
  "multi-select",
  "navigation-menu",
  "pagination",
  "popover",
  "progress",
  "radio",
  "rating",
  "resizable",
  "scroll-area",
  "segmented-control",
  "select",
  "separator",
  "sheet",
  "skeleton",
  "slider",
  "spinner",
  "split-button",
  "stepper",
  "switch",
  "table",
  "tabs",
  "tag-input",
  "textarea",
  "timeline",
  "toast",
  "toggle",
  "toggle-group",
  "tooltip",
  "tree-view",
  "activity-feed",
  "quick-actions",
  "filter-bar",
  "metric-card",
  "chart",
];

export default function Components() {
  // Components with hyphens that should be shown on Components page (not Blocks)
  const componentExceptions = ["multi-select", "command-palette", "date-picker", "toggle-group", "tree-view", "color-picker", "segmented-control", "rating", "file-upload", "split-button", "tag-input", "activity-feed", "quick-actions", "filter-bar", "metric-card", "chart"];
  
  // Filter ALL_COMPONENTS to show only components (not blocks)
  // Components are those without hyphens OR those in componentExceptions
  const items = ALL_COMPONENTS.filter((k) => {
    const normalized = k.toLowerCase();
    // Include if it doesn't have a hyphen, or if it's in exceptions
    return !normalized.includes("-") || componentExceptions.includes(normalized);
  }).sort();

  return (
    <main className="components-page">
      <DocumentContent as="article" className="w-full max-w-none">
        <h1>Components</h1>
        <p className="intro-text">
          Build dashboards fast with a code-first design system.
        </p>
        <div className="grid grid-cols-3 gap-3">
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
