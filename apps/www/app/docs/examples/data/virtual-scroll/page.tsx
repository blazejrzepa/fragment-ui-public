"use client";

import { DocLayout } from "../../../../../src/components/doc-layout";
import { VirtualList } from "@fragment_ui/ui";

export default function VirtualScrollExample() {
  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    description: `Description for item ${i + 1}`,
  }));

  return (
    <DocLayout>
      <h1 id="virtual-scroll" className="text-[length:var(--typography-display-md-size)] font-medium mb-[var(--space-1)]">Virtual Scroll</h1>
      <p 
        className="mb-[var(--space-6)] text-[color:var(--foreground-secondary)] font-normal"
        className="mb-[var(--space-6)] intro-text"
      >
        Virtual Scroll example demonstrating Fragment UI components and patterns.
      </p>

      <h2>Example</h2>
      <div className="my-[var(--space-6)] h-[400px] border rounded-[var(--radius-md)]">
        <VirtualList
          items={items}
          itemHeight={50}
          renderItem={(item) => (
            <div className="p-[var(--space-4)] border-b flex items-center justify-between">
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-[color:var(--color-fg-muted)]">{item.description}</div>
              </div>
            </div>
          )}
        />
      </div>

      <h2>Code</h2>
      <pre className="bg-[color:var(--color-surface-1)] p-[var(--space-4)] rounded-[var(--radius-md)] overflow-x-auto"><code>{`import { VirtualList } from "@fragment_ui/ui";

const items = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  name: \`Item \${i + 1}\`,
}));

<VirtualList
  items={items}
  itemHeight={50}
  renderItem={(item) => (
    <div>{item.name}</div>
  )}
/>`}</code></pre>
    </DocLayout>
  );
}

