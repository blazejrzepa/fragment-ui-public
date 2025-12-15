"use client";

import { useState } from "react";
import { CodeBlock, DocumentContent, MultiSelect, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";

export default function MultiSelectPage() {
  const [value1, setValue1] = useState<string[]>([]);
  const [value2, setValue2] = useState<string[]>(["react", "vue"]);
  const [value3, setValue3] = useState<string[]>([]);

  const options = [
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "angular", label: "Angular" },
    { value: "svelte", label: "Svelte" },
    { value: "nextjs", label: "Next.js" },
    { value: "remix", label: "Remix" },
  ];

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">
          Multi-Select
        </h1>
      </div>
      <p className="mb-6 intro-text">Choose multiple options from a list.</p>
      
      {/* Default */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-md">
            <MultiSelect options={options} value={value1} onValueChange={setValue1} />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { MultiSelect } from "@fragment_ui/ui";
import { useState } from "react";

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
];

const [value, setValue] = useState<string[]>([]);

<MultiSelect options={options} value={value} onValueChange={setValue} />`}
          </CodeBlock>
        </div>
      </div>

      <h2 id="install">Install</h2>
      <p>The Multi-Select is built using a composition of the <code>Popover</code> and <code>Command</code> components.</p>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">{`npx shadcn@latest add https://fragmentui.com/r/multi-select.json`}</CodeBlock>

      <h2 id="usage">Usage</h2>
      <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { MultiSelect } from "@fragment_ui/ui"
import { useState } from "react"

const [value, setValue] = useState<string[]>([])

<MultiSelect
  options={options}
  value={value}
  onValueChange={setValue}
/>`}</CodeBlock>

      <Collapsible>
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <p><strong>Intent</strong></p>
          <p>
            <code>MultiSelect</code> is a component for selecting multiple options from a searchable list.<br />
            Use it when you need to allow users to select multiple items from a list, with support for search/filter functionality, tag display, and clearable selections.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Multiple selection from a list of options</li>
            <li>Tag-based selection interfaces</li>
            <li>Filtering and categorization</li>
            <li>Framework or technology multi-selectors</li>
            <li>Any scenario where users need to select multiple items from a searchable list</li>
          </ul>

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "MultiSelect"</code>.
          </p>
          <p>Props:</p>
          <ul>
            <li><code>options</code> – Array of option objects with <code>value</code> and <code>label</code> (required)</li>
            <li><code>value?</code> – Selected values array (optional, for controlled component, default: [])</li>
            <li><code>onValueChange?</code> – Callback when value changes (optional)</li>
            <li><code>placeholder?</code> – Placeholder text for trigger button (optional, default: "Select options...")</li>
            <li><code>maxCount?</code> – Maximum number of tags to display before showing overflow indicator (optional, default: 3)</li>
            <li><code>clearable?</code> – Enable clear all functionality (optional, default: true)</li>
            <li><code>disabled?</code> – Disable the multi-select (optional)</li>
            <li><code>className?</code> – Additional CSS classes (optional)</li>
          </ul>
          <p>Each option in <code>options</code> should include:</p>
          <ul>
            <li><code>value</code> – unique identifier (string, required)</li>
            <li><code>label</code> – display text (string, required)</li>
            <li><code>disabled?</code> – disable this option (boolean, optional)</li>
          </ul>

          <p><strong>Example</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "MultiSelect",
  "props": {
    "options": [
      { "value": "react", "label": "React" },
      { "value": "vue", "label": "Vue" },
      { "value": "angular", "label": "Angular" },
      { "value": "svelte", "label": "Svelte" }
    ],
    "placeholder": "Select frameworks...",
    "maxCount": 3,
    "clearable": true
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
      
      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/core-multiselect--docs">Storybook</StorybookLink>
        </li>
      </ul>
    </DocumentContent>
  );
}

