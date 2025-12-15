"use client";

import { QuickActions, DocumentContent, CodeBlock } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";

export default function QuickActionsPage() {
  const sampleActions = [
    {
      id: "1",
      label: "New Project",
      icon: "➕",
      description: "Create a new project",
      onClick: () => alert("New project clicked"),
    },
    {
      id: "2",
      label: "Import Data",
      icon: "📥",
      description: "Import data from file",
      onClick: () => alert("Import clicked"),
    },
    {
      id: "3",
      label: "Export Report",
      icon: "📤",
      description: "Export current report",
      onClick: () => alert("Export clicked"),
    },
  ];

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">
          Quick Actions
        </h1>
      </div>
      <p className="mb-6 intro-text">Shortcut actions block for common tasks.</p>
      <h2 id="overview">Overview</h2>
      <p>
        QuickActions provides a flexible way to display action buttons in either a grid or list layout. Supports icons,
        descriptions, links, and custom variants.
      </p>
      
      {/* Grid Layout */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[200px] p-10">
          <div className="w-full max-w-2xl">
            <QuickActions actions={sampleActions} columns={3} />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { QuickActions } from "@fragment_ui/ui";

const actions = [
  { id: "1", label: "New Project", icon: "➕", description: "Create a new project" },
  { id: "2", label: "Import Data", icon: "📥", description: "Import data from file" },
  { id: "3", label: "Export Report", icon: "📤", description: "Export current report" },
];

<QuickActions actions={actions} columns={3} />`}
          </CodeBlock>
        </div>
      </div>

      <h2 id="props">Props</h2>
      <ul>
        <li>
          <code>actions</code> - Array of action objects (required)
        </li>
        <li>
          <code>columns</code> - Number of columns: 2 | 3 | 4 (optional, default: 3)
        </li>
        <li>
          <code>layout</code> - Layout type: "grid" | "list" (optional, default: "grid")
        </li>
        <li>
          <code>className</code> - Additional CSS classes (optional)
        </li>
      </ul>

      <h3>QuickAction</h3>
      <ul>
        <li>
          <code>id</code> - Unique identifier (required)
        </li>
        <li>
          <code>label</code> - Action label (required)
        </li>
        <li>
          <code>icon</code> - Icon element or string (optional)
        </li>
        <li>
          <code>description</code> - Action description (optional)
        </li>
        <li>
          <code>onClick</code> - Click handler (optional)
        </li>
        <li>
          <code>href</code> - Link URL (optional)
        </li>
        <li>
          <code>variant</code> - Button variant: "solid" | "outline" | "ghost" (optional)
        </li>
        <li>
          <code>disabled</code> - Disable action (optional)
        </li>
      </ul>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">
        npx shadcn@latest add /r/quick-actions.json
      </CodeBlock>
      <h2 id="accessibility">Accessibility</h2>
      <p>
        QuickActions uses semantic HTML with proper button and link elements. Actions are keyboard accessible and
        include proper ARIA labels. Compliant with WCAG 2.1.
      </p>

      <h2 id="links">Links</h2>
      <ul>
        <li></li>
      </ul>
    </DocumentContent>
  );
}

