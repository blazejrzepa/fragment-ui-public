"use client";

import * as React from "react";
import { DocumentationLayout } from "@fragment_ui/blocks";
import { DocumentContent } from "@fragment_ui/ui";
import { ContentContainer } from "./content-container";

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
  return (
    <ContentContainer>
      <DocumentContent as="article" className="w-full max-w-none">
        {children}
      </DocumentContent>
    </ContentContainer>
  );
}

