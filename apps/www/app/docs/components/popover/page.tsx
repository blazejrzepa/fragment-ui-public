"use client";

import { PopoverWrapper, DocumentContent, CodeBlock, Button, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const popoverCode = `import { PopoverWrapper } from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";

export function PopoverDemo() {
  return (
    <PopoverWrapper trigger={<Button>Open Popover</Button>}>
      <div className="space-y-[var(--space-2)]">
        <h4 className="font-medium">Popover Title</h4>
        <p className="text-sm text-[color:var(--color-fg-muted)]">
          This is the popover content.
        </p>
      </div>
    </PopoverWrapper>
  );
}`;

export default function PopoverPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-[var(--space-4)] mb-[var(--space-1)]">
        <h1 id="popover">Popover</h1>
      </div>
      <p className="mb-[var(--space-6)] intro-text">Show contextual content above the interface.</p>
      
      <ExampleSection
        id="popover-example"
        title="Example"
        code={popoverCode}
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <PopoverWrapper trigger={<Button>Open Popover</Button>}>
            <div className="space-y-[var(--space-2)]">
              <h4 className="font-medium">Popover Title</h4>
              <p className="text-[length:var(--typography-size-sm)] text-[color:var(--color-fg-muted)]">
                This is the popover content.
              </p>
            </div>
          </PopoverWrapper>
        </div>
      </ExampleSection>

      <h2 id="api-reference">API Reference</h2>
      <div className="mt-[var(--space-4)] border border-[color:var(--color-border-base)] rounded-[var(--radius-lg)] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Component</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Props</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Default</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>Popover</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>open?, onOpenChange?, className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Root popover component</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>PopoverTrigger</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>asChild?, className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Trigger element that opens the popover</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>PopoverContent</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>align?, side?, sideOffset?, alignOffset?, collisionPadding?, portal?, className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Content container for the popover</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>PopoverClose</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>asChild?, className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Button that closes the popover</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>PopoverWrapper</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>trigger, children, open?, onOpenChange?, align?, side?, sideOffset?, alignOffset?, collisionPadding?, portal?, className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Convenience wrapper combining Popover, PopoverTrigger, and PopoverContent</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add popover`}
      </CodeBlock>

      <Collapsible className="mt-8">
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation" className="m-0">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-[var(--space-4)]">
          <h3>Intent</h3>
          <p>
            <code>Popover</code> is a component for showing contextual content anchored to an element. Use it when you need to display additional information, actions, or content that appears when a user interacts with a trigger element. Popovers are similar to tooltips but can contain more complex content and interactive elements.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Contextual information or help text</li>
            <li>Additional actions or options</li>
            <li>Form field explanations</li>
            <li>Interactive content overlays</li>
            <li>Any scenario requiring contextual content display</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "PopoverWrapper"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>trigger</code> – ReactNode. Trigger element (required)</li>
            <li><code>children</code> – ReactNode. Popover content (required)</li>
            <li><code>open?</code> – boolean. Controlled open state (optional)</li>
            <li><code>onOpenChange?</code> – function. Callback when open state changes: <code>(open: boolean) {'=>'} void</code> (optional)</li>
            <li><code>side?</code> – "top" | "right" | "bottom" | "left" (default: "bottom"). Side of trigger to render against (optional)</li>
            <li><code>align?</code> – "start" | "center" | "end" (default: "center"). Alignment relative to trigger (optional)</li>
            <li><code>sideOffset?</code> – number (default: 4). Distance in pixels from the trigger (optional)</li>
            <li><code>alignOffset?</code> – number (default: 0). Additional offset in pixels from the aligned edge (optional)</li>
            <li><code>collisionPadding?</code> – number | object (default: 8). Collision detection padding (optional)</li>
            <li><code>portal?</code> – boolean (default: true). Enable portal rendering (optional)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "PopoverWrapper",
  "props": {
    "trigger": {
      "type": "component",
      "component": "Button",
      "children": "Open Popover"
    }
  },
  "children": {
    "type": "element",
    "tag": "div",
    "children": [
      {
        "type": "element",
        "tag": "h4",
        "children": "Popover Title"
      },
      {
        "type": "element",
        "tag": "p",
        "children": "This is the popover content."
      }
    ]
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
