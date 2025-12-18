"use client";

import { CodeBlock, DocumentContent } from "@fragment_ui/ui";
import { PricingTable } from "@fragment_ui/blocks";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";

export default function PricingTablePage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">
          Pricing Table
        </h1>
      </div>
      <p className="mb-6 intro-text">Plan cards/table with pricing and features.</p>
      
      {/* Default Pricing Table */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-6xl">
            <PricingTable
              tiers={[
                {
                  name: "Starter",
                  description: "Perfect for getting started",
                  price: "$9",
                  pricePeriod: "month",
                  features: [
                    { name: "Up to 5 projects", included: true },
                    { name: "10GB storage", included: true },
                    { name: "Basic support", included: true },
                    { name: "Advanced analytics", included: false },
                    { name: "Custom domains", included: false },
                  ],
                  ctaText: "Get Started",
                  ctaOnClick: () => alert("Starter plan clicked"),
                },
                {
                  name: "Pro",
                  description: "For professionals",
                  price: "$29",
                  pricePeriod: "month",
                  popular: true,
                  features: [
                    { name: "Unlimited projects", included: true },
                    { name: "100GB storage", included: true },
                    { name: "Priority support", included: true },
                    { name: "Advanced analytics", included: true },
                    { name: "Custom domains", included: true },
                  ],
                  ctaText: "Get Started",
                  ctaOnClick: () => alert("Pro plan clicked"),
                },
                {
                  name: "Enterprise",
                  description: "For teams and organizations",
                  price: "$99",
                  pricePeriod: "month",
                  features: [
                    { name: "Unlimited projects", included: true },
                    { name: "Unlimited storage", included: true },
                    { name: "24/7 support", included: true },
                    { name: "Advanced analytics", included: true },
                    { name: "Custom domains", included: true },
                    { name: "SSO", included: true },
                  ],
                  ctaText: "Contact Sales",
                  ctaOnClick: () => alert("Enterprise plan clicked"),
                },
              ]}
            />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { PricingTable } from "@fragment_ui/blocks";

<PricingTable
  tiers={[
    {
      name: "Starter",
      description: "Perfect for getting started",
      price: "$9",
      pricePeriod: "month",
      features: [
        { name: "Up to 5 projects", included: true },
        { name: "10GB storage", included: true },
        { name: "Basic support", included: true },
        { name: "Advanced analytics", included: false },
      ],
      ctaText: "Get Started",
    },
    {
      name: "Pro",
      description: "For professionals",
      price: "$29",
      pricePeriod: "month",
      popular: true,
      features: [
        { name: "Unlimited projects", included: true },
        { name: "100GB storage", included: true },
        { name: "Priority support", included: true },
      ],
      ctaText: "Get Started",
    },
  ]}
/>`}
          </CodeBlock>
        </div>
      </div>
      
      <div className="space-y-6 my-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Two Tiers</h3>
          <PricingTable
            tiers={[
              {
                name: "Free",
                description: "For personal projects",
                price: "$0",
                pricePeriod: "month",
                features: [
                  { name: "1 project", included: true },
                  { name: "1GB storage", included: true },
                  { name: "Community support", included: true },
                ],
                ctaText: "Get Started",
              },
              {
                name: "Pro",
                description: "For professionals",
                price: "$29",
                pricePeriod: "month",
                popular: true,
                features: [
                  { name: "Unlimited projects", included: true },
                  { name: "100GB storage", included: true },
                  { name: "Priority support", included: true },
                ],
                ctaText: "Upgrade",
              },
            ]}
          />
        </div>
      </div>

      <h2 id="code-examples">Code Examples</h2>
      <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto">
        <code>{`import { PricingTable } from "@fragment_ui/blocks";

<PricingTable
  tiers={[
    {
      name: "Pro",
      description: "For professionals",
      price: "$29",
      pricePeriod: "month",
      popular: true,
      features: [
        { name: "Unlimited projects", included: true },
        { name: "100GB storage", included: true },
        { name: "Priority support", included: true },
      ],
      ctaText: "Get Started",
      ctaOnClick: () => handleSignup("pro"),
    },
  ]}
/>`}</code>
      </pre>

      <h2 id="props">Props</h2>
      <h3>PricingTable</h3>
      <ul>
        <li>
          <code>tiers</code> - Array of pricing tiers (required)
        </li>
        <li>
          <code>className</code> - Additional CSS classes (optional)
        </li>
      </ul>

      <h3>PricingTier</h3>
      <ul>
        <li>
          <code>name</code> - Tier name (required)
        </li>
        <li>
          <code>description</code> - Tier description (optional)
        </li>
        <li>
          <code>price</code> - Price display (required, e.g., "$29" or "Custom")
        </li>
        <li>
          <code>pricePeriod</code> - Price period (optional, e.g., "month", "year")
        </li>
        <li>
          <code>priceDescription</code> - Additional price description (optional)
        </li>
        <li>
          <code>features</code> - Array of features (required)
        </li>
        <li>
          <code>ctaText</code> - CTA button text (required)
        </li>
        <li>
          <code>ctaOnClick</code> - CTA click handler (optional)
        </li>
        <li>
          <code>ctaHref</code> - CTA link URL (optional)
        </li>
        <li>
          <code>popular</code> - Mark tier as popular (optional)
        </li>
        <li>
          <code>disabled</code> - Disable tier (optional)
        </li>
      </ul>

      <h3>PricingFeature</h3>
      <ul>
        <li>
          <code>name</code> - Feature name (required)
        </li>
        <li>
          <code>included</code> - Whether feature is included (optional, default: true)
        </li>
        <li>
          <code>description</code> - Feature description (optional)
        </li>
      </ul>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">
        npx shadcn@latest add /r/pricing-table.json
      </CodeBlock>
      <h2 id="accessibility">Accessibility</h2>
      <p>
        Pricing table uses semantic HTML with proper headings and structure. Cards are keyboard accessible, and CTA
        buttons follow button/link accessibility patterns. Compliant with WCAG 2.1.
      </p>

      
    </DocumentContent>
  );
}

