"use client";

import { BenefitsSection } from "@fragment_ui/blocks";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock, DocumentContent } from "@fragment_ui/ui";
import { CheckCircle2, Zap, Shield, TrendingUp } from "lucide-react";

export default function BenefitsSectionPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Benefits Section</h1>
      </div>
      <p className="mb-6 intro-text">
        Highlight product benefits in a structured layout.
      </p>
      <h2 id="overview">Overview</h2>
      <p>
        Benefits Section displays benefits in either a grid or list layout with optional icons.
        Supports 2, 3, or 4 column grid layouts that adapt to screen size.
      </p>

      
      {/* Default Grid Layout */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-4xl">
            <BenefitsSection
              title="Why Choose Us"
              description="Everything you need to succeed"
              benefits={[
                {
                  title: "Fast & Reliable",
                  description: "Lightning-fast performance with 99.9% uptime",
                },
                {
                  title: "Secure",
                  description: "Enterprise-grade security for your data",
                },
                {
                  title: "Scalable",
                  description: "Grows with your business needs",
                },
              ]}
              columns={3}
            />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { BenefitsSection } from "@fragment_ui/blocks";
import { Zap, Shield, TrendingUp } from "lucide-react";

<BenefitsSection
  title="Why Choose Us"
  description="Everything you need to succeed"
  benefits={[
    {
      title: "Fast & Reliable",
      description: "Lightning-fast performance with 99.9% uptime",
    },
    {
      title: "Secure",
      description: "Enterprise-grade security for your data",
    },
    {
      title: "Scalable",
      description: "Grows with your business needs",
    },
  ]}
  columns={3}
/>`}</CodeBlock>
        </div>
      </div>

      <h2 id="props">Props</h2>
      <ul>
        <li>
          <code>title</code> - Section title (optional)
        </li>
        <li>
          <code>description</code> - Section description (optional)
        </li>
        <li>
          <code>benefits</code> - Array of benefit objects (required)
        </li>
        <li>
          <code>layout</code> - Layout type: "grid" | "list" (optional, default: "grid")
        </li>
        <li>
          <code>columns</code> - Number of columns: 2 | 3 | 4 (optional, default: 3)
        </li>
        <li>
          <code>className</code> - Additional CSS classes (optional)
        </li>
      </ul>

      <h3>Benefit</h3>
      <ul>
        <li>
          <code>title</code> - Benefit title (required)
        </li>
        <li>
          <code>description</code> - Benefit description (required)
        </li>
        <li>
          <code>icon</code> - Icon element (optional, defaults to CheckCircle2)
        </li>
      </ul>

      
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">npx shadcn@latest add /r/benefits-section.json</CodeBlock>
      <h2 id="accessibility">Accessibility</h2>
      <p>
        Benefits Section uses semantic HTML with proper heading hierarchy. All benefits are keyboard accessible
        and screen reader friendly. Compliant with WCAG 2.1.
      </p>

    </DocumentContent>
  );
}

