"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { TableOfContents, extractHeadings, type Heading, Skeleton } from "@fragment_ui/ui";
import { useLayoutMode } from "./layout-mode-context";

export function RightSidebar() {
  const [headings, setHeadings] = React.useState<Heading[]>([]);
  const [activeId, setActiveId] = React.useState<string>("");
  const pathname = usePathname();

  // Extract headings when pathname changes
  React.useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Reset headings and activeId when pathname changes
    setHeadings([]);
    setActiveId("");

    let isUpdating = false;
    let lastHeadingsHash = "";
    let debounceTimer: NodeJS.Timeout | null = null;

    const updateHeadings = () => {
      // Prevent concurrent updates
      if (isUpdating) return;
      isUpdating = true;

      // Temporarily disconnect observer to prevent infinite loop
      // extractHeadings modifies DOM (adds id attributes), which would trigger observer
      if (observer) {
        observer.disconnect();
      }

      // Try to find headings in main content area
      // Always prefer article if it exists (even if empty - React streaming may delay content)
      // Only fall back to main if article doesn't exist
      const article = document.querySelector("article");
      const main = document.querySelector("main");
      
      // Use article if it exists, otherwise use main
      const selector = article ? "article" : (main ? "main" : "article");
      
      const extracted = extractHeadings(selector);
      
      // Create a hash to check if headings actually changed
      const headingsHash = JSON.stringify(extracted.map(h => ({ id: h.id, text: h.text, level: h.level })));
      
      if (headingsHash !== lastHeadingsHash) {
        setHeadings(extracted);
        lastHeadingsHash = headingsHash;
      }
      
      // Reconnect observer after a delay
      setTimeout(() => {
        const contentElement = article || main;
        if (contentElement && observer) {
          observer.observe(contentElement, {
            childList: true,
            subtree: true,
            attributes: false,
          });
        }
        isUpdating = false;
      }, 100);
    };

    // Use MutationObserver to watch for new headings with debouncing
    let observer: MutationObserver | null = null;
    
    const createObserver = () => {
      if (observer) return observer;
      
      observer = new MutationObserver((mutations) => {
        // Only react to mutations that add/remove nodes, not attribute changes (like id)
        const hasRelevantChanges = mutations.some(mutation => 
          mutation.type === 'childList' && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)
        );
        
        if (!hasRelevantChanges || isUpdating) return;
        
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          updateHeadings();
        }, 1000); // Debounce to prevent too frequent updates
      });
      
      return observer;
    };

    // Wait for content to render - React streaming may delay content
    // Try multiple times with increasing delays to catch dynamically loaded content
    const timeoutId1 = setTimeout(updateHeadings, 500);
    const timeoutId2 = setTimeout(updateHeadings, 1000);
    const timeoutId3 = setTimeout(updateHeadings, 2000);
    const timeoutId4 = setTimeout(updateHeadings, 4000);

    // Start observing after initial delay - wait for React streaming to complete
    const observeTimeout = setTimeout(() => {
      const article = document.querySelector("article");
      const main = document.querySelector("main");
      const contentElement = article || main;
      
      if (contentElement) {
        const obs = createObserver();
        obs.observe(contentElement, {
          childList: true,
          subtree: true,
          attributes: false, // Don't observe attribute changes (like id) to prevent infinite loop
        });
        // Also try to update headings when observer is set up
        updateHeadings();
      }
    }, 3000);

    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
      clearTimeout(timeoutId4);
      clearTimeout(observeTimeout);
      if (debounceTimer) clearTimeout(debounceTimer);
      if (observer) observer.disconnect();
    };
  }, [pathname]);

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden overscroll-none pb-8 pt-4">
      <div className="no-scrollbar overflow-y-auto px-4 flex-1 min-h-0 mt-3">
        {headings.length > 0 ? (
          <>
            <TableOfContents headings={headings} showActive={true} scrollOffset={100} />
            <div className="h-12"></div>
          </>
        ) : (
          <nav className="flex flex-col gap-2 p-4 pt-0 text-sm" aria-label="Table of contents">
            <Skeleton className="h-6 w-24 mb-2" />
            <div className="flex flex-col gap-0.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40 pl-4" />
              <Skeleton className="h-4 w-36 pl-4" />
              <Skeleton className="h-4 w-44 pl-6" />
              <Skeleton className="h-4 w-38 pl-6" />
              <Skeleton className="h-4 w-42" />
              <Skeleton className="h-4 w-35 pl-4" />
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}

