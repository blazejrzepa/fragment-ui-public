"use client";

import { FeatureGridSection } from "@fragment_ui/blocks";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock, DocumentContent } from "@fragment_ui/ui";

export default function FeatureGridSectionPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Feature Grid Section</h1>
      </div>
      <p className="mb-6 intro-text">
        A grid layout to showcase features.
      </p>
      <h2 id="overview">Overview</h2>
      <p>
        Feature Grid Section displays features in a responsive grid with optional icons, titles, and descriptions.
        Supports 2, 3, or 4 column layouts that adapt to screen size.
      </p>

      
      {/* Default Feature Grid */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-4xl">
            <FeatureGridSection
              title="Why Choose Us"
              description="Everything you need to succeed"
              features={[
                {
                  title: "Fast & Reliable",
                  description: "Lightning-fast performance with 99.9% uptime",
                  icon: "⚡",
                },
                {
                  title: "Secure",
                  description: "Enterprise-grade security for your data",
                  icon: "🔒",
                },
                {
                  title: "Scalable",
                  description: "Grows with your business needs",
                  icon: "📈",
                },
              ]}
              columns={3}
            />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { FeatureGridSection } from "@fragment_ui/blocks";

<FeatureGridSection
  title="Why Choose Us"
  description="Everything you need to succeed"
  features={[
    {
      title: "Fast & Reliable",
      description: "Lightning-fast performance with 99.9% uptime",
      icon: "⚡",
    },
    {
      title: "Secure",
      description: "Enterprise-grade security for your data",
      icon: "🔒",
    },
    {
      title: "Scalable",
      description: "Grows with your business needs",
      icon: "📈",
    },
  ]}
  columns={3}
/>`}</CodeBlock>
        </div>
      </div>
      
      <div className="space-y-6 my-6">

        <div>
          <h3 id="two-columns" className="text-lg font-semibold mb-2">Two Columns</h3>
          <FeatureGridSection
            title="Key Features"
            features={[
              {
                title: "Fast & Reliable",
                description: "Lightning-fast performance with 99.9% uptime",
                icon: "⚡",
              },
              {
                title: "24/7 Support",
                description: "Round-the-clock assistance when you need it",
                icon: "💬",
              },
            ]}
            columns={2}
          />
        </div>

        <div>
          <h3 id="without-icons" className="text-lg font-semibold mb-2">Without Icons</h3>
          <FeatureGridSection
            title="Features"
            features={[
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

      <h2 id="code-examples">Code Examples</h2>
      <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { FeatureGridSection } from "@fragment_ui/blocks";

function ProductPage() {
  return (
    <FeatureGridSection
      title="Why Choose Us"
      description="Everything you need to succeed"
      features={[
        {
          title: "Fast & Reliable",
          description: "Lightning-fast performance with 99.9% uptime",
          icon: "⚡",
        },
        {
          title: "Secure",
          description: "Enterprise-grade security for your data",
          icon: "🔒",
        },
        {
          title: "Scalable",
          description: "Grows with your business needs",
          icon: "📈",
        },
      ]}
      columns={3}
    />
  );
}`}</CodeBlock>

      <h2 id="props">Props</h2>
      <ul>
        <li>
          <code>title</code> - Section title (optional)
        </li>
        <li>
          <code>description</code> - Section description (optional)
        </li>
        <li>
          <code>features</code> - Array of feature objects (required)
        </li>
        <li>
          <code>columns</code> - Number of columns: 2 | 3 | 4 (optional, default: 3)
        </li>
        <li>
          <code>className</code> - Additional CSS classes (optional)
        </li>
      </ul>

      <h3 id="feature">Feature</h3>
      <ul>
        <li>
          <code>icon</code> - Icon element or string (optional)
        </li>
        <li>
          <code>title</code> - Feature title (required)
        </li>
        <li>
          <code>description</code> - Feature description (required)
        </li>
      </ul>

      
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">npx shadcn@latest add /r/feature-grid-section.json</CodeBlock>
      <h2 id="accessibility">Accessibility</h2>
      <p>
        Feature grid uses semantic HTML with proper heading hierarchy. Cards are keyboard accessible
        and screen reader friendly. Compliant with WCAG 2.1.
      </p>

      <h2 id="links">Links</h2>
      <ul>
        <li>
        </li>
      </ul>

    </DocumentContent>
  );
}

