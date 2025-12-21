"use client";

import { useState } from "react";
import { TagInput, DocumentContent, CodeBlock, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";

const tagInputCode = `import { TagInput } from "@fragment_ui/ui";
import { useState } from "react";

export function TagInputDemo() {
  const [tags, setTags] = useState<string[]>(["design", "frontend"]);
  
  return (
    <TagInput value={tags} onChange={setTags} placeholder="Add tags..." />
  );
}`;

export default function TagInputPage() {
  const [tags, setTags] = useState<string[]>(["design", "frontend"]);

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="tag-input">Tag Input</h1>
      </div>
      <p className="mb-6 intro-text">Enter and manage multiple tags or chips.</p>
      
      <ExampleSection
        id="tag-input-example"
        title="Example"
        code={tagInputCode}
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="w-full max-w-md">
            <TagInput value={tags} onChange={setTags} placeholder="Add tags..." />
          </div>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add tag-input`}
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
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string[]</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Controlled array of tag strings (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>defaultValue?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string[]</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">[]</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Default array of tag strings (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>onChange?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>(tags: string[]) {'=>'} void</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Callback when tags change (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>placeholder?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">"Add tags..."</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Placeholder text (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>disabled?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">false</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Disable the input (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>maxTags?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>number</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Maximum number of tags allowed (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>maxLength?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>number</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Maximum length per tag (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>separator?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string | RegExp</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">/[,\s]+/</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Separator to split tags (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>allowDuplicates?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>boolean</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">false</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Allow duplicate tags (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>validate?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>(tag: string) {'=>'} boolean | string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Validation function (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>onTagAdd?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>(tag: string) {'=>'} void</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Callback when a tag is added (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>onTagRemove?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>(tag: string) {'=>'} void</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Callback when a tag is removed (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Additional CSS classes (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>inputClassName?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Additional CSS classes for input (optional)</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>tagClassName?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>string</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Additional CSS classes for tags (optional)</td>
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
            <code>TagInput</code> is a component for capturing multiple tags or keywords. Use it when you need to allow users to input and manage a collection of tags, keywords, or labels. The component supports adding tags by typing and pressing Enter, and removing tags by clicking the X button.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Tag or keyword input fields</li>
            <li>Category selection</li>
            <li>Label management</li>
            <li>Search filters with multiple values</li>
            <li>Any scenario requiring multiple tag input</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "TagInput"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>value?</code> – array. Controlled array of tag strings (optional)</li>
            <li><code>defaultValue?</code> – array. Default array of tag strings (optional)</li>
            <li><code>onChange?</code> – function. Callback when tags change: <code>(tags: string[]) {'=>'} void</code> (optional)</li>
            <li><code>placeholder?</code> – string. Placeholder text (optional, default: "Add tags...")</li>
            <li><code>disabled?</code> – boolean. Disable the input (optional, default: false)</li>
            <li><code>maxTags?</code> – number. Maximum number of tags allowed (optional)</li>
            <li><code>maxLength?</code> – number. Maximum length per tag (optional)</li>
            <li><code>separator?</code> – string | RegExp. Separator to split tags (optional, default: /[,\s]+/)</li>
            <li><code>allowDuplicates?</code> – boolean. Allow duplicate tags (optional, default: false)</li>
            <li><code>validate?</code> – function. Validation function: <code>(tag: string) {'=>'} boolean | string</code> (optional)</li>
            <li><code>onTagAdd?</code> – function. Callback when a tag is added: <code>(tag: string) {'=>'} void</code> (optional)</li>
            <li><code>onTagRemove?</code> – function. Callback when a tag is removed: <code>(tag: string) {'=>'} void</code> (optional)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
            <li><code>inputClassName?</code> – string. Additional CSS classes for input (optional)</li>
            <li><code>tagClassName?</code> – string. Additional CSS classes for tags (optional)</li>
          </ul>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "TagInput",
  "props": {
    "value": ["design", "frontend"],
    "onChange": "handleTagsChange",
    "placeholder": "Add tags..."
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
