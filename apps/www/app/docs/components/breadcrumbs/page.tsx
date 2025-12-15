"use client";

import { Breadcrumbs, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";

export default function BreadcrumbsPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="breadcrumbs" className="text-3xl font-medium mb-4">Breadcrumbs</h1>
      </div>
      <p className="mb-6 intro-text">
        Show location within a navigation hierarchy.
      </p>
      
      
      {/* All Variants */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
            <div className="flex justify-center">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Components", href: "/components" },
                  { label: "Breadcrumbs" },
                ]}
              />
            </div>
            <div className="flex justify-center">
              <Breadcrumbs
                variant="arrow"
                items={[
                  { label: "Home", href: "/" },
                  { label: "Documentation", href: "/docs" },
                  { label: "Components", href: "/docs/components" },
                  { label: "Breadcrumbs" },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { Breadcrumbs } from "@fragment_ui/ui";

// Slash variant (default)
<Breadcrumbs
  items={[
    { label: "Home", href: "/" },
    { label: "Components", href: "/components" },
    { label: "Breadcrumbs" },
  ]}
/>

// Arrow variant
<Breadcrumbs
  variant="arrow"
  items={[
    { label: "Home", href: "/" },
    { label: "Documentation", href: "/docs" },
    { label: "Components", href: "/docs/components" },
    { label: "Breadcrumbs" },
  ]}
/>`}</CodeBlock>
        </div>
      </div>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">{`npx shadcn@latest add https://fragmentui.com/r/breadcrumbs.json`}</CodeBlock>

      <Collapsible>
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <p><strong>Intent</strong></p>
          <p>
            <code>Breadcrumbs</code> is a navigation component that displays the current page's location within a site hierarchy.<br />
            Use it when you need to show users where they are in a multi-level navigation structure and provide quick access to parent pages.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Multi-level navigation structures</li>
            <li>Documentation sites with nested sections</li>
            <li>E-commerce category pages</li>
            <li>File system or folder navigation</li>
            <li>Any hierarchical content organization</li>
          </ul>

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Breadcrumbs"</code> and provide an <code>items</code> array.
          </p>
          <p>Props:</p>
          <ul>
            <li><code>items</code> – array of breadcrumb items (required)</li>
            <li><code>variant?</code> – <code>"slash"</code> (default) or <code>"arrow"</code></li>
            <li><code>separator?</code> – custom separator element (optional)</li>
            <li><code>className?</code> – additional CSS classes (optional)</li>
          </ul>
          <p>Each item in <code>items</code> should include:</p>
          <ul>
            <li><code>label</code> – display text or React node (required)</li>
            <li><code>href?</code> – link URL (optional, makes item clickable)</li>
            <li><code>onClick?</code> – click handler (optional, used if no href)</li>
          </ul>
          <p>The last item typically has no <code>href</code> as it represents the current page.</p>

          <p><strong>Example</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Breadcrumbs",
  "props": {
    "variant": "slash",
    "items": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Components",
        "href": "/components"
      },
      {
        "label": "Breadcrumbs"
      }
    ]
  }
}`}</CodeBlock>
          <p className="mt-6"><strong>With arrow variant:</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Breadcrumbs",
  "props": {
    "variant": "arrow",
    "items": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Documentation",
        "href": "/docs"
      },
      {
        "label": "Components",
        "href": "/docs/components"
      },
      {
        "label": "Breadcrumbs"
      }
    ]
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>

      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/core-breadcrumbs--docs">Storybook</StorybookLink>
        </li>
      </ul>


    </DocumentContent>
  );
}

