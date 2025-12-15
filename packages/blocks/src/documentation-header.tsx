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
  height = "60px",
  maxWidth = "1536px",
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
      className={`fixed top-0 left-0 right-0 z-50 ${className || ""}`}
      style={{
        height,
        backgroundColor: blur
          ? "color-mix(in srgb, var(--background-primary) 60%, transparent)"
          : "var(--background-primary)",
        backdropFilter: blur ? "blur(12px)" : "none",
        WebkitBackdropFilter: blur ? "blur(12px)" : "none",
      }}
    >
      <div className="mx-auto" style={{ maxWidth }}>
        <div
          className="flex w-full items-center justify-between px-3 lg:px-6"
          style={{ height }}
        >
          {/* Left: Logo + Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-2">
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
                              className="h-4 mx-2 border-l"
                              style={{
                                borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)",
                              }}
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
                  className="h-4 border-l"
                  style={{
                    borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)",
                  }}
                />
                <div style={{ marginLeft: "6px" }}>{actions}</div>
              </>
            )}

            {/* Mobile: Actions + Mobile Menu */}
            {isMobile && (
              <>
                {actions && (
                  <div style={{ marginLeft: "6px" }} className="flex-shrink-0">
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

