"use client";

import { SplitButton, DocumentContent, CodeBlock, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { Download, Save, Share2 } from "lucide-react";
import { ExampleSection } from "../../../../src/components/example-section";

const splitButtonCode = `import { SplitButton } from "@fragment_ui/ui";

export function SplitButtonDemo() {
  return (
    <SplitButton
      primaryAction={{ label: "Save", onClick: () => console.log("Save clicked") }}
      options={[
        { label: "Save As", onClick: () => console.log("Save As clicked") },
        { label: "Save All", onClick: () => console.log("Save All clicked") },
      ]}
    />
  );
}`;

const splitButtonIconsCode = `import { SplitButton } from "@fragment_ui/ui";
import { Download, Save, Share2 } from "lucide-react";

export function SplitButtonIconsDemo() {
  return (
    <SplitButton
      primaryAction={{ label: "Download", icon: <Download className="h-4 w-4" />, onClick: () => console.log("Download clicked") }}
      options={[
        { label: "Save", icon: <Save className="h-4 w-4" />, onClick: () => console.log("Save clicked") },
        { label: "Share", icon: <Share2 className="h-4 w-4" />, onClick: () => console.log("Share clicked") },
      ]}
    />
  );
}`;

export default function SplitButtonPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="split-button">Split Button</h1>
      </div>
      <p className="mb-6 intro-text">Primary action with a secondary menu.</p>

      <ExampleSection
        id="split-button-example"
        title="Example"
        code={splitButtonCode}
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <SplitButton
            primaryAction={{
              label: "Save",
              onClick: () => console.log("Save clicked"),
            }}
            options={[
              { label: "Save As", onClick: () => console.log("Save As clicked") },
              { label: "Save All", onClick: () => console.log("Save All clicked") },
            ]}
          />
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add split-button`}
      </CodeBlock>

      <ExampleSection
        id="split-button-icons"
        title="With Icons"
        code={splitButtonIconsCode}
        marginTop="mt-8"
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <SplitButton
            primaryAction={{
              label: "Download",
              icon: <Download className="h-4 w-4" />,
              onClick: () => console.log("Download clicked"),
            }}
            options={[
              { label: "Save", icon: <Save className="h-4 w-4" />, onClick: () => console.log("Save clicked") },
              { label: "Share", icon: <Share2 className="h-4 w-4" />, onClick: () => console.log("Share clicked") },
            ]}
          />
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
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>SplitButton</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>primaryAction, options, variant?, size?, disabled?, align?, side?, className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Button with primary action and dropdown menu for alternatives</td>
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
            <code>SplitButton</code> is a component for displaying a main action button plus a dropdown of alternative actions. Use it when you need to provide a primary action with secondary actions accessible via a dropdown. The component supports icons, different variants, and is fully accessible.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Save actions with multiple save options</li>
            <li>Download buttons with different formats</li>
            <li>Export buttons with multiple export types</li>
            <li>Any scenario requiring a primary action with alternatives</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "SplitButton"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>primaryAction</code> – object. Primary action configuration with <code>label</code> (string), <code>onClick</code> (function), and optional <code>icon</code> (ReactNode) (required)</li>
            <li><code>options</code> – SplitButtonOption[]. Array of dropdown menu options, each with <code>label</code> (string), <code>onClick</code> (function), and optional <code>icon</code> (ReactNode) and <code>disabled</code> (boolean) (required)</li>
            <li><code>variant?</code> – "solid" | "outline" | "ghost" (default: "solid"). Button variant (optional)</li>
            <li><code>size?</code> – "sm" | "md" | "lg" (default: "md"). Button size (optional)</li>
            <li><code>disabled?</code> – boolean (default: false). Disable interaction (optional)</li>
            <li><code>align?</code> – "start" | "center" | "end" (default: "end"). Dropdown menu alignment (optional)</li>
            <li><code>side?</code> – "top" | "right" | "bottom" | "left" (default: "bottom"). Dropdown menu side (optional)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "SplitButton",
  "props": {
    "primaryAction": {
      "label": "Save",
      "onClick": "handleSave"
    },
    "options": [
      {
        "label": "Save As",
        "onClick": "handleSaveAs"
      },
      {
        "label": "Save All",
        "onClick": "handleSaveAll"
      }
    ],
    "variant": "solid",
    "size": "md"
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
