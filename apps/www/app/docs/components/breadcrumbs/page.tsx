"use client";

import { Breadcrumbs, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent, CodeBlock } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";

const defaultCode = `import { Breadcrumbs } from "@fragment_ui/ui";

export function BreadcrumbsDefaultDemo() {
  return (
    <Breadcrumbs
      items={[
        { label: "Home", href: "/" },
        { label: "Components", href: "/components" },
        { label: "Breadcrumbs" },
      ]}
    />
  );
}`;

const arrowCode = `import { Breadcrumbs } from "@fragment_ui/ui";

export function BreadcrumbsArrowDemo() {
  return (
    <Breadcrumbs
      variant="arrow"
      items={[
        { label: "Home", href: "/" },
        { label: "Documentation", href: "/docs" },
        { label: "Components", href: "/docs/components" },
        { label: "Breadcrumbs" },
      ]}
    />
  );
}`;

export default function BreadcrumbsPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-[var(--space-4)] mb-[var(--space-1)]">
        <h1 id="breadcrumbs">Breadcrumbs</h1>
      </div>
      <p className="mb-[var(--space-6)] intro-text">Show current location in navigation hierarchy.</p>
      
      {/* Default variant */}
      <ExampleSection
        id="breadcrumbs-default"
        title="Example"
        code={defaultCode}
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Components", href: "/components" },
              { label: "Breadcrumbs" },
            ]}
          />
        </div>
      </ExampleSection>

      {/* Arrow variant */}
      <ExampleSection
        id="breadcrumbs-arrow"
        title="Arrow Variant"
        code={arrowCode}
        marginTop="mt-8"
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
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
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add breadcrumbs`}
      </CodeBlock>

      {/* API Reference */}
      <h2 id="api" className="mt-[var(--space-8)]">API Reference</h2>
      <div className="mt-[var(--space-4)] border border-[color:var(--color-border-base)] rounded-[var(--radius-lg)] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Prop</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Type</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Default</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>items</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>BreadcrumbItem[]</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Array of breadcrumb items (required)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>variant</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">
                <div className="flex gap-[var(--space-1)] flex-wrap">
                  <code>"slash"</code>
                  <code>"arrow"</code>
                </div>
              </td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>"slash"</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Separator style variant</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>separator</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>React.ReactNode</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Custom separator element (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Additional CSS classes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-[var(--space-4)] border border-[color:var(--color-border-base)] rounded-[var(--radius-lg)] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>BreadcrumbItem Property</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Type</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Required</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>label</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>React.ReactNode</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">✓</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Display text or React node (required)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>href</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Link URL (optional, makes item clickable)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>onClick</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>() =&gt; void</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Click handler (optional, used if no href)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Collapsible className="mt-[var(--space-8)]">
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation" className="m-0">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-[var(--space-4)]">
          <p><strong>Intent</strong></p>
          <p>
            <code>Breadcrumbs</code> is a navigation component that displays the current page's location within a site hierarchy. Use it when you need to show users where they are in a multi-level navigation structure and provide quick access to parent pages.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Multi-level navigation structures</li>
            <li>Documentation sites with nested sections</li>
            <li>E-commerce category pages</li>
            <li>File system or folder navigation</li>
            <li>Any hierarchical content organization</li>
          </ul>

          <p><strong>UI-DSL Usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Breadcrumbs"</code> and provide an <code>items</code> array.
          </p>
          
          <p><strong>Props</strong></p>
          <ul>
            <li><code>items</code> – array of breadcrumb items (required). Each item should include:
              <ul>
                <li><code>label</code> – React.ReactNode. Display text or React node (required)</li>
                <li><code>href?</code> – string. Link URL (optional, makes item clickable)</li>
                <li><code>onClick?</code> – function. Click handler (optional, used if no href)</li>
              </ul>
            </li>
            <li><code>variant?</code> – <code>"slash"</code> (default) or <code>"arrow"</code>. Separator style variant</li>
            <li><code>separator?</code> – React.ReactNode. Custom separator element (optional)</li>
            <li><code>className?</code> – string. Additional CSS classes</li>
          </ul>
          <p>The last item typically has no <code>href</code> as it represents the current page.</p>

          <h3 className="mt-[var(--space-6)] mb-[var(--space-4)]">Basic Example</h3>
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

          <h3 className="mt-[var(--space-6)] mb-[var(--space-4)]">Arrow Variant</h3>
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
    </DocumentContent>
  );
}
