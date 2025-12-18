"use client";

import { useState } from "react";
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuShortcut, ContextMenuCheckboxItem, ContextMenuRadioItem, ContextMenuRadioGroup, ContextMenuSub, ContextMenuSubTrigger, ContextMenuSubContent, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent, CodeBlock, Badge } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const contextMenuCode = `import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuRadioGroup,
  ContextMenuLabel,
} from "@fragment_ui/ui";

export function ContextMenuDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
      <div className="flex flex-col gap-4">
        <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Default</p>
        <ContextMenu>
          <ContextMenuTrigger className="flex h-[150px] w-full items-center justify-center rounded-md border border-dashed border-[color:var(--color-border-base)] text-sm">
            Right click here
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Back</ContextMenuItem>
            <ContextMenuItem disabled>Forward</ContextMenuItem>
            <ContextMenuItem>Reload</ContextMenuItem>
            <ContextMenuItem>
              Print
              <ContextMenuShortcut>⌘P</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>With Submenu</p>
        <ContextMenu>
          <ContextMenuTrigger className="flex h-[150px] w-full items-center justify-center rounded-md border border-dashed border-[color:var(--color-border-base)] text-sm">
            Right click here
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Back</ContextMenuItem>
            <ContextMenuItem disabled>Forward</ContextMenuItem>
            <ContextMenuItem>Reload</ContextMenuItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem>Save Page As…</ContextMenuItem>
                <ContextMenuItem>Create Shortcut…</ContextMenuItem>
                <ContextMenuItem>Name Window…</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem>Developer Tools</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuItem>
              Print
              <ContextMenuShortcut>⌘P</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    </div>
  );
}`;

