"use client";

import { DocumentContent, CodeBlock } from "@fragment_ui/ui";

import { CardGrid } from "@fragment_ui/blocks";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";

export default function CardGridPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">Card Grid</h1>
      </div>
      <p className="mb-6 intro-text">
        Display content cards in a responsive grid.
      </p>
      <h2>Overview</h2>
      
      <h2>Install</h2>
      <pre><code>npx shadcn@latest add /r/card-grid.json</code></pre>
      
      <h2>Examples</h2>
      
      {/* Card Grid (3 columns) */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-4xl">
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { CardGrid } from "@fragment_ui/blocks";

// Basic usage with default cards

// With custom cards and columns
<CardGrid
  title="Featured Items"
  columns={3}
  cards={[
    {
      title: "Card 1",
      description: "Description here",
      action: { label: "Learn More", href: "#" }
    },
    {
      title: "Card 2",
      description: "Another description",
      action: { label: "View Details", href: "#" }
    },
    {
      title: "Card 3",
      description: "Third card description",
      action: { label: "Get Started", href: "#" }
    },
  ]}
/>`}</CodeBlock>
        </div>
      </div>
      
      <h2>Features</h2>
      <ul>
        <li>Responsive grid layout (1-4 columns)</li>
        <li>Configurable cards with title, description, and action</li>
        <li>Hover effects and transitions</li>
        <li>Optional title section</li>
        <li>Mobile-first responsive design</li>
        <li>Accessible card structure</li>
      </ul>
      
      <h2>Props</h2>
      <ul>
        <li><code>title</code> - Optional grid title</li>
        <li><code>cards</code> - Array of card objects (defaults to 3 example cards if not provided)</li>
        <li><code>columns</code> - Number of columns: 1, 2, 3, or 4 (default: 3)</li>
      </ul>
      
      <h2>Card Structure</h2>
      <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto"><code>{`interface Card {
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}`}</code></pre>
      
      <h2>Accessibility</h2>
      <p>Cards use semantic HTML and proper heading hierarchy. Action links are keyboard accessible.</p>
      
      <h2>Links</h2>
      <ul>
        <li>
          <StorybookLink>Storybook</StorybookLink>
        </li>
      </ul>


    </DocumentContent>
  );
}

