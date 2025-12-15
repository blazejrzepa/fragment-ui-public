import { Skeleton } from "@fragment_ui/ui";
import { DocLayout } from "../../src/components/doc-layout";

export default function DocsLoading() {
  return (
    <DocLayout>
      {/* Breadcrumbs skeleton */}
      <div className="mb-6 flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
      </div>
      
      {/* H1 skeleton */}
      <Skeleton className="h-10 w-64 mb-6" />
      
      {/* Subtitle skeleton */}
      <Skeleton className="h-5 w-full max-w-2xl mb-6" />
      
      {/* Content skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/6" />
      </div>
      
      {/* Code block skeleton */}
      <div className="mt-8 space-y-4">
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    </DocLayout>
  );
}

