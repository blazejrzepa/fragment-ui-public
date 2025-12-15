"use client";

import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, DocumentContent } from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";

export default function SheetPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Sheet</h1>
      </div>
      <p className="mb-6 intro-text">
        Slide-in panel for secondary workflows.
      </p>
      
      
      {/* Right Side */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
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
              <div className="py-4">Content goes here</div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";

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
    <div className="py-4">Content goes here</div>
  </SheetContent>
</Sheet>`}</CodeBlock>
        </div>
      </div>

      {/* Left Side */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
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
              <div className="py-4">Navigation items</div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";

<Sheet>
  <SheetTrigger asChild>
    <Button>Open Left Sheet</Button>
  </SheetTrigger>
  <SheetContent side="left">
    <SheetHeader>
      <SheetTitle>Navigation</SheetTitle>
      <SheetDescription>Side navigation menu</SheetDescription>
    </SheetHeader>
    <div className="py-4">Navigation items</div>
  </SheetContent>
</Sheet>`}</CodeBlock>
        </div>
      </div>

      <h2 id="props">Props</h2>
      <ul>
        <li>
          <code>side</code> - Side from which sheet opens: "top", "right",
          "bottom", "left" (default: "right")
        </li>
        <li>
          <code>open</code> - Controlled open state
        </li>
        <li>
          <code>onOpenChange</code> - Callback when open state changes
        </li>
      </ul>

      
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">npx shadcn@latest add /r/sheet.json</CodeBlock>
      <h2 id="accessibility">Accessibility</h2>
      <p>
        Sheet includes proper focus management, ARIA attributes, and keyboard
        handling (ESC to close). It prevents interaction with the rest of the
        page when open. Compliant with WAI-ARIA dialog pattern.
      </p>

      <h2 id="links">Links</h2>
      <ul>
        <li>
        </li>
      </ul>


    </DocumentContent>
  );
}


