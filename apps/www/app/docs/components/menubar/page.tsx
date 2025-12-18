"use client";

import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarLabel, MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem, MenubarSub, MenubarSubTrigger, MenubarSubContent, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent, CodeBlock } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const menubarCode = `import {
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

export function MenubarDemo() {
  return (
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
  );
}`;

export default function MenubarPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="menubar">Menubar</h1>
      </div>
      <p className="mb-6 intro-text">Top-level navigation with nested menus.</p>
      
      <ExampleSection
        id="menubar-example"
        title="Example"
        code={menubarCode}
      >
        <div className="flex gap-2 items-center justify-center w-full">
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
              <td className="py-2 px-4"><code>Menubar</code></td>
              <td className="py-2 px-4"><code>className?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Root container for the menu bar</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>MenubarMenu</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Individual menu group container</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>MenubarTrigger</code></td>
              <td className="py-2 px-4"><code>className?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Menu button that opens the dropdown</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>MenubarContent</code></td>
              <td className="py-2 px-4"><code>align?, alignOffset?, sideOffset?, className?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Dropdown menu content container</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>MenubarItem</code></td>
              <td className="py-2 px-4"><code>inset?, shortcut?, className?, children</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Standard menu item with optional keyboard shortcut</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>MenubarCheckboxItem</code></td>
              <td className="py-2 px-4"><code>checked, onCheckedChange?, className?, children</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Menu item with checkbox state</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>MenubarRadioGroup</code></td>
              <td className="py-2 px-4"><code>value, onValueChange?, className?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Container for radio menu items</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>MenubarRadioItem</code></td>
              <td className="py-2 px-4"><code>value, className?, children</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Radio menu item (use within MenubarRadioGroup)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>MenubarLabel</code></td>
              <td className="py-2 px-4"><code>inset?, className?, children</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Section label for grouping menu items</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>MenubarSeparator</code></td>
              <td className="py-2 px-4"><code>className?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Visual separator between menu sections</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>MenubarSub</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Container for submenu (use with MenubarSubTrigger and MenubarSubContent)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>MenubarSubTrigger</code></td>
              <td className="py-2 px-4"><code>inset?, className?, children</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Trigger for submenu</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>MenubarSubContent</code></td>
              <td className="py-2 px-4"><code>className?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Content container for submenu</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add menubar`}
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
            <code>Menubar</code> is a component for accessing grouped commands from a top menu bar. Use it when you need to provide a traditional menu bar interface (similar to desktop applications) with multiple menus, submenus, keyboard shortcuts, checkboxes, and radio groups. The component is ideal for applications that require a comprehensive command structure.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Desktop-style applications with menu bars</li>
            <li>Applications requiring multiple command groups</li>
            <li>Complex navigation structures with submenus</li>
            <li>Settings and preferences interfaces</li>
            <li>Applications with keyboard shortcuts</li>
            <li>Editor or IDE-style interfaces</li>
            <li>Any interface requiring a traditional menu bar pattern</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "Menubar"</code> and nested <code>MenubarMenu</code> components.
          </p>
          <p><strong>Props:</strong></p>
          <p>Main components:</p>
          <ul>
            <li><code>Menubar</code> – Root container (required)</li>
            <li><code>MenubarMenu</code> – Individual menu group (required)</li>
            <li><code>MenubarTrigger</code> – Menu button/trigger (required)</li>
            <li><code>MenubarContent</code> – Menu dropdown content (required)</li>
            <li><code>MenubarItem</code> – Menu item with optional shortcut prop</li>
            <li><code>MenubarCheckboxItem</code> – Checkbox menu item with checked prop</li>
            <li><code>MenubarRadioGroup</code> + <code>MenubarRadioItem</code> – Radio group menu items</li>
            <li><code>MenubarLabel</code> – Section label</li>
            <li><code>MenubarSeparator</code> – Visual separator</li>
            <li><code>MenubarSub</code> + <code>MenubarSubTrigger</code> + <code>MenubarSubContent</code> – Submenu support</li>
          </ul>

          <h3>Example</h3>
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
    </DocumentContent>
  );
}
