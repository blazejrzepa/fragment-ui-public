"use client";

import * as React from "react";
import clsx from "clsx";

export interface AppShellProps {
  /**
   * Sidebar navigation content
   */
  sidebar?: React.ReactNode;
  /**
   * Sidebar header content (logo, title, etc.)
   */
  sidebarHeader?: React.ReactNode;
  /**
   * Sidebar footer content (user menu, etc.)
   */
  sidebarFooter?: React.ReactNode;
  /**
   * Top header content (navigation, search, user menu, etc.)
   */
  header?: React.ReactNode;
  /**
   * Main content area
   */
  children?: React.ReactNode;
  /**
   * Sidebar position
   * @default "left"
   */
  sidebarPosition?: "left" | "right";
  /**
   * Sidebar width
   * @default "md"
   */
  sidebarWidth?: "sm" | "md" | "lg";
  /**
   * Maximum width of main content
   * @default "full"
   */
  contentMaxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  /**
   * Additional className for main content area
   */
  contentClassName?: string;
  /**
   * Additional className for root container
   */
  className?: string;
}

/**
 * AppShell - Complete application shell with sidebar, header, and content area
 * 
 * Provides a standard layout structure for applications with:
 * - Collapsible sidebar navigation
 * - Top header bar
 * - Main content area
 * 
 * @example
 * ```tsx
 * <AppShell
 *   sidebarHeader={<Logo />}
 *   sidebar={<NavigationMenu />}
 *   sidebarFooter={<UserMenu />}
 *   header={<NavigationHeader />}
 * >
 *   <YourContent />
 * </AppShell>
 * ```
 */
export function AppShell({
  sidebar,
  sidebarHeader,
  sidebarFooter,
  header,
  children,
  sidebarPosition = "left",
  sidebarWidth = "md",
  contentMaxWidth = "full",
  contentClassName,
  className,
}: AppShellProps) {
  const widthClasses = {
    sm: "w-48",
    md: "w-64",
    lg: "w-80",
  };

  const paddingLeftClasses = {
    sm: "pl-48",
    md: "pl-64",
    lg: "pl-80",
  };

  const maxWidthClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    full: "max-w-full",
  };

  const hasRoundedCorners = className?.includes("rounded-2xl");
  // Remove all height-related classes when in embedded mode (rounded-2xl)
  const cleanClassName = hasRoundedCorners 
    ? className?.replace(/h-screen|h-\[|h-auto|overflow-hidden|min-h-|max-h-/g, '').trim().replace(/\s+/g, ' ')
    : className;
  
  return (
    <div 
      className={clsx(
        "flex flex-col", 
        !hasRoundedCorners && "bg-[color:var(--background-primary)]",
        cleanClassName
      )}
      style={!hasRoundedCorners ? { marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 } : undefined}
    >
      {/* Top Header */}
      {header && (
        <header className={clsx(
          "flex-shrink-0 z-40 border-b border-[color:var(--color-border-base)] w-full",
          !hasRoundedCorners && "bg-[color:var(--background-primary)]"
        )}>
          <div className="flex h-16 items-center px-4">
            <div className="flex-1">{header}</div>
          </div>
        </header>
      )}

      <div className={clsx(
        "flex w-full", 
        !hasRoundedCorners && "min-h-screen",
        !hasRoundedCorners && sidebar && sidebarPosition === "left" && paddingLeftClasses[sidebarWidth]
      )}>
        {/* Sidebar */}
        {sidebar && (
          <aside
            className={clsx(
              "flex flex-col border-r border-[color:var(--color-border-base)] bg-[color:var(--color-surface-1)]",
              widthClasses[sidebarWidth],
              !hasRoundedCorners && "fixed top-0 left-0 h-screen z-30"
            )}
            style={!hasRoundedCorners ? { 
              left: 0, 
              top: 0, 
              margin: 0,
              marginLeft: 0, 
              paddingLeft: 0,
              position: 'fixed',
              boxSizing: 'border-box',
              transform: 'translateX(0)',
              inset: '0px auto auto 0px'
            } : undefined}
          >
            {sidebarHeader && (
              <div className="flex flex-col gap-2 p-4 border-b border-[color:var(--color-border-base)] bg-[color:var(--color-surface-1)] flex-shrink-0">
                {sidebarHeader}
              </div>
            )}
            <nav 
              className="flex-1 min-h-0 overflow-y-auto p-4 bg-[color:var(--color-surface-1)]"
              style={{ height: '100%' }}
            >
              {sidebar}
            </nav>
            {sidebarFooter && (
              <div 
                className="flex flex-col gap-2 px-4 pt-4 pb-3 border-t border-[color:var(--color-border-base)] bg-[color:var(--color-surface-1)] flex-shrink-0 mt-auto"
                style={{ height: 'fit-content', paddingTop: '16px' }}
              >
                {sidebarFooter}
              </div>
            )}
          </aside>
        )}

        {/* Main Content */}
        <main
          className={clsx(
            "w-full",
            contentMaxWidth !== "full" && "mx-auto",
            maxWidthClasses[contentMaxWidth],
            !hasRoundedCorners && "bg-[color:var(--background-primary)]",
            contentClassName
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

