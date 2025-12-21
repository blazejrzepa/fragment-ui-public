"use client";

import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuViewport,
  Separator,
} from "@fragment_ui/ui";

export interface NavigationLink {
  label: string;
  href: string;
  external?: boolean;
  target?: string;
}

export interface DocumentationHeaderProps {
  /**
   * Logo component or element
   */
  logo?: React.ReactNode;
  /**
   * Array of navigation links
   */
  links?: NavigationLink[];
  /**
   * Custom navigation component (overrides links)
   */
  customNavigation?: React.ReactNode;
  /**
   * Search component
   */
  search?: React.ReactNode;
  /**
   * Actions (ThemeToggle, GitHub link, etc.)
   */
  actions?: React.ReactNode;
  /**
   * Mobile menu component (hamburger menu)
   */
  mobileMenu?: React.ReactNode;
  /**
   * Enable backdrop blur effect
   * @default true
   */
  blur?: boolean;
  /**
   * Height of the header
   * @default "60px"
   */
  height?: string;
  /**
   * Maximum width of the container
   * @default "1536px"
   */
  maxWidth?: string;
  /**
   * Mobile breakpoint (in pixels)
   * @default 1024
   */
  mobileBreakpoint?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * DocumentationHeader - Header component for documentation sites
 * 
 * Features:
 * - Backdrop blur effect
 * - Fixed positioning
 * - Responsive layout (mobile/desktop)
 * - Navigation menu integration
 * - Search integration
 * - Actions (theme toggle, GitHub, etc.)
 * 
 * @example
 * ```tsx
 * <DocumentationHeader
 *   logo={<Logo />}
 *   links={[
 *     { label: "Docs", href: "/docs" },
 *     { label: "Components", href: "/components" },
 *   ]}
 *   search={<Search />}
 *   actions={<ThemeToggle />}
 *   blur={true}
 * />
 * ```
 */
export function DocumentationHeader({
  logo,
  links = [],
  customNavigation,
  search,
  actions,
  mobileMenu,
  blur = true,
  height = "var(--header-height, 60px)",
  maxWidth = "var(--max-width-container, 1536px)",
  mobileBreakpoint = 1024,
  className,
}: DocumentationHeaderProps) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    // Check immediately on mount
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [mobileBreakpoint]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 relative ${blur ? "has-blur" : ""} ${className || ""} h-[var(--header-height,60px)]`}
      style={{
        background: blur
          ? `linear-gradient(to bottom, 
              color-mix(in oklab, var(--background-primary) 60%, transparent) 0%,
              color-mix(in oklab, var(--background-primary) 55%, transparent) 20%,
              color-mix(in oklab, var(--background-primary) 45%, transparent) 40%,
              color-mix(in oklab, var(--background-primary) 35%, transparent) 60%,
              color-mix(in oklab, var(--background-primary) 25%, transparent) 75%,
              color-mix(in oklab, var(--background-primary) 15%, transparent) 85%,
              color-mix(in oklab, var(--background-primary) 8%, transparent) 92%,
              transparent 100%
            )`
          : `linear-gradient(to bottom, 
              var(--background-primary) 0%,
              color-mix(in oklab, var(--background-primary) 90%, transparent) 30%,
              color-mix(in oklab, var(--background-primary) 75%, transparent) 50%,
              color-mix(in oklab, var(--background-primary) 55%, transparent) 65%,
              color-mix(in oklab, var(--background-primary) 35%, transparent) 78%,
              color-mix(in oklab, var(--background-primary) 18%, transparent) 88%,
              color-mix(in oklab, var(--background-primary) 8%, transparent) 94%,
              transparent 100%
            )`,
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
      }}
    >
      <div className="mx-auto relative z-10 max-w-[var(--max-width-container,1536px)]">
        <div
          className="flex w-full items-center justify-between px-3 lg:px-6 relative z-10 h-[var(--header-height,60px)]"
        >
          {/* Left: Logo + Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-2 ml-1">
            {logo}
            {/* Custom Navigation or Default Navigation Links (desktop only) */}
            {!isMobile && customNavigation ? (
              customNavigation
            ) : (
              !isMobile && links.length > 0 && (
                <NavigationMenu className="ml-1 lg:ml-2">
                  <NavigationMenuList className="gap-1">
                    {links.map((link, index) => {
                      // Find the index of the first external link
                      const firstExternalIndex = links.findIndex((l) => l.external);
                      // Show separator before the first external link (if it exists and we're at that index)
                      const showSeparator = firstExternalIndex > 0 && index === firstExternalIndex;

                      return (
                        <React.Fragment key={`${link.href}-${index}`}>
                          {showSeparator && (
                            <div
                              className="h-4 mx-2 border-l border-[color:color-mix(in_oklab,var(--foreground-primary)_10%,transparent)]"
                            />
                          )}
                          <NavigationMenuItem>
                            <NavigationMenuLink asChild className="py-1">
                              {link.external ? (
                                <a
                                  href={link.href}
                                  target={link.target || "_blank"}
                                  rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
                                  className="rounded-md px-2 py-1"
                                >
                                  {link.label}
                                </a>
                              ) : (
                                <a href={link.href} className="rounded-md px-2 py-1">
                                  {link.label}
                                </a>
                              )}
                            </NavigationMenuLink>
                          </NavigationMenuItem>
                        </React.Fragment>
                      );
                    })}
                  </NavigationMenuList>
                </NavigationMenu>
              )
            )}
          </div>

          {/* Center: Search (mobile) / Right: Search + Actions + Mobile Menu */}
          <div className="flex items-center flex-1 lg:flex-none justify-end lg:justify-start min-w-0">
            {/* Search */}
            {search && (
              <div
                className={
                  isMobile
                    ? "flex-1 min-w-0 max-w-[calc(100%-80px)] ml-2 mr-1"
                    : "mr-4 flex-shrink-0 w-56 lg:w-64"
                }
              >
                {search}
              </div>
            )}

            {/* Desktop: Separator + Actions */}
            {!isMobile && actions && (
              <>
                <div
                  className="h-4 border-l border-[color:color-mix(in_oklab,var(--foreground-primary)_10%,transparent)]"
                />
                <div className="ml-[6px]">{actions}</div>
              </>
            )}

            {/* Mobile: Actions + Mobile Menu */}
            {isMobile && (
              <>
                {actions && (
                  <div className="ml-[6px] flex-shrink-0">
                    {actions}
                  </div>
                )}
                {mobileMenu && (
                  <div className="ml-2 flex-shrink-0">{mobileMenu}</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

