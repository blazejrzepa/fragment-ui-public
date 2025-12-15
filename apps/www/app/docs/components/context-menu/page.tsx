"use client";

import { useState } from "react";
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuShortcut, ContextMenuCheckboxItem, ContextMenuRadioItem, ContextMenuRadioGroup, ContextMenuSub, ContextMenuSubTrigger, ContextMenuSubContent, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";

export default function ContextMenuPage() {
  const [bookmarksChecked, setBookmarksChecked] = useState(true);
  const [urlsChecked, setUrlsChecked] = useState(false);
  const [person, setPerson] = useState("pedro");

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Context Menu</h1>
      </div>
      <p className="mb-6 intro-text">
        Displays a menu located at the pointer, triggered by a right click or a long press.
      </p>
      
      {/* Default */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
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

            <div className="flex flex-col gap-4">
              <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>With Checkbox Items</p>
              <ContextMenu>
                <ContextMenuTrigger className="flex h-[150px] w-full items-center justify-center rounded-md border border-dashed border-[color:var(--color-border-base)] text-sm">
                  Right click here
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>Back</ContextMenuItem>
                  <ContextMenuItem>Forward</ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuCheckboxItem
                    checked={bookmarksChecked}
                    onCheckedChange={setBookmarksChecked}
                  >
                    Show Bookmarks
                    <ContextMenuShortcut>⌘B</ContextMenuShortcut>
                  </ContextMenuCheckboxItem>
                  <ContextMenuCheckboxItem
                    checked={urlsChecked}
                    onCheckedChange={setUrlsChecked}
                  >
                    Show Full URLs
                  </ContextMenuCheckboxItem>
                </ContextMenuContent>
              </ContextMenu>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>With Radio Items</p>
              <ContextMenu>
                <ContextMenuTrigger className="flex h-[150px] w-full items-center justify-center rounded-md border border-dashed border-[color:var(--color-border-base)] text-sm">
                  Right click here
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuLabel>People</ContextMenuLabel>
                  <ContextMenuRadioGroup value={person} onValueChange={setPerson}>
                    <ContextMenuRadioItem value="pedro">
                      Pedro Duarte
                    </ContextMenuRadioItem>
                    <ContextMenuRadioItem value="colm">
                      Colm Tuite
                    </ContextMenuRadioItem>
                  </ContextMenuRadioGroup>
                </ContextMenuContent>
              </ContextMenu>
            </div>
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import {
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

<ContextMenu>
  <ContextMenuTrigger asChild>
    <div>Right click here</div>
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
</ContextMenu>`}</CodeBlock>
        </div>
      </div>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">{`npx shadcn@latest add https://fragmentui.com/r/context-menu.json`}</CodeBlock>

      <Collapsible>
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <p><strong>Intent</strong></p>
          <p>
            <code>ContextMenu</code> is a component for displaying a menu located at the pointer, triggered by a right click or a long press.<br />
            Use it when you need to provide contextual actions for specific UI elements, such as table row actions, file operations, or advanced interactions that appear on right-click. The menu appears at the cursor position and provides quick access to relevant actions without cluttering the main interface.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Table row actions and bulk operations</li>
            <li>File and folder operations in file managers</li>
            <li>Text selection actions (copy, paste, format)</li>
            <li>Image or media item actions</li>
            <li>Any scenario where contextual actions should appear on right-click</li>
          </ul>

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "ContextMenu"</code>.
          </p>
          <p>Props for <code>ContextMenu</code>:</p>
          <ul>
            <li><code>children</code> – Must include <code>ContextMenuTrigger</code> and <code>ContextMenuContent</code> (required)</li>
            <li><code>modal?</code> – Whether the menu is modal (optional, default: true)</li>
            <li><code>onOpenChange?</code> – Callback when open state changes (optional)</li>
          </ul>
          <p>Within <code>ContextMenuContent</code>, you can use:</p>
          <ul>
            <li><code>ContextMenuItem</code> – Standard menu item with optional <code>disabled</code> prop</li>
            <li><code>ContextMenuCheckboxItem</code> – Checkbox item with <code>checked</code> and <code>onCheckedChange</code> props</li>
            <li><code>ContextMenuRadioItem</code> – Radio item (use within <code>ContextMenuRadioGroup</code> with <code>value</code> prop)</li>
            <li><code>ContextMenuLabel</code> – Section label for grouping items</li>
            <li><code>ContextMenuSeparator</code> – Visual separator between menu sections</li>
            <li><code>ContextMenuShortcut</code> – Keyboard shortcut display (e.g., "⌘P")</li>
            <li><code>ContextMenuSub</code> – Submenu container with <code>ContextMenuSubTrigger</code> and <code>ContextMenuSubContent</code> for nested menus</li>
          </ul>
          <p>Props for <code>ContextMenuItem</code>:</p>
          <ul>
            <li><code>disabled?</code> – Disable the menu item (optional)</li>
            <li><code>inset?</code> – Add left padding for nested items (optional)</li>
          </ul>
          <p>Props for <code>ContextMenuCheckboxItem</code>:</p>
          <ul>
            <li><code>checked</code> – Whether the checkbox is checked (required)</li>
            <li><code>onCheckedChange</code> – Callback when checked state changes (required)</li>
            <li><code>disabled?</code> – Disable the checkbox item (optional)</li>
          </ul>
          <p>Props for <code>ContextMenuRadioGroup</code>:</p>
          <ul>
            <li><code>value</code> – Selected radio value (required)</li>
            <li><code>onValueChange</code> – Callback when value changes (required)</li>
          </ul>
          <p>Props for <code>ContextMenuRadioItem</code>:</p>
          <ul>
            <li><code>value</code> – Radio item value (required)</li>
            <li><code>disabled?</code> – Disable the radio item (optional)</li>
          </ul>

          <p><strong>Example</strong></p>
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

      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/core-contextmenu--docs">Storybook</StorybookLink>
        </li>
      </ul>


    </DocumentContent>
  );
}


