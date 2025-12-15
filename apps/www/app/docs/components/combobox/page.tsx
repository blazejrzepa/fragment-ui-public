"use client";

import { Combobox, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";
import { useState } from "react";

export default function ComboboxPage() {
  const [value, setValue] = useState<string>();
  const frameworks = [
    { value: "next.js", label: "Next.js" },
    { value: "sveltekit", label: "SvelteKit" },
    { value: "nuxt.js", label: "Nuxt.js" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" },
  ];

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Combobox</h1>
      </div>
      <p className="mb-6 intro-text">
        Autocomplete input and command palette with a list of suggestions.
      </p>
      
      
      {/* Default */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
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
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { Combobox } from "@fragment_ui/ui";
import { useState } from "react";

const frameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

const [value, setValue] = useState<string>();

<Combobox
  options={frameworks}
  value={value}
  onValueChange={setValue}
  placeholder="Select framework..."
  searchPlaceholder="Search framework..."
  emptyText="No framework found."
/>`}</CodeBlock>
        </div>
      </div>

      <h2 id="install">Install</h2>
      <p>The Combobox is built using a composition of the <code>Popover</code> and <code>Command</code> components.</p>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">{`npx shadcn@latest add https://fragmentui.com/r/combobox.json`}</CodeBlock>

      <Collapsible>
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <p><strong>Intent</strong></p>
          <p>
            <code>Combobox</code> is a component for autocomplete input and command palette with a list of suggestions.<br />
            Use it when you need to provide users with a searchable dropdown list, autocomplete functionality, or a command palette interface for selecting options from a large list.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Searchable dropdown lists with many options</li>
            <li>Autocomplete input fields</li>
            <li>Command palette interfaces</li>
            <li>Framework or technology selectors</li>
            <li>Any scenario where users need to search and select from a list</li>
          </ul>

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Combobox"</code>.
          </p>
          <p>Props:</p>
          <ul>
            <li><code>options</code> – Array of option objects with <code>value</code> and <code>label</code> (required)</li>
            <li><code>value?</code> – Selected value (optional, for controlled component)</li>
            <li><code>onValueChange?</code> – Callback when value changes (optional)</li>
            <li><code>placeholder?</code> – Placeholder text for trigger button (optional, default: "Select option...")</li>
            <li><code>searchPlaceholder?</code> – Placeholder for search input (optional, default: "Search...")</li>
            <li><code>emptyText?</code> – Text when no results found (optional, default: "No results found.")</li>
            <li><code>disabled?</code> – Disable the combobox (optional)</li>
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
  "component": "Combobox",
  "props": {
    "options": [
      { "value": "next.js", "label": "Next.js" },
      { "value": "sveltekit", "label": "SvelteKit" },
      { "value": "nuxt.js", "label": "Nuxt.js" },
      { "value": "remix", "label": "Remix" },
      { "value": "astro", "label": "Astro" }
    ],
    "placeholder": "Select framework...",
    "searchPlaceholder": "Search framework...",
    "emptyText": "No framework found."
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>

      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/core-combobox--docs">Storybook</StorybookLink>
        </li>
      </ul>


    </DocumentContent>
  );
}


