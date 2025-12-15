"use client";

import { Separator, DocumentContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";

export default function SeparatorPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Separator</h1>
      </div>
      <p className="mb-6 intro-text">
        Visually divide content into sections.
      </p>
      
      
      {/* Horizontal */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-md">
            <div className="py-2">Content above</div>
            <div className="py-2">Content below</div>
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { Separator } from "@fragment_ui/ui";

<div className="w-full">
  <div className="py-2">Content above</div>
  <div className="py-2">Content below</div>
</div>`}</CodeBlock>
        </div>
      </div>

      {/* Vertical */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="flex h-20 items-center">
            <div className="px-4">Left</div>
            <div className="px-4">Right</div>
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { Separator } from "@fragment_ui/ui";

<div className="flex h-20 items-center">
  <div className="px-4">Left</div>
  <div className="px-4">Right</div>
</div>`}</CodeBlock>
        </div>
      </div>
      
      <h2 id="features">Features</h2>
      <ul>
        <li>Horizontal and vertical orientations</li>
        <li>Accessible via Radix UI</li>
        <li>Customizable styling</li>
      </ul>
      
      <h2 id="props">Props</h2>
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border border-[color:var(--color-fg-muted)]">
          <thead>
            <tr>
              <th className="border border-[color:var(--color-fg-muted)] px-4 py-2 text-left">Prop</th>
              <th className="border border-[color:var(--color-fg-muted)] px-4 py-2 text-left">Type</th>
              <th className="border border-[color:var(--color-fg-muted)] px-4 py-2 text-left">Default</th>
              <th className="border border-[color:var(--color-fg-muted)] px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">orientation</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">"horizontal" | "vertical"</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">"horizontal"</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">Separator orientation</td>
            </tr>
            <tr>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">decorative</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">boolean</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">true</td>
              <td className="border border-[color:var(--color-fg-muted)] px-4 py-2">Whether separator is decorative</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">npx shadcn@latest add /r/separator.json</CodeBlock>
      <h2 id="accessibility">Accessibility</h2>
      <p>Separator uses Radix UI's accessible separator component. When decorative is true (default), it's hidden from screen readers.</p>
      
      <h2 id="links">Links</h2>
      <ul>
        <li><StorybookLink path="/docs/layout-separator--docs">View in Storybook</StorybookLink></li>
      </ul>


    </DocumentContent>
  );
}

