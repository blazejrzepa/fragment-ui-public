"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { DocLayout } from "./doc-layout";
import { Skeleton } from "@fragment_ui/ui";

/**
 * Create a lazy-loaded documentation page wrapper
 */
export function createLazyDocPage(componentPath: string) {
  const LazyComponent = dynamic(
    () => import(`../../app/docs/${componentPath}`),
    {
      loading: () => (
        <DocLayout>
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="space-y-4 mt-8">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </DocLayout>
      ),
      ssr: false, // Disable SSR for better code splitting
    }
  );

  return LazyComponent;
}

