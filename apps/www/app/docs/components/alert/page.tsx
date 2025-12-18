"use client";

import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent, CodeBlock, Button, Badge } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const alertCode = `import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";

export function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Open Alert</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete
            your account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}`;

export default function AlertPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="alert">Alert Dialog</h1>
      </div>
      <p className="mb-6 intro-text">Show important messages that need attention.</p>
      
      <ExampleSection
        id="alert-example"
        title="Alert Dialog Example"
        code={alertCode}
      >
        <div className="flex justify-center items-center w-full">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>Open Alert</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add alert`}
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
              <td className="py-2 px-4"><code>AlertDialog</code></td>
              <td className="py-2 px-4"><code>open</code></td>
              <td className="py-2 px-4"><code>boolean</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Controlled open state</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>AlertDialog</code></td>
              <td className="py-2 px-4"><code>defaultOpen</code></td>
              <td className="py-2 px-4"><code>boolean</code></td>
              <td className="py-2 px-4"><code>false</code></td>
              <td className="py-2 px-4 text-sm">Default open state</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>AlertDialog</code></td>
              <td className="py-2 px-4"><code>onOpenChange</code></td>
              <td className="py-2 px-4"><code>(open: boolean) =&gt; void</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Callback when open state changes</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>AlertDialogTrigger</code></td>
              <td className="py-2 px-4"><code>asChild</code></td>
              <td className="py-2 px-4"><code>boolean</code></td>
              <td className="py-2 px-4"><code>false</code></td>
              <td className="py-2 px-4 text-sm">Merge props with child element</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>AlertDialogContent</code></td>
              <td className="py-2 px-4"><code>className</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Additional CSS classes</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>AlertDialogHeader</code></td>
              <td className="py-2 px-4"><code>className</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Additional CSS classes</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>AlertDialogTitle</code></td>
              <td className="py-2 px-4"><code>children</code></td>
              <td className="py-2 px-4"><code>React.ReactNode</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Dialog title (required)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>AlertDialogDescription</code></td>
              <td className="py-2 px-4"><code>children</code></td>
              <td className="py-2 px-4"><code>React.ReactNode</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Dialog description text</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>AlertDialogFooter</code></td>
              <td className="py-2 px-4"><code>className</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Additional CSS classes</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>AlertDialogAction</code></td>
              <td className="py-2 px-4"><code>children</code></td>
              <td className="py-2 px-4"><code>React.ReactNode</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Action button content (required)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>AlertDialogAction</code></td>
              <td className="py-2 px-4"><code>onClick</code></td>
              <td className="py-2 px-4"><code>(event: MouseEvent) =&gt; void</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Click handler</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>AlertDialogCancel</code></td>
              <td className="py-2 px-4"><code>children</code></td>
              <td className="py-2 px-4"><code>React.ReactNode</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Cancel button content (required)</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>AlertDialogCancel</code></td>
              <td className="py-2 px-4"><code>onClick</code></td>
              <td className="py-2 px-4"><code>(event: MouseEvent) =&gt; void</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Click handler</td>
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
            <code>AlertDialog</code> is a modal dialog component for displaying critical confirmations and important messages.<br />
            Use it when you need to interrupt the user flow to confirm destructive actions, warn about consequences, or display critical information that requires user acknowledgment.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Confirmation dialogs for destructive actions (delete, remove, etc.)</li>
            <li>Critical warnings and error messages</li>
            <li>Important notifications requiring user acknowledgment</li>
            <li>Decision points that block further interaction</li>
          </ul>

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "AlertDialog"</code>. The dialog requires a trigger element and contains structured content.
          </p>
          <p>Structure:</p>
          <ul>
            <li><code>AlertDialogTrigger</code> – element that opens the dialog (usually a Button)</li>
            <li><code>AlertDialogContent</code> – the modal container</li>
            <li><code>AlertDialogHeader</code> – contains title and description</li>
            <li><code>AlertDialogTitle</code> – dialog heading (required)</li>
            <li><code>AlertDialogDescription</code> – explanatory text (optional)</li>
            <li><code>AlertDialogFooter</code> – action buttons container</li>
            <li><code>AlertDialogAction</code> – primary action button</li>
            <li><code>AlertDialogCancel</code> – cancel/dismiss button</li>
          </ul>

          <p><strong>Example</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "AlertDialog",
  "children": [
    {
      "type": "component",
      "component": "AlertDialogTrigger",
      "props": {
        "asChild": true
      },
      "children": [
        {
          "type": "component",
          "component": "Button",
          "children": "Delete Account"
        }
      ]
    },
    {
      "type": "component",
      "component": "AlertDialogContent",
      "children": [
        {
          "type": "component",
          "component": "AlertDialogHeader",
          "children": [
            {
              "type": "component",
              "component": "AlertDialogTitle",
              "children": "Are you sure?"
            },
            {
              "type": "component",
              "component": "AlertDialogDescription",
              "children": "This action cannot be undone. This will permanently delete your account."
            }
          ]
        },
        {
          "type": "component",
          "component": "AlertDialogFooter",
          "children": [
            {
              "type": "component",
              "component": "AlertDialogCancel",
              "children": "Cancel"
            },
            {
              "type": "component",
              "component": "AlertDialogAction",
              "children": "Delete"
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
