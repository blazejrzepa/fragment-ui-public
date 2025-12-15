"use client";

import * as React from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuRadioGroup, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";

export default function DropdownMenuPage() {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
  const [urlsChecked, setUrlsChecked] = React.useState(false);
  const [person, setPerson] = React.useState("pedro");

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Dropdown Menu</h1>
      </div>
      <p className="mb-6 intro-text">
        Displays a menu to the user—such as a set of actions or functions—triggered by a button.
      </p>
      
      {/* Preview */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            <div className="flex flex-col gap-4">
              <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Default</p>
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

            <div className="flex flex-col gap-4">
              <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>With Submenu</p>
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

            <div className="flex flex-col gap-4">
              <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>With Checkbox Items</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Open Menu</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Back</DropdownMenuItem>
                  <DropdownMenuItem>Forward</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={bookmarksChecked}
                    onCheckedChange={setBookmarksChecked}
                  >
                    Show Bookmarks
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={urlsChecked}
                    onCheckedChange={setUrlsChecked}
                  >
                    Show Full URLs
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>With Radio Items</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Open Menu</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>People</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={person} onValueChange={setPerson}>
                    <DropdownMenuRadioItem value="pedro">Pedro Duarte</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="colm">Colm Tuite</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import {
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

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem disabled>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`}</CodeBlock>
        </div>
      </div>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">{`npx shadcn@latest add https://fragmentui.com/r/dropdown-menu.json`}</CodeBlock>

      <Collapsible>
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <p><strong>Intent</strong></p>
          <p>
            <code>DropdownMenu</code> is a component for displaying a menu to the user—such as a set of actions or functions—triggered by a button.<br />
            Use it when you need to provide a list of actions or options that are accessible via a button click. Dropdown menus are ideal for navigation, settings, user account actions, and any scenario where you want to organize multiple options in a compact, accessible menu.
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

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "DropdownMenu"</code>.
          </p>
          <p>Props for <code>DropdownMenu</code>:</p>
          <ul>
            <li><code>children</code> – Must include <code>DropdownMenuTrigger</code> and <code>DropdownMenuContent</code> (required)</li>
            <li><code>open?</code> – Controlled open state (optional, for controlled component)</li>
            <li><code>onOpenChange?</code> – Callback when open state changes (optional)</li>
            <li><code>modal?</code> – Whether the menu is modal (optional, default: true)</li>
          </ul>
          <p>Within <code>DropdownMenuContent</code>, you can use:</p>
          <ul>
            <li><code>DropdownMenuItem</code> – Standard menu item</li>
            <li><code>DropdownMenuLabel</code> – Section label</li>
            <li><code>DropdownMenuSeparator</code> – Visual separator</li>
            <li><code>DropdownMenuCheckboxItem</code> – Checkbox menu item</li>
            <li><code>DropdownMenuRadioGroup</code> – Radio group container</li>
            <li><code>DropdownMenuRadioItem</code> – Radio menu item</li>
            <li><code>DropdownMenuSub</code> – Submenu container</li>
            <li><code>DropdownMenuSubTrigger</code> – Submenu trigger</li>
            <li><code>DropdownMenuSubContent</code> – Submenu content</li>
          </ul>
          <p>Props for <code>DropdownMenuTrigger</code>:</p>
          <ul>
            <li><code>asChild?</code> – Render as child element instead of button (optional)</li>
          </ul>
          <p>Props for <code>DropdownMenuContent</code>:</p>
          <ul>
            <li><code>side?</code> – Side of trigger: "top" | "right" | "bottom" | "left" (optional, default: "bottom")</li>
            <li><code>align?</code> – Alignment: "start" | "center" | "end" (optional, default: "start")</li>
            <li><code>sideOffset?</code> – Distance from trigger in pixels (optional, default: 5)</li>
            <li><code>className?</code> – Additional CSS classes (optional)</li>
          </ul>
          <p>Props for <code>DropdownMenuItem</code>:</p>
          <ul>
            <li><code>inset?</code> – Add left padding for nested items (optional)</li>
            <li><code>disabled?</code> – Disable the item (optional)</li>
            <li><code>onSelect?</code> – Callback when item is selected (optional)</li>
          </ul>
          <p>Props for <code>DropdownMenuCheckboxItem</code>:</p>
          <ul>
            <li><code>checked?</code> – Checked state: boolean | "indeterminate" (optional)</li>
            <li><code>onCheckedChange?</code> – Callback when checked state changes (optional)</li>
          </ul>
          <p>Props for <code>DropdownMenuRadioGroup</code>:</p>
          <ul>
            <li><code>value?</code> – Selected value (optional)</li>
            <li><code>onValueChange?</code> – Callback when value changes (optional)</li>
          </ul>

          <p><strong>Example</strong></p>
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
      
      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/overlay-dropdown-menu--docs">Storybook</StorybookLink>
        </li>
      </ul>

    </DocumentContent>
  );
}
