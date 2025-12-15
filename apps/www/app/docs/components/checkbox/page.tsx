"use client";

import { Checkbox, Label, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";

export default function CheckboxPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="checkbox" className="text-3xl font-medium mb-4">Checkbox</h1>
      </div>
      <p className="mb-6 intro-text">
        A control that allows the user to toggle between checked and not checked.
      </p>
      
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Accept terms and conditions</Label>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox id="terms-2" defaultChecked />
              <div className="grid gap-2">
                <Label htmlFor="terms-2">Accept terms and conditions</Label>
                <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>
                  By clicking this checkbox, you agree to the terms and conditions.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox id="toggle" disabled />
              <Label htmlFor="toggle">Enable notifications</Label>
            </div>
            <Label className="hover:bg-[color:var(--color-surface-2)]/50 flex items-start gap-3 rounded-lg border border-[color:var(--color-border-base)] p-3 cursor-pointer">
              <Checkbox id="toggle-2" defaultChecked />
              <div className="grid gap-1.5 font-normal">
                <Label htmlFor="toggle-2" className="text-sm font-medium leading-none">
                  Enable notifications
                </Label>
                <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>
                  You can enable or disable notifications at any time.
                </p>
              </div>
            </Label>
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`"use client"

import { Checkbox } from "@fragment_ui/ui"
import { Label } from "@fragment_ui/ui"

export function CheckboxDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id="terms-2" defaultChecked />
        <div className="grid gap-2">
          <Label htmlFor="terms-2">Accept terms and conditions</Label>
          <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>
            By clicking this checkbox, you agree to the terms and conditions.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id="toggle" disabled />
        <Label htmlFor="toggle">Enable notifications</Label>
      </div>
      <Label className="hover:bg-[color:var(--color-surface-2)]/50 flex items-start gap-3 rounded-lg border border-[color:var(--color-border-base)] p-3 cursor-pointer">
        <Checkbox id="toggle-2" defaultChecked />
        <div className="grid gap-1.5 font-normal">
          <p className="text-sm leading-none font-medium">
            Enable notifications
          </p>
          <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>
            You can enable or disable notifications at any time.
          </p>
        </div>
      </Label>
    </div>
  )
}`}</CodeBlock>
        </div>
      </div>
      
      
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">{`npx shadcn@latest add https://fragmentui.com/r/checkbox.json`}</CodeBlock>

      <Collapsible>
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <p><strong>Intent</strong></p>
          <p>
            <code>Checkbox</code> is a form control component for toggling a boolean option on or off.<br />
            Use it when you need to allow users to select one or more options from a list, accept terms and conditions, enable/disable features, or toggle settings.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Accepting terms and conditions</li>
            <li>Enabling or disabling features or settings</li>
            <li>Selecting multiple items from a list</li>
            <li>Filtering or sorting options</li>
            <li>Any boolean toggle that requires explicit user confirmation</li>
          </ul>

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Checkbox"</code>. Checkbox accepts standard HTML checkbox props:
          </p>
          <ul>
            <li><code>checked?</code> – Controlled checked state (optional)</li>
            <li><code>onCheckedChange?</code> – Callback when checked state changes (optional)</li>
            <li><code>disabled?</code> – Disable the checkbox (optional)</li>
            <li><code>id?</code> – HTML id attribute (optional, recommended for accessibility)</li>
            <li><code>className?</code> – Additional CSS classes (optional)</li>
          </ul>

          <p><strong>Example</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Checkbox",
  "props": {
    "id": "terms",
    "checked": false
  }
}`}</CodeBlock>
          <p className="mt-6"><strong>With Label:</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "div",
  "props": {
    "className": "flex items-center gap-3"
  },
  "children": [
    {
      "type": "component",
      "component": "Checkbox",
      "props": {
        "id": "terms"
      }
    },
    {
      "type": "component",
      "component": "Label",
      "props": {
        "htmlFor": "terms"
      },
      "children": "Accept terms and conditions"
    }
  ]
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
      
      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/core-checkbox--docs">Storybook</StorybookLink>
        </li>
      </ul>


    </DocumentContent>
  );
}