export default function ContextMenuPage() {
  const [bookmarksChecked, setBookmarksChecked] = useState(true);
  const [urlsChecked, setUrlsChecked] = useState(false);
  const [person, setPerson] = useState("pedro");

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="context-menu">Context Menu</h1>
      </div>
      <p className="mb-6 intro-text">Show actions based on right-click context.</p>
      
      <ExampleSection
        id="context-menu-example"
        title="Example"
        code={contextMenuCode}
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <div className="flex flex-col gap-4">
            <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Default</p>
            <ContextMenu>
              <ContextMenuTrigger className="flex h-[150px] w-full items-center justify-center rounded-md border border-dashed border-[color:var(--color-border-base)] text-sm">
                Right click here
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem>Back</ContextMenuItem>
                <ContextMenuItem disabled>Forward</ContextMenuItem>
                <ContextMenuItem>Reload</ContextMenuItem>
                <ContextMenuItem>
                  Print
                  <ContextMenuShortcut>⌘P</ContextMenuShortcut>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>With Submenu</p>
            <ContextMenu>
              <ContextMenuTrigger className="flex h-[150px] w-full items-center justify-center rounded-md border border-dashed border-[color:var(--color-border-base)] text-sm">
                Right click here
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem>Back</ContextMenuItem>
                <ContextMenuItem disabled>Forward</ContextMenuItem>
                <ContextMenuItem>Reload</ContextMenuItem>
                <ContextMenuSub>
                  <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
                  <ContextMenuSubContent>
                    <ContextMenuItem>Save Page As…</ContextMenuItem>
                    <ContextMenuItem>Create Shortcut…</ContextMenuItem>
                    <ContextMenuItem>Name Window…</ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem>Developer Tools</ContextMenuItem>
                  </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuSeparator />
                <ContextMenuItem>
                  Print
                  <ContextMenuShortcut>⌘P</ContextMenuShortcut>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>
          </div>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <p>The Context Menu is built using Radix UI primitives.</p>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add context-menu`}
      </CodeBlock>

      {/* API Reference */}
      <h2 id="api" className="mt-8">API Reference</h2>
      <div className="mt-4 border border-[color:var(--color-border-base)] rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-2 px-4 font-semibold text-sm">Component</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Props</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>ContextMenu</code></td>
              <td className="py-2 px-4"><code>modal?, onOpenChange?</code></td>
              <td className="py-2 px-4 text-sm">Root component. Must contain <code>ContextMenuTrigger</code> and <code>ContextMenuContent</code></td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>ContextMenuTrigger</code></td>
              <td className="py-2 px-4"><code>asChild?, className?</code></td>
              <td className="py-2 px-4 text-sm">Trigger element that opens the menu on right-click</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>ContextMenuContent</code></td>
              <td className="py-2 px-4"><code>align?, side?, className?</code></td>
              <td className="py-2 px-4 text-sm">Container for menu items</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>ContextMenuItem</code></td>
              <td className="py-2 px-4"><code>inset?, disabled?, className?</code></td>
              <td className="py-2 px-4 text-sm">Standard menu item</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>ContextMenuCheckboxItem</code></td>
              <td className="py-2 px-4"><code>checked, onCheckedChange, className?</code></td>
              <td className="py-2 px-4 text-sm">Menu item with checkbox state</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>ContextMenuRadioItem</code></td>
              <td className="py-2 px-4"><code>value, className?</code></td>
              <td className="py-2 px-4 text-sm">Menu item with radio state (use within <code>ContextMenuRadioGroup</code>)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>ContextMenuLabel</code></td>
              <td className="py-2 px-4"><code>inset?, className?</code></td>
              <td className="py-2 px-4 text-sm">Section label for grouping items</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>ContextMenuSeparator</code></td>
              <td className="py-2 px-4"><code>className?</code></td>
              <td className="py-2 px-4 text-sm">Visual separator between menu sections</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>ContextMenuShortcut</code></td>
              <td className="py-2 px-4"><code>className?</code></td>
              <td className="py-2 px-4 text-sm">Keyboard shortcut display (e.g., "⌘P")</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>ContextMenuSub</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Container for submenu (use with <code>ContextMenuSubTrigger</code> and <code>ContextMenuSubContent</code>)</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>ContextMenuSubTrigger</code></td>
              <td className="py-2 px-4"><code>inset?, className?</code></td>
              <td className="py-2 px-4 text-sm">Trigger for submenu</td>
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
          <p><strong>Intent</strong></p>
          <p>
            <code>ContextMenu</code> is a component for displaying a menu located at the pointer, triggered by a right click or a long press. Use it when you need to provide contextual actions for specific UI elements, such as table row actions, file operations, or advanced interactions that appear on right-click. The menu appears at the cursor position and provides quick access to relevant actions without cluttering the main interface.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Table row actions and bulk operations</li>
            <li>File and folder operations in file managers</li>
            <li>Text selection actions (copy, paste, format)</li>
            <li>Image or media item actions</li>
            <li>Any scenario where contextual actions should appear on right-click</li>
          </ul>

          <p><strong>UI-DSL Usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "ContextMenu"</code>.
          </p>
          
          <p><strong>Props</strong></p>
          <ul>
            <li><code>ContextMenu</code> – Root component. Props:
              <ul>
                <li><code>modal?</code> – boolean (default: <code>true</code>). Whether the menu is modal</li>
                <li><code>onOpenChange?</code> – function. Callback when open state changes: <code>(open: boolean) =&gt; void</code></li>
                <li><code>children</code> – Must include <code>ContextMenuTrigger</code> and <code>ContextMenuContent</code> (required)</li>
              </ul>
            </li>
            <li><code>ContextMenuTrigger</code> – Trigger element. Props:
              <ul>
                <li><code>asChild?</code> – boolean. Merge props with child element</li>
                <li><code>className?</code> – string. Additional CSS classes</li>
              </ul>
            </li>
            <li><code>ContextMenuContent</code> – Container for menu items. Props:
              <ul>
                <li><code>align?</code> – <code>"start" | "center" | "end"</code>. Alignment relative to trigger</li>
                <li><code>side?</code> – <code>"top" | "right" | "bottom" | "left"</code>. Side of trigger to appear on</li>
                <li><code>className?</code> – string. Additional CSS classes</li>
              </ul>
            </li>
            <li><code>ContextMenuItem</code> – Standard menu item. Props:
              <ul>
                <li><code>inset?</code> – boolean. Add left padding for nested items</li>
                <li><code>disabled?</code> – boolean. Disable the item</li>
                <li><code>className?</code> – string. Additional CSS classes</li>
              </ul>
            </li>
            <li><code>ContextMenuCheckboxItem</code> – Checkbox item. Props:
              <ul>
                <li><code>checked</code> – boolean. Checked state (required)</li>
                <li><code>onCheckedChange</code> – function. Callback when checked changes: <code>(checked: boolean) =&gt; void</code></li>
                <li><code>className?</code> – string. Additional CSS classes</li>
              </ul>
            </li>
            <li><code>ContextMenuRadioItem</code> – Radio item (use within <code>ContextMenuRadioGroup</code>). Props:
              <ul>
                <li><code>value</code> – string. Radio value (required)</li>
                <li><code>className?</code> – string. Additional CSS classes</li>
              </ul>
            </li>
            <li><code>ContextMenuLabel</code> – Section label. Props:
              <ul>
                <li><code>inset?</code> – boolean. Add left padding</li>
                <li><code>className?</code> – string. Additional CSS classes</li>
              </ul>
            </li>
            <li><code>ContextMenuSeparator</code> – Visual separator. Props:
              <ul>
                <li><code>className?</code> – string. Additional CSS classes</li>
              </ul>
            </li>
            <li><code>ContextMenuShortcut</code> – Keyboard shortcut display. Props:
              <ul>
                <li><code>className?</code> – string. Additional CSS classes</li>
              </ul>
            </li>
            <li><code>ContextMenuSub</code> – Submenu container. Use with <code>ContextMenuSubTrigger</code> and <code>ContextMenuSubContent</code> for nested menus</li>
          </ul>
          <p>The Context Menu is built using Radix UI primitives, providing accessible right-click menus with keyboard navigation support.</p>

          <h3 className="mt-6 mb-4">Basic Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "ContextMenu",
  "children": [
    {
      "type": "component",
      "component": "ContextMenuTrigger",
      "children": "Right click here"
    },
    {
      "type": "component",
      "component": "ContextMenuContent",
      "children": [
        {
          "type": "component",
          "component": "ContextMenuItem",
          "children": "Back"
        },
        {
          "type": "component",
          "component": "ContextMenuItem",
          "props": { "disabled": true },
          "children": "Forward"
        },
        {
          "type": "component",
          "component": "ContextMenuItem",
          "children": [
            "Print",
            {
              "type": "component",
              "component": "ContextMenuShortcut",
              "children": "⌘P"
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
