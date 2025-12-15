"use client";

import * as React from "react";
import { DocumentationHeader, type NavigationLink } from "@fragment_ui/blocks";
import { ThemeToggle } from "./theme-provider";
import { NavSearch } from "./nav-search";
import { MobileDocumentationSidebar } from "./mobile-documentation-sidebar";
import { Component, AlignHorizontalSpaceAround } from "lucide-react";
import Link from "next/link";
import { Button, NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport } from "@fragment_ui/ui";
import { useLayoutMode } from "./layout-mode-context";

/**
 * Wrapper component that uses DocumentationHeader from @fragment_ui/blocks
 * with portal-specific configuration
 */
export function DocumentationHeaderWrapper() {
  const { toggle, isNarrow } = useLayoutMode();
  const links: NavigationLink[] = [
    { label: "Docs", href: "/docs/get-started/introduction" },
    { label: "Components", href: "/components" },
    { label: "Blocks", href: "/blocks" },
    { label: "Examples", href: "/docs/examples" },
  ];

  const externalLinks: NavigationLink[] = [
    { label: "Admin", href: "/admin", external: true, target: "_blank" },
  ];

  const logo = (
    <Link 
      href="/"
      className="ml-0 lg:ml-[1px] inline-flex items-center justify-center select-none rounded-[var(--radius-sm,8px)] font-medium transition-all duration-[var(--motion-duration-base,200ms)] ease-[var(--motion-easing-ease-in-out,cubic-bezier(0.4,0,0.2,1))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-surface-1)] h-8 w-8 p-0 bg-transparent text-[color:var(--color-fg-base)] hover:bg-[color:var(--color-surface-2)] active:bg-[color:var(--color-surface-2)]"
    >
      <Component className="h-5 w-5 flex-shrink-0" strokeWidth={1.4} />
    </Link>
  );

  const search = <NavSearch />;

  const actions = (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <div className="hidden xl:flex">
        <Button
          variant="ghost"
          size="sm"
          type="button"
          aria-label="Toggle layout"
          className="h-8 w-8 p-0 border-none"
          onClick={toggle}
        >
          <AlignHorizontalSpaceAround className="h-4 w-4" />
        </Button>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => window.open("https://github.com/blazejrzepa/fragment-ui", "_blank", "noopener,noreferrer")}
        aria-label="GitHub"
        title="GitHub"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
        >
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
        </svg>
      </Button>
    </div>
  );

  const mobileMenu = <MobileDocumentationSidebar />;

  const maxWidth = isNarrow ? "1200px" : "1536px";

  // Custom navigation with Tools dropdown
  const customNavigation = (
    <NavigationMenu className="ml-1 lg:ml-2" viewport={false}>
      <NavigationMenuList>
        {links.map((link, index) => (
          <NavigationMenuItem key={`${link.href}-${index}`}>
            <NavigationMenuLink asChild>
              <a href={link.href}>
                {link.label}
              </a>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
        {/* Tools dropdown (placed after internal links, before externals) */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[500px] px-2 py-1.5">
              <div className="grid grid-cols-2 gap-6">
                <div className="min-w-0">
                  <ul className="space-y-0 list-none [&>li]:list-none !pl-0 !mt-0 !mb-0 !pt-0 !pb-0">
                    <li>
                      <NavigationMenuLink asChild className="!flex !flex-col !select-none !space-y-1 !rounded-md !p-2.5 !leading-none !no-underline !outline-none !transition-colors !hover:bg-[color:var(--color-surface-2)] !focus:bg-[color:var(--color-surface-2)] !h-auto !w-full !items-start !justify-start">
                        <Link href="/docs/tools/theme-builder">
                          <div className="text-sm font-medium leading-none text-left text-[color:var(--color-fg-base)]">
                            Theme Builder
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug !text-[color:var(--color-fg-muted)] text-left mt-0.5">
                            Customize and export design tokens for your theme.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild className="!flex !flex-col !select-none !space-y-1 !rounded-md !p-2.5 !leading-none !no-underline !outline-none !transition-colors !hover:bg-[color:var(--color-surface-2)] !focus:bg-[color:var(--color-surface-2)] !h-auto !w-full !items-start !justify-start">
                        <Link href="/docs/tools/bundle-tracking">
                          <div className="text-sm font-medium leading-none text-left text-[color:var(--color-fg-base)]">
                            Bundle Tracking
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug !text-[color:var(--color-fg-muted)] text-left mt-0.5">
                            Monitor and analyze your bundle size over time.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild className="!flex !flex-col !select-none !space-y-1 !rounded-md !p-2.5 !leading-none !no-underline !outline-none !transition-colors !hover:bg-[color:var(--color-surface-2)] !focus:bg-[color:var(--color-surface-2)] !h-auto !w-full !items-start !justify-start">
                        <Link href="/docs/guides/vscode-extension-usage">
                          <div className="text-sm font-medium leading-none text-left text-[color:var(--color-fg-base)]">
                            VS Code Extension
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug !text-[color:var(--color-fg-muted)] text-left mt-0.5">
                            Enhanced development experience in VS Code.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </div>
                <div className="min-w-0">
                  <ul className="space-y-0 list-none [&>li]:list-none !pl-0 !mt-0 !mb-0 !pt-0 !pb-0">
                    <li>
                      <NavigationMenuLink asChild className="!flex !flex-col !select-none !space-y-1 !rounded-md !p-2.5 !leading-none !no-underline !outline-none !transition-colors !hover:bg-[color:var(--color-surface-2)] !focus:bg-[color:var(--color-surface-2)] !h-auto !w-full !items-start !justify-start">
                        <Link href="/docs/guides/cli-usage">
                          <div className="text-sm font-medium leading-none text-left text-[color:var(--color-fg-base)]">
                            CLI
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug !text-[color:var(--color-fg-muted)] text-left mt-0.5">
                            Command-line tools for component management.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild className="!flex !flex-col !select-none !space-y-1 !rounded-md !p-2.5 !leading-none !no-underline !outline-none !transition-colors !hover:bg-[color:var(--color-surface-2)] !focus:bg-[color:var(--color-surface-2)] !h-auto !w-full !items-start !justify-start">
                        <Link href="/docs/guides/figma-code-connect">
                          <div className="text-sm font-medium leading-none text-left text-[color:var(--color-fg-base)]">
                            Figma Code
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug !text-[color:var(--color-fg-muted)] text-left mt-0.5">
                            Connect Figma designs to your code components.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild className="!flex !flex-col !select-none !space-y-1 !rounded-md !p-2.5 !leading-none !no-underline !outline-none !transition-colors !hover:bg-[color:var(--color-surface-2)] !focus:bg-[color:var(--color-surface-2)] !h-auto !w-full !items-start !justify-start">
                        <Link href="/docs/get-started/mcp-server">
                          <div className="text-sm font-medium leading-none text-left text-[color:var(--color-fg-base)]">
                            MCP Server
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug !text-[color:var(--color-fg-muted)] text-left mt-0.5">
                            Model Context Protocol server for AI integration.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {/* External links with separator */}
        <React.Fragment>
          <div
            className="h-4 mx-1 border-l"
            style={{
              borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)",
            }}
            aria-hidden="true"
          />
          {externalLinks.map((link, index) => (
            <NavigationMenuItem key={`${link.href}-${index}`}>
              <NavigationMenuLink asChild>
                <a
                  href={link.href}
                  target={link.target || "_blank"}
                  rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
                >
                  {link.label}
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </React.Fragment>
      </NavigationMenuList>
    </NavigationMenu>
  );

  return (
    <DocumentationHeader
      logo={logo}
      links={links}
      search={search}
      actions={actions}
      mobileMenu={mobileMenu}
      blur={true}
      height="60px"
      maxWidth={maxWidth}
      customNavigation={customNavigation}
    />
  );
}

