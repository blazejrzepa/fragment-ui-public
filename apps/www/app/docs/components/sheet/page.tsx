"use client";

import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, DocumentContent, CodeBlock, Button, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";

const sheetRightCode = `import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";

export function SheetRightDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open Right Sheet</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="py-[var(--space-4)]">Content goes here</div>
      </SheetContent>
    </Sheet>
  );
}`;

const sheetLeftCode = `import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";

export function SheetLeftDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open Left Sheet</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Side navigation menu</SheetDescription>
        </SheetHeader>
        <div className="py-[var(--space-4)]">Navigation items</div>
      </SheetContent>
    </Sheet>
  );
}`;

export default function SheetPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-[var(--space-4)] mb-[var(--space-1)]">
        <h1 id="sheet">Sheet</h1>
      </div>
      <p className="mb-[var(--space-6)] intro-text">Slide-over panel for focused tasks.</p>
      
      <ExampleSection
        id="sheet-right"
        title="Right Side"
        code={sheetRightCode}
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <Sheet>
            <SheetTrigger asChild>
              <Button>Open Right Sheet</Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Edit Profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </SheetDescription>
              </SheetHeader>
              <div className="py-[var(--space-4)]">Content goes here</div>
            </SheetContent>
          </Sheet>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add sheet`}
      </CodeBlock>

      <ExampleSection
        id="sheet-left"
        title="Left Side"
        code={sheetLeftCode}
        marginTop="mt-[var(--space-8)]"
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <Sheet>
            <SheetTrigger asChild>
              <Button>Open Left Sheet</Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="border-l border-[color:var(--color-border-base)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left"
            >
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>Side navigation menu</SheetDescription>
              </SheetHeader>
              <div className="py-[var(--space-4)]">Navigation items</div>
            </SheetContent>
          </Sheet>
        </div>
      </ExampleSection>

      <h2 id="api-reference">API Reference</h2>
      <div className="mt-[var(--space-4)] border border-[color:var(--color-border-base)] rounded-[var(--radius-lg)] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Component</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Props</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Default</th>
              <th className="text-left py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]" font-semibold>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>Sheet</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>open?, onOpenChange?, className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Root container for sheet component</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>SheetTrigger</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>asChild?, className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Button that opens the sheet</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>SheetContent</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>side?, scrollDetection?, wheelHandling?, scrollableSelector?, className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Sheet panel content</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>SheetHeader</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Header container</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>SheetTitle</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Sheet title (required for accessibility)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>SheetDescription</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Sheet description</td>
            </tr>
            <tr>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>SheetFooter</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Footer container</td>
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
            <code>Sheet</code> is a component for displaying a slide-in panel for secondary workflows. Use it when you need to show additional content, forms, or actions in a side panel that slides in from the edge of the screen. Sheets are similar to dialogs but slide in from a side (top, right, bottom, or left) rather than appearing in the center.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Side navigation menus</li>
            <li>Secondary forms or settings</li>
            <li>Detail views or expanded content</li>
            <li>Filter or search panels</li>
            <li>Any scenario requiring a slide-in panel</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "Sheet"</code> and nested sub-components.
          </p>
          <p><strong>Props:</strong></p>
          <p>Props for <code>Sheet</code>:</p>
          <ul>
            <li><code>open?</code> – boolean. Controlled open state (optional)</li>
            <li><code>onOpenChange?</code> – function. Callback when open state changes: <code>(open: boolean) {'=>'} void</code> (optional)</li>
          </ul>
          <p>Props for <code>SheetContent</code>:</p>
          <ul>
            <li><code>side?</code> – "top" | "right" | "bottom" | "left" (default: "right"). Side from which sheet opens (optional)</li>
            <li><code>scrollDetection?</code> – boolean (default: false). Enable scroll detection (optional)</li>
            <li><code>wheelHandling?</code> – boolean (default: false). Enable wheel handling (optional)</li>
            <li><code>scrollableSelector?</code> – string. CSS selector for scrollable content element (optional)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>
          <p>Other components: <code>SheetTrigger</code>, <code>SheetHeader</code>, <code>SheetTitle</code>, <code>SheetDescription</code>, <code>SheetFooter</code>, <code>SheetClose</code></p>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Sheet",
  "children": [
    {
      "type": "component",
      "component": "SheetTrigger",
      "props": { "asChild": true },
      "children": {
        "type": "component",
        "component": "Button",
        "children": "Open Sheet"
      }
    },
    {
      "type": "component",
      "component": "SheetContent",
      "props": { "side": "right" },
      "children": [
        {
          "type": "component",
          "component": "SheetHeader",
          "children": [
            {
              "type": "component",
              "component": "SheetTitle",
              "children": "Edit Profile"
            },
            {
              "type": "component",
              "component": "SheetDescription",
              "children": "Make changes to your profile here."
            }
          ]
        },
        {
          "type": "element",
          "tag": "div",
          "children": "Content goes here"
        }
      ]
    }
  ]
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
