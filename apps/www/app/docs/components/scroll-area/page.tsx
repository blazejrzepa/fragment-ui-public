"use client";

import { ScrollArea, DocumentContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";

const TAGS = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

export default function ScrollAreaPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Scroll Area</h1>
      </div>
      <p className="mb-6 intro-text">
        A customizable scroll area component with styled scrollbars. Useful for creating
        custom scrolling containers with consistent styling across browsers.
      </p>
      
      <div className="space-y-4 my-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Vertical Scroll</h3>
          <ScrollArea className="h-72 w-80 rounded-md border border-[color:var(--color-fg-muted)] p-4">
            <div className="space-y-2">
              {TAGS.map((tag) => (
                <div key={tag} className="text-sm">
                  {tag}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Horizontal Scroll</h3>
          <ScrollArea className="w-80 whitespace-nowrap rounded-md border border-[color:var(--color-fg-muted)]">
            <div className="flex w-max space-x-4 p-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="shrink-0 w-32 h-32 rounded-md bg-[color:var(--color-surface-2)] flex items-center justify-center">
                  Item {i + 1}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
      
      <h2 id="code">Code</h2>
      <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto"><code>{`import { ScrollArea } from "@fragment_ui/ui";

<ScrollArea className="h-72 w-80">
  <div>
    {/* Long content */}
  </div>
</ScrollArea>

// Horizontal scroll
<ScrollArea className="w-80">
  <div className="flex w-max space-x-4">
    {/* Wide content */}
  </div>
</ScrollArea>`}</code></pre>
      
      <h2 id="features">Features</h2>
      <ul>
        <li>Custom styled scrollbars</li>
        <li>Vertical and horizontal scrolling</li>
        <li>Cross-browser consistent styling</li>
        <li>Keyboard navigation support</li>
        <li>Touch-friendly</li>
      </ul>
      
      
      
      <h2 id="install">Install</h2>
      <pre><code>npx shadcn@latest add /r/scroll-area.json</code></pre>
      <h2 id="accessibility">Accessibility</h2>
      <p>
        ScrollArea uses Radix UI which provides keyboard navigation and maintains
        scroll accessibility. Content remains fully accessible to screen readers.
      </p>
      
      <h2 id="links">Links</h2>
      <ul>
        <li><StorybookLink path="/docs/core-scrollarea--docs">View in Storybook</StorybookLink></li>
      </ul>


    </DocumentContent>
  );
}

