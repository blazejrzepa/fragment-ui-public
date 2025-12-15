"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Button, Badge } from "@fragment_ui/ui";
import { Grid3x3, Plus, MoreVertical, Search, Filter } from "lucide-react";

type AppStatus = "active" | "inactive";

type AppItem = {
  id: string;
  name: string;
  description: string;
  status: AppStatus;
  category: string;
  icon: string;
};

const sampleApps: AppItem[] = [
  { id: "1", name: "Analytics Dashboard", description: "Real-time analytics and reporting", status: "active", category: "Analytics", icon: "AD" },
  { id: "2", name: "Email Marketing", description: "Send and track email campaigns", status: "active", category: "Marketing", icon: "EM" },
  { id: "3", name: "CRM System", description: "Customer relationship management", status: "inactive", category: "Sales", icon: "CR" },
  { id: "4", name: "Project Manager", description: "Team collaboration and task tracking", status: "active", category: "Productivity", icon: "PM" },
  { id: "5", name: "Invoice Generator", description: "Create and manage invoices", status: "active", category: "Finance", icon: "IG" },
  { id: "6", name: "Content CMS", description: "Content management system", status: "inactive", category: "Content", icon: "CC" },
];

export default function AppsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredApps = React.useMemo(() => {
    const term = searchQuery.toLowerCase();
    return sampleApps.filter(
      (app) =>
        app.name.toLowerCase().includes(term) ||
        app.description.toLowerCase().includes(term) ||
        app.category.toLowerCase().includes(term)
  );
  }, [searchQuery]);

  return (
    <div className="space-y-6 px-2 sm:px-3">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-medium">Apps</h1>
          <p className="mt-1 text-sm text-[color:var(--color-fg-muted)]">
              Manage your applications and integrations
            </p>
          </div>
        <Button leadingIcon={<Plus className="h-4 w-4" />}>Add App</Button>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            leadingIcon={<Search className="h-4 w-4" />}
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" leadingIcon={<Filter className="h-4 w-4" />}>
            Filter
          </Button>
        </div>

        {/* Apps Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredApps.map((app) => (
          <Card key={app.id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--color-surface-2)] text-xs font-semibold">
                    {app.icon}
                  </div>
                    <div>
                      <CardTitle className="text-lg">{app.name}</CardTitle>
                    <CardDescription className="mt-1 text-xs">{app.category}</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="App actions">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
              <p className="mb-4 text-sm text-[color:var(--color-fg-muted)]">{app.description}</p>
                <div className="flex items-center justify-between">
                <Badge variant={app.status === "active" ? "solid" : "subtle"}>{app.status}</Badge>
                <Button variant="outline" size="sm">Configure</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredApps.length === 0 && (
        <div className="py-12 text-center">
          <Grid3x3 className="mx-auto mb-4 h-12 w-12 text-[color:var(--color-fg-muted)]" />
            <p className="text-sm text-[color:var(--color-fg-muted)]">
              No apps found matching your search.
            </p>
          </div>
        )}
      </div>
  );
}

