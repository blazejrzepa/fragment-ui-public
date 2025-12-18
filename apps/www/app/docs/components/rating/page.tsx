"use client";

import { Rating, DocumentContent, CodeBlock, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";
import { useState } from "react";

const ratingReadOnlyCode = `import { Rating } from "@fragment_ui/ui";

export function RatingReadOnlyDemo() {
  return (
    <Rating value={4} readOnly showValue />
  );
}`;

const ratingInteractiveCode = `import { Rating } from "@fragment_ui/ui";
import { useState } from "react";

export function RatingInteractiveDemo() {
  const [value, setValue] = useState(0);
  
  return (
    <div className="space-y-[var(--space-2)]">
      <p className="text-sm text-[color:var(--color-fg-muted)]">Current value: {value}</p>
      <Rating value={value} onChange={setValue} allowClear />
    </div>
  );
}`;

const ratingHalfCode = `import { Rating } from "@fragment_ui/ui";
import { useState } from "react";

export function RatingHalfDemo() {
  const [value, setValue] = useState(3.5);
  
  return (
    <div className="space-y-[var(--space-2)]">
      <p className="text-sm text-[color:var(--color-fg-muted)]">Current value: {value}</p>
      <Rating value={value} onChange={setValue} half showValue />
    </div>
  );
}`;

export default function RatingPage() {
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(3.5);

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="rating">Rating</h1>
      </div>
      <p className="mb-6 intro-text">Capture or display rating value (e.g. stars).</p>
      
      <ExampleSection
        id="rating-readonly"
        title="Read-Only"
        code={ratingReadOnlyCode}
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <Rating value={4} readOnly showValue />
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add rating`}
      </CodeBlock>

      <ExampleSection
        id="rating-interactive"
        title="Interactive"
        code={ratingInteractiveCode}
        marginTop="mt-8"
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="space-y-[var(--space-2)] flex flex-col items-center w-full">
            <p className="text-sm text-[color:var(--color-fg-muted)]">Current value: {value1}</p>
            <Rating value={value1} onChange={setValue1} allowClear />
          </div>
        </div>
      </ExampleSection>

      <ExampleSection
        id="rating-half"
        title="Half Stars"
        code={ratingHalfCode}
        marginTop="mt-8"
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="space-y-[var(--space-2)] flex flex-col items-center w-full">
            <p className="text-sm text-[color:var(--color-fg-muted)]">Current value: {value2}</p>
            <Rating value={value2} onChange={setValue2} half showValue />
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
              <td className="py-2 px-4"><code>Rating</code></td>
              <td className="py-2 px-4"><code>value?, defaultValue?, onChange?, max?, half?, readOnly?, size?, disabled?, showValue?, allowClear?, className?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Star rating component for capturing user scores</td>
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
          <h3>Intent</h3>
          <p>
            <code>Rating</code> is a component for capturing a score (e.g., stars) from users. Use it when you need to allow users to rate or score something, such as products, services, content, or experiences. The component supports both read-only display and interactive rating with optional half-star support.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Product or service ratings</li>
            <li>Review and feedback forms</li>
            <li>Content quality indicators</li>
            <li>User satisfaction surveys</li>
            <li>Any scenario requiring star-based rating</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "Rating"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>value?</code> – number. Rating value (0-max) (optional)</li>
            <li><code>defaultValue?</code> – number. Initial value (optional)</li>
            <li><code>onChange?</code> – function. Callback when value changes: <code>(value: number) {'=>'} void</code> (optional)</li>
            <li><code>max?</code> – number (default: 5). Maximum rating value (optional)</li>
            <li><code>half?</code> – boolean (default: false). Allow half-star ratings (optional)</li>
            <li><code>readOnly?</code> – boolean (default: false). Make rating read-only (optional)</li>
            <li><code>size?</code> – "sm" | "md" | "lg" (default: "md"). Size of stars (optional)</li>
            <li><code>disabled?</code> – boolean. Disable the rating (optional)</li>
            <li><code>showValue?</code> – boolean (default: false). Show numeric value (optional)</li>
            <li><code>allowClear?</code> – boolean (default: false). Allow clearing rating by clicking again (optional)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Rating",
  "props": {
    "value": 4,
    "readOnly": true,
    "showValue": true
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
