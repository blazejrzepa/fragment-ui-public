"use client";

import { AppShell } from "@fragment_ui/blocks";
import { CodeBlock, DocumentContent } from "@fragment_ui/ui";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";

export default function AppShellPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium" id="page">AppShell</h1>
      </div>
      <p className="mb-6 intro-text">
        Standard layout: nav + header + content.
      </p>
      
      <h2 id="overview">Overview</h2>
      <p>
        AppShell is a composable block that provides the foundation for application layouts. It combines
        sidebar navigation, top header, and main content area into a single, flexible component.
        Perfect for dashboards, admin panels, and multi-page applications.
      </p>
      
      
      {/* Basic AppShell */}
      <div className="group relative mt-4 mb-0 flex flex-col gap-0 rounded-lg border border-[color:var(--color-surface-2)]">
        <div className="preview flex w-full justify-center items-center min-h-[400px] p-10">
          <div className="w-full max-w-6xl border rounded-lg overflow-hidden">
            <AppShell
              sidebarHeader={<div className="text-lg font-semibold">App Name</div>}
              sidebar={
                <SidebarGroup>
                  <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton>Dashboard</SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>Settings</SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              }
              header={<div className="text-lg font-semibold">Header Content</div>}
            >
              <div className="p-4">
                <p className="text-sm text-[color:var(--color-fg-muted)]">
                  Main content area
                </p>
              </div>
            </AppShell>
          </div>
        </div>
        <div className="overflow-hidden">
          <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { AppShell } from "@fragment_ui/blocks";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@fragment_ui/ui";

<AppShell
  sidebarHeader={<div>App Name</div>}
  sidebar={
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>Dashboard</SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>Settings</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  }
  header={<div>Header Content</div>}
>
  <div>Main content area</div>
</AppShell>`}</CodeBlock>
        </div>
      </div>
      
      <h2 id="props">Props</h2>
      <ul>
        <li><code>sidebar</code> - Sidebar navigation content (optional)</li>
        <li><code>sidebarHeader</code> - Sidebar header content like logo, title (optional)</li>
        <li><code>sidebarFooter</code> - Sidebar footer content like user menu (optional)</li>
        <li><code>header</code> - Top header content (optional)</li>
        <li><code>children</code> - Main content area (required)</li>
        <li><code>sidebarPosition</code> - Sidebar position: "left" | "right" (default: "left")</li>
        <li><code>sidebarWidth</code> - Sidebar width: "sm" | "md" | "lg" (default: "md")</li>
        <li><code>contentMaxWidth</code> - Maximum width of main content: "sm" | "md" | "lg" | "xl" | "full" (default: "full")</li>
        <li><code>className</code> - Additional className for root container (optional)</li>
      </ul>
      
      <h2 id="features">Features</h2>
      <ul>
        <li>Flexible sidebar with header and footer sections</li>
        <li>Sticky top header bar</li>
        <li>Configurable sidebar width and position</li>
        <li>Content max-width constraints</li>
        <li>Responsive layout</li>
        <li>Fully accessible structure</li>
        <li>Works seamlessly with NavigationHeader and other blocks</li>
      </ul>
      
      <h2 id="related-blocks">Related Blocks</h2>
      <ul>
        <li><a href="/docs/components/navigation-header">NavigationHeader</a> - Use in header prop</li>
        <li><a href="/docs/templates/dashboard-template">DashboardTemplate</a> - Complete dashboard template using AppShell</li>
        <li><a href="/docs/components/kpi-strip">KpiStrip</a> - Display KPIs in content area</li>
      </ul>
      
      
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">npx shadcn@latest add /r/app-shell.json</CodeBlock>
      <h2 id="accessibility">Accessibility</h2>
      <p>
        AppShell uses semantic HTML elements (header, aside, main, nav) and is fully accessible.
        The layout structure follows ARIA landmarks best practices.
      </p>

    </DocumentContent>
  );
}

