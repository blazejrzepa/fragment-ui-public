"use client";

import { DocLayout } from "../../../../../src/components/doc-layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@fragment_ui/ui";

export default function SettingsMenuExample() {
  return (
    <DocLayout>
      <h1 className="text-[length:var(--typography-display-md-size)] font-medium mb-[var(--space-1)]">Settings</h1>
      <p className="mb-[var(--space-6)] intro-text text-[color:var(--foreground-secondary)] font-normal">
        Settings example demonstrating Fragment UI components and patterns.
      </p>

      <h2>Example</h2>
      <div className="my-[var(--space-6)]">
        <Tabs defaultValue="general" className="flex gap-4">
          <TabsList orientation="vertical" className="w-48">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          <div className="flex-1">
            <TabsContent value="general">General settings content</TabsContent>
            <TabsContent value="security">Security settings content</TabsContent>
            <TabsContent value="notifications">Notification settings content</TabsContent>
            <TabsContent value="privacy">Privacy settings content</TabsContent>
          </div>
        </Tabs>
      </div>
    </DocLayout>
  );
}

