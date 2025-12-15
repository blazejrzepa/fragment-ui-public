"use client";

import { useState, useEffect } from "react";
import registry from "@fragment_ui/registry/registry.json";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, DocumentContent } from "@fragment_ui/ui";
import { getStorybookUrl } from "../../src/lib/storybook";
import { getStorybookPath } from "../../src/lib/storybook-mapping";

// Client-side wrapper for Storybook links to avoid SSR issues
function StorybookLinkWrapper({ componentName }: { componentName: string }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const storybookPath = getStorybookPath(componentName);
    const storybookUrl = storybookPath ? getStorybookUrl(storybookPath) : null;
    setUrl(storybookUrl);
  }, [componentName]);

  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="underline text-[color:var(--color-brand-primary)] hover:text-[color:var(--color-brand-primary-600)] transition-colors"
    >
      Storybook
    </a>
  );
}

// List of known blocks from /r/ directory
const KNOWN_BLOCKS = [
  "authentication-block",
  "card-grid",
  "dashboard-layout",
  "form-container",
  "navigation-header",
  "pricing-table",
  "settings-screen",
  "hero-section",
  "feature-grid-section",
  "stats-section",
  "testimonials-section",
  "faq-section",
  "cta-section",
  "widget-container",
  "dashboard-widgets",
  "benefits-section",
  "comparison-section",
  "footer-section",
  "kpi-dashboard",
  "analytics-dashboard",
];

export default function Blocks() {
  // Components with hyphens that should NOT be shown on Blocks page (they're UI components)
  // Must match the list from components/page.tsx
  const componentExceptions = [
    "multi-select",
    "command-palette",
    "date-picker",
    "toggle-group",
    "tree-view",
    "color-picker",
    "segmented-control",
    "rating",
    "file-upload",
    "split-button",
    "tag-input",
    "activity-feed",
    "quick-actions",
    "filter-bar",
    "metric-card",
    "chart",
    "data-table", // data-table is a component, not a block
  ];
  
  // Get blocks from registry.components (if any) and combine with known blocks
  const registryBlocks = Object.keys(registry.components || {}).filter((k) => k.includes("-") && !componentExceptions.includes(k));
  const allBlocks = [...new Set([...KNOWN_BLOCKS, ...registryBlocks])]
    .filter((k) => !componentExceptions.includes(k)) // Filter out components that shouldn't be in blocks
    .sort();

  return (
    <main>
      <DocumentContent as="article" className="w-full max-w-none">
        <h1>Blocks</h1>
        <p className="intro-text">
          Explore all the blocks available in the library.
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {allBlocks.map((k) => (
            <Card key={k}>
              <CardHeader>
                <CardTitle className="text-base font-medium">{k}</CardTitle>
              </CardHeader>
              <CardFooter className="flex gap-3 px-0">
                <Link
                  className="underline text-[color:var(--color-brand-primary)] hover:text-[color:var(--color-brand-primary-600)] transition-colors"
                  href={`/docs/components/${k}`}
                  prefetch={false}
                >
                  Docs
                </Link>
                <StorybookLinkWrapper componentName={k} />
              </CardFooter>
            </Card>
          ))}
        </div>
      </DocumentContent>
    </main>
  );
}

