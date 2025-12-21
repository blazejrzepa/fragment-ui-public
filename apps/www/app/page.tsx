"use client";

import * as React from "react";
import Link from "next/link";
import { Button, Badge } from "@fragment_ui/ui";
import { AdminDashboardPreview } from "../src/components/admin-dashboard-preview";
import { ArrowRight, Sparkles } from "lucide-react";
import { DocumentationHeaderWrapper } from "../src/components/documentation-header-wrapper";
import { LayoutModeProvider } from "../src/components/layout-mode-context";

export default function HomePage() {
  return (
    <>
      <LayoutModeProvider>
        <DocumentationHeaderWrapper />
      </LayoutModeProvider>
      <div className="space-y-[calc(var(--space-8)+var(--space-2))]">
      {/* Hero */}
      <section className="w-full flex flex-col items-center text-center gap-[var(--space-4)] px-[var(--space-4)] pt-[calc(var(--space-8)*3)] pb-[var(--space-8)] homepage-block-fade-in">
        <Link
          href="/docs/changelog"
          className="inline-flex items-center gap-[var(--space-2)] rounded-full border border-[color:var(--color-border-base)] bg-[color:var(--color-surface-1)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--typography-size-xs)] text-[color:var(--color-fg-base)] hover:bg-[color:var(--color-surface-2)] transition-colors no-underline"
        >
          <span className="h-[calc(var(--space-1)+2px)] w-[calc(var(--space-1)+2px)] rounded-full bg-[color:var(--color-fg-base)]" aria-hidden="true" />
          <span>New: Fragment UI 0.1 alpha released</span>
          <ArrowRight className="h-[var(--space-3)] w-[var(--space-3)] text-[color:var(--color-fg-base)]" aria-hidden="true" />
        </Link>
        <h1 className="text-[length:var(--typography-display-md-size)] md:text-[length:var(--typography-display-lg-size)] font-semibold leading-tight">
          One design system. AI-ready.
        </h1>
        <p className="text-[length:var(--typography-size-lg)] text-[color:var(--color-fg-muted)] max-w-xl mb-[var(--space-3)]">
          Code-first React, TypeScript and Tailwind design system that powers AI-generated dashboards, screens, and interface variants.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-[var(--space-3)]">
          <Link href="/docs/introduction">
            <Button size="md" trailingIcon={<ArrowRight className="h-[var(--space-4)] w-[var(--space-4)]" />}>
              Get Started
            </Button>
          </Link>
          <Link href="https://github.com/blazejrzepa/fragment-ui-public" target="_blank">
            <Button variant="outline" size="md" leadingIcon={
              <svg
                className="h-[var(--space-4)] w-[var(--space-4)]"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
            }>
              GitHub
            </Button>
          </Link>
        </div>
      </section>

      {/* Embedded dashboard */}
      <section className="space-y-[var(--space-4)] homepage-block-fade-in-delay">
        {/* Embed full /admin experience, including its native sidebar */}
        <div className="w-full max-w-[1300px] mx-auto rounded-[var(--radius-xl)] border border-[color:var(--color-border-base)] bg-[color:var(--background-primary)] overflow-hidden">
          <AdminDashboardPreview />
        </div>
      </section>
      </div>
    </>
  );
}

