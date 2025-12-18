"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, Button } from "@fragment_ui/ui";
import type { NavigationSection } from "@fragment_ui/blocks";
import Link from "next/link";
import registry from "@fragment_ui/registry/registry.json";

function formatTitle(name: string): string {
  return name
    .split("-")
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
  "documentation-header", "documentation-sidebar", "documentation-layout",
];

/**
 * Mobile Documentation Sidebar - Uses DocumentationSidebar from DS in a Sheet
 * This component provides mobile menu functionality using DS components
 */
export function MobileDocumentationSidebar() {
  const [open, setOpen] = React.useState(false);
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
        { title: "Examples", href: "/docs/examples" },
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
        { title: "Examples", href: "/docs/examples" },
        { title: "Changelog", href: "/docs/changelog" },
      ],
    },
  ];

  // Next.js Link component wrapper
  const NextLink: React.ComponentType<{
    href: string;
    className?: string;
    children: React.ReactNode;
  }> = ({ href, className, children }) => (
    <Link href={href} className={className} onClick={() => setOpen(false)}>
      {children}
    </Link>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-64 p-0 sm:w-80 backdrop-blur-md border-l border-[color:var(--color-border-base)]"
        scrollDetection={true}
        wheelHandling={true}
        scrollableSelector="[data-sheet-scrollable]"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Main navigation menu</SheetDescription>
        </SheetHeader>
        <div
          data-sheet-scrollable
          className="flex-1 overflow-y-auto overflow-x-hidden h-full"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "thin",
            scrollbarColor: "var(--color-fg-muted) transparent",
          }}
        >
          <nav className="p-4 pt-10 space-y-1">
            {sections.map((section) => (
              <div key={section.title} className="mb-4">
                <div className="px-3 mb-2 text-xs font-semibold text-[color:var(--foreground-secondary)] uppercase tracking-wider">
                  {section.title}
                </div>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href || (pathname || "").startsWith(`${item.href}/`);
                    return (
                      <NextLink
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                          isActive
                            ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)] font-normal"
                            : "text-[color:var(--color-fg-muted)] hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-fg-base)]"
                        }`}
                      >
                        {item.icon && <span>{item.icon}</span>}
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className="ml-auto text-xs px-1.5 py-0.5 rounded bg-[color:var(--color-surface-2)]">
                            {item.badge}
                          </span>
                        )}
                      </NextLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}

