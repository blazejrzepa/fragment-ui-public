"use client";

import { QuickActions, DocumentContent, CodeBlock, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";

const quickActionsCode = `import { QuickActions } from "@fragment_ui/ui";

const actions = [
  { 
    id: "1", 
    label: "New Project", 
    icon: "➕", 
    description: "Create a new project",
    onClick: () => console.log("New project clicked")
  },
  { 
    id: "2", 
    label: "Import Data", 
    icon: "📥", 
    description: "Import data from file",
    onClick: () => console.log("Import clicked")
  },
  { 
    id: "3", 
    label: "Export Report", 
    icon: "📤", 
    description: "Export current report",
    onClick: () => console.log("Export clicked")
  },
];

export function QuickActionsDemo() {
  return (
    <QuickActions actions={actions} columns={3} />
  );
}`;

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
        <h1 id="quick-actions">Quick Actions</h1>
      </div>
      <p className="mb-6 intro-text">Surface one-click shortcuts to key tasks.</p>
      
      <ExampleSection
        id="quick-actions-example"
        title="Example"
        code={quickActionsCode}
      >
        <div className="flex gap-2 items-center justify-center w-full">
          <div className="w-full max-w-2xl">
            <QuickActions actions={sampleActions} columns={3} />
          </div>
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
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>QuickActions</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]"><code>actions, columns?, layout?, className?</code></td>
              <td className="py-[var(--space-2)] px-[var(--space-4)]">—</td>
              <td className="py-[var(--space-2)] px-[var(--space-4)] text-[length:var(--typography-size-sm)]">Component for displaying shortcut actions in grid or list layout</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add quick-actions`}
      </CodeBlock>

      <Collapsible className="mt-[var(--space-8)]">
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation" className="m-0">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-[var(--space-4)]">
          <h3>Intent</h3>
          <p>
            <code>QuickActions</code> is a component for displaying shortcut actions for common tasks. Use it when you need to provide quick access to frequently used actions in a grid or list layout. The component supports icons, descriptions, links, and custom variants.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Dashboard action panels</li>
            <li>Quick access toolbars</li>
            <li>Common task shortcuts</li>
            <li>Action grids in applications</li>
            <li>Any scenario requiring quick action access</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "QuickActions"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>actions</code> – QuickAction[]. Array of action objects (required)</li>
            <li><code>columns?</code> – 2 | 3 | 4 (default: 3). Number of columns in grid layout (optional)</li>
            <li><code>layout?</code> – "grid" | "list" (default: "grid"). Layout type (optional)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>
          <p>Each action object (QuickAction) should include:</p>
          <ul>
            <li><code>id</code> – string. Unique identifier (required)</li>
            <li><code>label</code> – string. Action label (required)</li>
            <li><code>icon?</code> – ReactNode. Icon element or string (optional)</li>
            <li><code>description?</code> – string. Action description (optional)</li>
            <li><code>onClick?</code> – function. Click handler: <code>() {'=>'} void</code> (optional)</li>
            <li><code>href?</code> – string. Link URL (optional)</li>
            <li><code>variant?</code> – "solid" | "outline" | "ghost". Button variant (optional)</li>
            <li><code>disabled?</code> – boolean. Disable the action (optional)</li>
          </ul>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "QuickActions",
  "props": {
    "actions": [
      {
        "id": "new-project",
        "label": "New Project",
        "icon": "➕",
        "description": "Create a new project",
        "onClick": "handleNewProject"
      },
      {
        "id": "import-data",
        "label": "Import Data",
        "icon": "📥",
        "description": "Import data from file",
        "onClick": "handleImport"
      }
    ],
    "columns": 3,
    "layout": "grid"
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
