import Link from "next/link";
import { Button, Badge } from "@fragment_ui/ui";
import { AdminDashboardPreview } from "../src/components/admin-dashboard-preview";
import { ArrowRight, Sparkles } from "lucide-react";
import { DocumentationHeaderWrapper } from "../src/components/documentation-header-wrapper";
import { LayoutModeProvider } from "../src/components/layout-mode-context";

export const dynamic = "force-static";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <div className="w-full">
        <LayoutModeProvider>
          <DocumentationHeaderWrapper />
        </LayoutModeProvider>
      </div>

      {/* Hero */}
      <section className="w-full flex flex-col items-center text-center gap-4 px-4 py-10 fade-in">
        <Link
          href="/docs/changelog"
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-base)] bg-[color:var(--color-surface-1)] px-3 py-1 text-xs text-[color:var(--color-fg-base)] hover:bg-[color:var(--color-surface-2)] transition-colors no-underline"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-fg-base)]" aria-hidden="true" />
          <span>New: Fragment UI 0.1 alpha released</span>
          <ArrowRight className="h-3 w-3 text-[color:var(--color-fg-base)]" aria-hidden="true" />
        </Link>
        <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
          One design system. AI-ready.
        </h1>
        <p className="text-lg text-[color:var(--color-fg-muted)] max-w-xl mb-3">
          Code-first React, TypeScript, shadcn/ui and Tailwind design system that powers
          AI-generated dashboards, screens, and interface variants.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/docs/get-started/introduction">
            <Button size="md" trailingIcon={<ArrowRight className="h-4 w-4" />}>
              Get Started
            </Button>
          </Link>
          <Link href="https://github.com/blazejrzepa/fragment-ui" target="_blank">
            <Button variant="outline" size="md" leadingIcon={
              <svg
                className="h-4 w-4"
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
      <section className="space-y-4 fade-in">
        {/* Embed full /admin experience, including its native sidebar */}
        <div className="w-full max-w-[1300px] mx-auto rounded-2xl border border-[color:var(--color-border-base)] bg-[color:var(--background-primary)] overflow-hidden">
          <AdminDashboardPreview />
        </div>
      </section>
    </div>
  );
}

