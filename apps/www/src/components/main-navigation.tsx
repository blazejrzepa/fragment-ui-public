"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@fragment_ui/ui";
import { NavSearch } from "./nav-search";
import { VersionSwitcherWrapper as VersionSwitcher } from "./version-switcher-wrapper";
import { ThemeToggle } from "./theme-provider";
import { Component } from "lucide-react";

export function MainNavigation() {
  return (
    <nav className="border-b border-[color:var(--color-border-base)]">
      <div className="mx-auto max-w-5xl px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-xl font-semibold">
              <Component className="h-5 w-5" />
              <span>Fragment UI</span>
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                {/* Components */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/components" className="px-3 py-2 text-sm font-medium hover:text-[color:var(--color-brand-primary)] transition-colors">
                      Components
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Blocks */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/blocks" className="px-3 py-2 text-sm font-medium hover:text-[color:var(--color-brand-primary)] transition-colors">
                      Blocks
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Docs */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="px-3 py-2 text-sm font-medium">
                    Docs
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-4 space-y-2">
                      <div>
                        <h3 className="text-sm font-semibold mb-2">Foundations</h3>
                        <ul className="space-y-1">
                          <li>
                            <Link href="/docs/foundations/tokens" className="text-sm hover:text-[color:var(--color-brand-primary)] block py-1">
                              Design Tokens
                            </Link>
                          </li>
                          <li>
                            <Link href="/docs/foundations/theming" className="text-sm hover:text-[color:var(--color-brand-primary)] block py-1">
                              Theming &amp; Modes
                            </Link>
                          </li>
                          <li>
                            <Link href="/docs/foundations/semantic-colors" className="text-sm hover:text-[color:var(--color-brand-primary)] block py-1">
                              Semantic Colors
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div className="border-t border-[color:var(--color-border-base)] pt-2">
                        <h3 className="text-sm font-semibold mb-2">Resources</h3>
                        <ul className="space-y-1">
                          <li>
                            <Link href="/docs/examples" className="text-sm hover:text-[color:var(--color-brand-primary)] block py-1">
                              Examples
                            </Link>
                          </li>
                          <li>
                            <Link href="/docs/migrations" className="text-sm hover:text-[color:var(--color-brand-primary)] block py-1">
                              Migrations
                            </Link>
                          </li>
                          <li>
                            <Link href="/docs/changelog" className="text-sm hover:text-[color:var(--color-brand-primary)] block py-1">
                              Changelog
                            </Link>
                          </li>
                          <li>
                            <Link href="/docs/compare" className="text-sm hover:text-[color:var(--color-brand-primary)] block py-1">
                              Compare Versions
                            </Link>
                          </li>
                          <li>
                            <Link href="/docs/api" className="text-sm hover:text-[color:var(--color-brand-primary)] block py-1">
                              API Reference
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Tools */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="px-3 py-2 text-sm font-medium">
                    Tools
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[300px] p-4 space-y-2">
                      <ul className="space-y-1">
                        <li>
                          <Link href="/docs/tools/bundle-tracking" className="text-sm hover:text-[color:var(--color-brand-primary)] block py-1">
                            Bundle Tracking
                          </Link>
                        </li>
                        <li>
                          <Link href="/docs/tools/component-comparison" className="text-sm hover:text-[color:var(--color-brand-primary)] block py-1">
                            Component Comparison
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <VersionSwitcher />
            <NavSearch />
          </div>
        </div>
      </div>
    </nav>
  );
}

