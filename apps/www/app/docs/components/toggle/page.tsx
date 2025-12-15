"use client";

import { Toggle, DocumentContent } from "@fragment_ui/ui";
import { Bold, Italic, Underline } from "lucide-react";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";

export default function TogglePage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Toggle</h1>
      </div>
      <p className="mb-6 intro-text">
        Turn a single feature on or off.
      </p>
      
      
      {/* Basic */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <Toggle aria-label="Toggle bold">Bold</Toggle>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { Toggle } from "@fragment_ui/ui";

<Toggle aria-label="Toggle bold">Bold</Toggle>`}</CodeBlock>
        </div>
      </div>

      {/* With Icons */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="flex gap-2">
            <Toggle aria-label="Toggle bold">
              <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle aria-label="Toggle italic">
              <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle aria-label="Toggle underline">
              <Underline className="h-4 w-4" />
            </Toggle>
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { Toggle } from "@fragment_ui/ui";
import { Bold, Italic, Underline } from "lucide-react";

<div className="flex gap-2">
  <Toggle aria-label="Toggle bold">
    <Bold className="h-4 w-4" />
  </Toggle>
  <Toggle aria-label="Toggle italic">
    <Italic className="h-4 w-4" />
  </Toggle>
  <Toggle aria-label="Toggle underline">
    <Underline className="h-4 w-4" />
  </Toggle>
</div>`}</CodeBlock>
        </div>
      </div>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">
        {`npx shadcn@latest add https://fragmentui.com/r/toggle.json`}
      </CodeBlock>
      
      <h2 id="storybook">Storybook</h2>
      <ul>
        <li><StorybookLink path="/docs/core-toggle--docs">Storybook</StorybookLink></li>
      </ul>


    </DocumentContent>
  );
}

