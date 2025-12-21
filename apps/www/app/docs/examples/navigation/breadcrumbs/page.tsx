"use client";

import { DocLayout } from "../../../../../src/components/doc-layout";
import { Breadcrumbs } from "@fragment_ui/ui";

export default function BreadcrumbNavigationExample() {
  return (
    <DocLayout>
      <h1 className="text-[length:var(--typography-display-md-size)] font-medium mb-[var(--space-1)]">Breadcrumbs</h1>
      <p 
        className="mb-[var(--space-6)] text-[color:var(--foreground-secondary)] font-normal"
        className="mb-[var(--space-6)] intro-text"
      >
        Breadcrumbs example demonstrating Fragment UI components and patterns.
      </p>

      <h2>Examples</h2>
      <div className="space-y-6 my-[var(--space-6)]">
        <div>
          <h3 className="text-lg font-semibold mb-2">Simple Breadcrumbs</h3>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Documentation", href: "/docs" },
              { label: "Components" },
            ]}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Nested Path</h3>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Docs", href: "/docs" },
              { label: "Examples", href: "/docs/examples" },
              { label: "Navigation" },
            ]}
          />
        </div>
      </div>
    </DocLayout>
  );
}

