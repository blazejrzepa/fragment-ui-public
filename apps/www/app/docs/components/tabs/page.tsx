"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent, DocumentContent, CodeBlock, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@fragment_ui/ui";
import { ExampleSection } from "../../../../src/components/example-section";

const tabsCode = `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@fragment_ui/ui";

export function TabsDemo() {
  return (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content for tab 1</TabsContent>
      <TabsContent value="tab2">Content for tab 2</TabsContent>
      <TabsContent value="tab3">Content for tab 3</TabsContent>
    </Tabs>
  );
}`;

const tabsPillsCode = `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@fragment_ui/ui";

export function TabsPillsDemo() {
  return (
    <Tabs defaultValue="tab1">
      <TabsList variant="pills">
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content for tab 1</TabsContent>
      <TabsContent value="tab2">Content for tab 2</TabsContent>
      <TabsContent value="tab3">Content for tab 3</TabsContent>
    </Tabs>
  );
}`;

const tabsIconsCode = `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@fragment_ui/ui";

export function TabsIconsDemo() {
  return (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1" icon="📊">Overview</TabsTrigger>
        <TabsTrigger value="tab2" icon="⚙️">Settings</TabsTrigger>
        <TabsTrigger value="tab3" icon="🔒">Security</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Overview content</TabsContent>
      <TabsContent value="tab2">Settings content</TabsContent>
      <TabsContent value="tab3">Security content</TabsContent>
    </Tabs>
  );
}`;

