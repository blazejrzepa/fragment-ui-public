"use client";

import { Combobox, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent, CodeBlock } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";
import { useState } from "react";

const basicCode = `import { Combobox } from "@fragment_ui/ui";
import { useState } from "react";

const frameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

export function ComboboxBasicDemo() {
  const [value, setValue] = useState<string>();
  
  return (
    <Combobox
      options={frameworks}
      value={value}
      onValueChange={setValue}
      placeholder="Select framework..."
      searchPlaceholder="Search framework..."
      emptyText="No framework found."
      className="w-[200px]"
    />
  );
}`;

const manyOptionsCode = `import { Combobox } from "@fragment_ui/ui";
import { useState } from "react";

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "orange", label: "Orange" },
  { value: "pineapple", label: "Pineapple" },
  { value: "grape", label: "Grape" },
  { value: "mango", label: "Mango" },
  { value: "strawberry", label: "Strawberry" },
  { value: "blueberry", label: "Blueberry" },
  { value: "raspberry", label: "Raspberry" },
  { value: "blackberry", label: "Blackberry" },
  { value: "cherry", label: "Cherry" },
  { value: "peach", label: "Peach" },
  { value: "pear", label: "Pear" },
  { value: "plum", label: "Plum" },
  { value: "kiwi", label: "Kiwi" },
  { value: "watermelon", label: "Watermelon" },
  { value: "cantaloupe", label: "Cantaloupe" },
  { value: "honeydew", label: "Honeydew" },
  { value: "papaya", label: "Papaya" },
  { value: "guava", label: "Guava" },
];

export function ComboboxManyOptionsDemo() {
  const [value, setValue] = useState<string>();
  
  return (
    <Combobox
      options={fruits}
      value={value}
      onValueChange={setValue}
      placeholder="Choose a fruit..."
      searchPlaceholder="Search fruits..."
      emptyText="No fruits found."
      className="w-[250px]"
    />
  );
}`;

const disabledOptionsCode = `import { Combobox } from "@fragment_ui/ui";
import { useState } from "react";

const frameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js", disabled: true },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro", disabled: true },
];

export function ComboboxDisabledOptionsDemo() {
  const [value, setValue] = useState<string>();
  
  return (
    <Combobox
      options={frameworks}
      value={value}
      onValueChange={setValue}
      placeholder="Select framework..."
      className="w-[200px]"
    />
  );
}`;

const disabledCode = `import { Combobox } from "@fragment_ui/ui";
import { useState } from "react";

const frameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
];

export function ComboboxDisabledDemo() {
  const [value, setValue] = useState<string>();
  
  return (
    <Combobox
      options={frameworks}
      value={value}
      onValueChange={setValue}
      placeholder="Select framework..."
      disabled={true}
      className="w-[200px]"
    />
  );
}`;

