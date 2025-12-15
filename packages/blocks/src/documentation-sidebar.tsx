"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@fragment_ui/ui";
import clsx from "clsx";

export interface NavigationItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
  items?: NavigationItem[];
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

export interface DocumentationSidebarProps {
  /**
   * Array of navigation sections
   */
  sections: NavigationSection[];
  /**
   * Current pathname (for active state)
   */
  currentPath?: string;
  /**
   * Enable scroll detection (redirect wheel events when at bottom)
   * @default true
   */
  scrollDetection?: boolean;
  /**
   * Enable wheel handling (redirect wheel events to sidebar when at bottom)
   * @default true
   */
  wheelHandling?: boolean;
  /**
   * Mobile breakpoint (in pixels)
   * @default 1024
   */
  mobileBreakpoint?: number;
  /**
   * Sidebar header content (logo, title, etc.)
   */
  header?: React.ReactNode;
  /**
   * Sidebar footer content (user menu, etc.)
   */
  footer?: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Link component (for Next.js Link, React Router, etc.)
   * @default "a"
   */
  LinkComponent?: React.ComponentType<{ href: string; className?: string; children: React.ReactNode }>;
}

/**
 * DocumentationSidebar - Sidebar navigation component for documentation sites
 * 
 * Features:
 * - Scroll detection (detects when main content is at bottom)
 * - Wheel handling (redirects wheel events to sidebar when at bottom)
 * - Responsive (hidden on mobile, uses Sheet for mobile menu)
 * - Active state detection based on current path
 * - Collapsible sections
 * 
 * @example
 * ```tsx
 * <DocumentationSidebar
 *   sections={[
 *     {
 *       title: "Get Started",
 *       items: [
 *         { title: "Introduction", href: "/docs/get-started/introduction" },
 *         { title: "Setup", href: "/docs/get-started/setup" },
 *       ],
 *     },
 *   ]}
 *   currentPath={pathname}
 * />
 * ```
 */
export function DocumentationSidebar({
  sections,
  currentPath,
  scrollDetection = true,
  wheelHandling = true,
  mobileBreakpoint = 1024,
  header,
  footer,
  className,
  LinkComponent = ({ href, className, children }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}: DocumentationSidebarProps) {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isMainAtBottom, setIsMainAtBottom] = React.useState(false);
  const navRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [mobileBreakpoint]);

  // Check if main container is scrolled to bottom
  React.useEffect(() => {
    if (!scrollDetection) return;

    const handleScroll = () => {
      const threshold = 10; // 10px threshold
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const isAtBottom = scrollTop + windowHeight >= documentHeight - threshold;
      setIsMainAtBottom(isAtBottom);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [scrollDetection, currentPath]);

  // Redirect wheel events to sidebar when at bottom
  React.useEffect(() => {
    if (!wheelHandling || !isMainAtBottom || !navRef.current) return;

    const handleWheel = (e: WheelEvent) => {
      const nav = navRef.current;
      if (!nav) return;

      // Check if nav can scroll
      const canScrollUp = nav.scrollTop > 0;
      const canScrollDown = nav.scrollTop < nav.scrollHeight - nav.clientHeight;

      // Only intercept if we're at bottom and nav can scroll
      if (isMainAtBottom && (canScrollUp || canScrollDown)) {
        const scrollingDown = e.deltaY > 0;
        const scrollingUp = e.deltaY < 0;

        const navAtBottom = nav.scrollTop >= nav.scrollHeight - nav.clientHeight - 1;
        const navAtTop = nav.scrollTop <= 1;

        // If scrolling down and nav is not at bottom, or scrolling up and nav is not at top
        if ((scrollingDown && !navAtBottom) || (scrollingUp && !navAtTop)) {
          e.preventDefault();
          nav.scrollTop += e.deltaY;
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [isMainAtBottom, wheelHandling]);

  // Don't render on mobile (use Sheet for mobile menu instead)
  // Unless className contains "!block" which forces rendering
  if (isMobile && !className?.includes("!block")) {
    return null;
  }

  const isActive = (href: string) => {
    if (!currentPath) return false;
    return currentPath === href || currentPath.startsWith(`${href}/`);
  };

  const renderNavItem = (item: NavigationItem, level: number = 0) => {
    const active = isActive(item.href);
    const hasChildren = item.items && item.items.length > 0;

    return (
      <div key={item.href} className={clsx(level > 0 && "ml-6")}>
        <LinkComponent
          href={item.href}
          className={clsx(
            "peer/menu-button flex items-center gap-2 rounded-md p-2 text-left outline-hidden transition-[width,height,padding] focus-visible:ring-2 focus-visible:ring-[color:var(--color-border-base)] disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 relative h-[30px] w-fit overflow-visible border border-transparent text-[0.8rem] font-normal after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md",
            active
              ? "font-normal text-[color:var(--color-fg-base)] bg-[color:var(--color-surface-2)] border-[color:var(--color-border-base)] data-[active=true]:bg-accent data-[active=true]:border-accent"
              : "text-[color:var(--color-fg-base)] hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-fg-base)]"
          )}
          data-active={active}
        >
          <span className="absolute inset-0 flex w-[var(--sidebar-width)] bg-transparent"></span>
          {item.icon && <span>{item.icon}</span>}
          <span>{item.title}</span>
          {item.badge && (
            <span className="ml-auto text-xs px-1.5 py-0.5 rounded bg-[color:var(--color-surface-2)]">
              {item.badge}
            </span>
          )}
        </LinkComponent>
        {hasChildren && (
          <div className="ml-6 space-y-1 mt-1">
            {item.items!.map((child) => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      ref={navRef}
      className={clsx(
        "text-sidebar-foreground flex-col w-full h-full",
        className
      )}
      style={{
        "--header-height": "58px",
        "--footer-height": "0px",
      } as React.CSSProperties & { "--header-height": string; "--footer-height": string }}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden no-scrollbar overflow-x-hidden px-1 max-h-[calc(100vh-96px)]">
        <div className="sticky -top-1 z-10 h-8 shrink-0 bg-gradient-to-b from-[color:var(--background-primary)] via-[color:var(--background-primary)]/80 to-transparent"></div>
        {header && (
          <div className="p-2">
            {header}
          </div>
        )}
        <div className="flex flex-col gap-2">
          {sections.map((section) => (
            <div key={section.title} className="relative flex w-full min-w-0 flex-col p-2">
              <div className="flex h-8 shrink-0 items-center rounded-md px-2 text-xs outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 focus-visible:ring-[color:var(--color-border-base)] [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 text-[color:var(--foreground-secondary)] font-medium">
                {section.title}
              </div>
              <div className="w-full text-sm">
                <ul className="flex w-full min-w-0 flex-col gap-0.5">
                  {section.items.map((item) => (
                    <li key={item.href} className="group/menu-item relative">
                      {renderNavItem(item)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        {footer && (
          <div className="p-2">
            {footer}
          </div>
        )}
        <div className="sticky -bottom-1 z-10 h-16 shrink-0 bg-gradient-to-t from-[color:var(--background-primary)] via-[color:var(--background-primary)]/80 to-transparent"></div>
      </div>
    </aside>
  );
}

