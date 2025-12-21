"use client";

import * as React from "react";
import clsx from "clsx";
import { AlignLeft } from "lucide-react";

export interface Heading {
  id: string;
  text: string;
  level: number;
}

export interface TableOfContentsProps {
  /**
   * Array of headings to display
   */
  headings: Heading[];
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Show active heading based on scroll position
   * @default true
   */
  showActive?: boolean;
  /**
   * Offset for scroll detection (in pixels)
   * @default 100
   */
  scrollOffset?: number;
}

/**
 * TableOfContents component that displays a navigation list of headings
 * 
 * @example
 * ```tsx
 * const headings = [
 *   { id: "overview", text: "Overview", level: 2 },
 *   { id: "installation", text: "Installation", level: 2 },
 * ];
 * 
 * <TableOfContents headings={headings} />
 * ```
 */
export function TableOfContents({
  headings,
  className,
  showActive = true,
  scrollOffset = 100,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = React.useState<string>("");

  React.useEffect(() => {
    if (!showActive || headings.length === 0) return;

    const handleScroll = () => {
      const headingElements = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean) as HTMLElement[];

      if (headingElements.length === 0) return;

      // Find the heading that's currently in view
      let currentId = "";
      const scrollPosition = window.scrollY + scrollOffset;
      const viewportHeight = window.innerHeight;
      const viewportTop = window.scrollY;
      const viewportBottom = viewportTop + viewportHeight;

      // Check each heading to see if it's in the viewport
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        if (!element) continue;

        const elementTop = element.getBoundingClientRect().top + window.scrollY;
        const elementBottom = elementTop + element.offsetHeight;

        // Check if heading is in viewport or just above it
        if (elementTop <= scrollPosition + scrollOffset && elementBottom >= viewportTop) {
          currentId = element.id;
          break;
        }
      }

      // If scrolled to top, use first heading
      if (scrollPosition < headingElements[0]?.offsetTop) {
        currentId = headings[0]?.id || "";
      }

      // If no heading found and we're at the bottom, use last heading
      if (!currentId && scrollPosition + viewportHeight >= document.documentElement.scrollHeight - 50) {
        currentId = headings[headings.length - 1]?.id || "";
      }

      setActiveId(currentId);
    };

    // Initial check
    handleScroll();

    // Use requestAnimationFrame for smoother updates
    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          handleScroll();
          rafId = null;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [headings, showActive, scrollOffset]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav
      className={clsx("flex flex-col gap-2 p-4 pt-4 text-sm", className)}
      aria-label="Table of contents"
    >
      <p className="text-[color:var(--foreground-secondary)] bg-background sticky top-0 h-6 text-xs font-medium flex items-center gap-2">
        <AlignLeft className="h-3.5 w-3.5 shrink-0" />
        <span className="text-end">On This Page</span>
      </p>
      <div className="flex flex-col gap-0.5">
        {headings.map((heading) => {
          const isActive = showActive && activeId === heading.id;
          const depth = heading.level - 1; // Convert level to depth (h1 = depth 0, h2 = depth 1, h3 = depth 2, etc.)
          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={clsx(
                "text-[color:var(--foreground-secondary)] hover:text-[color:var(--color-fg-base)] text-[0.8rem] no-underline transition-colors",
                isActive && "text-[color:var(--color-fg-base)]",
                depth === 1 && "pl-0", // h2
                depth === 2 && "pl-4", // h3
                depth === 3 && "pl-6", // h4
                depth >= 4 && "pl-8" // h5, h6
              )}
              data-active={isActive}
              data-depth={depth + 1}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(heading.id);
                if (element) {
                  const offset = scrollOffset - 20; // Account for header
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - offset;

                  window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                  });
                }
              }}
            >
              {heading.text}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

/**
 * Extract headings from a DOM element
 * 
 * @param selector - CSS selector for the container element (default: "article")
 * @returns Array of headings with id, text, and level
 * 
 * @example
 * ```tsx
 * const headings = extractHeadings("article");
 * ```
 */
export function extractHeadings(
  selector: string = "article"
): Heading[] {
  if (typeof document === "undefined") return [];

  const container = document.querySelector(selector);
  if (!container) return [];

  const headingElements = container.querySelectorAll("h1, h2, h3, h4, h5, h6");
  const extracted: Heading[] = [];
  const seenIds = new Set<string>();

  headingElements.forEach((heading) => {
    // If heading is inside article or main, it's valid content - don't filter it
    const isInContentArea = heading.closest('article') || heading.closest('main');
    
    // Skip if heading is inside a component that shouldn't be in TOC
    // But allow headings in article/main content areas
    if (!isInContentArea) {
      // Skip if heading is inside breadcrumb nav
      if (heading.closest('nav[aria-label="Breadcrumb"]')) {
        return;
      }
      
      // Skip if heading is inside a card component
      if (heading.closest('[class*="card"]')) {
        return;
      }
      
      // Skip if heading is inside sidebar
      if (heading.closest('[class*="sidebar"]')) {
        return;
      }
      
      // Skip if heading is inside other nav elements
      if (heading.closest('nav')) {
        return;
      }
    } else {
      // Heading is in article/main - skip if it's inside a card
      if (heading.closest('[class*="card"]')) {
        return;
      }
      
      // Skip if heading is inside a component example/preview container
      // Component examples are typically in containers with "group relative" class
      if (heading.closest('.group.relative')) {
        return;
      }
      
      // Skip if heading is inside a preview container
      if (heading.closest('.preview')) {
        return;
      }
    }

    // Generate ID if not present (for TOC only, don't modify DOM to avoid hydration issues)
    // Only modify DOM if heading is in content area (article/main) to prevent hydration mismatches
    let headingId: string;
    if (!heading.id) {
      const baseId =
        heading.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || "";

      let uniqueId = baseId;
      let counter = 1;
      while (seenIds.has(uniqueId)) {
        uniqueId = `${baseId}-${counter}`;
        counter++;
      }
      seenIds.add(uniqueId);
      headingId = uniqueId;
      // Only set id if heading is in article/main (content area)
      // This prevents hydration issues while still allowing TOC to work
      if (isInContentArea) {
        heading.id = uniqueId;
      }
    } else {
      // If ID already exists, use it (don't modify to avoid hydration issues)
      headingId = heading.id;
      seenIds.add(headingId);
    }

    const level = parseInt(heading.tagName.charAt(1), 10);
    extracted.push({
      id: headingId,
      text: heading.textContent || "",
      level,
    });
  });

  return extracted;
}

