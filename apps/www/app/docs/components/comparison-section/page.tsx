"use client";

import { ComparisonSection } from "@fragment_ui/blocks";
import { CodeBlock, DocumentContent } from "@fragment_ui/ui";

export default function ComparisonSectionPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Comparison Section</h1>
      </div>
      <p className="mb-6 intro-text">
        Compare plans or features side-by-side.
      </p>
      <h2 id="overview">Overview</h2>
      <p>
        Comparison Section displays a comparison table with plans/options as columns and features as rows.
        Supports checkmarks, X marks, and custom values for each feature.
      </p>

      
      {/* Pricing Comparison */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-5xl">
            <ComparisonSection
              title="Compare Plans"
              description="Choose the plan that's right for you"
              plans={[
                {
                  name: "Starter",
                  description: "For individuals",
                  features: {
                    "Feature 1": true,
                    "Feature 2": true,
                    "Feature 3": false,
                    "Storage": "10 GB",
                    "Support": "Email",
                  },
                },
                {
                  name: "Professional",
                  description: "For teams",
                  popular: true,
                  features: {
                    "Feature 1": true,
                    "Feature 2": true,
                    "Feature 3": true,
                    "Storage": "100 GB",
                    "Support": "Priority",
                  },
                },
                {
                  name: "Enterprise",
                  description: "For organizations",
                  features: {
                    "Feature 1": true,
                    "Feature 2": true,
                    "Feature 3": true,
                    "Storage": "Unlimited",
                    "Support": "24/7 Phone",
                  },
                },
              ]}
              features={[
                { name: "Feature 1" },
                { name: "Feature 2" },
                { name: "Feature 3" },
                { name: "Storage", description: "Total storage space" },
                { name: "Support", description: "Support level" },
              ]}
            />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { ComparisonSection } from "@fragment_ui/blocks";

<ComparisonSection
  title="Compare Plans"
  description="Choose the plan that's right for you"
  plans={[
    {
      name: "Starter",
      description: "For individuals",
      features: {
        "Feature 1": true,
        "Feature 2": true,
        "Feature 3": false,
        "Storage": "10 GB",
        "Support": "Email",
      },
    },
    {
      name: "Professional",
      description: "For teams",
      popular: true,
      features: {
        "Feature 1": true,
        "Feature 2": true,
        "Feature 3": true,
        "Storage": "100 GB",
        "Support": "Priority",
      },
    },
    {
      name: "Enterprise",
      description: "For organizations",
      features: {
        "Feature 1": true,
        "Feature 2": true,
        "Feature 3": true,
        "Storage": "Unlimited",
        "Support": "24/7 Phone",
      },
    },
  ]}
  features={[
    { name: "Feature 1" },
    { name: "Feature 2" },
    { name: "Feature 3" },
    { name: "Storage", description: "Total storage space" },
    { name: "Support", description: "Support level" },
  ]}
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
          <code>plans</code> - Array of plan objects (required)
        </li>
        <li>
          <code>features</code> - Array of feature objects (required)
        </li>
        <li>
          <code>showHeader</code> - Show table header (optional, default: true)
        </li>
        <li>
          <code>className</code> - Additional CSS classes (optional)
        </li>
      </ul>

      <h3>ComparisonPlan</h3>
      <ul>
        <li>
          <code>name</code> - Plan name (required)
        </li>
        <li>
          <code>description</code> - Plan description (optional)
        </li>
        <li>
          <code>popular</code> - Mark as popular (optional)
        </li>
        <li>
          <code>features</code> - Record of feature names to values (true/false/string) (required)
        </li>
      </ul>

      <h3>ComparisonFeature</h3>
      <ul>
        <li>
          <code>name</code> - Feature name (required)
        </li>
        <li>
          <code>description</code> - Feature description (optional)
        </li>
      </ul>

      
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">npx shadcn@latest add /r/comparison-section.json</CodeBlock>
      <h2 id="accessibility">Accessibility</h2>
      <p>
        Comparison Section uses semantic HTML table elements with proper headers.
        All cells are keyboard accessible and screen reader friendly. Compliant with WCAG 2.1.
      </p>

    </DocumentContent>
  );
}

