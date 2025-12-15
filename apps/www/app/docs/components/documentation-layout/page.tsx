import { Metadata } from "next";
import { DocumentationLayout } from "@fragment_ui/blocks";
import { CodeBlock } from "@fragment_ui/ui";

export const metadata: Metadata = {
  title: "DocumentationLayout",
  description: "Complete layout component for documentation sites with header, sidebar, and table of contents",
};

export default function DocumentationLayoutPage() {
  return (
    <div>
      <div className="mt-6">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold" id="page">DocumentationLayout</h1>
        </div>
        <p className="text-lg text-[color:var(--foreground-secondary)] mb-8">
          Complete layout component for documentation sites with auto-extraction headings, responsive layout, and TableOfContents integration.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <ul className="list-disc list-inside space-y-2 text-[color:var(--foreground-secondary)]">
              <li>Auto-extracts headings for TableOfContents</li>
              <li>Responsive layout with sidebar and right sidebar</li>
              <li>Fixed header support</li>
              <li>TableOfContents integration</li>
              <li>Configurable content selector</li>
              <li>Customizable padding and max width</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Installation</h2>
            <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">
{`pnpm add @fragment_ui/blocks @fragment_ui/ui`}
            </CodeBlock>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Usage</h2>
            <CodeBlock language="tsx" highlightApiUrl="/api/highlight-code">
{`import { DocumentationLayout } from "@fragment_ui/blocks";
import { NavigationMenu } from "@fragment_ui/ui";
import { DocumentationHeader } from "./header";
import { DocumentationSidebar } from "./sidebar";

export function DocumentationPage() {
  return (
    <DocumentationLayout
      showTableOfContents={true}
      contentTopPadding="58px"
    >
      <article>
        <h2>Overview</h2>
        <p>Content...</p>
        <h3>Subsection</h3>
        <p>More content...</p>
      </article>
    </DocumentationLayout>
  );
}`}
            </CodeBlock>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">API Reference</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Prop</th>
                    <th className="text-left p-2">Type</th>
                    <th className="text-left p-2">Default</th>
                    <th className="text-left p-2">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-sm">children</td>
                    <td className="p-2 text-sm">React.ReactNode</td>
                    <td className="p-2 text-sm">-</td>
                    <td className="p-2 text-sm">Main content to display</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-sm">header</td>
                    <td className="p-2 text-sm">React.ReactNode</td>
                    <td className="p-2 text-sm">-</td>
                    <td className="p-2 text-sm">Header component (e.g., NavigationMenu with variant="header")</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-sm">sidebar</td>
                    <td className="p-2 text-sm">React.ReactNode</td>
                    <td className="p-2 text-sm">-</td>
                    <td className="p-2 text-sm">Left sidebar component (e.g., DocumentationSidebar)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-sm">rightSidebar</td>
                    <td className="p-2 text-sm">React.ReactNode</td>
                    <td className="p-2 text-sm">-</td>
                    <td className="p-2 text-sm">Right sidebar content (additional content besides TableOfContents)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-sm">showTableOfContents</td>
                    <td className="p-2 text-sm">boolean</td>
                    <td className="p-2 text-sm">true</td>
                    <td className="p-2 text-sm">Show table of contents in right sidebar</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-sm">contentSelector</td>
                    <td className="p-2 text-sm">string</td>
                    <td className="p-2 text-sm">"article"</td>
                    <td className="p-2 text-sm">CSS selector for the content container to extract headings from</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-sm">maxWidth</td>
                    <td className="p-2 text-sm">string</td>
                    <td className="p-2 text-sm">"1536px"</td>
                    <td className="p-2 text-sm">Maximum width of the main container</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-sm">contentTopPadding</td>
                    <td className="p-2 text-sm">string</td>
                    <td className="p-2 text-sm">"58px"</td>
                    <td className="p-2 text-sm">Top padding for main content (to account for fixed header)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-sm">version</td>
                    <td className="p-2 text-sm">string</td>
                    <td className="p-2 text-sm">-</td>
                    <td className="p-2 text-sm">Version string (for version switcher, etc.)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Examples</h2>
            
            <div className="space-y-6">
              <div>
                <h3 id="complete-documentation-site" className="text-xl font-semibold mb-3">Complete Documentation Site</h3>
                <CodeBlock language="tsx" highlightApiUrl="/api/highlight-code">
{`import { DocumentationLayout, DocumentationHeader, DocumentationSidebar } from "@fragment_ui/blocks";

export function DocsPage() {
  return (
    <DocumentationLayout
      showTableOfContents={true}
    >
      <article>
        <h1>Getting Started</h1>
        <p>Welcome to our documentation...</p>
        <h2>Installation</h2>
        <p>Install the package...</p>
        <h3>Quick Start</h3>
        <p>Get started quickly...</p>
      </article>
    </DocumentationLayout>
  );
}`}
                </CodeBlock>
              </div>

              <div>
                <h3 id="without-table-of-contents" className="text-xl font-semibold mb-3">Without TableOfContents</h3>
                <CodeBlock language="tsx" highlightApiUrl="/api/highlight-code">
{`<DocumentationLayout
  showTableOfContents={false}
>
  <article>Content...</article>
</DocumentationLayout>`}
                </CodeBlock>
              </div>

              <div>
                <h3 id="custom-content-selector" className="text-xl font-semibold mb-3">Custom Content Selector</h3>
                <CodeBlock language="tsx" highlightApiUrl="/api/highlight-code">
{`<DocumentationLayout
  contentSelector=".main-content"
>
  <div className="main-content">
    <h2>Custom Content</h2>
    <p>Content...</p>
  </div>
</DocumentationLayout>`}
                </CodeBlock>
              </div>

              <div>
                <h3 id="with-right-sidebar-content" className="text-xl font-semibold mb-3">With Right Sidebar Content</h3>
                <CodeBlock language="tsx" highlightApiUrl="/api/highlight-code">
{`<DocumentationLayout
  showTableOfContents={true}
>
  <article>Content...</article>
</DocumentationLayout>`}
                </CodeBlock>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

