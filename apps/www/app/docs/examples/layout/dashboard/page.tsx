"use client";

import { DocLayout } from "../../../../../src/components/doc-layout";
import { DashboardLayout, KPIDashboard, NavigationHeader } from "@fragment_ui/blocks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fragment_ui/ui";

export default function DashboardLayoutExample() {
  return (
    <DocLayout>
      <h1 className="text-[length:var(--typography-display-md-size)] font-medium mb-[var(--space-1)]">Dashboard Example</h1>
      <p 
        className="mb-[var(--space-6)] text-[color:var(--foreground-secondary)] font-normal"
        className="mb-[var(--space-6)] intro-text"
      >
        Complete dashboard example demonstrating Fragment UI blocks and components. This example shows how to build a production-ready dashboard with KPI cards, navigation, and widgets.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-[var(--space-1)]">Live Example</h2>
      <div className="my-[var(--space-6)] border rounded-[var(--radius-md)] overflow-hidden bg-background">
        <DashboardLayout
          header={
            <NavigationHeader
              logoText="Dashboard"
              links={[
                { label: "Overview", href: "#" },
                { label: "Analytics", href: "#" },
                { label: "Settings", href: "#" },
              ]}
            />
          }
        >
          <div className="space-y-6 p-6">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Welcome to your dashboard</p>
            </div>

            <KPIDashboard
              metrics={[
                { id: "users", title: "Total Users", value: "12,345", trend: "up", trendValue: "+12%", description: "Active users this month" },
                { id: "revenue", title: "Revenue", value: "$45,678", trend: "up", trendValue: "+8%", description: "Monthly recurring revenue" },
                { id: "orders", title: "Orders", value: "1,234", trend: "up", trendValue: "+5%", description: "Orders this week" },
                { id: "conversion", title: "Conversion", value: "3.2%", trend: "up", trendValue: "+0.5%", description: "Conversion rate" },
              ]}
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest user activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Activity feed will appear here
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Quick action buttons will appear here
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Recent notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Notifications will appear here
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </DashboardLayout>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-[var(--space-1)]">Code Example</h2>
      <pre className="bg-[color:var(--color-surface-2)] p-[var(--space-4)] rounded-[var(--radius-md)] overflow-x-auto text-sm">
        <code>{`import { DashboardLayout, KPIDashboard, NavigationHeader } from "@fragment_ui/blocks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fragment_ui/ui";

export default function Dashboard() {
  return (
    <DashboardLayout
      header={
        <NavigationHeader
          logoText="Dashboard"
          links={[
            { label: "Overview", href: "/" },
            { label: "Analytics", href: "/analytics" },
            { label: "Settings", href: "/settings" },
          ]}
        />
      }
    >
      <div className="space-y-6 p-6">
        <KPIDashboard
          metrics={[
            { id: "users", title: "Total Users", value: "12,345", trend: "up", trendValue: "+12%" },
            { id: "revenue", title: "Revenue", value: "$45,678", trend: "up", trendValue: "+8%" },
            { id: "orders", title: "Orders", value: "1,234", trend: "up", trendValue: "+5%" },
            { id: "conversion", title: "Conversion", value: "3.2%", trend: "up", trendValue: "+0.5%" },
          ]}
        />
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest user activities</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Your content here */}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}`}</code>
      </pre>

      <div className="mt-6 p-[var(--space-4)] rounded-[var(--radius-md)] bg-[color:var(--color-surface-2)]">
        <h3 className="text-lg font-semibold mb-2">Key Components Used</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-[color:var(--color-fg-muted)]">
          <li><code className="bg-[color:var(--color-surface-1)] px-1 rounded">DashboardLayout</code> - Main dashboard container with sidebar and header</li>
          <li><code className="bg-[color:var(--color-surface-1)] px-1 rounded">NavigationHeader</code> - Top navigation bar with logo and menu items</li>
          <li><code className="bg-[color:var(--color-surface-1)] px-1 rounded">KPIDashboard</code> - Key performance indicator cards with trends</li>
          <li><code className="bg-[color:var(--color-surface-1)] px-1 rounded">Card</code> - Content cards for widgets and sections</li>
        </ul>
      </div>

      <div className="mt-6 p-[var(--space-4)] rounded-[var(--radius-md)] bg-[color:var(--color-surface-2)]">
        <h3 className="text-lg font-semibold mb-2">Full Example Project</h3>
        <p className="text-sm text-[color:var(--color-fg-muted)] mb-2">
          Check out the complete Next.js dashboard example in the repository:
        </p>
        <code className="block bg-[color:var(--color-surface-1)] p-2 rounded text-sm">
          examples/nextjs-dashboard/
        </code>
      </div>
    </DocLayout>
  );
}

