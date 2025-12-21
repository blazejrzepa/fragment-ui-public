"use client";

import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport, DocumentContent, CodeBlock, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const navigationMenuCode = `import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@fragment_ui/ui";

export function NavigationMenuDemo() {
  return (
    <NavigationMenu viewport={false} className="!justify-center !ml-0">
      <NavigationMenuList className="!ml-0">
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <a href="#">Components</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <a href="#">Blocks</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Docs</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[500px] px-[var(--space-2)] py-[var(--space-1-5)]">
              <div className="grid grid-cols-2 gap-[var(--space-6)]">
                <div className="min-w-0">
                  <ul className="space-y-0 list-none [&>li]:list-none !pl-0 !mt-0 !mb-0 !pt-0 !pb-0">
                    <li>
                      <NavigationMenuLink asChild className="!flex !flex-col !select-none !space-y-[var(--space-1)] !rounded-[var(--radius-md)] !p-[var(--space-2-5)] !leading-none !no-underline !outline-none !transition-colors !hover:bg-[color:var(--color-surface-2)] !focus:bg-[color:var(--color-surface-2)] !h-auto !w-full !items-start !justify-start">
                        <a href="#">
                          <div className="text-sm font-medium leading-none text-left text-[color:var(--color-fg-base)]">
                            Design Tokens
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug !text-[color:var(--color-fg-muted)] text-left mt-0.5">
                            Learn about design tokens and how to use them in your projects.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}`;

export default function NavigationMenuPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-[var(--space-4)] mb-[var(--space-1)]">
        <h1 id="navigation-menu" className="text-[length:var(--typography-display-md-size)] font-medium">Navigation Menu</h1>
      </div>
      <p className="mb-[var(--space-6)] intro-text">Build primary navigation with nested links.</p>
      
      <ExampleSection
        id="navigation-menu-example"
        title="Example"
        code={navigationMenuCode}
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <div className="w-full max-w-4xl flex justify-center">
          <NavigationMenu viewport={false} className="!justify-center !ml-0">
            <NavigationMenuList className="!ml-0">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a href="#">Components</a>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a href="#">Blocks</a>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  Docs
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[500px] px-[var(--space-2)] py-[var(--space-1-5)]">
                    <div className="grid grid-cols-2 gap-[var(--space-6)]">
                      <div className="min-w-0">
                        <ul className="space-y-0 list-none [&>li]:list-none !pl-0 !mt-0 !mb-0 !pt-0 !pb-0">
                          <li>
                            <NavigationMenuLink asChild className="!flex !flex-col !select-none !space-y-[var(--space-1)] !rounded-[var(--radius-md)] !p-[var(--space-2-5)] !leading-none !no-underline !outline-none !transition-colors !hover:bg-[color:var(--color-surface-2)] !focus:bg-[color:var(--color-surface-2)] !h-auto !w-full !items-start !justify-start">
                              <a href="#">
                                <div className="text-[length:var(--typography-size-sm)] font-medium leading-none text-left text-[color:var(--color-fg-base)]">
                                  Design Tokens
                                </div>
                                <p className="line-clamp-2 text-[length:var(--typography-size-sm)] leading-snug !text-[color:var(--color-fg-muted)] text-left mt-0.5">
                                  Learn about design tokens and how to use them in your projects.
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          </div>
        </div>
      </ExampleSection>

      <h2 id="api-reference">API Reference</h2>
      <div className="mt-[var(--space-4)] border border-[color:var(--color-border-base)] rounded-[var(--radius-lg)] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Component</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Props</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Default</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>NavigationMenu</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>variant?, blur?, height?, maxWidth?, viewport?, className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Root navigation menu component</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>NavigationMenuList</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Container for navigation menu items</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>NavigationMenuItem</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>value?, className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Individual navigation menu item</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>NavigationMenuTrigger</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className?, children</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Trigger button for dropdown menus</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>NavigationMenuContent</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Content container for dropdown menus</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>NavigationMenuLink</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>asChild?, href?, className?, children</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Navigation link component</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>NavigationMenuViewport</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Viewport for positioning dropdown content (required when using dropdowns)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add navigation-menu`}
      </CodeBlock>

      <Collapsible className="mt-[var(--space-8)]">
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation" className="m-0">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-[var(--space-4)]">
          <h3>Intent</h3>
          <p>
            <code>NavigationMenu</code> is a navigation component for building website navigation menus with dropdown support. Use it when you need to create top-level navigation with dropdown menus, mega menus, or complex navigation structures. The component provides keyboard navigation, accessibility features, and flexible styling options.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Website header navigation</li>
            <li>Top-level site navigation with dropdowns</li>
            <li>Mega menu implementations</li>
            <li>Complex navigation structures with multiple levels</li>
            <li>Navigation menus with categorized links</li>
            <li>Documentation site navigation</li>
            <li>Any scenario requiring accessible navigation menus</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "NavigationMenu"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <p>Props for <code>NavigationMenu</code>:</p>
          <ul>
            <li><code>variant?</code> – "default" | "header" (default: "default"). Navigation menu variant (optional)</li>
            <li><code>blur?</code> – boolean (default: false). Enable backdrop blur effect (only applies when variant="header") (optional)</li>
            <li><code>height?</code> – string (default: "60px"). Height of the header (only applies when variant="header") (optional)</li>
            <li><code>maxWidth?</code> – string (default: "1536px"). Maximum width of the container (only applies when variant="header") (optional)</li>
            <li><code>viewport?</code> – boolean (default: true). Whether to render the Radix viewport (optional)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>
          <p><strong>Note:</strong> NavigationMenu consists of multiple sub-components: <code>NavigationMenuList</code>, <code>NavigationMenuItem</code>, <code>NavigationMenuTrigger</code>, <code>NavigationMenuContent</code>, <code>NavigationMenuLink</code>, and <code>NavigationMenuViewport</code>. Always include <code>NavigationMenuViewport</code> when using dropdown menus.</p>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "NavigationMenu",
  "children": [
    {
      "type": "component",
      "component": "NavigationMenuList",
      "children": [
        {
          "type": "component",
          "component": "NavigationMenuItem",
          "children": [
            {
              "type": "component",
              "component": "NavigationMenuLink",
              "props": {
                "href": "/components"
              },
              "children": "Components"
            }
          ]
        }
      ]
    },
    {
      "type": "component",
      "component": "NavigationMenuViewport"
    }
  ]
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
