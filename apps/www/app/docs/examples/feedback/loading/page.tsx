"use client";

import { DocLayout } from "../../../../../src/components/doc-layout";
import { Button, Spinner, Skeleton } from "@fragment_ui/ui";
import { useState } from "react";

export default function LoadingStatesExample() {
  const [loading, setLoading] = useState(false);

  return (
    <DocLayout>
      <h1 className="text-3xl font-medium mb-4">Loading</h1>
      <p 
        className="mb-6 text-[color:var(--foreground-secondary)] font-normal"
        style={{
          fontFamily: "Geist, sans-serif",
          fontSize: "var(--typography-size-md)",
          fontStyle: "normal",
          lineHeight: "160%",
          color: "var(--foreground-secondary)",
        }}
      >
        Loading example demonstrating Fragment UI components and patterns.
      </p>

      <h2>Examples</h2>
      <div className="space-y-8 my-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Button Loading</h3>
          <Button
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 2000);
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Loading...
              </>
            ) : (
              "Click to Load"
            )}
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Skeleton Loading</h3>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Card Skeleton</h3>
          <div className="border rounded-lg p-4 space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    </DocLayout>
  );
}

