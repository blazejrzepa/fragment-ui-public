"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search as DSSearch } from "@fragment_ui/ui";
import registry from "@fragment_ui/registry/registry.json";
import Link from "next/link";

// List of all available components
const ALL_COMPONENTS = [
  "accordion", "alert", "aspect-ratio", "avatar", "badge", "breadcrumbs", "button",
  "card", "carousel", "checkbox", "collapsible", "combobox",
  "command-palette", "context-menu", "data-table", "date-picker", "dialog", "dropdown-menu",
  "file-upload", "form-container", "form-field", "hover-card", "input", "kbd", "menubar",
  "multi-select", "navigation-menu", "pagination", "popover", "progress", "radio", "rating",
  "resizable", "scroll-area", "segmented-control", "select", "separator", "sheet", "skeleton",
  "slider", "spinner", "split-button", "stepper", "switch", "table", "tabs", "tag-input",
  "textarea", "timeline", "toast", "toggle", "toggle-group", "tooltip", "tree-view",
  "activity-feed", "quick-actions", "filter-bar",
];

// Known blocks from /r/ directory
const KNOWN_BLOCKS = [
  "documentation-header",
  "documentation-sidebar",
  "documentation-layout",
  "authentication-block", "card-grid", "dashboard-layout", "form-container",
  "navigation-header", "pricing-table", "settings-screen", "data-table",
  "hero-section", "feature-grid-section", "stats-section", "testimonials-section", "faq-section", "cta-section",
  "widget-container", "dashboard-widgets",
  "benefits-section", "comparison-section", "footer-section",
  "kpi-dashboard", "analytics-dashboard",
  "app-shell", "kpi-strip", "empty-state",
  "data-table-toolbar", "pagination-footer",
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

// Components with hyphens that are UI components (not blocks)
const componentExceptions = [
  "multi-select", "command-palette", "date-picker", "toggle-group", "tree-view",
  "segmented-control", "rating", "file-upload", "split-button",
  "tag-input", "navigation-menu", "context-menu", "dropdown-menu", "hover-card",
  "scroll-area", "aspect-ratio", "data-table",
];

/**
 * Wrapper component that uses Search from @fragment_ui/ui
 * with portal-specific configuration and Next.js router integration
 */
export function SearchWrapper() {
  const router = useRouter();

  // Next.js Link component wrapper
  const NextLink: React.ComponentType<{
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }> = ({ href, children, onClick, className }) => (
    <Link href={href} onClick={onClick} className={className}>
      {children}
    </Link>
  );

  // Filter out hidden components
  const visibleComponents = ALL_COMPONENTS.filter((name) => !HIDDEN_COMPONENTS.includes(name.toLowerCase()));
  const visibleBlocks = KNOWN_BLOCKS.filter((name) => !HIDDEN_COMPONENTS.includes(name.toLowerCase()));

  return (
    <DSSearch
      registry={registry}
      components={visibleComponents}
      blocks={visibleBlocks}
      componentExceptions={componentExceptions}
      onResultSelect={(result) => {
        router.push(result.path);
      }}
      LinkComponent={NextLink}
      placeholder="Search documentation..."
      showShortcut={true}
    />
  );
}

