"use client";

import { Toaster, toast, Button, DocumentContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";

export default function ToastPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Toast</h1>
      </div>
      <p className="mb-6 intro-text">
        Show a brief, non-blocking message.
      </p>
      <h2>Overview</h2>

      <h2>Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">npx shadcn@latest add /r/toast.json</CodeBlock>

      
      {/* Basic Toast Types */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => toast.success("Operation successful!")}>Success</Button>
            <Button onClick={() => toast.error("Something went wrong")}>Error</Button>
            <Button onClick={() => toast.info("Here's some information")}>Info</Button>
            <Button onClick={() => toast.warning("Please be careful")}>Warning</Button>
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { toast, Button } from "@fragment_ui/ui";

<div className="flex gap-2">
  <Button onClick={() => toast.success("Operation successful!")}>Success</Button>
  <Button onClick={() => toast.error("Something went wrong")}>Error</Button>
  <Button onClick={() => toast.info("Here's some information")}>Info</Button>
  <Button onClick={() => toast.warning("Please be careful")}>Warning</Button>
</div>`}</CodeBlock>
        </div>
      </div>

      {/* With Action Buttons */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() =>
                toast.success("File uploaded successfully!", {
                  action: {
                    label: "View",
                    onClick: () => console.log("View file"),
                  },
                })
              }
            >
              Success with Action
            </Button>
            <Button
              onClick={() =>
                toast.error("Failed to save changes", {
                  action: {
                    label: "Retry",
                    onClick: () => console.log("Retry"),
                  },
                  cancel: {
                    label: "Dismiss",
                    onClick: () => console.log("Dismissed"),
                  },
                })
              }
            >
              Error with Actions
            </Button>
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { toast, Button } from "@fragment_ui/ui";

<Button
  onClick={() =>
    toast.success("File uploaded successfully!", {
      action: {
        label: "View",
        onClick: () => console.log("View file"),
      },
    })
  }
>
  Success with Action
</Button>

<Button
  onClick={() =>
    toast.error("Failed to save changes", {
      action: {
        label: "Retry",
        onClick: () => console.log("Retry"),
      },
      cancel: {
        label: "Dismiss",
        onClick: () => console.log("Dismissed"),
      },
    })
  }
>
  Error with Actions
</Button>`}</CodeBlock>
        </div>
      </div>

      <h2>Accessibility</h2>
      <p>
        Toast uses sonner, which automatically manages ARIA live regions and is accessible to screen
        readers. Action buttons include proper alt text support for accessibility.
      </p>

      <h2>Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/core-toast--docs">Storybook</StorybookLink>
        </li>
      </ul>


    </DocumentContent>
  );
}

