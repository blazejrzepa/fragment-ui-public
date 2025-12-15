"use client";

import { EmptyState } from "@fragment_ui/blocks";
import { CodeBlock, DocumentContent } from "@fragment_ui/ui";
import { Inbox, Search, FileX } from "lucide-react";

export default function EmptyStatePage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium" id="page">EmptyState</h1>
      </div>
      <p className="mb-6 intro-text">
        Friendly placeholder when there's no data.
      </p>
      
      <h2 id="overview">Overview</h2>
      <p>
        EmptyState is a flexible block for handling empty states across your application. It provides
        a consistent way to communicate when there's no data to display, with options for icons,
        messages, and call-to-action buttons.
      </p>
      
      
      {/* Basic Empty State */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-md border rounded-lg">
            <EmptyState
              title="No items found"
              description="Get started by creating your first item."
            />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { EmptyState } from "@fragment_ui/blocks";

<EmptyState
  title="No items found"
  description="Get started by creating your first item."
/>`}</CodeBlock>
        </div>
      </div>
      
      <div className="space-y-6 my-6">

        <div>
          <h3 className="text-lg font-semibold mb-2">With Action Button</h3>
          <div className="border rounded-lg">
            <EmptyState
              title="No items found"
              description="Get started by creating your first item."
              action={{
                label: "Create Item",
                onClick: () => alert("Create clicked"),
              }}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">With Primary and Secondary Actions</h3>
          <div className="border rounded-lg">
            <EmptyState
              title="No results found"
              description="Try adjusting your search criteria or filters."
              action={{
                label: "Clear Filters",
                onClick: () => alert("Clear filters"),
                variant: "solid",
              }}
              secondaryAction={{
                label: "Learn More",
                onClick: () => alert("Learn more"),
                variant: "outline",
              }}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Small Size</h3>
          <div className="border rounded-lg">
            <EmptyState
              title="No files"
              description="Upload your first file to get started."
              size="sm"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Large Size</h3>
          <div className="border rounded-lg">
            <EmptyState
              title="No items found"
              description="This section is empty. Start by adding your first item to see it here."
              size="lg"
            />
          </div>
        </div>
      </div>
      
      
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">npx shadcn@latest add /r/empty-state.json</CodeBlock>
      <h2 id="code-examples">Code Examples</h2>
      <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { EmptyState } from "@fragment_ui/blocks";
import { Inbox } from "lucide-react";

// Basic usage
<EmptyState
  title="No items found"
  description="Get started by creating your first item."

// With action button
<EmptyState
  title="No items found"
  description="Get started by creating your first item."
  action={{
    label: "Create Item",
    onClick: () => handleCreate(),
  }}

// With primary and secondary actions
<EmptyState
  title="No results found"
  description="Try adjusting your search criteria."
  action={{
    label: "Clear Filters",
    onClick: () => clearFilters(),
    variant: "solid",
  }}
  secondaryAction={{
    label: "Learn More",
    onClick: () => showHelp(),
    variant: "outline",
  }}

// Different sizes
<EmptyState
  title="No items"
  size="sm" // or "md" (default) or "lg"

// In a table or list
{items.length === 0 ? (
  <EmptyState
    title="No items"
    action={{ label: "Add Item", onClick: handleAdd }}
) : (
)}`}</CodeBlock>
      
      <h2 id="props">Props</h2>
      <ul>
        <li><code>icon</code> - Icon or illustration to display (optional)</li>
        <li><code>title</code> - Main title/heading (default: "No items found")</li>
        <li><code>description</code> - Description text (optional)</li>
        <li><code>action</code> - Primary action button (optional)</li>
        <li><code>secondaryAction</code> - Secondary action button (optional)</li>
        <li><code>size</code> - Size variant: "sm" | "md" | "lg" (default: "md")</li>
        <li><code>className</code> - Additional className for container (optional)</li>
      </ul>

      <h3 id="action-props">Action Object</h3>
      <ul>
        <li><code>label</code> - Button label (required)</li>
        <li><code>onClick</code> - Click handler (required)</li>
        <li><code>variant</code> - Button variant: "solid" | "outline" | "ghost" (default: "solid" for primary, "outline" for secondary)</li>
      </ul>
      
      <h2 id="features">Features</h2>
      <ul>
        <li>Flexible icon support (React nodes)</li>
        <li>Customizable title and description</li>
        <li>Primary and secondary action buttons</li>
        <li>Three size variants (sm, md, lg)</li>
        <li>Centered layout</li>
        <li>Responsive design</li>
        <li>Fully accessible</li>
      </ul>
      
      <h2 id="use-cases">Use Cases</h2>
      <ul>
        <li>Empty lists or tables</li>
        <li>No search results</li>
        <li>Empty collections</li>
        <li>First-time user experiences</li>
        <li>Error states (when appropriate)</li>
        <li>Onboarding flows</li>
      </ul>
      
      <h2 id="accessibility">Accessibility</h2>
      <p>
        EmptyState uses semantic HTML and proper heading hierarchy. Action buttons are keyboard accessible
        and support focus states. Icons should have appropriate alt text or aria-labels when used.
      </p>

    </DocumentContent>
  );
}

