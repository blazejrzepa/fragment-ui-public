"use client";

import { Resizable, ResizableHandle, ResizablePanel, CodeBlock, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";

const resizableCode = `import {
  Resizable,
  ResizablePanel,
} from "@fragment_ui/ui";

export function ResizableDemo() {
  return (
    <Resizable direction="horizontal" className="min-h-[200px] rounded-[var(--radius-md)] border border-[color:var(--color-border-base)]">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-[var(--space-6)]">
          <span className="font-semibold">Panel 1</span>
        </div>
      </ResizablePanel>
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-[var(--space-6)]">
          <span className="font-semibold">Panel 2</span>
        </div>
      </ResizablePanel>
    </Resizable>
  );
}`;

export default function ResizablePage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="resizable">Resizable</h1>
      </div>
      <p className="mb-6 intro-text">Allow users to resize panels or regions.</p>
      
      <ExampleSection
        id="resizable-example"
        title="Example"
        code={resizableCode}
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="w-full max-w-2xl">
            <Resizable direction="horizontal" className="min-h-[200px] w-full rounded-[var(--radius-md)] border border-[color:var(--color-border-base)]">
              <ResizablePanel defaultSize={50}>
                <div className="flex h-full items-center justify-center p-[var(--space-6)]">
                  <span className="font-semibold">Panel 1</span>
                </div>
              </ResizablePanel>
              <ResizablePanel defaultSize={50}>
                <div className="flex h-full items-center justify-center p-[var(--space-6)]">
                  <span className="font-semibold">Panel 2</span>
                </div>
              </ResizablePanel>
            </Resizable>
          </div>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add resizable`}
      </CodeBlock>

      <h2 id="api-reference">API Reference</h2>
      <div className="mt-4 border border-[color:var(--color-border-base)] rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-2 px-4 font-semibold text-sm">Component</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Props</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Default</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>Resizable</code></td>
              <td className="py-2 px-4"><code>direction?, defaultSize?, minSize?, maxSize?, onResize?, className?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Container for resizable panels</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>ResizablePanel</code></td>
              <td className="py-2 px-4"><code>defaultSize?, defaultSizePx?, minSize?, minSizePx?, maxSize?, className?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Resizable panel component (use within Resizable)</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>ResizableHandle</code></td>
              <td className="py-2 px-4"><code>disabled?, className?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Custom handle for resizing (optional, default handle is provided automatically)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Collapsible className="mt-8">
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation" className="m-0">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <h3>Intent</h3>
          <p>
            <code>Resizable</code> is a component for resizing panels by dragging a handle. Use it when you need to provide users with the ability to adjust the size of panels, split views, or resizable containers. The component supports both horizontal and vertical resizing with multiple panels.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Split view interfaces</li>
            <li>Resizable sidebars or panels</li>
            <li>Code editors with resizable panes</li>
            <li>Dashboard layouts with adjustable sections</li>
            <li>Any interface requiring resizable panels</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "Resizable"</code> and nested <code>ResizablePanel</code> components.
          </p>
          <p><strong>Props:</strong></p>
          <p>Props for <code>Resizable</code>:</p>
          <ul>
            <li><code>direction?</code> – "horizontal" | "vertical" | "both" (default: "horizontal"). Resize direction (optional)</li>
            <li><code>defaultSize?</code> – object with <code>width?</code> and <code>height?</code> properties (number). Initial size in pixels (optional)</li>
            <li><code>minSize?</code> – object with <code>width?</code> and <code>height?</code> properties (number). Minimum size in pixels (optional)</li>
            <li><code>maxSize?</code> – object with <code>width?</code> and <code>height?</code> properties (number). Maximum size in pixels (optional)</li>
            <li><code>onResize?</code> – function. Callback when size changes: <code>(size: object) {'=>'} void</code> (optional)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>
          <p>Props for <code>ResizablePanel</code>:</p>
          <ul>
            <li><code>defaultSize?</code> – number. Initial size percentage (optional)</li>
            <li><code>defaultSizePx?</code> – number. Initial size in pixels (optional)</li>
            <li><code>minSize?</code> – number. Minimum size percentage (optional)</li>
            <li><code>minSizePx?</code> – number. Minimum size in pixels (optional)</li>
            <li><code>maxSize?</code> – number. Maximum size percentage (optional)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>
          <p>Use <code>ResizableHandle</code> between panels for custom handle styling (optional, default handle is provided automatically).</p>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Resizable",
  "props": {
    "direction": "horizontal"
  },
  "children": [
    {
      "type": "component",
      "component": "ResizablePanel",
      "props": {
        "defaultSize": 50
      },
      "children": {
        "type": "element",
        "tag": "div",
        "children": "Panel 1"
      }
    },
    {
      "type": "component",
      "component": "ResizablePanel",
      "props": {
        "defaultSize": 50
      },
      "children": {
        "type": "element",
        "tag": "div",
        "children": "Panel 2"
      }
    }
  ]
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