export default function TabsPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-[var(--space-4)] mb-[var(--space-1)]">
        <h1 id="tabs">Tabs</h1>
      </div>
      <p className="mb-[var(--space-6)] intro-text">Switch between related content views.</p>
      
      <ExampleSection
        id="tabs-example"
        title="Example"
        code={tabsCode}
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <div className="w-full max-w-md">
            <Tabs defaultValue="tab1" className="w-full">
              <TabsList>
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">Content for tab 1</TabsContent>
              <TabsContent value="tab2">Content for tab 2</TabsContent>
              <TabsContent value="tab3">Content for tab 3</TabsContent>
            </Tabs>
          </div>
        </div>
      </ExampleSection>

      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code" showLineNumbers={false} showCopyButton={false}>
        {`npx fragmentui@latest add tabs`}
      </CodeBlock>

      <ExampleSection
        id="tabs-pills"
        title="Pills Variant"
        code={tabsPillsCode}
        marginTop="mt-[var(--space-8)]"
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <div className="w-full max-w-md">
            <Tabs defaultValue="tab1" className="w-full">
              <TabsList variant="pills">
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">Content for tab 1</TabsContent>
              <TabsContent value="tab2">Content for tab 2</TabsContent>
              <TabsContent value="tab3">Content for tab 3</TabsContent>
            </Tabs>
          </div>
        </div>
      </ExampleSection>

      <ExampleSection
        id="tabs-icons"
        title="With Icons"
        code={tabsIconsCode}
        marginTop="mt-[var(--space-8)]"
      >
        <div className="flex gap-[var(--space-2)] items-center justify-center w-full">
          <div className="w-full max-w-md">
            <Tabs defaultValue="tab1" className="w-full">
              <TabsList>
                <TabsTrigger value="tab1" icon="📊">Overview</TabsTrigger>
                <TabsTrigger value="tab2" icon="⚙️">Settings</TabsTrigger>
                <TabsTrigger value="tab3" icon="🔒">Security</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">Overview content</TabsContent>
              <TabsContent value="tab2">Settings content</TabsContent>
              <TabsContent value="tab3">Security content</TabsContent>
            </Tabs>
          </div>
        </div>
      </ExampleSection>

      <h2 id="api-reference">API Reference</h2>
      <div className="mt-4 border border-[color:var(--color-border-base)] rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--color-border-base)]">
              <th className="text-left py-2 px-4 font-semibold text-sm">Component</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Props</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Default</th>
              <th className="text-left py-2 px-4 font-semibold text-sm">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4"><code>Tabs</code></td>
              <td className="py-2 px-4"><code>defaultValue, value?, onValueChange?, className?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Root container for tabs component</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>TabsList</code></td>
              <td className="py-2 px-4"><code>variant?, orientation?, className?</code></td>
              <td className="py-2 px-4">variant: "default", orientation: "horizontal"</td>
              <td className="py-2 px-4 text-sm">Container for tab triggers</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>TabsTrigger</code></td>
              <td className="py-2 px-4"><code>value, icon?, badge?, iconOnly?, className?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Individual tab button</td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code>TabsContent</code></td>
              <td className="py-2 px-4"><code>value, className?</code></td>
              <td className="py-2 px-4">—</td>
              <td className="py-2 px-4 text-sm">Content panel for each tab</td>
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
            <code>Tabs</code> is a component for switching between related panels of content. Use it when you need to organize content into multiple sections that users can switch between. The component supports different visual variants (default, pills, underline, boxed) and is fully accessible.
          </p>

          <h3>When to use</h3>
          <ul>
            <li>Organizing content into sections</li>
            <li>Settings or configuration panels</li>
            <li>Product details or documentation</li>
            <li>Dashboard views with multiple views</li>
            <li>Any scenario requiring tabbed navigation</li>
          </ul>

          <h3>UI-DSL Usage</h3>
          <p>
            Use <code>type: "component"</code> with <code>component: "Tabs"</code> and nested sub-components.
          </p>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>Tabs</code> – Root container (required):
              <ul>
                <li><code>defaultValue</code> – string. Default active tab value (required)</li>
                <li><code>value?</code> – string. Controlled active tab value (optional)</li>
                <li><code>onValueChange?</code> – function. Callback when tab changes: <code>(value: string) {'=>'} void</code> (optional)</li>
              </ul>
            </li>
            <li><code>TabsList</code> – Container for tab triggers (required):
              <ul>
                <li><code>variant?</code> – string. Variant: "default" | "pills" | "underline" | "boxed" (optional, default: "default")</li>
                <li><code>orientation?</code> – string. Orientation: "horizontal" | "vertical" (optional, default: "horizontal")</li>
              </ul>
            </li>
            <li><code>TabsTrigger</code> – Individual tab button (required):
              <ul>
                <li><code>value</code> – string. Tab value (required)</li>
                <li><code>icon?</code> – ReactNode. Icon element (optional)</li>
                <li><code>badge?</code> – ReactNode. Badge element (optional)</li>
                <li><code>iconOnly?</code> – boolean. Show only icon (optional)</li>
              </ul>
            </li>
            <li><code>TabsContent</code> – Content panel for each tab (required):
              <ul>
                <li><code>value</code> – string. Tab value (required)</li>
              </ul>
            </li>
          </ul>

          <h3>Example</h3>
          <CodeBlock language="json" highlightApiUrl="/api/highlight-code">{`{
  "type": "component",
  "component": "Tabs",
  "props": { "defaultValue": "tab1" },
  "children": [
    {
      "type": "component",
      "component": "TabsList",
      "children": [
        {
          "type": "component",
          "component": "TabsTrigger",
          "props": { "value": "tab1" },
          "children": "Tab 1"
        },
        {
          "type": "component",
          "component": "TabsTrigger",
          "props": { "value": "tab2" },
          "children": "Tab 2"
        }
      ]
    },
    {
      "type": "component",
      "component": "TabsContent",
      "props": { "value": "tab1" },
      "children": "Content for tab 1"
    },
    {
      "type": "component",
      "component": "TabsContent",
      "props": { "value": "tab2" },
      "children": "Content for tab 2"
    }
  ]
}`}</CodeBlock>
        </CollapsibleContent>
      </Collapsible>
    </DocumentContent>
  );
}
