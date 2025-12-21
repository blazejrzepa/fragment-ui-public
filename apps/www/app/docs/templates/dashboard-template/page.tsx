"use client";

import { DashboardTemplate } from "@fragment_ui/blocks";
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
import { Card, CardContent, CardHeader, CardTitle } from "@fragment_ui/ui";

export default function DashboardTemplatePage() {
  const sampleMetrics = [
    { id: "users", title: "Total Users", value: "12,345", trend: "up" as const, trendValue: "+12%", description: "Active users this month" },
    { id: "revenue", title: "Revenue", value: "$45,678", trend: "up" as const, trendValue: "+8%", description: "Monthly recurring revenue" },
    { id: "orders", title: "Orders", value: "1,234", trend: "up" as const, trendValue: "+5%", description: "Orders this week" },
    { id: "conversion", title: "Conversion", value: "3.2%", trend: "up" as const, trendValue: "+0.5%", description: "Conversion rate" },
  ];

  return (
    <DocLayout>
      <div className="flex items-center gap-[var(--space-4)] mb-[var(--space-1)]">
        <h1 id="dashboard-template" className="text-[length:var(--typography-display-md-size)] font-medium">DashboardTemplate</h1>
        <StabilityBadge stability="stable" />
      </div>
      <p className="mb-[var(--space-6)] intro-text">
        Complete dashboard page template combining AppShell, NavigationHeader, and KpiStrip.
        A full-screen template for creating standard dashboard pages with navigation, metrics, and content.
      </p>
      
      <h2 id="overview">Overview</h2>
      <p>
        DashboardTemplate is a ready-to-use template that combines multiple blocks into a complete
        dashboard page. It includes sidebar navigation, top header, KPI metrics strip, and main content area.
        Perfect for building dashboards quickly without composing blocks manually.
      </p>
      
      <h2 id="install">Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">npx shadcn@latest add /r/dashboard-template.json</CodeBlock>
      
      <h2 id="examples">Examples</h2>
      <div className="space-y-[var(--space-6)] my-[var(--space-6)]">
        <div>
          <h3 className="text-lg font-semibold mb-2">Complete Dashboard Template</h3>
          <div className="border rounded-lg overflow-hidden">
            <DashboardTemplate
              sidebarHeader={<div className="text-lg font-semibold">Dashboard</div>}
              sidebar={
                <SidebarGroup>
                  <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton>Overview</SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>Analytics</SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>Settings</SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              }
              headerLinks={[
                { label: "Overview", href: "/" },
                { label: "Analytics", href: "/analytics" },
                { label: "Settings", href: "/settings" },
              ]}
              metrics={sampleMetrics}
            >
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader>
                        <CardTitle>Card 1</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-[color:var(--color-fg-muted)]">
                          Content goes here
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Card 2</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-[color:var(--color-fg-muted)]">
                          Content goes here
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Card 3</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-[color:var(--color-fg-muted)]">
                          Content goes here
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </DashboardTemplate>
          </div>
        </div>
      </div>
      
      <h2 id="code-examples">Code Examples</h2>
      <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { DashboardTemplate } from "@fragment_ui/blocks";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@fragment_ui/ui";

// Complete dashboard
<DashboardTemplate
  sidebarHeader={<Logo />}
  sidebar={
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>Dashboard</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  }
  headerLinks={[
    { label: "Overview", href: "/" },
    { label: "Analytics", href: "/analytics" },
  ]}
  metrics={[
    { id: "users", title: "Users", value: "1,234", trend: "up", trendValue: "+12%" },
    { id: "revenue", title: "Revenue", value: "$5,678", trend: "up", trendValue: "+8%" },
  ]}
>
  <YourDashboardContent />
</DashboardTemplate>

// Without metrics
<DashboardTemplate
  sidebar={<NavigationMenu />}
  headerLinks={[{ label: "Home", href: "/" }]}
>
  <YourContent />
</DashboardTemplate>

// Custom AppShell props
<DashboardTemplate
  sidebar={<NavigationMenu />}
  headerLinks={[{ label: "Home", href: "/" }]}
  metrics={metrics}
  appShellProps={{
    sidebarWidth: "lg",
    contentMaxWidth: "xl",
  }}
>
  <YourContent />
</DashboardTemplate>`}</CodeBlock>
      
      <h2 id="props">Props</h2>
      <ul>
        <li><code>sidebar</code> - Sidebar navigation content (optional)</li>
        <li><code>sidebarHeader</code> - Sidebar header (logo, title) (optional)</li>
        <li><code>sidebarFooter</code> - Sidebar footer (user menu, etc.) (optional)</li>
        <li><code>headerLinks</code> - Header navigation links (optional)</li>
        <li><code>headerLogoText</code> - Header logo text (default: "Dashboard")</li>
        <li><code>metrics</code> - KPI metrics to display (optional)</li>
        <li><code>kpiColumns</code> - Number of columns for KPI strip: 2 | 3 | 4 (default: 4)</li>
        <li><code>children</code> - Main content area (optional)</li>
        <li><code>appShellProps</code> - Additional AppShell props (optional)</li>
      </ul>
      
      <h2 id="features">Features</h2>
      <ul>
        <li>Complete dashboard structure in one component</li>
        <li>Combines AppShell + NavigationHeader + KpiStrip</li>
        <li>Optional sidebar navigation</li>
        <li>Optional header navigation</li>
        <li>Optional KPI metrics strip</li>
        <li>Flexible content area</li>
        <li>Configurable via appShellProps</li>
        <li>Fully accessible</li>
      </ul>
      
      <h2 id="related-blocks">Related Blocks</h2>
      <ul>
        <li><a href="/docs/components/app-shell">AppShell</a> - Base shell component</li>
        <li><a href="/docs/components/navigation-header">NavigationHeader</a> - Header navigation</li>
        <li><a href="/docs/components/kpi-strip">KpiStrip</a> - KPI metrics strip</li>
        <li><a href="/docs/components/kpi-dashboard">KPIDashboard</a> - Full KPI dashboard</li>
      </ul>
      
      <h2 id="when-to-use">When to Use</h2>
      <ul>
        <li>✅ Building standard dashboard pages</li>
        <li>✅ Quick prototyping of dashboards</li>
        <li>✅ Applications with consistent dashboard structure</li>
        <li>❌ Highly custom layouts (use AppShell directly)</li>
        <li>❌ Pages without sidebar/header (use simpler blocks)</li>
      </ul>
      
      <h2 id="accessibility">Accessibility</h2>
      <p>
        DashboardTemplate inherits accessibility from AppShell, NavigationHeader, and KpiStrip.
        All components follow ARIA best practices and are keyboard navigable.
      </p>

    </DocLayout>
  );
}

