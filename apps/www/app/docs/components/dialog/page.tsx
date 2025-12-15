"use client";

import * as React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogHeader, DialogFooter, DocumentContent, Input, Label, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";

export default function DialogPage() {
  const [outerOpen, setOuterOpen] = React.useState(false);
  const [innerOpen, setInnerOpen] = React.useState(false);
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Dialog</h1>
      </div>
      <p className="mb-6 intro-text">
        Show a modal window for focused tasks.
      </p>
      
      {/* Default Dialog */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="John Doe" defaultValue="John Doe" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" defaultValue="john@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="@johndoe" defaultValue="@johndoe" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogFooter,
} from "@fragment_ui/ui";
import { Button, Input, Label } from "@fragment_ui/ui";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here. Click save when you're done.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="John Doe" defaultValue="John Doe" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="john@example.com" defaultValue="john@example.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" placeholder="@johndoe" defaultValue="@johndoe" />
      </div>
    </div>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button>Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}</CodeBlock>
        </div>
      </div>

      {/* Simple Dialog */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Simple Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button>Continue</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogFooter,
} from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Simple Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your account and remove your data from our servers.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button>Continue</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}</CodeBlock>
        </div>
      </div>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">{`npx shadcn@latest add https://fragmentui.com/r/dialog.json`}</CodeBlock>

      <Collapsible>
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <p><strong>Intent</strong></p>
          <p>
            <code>Dialog</code> is a component for displaying a modal window for focused tasks.<br />
            Use it when you need to show important information, collect user input, or require user confirmation before proceeding with an action. Dialogs interrupt the user's workflow to focus attention on a specific task or decision.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Confirmation dialogs for destructive actions (delete, remove, etc.)</li>
            <li>Form submissions and data entry</li>
            <li>Important notifications or alerts</li>
            <li>User authentication (login, signup)</li>
            <li>Settings or configuration panels</li>
            <li>Any task that requires focused user attention</li>
          </ul>

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Dialog"</code>.
          </p>
          <p>Props for <code>Dialog</code>:</p>
          <ul>
            <li><code>children</code> – Must include <code>DialogTrigger</code> and <code>DialogContent</code> (required)</li>
            <li><code>open?</code> – Controlled open state (optional, for controlled component)</li>
            <li><code>onOpenChange?</code> – Callback when open state changes (optional)</li>
            <li><code>modal?</code> – Whether the dialog is modal (optional, default: true)</li>
          </ul>
          <p>Within <code>DialogContent</code>, you can use:</p>
          <ul>
            <li><code>DialogHeader</code> – Container for title and description</li>
            <li><code>DialogTitle</code> – Dialog title (required for accessibility)</li>
            <li><code>DialogDescription</code> – Dialog description text</li>
            <li><code>DialogFooter</code> – Container for action buttons</li>
            <li><code>DialogClose</code> – Button that closes the dialog</li>
          </ul>
          <p>Props for <code>DialogContent</code>:</p>
          <ul>
            <li><code>variant?</code> – Dialog variant: "default" or "fullscreen" (optional, default: "default")</li>
            <li><code>className?</code> – Additional CSS classes (optional)</li>
          </ul>
          <p>Props for <code>DialogTrigger</code>:</p>
          <ul>
            <li><code>asChild?</code> – Render as child element instead of button (optional)</li>
          </ul>

          <p><strong>Example</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Dialog",
  "children": [
    {
      "type": "component",
      "component": "DialogTrigger",
      "props": { "asChild": true },
      "children": {
        "type": "component",
        "component": "Button",
        "children": "Open Dialog"
      }
    },
    {
      "type": "component",
      "component": "DialogContent",
      "children": [
        {
          "type": "component",
          "component": "DialogHeader",
          "children": [
            {
              "type": "component",
              "component": "DialogTitle",
              "children": "Are you sure?"
            },
            {
              "type": "component",
              "component": "DialogDescription",
              "children": "This action cannot be undone."
            }
          ]
        },
        {
          "type": "component",
          "component": "DialogFooter",
          "children": [
            {
              "type": "component",
              "component": "DialogClose",
              "props": { "asChild": true },
              "children": {
                "type": "component",
                "component": "Button",
                "props": { "variant": "outline" },
                "children": "Cancel"
              }
            },
            {
              "type": "component",
              "component": "Button",
              "children": "Continue"
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
          <StorybookLink path="/docs/core-dialog--docs">Storybook</StorybookLink>
        </li>
      </ul>


    </DocumentContent>
  );
}

