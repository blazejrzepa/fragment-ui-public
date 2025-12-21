"use client";

import { Toggle, DocumentContent, CodeBlock, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { Bold, Italic, Underline } from "lucide-react";
import { ExampleSection } from "../../../../src/components/example-section";

const toggleCode = `import { Toggle } from "@fragment_ui/ui";

export function ToggleDemo() {
  return (
    <Toggle aria-label="Toggle bold">Bold</Toggle>
  );
}`;

const toggleIconsCode = `import { Toggle } from "@fragment_ui/ui";
import { Bold, Italic, Underline } from "lucide-react";

export function ToggleIconsDemo() {
  return (
    <div className="flex gap-[var(--space-2)]">
      <Toggle aria-label="Toggle bold">
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Toggle italic">
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Toggle underline">
        <Underline className="h-4 w-4" />
      </Toggle>
    </div>
  );
}`;

export default function TogglePage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-[var(--space-4)] mb-[var(--space-1)]">
        <h1 id="toggle">Toggle</h1>
      </div>
      <p className="mb-[var(--space-6)] intro-text">Small on/off or pressed/unpressed control.</p>
      
      <ExampleSection
        id="toggle-example"
        title="Example"
        code={toggleCode}
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <Toggle aria-label="Toggle bold">Bold</Toggle>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add toggle`}
      </CodeBlock>

      <ExampleSection
        id="toggle-icons"
        title="With Icons"
        code={toggleIconsCode}
        marginTop="mt-[var(--space-8)]"
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <div className="flex gap-[var(--space-2)]">
            <Toggle aria-label="Toggle bold">
              <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle aria-label="Toggle italic">
              <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle aria-label="Toggle underline">
              <Underline className="h-4 w-4" />
            </Toggle>
          </div>
        </div>
      </ExampleSection>

      <h2 id="api-reference">API Reference</h2>
      <div className="mt-[var(--space-4)] border border-[color:var(--color-border-base)] rounded-[var(--radius-lg)] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Prop</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Type</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Default</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>pressed?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Controlled pressed state (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>defaultPressed?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">false</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Default pressed state (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>onPressedChange?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>(pressed: boolean) {'=>'} void</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Callback when pressed state changes (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>disabled?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">false</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Disable the toggle (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>aria-label?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Accessibility label (required for icon-only toggles)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Additional CSS classes (optional)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Collapsible className="mt-[var(--space-8)]">
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation" className="m-0">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-[var(--space-4)]">
          <h3>Intent</h3>
          <p>
            <code>Toggle</code> is a component for turning a single feature on or off. Use it when you need to provide a toggle button that can be pressed to activate or deactivate a feature. The component supports both text and icon content and provides visual feedback for the pressed state.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Text formatting controls (bold, italic, underline)</li>
            <li>Feature toggles</li>
            <li>Toolbar buttons</li>
            <li>Any scenario requiring a toggle button</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "Toggle"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>pressed?</code> – boolean. Controlled pressed state (optional)</li>
            <li><code>defaultPressed?</code> – boolean. Default pressed state (optional, default: false)</li>
            <li><code>onPressedChange?</code> – function. Callback when pressed state changes: <code>(pressed: boolean) {'=>'} void</code> (optional)</li>
            <li><code>disabled?</code> – boolean. Disable the toggle (optional, default: false)</li>
            <li><code>aria-label?</code> – string. Accessibility label (required for icon-only toggles)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Toggle",
  "props": {
    "aria-label": "Toggle bold"
  },
  "children": "Bold"
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
