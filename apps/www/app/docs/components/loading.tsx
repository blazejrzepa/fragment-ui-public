import { Skeleton } from "@fragment_ui/ui";
import { DocLayout } from "../../../src/components/doc-layout";

export default function ComponentLoading() {
  return (
    <DocLayout>
      {/* Breadcrumbs skeleton */}
      <div className="mb-6 flex items-center gap-2">
      </div>
      
      {/* H1 skeleton */}
      
      {/* Subtitle skeleton */}
      
      {/* Content skeleton */}
      <div className="space-y-6">
        <div className="space-y-4">
        </div>
        
        {/* Code block skeleton */}
        
        {/* Example skeleton */}
      </div>
    </DocLayout>
  );
}

