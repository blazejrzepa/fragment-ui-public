"use client";

import { Spinner, DocumentContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";

export default function SpinnerPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Spinner</h1>
      </div>
      <p className="mb-6 intro-text">
        Indicate loading in progress.
      </p>
      
      
      {/* Sizes */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="flex gap-4 items-center">
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { Spinner } from "@fragment_ui/ui";

<div className="flex gap-4 items-center">
</div>`}</CodeBlock>
        </div>
      </div>
      
      <h2 id="features">Features</h2>
      <ul>
        <li>Three sizes: sm, md, lg</li>
        <li>Smooth animation</li>
        <li>Accessible with role="status"</li>
        <li>Customizable with className</li>
      </ul>
      
      <h2 id="props">Props</h2>
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border border-[color:var(--color-fg-muted)]">
          <thead>
            <tr>
              <th className="border border-[color:var(--color-fg-muted)] px-4 py-2 text-left">Prop</th>
              <th className="border border-[color:var(--color-fg-muted)] px-4 py-2 text-left">Type</th>
              <th className="border border-[color:var(--color-fg-muted)] px-4 py-2 text-left">Default</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">size</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">"sm" | "md" | "lg"</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">"md"</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">npx shadcn@latest add /r/spinner.json</CodeBlock>
      <h2 id="accessibility">Accessibility</h2>
      <p>Spinner includes role="status" and aria-label="Loading" for screen readers.</p>
      
      <h2 id="links">Links</h2>
      <ul>
        <li><StorybookLink path="/docs/feedback-spinner--docs">View in Storybook</StorybookLink></li>
      </ul>


    </DocumentContent>
  );
}

