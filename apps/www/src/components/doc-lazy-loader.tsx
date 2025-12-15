"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@fragment_ui/ui";

interface DocLazyLoaderProps {
  componentPath: string;
  fallback?: React.ReactNode;
}

/**
 * Lazy loader for documentation pages
 * Dynamically imports and renders documentation components
 */
export function DocLazyLoader({ componentPath, fallback }: DocLazyLoaderProps) {
  const [Component, setComponent] = React.useState<React.ComponentType | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    const loadComponent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Dynamic import of the documentation page component
        // componentPath should be relative to app/docs, e.g., "components/button/page"
        const module = await import(`../../app/docs/${componentPath}`);
        const PageComponent = module.default;

        if (isMounted) {
          setComponent(() => PageComponent);
        }
      } catch (err) {
        console.error(`Failed to load component: ${componentPath}`, err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load component");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadComponent();

    return () => {
      isMounted = false;
    };
  }, [componentPath]);

  if (loading) {
    return (
      fallback || (
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-64 w-full" />
        </div>
      )
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-[color:var(--color-accent-red)]/10 border border-[color:var(--color-accent-red)]/20">
        <p className="text-sm text-[color:var(--color-accent-red)]">
          Failed to load documentation: {error}
        </p>
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="p-4 rounded-lg bg-[color:var(--color-surface-2)] border border-[color:var(--color-border-base)]">
        <p className="text-sm text-[color:var(--color-fg-muted)]">Component not found</p>
      </div>
    );
  }

  return <Component />;
}

