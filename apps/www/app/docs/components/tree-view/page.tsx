"use client";

import { useState } from "react";
import { TreeView, DocumentContent, CodeBlock, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";

const treeViewCode = `import { TreeView } from "@fragment_ui/ui";
import { useState } from "react";

const nodes = [
  { id: "1", label: "Documents", children: [{ id: "1-1", label: "Reports" }, { id: "1-2", label: "Invoices" }] },
  { id: "2", label: "Images", children: [{ id: "2-1", label: "Logos" }, { id: "2-2", label: "Screenshots" }] },
];

const [expandedIds, setExpandedIds] = useState<string[]>(["1"]);
const [selectedIds, setSelectedIds] = useState<string[]>([]);

<TreeView
  nodes={nodes}
  expandedIds={expandedIds}
  selectedIds={selectedIds}
  onExpansionChange={setExpandedIds}
  onSelectionChange={setSelectedIds}
/>`;

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
        <h1 id="tree-view">Tree View</h1>
      </div>
      <p className="mb-6 intro-text">Explore hierarchical data with expandable nodes.</p>

      <ExampleSection
        id="tree-view-example"
        title="Example"
        code={treeViewCode}
      >
        <div className="flex gap-2 items-center justify-center w-full">
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
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add tree-view`}
      </CodeBlock>

      <h2 id="api-reference">API Reference</h2>
      <div className="mt-4 border border-[color:var(--color-border-base)] rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-2 px-4 font-semibold text-sm">Prop</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Type</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Default</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4"><code>nodes?</code></td>
              <td className="py-2 px-4"><code>TreeNode[]</code></td>
              <td className="py-2 px-4">[]</td>
              <td className="py-2 px-4 text-sm">Array of TreeNode objects representing the tree structure (optional)</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>selectedIds?</code></td>
              <td className="py-2 px-4"><code>string[]</code></td>
              <td className="py-2 px-4">[]</td>
              <td className="py-2 px-4 text-sm">Array of selected node IDs (optional)</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>expandedIds?</code></td>
              <td className="py-2 px-4"><code>string[]</code></td>
              <td className="py-2 px-4">[]</td>
              <td className="py-2 px-4 text-sm">Array of expanded node IDs (optional)</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>onSelectionChange?</code></td>
              <td className="py-2 px-4"><code>(selectedIds: string[]) {'=>'} void</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Callback when selection changes (optional)</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>onExpansionChange?</code></td>
              <td className="py-2 px-4"><code>(expandedIds: string[]) {'=>'} void</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Callback when expansion changes (optional)</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>showCheckboxes?</code></td>
              <td className="py-2 px-4"><code>boolean</code></td>
              <td className="py-2 px-4">false</td>
              <td className="py-2 px-4 text-sm">Show checkboxes for selection (optional)</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>showIcons?</code></td>
              <td className="py-2 px-4"><code>boolean</code></td>
              <td className="py-2 px-4">true</td>
              <td className="py-2 px-4 text-sm">Show default folder/file icons (optional)</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>defaultExpanded?</code></td>
              <td className="py-2 px-4"><code>boolean</code></td>
              <td className="py-2 px-4">false</td>
              <td className="py-2 px-4 text-sm">Expand all nodes by default (optional)</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>onNodeClick?</code></td>
              <td className="py-2 px-4"><code>(node: TreeNode) {'=>'} void</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Callback when a node is clicked (optional)</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>onNodeDoubleClick?</code></td>
              <td className="py-2 px-4"><code>(node: TreeNode) {'=>'} void</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Callback when a node is double-clicked (optional)</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>renderNodeActions?</code></td>
              <td className="py-2 px-4"><code>(node: TreeNode) {'=>'} ReactNode</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Function to render custom actions for each node (optional)</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>indentSize?</code></td>
              <td className="py-2 px-4"><code>number</code></td>
              <td className="py-2 px-4">20</td>
              <td className="py-2 px-4 text-sm">Pixel indentation per level (optional)</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>className?</code></td>
              <td className="py-2 px-4"><code>string</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Additional CSS classes (optional)</td>
            </tr>
          </tbody>
        </table>
        <div className="p-4 border-t border-[color:var(--color-border-base)]">
          <p className="text-sm font-semibold mb-2">TreeNode interface:</p>
          <ul className="text-sm space-y-1">
            <li><code>id</code> – string. Unique identifier (required)</li>
            <li><code>label</code> – string | ReactNode. Node label text or React node (required)</li>
            <li><code>children?</code> – TreeNode[]. Array of child TreeNode objects (optional)</li>
            <li><code>icon?</code> – ReactNode | function. Custom icon or function returning icon: <code>(isSelected: boolean) {'=>'} ReactNode</code> (optional)</li>
            <li><code>disabled?</code> – boolean. Disable node interaction (optional)</li>
            <li><code>alwaysExpanded?</code> – boolean. Keep node always expanded (optional)</li>
            <li><code>hideChevron?</code> – boolean. Hide expand/collapse chevron (optional)</li>
            <li><code>data?</code> – object. Additional data for drag & drop, context menu, etc. (optional)</li>
            <li><code>className?</code> – string. Additional CSS classes for the node (optional)</li>
          </ul>
        </div>
      </div>

      <Collapsible className="mt-8">
        <CollapsibleTrigger className="w-full text-left">
          <h2 id="for-ai-automation" className="m-0">
            Agents & Copilots
          </h2>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <h3>Intent</h3>
          <p>
            <code>TreeView</code> is a component for displaying hierarchical data structures with expand/collapse functionality. Use it when you need to show nested data like file systems, navigation menus, category trees, or any hierarchical information. The component supports selection, checkboxes, icons, and custom node actions.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>File explorers and directory structures</li>
            <li>Navigation menus with nested items</li>
            <li>Category trees and taxonomies</li>
            <li>Organizational charts</li>
            <li>Any hierarchical data display</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "TreeView"</code>.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>nodes?</code> – array. Array of TreeNode objects representing the tree structure (optional, default: [])</li>
            <li><code>selectedIds?</code> – array. Array of selected node IDs (optional, default: [])</li>
            <li><code>expandedIds?</code> – array. Array of expanded node IDs (optional, default: [])</li>
            <li><code>onSelectionChange?</code> – function. Callback when selection changes: <code>(selectedIds: string[]) {'=>'} void</code> (optional)</li>
            <li><code>onExpansionChange?</code> – function. Callback when expansion changes: <code>(expandedIds: string[]) {'=>'} void</code> (optional)</li>
            <li><code>showCheckboxes?</code> – boolean. Show checkboxes for selection (optional, default: false)</li>
            <li><code>showIcons?</code> – boolean. Show default folder/file icons (optional, default: true)</li>
            <li><code>defaultExpanded?</code> – boolean. Expand all nodes by default (optional, default: false)</li>
            <li><code>onNodeClick?</code> – function. Callback when a node is clicked: <code>(node: TreeNode) {'=>'} void</code> (optional)</li>
            <li><code>onNodeDoubleClick?</code> – function. Callback when a node is double-clicked: <code>(node: TreeNode) {'=>'} void</code> (optional)</li>
            <li><code>renderNodeActions?</code> – function. Function to render custom actions: <code>(node: TreeNode) {'=>'} ReactNode</code> (optional)</li>
            <li><code>indentSize?</code> – number. Pixel indentation per level (optional, default: 20)</li>
            <li><code>className?</code> – string. Additional CSS classes (optional)</li>
          </ul>
          <p><strong>TreeNode structure:</strong></p>
          <ul>
            <li><code>id</code> – string. Unique identifier (required)</li>
            <li><code>label</code> – string | ReactNode. Node label text or React node (required)</li>
            <li><code>children?</code> – TreeNode[]. Array of child TreeNode objects (optional)</li>
            <li><code>icon?</code> – ReactNode | function. Custom icon or function returning icon (optional)</li>
            <li><code>disabled?</code> – boolean. Disable node interaction (optional)</li>
            <li><code>alwaysExpanded?</code> – boolean. Keep node always expanded (optional)</li>
            <li><code>hideChevron?</code> – boolean. Hide expand/collapse chevron (optional)</li>
          </ul>

          <h3>Example</h3>
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
    </DocumentContent>
  );
}
