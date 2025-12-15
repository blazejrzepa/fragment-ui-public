"use client";

import { Skeleton, DocumentContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";

export default function SkeletonPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Skeleton</h1>
      </div>
      <p className="mb-6 intro-text">
        Placeholder while content is loading.
      </p>
      
      
      {/* Text Skeleton */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-md space-y-2">
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { Skeleton } from "@fragment_ui/ui";

<div className="space-y-2">
</div>`}</CodeBlock>
        </div>
      </div>

      {/* Card Skeleton */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-64 space-y-3">
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { Skeleton } from "@fragment_ui/ui";

<div className="w-64 space-y-3">
</div>`}</CodeBlock>
        </div>
      </div>
      
      <h2 id="features">Features</h2>
      <ul>
        <li>Animated pulse effect</li>
        <li>Fully customizable with className</li>
        <li>Lightweight component</li>
        <li>Perfect for loading states</li>
      </ul>
      
      <h2 id="props">Props</h2>
      <p>Skeleton accepts all standard HTML div props, including className for styling.</p>
      
      
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">npx shadcn@latest add /r/skeleton.json</CodeBlock>
      <h2 id="accessibility">Accessibility</h2>
      <p>Skeleton is a visual placeholder and should be paired with aria-live regions or loading announcements for screen reader users.</p>
      
      <h2 id="links">Links</h2>
      <ul>
        <li><StorybookLink path="/docs/feedback-skeleton--docs">View in Storybook</StorybookLink></li>
      </ul>


    </DocumentContent>
  );
}

