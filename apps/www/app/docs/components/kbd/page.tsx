"use client";

import { Kbd, KbdGroup, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";

export default function KbdPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Kbd</h1>
      </div>
      <p className="mb-6 intro-text">
        Display keyboard shortcuts in UI.
      </p>
      
      {/* Preview */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="flex flex-col gap-8 items-center">
            <div className="flex flex-col gap-4 items-center">
              <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Default</p>
              <div className="flex items-center gap-4">
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
                <Kbd>Ctrl</Kbd>
                <Kbd>B</Kbd>
              </div>
            </div>

            <div className="flex flex-col gap-4 items-center">
              <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>With Group</p>
              <div className="flex flex-col gap-4">
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
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { Kbd, KbdGroup } from "@fragment_ui/ui";

<div className="flex items-center gap-4">
  <Kbd>⌘</Kbd>
  <Kbd>K</Kbd>
  <Kbd>Ctrl</Kbd>
  <Kbd>B</Kbd>
</div>

<KbdGroup>
  <Kbd>⌘</Kbd>
  <span>+</span>
  <Kbd>K</Kbd>
</KbdGroup>`}</CodeBlock>
        </div>
      </div>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">{`npx shadcn@latest add https://fragmentui.com/r/kbd.json`}</CodeBlock>

      <Collapsible>
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <p><strong>Intent</strong></p>
          <p>
            <code>Kbd</code> is a component for displaying keyboard shortcuts in UI.<br />
            Use it when you need to show keyboard key labels or shortcuts to users, such as in tooltips, help text, documentation, or command palettes. The component provides visual distinction for keyboard keys using semantic HTML.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Keyboard shortcuts in tooltips or help text</li>
            <li>Command palette shortcuts</li>
            <li>Documentation showing keyboard commands</li>
            <li>Settings pages displaying key bindings</li>
            <li>Help dialogs with keyboard navigation hints</li>
            <li>Any UI that needs to display keyboard key labels</li>
          </ul>

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Kbd"</code> or <code>component: "KbdGroup"</code>.
          </p>
          <p>Props for <code>Kbd</code>:</p>
          <ul>
            <li><code>children</code> – Key label text (required, e.g., "⌘", "K", "Ctrl", "B")</li>
            <li><code>className?</code> – Additional CSS classes (optional)</li>
          </ul>
          <p>Props for <code>KbdGroup</code>:</p>
          <ul>
            <li><code>children</code> – Multiple <code>Kbd</code> components and separators (required)</li>
            <li><code>className?</code> – Additional CSS classes (optional)</li>
          </ul>
          <p><strong>Common keys:</strong> <code>⌘</code> (Command), <code>Ctrl</code>, <code>⇧</code> (Shift), <code>⌥</code> (Option), <code>⌃</code> (Control)</p>

          <p><strong>Example</strong></p>
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
      
      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/core-kbd--docs">Storybook</StorybookLink>
        </li>
      </ul>

    </DocumentContent>
  );
}
