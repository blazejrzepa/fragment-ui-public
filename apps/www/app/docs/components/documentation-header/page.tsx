import { Metadata } from "next";
import { DocumentationHeader } from "@fragment_ui/blocks";
import { CodeBlock } from "@fragment_ui/ui";

export const metadata: Metadata = {
  title: "DocumentationHeader",
  description: "Header component for documentation sites with backdrop blur, fixed positioning, and responsive layout",
};

export default function DocumentationHeaderPage() {
  return (
    <div>
      <div className="mt-6">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold" id="page">DocumentationHeader</h1>
        </div>
        <p className="text-lg text-[color:var(--foreground-secondary)] mb-8">
          Header component for documentation sites with backdrop blur, fixed positioning, and responsive layout.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <ul className="list-disc list-inside space-y-2 text-[color:var(--foreground-secondary)]">
              <li>Backdrop blur effect</li>
              <li>Fixed positioning</li>
              <li>Responsive layout (mobile/desktop)</li>
              <li>Navigation menu integration</li>
              <li>Search integration</li>
              <li>Actions (theme toggle, GitHub, etc.)</li>
              <li>Mobile menu support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Installation</h2>
            <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">
{`pnpm add @fragment_ui/blocks`}
            </CodeBlock>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Usage</h2>
            <CodeBlock language="tsx" highlightApiUrl="/api/highlight-code">
{`import { DocumentationHeader, type NavigationLink } from "@fragment_ui/blocks";
import { Search } from "@fragment_ui/ui";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

const links: NavigationLink[] = [
  { label: "Docs", href: "/docs" },
  { label: "Components", href: "/components" },
  { label: "Blocks", href: "/blocks" },
  { label: "Examples", href: "/examples" },
  { label: "GitHub", href: "https://github.com/...", external: true },
];

export function Header() {
  return (
    <DocumentationHeader
      links={links}
      blur={true}
      height="60px"
      maxWidth="1536px"
  );
}`}
            </CodeBlock>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">API Reference</h2>
            <div className="space-y-4">
              <div>
                <h3 id="documentationheaderprops" className="text-xl font-semibold mb-2">DocumentationHeaderProps</h3>
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
                        <td className="p-2 font-mono text-sm">logo</td>
                        <td className="p-2 text-sm">React.ReactNode</td>
                        <td className="p-2 text-sm">-</td>
                        <td className="p-2 text-sm">Logo component or element</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-mono text-sm">links</td>
                        <td className="p-2 text-sm">NavigationLink[]</td>
                        <td className="p-2 text-sm">[]</td>
                        <td className="p-2 text-sm">Array of navigation links</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-mono text-sm">search</td>
                        <td className="p-2 text-sm">React.ReactNode</td>
                        <td className="p-2 text-sm">-</td>
                        <td className="p-2 text-sm">Search component</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-mono text-sm">actions</td>
                        <td className="p-2 text-sm">React.ReactNode</td>
                        <td className="p-2 text-sm">-</td>
                        <td className="p-2 text-sm">Actions (ThemeToggle, GitHub link, etc.)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-mono text-sm">mobileMenu</td>
                        <td className="p-2 text-sm">React.ReactNode</td>
                        <td className="p-2 text-sm">-</td>
                        <td className="p-2 text-sm">Mobile menu component (hamburger menu)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-mono text-sm">blur</td>
                        <td className="p-2 text-sm">boolean</td>
                        <td className="p-2 text-sm">true</td>
                        <td className="p-2 text-sm">Enable backdrop blur effect</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-mono text-sm">height</td>
                        <td className="p-2 text-sm">string</td>
                        <td className="p-2 text-sm">"60px"</td>
                        <td className="p-2 text-sm">Height of the header</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-mono text-sm">maxWidth</td>
                        <td className="p-2 text-sm">string</td>
                        <td className="p-2 text-sm">"1536px"</td>
                        <td className="p-2 text-sm">Maximum width of the container</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-mono text-sm">mobileBreakpoint</td>
                        <td className="p-2 text-sm">number</td>
                        <td className="p-2 text-sm">1024</td>
                        <td className="p-2 text-sm">Mobile breakpoint (in pixels)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6">
                <h3 id="navigationlink" className="text-xl font-semibold mb-2">NavigationLink</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Prop</th>
                        <th className="text-left p-2">Type</th>
                        <th className="text-left p-2">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2 font-mono text-sm">label</td>
                        <td className="p-2 text-sm">string</td>
                        <td className="p-2 text-sm">Link label</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-mono text-sm">href</td>
                        <td className="p-2 text-sm">string</td>
                        <td className="p-2 text-sm">Link URL</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-mono text-sm">external</td>
                        <td className="p-2 text-sm">boolean</td>
                        <td className="p-2 text-sm">Whether the link is external</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-mono text-sm">target</td>
                        <td className="p-2 text-sm">string</td>
                        <td className="p-2 text-sm">Link target (e.g., "_blank")</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Examples</h2>
            
            <div className="space-y-6">
              <div>
                <h3 id="basic-usage" className="text-xl font-semibold mb-3">Basic Usage</h3>
                <CodeBlock language="tsx" highlightApiUrl="/api/highlight-code">
{`<DocumentationHeader
  links={[
    { label: "Docs", href: "/docs" },
    { label: "Components", href: "/components" },
  ]}
/>`}
                </CodeBlock>
              </div>

              <div>
                <h3 id="with-external-links" className="text-xl font-semibold mb-3">With External Links</h3>
                <CodeBlock language="tsx" highlightApiUrl="/api/highlight-code">{`<DocumentationHeader
  links={[
    { label: "Docs", href: "/docs" },
    { label: "GitHub", href: "https://github.com/...", external: true },
    { label: "Admin", href: "/admin", external: true, target: "_blank" },
  ]}
/>`}</CodeBlock>
              </div>

              <div>
                <h3 id="custom-height-and-max-width" className="text-xl font-semibold mb-3">Custom Height and Max Width</h3>
                <CodeBlock language="tsx" highlightApiUrl="/api/highlight-code">
{`<DocumentationHeader
  links={links}
  height="80px"
  maxWidth="1920px"
/>`}
                </CodeBlock>
              </div>

              <div>
                <h3 id="without-blur" className="text-xl font-semibold mb-3">Without Blur</h3>
                <CodeBlock language="tsx" highlightApiUrl="/api/highlight-code">
{`<DocumentationHeader
  links={links}
  blur={false}
/>`}
                </CodeBlock>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

