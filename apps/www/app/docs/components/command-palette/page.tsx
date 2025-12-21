"use client";

import { CommandPalette, CodeBlock, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent, Badge } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";

const commandPaletteCode = `import { CommandPalette } from "@fragment_ui/ui";

const actions = [
  {
    id: "1",
    label: "New File",
    keywords: ["create", "file", "new"],
    shortcut: "⌘N",
    group: "File",
    onSelect: () => console.log("New File"),
  },
  {
    id: "2",
    label: "Open File",
    keywords: ["open", "file"],
    shortcut: "⌘O",
    group: "File",
    onSelect: () => console.log("Open File"),
  },
  {
    id: "3",
    label: "Save",
    keywords: ["save", "file"],
    shortcut: "⌘S",
    group: "File",
    onSelect: () => console.log("Save"),
  },
  {
    id: "4",
    label: "Search",
    keywords: ["search", "find"],
    shortcut: "⌘F",
    group: "Edit",
    onSelect: () => console.log("Search"),
  },
  {
    id: "5",
    label: "Settings",
    keywords: ["settings", "preferences", "config"],
    group: "General",
    onSelect: () => console.log("Settings"),
  },
];

export function CommandPaletteDemo() {
  return (
    <CommandPalette
      actions={actions}
      placeholder="Type a command or search..."
      emptyText="No results found."
    />
  );
}`;

export default function CommandPalettePage() {
  const actions = [
    {
      id: "1",
      label: "New File",
      keywords: ["create", "file", "new"],
      shortcut: "⌘N",
      group: "File",
      onSelect: () => console.log("New File"),
    },
    {
      id: "2",
      label: "Open File",
      keywords: ["open", "file"],
      shortcut: "⌘O",
      group: "File",
      onSelect: () => console.log("Open File"),
    },
    {
      id: "3",
      label: "Save",
      keywords: ["save", "file"],
      shortcut: "⌘S",
      group: "File",
      onSelect: () => console.log("Save"),
    },
    {
      id: "4",
      label: "Search",
      keywords: ["search", "find"],
      shortcut: "⌘F",
      group: "Edit",
      onSelect: () => console.log("Search"),
    },
    {
      id: "5",
      label: "Settings",
      keywords: ["settings", "preferences", "config"],
      group: "General",
      onSelect: () => console.log("Settings"),
    },
  ];

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-[var(--space-4)] mb-[var(--space-1)]">
        <h1 id="command-palette">Command Palette</h1>
        <Badge variant="outline" size="sm">Docs</Badge>
      </div>
      <p className="mb-[var(--space-6)] intro-text">Run actions quickly via search and shortcuts.</p>
      
      <ExampleSection
        id="command-palette-example"
        title="Example"
        code={commandPaletteCode}
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <CommandPalette
            actions={actions}
            placeholder="Type a command or search..."
            emptyText="No results found."
          />
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <p>The Command Palette is built using a composition of the <code>Command</code> and <code>Dialog</code> components.</p>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add command-palette`}
      </CodeBlock>

      {/* API Reference */}
      <h2 id="api" className="mt-[var(--space-8)]">API Reference</h2>
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
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>actions</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>CommandPaletteAction[]</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>[]</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Array of action objects (required)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>trigger</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>React.ReactNode</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Custom trigger element (optional, defaults to Button)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>placeholder</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>"Type a command or search..."</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Placeholder text for the search input</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>emptyText</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>"No results found."</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Text to show when no results found</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>showRecentCommands</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>true</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Show recent commands section</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>maxRecentCommands</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>number</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>5</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Maximum number of recent commands to show</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>recentCommandsStorageKey</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>"command-palette-recent"</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">localStorage key for storing recent commands</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-[var(--space-4)] border border-[color:var(--color-border-base)] rounded-[var(--radius-lg)] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>CommandPaletteAction Property</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Type</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Required</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>id</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">✓</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Unique identifier for the action (required)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>label</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">✓</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Display text for the action (required)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>keywords</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string[]</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Array of search keywords for filtering</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>shortcut</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Keyboard shortcut display (e.g., "⌘N")</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>icon</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>React.ReactNode</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Icon element to display before the label</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>group</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Group name for organizing actions</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>onSelect</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>() =&gt; void</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Callback function when action is selected</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>children</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>CommandPaletteAction[]</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Nested actions for hierarchical commands</td>
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
          <p><strong>Intent</strong></p>
          <p>
            <code>CommandPalette</code> is a component for searching and executing actions via keyboard shortcuts. Use it when you need to provide users with a quick way to access commands, actions, or navigation options through a searchable interface, typically triggered by keyboard shortcuts like Cmd+K or Ctrl+K.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Quick command access in applications</li>
            <li>Keyboard-driven navigation and actions</li>
            <li>Search functionality for commands</li>
            <li>Power user interfaces</li>
            <li>Any application requiring fast action execution</li>
          </ul>

          <p><strong>UI-DSL Usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "CommandPalette"</code>.
          </p>
          
          <p><strong>Props</strong></p>
          <ul>
            <li><code>actions</code> – CommandPaletteAction[]. Array of action objects (required). Each action can have:
              <ul>
                <li><code>id</code> – string. Unique identifier for the action (required)</li>
                <li><code>label</code> – string. Display text for the action (required)</li>
                <li><code>keywords?</code> – string[]. Array of search keywords for filtering</li>
                <li><code>shortcut?</code> – string. Keyboard shortcut display (e.g., "⌘N")</li>
                <li><code>icon?</code> – React.ReactNode. Icon element to display before the label</li>
                <li><code>group?</code> – string. Group name for organizing actions</li>
                <li><code>onSelect?</code> – function. Callback when action is selected: <code>() =&gt; void</code></li>
                <li><code>children?</code> – CommandPaletteAction[]. Nested actions for hierarchical commands</li>
              </ul>
            </li>
            <li><code>trigger?</code> – React.ReactNode. Custom trigger element (optional, defaults to Button)</li>
            <li><code>placeholder?</code> – string (default: <code>"Type a command or search..."</code>). Placeholder text for the search input</li>
            <li><code>emptyText?</code> – string (default: <code>"No results found."</code>). Text to show when no results found</li>
            <li><code>showRecentCommands?</code> – boolean (default: <code>true</code>). Show recent commands section</li>
            <li><code>maxRecentCommands?</code> – number (default: <code>5</code>). Maximum number of recent commands to show</li>
            <li><code>recentCommandsStorageKey?</code> – string (default: <code>"command-palette-recent"</code>). localStorage key for storing recent commands</li>
          </ul>
          <p>The Command Palette is built using a composition of the <code>Command</code> and <code>Dialog</code> components, providing searchable command access with keyboard navigation. Press Cmd+K (Ctrl+K on Windows) to open.</p>

          <h3 className="mt-6 mb-4">Basic Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "CommandPalette",
  "props": {
    "actions": [
      {
        "id": "new-file",
        "label": "New File",
        "keywords": ["create", "file", "new"],
        "shortcut": "⌘N",
        "group": "File",
        "onSelect": "handleNewFile"
      },
      {
        "id": "open-file",
        "label": "Open File",
        "keywords": ["open", "file"],
        "shortcut": "⌘O",
        "group": "File",
        "onSelect": "handleOpenFile"
      }
    ],
    "placeholder": "Type a command or search...",
    "emptyText": "No results found."
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
