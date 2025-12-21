"use client";

import * as React from "react";
import { ContentContainer } from "./content-container";

export interface DocumentationLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
  maxWidth?: string;
  contentTopPadding?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function DocumentationLayout({
  children,
  header,
  sidebar,
  rightSidebar,
  maxWidth = "var(--max-width-container, 1536px)",
  contentTopPadding = "var(--header-height, 60px)",
  className,
  style,
}: DocumentationLayoutProps) {
  const hasRight = !!rightSidebar;
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Use consistent initial values for SSR to avoid hydration mismatch
  const [leftOffset, setLeftOffset] = React.useState(12);
  const [rightOffset, setRightOffset] = React.useState(12);
  const [mounted, setMounted] = React.useState(false);

  // Set mounted state after hydration
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Use useLayoutEffect to calculate offsets synchronously before paint
  React.useLayoutEffect(() => {
    if (!mounted) return;
    const updateOffsets = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Add spacing from edge: 12px spacing from viewport edge
        const edgeSpacing = 12;
        setLeftOffset(rect.left + edgeSpacing);
        setRightOffset(window.innerWidth - rect.right + edgeSpacing);
      }
    };

    // Update immediately
    updateOffsets();

    // Also update after a short delay to handle any late layout changes (fonts, images)
    const timeoutId = setTimeout(updateOffsets, 100);

    // Update on resize
    const handleResize = () => updateOffsets();
    window.addEventListener("resize", handleResize);
    
    // Update on load to handle images/fonts loading
    const handleLoad = () => updateOffsets();
    window.addEventListener("load", handleLoad);

    // Use ResizeObserver to detect container size/position changes
    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateOffsets();
      });
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", handleLoad);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [maxWidth, mounted]);

  return (
    <div
      ref={containerRef}
      className={["mx-auto px-1 sm:px-2 lg:px-4 w-full", className].filter(Boolean).join(" ")}
      style={{ maxWidth, width: "100%", ...style }}
    >
      {header}
      <div
        className={header ? "w-full mt-[var(--header-height,60px)]" : "w-full"}
      >
        <div className="w-full grid grid-cols-1 lg:grid-cols-[var(--sidebar-width,240px)_minmax(0,1fr)_var(--sidebar-width,240px)] gap-4 lg:gap-6 items-start">
          {sidebar && (
            <>
              <aside 
                className="hidden lg:block fixed top-[var(--header-height,60px)] h-[calc(100vh-var(--header-height,60px))] overflow-y-auto w-[var(--sidebar-width,240px)] z-40"
                style={mounted ? { left: `${leftOffset}px` } : undefined}
              >
                {sidebar}
              </aside>
              {/* Placeholder to maintain grid layout */}
              <aside className="hidden lg:block w-[var(--sidebar-width,240px)]" aria-hidden="true" />
            </>
          )}
          <main className="min-w-0">
            <ContentContainer maxWidthClass="max-w-[800px]">
              <div
                className={header ? "mx-auto flex w-full min-w-0 flex-1 flex-col gap-8 py-6 pt-[var(--header-height,60px)]" : "mx-auto flex w-full min-w-0 flex-1 flex-col gap-8 py-6"}
              >
                {children}
              </div>
            </ContentContainer>
          </main>
          {hasRight && (
            <>
              <aside 
                className="hidden lg:block fixed top-[var(--header-height,60px)] h-[calc(100vh-var(--header-height,60px))] overflow-y-auto w-[var(--sidebar-width,240px)] pl-1 z-40"
                style={mounted ? { right: `${rightOffset}px` } : undefined}
              >
                {rightSidebar}
              </aside>
              {/* Placeholder to maintain grid layout */}
              <aside className="hidden lg:block w-[var(--sidebar-width,240px)]" aria-hidden="true" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

