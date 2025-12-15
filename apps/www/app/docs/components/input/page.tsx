"use client";

import { useState } from "react";
import { CodeBlock, DocumentContent, Input, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { Search, Check } from "lucide-react";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";

export default function InputPage() {
  const [value, setValue] = useState("");

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="page" className="text-3xl font-medium mb-4">
          Input
        </h1>
      </div>
      <p className="mb-6 intro-text">Enter a single-line text value.</p>
      
      {/* Preview */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="flex flex-col gap-8 w-full max-w-md">
            <div className="flex flex-col gap-4">
              <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Default</p>
              <div className="space-y-2">
                <Input placeholder="Enter your name" value={value} onChange={(e) => setValue(e.target.value)} />
                <Input placeholder="Disabled input" disabled />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>Sizes</p>
              <div className="space-y-2">
                <Input size="sm" placeholder="Small" />
                <Input size="md" placeholder="Medium" />
                <Input size="lg" placeholder="Large" />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>With Icons</p>
              <div className="space-y-2">
                <Input size="sm" leadingIcon={<Search className="h-4 w-4" />} placeholder="Search..." />
                <Input size="sm" trailingIcon={<Check className="h-4 w-4" />} placeholder="With trailing icon" />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-sm" style={{ color: "var(--color-fg-muted)" }}>States</p>
              <div className="space-y-2">
                <Input placeholder="Read only" value="Read only value" readOnly />
                <Input placeholder="With error state" error />
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { Input } from "@fragment_ui/ui";
import { Search, Check } from "lucide-react";

<Input placeholder="Enter your name" />
<Input size="sm" leadingIcon={<Search className="h-4 w-4" />} placeholder="Search..." />
<Input size="sm" trailingIcon={<Check className="h-4 w-4" />} placeholder="With trailing icon" />`}
          </CodeBlock>
        </div>
      </div>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">
        {`npx shadcn@latest add https://fragmentui.com/r/input.json`}
      </CodeBlock>

      <Collapsible>
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <p><strong>Intent</strong></p>
          <p>
            <code>Input</code> is a component for entering a single-line text value.<br />
            Use it when you need to collect text input from users, such as names, emails, passwords, search queries, or any single-line text data. The component provides size variants, icon support, loading states, and error handling.
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

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Input"</code>.
          </p>
          <p>Props for <code>Input</code>:</p>
          <ul>
            <li><code>size?</code> – Input size: "sm" | "md" | "lg" (optional, default: "md")</li>
            <li><code>loading?</code> – Show loading spinner: <code>boolean</code> (optional)</li>
            <li><code>error?</code> – Show error state: <code>boolean</code> (optional)</li>
            <li><code>leadingIcon?</code> – Icon before input: <code>React.ReactNode</code> (optional)</li>
            <li><code>trailingIcon?</code> – Icon after input: <code>React.ReactNode</code> (optional)</li>
            <li><code>placeholder?</code> – Placeholder text: <code>string</code> (optional)</li>
            <li><code>value?</code> – Controlled value: <code>string</code> (optional)</li>
            <li><code>onChange?</code> – Change handler: <code>(e: ChangeEvent) =&gt; void</code> (optional)</li>
            <li><code>disabled?</code> – Disable input: <code>boolean</code> (optional)</li>
            <li><code>readOnly?</code> – Make input read-only: <code>boolean</code> (optional)</li>
            <li><code>type?</code> – Input type: "text" | "email" | "password" | "number" | "search" | "tel" | "url" (optional, default: "text")</li>
            <li><code>className?</code> – Additional CSS classes (optional)</li>
          </ul>
          <p><strong>Note:</strong> All standard HTML input attributes are supported (id, name, required, aria-label, etc.)</p>

          <p><strong>Example</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Input",
  "props": {
    "size": "md",
    "placeholder": "Enter your email",
    "type": "email"
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
      
      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/core-input--docs">Storybook</StorybookLink>
        </li>
      </ul>
    </DocumentContent>
  );
}
