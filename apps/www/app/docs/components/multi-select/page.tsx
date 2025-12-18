"use client";

import { useState } from "react";
import { CodeBlock, DocumentContent, MultiSelect, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";

const multiSelectCode = `import { MultiSelect } from "@fragment_ui/ui";
import { useState } from "react";

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "nextjs", label: "Next.js" },
  { value: "remix", label: "Remix" },
];

export function MultiSelectDemo() {
  const [value, setValue] = useState<string[]>([]);
  
  return (
    <MultiSelect options={options} value={value} onValueChange={setValue} />
  );
}`;

export default function MultiSelectPage() {
  const [value1, setValue1] = useState<string[]>([]);

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
        <h1 id="multi-select">Multi-Select</h1>
      </div>
      <p className="mb-6 intro-text">Choose multiple options from a list.</p>
      
      <ExampleSection
        id="multi-select-example"
        title="Example"
        code={multiSelectCode}
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="w-full max-w-md">
            <MultiSelect options={options} value={value1} onValueChange={setValue1} />
          </div>
        </div>
      </ExampleSection>

      <h2 id="api-reference">API Reference</h2>
      <div className="mt-4 border border-[color:var(--color-border-base)] rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-2 px-4 font-semibold text-sm">Component</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Props</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Default</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>MultiSelect</code></td>
              <td className="py-2 px-4"><code>options?, value?, onValueChange?, placeholder?, searchPlaceholder?, emptyText?, maxCount?, className?, disabled?, clearable?, loading?, asyncOptions?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Multi-select component with search and tag display</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="install">Install</h2>
      <p>The Multi-Select is built using a composition of the <code>Popover</code> and <code>Command</code> components.</p>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add multi-select`}
      </CodeBlock>

      <Collapsible className="mt-8">
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation" className="m-0">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <h3>Intent</h3>
          <p>
            <code>MultiSelect</code> is a component for selecting multiple options from a searchable list. Use it when you need to allow users to select multiple items from a list, with support for search/filter functionality, tag display, and clearable selections.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Multiple selection from a list of options</li>
            <li>Tag-based selection interfaces</li>
            <li>Filtering and categorization</li>
            <li>Framework or technology multi-selectors</li>
            <li>Any scenario where users need to select multiple items from a searchable list</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "MultiSelect"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>options?</code> – MultiSelectOption[]. Array of option objects with <code>value</code> and <code>label</code> (optional, default: [])</li>
            <li><code>value?</code> – string[]. Selected values array (optional, default: [])</li>
            <li><code>onValueChange?</code> – function. Callback when values change: <code>(value: string[]) {'=>'} void</code> (optional)</li>
            <li><code>placeholder?</code> – string (default: "Select options..."). Placeholder text (optional)</li>
            <li><code>searchPlaceholder?</code> – string (default: "Search..."). Search input placeholder (optional)</li>
            <li><code>emptyText?</code> – string (default: "No results found."). Text when no results found (optional)</li>
            <li><code>maxCount?</code> – number (default: 3). Maximum number of selections to show before "+X more" (optional)</li>
            <li><code>disabled?</code> – boolean. Disable the component (optional)</li>
            <li><code>clearable?</code> – boolean (default: true). Allow clearing individual selections (optional)</li>
            <li><code>loading?</code> – boolean. Show loading state (optional)</li>
            <li><code>asyncOptions?</code> – boolean. Enable async options loading (optional)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "MultiSelect",
  "props": {
    "options": [
      { "value": "react", "label": "React" },
      { "value": "vue", "label": "Vue" },
      { "value": "angular", "label": "Angular" }
    ],
    "value": [],
    "onValueChange": "handleValueChange"
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
