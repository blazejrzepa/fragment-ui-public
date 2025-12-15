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
      <h1 id="virtual-scroll" className="text-3xl font-medium mb-4">Virtual Scroll</h1>
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
        Virtual Scroll example demonstrating Fragment UI components and patterns.
      </p>

      <h2>Example</h2>
      <div className="my-6 h-[400px] border rounded-lg">
        <VirtualList
          items={items}
          itemHeight={50}
          renderItem={(item) => (
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-[color:var(--color-fg-muted)]">{item.description}</div>
              </div>
            </div>
          )}
        />
      </div>

      <h2>Code</h2>
      <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto"><code>{`import { VirtualList } from "@fragment_ui/ui";

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