export default function ComboboxPage() {
  const [value, setValue] = useState<string>();
  const [valueMany, setValueMany] = useState<string>();
  const [valueDisabled, setValueDisabled] = useState<string>();
  const [valueDisabledComp, setValueDisabledComp] = useState<string>();
  
  const frameworks = [
    { value: "next.js", label: "Next.js" },
    { value: "sveltekit", label: "SvelteKit" },
    { value: "nuxt.js", label: "Nuxt.js" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" },
  ];

  const fruits = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "orange", label: "Orange" },
    { value: "pineapple", label: "Pineapple" },
    { value: "grape", label: "Grape" },
    { value: "mango", label: "Mango" },
    { value: "strawberry", label: "Strawberry" },
    { value: "blueberry", label: "Blueberry" },
    { value: "raspberry", label: "Raspberry" },
    { value: "blackberry", label: "Blackberry" },
    { value: "cherry", label: "Cherry" },
    { value: "peach", label: "Peach" },
    { value: "pear", label: "Pear" },
    { value: "plum", label: "Plum" },
    { value: "kiwi", label: "Kiwi" },
    { value: "watermelon", label: "Watermelon" },
    { value: "cantaloupe", label: "Cantaloupe" },
    { value: "honeydew", label: "Honeydew" },
    { value: "papaya", label: "Papaya" },
    { value: "guava", label: "Guava" },
  ];

  const frameworksWithDisabled = [
    { value: "next.js", label: "Next.js" },
    { value: "sveltekit", label: "SvelteKit" },
    { value: "nuxt.js", label: "Nuxt.js", disabled: true },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro", disabled: true },
  ];

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="combobox">Combobox</h1>
      </div>
      <p className="mb-6 intro-text">Input with selectable options and search.</p>
      
      {/* Basic */}
      <ExampleSection
        id="combobox-basic"
        title="Example"
        code={basicCode}
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <Combobox
            options={frameworks}
            value={value}
            onValueChange={setValue}
            placeholder="Select framework..."
            searchPlaceholder="Search framework..."
            emptyText="No framework found."
            className="w-[200px]"
          />
        </div>
      </ExampleSection>

      {/* Many Options */}
      <ExampleSection
        id="combobox-many-options"
        title="With Many Options"
        code={manyOptionsCode}
        marginTop="mt-8"
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <Combobox
            options={fruits}
            value={valueMany}
            onValueChange={setValueMany}
            placeholder="Choose a fruit..."
            searchPlaceholder="Search fruits..."
            emptyText="No fruits found."
            className="w-[250px]"
          />
        </div>
      </ExampleSection>

      {/* Disabled Options */}
      <ExampleSection
        id="combobox-disabled-options"
        title="With Disabled Options"
        code={disabledOptionsCode}
        marginTop="mt-8"
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <Combobox
            options={frameworksWithDisabled}
            value={valueDisabled}
            onValueChange={setValueDisabled}
            placeholder="Select framework..."
            className="w-[200px]"
          />
        </div>
      </ExampleSection>

      {/* Disabled */}
      <ExampleSection
        id="combobox-disabled"
        title="Disabled"
        code={disabledCode}
        marginTop="mt-8"
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <Combobox
            options={frameworks}
            value={valueDisabledComp}
            onValueChange={setValueDisabledComp}
            placeholder="Select framework..."
            disabled={true}
            className="w-[200px]"
          />
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <p>The Combobox is built using a composition of the <code>Popover</code> and <code>Command</code> components.</p>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add combobox`}
      </CodeBlock>

      {/* API Reference */}
      <h2 id="api" className="mt-8">API Reference</h2>
      <div className="mt-4 border border-[color:var(--color-border-base)] rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-2 px-4 font-semibold text-sm">Prop</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Type</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Default</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>options</code></td>
              <td className="py-2 px-4"><code>ComboboxOption[]</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Array of option objects with <code>value</code> and <code>label</code> (required)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>value</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Selected value (for controlled component)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>onValueChange</code></td>
              <td className="py-2 px-4"><code>(value: string) =&gt; void</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Callback when value changes</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>placeholder</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4"><code>"Select option..."</code></td>
              <td className="py-2 px-4 text-sm">Placeholder text for the input</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>searchPlaceholder</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4"><code>"Search..."</code></td>
              <td className="py-2 px-4 text-sm">Placeholder text for the search input</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>emptyText</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4"><code>"No results found."</code></td>
              <td className="py-2 px-4 text-sm">Text to show when no results found</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>disabled</code></td>
              <td className="py-2 px-4"><code>boolean</code></td>
              <td className="py-2 px-4"><code>false</code></td>
              <td className="py-2 px-4 text-sm">Disable the combobox</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>className</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Additional CSS classes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 border border-[color:var(--color-border-base)] rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-2 px-4 font-semibold text-sm">ComboboxOption Property</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Type</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Required</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>value</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4">✓</td>
              <td className="py-2 px-4 text-sm">Unique value for the option (required)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-2 px-4"><code>label</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4">✓</td>
              <td className="py-2 px-4 text-sm">Display text for the option (required)</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>disabled</code></td>
              <td className="py-2 px-4"><code>boolean</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Disable this specific option</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Collapsible className="mt-8">
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation" className="m-0">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <p><strong>Intent</strong></p>
          <p>
            <code>Combobox</code> is a component for autocomplete input and command palette with a list of suggestions. Use it when you need to provide users with a searchable dropdown list, autocomplete functionality, or a command palette interface for selecting options from a large list.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Searchable dropdown lists with many options</li>
            <li>Autocomplete input fields</li>
            <li>Command palette interfaces</li>
            <li>Framework or technology selectors</li>
            <li>Any scenario where users need to search and select from a list</li>
          </ul>

          <p><strong>UI-DSL Usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Combobox"</code>.
          </p>
          
          <p><strong>Props</strong></p>
          <ul>
            <li><code>options</code> – ComboboxOption[]. Array of option objects with <code>value</code> and <code>label</code> (required). Each option can have:
              <ul>
                <li><code>value</code> – string. Unique value for the option (required)</li>
                <li><code>label</code> – string. Display text for the option (required)</li>
                <li><code>disabled?</code> – boolean. Disable this specific option</li>
              </ul>
            </li>
            <li><code>value?</code> – string. Selected value (for controlled component)</li>
            <li><code>onValueChange?</code> – function. Callback when value changes: <code>(value: string) =&gt; void</code></li>
            <li><code>placeholder?</code> – string (default: <code>"Select option..."</code>). Placeholder text for the input</li>
            <li><code>searchPlaceholder?</code> – string (default: <code>"Search..."</code>). Placeholder text for the search input</li>
            <li><code>emptyText?</code> – string (default: <code>"No results found."</code>). Text to show when no results found</li>
            <li><code>disabled?</code> – boolean (default: <code>false</code>). Disable the combobox</li>
            <li><code>className?</code> – string. Additional CSS classes</li>
          </ul>
          <p>The Combobox is built using a composition of the <code>Popover</code> and <code>Command</code> components, providing searchable dropdown functionality with keyboard navigation.</p>

          <h3 className="mt-6 mb-4">Basic Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Combobox",
  "props": {
    "options": [
      { "value": "next.js", "label": "Next.js" },
      { "value": "react", "label": "React" },
      { "value": "vue", "label": "Vue" }
    ],
    "placeholder": "Select framework...",
    "searchPlaceholder": "Search framework...",
    "emptyText": "No framework found."
  }
}`}</CodeBlock>

          <h3 className="mt-6 mb-4">With Many Options</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Combobox",
  "props": {
    "options": [
      { "value": "apple", "label": "Apple" },
      { "value": "banana", "label": "Banana" },
      { "value": "orange", "label": "Orange" },
      { "value": "pineapple", "label": "Pineapple" }
    ],
    "placeholder": "Choose a fruit...",
    "searchPlaceholder": "Search fruits...",
    "emptyText": "No fruits found."
  }
}`}</CodeBlock>

          <h3 className="mt-6 mb-4">With Disabled Options</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Combobox",
  "props": {
    "options": [
      { "value": "next.js", "label": "Next.js" },
      { "value": "react", "label": "React" },
      { "value": "vue", "label": "Vue", "disabled": true },
      { "value": "angular", "label": "Angular", "disabled": true }
    ],
    "placeholder": "Select framework..."
  }
}`}</CodeBlock>

          <h3 className="mt-6 mb-4">Disabled State</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Combobox",
  "props": {
    "options": [
      { "value": "next.js", "label": "Next.js" },
      { "value": "react", "label": "React" }
    ],
    "disabled": true,
    "placeholder": "Select framework..."
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
