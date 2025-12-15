"use client";

import * as React from "react";
import { AppShell } from "../app-shell";
import { NavigationHeader } from "../navigation-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Separator } from "@fragment_ui/ui";
import type { AppShellProps } from "../app-shell";

export interface SettingsSection {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
}

export interface SettingsTemplateProps {
  /**
   * Sidebar navigation content
   */
  sidebar?: React.ReactNode;
  /**
   * Sidebar header (logo, title)
   */
  sidebarHeader?: React.ReactNode;
  /**
   * Sidebar footer (user menu, etc.)
   */
  sidebarFooter?: React.ReactNode;
  /**
   * Header navigation links
   */
  headerLinks?: Array<{ label: string; href: string }>;
  /**
   * Header logo text
   */
  headerLogoText?: string;
  /**
   * Settings sections
   */
  sections: SettingsSection[];
  /**
   * Page title
   */
  title?: string;
  /**
   * Page description
   */
  description?: string;
  /**
   * Additional AppShell props
   */
  appShellProps?: Omit<AppShellProps, "sidebar" | "sidebarHeader" | "sidebarFooter" | "header" | "children">;
}

/**
 * SettingsTemplate - Complete settings page template
 * 
 * A full-screen template for settings pages with multiple sections.
 * Each section is displayed in a card with title and description.
 * 
 * @example
 * ```tsx
 * <SettingsTemplate
 *   sidebar={<NavigationMenu />}
 *   sections={[
 *     {
 *       id: "profile",
 *       title: "Profile",
 *       description: "Update your profile information",
 *       content: <ProfileForm />,
 *     },
 *     {
 *       id: "notifications",
 *       title: "Notifications",
 *       content: <NotificationSettings />,
 *     },
 *   ]}
 * />
 * ```
 */
export function SettingsTemplate({
  sidebar,
  sidebarHeader,
  sidebarFooter,
  headerLinks,
  headerLogoText = "Dashboard",
  sections,
  title = "Settings",
  description,
  appShellProps,
}: SettingsTemplateProps) {
  const header = headerLinks ? (
    <NavigationHeader
      logoText={headerLogoText}
      links={headerLinks}
    />
  ) : undefined;

  return (
    <AppShell
      sidebar={sidebar}
      sidebarHeader={sidebarHeader}
      sidebarFooter={sidebarFooter}
      header={header}
      {...appShellProps}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold mb-2">{title}</h1>
          {description && (
            <p className="text-sm text-[color:var(--color-fg-muted)]">
              {description}
            </p>
          )}
        </div>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <React.Fragment key={section.id}>
              <Card>
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                  {section.description && (
                    <CardDescription>{section.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>{section.content}</CardContent>
              </Card>
              {index < sections.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

