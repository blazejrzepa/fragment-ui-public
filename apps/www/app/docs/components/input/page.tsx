"use client";

import { useState } from "react";
import { CodeBlock, DocumentContent, Input, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";
import { Search, Check } from "lucide-react";

const inputCode = `import { Input } from "@fragment_ui/ui";
import { Search, Check } from "lucide-react";

export function InputDemo() {
  return (
    <div className="flex flex-col gap-[var(--space-8)] w-full">
      <div className="flex flex-col gap-[var(--space-4)]">
        <p className="text-sm text-[color:var(--color-fg-muted)]">Default</p>
        <div className="space-y-[var(--space-2)]">
          <Input placeholder="Enter your name" />
          <Input placeholder="Disabled input" disabled />
        </div>
      </div>

      <div className="flex flex-col gap-[var(--space-4)]">
        <p className="text-sm text-[color:var(--color-fg-muted)]">Sizes</p>
        <div className="space-y-[var(--space-2)]">
          <Input size="sm" placeholder="Small" />
          <Input size="md" placeholder="Medium" />
          <Input size="lg" placeholder="Large" />
        </div>
      </div>

      <div className="flex flex-col gap-[var(--space-4)]">
        <p className="text-sm text-[color:var(--color-fg-muted)]">With Icons</p>
        <div className="space-y-[var(--space-2)]">
          <Input size="sm" leadingIcon={<Search className="h-4 w-4" />} placeholder="Search..." />
          <Input size="sm" trailingIcon={<Check className="h-4 w-4" />} placeholder="With trailing icon" />
        </div>
      </div>

      <div className="flex flex-col gap-[var(--space-4)]">
        <p className="text-sm text-[color:var(--color-fg-muted)]">States</p>
        <div className="space-y-[var(--space-2)]">
          <Input placeholder="Read only" value="Read only value" readOnly />
          <Input placeholder="With error state" error />
        </div>
      </div>
    </div>
  );
}`;

export default function InputPage() {
  const [value, setValue] = useState("");

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-[var(--space-4)] mb-[var(--space-1)]">
        <h1 id="input">Input</h1>
      </div>
      <p className="mb-[var(--space-6)] intro-text">Capture short, single-line text.</p>
      
      <ExampleSection
        id="input-example"
        title="Input Example"
        code={inputCode}
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <div className="flex flex-col gap-[var(--space-8)] w-full max-w-md">
            <div className="flex flex-col gap-[var(--space-4)]">
              <p className="text-[length:var(--typography-size-sm)] text-[color:var(--color-fg-muted)]">Default</p>
              <div className="space-y-[var(--space-2)]">
                <Input placeholder="Enter your name" value={value} onChange={(e) => setValue(e.target.value)} />
                <Input placeholder="Disabled input" disabled />
              </div>
            </div>

            <div className="flex flex-col gap-[var(--space-4)]">
              <p className="text-[length:var(--typography-size-sm)] text-[color:var(--color-fg-muted)]">Sizes</p>
              <div className="space-y-[var(--space-2)]">
                <Input size="sm" placeholder="Small" />
                <Input size="md" placeholder="Medium" />
                <Input size="lg" placeholder="Large" />
              </div>
            </div>

            <div className="flex flex-col gap-[var(--space-4)]">
              <p className="text-[length:var(--typography-size-sm)] text-[color:var(--color-fg-muted)]">With Icons</p>
              <div className="space-y-[var(--space-2)]">
                <Input size="sm" leadingIcon={<Search className="h-4 w-4" />} placeholder="Search..." />
                <Input size="sm" trailingIcon={<Check className="h-4 w-4" />} placeholder="With trailing icon" />
              </div>
            </div>

            <div className="flex flex-col gap-[var(--space-4)]">
              <p className="text-[length:var(--typography-size-sm)] text-[color:var(--color-fg-muted)]">States</p>
              <div className="space-y-[var(--space-2)]">
                <Input placeholder="Read only" value="Read only value" readOnly />
                <Input placeholder="With error state" error />
              </div>
            </div>
          </div>
        </div>
      </ExampleSection>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add input`}
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
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>type</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>"text"</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Input type: <code>"text"</code>, <code>"email"</code>, <code>"password"</code>, <code>"number"</code>, etc.</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>placeholder</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Placeholder text displayed when input is empty</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>value</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Controlled input value</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>defaultValue</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Default input value (uncontrolled)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>onChange</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>(e: ChangeEvent) {'=>'} void</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Callback when input value changes</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>size</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>"sm" | "md" | "lg"</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>"md"</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Size variant of the input</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>leadingIcon</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>ReactNode</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Icon displayed before the input text</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>trailingIcon</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>ReactNode</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Icon displayed after the input text</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>disabled</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>false</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Disable input interaction</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>readOnly</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>false</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Make input read-only (value cannot be changed)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>error</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>false</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Show error state styling</td>
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
            <code>Input</code> is a component for entering a single-line text value. Use it when you need to collect text input from users, such as names, emails, passwords, search queries, or any single-line text data. The component provides size variants, icon support, loading states, and error handling.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Text input fields (names, addresses, etc.)</li>
            <li>Email and password inputs</li>
            <li>Search bars and query inputs</li>
            <li>Form fields with validation</li>
            <li>Settings and configuration inputs</li>
            <li>Any scenario requiring single-line text input</li>
          </ul>

          <p><strong>UI-DSL Usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Input"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>type?</code> – Input type: <code>"text"</code>, <code>"email"</code>, <code>"password"</code>, <code>"number"</code>, etc. (optional, default: <code>"text"</code>)</li>
            <li><code>placeholder?</code> – Placeholder text displayed when the input is empty (optional)</li>
            <li><code>value?</code> – Controlled input value (use with <code>onChange</code> for controlled component) (optional)</li>
            <li><code>defaultValue?</code> – Default input value for uncontrolled component (optional)</li>
            <li><code>onChange?</code> – Callback function that receives the change event when the input value changes (optional)</li>
            <li><code>size?</code> – Size variant: <code>"sm"</code> for small, <code>"md"</code> for medium, or <code>"lg"</code> for large (optional, default: <code>"md"</code>)</li>
            <li><code>leadingIcon?</code> – React node (typically an icon) displayed before the input text (optional)</li>
            <li><code>trailingIcon?</code> – React node (typically an icon) displayed after the input text (optional)</li>
            <li><code>disabled?</code> – Boolean to disable input interaction and prevent user input (optional)</li>
            <li><code>readOnly?</code> – Boolean to make input read-only (value cannot be changed by user) (optional)</li>
            <li><code>error?</code> – Boolean to show error state styling (typically used with validation) (optional)</li>
            <li><code>className?</code> – Additional CSS classes to apply to the input (optional)</li>
          </ul>

          <h3>Basic Input</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Input",
  "props": {
    "type": "text",
    "placeholder": "Enter your name",
    "size": "md"
  }
}`}</CodeBlock>

          <h3>Input with Icon</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Input",
  "props": {
    "type": "search",
    "placeholder": "Search...",
    "size": "sm",
    "leadingIcon": {
      "type": "icon",
      "name": "Search",
      "props": { "size": 16 }
    }
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
