"use client";

import { lazy, Suspense } from "react";
import dynamic from "next/dynamic";
import { LoadingSkeleton } from "./loading-skeleton";
import { ErrorBoundary } from "./error-boundary";
import { Alert, AlertTitle, AlertDescription } from "@fragment_ui/ui";

// Lazy load versioned components
const TokensPageV090 = dynamic(() => import("../../app/docs/v0.9.0/foundations/tokens"), {
  ssr: false,
  loading: () => <LoadingSkeleton />,
});

const ButtonPageV090 = dynamic(() => import("../../app/docs/v0.9.0/components/button"), {
  ssr: false,
  loading: () => <LoadingSkeleton />,
});

interface VersionedContentRendererProps {
  version: string;
  path: string[];
}

/**
 * Client Component that renders versioned content
 */
export function VersionedContentRenderer({
  version,
  path,
}: VersionedContentRendererProps) {
  const pathKey = path.join("/");

  // Render versioned content based on version and path
  if (version === "0.9.0") {
    switch (pathKey) {
      case "foundations/tokens":
        return (
          <ErrorBoundary>
            <Suspense fallback={<LoadingSkeleton />}>
              <TokensPageV090 />
            </Suspense>
          </ErrorBoundary>
        );
      case "components/button":
        return (
          <ErrorBoundary>
            <Suspense fallback={<LoadingSkeleton />}>
              <ButtonPageV090 />
            </Suspense>
          </ErrorBoundary>
        );
      default:
        return <VersionedContentFallback version={version} path={path} />;
    }
  }

  // Fallback for other versions or paths
  return <VersionedContentFallback version={version} path={path} />;
}

/**
 * Fallback component when versioned content is not available
 */
function VersionedContentFallback({
  version,
  path,
}: {
  version: string;
  path: string[];
}) {
  const currentPath = path.join("/");
  
  return (
    <div className="space-y-4">
      <Alert variant="info">
        <span className="text-xl">ℹ️</span>
        <AlertTitle>Versioned content not available</AlertTitle>
        <AlertDescription>
          Versioned documentation for <strong>v{version}</strong> at{" "}
          <code className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--color-status-info-bg)', color: 'var(--color-status-info-fg)' }}>{currentPath}</code>{" "}
          is not available.
          <br />
          <a
            href={`/docs/${currentPath}`}
            className="inline-flex items-center gap-1 text-sm hover:underline font-semibold mt-2"
            style={{ color: 'var(--color-status-info-fg)' }}
          >
            View current version →
          </a>
        </AlertDescription>
      </Alert>
    </div>
  );
}

