"use client";

import { Checkbox, Label, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent, CodeBlock, Badge } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const basicCode = `import { Checkbox } from "@fragment_ui/ui";
import { Label } from "@fragment_ui/ui";

export function CheckboxBasicDemo() {
  return (
    <div className="flex items-center gap-[var(--space-3)]">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  );
}`;

const withDescriptionCode = `import { Checkbox } from "@fragment_ui/ui";
import { Label } from "@fragment_ui/ui";

export function CheckboxWithDescriptionDemo() {
  return (
    <div className="flex items-start gap-[var(--space-3)]">
      <Checkbox id="terms-2" defaultChecked />
      <div className="grid gap-[var(--space-2)]">
        <Label htmlFor="terms-2">Accept terms and conditions</Label>
        <p className="text-sm text-[color:var(--color-fg-muted)]">
          By clicking this checkbox, you agree to the terms and conditions.
        </p>
      </div>
    </div>
  );
}`;

const disabledCode = `import { Checkbox } from "@fragment_ui/ui";
import { Label } from "@fragment_ui/ui";

export function CheckboxDisabledDemo() {
  return (
    <div className="flex items-start gap-[var(--space-3)]">
      <Checkbox id="toggle" disabled />
      <Label htmlFor="toggle">Enable notifications</Label>
    </div>
  );
}`;

const cardCode = `import { Checkbox } from "@fragment_ui/ui";
import { Label } from "@fragment_ui/ui";

export function CheckboxCardDemo() {
  return (
    <Label className="hover:bg-[color:var(--color-surface-2)]/50 flex items-start gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[color:var(--color-border-base)] p-[var(--space-3)] cursor-pointer">
      <Checkbox id="toggle-2" defaultChecked />
      <div className="grid gap-[var(--space-2)] font-normal">
        <Label htmlFor="toggle-2" className="text-sm font-medium leading-none">
          Enable notifications
        </Label>
        <p className="text-sm text-[color:var(--color-fg-muted)] pb-0 mb-0">
          You can enable or disable notifications at any time.
        </p>
      </div>
    </Label>
  );
}`;

export default function CheckboxPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-[var(--space-4)] mb-[var(--space-1)]">
        <h1 id="checkbox" className="text-[length:var(--typography-display-md-size)] font-medium">Checkbox</h1>
      </div>
      <p className="mb-[var(--space-6)] intro-text">Select one or many independent options.</p>
      
      {/* Basic */}
      <ExampleSection
        id="checkbox-basic"
        title="Example"
        code={basicCode}
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <div className="flex items-center gap-[var(--space-3)]">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Accept terms and conditions</Label>
          </div>
        </div>
      </ExampleSection>

      {/* With Description */}
      <ExampleSection
        id="checkbox-with-description"
        title="With Description"
        code={withDescriptionCode}
        marginTop="mt-[var(--space-8)]"
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <div className="flex items-start gap-[var(--space-3)]">
            <Checkbox id="terms-2" defaultChecked />
            <div className="grid gap-[var(--space-2)]">
              <Label htmlFor="terms-2">Accept terms and conditions</Label>
              <p className="text-sm !text-[color:var(--color-fg-muted)] !pb-0 !mb-0" style={{ paddingBottom: 0, marginBottom: 0, color: 'var(--color-fg-muted)' }}>
                By clicking this checkbox, you agree to the terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </ExampleSection>

      {/* Disabled */}
      <ExampleSection
        id="checkbox-disabled"
        title="Disabled"
        code={disabledCode}
        marginTop="mt-[var(--space-8)]"
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <div className="flex items-start gap-[var(--space-3)]">
            <Checkbox id="toggle" disabled />
            <Label htmlFor="toggle">Enable notifications</Label>
          </div>
        </div>
      </ExampleSection>

      {/* Card */}
      <ExampleSection
        id="checkbox-card"
        title="Card"
        code={cardCode}
        marginTop="mt-[var(--space-8)]"
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <Label className="hover:bg-[color:var(--color-surface-2)]/50 flex items-start gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[color:var(--color-border-base)] p-[var(--space-3)] cursor-pointer">
            <Checkbox id="toggle-2" defaultChecked />
            <div className="grid gap-[var(--space-2)] font-normal">
              <Label htmlFor="toggle-2" className="text-sm font-medium leading-none">
                Enable notifications
              </Label>
              <p className="text-sm !text-[color:var(--color-fg-muted)] !pb-0 !mb-0" style={{ paddingBottom: 0, marginBottom: 0, color: 'var(--color-fg-muted)' }}>
                You can enable or disable notifications at any time.
              </p>
            </div>
          </Label>
        </div>
      </ExampleSection>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add checkbox`}
      </CodeBlock>

      {/* API Reference */}
      <h2 id="api" className="mt-[var(--space-8)]">API Reference</h2>
      <div className="mt-[var(--space-4)] border border-[color:var(--color-border-base)] rounded-[var(--radius-lg)] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Prop</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Type</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Default</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>id</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Unique identifier for the checkbox (required for accessibility)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>checked</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Controlled checked state</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>defaultChecked</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>false</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Initial checked state</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>onCheckedChange</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>(checked: boolean) =&gt; void</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Callback when checked state changes</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>disabled</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>false</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Disable the checkbox</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>required</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>false</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Mark as required</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Additional CSS classes</td>
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
            <code>Checkbox</code> is a control component that allows users to toggle between checked and unchecked states. Use it when you need to provide binary choices, multiple selections, or agreement confirmations in forms, settings, or lists.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Form fields requiring binary yes/no selection</li>
            <li>Multiple selection lists</li>
            <li>Terms and conditions acceptance</li>
            <li>Settings toggles and preferences</li>
            <li>Filter and search options</li>
          </ul>

          <p><strong>UI-DSL Usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Checkbox"</code>.
          </p>
          
          <p><strong>Props</strong></p>
          <ul>
            <li><code>id</code> – string. Unique identifier for the checkbox (required for accessibility)</li>
            <li><code>checked?</code> – boolean. Controlled checked state</li>
            <li><code>defaultChecked?</code> – boolean (default: <code>false</code>). Initial checked state</li>
            <li><code>onCheckedChange?</code> – function. Callback when checked state changes: <code>(checked: boolean) =&gt; void</code></li>
            <li><code>disabled?</code> – boolean (default: <code>false</code>). Disable the checkbox</li>
            <li><code>required?</code> – boolean (default: <code>false</code>). Mark as required</li>
            <li><code>className?</code> – string. Additional CSS classes</li>
          </ul>
          <p>Always pair with a <code>Label</code> component using the <code>htmlFor</code> prop matching the checkbox <code>id</code> for proper accessibility.</p>

          <h3 className="mt-[var(--space-6)] mb-[var(--space-4)]">Basic Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Checkbox",
  "props": {
    "id": "terms",
    "defaultChecked": false
  }
}`}</CodeBlock>

          <h3 className="mt-[var(--space-6)] mb-[var(--space-4)]">With Label</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`[
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
]`}</CodeBlock>

          <h3 className="mt-[var(--space-6)] mb-[var(--space-4)]">Disabled State</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Checkbox",
  "props": {
    "id": "notifications",
    "disabled": true
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
