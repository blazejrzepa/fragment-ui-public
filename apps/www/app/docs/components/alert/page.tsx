"use client";

import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";

export default function AlertPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="alert" className="text-3xl font-medium mb-4">Alert Dialog</h1>
      </div>
      <p className="mb-6 intro-text">
        Highlight important messages or warnings.
      </p>
      
      
      {/* Default Alert */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
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
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import {
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
</AlertDialog>`}</CodeBlock>
        </div>
      </div>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">{`npx shadcn@latest add https://fragmentui.com/r/alert.json`}</CodeBlock>

      <Collapsible>
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation">
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

      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/core-alert-dialog--docs">Storybook</StorybookLink>
        </li>
      </ul>


    </DocumentContent>
  );
}


