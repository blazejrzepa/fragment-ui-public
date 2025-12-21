"use client";

import { useState } from "react";
import { Textarea, DocumentContent, CodeBlock, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";

const textareaCode = `import { Textarea } from "@fragment_ui/ui";
import { useState } from "react";

export function TextareaDemo() {
  const [value, setValue] = useState("");
  
  return (
    <Textarea
      placeholder="Write your message..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}`;

export default function TextareaPage() {
  const [value, setValue] = useState("");

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="textarea">Textarea</h1>
      </div>
      <p className="mb-6 intro-text">Capture multi-line, longer text content.</p>

      <ExampleSection
        id="textarea-example"
        title="Example"
        code={textareaCode}
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <div className="w-full max-w-md">
            <Textarea
              placeholder="Write your message..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add textarea`}
      </CodeBlock>

      <h2 id="api-reference">API Reference</h2>
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
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>value?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Controlled value (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>defaultValue?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Default value (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>onChange?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>(e: ChangeEvent) {'=>'} void</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Callback when value changes (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>placeholder?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Placeholder text (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>disabled?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">false</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Disable the textarea (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>rows?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>number</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Number of visible rows (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>error?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">false</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Show error state (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Additional CSS classes (optional)</td>
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
            <code>Textarea</code> is a component for multiline text input. Use it when you need to allow users to input longer text content that spans multiple lines, such as comments, descriptions, or messages. The component supports resizing and all standard textarea attributes.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Comment or message input fields</li>
            <li>Description or notes fields</li>
            <li>Feedback forms</li>
            <li>Long-form text input</li>
            <li>Any scenario requiring multiline text input</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "Textarea"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>value?</code> – string. Controlled value (optional)</li>
            <li><code>defaultValue?</code> – string. Default value (optional)</li>
            <li><code>onChange?</code> – function. Callback when value changes: <code>(e: ChangeEvent) {'=>'} void</code> (optional)</li>
            <li><code>placeholder?</code> – string. Placeholder text (optional)</li>
            <li><code>disabled?</code> – boolean. Disable the textarea (optional, default: false)</li>
            <li><code>rows?</code> – number. Number of visible rows (optional)</li>
            <li><code>error?</code> – boolean. Show error state (optional, default: false)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>
          <p><strong>Note:</strong> Textarea accepts all standard HTML textarea attributes.</p>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Textarea",
  "props": {
    "placeholder": "Write your message...",
    "value": "messageValue",
    "onChange": "handleChange",
    "rows": 4
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
