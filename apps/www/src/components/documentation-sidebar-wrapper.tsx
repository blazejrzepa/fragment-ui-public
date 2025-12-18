"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { DocumentationSidebar, type NavigationSection } from "@fragment_ui/blocks";
import registry from "@fragment_ui/registry/registry.json";

// Helper function to capitalize first letter of each word
function formatTitle(name: string): string {
  return name
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// List of all available components
const ALL_COMPONENTS = [
  "accordion", "alert", "aspect-ratio", "avatar", "badge", "breadcrumbs", "button",
  "calendar", "card", "carousel", "checkbox", "collapsible", "combobox",
  "command-palette", "context-menu", "data-table", "date-picker", "dialog", "dropdown-menu",
  "file-upload", "form-container", "form-field", "hover-card", "input", "kbd", "label", "menubar",
  "metric-card", "multi-select", "navigation-menu", "pagination", "popover", "progress", "radio", "rating",
  "resizable", "scroll-area", "segmented-control", "select", "separator", "sheet", "skeleton",
  "slider", "spinner", "split-button", "stepper", "switch", "table", "tabs", "tag-input",
  "textarea", "timeline", "toast", "toggle", "toggle-group", "tooltip", "tree-view",
  "activity-feed", "quick-actions", "filter-bar",
];

// Known blocks from /r/ directory
const KNOWN_BLOCKS = [
  "authentication-block", "card-grid", "dashboard-layout", "form-container",
  "navigation-header", "pricing-table", "settings-screen", "data-table",
  "hero-section", "feature-grid-section", "stats-section", "testimonials-section", "faq-section", "cta-section",
  "widget-container", "dashboard-widgets",
  "benefits-section", "comparison-section", "footer-section",
  "kpi-dashboard", "analytics-dashboard",
  "app-shell", "kpi-strip", "empty-state",
  "data-table-toolbar", "pagination-footer",
];

export function getDocumentationSections(): NavigationSection[] {
  // Get components list
  const componentExceptions = [
    "multi-select", "command-palette", "context-menu", "date-picker", "toggle-group", "tree-view",
    "segmented-control", "rating", "file-upload", "split-button",
    "tag-input", "activity-feed", "quick-actions", "filter-bar", "notification-list",
    "metric-card", "dropdown-menu", "hover-card", "navigation-menu",
  ];
  const components = ALL_COMPONENTS.filter((k) => {
    const normalized = k.toLowerCase();
    return !normalized.includes("-") || componentExceptions.includes(normalized);
  })
    .sort()
    .map((name) => ({
      title: formatTitle(name),
      href: `/docs/components/${name}`,
    }));

  // Get blocks list
  const blockExceptions = ["multi-select", "command-palette", "date-picker", "toggle-group"];
  const registryBlocks = Object.keys(registry.components || {}).filter(
    (k) => k.includes("-") && !blockExceptions.includes(k.toLowerCase())
  );

  const blocks = [...new Set([...KNOWN_BLOCKS, ...registryBlocks])]
    .sort()
    .map((name) => ({
      title: formatTitle(name),
      href: `/docs/components/${name}`,
    }));

  const sections: NavigationSection[] = [
    {
      title: "Get Started",
      items: [
        { title: "Introduction", href: "/docs/introduction" },
        { title: "Setup", href: "/docs/setup" },
        { title: "CLI", href: "/docs/cli-usage" },
        { title: "VS Code Extension", href: "/docs/vscode-extension-usage" },
        { title: "Figma Code Connect", href: "/docs/figma-code-connect" },
        { title: "MCP Server", href: "/docs/mcp-server" },
        { title: "llms.txt", href: "/llms.txt" },
      ],
    },
    {
      title: "Foundations",
      items: [
        { title: "Design Tokens", href: "/docs/foundations/tokens" },
        { title: "Theming & Modes", href: "/docs/foundations/theming" },
        { title: "Semantic Colors", href: "/docs/foundations/semantic-colors" },
        { title: "Spacing", href: "/docs/foundations/spacing" },
        { title: "Typography", href: "/docs/foundations/typography" },
      ],
    },
    {
      title: "Testing",
      items: [
        { title: "Test Guide", href: "/docs/testing/test-guide" },
        { title: "Performance Tests", href: "/docs/testing/performance-tests" },
        { title: "Visual Regression", href: "/docs/testing/visual-regression" },
      ],
    },
    {
      title: "Components",
      items: components,
    },
    {
      title: "Blocks",
      items: blocks,
    },
    {
      title: "Resources",
      items: [
        { title: "API Reference", href: "/docs/api" },
        { title: "Examples", href: "/docs/examples" },
        { title: "Changelog", href: "/docs/changelog" },
      ],
    },
  ];

  return sections;
}

/**
 * Wrapper component that uses DocumentationSidebar from @fragment_ui/blocks
 * with portal-specific navigation configuration
 */
export function DocumentationSidebarWrapper({ className }: { className?: string } = {}) {
  const pathname = usePathname();

  // Get components list
  const componentExceptions = [
    "multi-select", "command-palette", "context-menu", "date-picker", "toggle-group", "tree-view",
    "segmented-control", "rating", "file-upload", "split-button",
    "tag-input", "activity-feed", "quick-actions", "filter-bar", "notification-list",
    "metric-card", "dropdown-menu", "hover-card", "navigation-menu",
  ];
  const components = ALL_COMPONENTS.filter((k) => {
    const normalized = k.toLowerCase();
    return !normalized.includes("-") || componentExceptions.includes(normalized);
  })
    .sort()
    .map((name) => ({
      title: formatTitle(name),
      href: `/docs/components/${name}`,
    }));

  // Get blocks list
  const blockExceptions = ["multi-select", "command-palette", "date-picker", "toggle-group"];
  const registryBlocks = Object.keys(registry.components || {}).filter(
    (k) => k.includes("-") && !blockExceptions.includes(k.toLowerCase())
  );

  const blocks = [...new Set([...KNOWN_BLOCKS, ...registryBlocks])]
    .sort()
    .map((name) => ({
      title: formatTitle(name),
      href: `/docs/components/${name}`,
    }));

  const sections: NavigationSection[] = [
    {
      title: "Get Started",
      items: [
        { title: "Introduction", href: "/docs/introduction" },
        { title: "Setup", href: "/docs/setup" },
        { title: "CLI", href: "/docs/cli-usage" },
        { title: "VS Code Extension", href: "/docs/vscode-extension-usage" },
        { title: "Figma Code Connect", href: "/docs/figma-code-connect" },
        { title: "MCP Server", href: "/docs/mcp-server" },
        { title: "llms.txt", href: "/llms.txt" },
        { title: "Changelog", href: "/docs/changelog" },
      ],
    },
    {
      title: "Foundations",
      items: [
        { title: "Design Tokens", href: "/docs/foundations/tokens" },
        { title: "Theming & Modes", href: "/docs/foundations/theming" },
        { title: "Semantic Colors", href: "/docs/foundations/semantic-colors" },
        { title: "Spacing", href: "/docs/foundations/spacing" },
        { title: "Typography", href: "/docs/foundations/typography" },
      ],
    },
    {
      title: "Testing",
      items: [
        { title: "Test Guide", href: "/docs/testing/test-guide" },
        { title: "Performance Tests", href: "/docs/testing/performance-tests" },
        { title: "Visual Regression", href: "/docs/testing/visual-regression" },
      ],
    },
    {
      title: "Components",
      items: components,
    },
    {
      title: "Blocks",
      items: blocks,
    },
    {
      title: "Resources",
      items: [
        { title: "API Reference", href: "/docs/api" },
      ],
    },
  ];

  // Next.js Link component wrapper
  const NextLink: React.ComponentType<{
    href: string;
    className?: string;
    children: React.ReactNode;
  }> = ({ href, className, children }) => (
    <Link href={href} className={className}>
      {children}
    </Link>
  );

  return (
    <DocumentationSidebar
      sections={sections}
      currentPath={pathname || undefined}
      scrollDetection={true}
      wheelHandling={true}
      LinkComponent={NextLink}
      className={className}
    />
  );
}

