"use client";

import { Badge, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock, DocumentContent } from "@fragment_ui/ui";

export default function BadgePage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="badge" className="text-3xl font-medium mb-4">Badge</h1>
      </div>
      <p className="mb-6 intro-text">
        Display a small status or label.
      </p>
      
      
      {/* All Variants */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
            <div className="flex gap-2 items-center justify-center">
              <Badge variant="solid" size="sm">Small</Badge>
              <Badge variant="solid" size="md">Medium</Badge>
              <Badge variant="solid" size="lg">Large</Badge>
            </div>
            <div className="flex gap-2 items-center justify-center">
              <Badge variant="outline" size="sm">Small</Badge>
              <Badge variant="outline" size="md">Medium</Badge>
              <Badge variant="outline" size="lg">Large</Badge>
            </div>
            <div className="flex gap-2 items-center justify-center">
              <Badge variant="subtle" size="sm">Small</Badge>
              <Badge variant="subtle" size="md">Medium</Badge>
              <Badge variant="subtle" size="lg">Large</Badge>
            </div>
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { Badge } from "@fragment_ui/ui";

// Solid variant
<Badge variant="solid" size="sm">Small</Badge>
<Badge variant="solid" size="md">Medium</Badge>
<Badge variant="solid" size="lg">Large</Badge>

// Outline variant
<Badge variant="outline" size="sm">Small</Badge>
<Badge variant="outline" size="md">Medium</Badge>
<Badge variant="outline" size="lg">Large</Badge>

// Subtle variant
<Badge variant="subtle" size="sm">Small</Badge>
<Badge variant="subtle" size="md">Medium</Badge>
<Badge variant="subtle" size="lg">Large</Badge>`}</CodeBlock>
        </div>
      </div>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">{`npx shadcn@latest add https://fragmentui.com/r/badge.json`}</CodeBlock>

      <Collapsible>
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <p><strong>Intent</strong></p>
          <p>
            <code>Badge</code> is a small component for displaying status labels, tags, or categorical information.<br />
            Use it when you need to show status indicators, categories, counts, or short text labels that should stand out from regular text.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Status indicators (active, pending, completed, etc.)</li>
            <li>Category tags and labels</li>
            <li>Notification counts and badges</li>
            <li>Feature flags and version indicators</li>
            <li>Short metadata labels</li>
          </ul>

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Badge"</code>.
          </p>
          <p>Props:</p>
          <ul>
            <li><code>variant?</code> – <code>"solid"</code> (default), <code>"outline"</code>, or <code>"subtle"</code></li>
            <li><code>size?</code> – <code>"sm"</code>, <code>"md"</code>, or <code>"lg"</code> (default: <code>"md"</code>)</li>
            <li><code>children</code> – badge text content (required)</li>
            <li><code>className?</code> – additional CSS classes (optional)</li>
          </ul>

          <p><strong>Example</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Badge",
  "props": {
    "variant": "solid",
    "size": "md"
  },
  "children": "New"
}`}</CodeBlock>
          <p className="mt-6"><strong>With different variants:</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`[
  {
    "type": "component",
    "component": "Badge",
    "props": { "variant": "solid" },
    "children": "Active"
  },
  {
    "type": "component",
    "component": "Badge",
    "props": { "variant": "outline" },
    "children": "Pending"
  },
  {
    "type": "component",
    "component": "Badge",
    "props": { "variant": "subtle" },
    "children": "Draft"
  }
]`}</CodeBlock>
          <p className="mt-6"><strong>With different sizes:</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`[
  {
    "type": "component",
    "component": "Badge",
    "props": { "variant": "solid", "size": "sm" },
    "children": "Small"
  },
  {
    "type": "component",
    "component": "Badge",
    "props": { "variant": "solid", "size": "md" },
    "children": "Medium"
  },
  {
    "type": "component",
    "component": "Badge",
    "props": { "variant": "solid", "size": "lg" },
    "children": "Large"
  }
]`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>

      <h2 id="links">Links</h2>
      <ul>
        <li><StorybookLink path="/docs/core-badge--docs">Storybook</StorybookLink></li>
      </ul>


    </DocumentContent>
  );
}

