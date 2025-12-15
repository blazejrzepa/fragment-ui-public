"use client";

import { useState } from "react";
import { TreeView, DocumentContent, CodeBlock, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";

const sampleNodes = [
  { id: "1", label: "Documents", children: [{ id: "1-1", label: "Reports" }, { id: "1-2", label: "Invoices" }] },
  { id: "2", label: "Images", children: [{ id: "2-1", label: "Logos" }, { id: "2-2", label: "Screenshots" }] },
];

export default function TreeViewPage() {
  const [expandedIds, setExpandedIds] = useState<string[]>(["1"]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="page">
          Tree View
        </h1>
      </div>
      <p className="mb-6 intro-text">Hierarchical navigation with expand/collapse.</p>

      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-md">
            <TreeView
              nodes={sampleNodes}
              expandedIds={expandedIds}
              selectedIds={selectedIds}
              onExpansionChange={setExpandedIds}
              onSelectionChange={setSelectedIds}
            />
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">
            {`import { TreeView, TreeNode } from "@fragment_ui/ui";

const nodes: TreeNode[] = [
  { id: "1", label: "Documents", children: [{ id: "1-1", label: "Reports" }] },
  { id: "2", label: "Images", children: [{ id: "2-1", label: "Logos" }] },
];

<TreeView
  nodes={nodes}
  expandedIds={["1"]}
  selectedIds={[]}
  onExpansionChange={setExpandedIds}
  onSelectionChange={setSelectedIds}
/>`}
          </CodeBlock>
        </div>
      </div>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">
        {`npx shadcn@latest add https://fragmentui.com/r/tree-view.json`}
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
            <code>TreeView</code> is a component for displaying hierarchical data structures with expand/collapse functionality.<br />
            Use it when you need to show nested data like file systems, navigation menus, category trees, or any hierarchical information. The component supports selection, checkboxes, icons, and custom node actions.
          </p>

          <p><strong>When to use</strong></p>
          <ul>
            <li>File explorers and directory structures</li>
            <li>Navigation menus with nested items</li>
            <li>Category trees and taxonomies</li>
            <li>Organizational charts</li>
            <li>Any hierarchical data display</li>
          </ul>

          <p><strong>UI-DSL usage</strong></p>
          <p>
            Use <code>type: "component"</code> with <code>component: "TreeView"</code>.
          </p>
          <p>Props:</p>
          <ul>
            <li><code>nodes</code> – array of TreeNode objects representing the tree structure (required)</li>
            <li><code>selectedIds?</code> – array of selected node IDs (optional)</li>
            <li><code>expandedIds?</code> – array of expanded node IDs (optional)</li>
            <li><code>onSelectionChange?</code> – callback when selection changes, receives array of selected IDs (optional)</li>
            <li><code>onExpansionChange?</code> – callback when expansion changes, receives array of expanded IDs (optional)</li>
            <li><code>showCheckboxes?</code> – show checkboxes for selection (optional, default: <code>false</code>)</li>
            <li><code>showIcons?</code> – show default folder/file icons (optional, default: <code>true</code>)</li>
            <li><code>onNodeClick?</code> – callback when a node is clicked (optional)</li>
            <li><code>onNodeDoubleClick?</code> – callback when a node is double-clicked (optional)</li>
            <li><code>indentSize?</code> – pixel indentation per level (optional, default: <code>20</code>)</li>
            <li><code>className?</code> – additional CSS classes (optional)</li>
          </ul>

          <p><strong>TreeNode structure</strong></p>
          <ul>
            <li><code>id</code> – unique identifier (required)</li>
            <li><code>label</code> – node label text or React node (required)</li>
            <li><code>children?</code> – array of child TreeNode objects (optional)</li>
            <li><code>icon?</code> – custom icon or function returning icon (optional)</li>
            <li><code>disabled?</code> – disable node interaction (optional)</li>
            <li><code>alwaysExpanded?</code> – keep node always expanded (optional)</li>
            <li><code>hideChevron?</code> – hide expand/collapse chevron (optional)</li>
          </ul>

          <p><strong>Example</strong></p>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "TreeView",
  "props": {
    "nodes": [
      {
        "id": "1",
        "label": "Documents",
        "children": [
          { "id": "1-1", "label": "Reports" },
          { "id": "1-2", "label": "Invoices" }
        ]
      },
      {
        "id": "2",
        "label": "Images",
        "children": [
          { "id": "2-1", "label": "Logos" }
        ]
      }
    ],
    "expandedIds": ["1"],
    "selectedIds": [],
    "showIcons": true
  }
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>

      <h2 id="links">Links</h2>
      <ul>
        <li>
          <StorybookLink path="/docs/core-tree-view--docs">Storybook</StorybookLink>
        </li>
      </ul>
    </DocumentContent>
  );
}

