"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { DocumentContent } from "@fragment_ui/ui";
import { ContentContainer } from "./content-container";
import { DocPager } from "./doc-pager";

interface DocLayoutProps {
  children: React.ReactNode;
  version?: string;
}

/**
 * DocLayout - Wrapper component for documentation pages
 * Uses DocumentationLayout from @fragment_ui/blocks
 * 
 * Note: Copy buttons for code blocks are handled by CodeBlock component from @fragment_ui/ui
 * TableOfContents is handled by RightSidebar component
 * Typography is handled by DocumentContent component from @fragment_ui/ui (replaces .prose)
 */
export function DocLayout({ children, version }: DocLayoutProps) {
  const pathname = usePathname();

  // Ensure docs navigations (Prev/Next/sidebar links) always start at the top of the page.
  React.useEffect(() => {
    if (!pathname) return;
    // Use window scroll (not a container scroll) because docs are rendered in the normal page flow.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return (
    <ContentContainer>
      <DocumentContent as="article" className="w-full max-w-none">
        {children}
      </DocumentContent>
      <DocPager placement="bottom" align="spread" />
    </ContentContainer>
  );
}

