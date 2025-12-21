"use client";

import { useState } from "react";
import { Switch, DocumentContent, CodeBlock, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const switchDefaultCode = `import { Switch } from "@fragment_ui/ui";

export function SwitchDefaultDemo() {
  return (
    <div className="flex items-center gap-[var(--space-2)]">
      <Switch id="switch1" defaultChecked />
      <label htmlFor="switch1">Enable notifications</label>
    </div>
  );
}`;

const switchControlledCode = `import { Switch } from "@fragment_ui/ui";
import { useState } from "react";

export function SwitchControlledDemo() {
  const [enabled, setEnabled] = useState(false);
  
  return (
    <div className="flex items-center gap-[var(--space-2)]">
      <Switch id="switch3" checked={enabled} onCheckedChange={setEnabled} />
      <label htmlFor="switch3">Controlled switch (Status: {enabled ? "ON" : "OFF"})</label>
    </div>
  );
}`;

export default function SwitchPage() {
  const [enabled, setEnabled] = useState(false);

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="switch">Switch</h1>
      </div>
      <p className="mb-6 intro-text">Toggle a setting on or off.</p>

      <ExampleSection
        id="switch-example"
        title="Example"
        code={switchDefaultCode}
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <div className="flex items-center gap-[var(--space-2)]">
            <Switch id="switch1" defaultChecked />
            <label htmlFor="switch1">Enable notifications</label>
          </div>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add switch`}
      </CodeBlock>

      <ExampleSection
        id="switch-controlled"
        title="Controlled"
        code={switchControlledCode}
        marginTop="mt-[var(--space-8)]"
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <div className="flex items-center gap-[var(--space-2)]">
            <Switch id="switch3" checked={enabled} onCheckedChange={setEnabled} />
            <label htmlFor="switch3">Controlled switch (Status: {enabled ? "ON" : "OFF"})</label>
          </div>
        </div>
      </ExampleSection>

      <h2 id="api-reference">API Reference</h2>
      <div className="mt-[var(--space-4)] border border-[color:var(--color-border-base)] rounded-[var(--radius-lg)] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Component</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Props</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Default</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>Switch</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>checked?, defaultChecked?, onCheckedChange?, disabled?, id?, className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Toggle switch component for binary on/off states</td>
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
          <h3>Intent</h3>
          <p>
            <code>Switch</code> is a component for toggling a setting on or off. Use it when you need to provide a binary toggle control, such as enabling/disabling features, turning settings on/off, or switching between two states. The component is accessible and supports both controlled and uncontrolled modes.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Feature toggles or settings</li>
            <li>Enable/disable options</li>
            <li>On/off controls</li>
            <li>Binary state switches</li>
            <li>Any scenario requiring a toggle control</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "Switch"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>checked?</code> – boolean. Controlled checked state (optional)</li>
            <li><code>defaultChecked?</code> – boolean. Default checked state (optional)</li>
            <li><code>onCheckedChange?</code> – function. Callback when checked state changes: <code>(checked: boolean) {'=>'} void</code> (optional)</li>
            <li><code>disabled?</code> – boolean. Disable the switch (optional)</li>
            <li><code>id?</code> – string. HTML id attribute (optional, required for labels)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>
          <p><strong>Note:</strong> Use <code>checked</code> and <code>onCheckedChange</code> for controlled mode, or <code>defaultChecked</code> for uncontrolled mode.</p>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "div",
  "props": { "className": "flex items-center gap-2" },
  "children": [
    {
      "type": "component",
      "component": "Switch",
      "props": {
        "id": "switch1",
        "defaultChecked": true
      }
    },
    {
      "type": "element",
      "tag": "label",
      "props": { "htmlFor": "switch1" },
      "children": "Enable notifications"
    }
  ]
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
