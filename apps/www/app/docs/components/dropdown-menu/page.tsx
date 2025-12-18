"use client";

import * as React from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuRadioGroup, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent, CodeBlock, Badge, Button } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const dropdownMenuCode = `import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";

export function DropdownMenuDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-8)] w-full">
      <div className="flex flex-col gap-[var(--space-4)]">
        <p className="text-sm text-[color:var(--color-fg-muted)]">Default</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem disabled>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col gap-[var(--space-4)]">
        <p className="text-sm text-[color:var(--color-fg-muted)]">With Submenu</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Back</DropdownMenuItem>
            <DropdownMenuItem disabled>Forward</DropdownMenuItem>
            <DropdownMenuItem>Reload</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>More Tools</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Save Page As…</DropdownMenuItem>
                <DropdownMenuItem>Create Shortcut…</DropdownMenuItem>
                <DropdownMenuItem>Name Window…</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Developer Tools</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Print</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}`;

export default function DropdownMenuPage() {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
  const [urlsChecked, setUrlsChecked] = React.useState(false);
  const [person, setPerson] = React.useState("pedro");

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="dropdown-menu">Dropdown Menu</h1>
      </div>
      <p className="mb-6 intro-text">Display a list of actions or options.</p>
      
      <ExampleSection
        id="dropdown-menu-example"
        title="Dropdown Menu Example"
        code={dropdownMenuCode}
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-8)] w-full max-w-4xl">
            <div className="flex flex-col gap-[var(--space-4)]">
              <p className="text-sm text-[color:var(--color-fg-muted)]">Default</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Open Menu</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem disabled>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex flex-col gap-[var(--space-4)]">
              <p className="text-sm text-[color:var(--color-fg-muted)]">With Submenu</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Open Menu</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Back</DropdownMenuItem>
                  <DropdownMenuItem disabled>Forward</DropdownMenuItem>
                  <DropdownMenuItem>Reload</DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>More Tools</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>Save Page As…</DropdownMenuItem>
                      <DropdownMenuItem>Create Shortcut…</DropdownMenuItem>
                      <DropdownMenuItem>Name Window…</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Developer Tools</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Print</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add dropdown-menu`}
      </CodeBlock>

      {/* API Reference */}
      <h2 id="api" className="mt-8">API Reference</h2>
      <div className="mt-4 border border-[color:var(--color-border-base)] rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-2 px-4 font-semibold text-sm">Component</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Prop</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Type</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Default</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>DropdownMenu</code></td>
              <td className="py-2 px-4"><code>open?, onOpenChange?, modal?</code></td>
              <td className="py-2 px-4"><code>boolean, function, boolean</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Root component. Must contain <code>DropdownMenuTrigger</code> and <code>DropdownMenuContent</code></td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>DropdownMenuTrigger</code></td>
              <td className="py-2 px-4"><code>asChild?</code></td>
              <td className="py-2 px-4"><code>boolean</code></td>
              <td className="py-2 px-4"><code>false</code></td>
              <td className="py-2 px-4 text-sm">Trigger element that opens the menu</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>DropdownMenuContent</code></td>
              <td className="py-2 px-4"><code>side?, align?, sideOffset?, className?</code></td>
              <td className="py-2 px-4"><code>string, string, number, string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Container for menu items</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>DropdownMenuItem</code></td>
              <td className="py-2 px-4"><code>inset?, disabled?, className?</code></td>
              <td className="py-2 px-4"><code>boolean, boolean, string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Standard menu item</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>DropdownMenuLabel</code></td>
              <td className="py-2 px-4"><code>inset?, className?</code></td>
              <td className="py-2 px-4"><code>boolean, string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Section label for grouping items</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>DropdownMenuSeparator</code></td>
              <td className="py-2 px-4"><code>className?</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Visual separator between menu sections</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>DropdownMenuCheckboxItem</code></td>
              <td className="py-2 px-4"><code>checked, onCheckedChange, className?</code></td>
              <td className="py-2 px-4"><code>boolean, function, string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Menu item with checkbox state</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>DropdownMenuRadioItem</code></td>
              <td className="py-2 px-4"><code>value, className?</code></td>
              <td className="py-2 px-4"><code>string, string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Menu item with radio state (use within <code>DropdownMenuRadioGroup</code>)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>DropdownMenuSub</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Container for submenu (use with <code>DropdownMenuSubTrigger</code> and <code>DropdownMenuSubContent</code>)</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>DropdownMenuSubTrigger</code></td>
              <td className="py-2 px-4"><code>inset?, className?</code></td>
              <td className="py-2 px-4"><code>boolean, string</code></td>
              <td className="py-2 px-4">—</td>
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
            <code>DropdownMenu</code> is a component for displaying a menu to the user—such as a set of actions or functions—triggered by a button. Use it when you need to provide a list of actions or options that are accessible via a button click. Dropdown menus are ideal for navigation, settings, user account actions, and any scenario where you want to organize multiple options in a compact, accessible menu.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>User account menus (profile, settings, logout)</li>
            <li>Action menus (edit, delete, share, etc.)</li>
            <li>Navigation menus with submenus</li>
            <li>Filter or sort options</li>
            <li>Contextual actions for lists or tables</li>
            <li>Settings or configuration panels</li>
            <li>Any scenario requiring a button-triggered menu</li>
          </ul>

          <p><strong>UI-DSL Usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "DropdownMenu"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>children</code> – Must include <code>DropdownMenuTrigger</code> and <code>DropdownMenuContent</code> (required)</li>
            <li><code>open?</code> – Controlled open state for programmatic control (optional)</li>
            <li><code>onOpenChange?</code> – Callback function that receives the open state when it changes (optional)</li>
            <li><code>modal?</code> – Whether the menu is modal (blocks interaction with other elements) (optional, default: <code>true</code>)</li>
          </ul>
          <p>Within <code>DropdownMenuContent</code>, you can use:</p>
          <ul>
            <li><code>DropdownMenuItem</code> – Standard menu item that triggers an action when clicked</li>
            <li><code>DropdownMenuLabel</code> – Section label for grouping related menu items</li>
            <li><code>DropdownMenuSeparator</code> – Visual separator between menu sections</li>
            <li><code>DropdownMenuCheckboxItem</code> – Menu item with checkbox state (use <code>checked</code> and <code>onCheckedChange</code> props)</li>
            <li><code>DropdownMenuRadioGroup</code> – Container for radio menu items (use with <code>DropdownMenuRadioItem</code>)</li>
            <li><code>DropdownMenuRadioItem</code> – Menu item with radio state (use within <code>DropdownMenuRadioGroup</code>)</li>
            <li><code>DropdownMenuSub</code> – Container for submenu (use with <code>DropdownMenuSubTrigger</code> and <code>DropdownMenuSubContent</code>)</li>
            <li><code>DropdownMenuSubTrigger</code> – Trigger element that opens a submenu</li>
            <li><code>DropdownMenuSubContent</code> – Container for submenu items</li>
          </ul>

          <h3>Basic Menu</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "DropdownMenu",
  "children": [
    {
      "type": "component",
      "component": "DropdownMenuTrigger",
      "props": { "asChild": true },
      "children": {
        "type": "component",
        "component": "Button",
        "children": "Open Menu"
      }
    },
    {
      "type": "component",
      "component": "DropdownMenuContent",
      "children": [
        {
          "type": "component",
          "component": "DropdownMenuItem",
          "children": "Profile"
        },
        {
          "type": "component",
          "component": "DropdownMenuItem",
          "children": "Settings"
        },
        {
          "type": "component",
          "component": "DropdownMenuSeparator"
        },
        {
          "type": "component",
          "component": "DropdownMenuItem",
          "props": { "disabled": true },
          "children": "Logout"
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
