"use client";

import { Radio, RadioGroup, DocumentContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";
import { useState } from "react";

export default function RadioPage() {
  const [value, setValue] = useState("option1");
  const [fruit, setFruit] = useState("apple");

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Radio</h1>
      </div>
      <p className="mb-6 intro-text">
        Select one option from a set.
      </p>
      
      
      {/* Basic Radio Group */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-md">
            <RadioGroup value={value} onValueChange={setValue}>
            </RadioGroup>
            <p className="mt-2 text-sm text-[color:var(--color-fg-muted)]">
              Selected: {value}
            </p>
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { Radio, RadioGroup } from "@fragment_ui/ui";
import { useState } from "react";

const [value, setValue] = useState("option1");

<RadioGroup value={value} onValueChange={setValue}>
</RadioGroup>`}</CodeBlock>
        </div>
      </div>
      
      
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">npx shadcn@latest add /r/radio.json</CodeBlock>
      <h2 id="accessibility">Accessibility</h2>
      <p>
        RadioGroup and Radio components are fully accessible with proper ARIA attributes,
        keyboard navigation (arrow keys), and screen reader support. Compliant with WAI-ARIA
        radio group pattern.
      </p>
      
      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/core-radio--docs">Storybook</StorybookLink>
        </li>
      </ul>


    </DocumentContent>
  );
}

