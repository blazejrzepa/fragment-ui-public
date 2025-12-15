"use client";

import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarLabel, MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem, MenubarSub, MenubarSubTrigger, MenubarSubContent, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";

export default function MenubarPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Menubar</h1>
      </div>
      <p className="mb-6 intro-text">
        Access grouped commands from a top menu.
      </p>
      
      {/* Preview */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem shortcut="⌘N">New File</MenubarItem>
                <MenubarItem shortcut="⌘O">Open</MenubarItem>
                <MenubarItem shortcut="⌘S">Save</MenubarItem>
                <MenubarItem shortcut="⌘⇧S">Save As...</MenubarItem>
                <MenubarItem>Exit</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Edit</MenubarTrigger>
              <MenubarContent>
                <MenubarItem shortcut="⌘Z">Undo</MenubarItem>
                <MenubarItem shortcut="⌘⇧Z">Redo</MenubarItem>
                <MenubarItem shortcut="⌘X">Cut</MenubarItem>
                <MenubarItem shortcut="⌘C">Copy</MenubarItem>
                <MenubarItem shortcut="⌘V">Paste</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>View</MenubarTrigger>
              <MenubarContent>
                <MenubarCheckboxItem checked>Show Sidebar</MenubarCheckboxItem>
                <MenubarCheckboxItem checked>Show Status Bar</MenubarCheckboxItem>
                <MenubarLabel>Theme</MenubarLabel>
                <MenubarRadioGroup value="light">
                  <MenubarRadioItem value="light">Light</MenubarRadioItem>
                  <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
                  <MenubarRadioItem value="system">System</MenubarRadioItem>
                </MenubarRadioGroup>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarCheckboxItem,
  MenubarLabel,
  MenubarRadioGroup,
  MenubarRadioItem,
} from "@fragment_ui/ui";

<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem shortcut="⌘N">New File</MenubarItem>
      <MenubarItem shortcut="⌘O">Open</MenubarItem>
      <MenubarItem shortcut="⌘S">Save</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu>
    <MenubarTrigger>View</MenubarTrigger>
    <MenubarContent>
      <MenubarCheckboxItem checked>Show Sidebar</MenubarCheckboxItem>
      <MenubarLabel>Theme</MenubarLabel>
      <MenubarRadioGroup value="light">
        <MenubarRadioItem value="light">Light</MenubarRadioItem>
        <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
      </MenubarRadioGroup>
    </MenubarContent>
  </MenubarMenu>
</Menubar>`}</CodeBlock>
        </div>
      </div>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">{`npx shadcn@latest add https://fragmentui.com/r/menubar.json`}</CodeBlock>

      <Collapsible>
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <p><strong>Intent</strong></p>
          <p>
            <code>Menubar</code> is a component for accessing grouped commands from a top menu bar.<br />
            Use it when you need to provide a traditional menu bar interface (similar to desktop applications) with multiple menus, submenus, keyboard shortcuts, checkboxes, and radio groups. The component is ideal for applications that require a comprehensive command structure.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Desktop-style applications with menu bars</li>
            <li>Applications requiring multiple command groups</li>
            <li>Complex navigation structures with submenus</li>
            <li>Settings and preferences interfaces</li>
            <li>Applications with keyboard shortcuts</li>
            <li>Editor or IDE-style interfaces</li>
            <li>Any interface requiring a traditional menu bar pattern</li>
          </ul>

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Menubar"</code> and nested <code>MenubarMenu</code> components.
          </p>
          <p>Main components:</p>
          <ul>
            <li><code>Menubar</code> – Root container (required)</li>
            <li><code>MenubarMenu</code> – Individual menu group (required)</li>
            <li><code>MenubarTrigger</code> – Menu button/trigger (required)</li>
            <li><code>MenubarContent</code> – Menu dropdown content (required)</li>
            <li><code>MenubarItem</code> – Menu item with optional shortcut</li>
            <li><code>MenubarCheckboxItem</code> – Checkbox menu item</li>
            <li><code>MenubarRadioGroup</code> + <code>MenubarRadioItem</code> – Radio group menu items</li>
            <li><code>MenubarLabel</code> – Section label</li>
            <li><code>MenubarSeparator</code> – Visual separator</li>
            <li><code>MenubarSub</code> + <code>MenubarSubTrigger</code> + <code>MenubarSubContent</code> – Submenu support</li>
          </ul>
          <p>Props for <code>MenubarItem</code>:</p>
          <ul>
            <li><code>shortcut?</code> – Keyboard shortcut display: <code>string</code> (optional, e.g., "⌘N", "Ctrl+B")</li>
            <li><code>inset?</code> – Add left padding: <code>boolean</code> (optional)</li>
            <li><code>disabled?</code> – Disable item: <code>boolean</code> (optional)</li>
          </ul>
          <p>Props for <code>MenubarCheckboxItem</code>:</p>
          <ul>
            <li><code>checked?</code> – Checked state: <code>boolean</code> (optional)</li>
            <li><code>disabled?</code> – Disable item: <code>boolean</code> (optional)</li>
          </ul>
          <p>Props for <code>MenubarRadioGroup</code>:</p>
          <ul>
            <li><code>value</code> – Selected value: <code>string</code> (required)</li>
            <li><code>onValueChange?</code> – Change handler: <code>(value: string) =&gt; void</code> (optional)</li>
          </ul>

          <p><strong>Example</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Menubar",
  "children": [
    {
      "type": "component",
      "component": "MenubarMenu",
      "children": [
        {
          "type": "component",
          "component": "MenubarTrigger",
          "children": "File"
        },
        {
          "type": "component",
          "component": "MenubarContent",
          "children": [
            {
              "type": "component",
              "component": "MenubarItem",
              "props": {
                "shortcut": "⌘N"
              },
              "children": "New File"
            },
            {
              "type": "component",
              "component": "MenubarItem",
              "props": {
                "shortcut": "⌘O"
              },
              "children": "Open"
            }
          ]
        }
      ]
    }
  ]
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
      
      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/core-menubar--docs">Storybook</StorybookLink>
        </li>
      </ul>

    </DocumentContent>
  );
}
