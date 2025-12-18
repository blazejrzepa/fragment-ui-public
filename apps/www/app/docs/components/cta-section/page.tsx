"use client";

import { CTASection } from "@fragment_ui/blocks";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock, DocumentContent } from "@fragment_ui/ui";

export default function CTASectionPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">CTA Section</h1>
      </div>
      <p className="mb-6 intro-text">
        Drive a primary action with focused messaging.
      </p>
      <h2 id="overview">Overview</h2>
      <p>
        CTA Section displays a call-to-action with title, description, and action buttons. Supports centered
        and split layouts with different background options (solid, gradient, muted).
      </p>

      
      {/* Default CTA (Centered) */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-4xl">
            <CTASection
              title="Ready to get started?"
              description="Join thousands of teams already using our platform"
              primaryCTA={{
                label: "Get Started",
                href: "/signup",
              }}
              secondaryCTA={{
                label: "Contact Sales",
                href: "/contact",
              }}
            />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { CTASection } from "@fragment_ui/blocks";

<CTASection
  title="Ready to get started?"
  description="Join thousands of teams already using our platform"
  primaryCTA={{
    label: "Get Started",
    href: "/signup",
  }}
  secondaryCTA={{
    label: "Contact Sales",
    href: "/contact",
  }}
/>`}</CodeBlock>
        </div>
      </div>

      <h2 id="props">Props</h2>
      <ul>
        <li>
          <code>title</code> - CTA title (optional)
        </li>
        <li>
          <code>description</code> - CTA description (optional)
        </li>
        <li>
          <code>primaryCTA</code> - Primary call-to-action button (optional)
        </li>
        <li>
          <code>secondaryCTA</code> - Secondary call-to-action button (optional)
        </li>
        <li>
          <code>variant</code> - Layout variant: "centered" | "split" (optional, default: "centered")
        </li>
        <li>
          <code>background</code> - Background type: "solid" | "gradient" | "muted" (optional, default: "solid")
        </li>
        <li>
          <code>className</code> - Additional CSS classes (optional)
        </li>
      </ul>

      <h3>CTAAction</h3>
      <ul>
        <li>
          <code>label</code> - Button label (required)
        </li>
        <li>
          <code>href</code> - Link URL (optional)
        </li>
        <li>
          <code>onClick</code> - Click handler (optional)
        </li>
        <li>
          <code>variant</code> - Button variant: "solid" | "outline" | "ghost" (optional)
        </li>
        <li>
          <code>action</code> - Action identifier for analytics (optional)
        </li>
      </ul>

      
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">npx shadcn@latest add /r/cta-section.json</CodeBlock>
      <h2 id="accessibility">Accessibility</h2>
      <p>
        CTA section uses semantic HTML with proper heading hierarchy. Action buttons are keyboard accessible
        and follow button/link accessibility patterns. Compliant with WCAG 2.1.
      </p>

      

    </DocumentContent>
  );
}

