"use client";

import { Tooltip, DocumentContent, CodeBlock, Collapsible, CollapsibleTrigger, CollapsibleContent, Button } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";

const tooltipCode = `import { Tooltip } from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";

export function TooltipDemo() {
  return (
    <Tooltip content="This is a tooltip">
      <Button>Hover me</Button>
    </Tooltip>
  );
}`;

export default function TooltipPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="tooltip">Tooltip</h1>
      </div>
      <p className="mb-6 intro-text">Show short helper text on hover or focus.</p>
      
      <ExampleSection
        id="tooltip-example"
        title="Example"
        code={tooltipCode}
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <Tooltip content="This is a tooltip">
            <Button>Hover me</Button>
          </Tooltip>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add tooltip`}
      </CodeBlock>

      <h2 id="api-reference">API Reference</h2>
      <div className="mt-4 border border-[color:var(--color-border-base)] rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-2 px-4 font-semibold text-sm">Prop</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Type</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Default</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4"><code>content</code></td>
              <td className="py-2 px-4"><code>ReactNode</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Tooltip content text or React node (required)</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>children</code></td>
              <td className="py-2 px-4"><code>ReactNode</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Trigger element that shows the tooltip on hover/focus (required)</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>delayDuration?</code></td>
              <td className="py-2 px-4"><code>number</code></td>
              <td className="py-2 px-4">500</td>
              <td className="py-2 px-4 text-sm">Delay in milliseconds before showing tooltip (optional)</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>side?</code></td>
              <td className="py-2 px-4"><code>"top" | "right" | "bottom" | "left"</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Tooltip position (optional)</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>sideOffset?</code></td>
              <td className="py-2 px-4"><code>number</code></td>
              <td className="py-2 px-4">5</td>
              <td className="py-2 px-4 text-sm">Offset distance from trigger element in pixels (optional)</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>className?</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Additional CSS classes (optional)</td>
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
            <code>Tooltip</code> is a component for displaying contextual information on hover or focus. Use it when you need to provide additional context, hints, or descriptions for UI elements without cluttering the interface. Tooltips appear on hover or keyboard focus and automatically hide when the user moves away or focuses elsewhere.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Providing hints or additional context for buttons and icons</li>
            <li>Explaining abbreviations or technical terms</li>
            <li>Showing keyboard shortcuts or tips</li>
            <li>Displaying truncated text in full</li>
            <li>Providing help text for form fields</li>
            <li>Any scenario requiring contextual information on demand</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "Tooltip"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>content</code> – ReactNode. Tooltip content text or React node (required)</li>
            <li><code>children</code> – ReactNode. Trigger element that shows the tooltip on hover/focus (required)</li>
            <li><code>delayDuration?</code> – number. Delay in milliseconds before showing tooltip (optional, default: 500)</li>
            <li><code>side?</code> – string. Tooltip position: "top" | "right" | "bottom" | "left" (optional)</li>
            <li><code>sideOffset?</code> – number. Offset distance from trigger element in pixels (optional, default: 5)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Tooltip",
  "props": {
    "content": "This is a tooltip",
    "delayDuration": 500,
    "side": "top"
  },
  "children": {
    "type": "component",
    "component": "Button",
    "props": {
      "variant": "solid"
    },
    "children": "Hover me"
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
