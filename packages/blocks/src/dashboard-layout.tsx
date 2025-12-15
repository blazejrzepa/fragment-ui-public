import { Tabs, TabsList, TabsTrigger, TabsContent } from "@fragment_ui/ui";

interface DashboardLayoutProps {
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  children?: React.ReactNode;
  defaultTab?: string;
}

export function DashboardLayout({
  sidebar,
  header,
  children,
  defaultTab = "overview",
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[color:var(--color-surface-base)]">
      {/* Header */}
      {header && (
        <header className="border-b border-[color:var(--color-fg-muted)] bg-[color:var(--color-surface-1)]">
          <div className="mx-auto max-w-7xl px-4 py-4">{header}</div>
        </header>
      )}

      <div className="flex">
        {/* Sidebar */}
        {sidebar && (
          <aside className="w-64 border-r border-[color:var(--color-fg-muted)] bg-[color:var(--color-surface-1)] min-h-[calc(100vh-64px)]">
            <nav className="p-4">{sidebar}</nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children || (
            <Tabs defaultValue={defaultTab}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Overview</h2>
                  <p className="text-[color:var(--color-fg-muted)]">
                    Dashboard overview content goes here.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="analytics" className="mt-4">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Analytics</h2>
                  <p className="text-[color:var(--color-fg-muted)]">
                    Analytics content goes here.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="settings" className="mt-4">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Settings</h2>
                  <p className="text-[color:var(--color-fg-muted)]">
                    Settings content goes here.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </div>
  );
}

