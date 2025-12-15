import { Metadata } from "next";
import { DocumentationSidebar, type NavigationSection } from "@fragment_ui/blocks";
import { CodeBlock } from "@fragment_ui/ui";

export const metadata: Metadata = {
  title: "DocumentationSidebar",
  description: "Sidebar navigation component for documentation sites with scroll detection and wheel handling",
};

export default function DocumentationSidebarPage() {
  return (
    <div>
      <div className="mt-6">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold" id="page">DocumentationSidebar</h1>
        </div>
        <p className="text-lg text-[color:var(--foreground-secondary)] mb-8">
          Sidebar navigation component for documentation sites with scroll detection, wheel handling, and active state detection.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <ul className="list-disc list-inside space-y-2 text-[color:var(--foreground-secondary)]">
              <li>Scroll detection (detects when main content is at bottom)</li>
              <li>Wheel handling (redirects wheel events to sidebar when at bottom)</li>
              <li>Responsive (hidden on mobile, uses Sheet for mobile menu)</li>
              <li>Active state detection based on current path</li>
              <li>Collapsible sections</li>
              <li>Nested navigation items</li>
              <li>Configurable LinkComponent (Next.js, React Router, etc.)</li>
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
{`import { DocumentationSidebar, type NavigationSection } from "@fragment_ui/blocks";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sections: NavigationSection[] = [
  {
    title: "Get Started",
    items: [
      { title: "Introduction", href: "/docs/get-started/introduction" },
      { title: "Setup", href: "/docs/get-started/setup" },
    ],
  },
  {
    title: "Components",
    items: [
      { title: "Button", href: "/docs/components/button" },
      { title: "Card", href: "/docs/components/card" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  // Next.js Link component wrapper
  const NextLink: React.ComponentType<{
    href: string;
    className?: string;
    children: React.ReactNode;
  }> = ({ href, className, children }) => (
    <Link href={href} className={className}>
      {children}
    </Link>
  );

  return (
    <DocumentationSidebar
      sections={sections}
      currentPath={pathname || undefined}
      scrollDetection={true}
      wheelHandling={true}
      LinkComponent={NextLink}
  );
}`}
            </CodeBlock>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">API Reference</h2>
            <div className="space-y-4">
              <div>
                <h3 id="documentationsidebarprops" className="text-xl font-semibold mb-2">DocumentationSidebarProps</h3>
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
                        <td className="p-2 font-mono text-sm">sections</td>
                        <td className="p-2 text-sm">NavigationSection[]</td>
                        <td className="p-2 text-sm">-</td>
                        <td className="p-2 text-sm">Array of navigation sections</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-mono text-sm">currentPath</td>
                        <td className="p-2 text-sm">string?</td>
                        <td className="p-2 text-sm">-</td>
                        <td className="p-2 text-sm">Current pathname (for active state)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-mono text-sm">scrollDetection</td>
                        <td className="p-2 text-sm">boolean</td>
                        <td className="p-2 text-sm">true</td>
                        <td className="p-2 text-sm">Enable scroll detection</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-mono text-sm">wheelHandling</td>
                        <td className="p-2 text-sm">boolean</td>
                        <td className="p-2 text-sm">true</td>
                        <td className="p-2 text-sm">Enable wheel handling</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-mono text-sm">mobileBreakpoint</td>
                        <td className="p-2 text-sm">number</td>
                        <td className="p-2 text-sm">1024</td>
                        <td className="p-2 text-sm">Mobile breakpoint (in pixels)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-mono text-sm">header</td>
                        <td className="p-2 text-sm">React.ReactNode</td>
                        <td className="p-2 text-sm">-</td>
                        <td className="p-2 text-sm">Sidebar header content</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-mono text-sm">footer</td>
                        <td className="p-2 text-sm">React.ReactNode</td>
                        <td className="p-2 text-sm">-</td>
                        <td className="p-2 text-sm">Sidebar footer content</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-mono text-sm">LinkComponent</td>
                        <td className="p-2 text-sm">React.ComponentType</td>
                        <td className="p-2 text-sm">"a"</td>
                        <td className="p-2 text-sm">Link component (Next.js, React Router, etc.)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6">
                <h3 id="navigationsection" className="text-xl font-semibold mb-2">NavigationSection</h3>
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
                        <td className="p-2 font-mono text-sm">title</td>
                        <td className="p-2 text-sm">string</td>
                        <td className="p-2 text-sm">Section title</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-mono text-sm">items</td>
                        <td className="p-2 text-sm">NavigationItem[]</td>
                        <td className="p-2 text-sm">Array of navigation items</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6">
                <h3 id="navigationitem" className="text-xl font-semibold mb-2">NavigationItem</h3>
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
                        <td className="p-2 font-mono text-sm">title</td>
                        <td className="p-2 text-sm">string</td>
                        <td className="p-2 text-sm">Item title</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-mono text-sm">href</td>
                        <td className="p-2 text-sm">string</td>
                        <td className="p-2 text-sm">Item URL</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-mono text-sm">icon</td>
                        <td className="p-2 text-sm">React.ReactNode</td>
                        <td className="p-2 text-sm">Optional icon</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-mono text-sm">badge</td>
                        <td className="p-2 text-sm">string</td>
                        <td className="p-2 text-sm">Optional badge</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-mono text-sm">items</td>
                        <td className="p-2 text-sm">NavigationItem[]</td>
                        <td className="p-2 text-sm">Nested items</td>
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
{`<DocumentationSidebar
  sections={[
    {
      title: "Get Started",
      items: [
        { title: "Introduction", href: "/docs/introduction" },
        { title: "Setup", href: "/docs/setup" },
      ],
    },
  ]}
  currentPath={pathname}
/>`}
                </CodeBlock>
              </div>

              <div>
                <h3 id="with-nested-items" className="text-xl font-semibold mb-3">With Nested Items</h3>
                <CodeBlock language="tsx" highlightApiUrl="/api/highlight-code">{`<DocumentationSidebar
  sections={[
    {
      title: "Components",
      items: [
        {
          title: "Forms",
          href: "/docs/components/forms",
          items: [
            { title: "Input", href: "/docs/components/input" },
            { title: "Button", href: "/docs/components/button" },
          ],
        },
      ],
    },
  ]}
  currentPath={pathname}
/>`}</CodeBlock>
              </div>

              <div>
                <h3 id="with-icons-and-badges" className="text-xl font-semibold mb-3">With Icons and Badges</h3>
                <CodeBlock language="tsx" highlightApiUrl="/api/highlight-code">
{`<DocumentationSidebar
  sections={[
    {
      title: "Components",
      items: [
        {
          title: "Button",
          href: "/docs/components/button",
          badge: "New",
        },
      ],
    },
  ]}
  currentPath={pathname}
/>`}
                </CodeBlock>
              </div>

              <div>
                <h3 id="with-header-and-footer" className="text-xl font-semibold mb-3">With Header and Footer</h3>
                <CodeBlock language="tsx" highlightApiUrl="/api/highlight-code">{`<DocumentationSidebar
  sections={sections}
  currentPath={pathname}
/>`}</CodeBlock>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

