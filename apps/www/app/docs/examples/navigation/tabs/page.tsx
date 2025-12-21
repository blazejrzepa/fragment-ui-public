"use client";

import { DocLayout } from "../../../../../src/components/doc-layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@fragment_ui/ui";

export default function TabbedInterfaceExample() {
  return (
    <DocLayout>
      <h1 className="text-[length:var(--typography-display-md-size)] font-medium mb-[var(--space-1)]">Tabs</h1>
      <p 
        className="mb-[var(--space-6)] text-[color:var(--foreground-secondary)] font-normal"
        className="mb-[var(--space-6)] intro-text"
      >
        Tabs example demonstrating Fragment UI components and patterns.
      </p>

      <h2>Examples</h2>
      <div className="space-y-8 my-[var(--space-6)]">
        <div>
          <h3 className="text-lg font-semibold mb-2">Default Tabs</h3>
          <Tabs defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3">Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Content 1</TabsContent>
            <TabsContent value="tab2">Content 2</TabsContent>
            <TabsContent value="tab3">Content 3</TabsContent>
          </Tabs>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Pills Variant</h3>
          <Tabs defaultValue="tab1">
            <TabsList variant="pills">
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3">Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Content 1</TabsContent>
            <TabsContent value="tab2">Content 2</TabsContent>
            <TabsContent value="tab3">Content 3</TabsContent>
          </Tabs>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Underline Variant</h3>
          <Tabs defaultValue="tab1">
            <TabsList variant="underline">
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3">Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Content 1</TabsContent>
            <TabsContent value="tab2">Content 2</TabsContent>
            <TabsContent value="tab3">Content 3</TabsContent>
          </Tabs>
        </div>
      </div>
    </DocLayout>
  );
}

