"use client";

import { Label, Input, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent, CodeBlock } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";

const labelCode = `import { Label, Input } from "@fragment_ui/ui";

export function LabelDemo() {
  return (
    <div className="flex flex-col gap-[var(--space-6)] w-full">
      <div className="flex flex-col gap-[var(--space-4)]">
        <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Default</p>
        <div className="flex flex-col gap-[var(--space-2)]">
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" type="text" defaultValue="Pedro Duarte" />
        </div>
      </div>

      <div className="flex flex-col gap-[var(--space-4)]">
        <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>With Required</p>
        <div className="flex flex-col gap-[var(--space-2)]">
          <Label htmlFor="email">
            Email <span className="text-[color:var(--color-status-error-fg)]">*</span>
          </Label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>
      </div>

      <div className="flex flex-col gap-[var(--space-4)]">
        <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Disabled</p>
        <div className="flex flex-col gap-[var(--space-2)]">
          <Label htmlFor="disabled">Disabled field</Label>
          <Input id="disabled" type="text" defaultValue="Disabled input" disabled />
        </div>
      </div>
    </div>
  );
}`;

export default function LabelPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-[var(--space-4)] mb-[var(--space-1)]">
        <h1 id="label" className="text-[length:var(--typography-display-md-size)] font-medium">Label</h1>
      </div>
      <p className="mb-[var(--space-6)] intro-text">Describe or name a form field.</p>
      
      <ExampleSection
        id="label-example"
        title="Example"
        code={labelCode}
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <div className="flex flex-col gap-[var(--space-6)] w-full max-w-md">
            <div className="flex flex-col gap-[var(--space-4)]">
              <p className="text-[length:var(--typography-size-sm)] text-[color:var(--color-fg-muted)]">Default</p>
              <div className="flex flex-col gap-[var(--space-2)]">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" type="text" defaultValue="Pedro Duarte" />
              </div>
            </div>

            <div className="flex flex-col gap-[var(--space-4)]">
              <p className="text-[length:var(--typography-size-sm)]" style={{ color: "var(--color-fg-muted)" }}>With Required</p>
              <div className="flex flex-col gap-[var(--space-2)]">
                <Label htmlFor="email">
                  Email <span className="text-[color:var(--color-status-error-fg)]">*</span>
                </Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
            </div>

            <div className="flex flex-col gap-[var(--space-4)]">
              <p className="text-[length:var(--typography-size-sm)]" style={{ color: "var(--color-fg-muted)" }}>Disabled</p>
              <div className="flex flex-col gap-[var(--space-2)]">
                <Label htmlFor="disabled">Disabled field</Label>
                <Input id="disabled" type="text" defaultValue="Disabled input" disabled />
              </div>
            </div>
          </div>
        </div>
      </ExampleSection>

      <h2 id="api-reference">API Reference</h2>
      <div className="mt-[var(--space-4)] border border-[color:var(--color-border-base)] rounded-[var(--radius-lg)] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)] font-semibold">Component</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)] font-semibold">Props</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)] font-semibold">Default</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)] font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>Label</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>htmlFor?, asChild?, className?, children</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Accessible label component for form controls</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add label`}
      </CodeBlock>

      <Collapsible className="mt-[var(--space-8)]">
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation" className="m-0">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-[var(--space-4)]">
          <h3>Intent</h3>
          <p>
            <code>Label</code> is a component for rendering an accessible label associated with controls. Use it when you need to provide accessible labels for form inputs, checkboxes, radio buttons, or any other form controls. Labels improve accessibility by associating text with controls, enabling screen readers to announce the purpose of each field.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Form input labels (text, email, password, etc.)</li>
            <li>Checkbox and radio button labels</li>
            <li>Select dropdown labels</li>
            <li>Textarea labels</li>
            <li>Any form control that needs an accessible label</li>
            <li>Required field indicators</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "Label"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>htmlFor?</code> – string. ID of the associated form control (optional, but recommended for accessibility)</li>
            <li><code>asChild?</code> – boolean. Render as child element instead of label (optional)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
            <li><code>children</code> – ReactNode. Label text (required)</li>
          </ul>
          <p><strong>Note:</strong> When using <code>htmlFor</code>, ensure the associated form control has a matching <code>id</code> attribute. Alternatively, you can wrap the control with the Label component.</p>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "div",
  "props": { "className": "flex flex-col gap-[var(--space-2)]" },
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
    </DocumentContent>
  );
}
