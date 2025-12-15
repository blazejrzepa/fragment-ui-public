"use client";

import { Resizable, ResizableHandle, ResizablePanel, CodeBlock, DocumentContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";

export default function ResizablePage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Resizable</h1>
      </div>
      <p className="mb-6 intro-text">
        Resize panels by dragging a handle.
      </p>
      
      
      {/* Horizontal Split */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <Resizable direction="horizontal" className="min-h-[200px] w-full max-w-2xl rounded-lg border border-[color:var(--color-fg-muted)]">
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Panel 1</span>
              </div>
            </ResizablePanel>
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Panel 2</span>
              </div>
            </ResizablePanel>
          </Resizable>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "@fragment_ui/ui";

<Resizable direction="horizontal" className="min-h-[200px] rounded-lg border">
  <ResizablePanel defaultSize={50}>
    <div className="flex h-full items-center justify-center p-6">
      <span className="font-semibold">Panel 1</span>
    </div>
  </ResizablePanel>
  <ResizablePanel defaultSize={50}>
    <div className="flex h-full items-center justify-center p-6">
      <span className="font-semibold">Panel 2</span>
    </div>
  </ResizablePanel>
</Resizable>`}</CodeBlock>
        </div>
      </div>
      
      <h2 id="features">Features</h2>
      <ul>
        <li>Horizontal and vertical resizing</li>
        <li>Multiple panels support</li>
        <li>Min/max size constraints</li>
        <li>Mouse drag interaction</li>
        <li>Visual feedback during resize</li>
        <li>Customizable handles</li>
      </ul>
      
      
      
      <h2 id="install">Install</h2>
      <pre><code>npx shadcn@latest add /r/resizable.json</code></pre>
      <h2 id="accessibility">Accessibility</h2>
      <p>
        Resizable panels provide keyboard navigation and maintain focus management.
        Handle elements are keyboard accessible and include proper ARIA attributes.
      </p>
      
      <h2 id="links">Links</h2>
      <ul>
        <li><StorybookLink path="/docs/core-resizable--docs">View in Storybook</StorybookLink></li>
      </ul>


    </DocumentContent>
  );
}

