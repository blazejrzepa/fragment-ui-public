/**
 * Loading skeleton component for versioned content
 */
export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Header skeleton */}
      <div className="h-8 bg-[color:var(--color-surface-2)] rounded w-3/4"></div>
      
      {/* Content skeleton */}
      <div className="space-y-3">
        <div className="h-4 bg-[color:var(--color-surface-2)] rounded w-full"></div>
        <div className="h-4 bg-[color:var(--color-surface-2)] rounded w-5/6"></div>
        <div className="h-4 bg-[color:var(--color-surface-2)] rounded w-4/6"></div>
      </div>
      
      {/* Code block skeleton */}
      <div className="p-4 bg-[color:var(--color-surface-1)] rounded-lg border border-[color:var(--color-fg-muted)]/30">
        <div className="space-y-2">
          <div className="h-4 bg-[color:var(--color-surface-2)] rounded w-full"></div>
          <div className="h-4 bg-[color:var(--color-surface-2)] rounded w-11/12"></div>
          <div className="h-4 bg-[color:var(--color-surface-2)] rounded w-full"></div>
        </div>
      </div>
      
      {/* Example skeleton */}
      <div className="h-32 bg-[color:var(--color-surface-1)] rounded-lg border border-[color:var(--color-fg-muted)]/30"></div>
    </div>
  );
}

/**
 * Compact loading skeleton for inline use
 */
export function CompactLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      <div className="h-4 bg-[color:var(--color-surface-2)] rounded w-3/4"></div>
      <div className="h-4 bg-[color:var(--color-surface-2)] rounded w-1/2"></div>
    </div>
  );
}

