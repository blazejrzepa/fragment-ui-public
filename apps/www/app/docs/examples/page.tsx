"use client";

import Link from "next/link";
import { DocLayout } from "../../../src/components/doc-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from "@fragment_ui/ui";
import { ArrowLeft, ArrowRight } from "lucide-react";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ExamplesPage() {
  const examples = [
    {
      title: "Forms & Inputs",
      description: "Complete form patterns, validation, and field arrays",
      examples: [
        { name: "Registration Form", href: "/docs/examples/forms/registration", external: false },
        { name: "Profile Settings", href: "/docs/examples/forms/profile", external: false },
        { name: "Multi-step Form", href: "/docs/examples/forms/multi-step", external: false },
        { name: "Field Arrays", href: "/docs/examples/forms/field-arrays", external: false },
      ],
    },
    {
      title: "Data Display",
      description: "Tables, lists, and data visualization patterns",
      examples: [
        { name: "Data Table with Actions", href: "/docs/examples/data/table-actions", external: false },
        { name: "Sortable List", href: "/docs/examples/data/sortable-list", external: false },
        { name: "Virtual Scrolling", href: "/docs/examples/data/virtual-scroll", external: false },
        { name: "Card Grid", href: "/docs/examples/data/card-grid", external: false },
      ],
    },
    {
      title: "Navigation",
      description: "Menus, tabs, breadcrumbs, and navigation patterns",
      examples: [
        { name: "Dashboard Navigation", href: "/docs/examples/navigation/dashboard", external: false },
        { name: "Settings Menu", href: "/docs/examples/navigation/settings", external: false },
        { name: "Tabbed Interface", href: "/docs/examples/navigation/tabs", external: false },
        { name: "Breadcrumb Navigation", href: "/docs/examples/navigation/breadcrumbs", external: false },
      ],
    },
    {
      title: "Overlays & Modals",
      description: "Dialogs, sheets, popovers, and overlay patterns",
      examples: [
        { name: "Confirmation Dialog", href: "/docs/examples/overlays/confirmation", external: false },
        { name: "Form in Dialog", href: "/docs/examples/overlays/form-dialog", external: false },
        { name: "Side Panel", href: "/docs/examples/overlays/side-panel", external: false },
        { name: "Nested Dialogs", href: "/docs/examples/overlays/nested", external: false },
      ],
    },
    {
      title: "Feedback & Status",
      description: "Toasts, alerts, progress indicators, and status messages",
      examples: [
        { name: "Toast Notifications", href: "/docs/examples/feedback/toasts", external: false },
        { name: "Form Validation", href: "/docs/examples/feedback/validation", external: false },
        { name: "Loading States", href: "/docs/examples/feedback/loading", external: false },
        { name: "Error Handling", href: "/docs/examples/feedback/errors", external: false },
      ],
    },
    {
      title: "Layout & Composition",
      description: "Page layouts, dashboard patterns, and composition examples",
      examples: [
        { name: "Dashboard Layout", href: "/docs/examples/layout/dashboard", external: false },
        { name: "Settings Page", href: "/docs/examples/layout/settings", external: false },
        { name: "Authentication Flow", href: "/docs/examples/layout/auth", external: false },
        { name: "Responsive Layout", href: "/docs/examples/layout/responsive", external: false },
      ],
    },
    {
      title: "Full Applications",
      description: "Complete example applications ready to use",
      examples: [
        { name: "Next.js Dashboard", href: "https://github.com/blazejrzepa/fragment-ui/tree/main/examples/nextjs-dashboard", external: true },
        { name: "SaaS Settings", href: "https://github.com/blazejrzepa/fragment-ui/tree/main/examples/saas-settings", external: true },
      ],
    },
  ];

  return (
    <DocLayout>
      <div className="flex items-center justify-between mb-1">
        <h1 id="component-examples-library" className="text-3xl font-medium mb-4">Component Examples Library</h1>
        <div className="flex items-center gap-2">
          <Link href={"/docs/setup"}>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={"/docs/mcp-server"}>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      <p className="mb-6 intro-text">
        Real-world examples and patterns showing how to use Fragment UI components together to build complete features.
      </p>

      <div className="grid gap-6 mt-8 md:grid-cols-2">
        {examples.map((category) => {
          const id = slugify(category.title);
          return (
          <Card key={category.title}>
            <CardHeader>
              <CardTitle id={id}>{category.title}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {category.examples.map((example) => (
                  <li key={example.name}>
                    {example.external ? (
                      <a
                        href={example.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[color:var(--color-brand-primary)] hover:underline"
                      >
                        {example.name} ↗
                      </a>
                    ) : (
                      <Link
                        href={example.href}
                        className="text-[color:var(--color-brand-primary)] hover:underline"
                      >
                        {example.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )})}
      </div>

      <div className="mt-8 p-4 rounded-lg bg-[color:var(--color-surface-2)]">
        <h2 id="best-practices" className="text-lg font-semibold mb-2">Best Practices</h2>
        <ul className="list-disc list-inside space-y-1 text-sm text-[color:var(--color-fg-muted)]">
          <li>All examples follow accessibility best practices</li>
          <li>Examples are production-ready and can be copied directly</li>
          <li>Each example includes code snippets and explanations</li>
          <li>Examples demonstrate integration patterns between components</li>
        </ul>
      </div>
    </DocLayout>
  );
}

