"use client";

import * as React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogHeader, DialogFooter, DocumentContent, Input, Label, Collapsible, CollapsibleTrigger, CollapsibleContent, CodeBlock, Badge, Button } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const dialogCode = `import {
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

export function DialogDemo() {
  return (
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
        <div className="grid gap-[var(--space-4)] py-[var(--space-4)]">
          <div className="grid gap-[var(--space-2)]">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="John Doe" defaultValue="John Doe" />
          </div>
          <div className="grid gap-[var(--space-2)]">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john@example.com" defaultValue="john@example.com" />
          </div>
          <div className="grid gap-[var(--space-2)]">
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
  );
}`;

const dialogSimpleCode = `import {
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

export function DialogSimpleDemo() {
  return (
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
  );
}`;

export default function DialogPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-[var(--space-4)] mb-[var(--space-1)]">
        <h1 id="dialog">Dialog</h1>
      </div>
      <p className="mb-[var(--space-6)] intro-text">Show modal content that requires user focus.</p>
      
      <ExampleSection
        id="dialog-example"
        title="Dialog Example"
        code={dialogCode}
      >
        <div className="flex justify-center items-center w-full">
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
              <div className="grid gap-[var(--space-4)] py-[var(--space-4)]">
                <div className="grid gap-[var(--space-2)]">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="John Doe" defaultValue="John Doe" />
                </div>
                <div className="grid gap-[var(--space-2)]">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" defaultValue="john@example.com" />
                </div>
                <div className="grid gap-[var(--space-2)]">
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
      </ExampleSection>

      <ExampleSection
        id="dialog-simple"
        title="Simple Dialog"
        code={dialogSimpleCode}
        marginTop="mt-[var(--space-8)]"
      >
        <div className="flex justify-center items-center w-full">
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
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add dialog`}
      </CodeBlock>

      {/* API Reference */}
      <h2 id="api" className="mt-[var(--space-8)]">API Reference</h2>
      <div className="mt-[var(--space-4)] border border-[color:var(--color-border-base)] rounded-[var(--radius-lg)] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Component</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Prop</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Type</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Default</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>Dialog</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>open?, onOpenChange?, modal?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean, function, boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Root component. Must contain <code>DialogTrigger</code> and <code>DialogContent</code></td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>DialogTrigger</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>asChild?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>false</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Trigger element that opens the dialog</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>DialogContent</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>variant?, className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>"default" | "fullscreen", string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>"default"</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Container for dialog content</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>DialogHeader</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Container for title and description</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>DialogTitle</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Dialog title (required for accessibility)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>DialogDescription</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Dialog description text</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>DialogFooter</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Container for action buttons</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>DialogClose</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>asChild?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>false</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Button that closes the dialog</td>
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
            <code>Dialog</code> is a component for displaying a modal window for focused tasks. Use it when you need to show important information, collect user input, or require user confirmation before proceeding with an action. Dialogs interrupt the user's workflow to focus attention on a specific task or decision.
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

          <p><strong>UI-DSL Usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Dialog"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>children</code> – Must include <code>DialogTrigger</code> and <code>DialogContent</code> (required)</li>
            <li><code>open?</code> – Controlled open state for programmatic control (optional)</li>
            <li><code>onOpenChange?</code> – Callback function that receives the open state when it changes (optional)</li>
            <li><code>modal?</code> – Whether the dialog is modal (blocks interaction with other elements) (optional, default: <code>true</code>)</li>
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
            <li><code>variant?</code> – Dialog variant: <code>"default"</code> for standard dialog or <code>"fullscreen"</code> for full-screen modal (optional, default: <code>"default"</code>)</li>
            <li><code>className?</code> – Additional CSS classes to apply to the dialog content</li>
          </ul>
          <p>Props for <code>DialogTrigger</code>:</p>
          <ul>
            <li><code>asChild?</code> – Render as child element instead of default button (optional)</li>
          </ul>

          <h3>Simple Dialog</h3>
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
    </DocumentContent>
  );
}
