"use client";

import { DocLayout } from "../../../../../src/components/doc-layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@fragment_ui/ui";

export default function DashboardNavigationExample() {
  return (
    <DocLayout>
      <h1 className="text-3xl font-medium mb-4">Dashboard</h1>
      <p 
        className="mb-6 text-[color:var(--foreground-secondary)] font-normal"
        style={{
          fontFamily: "Geist, sans-serif",
          fontSize: "var(--typography-size-md)",
          fontStyle: "normal",
          lineHeight: "160%",
          color: "var(--foreground-secondary)",
        }}
      >
        Dashboard example demonstrating Fragment UI components and patterns.
      </p>

      <h2>Example</h2>
      <div className="my-6">
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

