"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@fragment_ui/ui";
import clsx from "clsx";

export interface SettingsTab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface SettingsPageLayoutProps {
  title?: string;
  tabs: SettingsTab[];
  defaultTab?: string;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

/**
 * SettingsPageLayout - Scaffold for settings pages with tabs
 * 
 * Provides a tabbed layout suitable for settings pages with multiple sections.
 */
export function SettingsPageLayout({
  title = "Settings",
  tabs,
  defaultTab,
  className,
  maxWidth = "2xl",
}: SettingsPageLayoutProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  const defaultTabId = defaultTab || tabs[0]?.id;

  return (
    <div className={clsx("w-full mx-auto px-4 py-6", maxWidthClasses[maxWidth], className)}>
      {title && (
        <h1 className="text-2xl font-semibold mb-6 text-[color:var(--color-fg-base)]">
          {title}
        </h1>
      )}
      <Tabs defaultValue={defaultTabId} className="w-full">
        <TabsList className="mb-6">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-4">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

