"use client";

import * as React from "react";
import { DocumentationHeaderWrapper } from "./documentation-header-wrapper";
import { DocumentationSidebarWrapper } from "./documentation-sidebar-wrapper";
import { RightSidebar } from "./right-sidebar";
import { DocumentationLayout } from "@fragment_ui/blocks";
import { Suspense } from "react";
import { Skeleton } from "@fragment_ui/ui";
import { LayoutModeProvider } from "./layout-mode-context";
import { DocPager } from "./doc-pager";
import { usePathname } from "next/navigation";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  const isHomePage = pathname === "/" || pathname === "";

  // If we're on the admin page, render only children without navigation
  if (isAdminPage) {
    return <>{children}</>;
  }

  // If we're on the homepage, render a full-width, chrome-free layout (no doc sidebars)
  if (isHomePage) {
    return (
      <div className="min-h-screen w-full px-4 sm:px-6 lg:px-8 pt-[60px] pb-10">
        <div className="w-full">{children}</div>
      </div>
    );
  }

  // Otherwise, render with full navigation using DocumentationLayout from DS
  return (
    <LayoutModeProvider>
      <LayoutAwareDocumentationLayout>{children}</LayoutAwareDocumentationLayout>
    </LayoutModeProvider>
  );
}

function LayoutAwareDocumentationLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showTopPager = pathname?.startsWith("/docs/components");

  return (
    <DocumentationLayout
      header={<DocumentationHeaderWrapper />}
      sidebar={<DocumentationSidebarWrapper className="!block" />}
      rightSidebar={<RightSidebar />}
      contentTopPadding="58px"
      maxWidth="1536px"
    >
      <Suspense
        fallback={
          <div>
            <div className="mb-6 flex items-center gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-10 w-64 mb-6" />
            <Skeleton className="h-5 w-full max-w-2xl mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        }
      >
        <div className="relative w-full px-1 sm:px-4 lg:px-6">
          <div className="mx-auto w-full pt-10 relative">
            {showTopPager && (
              <div 
                className="absolute inset-x-0 flex justify-center px-1 sm:px-3 lg:px-4 z-10"
                style={{ top: '14px' }}
              >
                <div className="w-full max-w-[720px] flex justify-end">
                  <DocPager placement="top" align="end" variant="icon" dense />
                </div>
              </div>
            )}
            <div className={showTopPager ? "pt-0" : undefined}>
              {children}
            </div>
          </div>
        </div>
      </Suspense>
    </DocumentationLayout>
  );
}

