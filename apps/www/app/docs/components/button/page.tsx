"use client";

import { Button, DocumentContent, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";
import { Download, Calendar, ArrowRight, Check } from "lucide-react";

export default function ButtonPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="button" className="text-3xl font-medium mb-4">Button</h1>
      </div>
      <p className="mb-6 intro-text">
        Trigger an action when clicked or tapped.
      </p>
      
      {/* All Variants and Sizes */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2">
              <Button variant="solid" size="sm">Small</Button>
              <Button variant="solid" size="md">Medium</Button>
              <Button variant="solid" size="lg">Large</Button>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="sm">Small</Button>
              <Button variant="outline" size="md">Medium</Button>
              <Button variant="outline" size="lg">Large</Button>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Button variant="ghost" size="sm">Small</Button>
              <Button variant="ghost" size="md">Medium</Button>
              <Button variant="ghost" size="lg">Large</Button>
            </div>
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { Button } from "@fragment_ui/ui";

// All variants and sizes
<Button variant="solid" size="sm">Small</Button>
<Button variant="solid" size="md">Medium</Button>
<Button variant="solid" size="lg">Large</Button>

<Button variant="outline" size="sm">Small</Button>
<Button variant="outline" size="md">Medium</Button>
<Button variant="outline" size="lg">Large</Button>

<Button variant="ghost" size="sm">Small</Button>
<Button variant="ghost" size="md">Medium</Button>
<Button variant="ghost" size="lg">Large</Button>`}</CodeBlock>
        </div>
      </div>

      {/* Variants with Icons */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
            <div className="flex gap-2 flex-wrap justify-center">
              <Button variant="solid" leadingIcon={<Download className="h-4 w-4" />}>Download</Button>
              <Button variant="solid" trailingIcon={<ArrowRight className="h-4 w-4" />}>Continue</Button>
              <Button variant="solid" leadingIcon={<Calendar className="h-4 w-4" />} trailingIcon={<Check className="h-4 w-4" />}>Schedule</Button>
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              <Button variant="outline" leadingIcon={<Download className="h-4 w-4" />}>Download</Button>
              <Button variant="outline" trailingIcon={<ArrowRight className="h-4 w-4" />}>Continue</Button>
              <Button variant="outline" leadingIcon={<Calendar className="h-4 w-4" />} trailingIcon={<Check className="h-4 w-4" />}>Schedule</Button>
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              <Button variant="ghost" leadingIcon={<Download className="h-4 w-4" />}>Download</Button>
              <Button variant="ghost" trailingIcon={<ArrowRight className="h-4 w-4" />}>Continue</Button>
              <Button variant="ghost" leadingIcon={<Calendar className="h-4 w-4" />} trailingIcon={<Check className="h-4 w-4" />}>Schedule</Button>
            </div>
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { Button } from "@fragment_ui/ui";
import { Download, Calendar, ArrowRight, Check } from "lucide-react";

// Solid variant with icons
<Button variant="solid" leadingIcon={<Download className="h-4 w-4" />}>Download</Button>
<Button variant="solid" trailingIcon={<ArrowRight className="h-4 w-4" />}>Continue</Button>
<Button variant="solid" leadingIcon={<Calendar className="h-4 w-4" />} trailingIcon={<Check className="h-4 w-4" />}>Schedule</Button>

// Outline variant with icons
<Button variant="outline" leadingIcon={<Download className="h-4 w-4" />}>Download</Button>
<Button variant="outline" trailingIcon={<ArrowRight className="h-4 w-4" />}>Continue</Button>
<Button variant="outline" leadingIcon={<Calendar className="h-4 w-4" />} trailingIcon={<Check className="h-4 w-4" />}>Schedule</Button>

// Ghost variant with icons
<Button variant="ghost" leadingIcon={<Download className="h-4 w-4" />}>Download</Button>
<Button variant="ghost" trailingIcon={<ArrowRight className="h-4 w-4" />}>Continue</Button>
<Button variant="ghost" leadingIcon={<Calendar className="h-4 w-4" />} trailingIcon={<Check className="h-4 w-4" />}>Schedule</Button>`}</CodeBlock>
        </div>
      </div>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">{`npx shadcn@latest add https://fragmentui.com/r/button.json`}</CodeBlock>

      <Collapsible>
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <p><strong>Intent</strong></p>
          <p>
            <code>Button</code> is a primary interactive component for triggering actions.<br />
            Use it when you need to provide users with clear, actionable controls for submitting forms, navigating, confirming actions, or triggering any user-initiated process.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>Form submissions and primary actions</li>
            <li>Navigation and links styled as buttons</li>
            <li>Confirmation and cancellation actions</li>
            <li>Triggering modals, dialogs, or dropdowns</li>
            <li>Any user-initiated action that requires explicit interaction</li>
          </ul>

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "Button"</code>.
          </p>
          <p>Props:</p>
          <ul>
            <li><code>variant?</code> – <code>"solid"</code> (default), <code>"outline"</code>, or <code>"ghost"</code></li>
            <li><code>size?</code> – <code>"sm"</code>, <code>"md"</code>, or <code>"lg"</code> (default: <code>"md"</code>)</li>
            <li><code>leadingIcon?</code> – icon element displayed before text (optional)</li>
            <li><code>trailingIcon?</code> – icon element displayed after text (optional)</li>
            <li><code>loading?</code> – boolean, shows loading spinner (optional, default: <code>false</code>)</li>
            <li><code>disabled?</code> – boolean, disables the button (optional, default: <code>false</code>)</li>
            <li><code>children</code> – button text content (required)</li>
            <li><code>onClick?</code> – click handler function (optional)</li>
            <li><code>className?</code> – additional CSS classes (optional)</li>
          </ul>

          <p><strong>Example</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Button",
  "props": {
    "variant": "solid",
    "size": "md"
  },
  "children": "Submit"
}`}</CodeBlock>
          <p className="mt-6"><strong>With different variants:</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`[
  {
    "type": "component",
    "component": "Button",
    "props": { "variant": "solid" },
    "children": "Primary Action"
  },
  {
    "type": "component",
    "component": "Button",
    "props": { "variant": "outline" },
    "children": "Secondary Action"
  },
  {
    "type": "component",
    "component": "Button",
    "props": { "variant": "ghost" },
    "children": "Tertiary Action"
  }
]`}</CodeBlock>
          <p className="mt-6"><strong>With icons:</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Button",
  "props": {
    "variant": "solid",
    "leadingIcon": {
      "type": "icon",
      "name": "Download",
      "size": 16
    }
  },
  "children": "Download"
}`}</CodeBlock>
          <p className="mt-6"><strong>With loading state:</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Button",
  "props": {
    "variant": "solid",
    "loading": true,
    "disabled": true
  },
  "children": "Processing..."
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>

      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/core-button--docs">Storybook</StorybookLink>
        </li>
      </ul>


    </DocumentContent>
  );
}

