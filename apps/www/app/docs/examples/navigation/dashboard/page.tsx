"use client";

import { DocLayout } from "../../../../../src/components/doc-layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@fragment_ui/ui";

export default function DashboardNavigationExample() {
  return (
    <DocLayout>
      <h1 className="text-[length:var(--typography-display-md-size)] font-medium mb-[var(--space-1)]">Dashboard</h1>
      <p 
        className="mb-[var(--space-6)] text-[color:var(--foreground-secondary)] font-normal"
        className="mb-[var(--space-6)] intro-text"
      >
        Dashboard example demonstrating Fragment UI components and patterns.
      </p>

      <h2>Example</h2>
      <div className="my-[var(--space-6)]">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview" icon="🏠">
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" icon="📊">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" icon="⚙️">
              Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">Overview content</TabsContent>
          <TabsContent value="analytics">Analytics content</TabsContent>
          <TabsContent value="settings">Settings content</TabsContent>
        </Tabs>
      </div>
    </DocLayout>
  );
}

