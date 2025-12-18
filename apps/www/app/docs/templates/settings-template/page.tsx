"use client";

import { SettingsTemplate } from "@fragment_ui/blocks";
import { DocLayout } from "../../../../src/components/doc-layout";
import { CodeBlock } from "@fragment_ui/ui";
import { StabilityBadge } from "@fragment_ui/ui";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@fragment_ui/ui";
import { Input, Switch, Button } from "@fragment_ui/ui";

export default function SettingsTemplatePage() {
  return (
    <DocLayout>
      <div className="flex items-center gap-4 mb-4">
        <h1 id="settings-template" className="text-3xl font-medium">SettingsTemplate</h1>
        <StabilityBadge stability="stable" />
      </div>
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
        Complete settings page template with multiple sections.
        A full-screen template for settings pages with organized sections in cards.
      </p>
      
      <h2 id="overview">Overview</h2>
      <p>
        SettingsTemplate is a ready-to-use template that combines AppShell with
        organized settings sections. Each section is displayed in a card with title,
        description, and content. Perfect for application settings, user preferences,
        and configuration pages.
      </p>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">npx shadcn@latest add /r/settings-template.json</CodeBlock>
      
      <h2 id="examples">Examples</h2>
      <div className="space-y-6 my-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Complete Settings Template</h3>
          <div className="border rounded-lg overflow-hidden">
            <SettingsTemplate
              sidebarHeader={<div className="text-lg font-semibold">Dashboard</div>}
              sidebar={
                <SidebarGroup>
                  <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton>Settings</SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              }
              headerLinks={[
                { label: "Overview", href: "/" },
                { label: "Settings", href: "/settings" },
              ]}
              sections={[
                {
                  id: "profile",
                  title: "Profile",
                  description: "Update your profile information",
                  content: (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Display Name</label>
                        <Input placeholder="Enter your name" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input type="email" placeholder="your@email.com" />
                      </div>
                      <Button>Save Changes</Button>
                    </div>
                  ),
                },
                {
                  id: "notifications",
                  title: "Notifications",
                  description: "Manage your notification preferences",
                  content: (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="font-medium">Email Notifications</label>
                          <p className="text-sm text-[color:var(--color-fg-muted)]">
                            Receive email notifications
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="font-medium">Push Notifications</label>
                          <p className="text-sm text-[color:var(--color-fg-muted)]">
                            Receive push notifications
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  ),
                },
                {
                  id: "security",
                  title: "Security",
                  description: "Manage your security settings",
                  content: (
                    <div className="space-y-4">
                      <Button variant="outline">Change Password</Button>
                      <Button variant="outline">Enable Two-Factor Authentication</Button>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>
      
      <h2 id="code-examples">Code Examples</h2>
      <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { SettingsTemplate } from "@fragment_ui/blocks";
import { Input, Switch, Button } from "@fragment_ui/ui";

function SettingsPage() {
  return (
    <SettingsTemplate
      sidebar={<NavigationMenu />}
      sections={[
        {
          id: "profile",
          title: "Profile",
          description: "Update your profile information",
          content: (
            <div className="space-y-4">
              <Input placeholder="Name" />
              <Input type="email" placeholder="Email" />
              <Button>Save</Button>
            </div>
          ),
        },
        {
          id: "notifications",
          title: "Notifications",
          content: (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label>Email Notifications</label>
                <Switch />
              </div>
            </div>
          ),
        },
      ]}
    />
  );
}`}</CodeBlock>
      
      <h2 id="props">Props</h2>
      <ul>
        <li><code>sidebar</code> - Sidebar navigation content (optional)</li>
        <li><code>sidebarHeader</code> - Sidebar header (optional)</li>
        <li><code>sidebarFooter</code> - Sidebar footer (optional)</li>
        <li><code>headerLinks</code> - Header navigation links (optional)</li>
        <li><code>sections</code> - Settings sections array (required)</li>
        <li><code>title</code> - Page title (default: "Settings")</li>
        <li><code>description</code> - Page description (optional)</li>
        <li><code>appShellProps</code> - Additional AppShell props (optional)</li>
      </ul>

      <h3 id="section-props">Section Object</h3>
      <ul>
        <li><code>id</code> - Unique section identifier (required)</li>
        <li><code>title</code> - Section title (required)</li>
        <li><code>description</code> - Section description (optional)</li>
        <li><code>content</code> - Section content (React node, required)</li>
      </ul>
      
      <h2 id="features">Features</h2>
      <ul>
        <li>Complete page layout with AppShell</li>
        <li>Organized sections in cards</li>
        <li>Section titles and descriptions</li>
        <li>Separators between sections</li>
        <li>Flexible content area</li>
        <li>Fully accessible</li>
      </ul>
      
      <h2 id="related-blocks">Related Blocks</h2>
      <ul>
        <li><a href="/docs/components/app-shell">AppShell</a> - Base shell component</li>
        <li><a href="/docs/components/card">Card</a> - Section card component</li>
        <li><a href="/docs/components/separator">Separator</a> - Section separator</li>
      </ul>
      
      <h2 id="accessibility">Accessibility</h2>
      <p>
        SettingsTemplate uses semantic HTML and proper heading hierarchy.
        All sections are keyboard accessible and follow ARIA best practices.
      </p>

    </DocLayout>
  );
}

