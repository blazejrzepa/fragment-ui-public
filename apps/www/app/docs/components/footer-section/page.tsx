"use client";

import { FooterSection } from "@fragment_ui/blocks";
import { CodeBlock, DocumentContent } from "@fragment_ui/ui";

export default function FooterSectionPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">
          Footer Section
        </h1>
      </div>
      <p className="mb-6 intro-text">A standard site footer with links and info.</p>
      <h2 id="overview">Overview</h2>
      <p>
        Footer Section provides a comprehensive footer with link columns, newsletter signup, social media
        links, and copyright information.
      </p>
      
      {/* Complete Footer */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-6xl">
            <FooterSection
              columns={[
                {
                  title: "Product",
                  links: [
                    { label: "Features", href: "/features" },
                    { label: "Pricing", href: "/pricing" },
                    { label: "Documentation", href: "/docs" },
                  ],
                },
                {
                  title: "Company",
                  links: [
                    { label: "About", href: "/about" },
                    { label: "Blog", href: "/blog" },
                    { label: "Careers", href: "/careers" },
                  ],
                },
                {
                  title: "Resources",
                  links: [
                    { label: "Help Center", href: "/help" },
                    { label: "Contact", href: "/contact" },
                    { label: "Status", href: "/status", external: true },
                  ],
                },
                {
                  title: "Legal",
                  links: [
                    { label: "Privacy", href: "/privacy" },
                    { label: "Terms", href: "/terms" },
                    { label: "Security", href: "/security" },
                  ],
                },
              ]}
              newsletter={{
                title: "Stay updated",
                description: "Get the latest news and updates",
                placeholder: "Enter your email",
                buttonText: "Subscribe",
                onSubmit: (email) => console.log("Subscribed:", email),
              }}
              socialLinks={[]}
              copyright="© 2025 Fragment UI. All rights reserved."
            />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { FooterSection } from "@fragment_ui/blocks";

<FooterSection
  columns={[
    { title: "Product", links: [{ label: "Features", href: "/features" }] },
    { title: "Company", links: [{ label: "About", href: "/about" }] },
  ]}
  socialLinks={[]}
  copyright="© 2025 Fragment UI. All rights reserved."
/>`}
          </CodeBlock>
        </div>
      </div>
      
      <div className="space-y-6 my-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Simple Footer</h3>
          <FooterSection
            columns={[
              {
                title: "Links",
                links: [
                  { label: "Home", href: "/" },
                  { label: "About", href: "/about" },
                  { label: "Contact", href: "/contact" },
                ],
              },
            ]}
            copyright="© 2025 My Company"
          />
        </div>
      </div>

      <h2 id="code-examples">Code Examples</h2>
      <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
        {`import { FooterSection } from "@fragment_ui/blocks";

function LandingPage() {
  return (
    <FooterSection
      columns={[
        {
          title: "Product",
          links: [
            { label: "Features", href: "/features" },
            { label: "Pricing", href: "/pricing" },
          ],
        },
        {
          title: "Company",
          links: [
            { label: "About", href: "/about" },
            { label: "Blog", href: "/blog" },
          ],
        },
      ]}
      newsletter={{
        title: "Stay updated",
        description: "Get the latest news",
        onSubmit: (email) => console.log("Subscribed:", email),
      }}
      socialLinks={[]}
      copyright="© 2025 My Company"
    />
  );
}`}
      </CodeBlock>

      <h2 id="props">Props</h2>
      <ul>
        <li>
          <code>columns</code> - Array of footer columns (optional, default: [])
        </li>
        <li>
          <code>copyright</code> - Copyright text (optional, default: "© 2025 Fragment UI. All rights reserved.")
        </li>
        <li>
          <code>socialLinks</code> - Array of social media links (optional)
        </li>
        <li>
          <code>newsletter</code> - Newsletter signup configuration (optional)
        </li>
        <li>
          <code>className</code> - Additional CSS classes (optional)
        </li>
      </ul>

      <h3>FooterColumn</h3>
      <ul>
        <li>
          <code>title</code> - Column title (required)
        </li>
        <li>
          <code>links</code> - Array of links (required)
        </li>
      </ul>

      <h3>FooterLink</h3>
      <ul>
        <li>
          <code>label</code> - Link label (required)
        </li>
        <li>
          <code>href</code> - Link URL (required)
        </li>
        <li>
          <code>external</code> - Open in new tab (optional)
        </li>
      </ul>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">
        npx shadcn@latest add /r/footer-section.json
      </CodeBlock>
      <h2 id="accessibility">Accessibility</h2>
      <p>
        Footer Section uses semantic HTML with proper link structure and ARIA labels. All links are keyboard
        accessible and screen reader friendly. Compliant with WCAG 2.1.
      </p>
    </DocumentContent>
  );
}

