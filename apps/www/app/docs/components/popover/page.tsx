"use client";

import { PopoverWrapper, DocumentContent } from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";

export default function PopoverPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Popover</h1>
      </div>
      <p className="mb-6 intro-text">
        Show contextual content anchored to an element.
      </p>
      
      
      {/* Basic */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <PopoverWrapper trigger={<Button>Open Popover</Button>}>
            <div className="space-y-2">
              <h4 className="font-medium">Popover Title</h4>
              <p className="text-sm text-[color:var(--color-fg-muted)]">
                This is the popover content.
              </p>
            </div>
          </PopoverWrapper>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { PopoverWrapper } from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";

<PopoverWrapper trigger={<Button>Open Popover</Button>}>
  <div className="space-y-2">
    <h4 className="font-medium">Popover Title</h4>
    <p className="text-sm text-[color:var(--color-fg-muted)]">
      This is the popover content.
    </p>
  </div>
</PopoverWrapper>`}</CodeBlock>
        </div>
      </div>
      
      <h2 id="features">Features</h2>
      <ul>
        <li>Accessible via Radix UI</li>
        <li>Controlled and uncontrolled modes</li>
        <li>Position control</li>
        <li>Animated appearance</li>
      </ul>
      
      
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">npx shadcn@latest add /r/popover.json</CodeBlock>
      <h2 id="accessibility">Accessibility</h2>
      <p>Popover uses Radix UI which provides full keyboard navigation and focus management.</p>
      
      <h2 id="links">Links</h2>
      <ul>
        <li><StorybookLink path="/docs/overlay-popover--docs">View in Storybook</StorybookLink></li>
      </ul>


    </DocumentContent>
  );
}

