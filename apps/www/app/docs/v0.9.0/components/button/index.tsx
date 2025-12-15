"use client";

import { Button } from "@fragment_ui/ui";
import { DocLayout } from "../../../../../src/components/doc-layout";

/**
 * Version 0.9.0 of the Button component documentation
 */
export default function ButtonPageV090() {
  return (
    <DocLayout>
      <div className="mb-4 p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
        <p className="text-sm text-yellow-200">
          ⚠️ This is version 0.9.0 documentation. Some features may have changed in newer versions.
        </p>
      </div>

      <h1>Button (v0.9.0)</h1>
      <h2 id="overview">Overview</h2>
      <p>
        Button component for user actions. Supports variants: solid, outline, ghost and sizes: sm, md, lg.
        This is the documentation for version 0.9.0.
      </p>
      
      <h2 id="install">Install</h2>
      <pre><code>npx shadcn@latest add /r/button.json</code></pre>
      
      <h2 id="examples">Examples</h2>
      <div className="space-y-4 my-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Variants</h3>
          <div className="flex gap-2">
            <Button variant="solid">Solid</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Sizes</h3>
          <div className="flex items-center gap-2">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Disabled</h3>
          <Button disabled>Disabled Button</Button>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-lg bg-[color:var(--color-surface-1)] border border-[color:var(--color-fg-muted)]/30">
        <p className="text-sm text-[color:var(--color-fg-muted)]">
          <strong>Changes in v1.0.0:</strong> Added support for leading and trailing icons.
          Check the <a href="/docs/components/button" className="text-[color:var(--color-brand-primary)] hover:underline">latest documentation</a> for details.
        </p>
      </div>
    </DocLayout>
  );
}

