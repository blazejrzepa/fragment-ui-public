"use client";

import { Kbd, KbdGroup, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent, CodeBlock } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";

const kbdCode = `import { Kbd, KbdGroup } from "@fragment_ui/ui";

export function KbdDemo() {
  return (
    <div className="flex flex-col gap-[var(--space-8)] items-center">
      <div className="flex flex-col gap-[var(--space-4)] items-center">
        <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Default</p>
        <div className="flex items-center gap-[var(--space-4)]">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
          <Kbd>Ctrl</Kbd>
          <Kbd>B</Kbd>
        </div>
      </div>

      <div className="flex flex-col gap-[var(--space-4)] items-center">
        <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>With Group</p>
        <div className="flex flex-col gap-[var(--space-4)]">
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <span>+</span>
            <Kbd>K</Kbd>
          </KbdGroup>
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <span>+</span>
            <Kbd>B</Kbd>
          </KbdGroup>
        </div>
      </div>
    </div>
  );
}`;

export default function KbdPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="kbd">Kbd</h1>
      </div>
      <p className="mb-6 intro-text">Display keyboard shortcuts in UI.</p>
      
      <ExampleSection
        id="kbd-example"
        title="Example"
        code={kbdCode}
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="flex flex-col gap-[var(--space-8)] items-center">
            <div className="flex flex-col gap-[var(--space-4)] items-center">
              <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Default</p>
              <div className="flex items-center gap-[var(--space-4)]">
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
                <Kbd>Ctrl</Kbd>
                <Kbd>B</Kbd>
              </div>
            </div>

            <div className="flex flex-col gap-[var(--space-4)] items-center">
              <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>With Group</p>
              <div className="flex flex-col gap-[var(--space-4)]">
                <KbdGroup>
                  <Kbd>⌘</Kbd>
                  <span>+</span>
                  <Kbd>K</Kbd>
                </KbdGroup>
                <KbdGroup>
                  <Kbd>Ctrl</Kbd>
                  <span>+</span>
                  <Kbd>B</Kbd>
                </KbdGroup>
              </div>
            </div>
          </div>
        </div>
      </ExampleSection>

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
              <td className="py-2 px-4"><code>Kbd</code></td>
              <td className="py-2 px-4"><code>children, className?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Keyboard key label component</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>KbdGroup</code></td>
              <td className="py-2 px-4"><code>children, className?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Container for grouping multiple keyboard keys</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add kbd`}
      </CodeBlock>

      <Collapsible className="mt-8">
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation" className="m-0">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <h3>Intent</h3>
          <p>
            <code>Kbd</code> is a component for displaying keyboard shortcuts in UI. Use it when you need to show keyboard key labels or shortcuts to users, such as in tooltips, help text, documentation, or command palettes. The component provides visual distinction for keyboard keys using semantic HTML.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Keyboard shortcuts in tooltips or help text</li>
            <li>Command palette shortcuts</li>
            <li>Documentation showing keyboard commands</li>
            <li>Settings pages displaying key bindings</li>
            <li>Help dialogs with keyboard navigation hints</li>
            <li>Any UI that needs to display keyboard key labels</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "Kbd"</code> or <code>component: "KbdGroup"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <p>Props for <code>Kbd</code>:</p>
          <ul>
            <li><code>children</code> – Key label text (required, e.g., "⌘", "K", "Ctrl", "B")</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>
          <p>Props for <code>KbdGroup</code>:</p>
          <ul>
            <li><code>children</code> – Multiple <code>Kbd</code> components and separators (required)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>
          <p><strong>Common keys:</strong> <code>⌘</code> (Command), <code>Ctrl</code>, <code>⇧</code> (Shift), <code>⌥</code> (Option), <code>⌃</code> (Control)</p>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "KbdGroup",
  "children": [
    {
      "type": "component",
      "component": "Kbd",
      "children": "⌘"
    },
    {
      "type": "text",
      "text": "+"
    },
    {
      "type": "component",
      "component": "Kbd",
      "children": "K"
    }
  ]
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
