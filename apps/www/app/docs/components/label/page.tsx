"use client";

import { Label, Input, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";

export default function LabelPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Label</h1>
      </div>
      <p className="mb-6 intro-text">
        Renders an accessible label associated with controls.
      </p>
      
      {/* Preview */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="flex flex-col gap-6 w-full max-w-md">
            <div className="flex flex-col gap-4">
              <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Default</p>
              <div className="flex flex-col gap-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" type="text" defaultValue="Pedro Duarte" />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>With Required</p>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">
                  Email <span className="text-[color:var(--color-status-error-fg)]">*</span>
                </Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Disabled</p>
              <div className="flex flex-col gap-2">
                <Label htmlFor="disabled">Disabled field</Label>
                <Input id="disabled" type="text" defaultValue="Disabled input" disabled />
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { Label, Input } from "@fragment_ui/ui";

<div className="flex flex-col gap-2">
  <Label htmlFor="firstName">First name</Label>
  <Input id="firstName" type="text" defaultValue="Pedro Duarte" />
</div>`}</CodeBlock>
        </div>
      </div>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">{`npx shadcn@latest add https://fragmentui.com/r/label.json`}</CodeBlock>

      <Collapsible>
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <p><strong>Intent</strong></p>
          <p>
            <code>Label</code> is a component for rendering an accessible label associated with controls.<br />
            Use it when you need to provide accessible labels for form inputs, checkboxes, radio buttons, or any other form controls. Labels improve accessibility by associating text with controls, enabling screen readers to announce the purpose of each field.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Form input labels (text, email, password, etc.)</li>
            <li>Checkbox and radio button labels</li>
            <li>Select dropdown labels</li>
            <li>Textarea labels</li>
            <li>Any form control that needs an accessible label</li>
            <li>Required field indicators</li>
          </ul>

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Label"</code>.
          </p>
          <p>Props for <code>Label</code>:</p>
          <ul>
            <li><code>htmlFor?</code> – ID of the associated form control: <code>string</code> (optional, but recommended for accessibility)</li>
            <li><code>asChild?</code> – Render as child element instead of label (optional)</li>
            <li><code>className?</code> – Additional CSS classes (optional)</li>
            <li><code>children</code> – Label text (required)</li>
          </ul>
          <p><strong>Note:</strong> When using <code>htmlFor</code>, ensure the associated form control has a matching <code>id</code> attribute. Alternatively, you can wrap the control with the Label component.</p>

          <p><strong>Example</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "div",
  "props": { "className": "flex flex-col gap-2" },
  "children": [
    {
      "type": "component",
      "component": "Label",
      "props": { "htmlFor": "firstName" },
      "children": "First name"
    },
    {
      "type": "component",
      "component": "Input",
      "props": {
        "id": "firstName",
        "type": "text",
        "placeholder": "Enter your first name"
      }
    }
  ]
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
      
      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/core-label--docs">Storybook</StorybookLink>
        </li>
      </ul>

    </DocumentContent>
  );
}

