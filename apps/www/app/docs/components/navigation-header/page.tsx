"use client";

import { NavigationHeader } from "@fragment_ui/blocks";
import { CodeBlock, DocumentContent, Button } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";

export default function NavigationHeaderPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">
          Navigation Header
        </h1>
      </div>
      <p className="mb-6 intro-text">A top navigation header for the app.</p>
      <h2>Overview</h2>
      
      <h2>Install</h2>
      <pre>
        <code>npx shadcn@latest add /r/navigation-header.json</code>
      </pre>
      
      <h2>Examples</h2>
      
      {/* Navigation Header */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[10rem] p-10">
          <div className="w-full max-w-6xl border rounded-lg overflow-hidden">
            <NavigationHeader
              logoText="Fragment UI"
              logoHref="/"
              links={[
                { href: "/docs", label: "Docs" },
                { href: "/components", label: "Components" },
                { href: "/blocks", label: "Blocks" },
              ]}
              actions={
                <>
                  <Button variant="ghost">Sign In</Button>
                  <Button>Get Started</Button>
                </>
              }
            />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { NavigationHeader } from "@fragment_ui/blocks";
import { Button } from "@fragment_ui/ui";

<NavigationHeader
  logoText="My App"
  logoHref="/"
  links={[
    { href: "/docs", label: "Docs" },
    { href: "/about", label: "About" },
  ]}
  actions={
    <>
      <Button variant="ghost">Sign In</Button>
      <Button>Get Started</Button>
    </>
  }
/>`}
          </CodeBlock>
        </div>
      </div>
      
      <h2>Features</h2>
      <ul>
        <li>Sticky header that stays at top on scroll</li>
        <li>Logo with optional link</li>
        <li>Desktop navigation menu</li>
        <li>Mobile hamburger menu</li>
        <li>Custom action buttons/links</li>
        <li>Fully responsive design</li>
        <li>Keyboard accessible navigation</li>
      </ul>
      
      <h2>Props</h2>
      <ul>
        <li>
          <code>logo</code> - Optional logo element (React node)
        </li>
        <li>
          <code>logoText</code> - Logo text (default: "Fragment UI")
        </li>
        <li>
          <code>logoHref</code> - Logo link URL (default: "/")
        </li>
        <li>
          <code>links</code> - Array of navigation links (default: Components, Blocks, Docs)
        </li>
        <li>
          <code>actions</code> - Custom action buttons/links (default: Sign In, Get Started)
        </li>
        <li>
          <code>mobileMenu</code> - Enable/disable mobile menu (default: true)
        </li>
      </ul>
      
      <h2>Link Structure</h2>
      <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto">
        <code>{`interface Link {
  href: string;
  label: string;
}`}</code>
      </pre>
      
      <h2>Accessibility</h2>
      <p>
        The header uses semantic navigation elements, proper ARIA landmarks, and is fully keyboard accessible. Mobile
        menu includes focus management.
      </p>
      
      <h2>Links</h2>
      <ul>
        <li>
          <StorybookLink>Storybook</StorybookLink>
        </li>
      </ul>
    </DocumentContent>
  );
}

