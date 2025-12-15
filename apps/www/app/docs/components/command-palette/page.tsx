"use client";

import { CommandPalette, CodeBlock, DocumentContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";

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
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Command Palette</h1>
      </div>
      <p className="mb-6 intro-text">
        Search and run actions via keyboard.
      </p>
      
      
      {/* Default */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <p className="text-sm text-[color:var(--color-fg-muted)] mt-2">
            Click the button or press Cmd+K (Ctrl+K on Windows) to open
          </p>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { CommandPalette } from "@fragment_ui/ui";

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
    label: "Settings",
    keywords: ["settings", "preferences", "config"],
    group: "General",
    onSelect: () => console.log("Settings"),
  },
];

<CommandPalette
  actions={actions}
  placeholder="Type a command or search..."
  emptyText="No results found."
/>`}</CodeBlock>
        </div>
      </div>

      <h2 id="props">Props</h2>
      <ul>
        <li>
          <code>actions</code> - Array of action objects with id, label,
          keywords, shortcut, group, icon, and onSelect
        </li>
        <li>
          <code>trigger</code> - Custom trigger element (optional)
        </li>
        <li>
          <code>placeholder</code> - Search placeholder (default: "Type a
          command or search...")
        </li>
        <li>
          <code>emptyText</code> - Text when no results (default: "No results
          found.")
        </li>
      </ul>

      <h2 id="features">Features</h2>
      <ul>
        <li>Keyboard shortcut (Cmd+K / Ctrl+K)</li>
        <li>Fuzzy search with keywords</li>
        <li>Grouped actions</li>
        <li>Keyboard navigation</li>
        <li>Customizable trigger</li>
        <li>Full keyboard accessibility</li>
      </ul>

      
      
      <h2 id="install">Install</h2>
      <pre>
        <code>npx shadcn@latest add /r/command-palette.json</code>
      </pre>
      <h2 id="accessibility">Accessibility</h2>
      <p>
        Command palette is fully keyboard accessible with arrow keys for
        navigation, Enter to select, Escape to close, and automatic focus
        management. It includes proper ARIA attributes and is compliant with
        WCAG 2.1.
      </p>

      <h2 id="links">Links</h2>
      <ul>
        <li>
        </li>
      </ul>


    </DocumentContent>
  );
}


