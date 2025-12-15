"use client";

import { Tooltip, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";

export default function TooltipPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Tooltip</h1>
      </div>
      <p className="mb-6 intro-text">
        Show a short hint on hover/focus.
      </p>
      
      
      {/* Basic */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <Tooltip content="This is a tooltip">
            <Button>Hover me</Button>
          </Tooltip>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { Tooltip } from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";

<Tooltip content="This is a tooltip">
  <Button>Hover me</Button>
</Tooltip>`}</CodeBlock>
        </div>
      </div>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">
        {`npx shadcn@latest add https://fragmentui.com/r/tooltip.json`}
      </CodeBlock>

      <Collapsible>
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <p><strong>Intent</strong></p>
          <p>
            <code>Tooltip</code> is a component for displaying contextual information on hover or focus.<br />
            Use it when you need to provide additional context, hints, or descriptions for UI elements without cluttering the interface. Tooltips appear on hover or keyboard focus and automatically hide when the user moves away or focuses elsewhere.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Providing hints or additional context for buttons and icons</li>
            <li>Explaining abbreviations or technical terms</li>
            <li>Showing keyboard shortcuts or tips</li>
            <li>Displaying truncated text in full</li>
            <li>Providing help text for form fields</li>
            <li>Any scenario requiring contextual information on demand</li>
          </ul>

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Tooltip"</code>.
          </p>
          <p>Props:</p>
          <ul>
            <li><code>content</code> – tooltip content text or React node (required)</li>
            <li><code>children</code> – trigger element that shows the tooltip on hover/focus (required)</li>
            <li><code>delayDuration?</code> – delay in milliseconds before showing tooltip (optional, default: <code>500</code>)</li>
            <li><code>side?</code> – tooltip position: <code>"top"</code>, <code>"right"</code>, <code>"bottom"</code>, or <code>"left"</code> (optional)</li>
            <li><code>sideOffset?</code> – offset distance from trigger element in pixels (optional, default: <code>5</code>)</li>
            <li><code>className?</code> – additional CSS classes (optional)</li>
          </ul>

          <p><strong>Example</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Tooltip",
  "props": {
    "content": "This is a tooltip",
    "delayDuration": 500,
    "side": "top"
  },
  "children": {
    "type": "component",
    "component": "Button",
    "props": {
      "variant": "solid"
    },
    "children": "Hover me"
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>

      <h2 id="storybook">Storybook</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/overlay-tooltip--docs">Storybook</StorybookLink>
        </li>
      </ul>


    </DocumentContent>
  );
}

