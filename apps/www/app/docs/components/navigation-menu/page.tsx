"use client";

import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport, DocumentContent, CodeBlock, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";

export default function NavigationMenuPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Navigation Menu</h1>
      </div>
      <p className="mb-6 intro-text">
        A collection of links for navigating websites with support for dropdown menus.
      </p>
      
      {/* Preview */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-start min-h-[400px] pt-8 px-10 pb-10">
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
                    <div className="w-[500px] px-2 py-1.5">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="min-w-0">
                          <ul className="space-y-0 list-none [&>li]:list-none !pl-0 !mt-0 !mb-0 !pt-0 !pb-0" style={{ paddingLeft: 0 }}>
                            <li>
                              <NavigationMenuLink asChild className="!flex !flex-col !select-none !space-y-1 !rounded-md !p-2.5 !leading-none !no-underline !outline-none !transition-colors !hover:bg-[color:var(--color-surface-2)] !focus:bg-[color:var(--color-surface-2)] !h-auto !w-full !items-start !justify-start">
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
                            <li>
                              <NavigationMenuLink asChild className="!flex !flex-col !select-none !space-y-1 !rounded-md !p-2.5 !leading-none !no-underline !outline-none !transition-colors !hover:bg-[color:var(--color-surface-2)] !focus:bg-[color:var(--color-surface-2)] !h-auto !w-full !items-start !justify-start">
                                <a href="#">
                                  <div className="text-sm font-medium leading-none text-left text-[color:var(--color-fg-base)]">
                                    Theming &amp; Modes
                                  </div>
                                  <p className="line-clamp-2 text-sm leading-snug !text-[color:var(--color-fg-muted)] text-left mt-0.5">
                                    Configure themes and support for light and dark modes.
                                  </p>
                                </a>
                              </NavigationMenuLink>
                            </li>
                            <li>
                              <NavigationMenuLink asChild className="!flex !flex-col !select-none !space-y-1 !rounded-md !p-2.5 !leading-none !no-underline !outline-none !transition-colors !hover:bg-[color:var(--color-surface-2)] !focus:bg-[color:var(--color-surface-2)] !h-auto !w-full !items-start !justify-start">
                                <a href="#">
                                  <div className="text-sm font-medium leading-none text-left text-[color:var(--color-fg-base)]">
                                    Semantic Colors
                                  </div>
                                  <p className="line-clamp-2 text-sm leading-snug !text-[color:var(--color-fg-muted)] text-left mt-0.5">
                                    Understand semantic color system and usage patterns.
                                  </p>
                                </a>
                              </NavigationMenuLink>
                            </li>
                          </ul>
                        </div>
                        <div className="min-w-0">
                          <ul className="space-y-0 list-none [&>li]:list-none !pl-0 !mt-0 !mb-0 !pt-0 !pb-0" style={{ paddingLeft: 0 }}>
                            <li>
                              <NavigationMenuLink asChild className="!flex !flex-col !select-none !space-y-1 !rounded-md !p-2.5 !leading-none !no-underline !outline-none !transition-colors !hover:bg-[color:var(--color-surface-2)] !focus:bg-[color:var(--color-surface-2)] !h-auto !w-full !items-start !justify-start">
                                <a href="#">
                                  <div className="text-sm font-medium leading-none text-left text-[color:var(--color-fg-base)]">
                                    Examples
                                  </div>
                                  <p className="line-clamp-2 text-sm leading-snug !text-[color:var(--color-fg-muted)] text-left mt-0.5">
                                    Browse code examples and implementation patterns.
                                  </p>
                                </a>
                              </NavigationMenuLink>
                            </li>
                            <li>
                              <NavigationMenuLink asChild className="!flex !flex-col !select-none !space-y-1 !rounded-md !p-2.5 !leading-none !no-underline !outline-none !transition-colors !hover:bg-[color:var(--color-surface-2)] !focus:bg-[color:var(--color-surface-2)] !h-auto !w-full !items-start !justify-start">
                                <a href="#">
                                  <div className="text-sm font-medium leading-none text-left text-[color:var(--color-fg-base)]">
                                    Changelog
                                  </div>
                                  <p className="line-clamp-2 text-sm leading-snug !text-[color:var(--color-fg-muted)] text-left mt-0.5">
                                    View version history and recent updates.
                                  </p>
                                </a>
                              </NavigationMenuLink>
                            </li>
                            <li>
                              <NavigationMenuLink asChild className="!flex !flex-col !select-none !space-y-1 !rounded-md !p-2.5 !leading-none !no-underline !outline-none !transition-colors !hover:bg-[color:var(--color-surface-2)] !focus:bg-[color:var(--color-surface-2)] !h-auto !w-full !items-start !justify-start">
                                <a href="#">
                                  <div className="text-sm font-medium leading-none text-left text-[color:var(--color-fg-base)]">
                                    API Reference
                                  </div>
                                  <p className="line-clamp-2 text-sm leading-snug !text-[color:var(--color-fg-muted)] text-left mt-0.5">
                                    Complete API documentation and type definitions.
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
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[300px] px-2 py-1.5">
                      <ul className="space-y-0 list-none [&>li]:list-none !pl-0 !mt-0 !mb-0 !pt-0 !pb-0" style={{ paddingLeft: 0 }}>
                        <li>
                          <NavigationMenuLink asChild className="!flex !flex-col !select-none !space-y-1 !rounded-md !p-2.5 !leading-none !no-underline !outline-none !transition-colors !hover:bg-[color:var(--color-surface-2)] !focus:bg-[color:var(--color-surface-2)] !h-auto !w-full !items-start !justify-start">
                            <a href="#">
                              <div className="text-sm font-medium leading-none text-left text-[color:var(--color-fg-base)]">
                                Documentation
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug !text-[color:var(--color-fg-muted)] text-left mt-0.5">
                                Complete guides and API reference for all components.
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild className="!flex !flex-col !select-none !space-y-1 !rounded-md !p-2.5 !leading-none !no-underline !outline-none !transition-colors !hover:bg-[color:var(--color-surface-2)] !focus:bg-[color:var(--color-surface-2)] !h-auto !w-full !items-start !justify-start">
                            <a href="#">
                              <div className="text-sm font-medium leading-none text-left text-[color:var(--color-fg-base)]">
                                Blog
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug !text-[color:var(--color-fg-muted)] text-left mt-0.5">
                                Latest articles, tutorials, and updates from our team.
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild className="!flex !flex-col !select-none !space-y-1 !rounded-md !p-2.5 !leading-none !no-underline !outline-none !transition-colors !hover:bg-[color:var(--color-surface-2)] !focus:bg-[color:var(--color-surface-2)] !h-auto !w-full !items-start !justify-start">
                            <a href="#">
                              <div className="text-sm font-medium leading-none text-left text-[color:var(--color-fg-base)]">
                                Support
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug !text-[color:var(--color-fg-muted)] text-left mt-0.5">
                                Get help from our community and support team.
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild className="!flex !flex-col !select-none !space-y-1 !rounded-md !p-2.5 !leading-none !no-underline !outline-none !transition-colors !hover:bg-[color:var(--color-surface-2)] !focus:bg-[color:var(--color-surface-2)] !h-auto !w-full !items-start !justify-start">
                            <a href="#">
                              <div className="text-sm font-medium leading-none text-left text-[color:var(--color-fg-base)]">
                                GitHub
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug !text-[color:var(--color-fg-muted)] text-left mt-0.5">
                                Contribute to the project on GitHub.
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@fragment_ui/ui";

<NavigationMenu viewport={false}>
  <NavigationMenuList>
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
        <div className="w-[500px] px-2 py-1.5">
          <div className="grid grid-cols-2 gap-6">
            <div className="min-w-0">
              <ul className="space-y-0 list-none [&>li]:list-none !pl-0 !mt-0 !mb-0 !pt-0 !pb-0">
                <li>
                  <NavigationMenuLink asChild className="!flex !flex-col !select-none !space-y-1 !rounded-md !p-2.5 !leading-none !no-underline !outline-none !transition-colors !hover:bg-[color:var(--color-surface-2)] !focus:bg-[color:var(--color-surface-2)] !h-auto !w-full !items-start !justify-start">
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
                <li>
                  <NavigationMenuLink asChild className="!flex !flex-col !select-none !space-y-1 !rounded-md !p-2.5 !leading-none !no-underline !outline-none !transition-colors !hover:bg-[color:var(--color-surface-2)] !focus:bg-[color:var(--color-surface-2)] !h-auto !w-full !items-start !justify-start">
                    <a href="#">
                      <div className="text-sm font-medium leading-none text-left text-[color:var(--color-fg-base)]">
                        Theming & Modes
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug !text-[color:var(--color-fg-muted)] text-left mt-0.5">
                        Configure themes and support for light and dark modes.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </div>
            <div className="min-w-0">
              <ul className="space-y-0 list-none [&>li]:list-none !pl-0 !mt-0 !mb-0 !pt-0 !pb-0">
                <li>
                  <NavigationMenuLink asChild className="!flex !flex-col !select-none !space-y-1 !rounded-md !p-2.5 !leading-none !no-underline !outline-none !transition-colors !hover:bg-[color:var(--color-surface-2)] !focus:bg-[color:var(--color-surface-2)] !h-auto !w-full !items-start !justify-start">
                    <a href="#">
                      <div className="text-sm font-medium leading-none text-left text-[color:var(--color-fg-base)]">
                        Examples
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug !text-[color:var(--color-fg-muted)] text-left mt-0.5">
                        Browse code examples and implementation patterns.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild className="!flex !flex-col !select-none !space-y-1 !rounded-md !p-2.5 !leading-none !no-underline !outline-none !transition-colors !hover:bg-[color:var(--color-surface-2)] !focus:bg-[color:var(--color-surface-2)] !h-auto !w-full !items-start !justify-start">
                    <a href="#">
                      <div className="text-sm font-medium leading-none text-left text-[color:var(--color-fg-base)]">
                        API Reference
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug !text-[color:var(--color-fg-muted)] text-left mt-0.5">
                        Complete API documentation and type definitions.
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
</NavigationMenu>`}</CodeBlock>
        </div>
      </div>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">
        {`npx shadcn@latest add https://fragmentui.com/r/navigation-menu.json`}
      </CodeBlock>

      <Collapsible>
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <p><strong>Intent</strong></p>
          <p>
            <code>NavigationMenu</code> is a navigation component for building website navigation menus with dropdown support.<br />
            Use it when you need to create top-level navigation with dropdown menus, mega menus, or complex navigation structures. The component provides keyboard navigation, accessibility features, and flexible styling options.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Website header navigation</li>
            <li>Top-level site navigation with dropdowns</li>
            <li>Mega menu implementations</li>
            <li>Complex navigation structures with multiple levels</li>
            <li>Navigation menus with categorized links</li>
            <li>Documentation site navigation</li>
            <li>Any scenario requiring accessible navigation menus</li>
          </ul>

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "NavigationMenu"</code>.
          </p>
          <p>Props for <code>NavigationMenu</code>:</p>
          <ul>
            <li><code>variant?</code> – Menu variant: "default" | "header" (optional, default: "default")</li>
            <li><code>blur?</code> – Enable backdrop blur: <code>boolean</code> (optional, only applies when variant="header")</li>
            <li><code>height?</code> – Header height: <code>string</code> (optional, default: "60px", only applies when variant="header")</li>
            <li><code>maxWidth?</code> – Maximum container width: <code>string</code> (optional, default: "1536px", only applies when variant="header")</li>
            <li><code>className?</code> – Additional CSS classes (optional)</li>
          </ul>
          <p><strong>Note:</strong> NavigationMenu consists of multiple sub-components: <code>NavigationMenuList</code>, <code>NavigationMenuItem</code>, <code>NavigationMenuTrigger</code>, <code>NavigationMenuContent</code>, <code>NavigationMenuLink</code>, and <code>NavigationMenuViewport</code>. Always include <code>NavigationMenuViewport</code> when using dropdown menus.</p>

          <p><strong>Example</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "NavigationMenu",
  "props": {
    "variant": "default"
  },
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

      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/core-navigation-menu--docs">Storybook</StorybookLink>
        </li>
      </ul>


    </DocumentContent>
  );
}
