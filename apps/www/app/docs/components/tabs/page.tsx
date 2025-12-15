"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent, DocumentContent } from "@fragment_ui/ui";
import { StorybookLinkWrapper as StorybookLink } from "../../../../src/components/storybook-link-wrapper";
import { CodeBlock } from "@fragment_ui/ui";

export default function TabsPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium mb-4" id="tabs">Tabs</h1>
      </div>
      <p className="mb-6 intro-text">
        Switch between related panels of content.
      </p>
      
      
      {/* Default Tabs */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <Tabs defaultValue="tab1" className="w-full max-w-md">
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
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { Tabs, TabsList, TabsTrigger, TabsContent } from "@fragment_ui/ui";

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
    <TabsTrigger value="tab3">Tab 3</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content for tab 1</TabsContent>
  <TabsContent value="tab2">Content for tab 2</TabsContent>
  <TabsContent value="tab3">Content for tab 3</TabsContent>
</Tabs>`}</CodeBlock>
        </div>
      </div>

      {/* Pills Variant */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <Tabs defaultValue="tab1" className="w-full max-w-md">
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
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { Tabs, TabsList, TabsTrigger, TabsContent } from "@fragment_ui/ui";

<Tabs defaultValue="tab1">
  <TabsList variant="pills">
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
    <TabsTrigger value="tab3">Tab 3</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content for tab 1</TabsContent>
  <TabsContent value="tab2">Content for tab 2</TabsContent>
  <TabsContent value="tab3">Content for tab 3</TabsContent>
</Tabs>`}</CodeBlock>
        </div>
      </div>

      {/* With Icons */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <Tabs defaultValue="tab1" className="w-full max-w-md">
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
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { Tabs, TabsList, TabsTrigger, TabsContent } from "@fragment_ui/ui";

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1" icon="📊">Overview</TabsTrigger>
    <TabsTrigger value="tab2" icon="⚙️">Settings</TabsTrigger>
    <TabsTrigger value="tab3" icon="🔒">Security</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Overview content</TabsContent>
  <TabsContent value="tab2">Settings content</TabsContent>
  <TabsContent value="tab3">Security content</TabsContent>
</Tabs>`}</CodeBlock>
        </div>
      </div>

      <h2 id="props">Props</h2>
      <h3>TabsList</h3>
      <ul>
        <li>
          <code>variant</code> - "default" | "pills" | "underline" | "boxed" (optional)
        </li>
        <li>
          <code>orientation</code> - "horizontal" | "vertical" (optional, default: "horizontal")
        </li>
      </ul>
      <h3>TabsTrigger</h3>
      <ul>
        <li>
          <code>variant</code> - Override variant from TabsList (optional)
        </li>
        <li>
          <code>icon</code> - React node for icon (optional)
        </li>
        <li>
          <code>badge</code> - React node for badge (optional)
        </li>
      </ul>

      
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">npx shadcn@latest add /r/tabs.json</CodeBlock>
      <h2 id="accessibility">Accessibility</h2>
      <p>
        Tabs support keyboard navigation (arrow keys), ARIA attributes, and are
        compliant with WAI-ARIA tabs pattern. All variants maintain full
        accessibility.
      </p>

      <h2 id="links">Links</h2>
      <ul>
        <li>
        </li>
      </ul>


    </DocumentContent>
  );
}
