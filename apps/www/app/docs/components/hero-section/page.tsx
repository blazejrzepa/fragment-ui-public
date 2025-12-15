"use client";

import { HeroSection } from "@fragment_ui/blocks";
import { CodeBlock, DocumentContent } from "@fragment_ui/ui";

export default function HeroSectionPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="hero-section" className="text-3xl font-medium mb-4">
          Hero Section
        </h1>
      </div>
      <p className="mb-6 intro-text">
        Top-of-page headline, value prop, and CTA.
      </p>
      <h2 id="overview">Overview</h2>
      <p>
        Hero Section is a flexible block component for creating impactful hero sections with title, description,
        and call-to-action buttons. Supports gradient backgrounds, image backgrounds, and multiple CTA variants.
      </p>

      
      {/* Default Hero */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-4xl">
            <HeroSection
              title="Welcome to Our Platform"
              description="Build amazing experiences with our powerful tools"
              primaryCTA={{
                label: "Get Started",
                href: "/signup",
              }}
              secondaryCTA={{
                label: "Learn More",
                href: "/about",
              }}
            />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { HeroSection } from "@fragment_ui/blocks";

<HeroSection
  title="Welcome to Our Platform"
  description="Build amazing experiences with our powerful tools"
  primaryCTA={{ label: "Get Started", href: "/signup" }}
  secondaryCTA={{ label: "Learn More", href: "/about" }}
/>`}
          </CodeBlock>
        </div>
      </div>
      
      <div className="space-y-6 my-6">

        <div>
          <h3 className="text-lg font-semibold mb-2">Gradient Background</h3>
          <HeroSection
            title="Transform Your Workflow"
            description="The all-in-one solution for modern teams"
            background="gradient"
            primaryCTA={{
              label: "Start Free Trial",
              onClick: () => alert("Trial started"),
            }}
            secondaryCTA={{
              label: "Watch Demo",
              onClick: () => alert("Demo watched"),
            }}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Minimal Hero</h3>
          <HeroSection
            title="Simple Hero"
            description="Just the essentials"
            primaryCTA={{
              label: "Get Started",
            }}
          />
        </div>
      </div>

      <h2 id="code-examples">Code Examples</h2>
      <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
        {`import { HeroSection } from "@fragment_ui/blocks";

function LandingPage() {
  return (
    <HeroSection
      title="Welcome to Our Platform"
      description="Build amazing experiences with our powerful tools"
      background="gradient"
      primaryCTA={{ label: "Get Started", href: "/signup" }}
      secondaryCTA={{ label: "Learn More", href: "/about" }}
    />
  );
}`}
      </CodeBlock>

      <h2 id="props">Props</h2>
      <ul>
        <li>
          <code>title</code> - Hero title (required)
        </li>
        <li>
          <code>description</code> - Hero description (optional)
        </li>
        <li>
          <code>primaryCTA</code> - Primary call-to-action button (optional)
        </li>
        <li>
          <code>secondaryCTA</code> - Secondary call-to-action button (optional)
        </li>
        <li>
          <code>background</code> - Background type: "gradient" | "image" | "solid" (optional, default: "solid")
        </li>
        <li>
          <code>image</code> - Background image object with src and alt (optional)
        </li>
        <li>
          <code>className</code> - Additional CSS classes (optional)
        </li>
      </ul>

      <h3>HeroCTA</h3>
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
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">npx shadcn@latest add /r/hero-section.json</CodeBlock>
      <h2 id="accessibility">Accessibility</h2>
      <p>
        Hero section uses semantic HTML with proper heading hierarchy. CTA buttons are keyboard accessible
        and follow button/link accessibility patterns. Background images include proper alt text.
        Compliant with WCAG 2.1.
      </p>

      <h2 id="links">Links</h2>
      <ul>
        <li>
        </li>
      </ul>

    </DocumentContent>
  );
}

