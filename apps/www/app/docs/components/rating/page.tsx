"use client";

import { Rating, DocumentContent, CodeBlock } from "@fragment_ui/ui";
import { useState } from "react";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";

export default function RatingPage() {
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(3.5);

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">
          Rating
        </h1>
      </div>
      <p className="mb-6 intro-text">Capture a score (e.g., stars) from users.</p>
      
      {/* Default */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[200px] p-10">
          <Rating value={4} readOnly showValue />
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { Rating } from "@fragment_ui/ui";

<Rating value={4} readOnly showValue />`}
          </CodeBlock>
        </div>
      </div>

      {/* Interactive */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[200px] p-10">
          <div className="space-y-2">
            <p className="text-sm text-[color:var(--color-fg-muted)]">Current value: {value1}</p>
            <Rating value={value1} onChange={setValue1} allowClear />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { Rating } from "@fragment_ui/ui";
import { useState } from "react";

const [value, setValue] = useState(0);

<Rating value={value} onChange={setValue} allowClear />`}
          </CodeBlock>
        </div>
      </div>

      {/* With Half Stars */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[200px] p-10">
          <div className="space-y-2">
            <p className="text-sm text-[color:var(--color-fg-muted)]">Current value: {value2}</p>
            <Rating value={value2} onChange={setValue2} half showValue />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { Rating } from "@fragment_ui/ui";
import { useState } from "react";

const [value, setValue] = useState(3.5);

<Rating value={value} onChange={setValue} half showValue />`}
          </CodeBlock>
        </div>
      </div>

      <h2 id="api">API</h2>
      <div className="my-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left p-2 font-semibold">Prop</th>
              <th className="text-left p-2 font-semibold">Type</th>
              <th className="text-left p-2 font-semibold">Default</th>
              <th className="text-left p-2 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="p-2 font-mono text-sm">value</td>
              <td className="p-2 text-sm">number</td>
              <td className="p-2 text-sm">-</td>
              <td className="p-2 text-sm">Controlled value of the rating</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="p-2 font-mono text-sm">defaultValue</td>
              <td className="p-2 text-sm">number</td>
              <td className="p-2 text-sm">0</td>
              <td className="p-2 text-sm">Uncontrolled default value</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="p-2 font-mono text-sm">onChange</td>
              <td className="p-2 text-sm">(value: number) =&gt; void</td>
              <td className="p-2 text-sm">-</td>
              <td className="p-2 text-sm">Callback when rating changes</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="p-2 font-mono text-sm">max</td>
              <td className="p-2 text-sm">number</td>
              <td className="p-2 text-sm">5</td>
              <td className="p-2 text-sm">Maximum number of stars</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="p-2 font-mono text-sm">half</td>
              <td className="p-2 text-sm">boolean</td>
              <td className="p-2 text-sm">false</td>
              <td className="p-2 text sm">Enable half-star ratings</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="p-2 font-mono text-sm">readOnly</td>
              <td className="p-2 text-sm">boolean</td>
              <td className="p-2 text-sm">false</td>
              <td className="p-2 text-sm">Display only, no interaction</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="p-2 font-mono text-sm">size</td>
              <td className="p-2 text-sm">"sm" | "md" | "lg"</td>
              <td className="p-2 text-sm">"md"</td>
              <td className="p-2 text-sm">Size of the stars</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="p-2 font-mono text-sm">disabled</td>
              <td className="p-2 text-sm">boolean</td>
              <td className="p-2 text-sm">false</td>
              <td className="p-2 text-sm">Disable interaction</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="p-2 font-mono text-sm">showValue</td>
              <td className="p-2 text-sm">boolean</td>
              <td className="p-2 text-sm">false</td>
              <td className="p-2 text-sm">Show numeric value next to stars</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="p-2 font-mono text-sm">allowClear</td>
              <td className="p-2 text-sm">boolean</td>
              <td className="p-2 text-sm">false</td>
              <td className="p-2 text-sm">Allow clearing by clicking same value</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="p-2 font-mono text-sm">className</td>
              <td className="p-2 text-sm">string</td>
              <td className="p-2 text-sm">-</td>
              <td className="p-2 text-sm">Additional CSS classes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="features">Features</h2>
      <ul className="list-disc list-inside space-y-2 my-4">
        <li>⭐ Full star ratings (1-5 or custom max)</li>
        <li>⭐ Half-star support for granular ratings</li>
        <li>⭐ Read-only mode for displaying ratings</li>
        <li>⭐ Interactive mode with onChange callback</li>
        <li>⭐ Customizable number of stars</li>
        <li>⭐ Three sizes: sm, md, lg</li>
        <li>⭐ Value display option</li>
        <li>⭐ Allow clear functionality</li>
        <li>⭐ Fully accessible with ARIA attributes</li>
        <li>⭐ Hover feedback for better UX</li>
      </ul>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">
        npx shadcn@latest add /r/rating.json
      </CodeBlock>
    </DocumentContent>
  );
}
      