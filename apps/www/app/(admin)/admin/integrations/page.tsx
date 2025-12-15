"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
} from "@fragment_ui/ui";
import { Input } from "@fragment_ui/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@fragment_ui/ui";
import { Plug2, Search, CheckCircle2, Clock3, XCircle } from "lucide-react";

type IntegrationStatus = "connected" | "pending" | "error";

type Integration = {
  id: string;
  name: string;
  category: string;
  description: string;
  status: IntegrationStatus;
  actions: string[];
};

const integrations: Integration[] = [
  {
    id: "notion",
    name: "Notion",
    category: "Docs",
    description: "Sync product docs, specs, and decisions into your workspace.",
    status: "connected",
    actions: ["Sync pages", "Import databases"],
  },
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    description: "Pipe alerts, incidents, and approvals to your channels.",
    status: "connected",
    actions: ["Send alerts", "Create tickets"],
  },
  {
    id: "jira",
    name: "Jira",
    category: "Delivery",
    description: "Keep tasks, sprints, and releases aligned with engineering.",
    status: "pending",
    actions: ["Sync issues", "Import sprints"],
  },
  {
    id: "zendesk",
    name: "Zendesk",
    category: "Support",
    description: "Surface support signals and automate ticket workflows.",
    status: "error",
    actions: ["Sync tickets", "Create macros"],
  },
  {
    id: "github",
    name: "GitHub",
    category: "Code",
    description: "Ship faster with PR insights, checks, and deployments.",
    status: "connected",
    actions: ["Sync repos", "Pull PR stats"],
  },
  {
    id: "airtable",
    name: "Airtable",
    category: "Data",
    description: "Push metrics and enriched records into your tables.",
    status: "pending",
    actions: ["Sync bases", "Map fields"],
  },
];

function statusBadge(status: IntegrationStatus) {
  if (status === "connected") return <Badge variant="solid">Connected</Badge>;
  if (status === "pending") return <Badge variant="subtle">Pending</Badge>;
  return <Badge variant="outline">Action needed</Badge>;
}

function statusIcon(status: IntegrationStatus) {
  if (status === "connected") return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  if (status === "pending") return <Clock3 className="h-4 w-4 text-amber-500" />;
  return <XCircle className="h-4 w-4 text-rose-500" />;
}

export default function IntegrationsPage() {
  const [query, setQuery] = React.useState("");
  const filtered = integrations.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 px-2 sm:px-3">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-medium">Integrations</h1>
          <p className="mt-1 text-sm text-[color:var(--color-fg-muted)]">
            Connect your tools and keep data in sync across your stack.
          </p>
        </div>
        <Button leadingIcon={<Plug2 className="h-4 w-4" />}>Add integration</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-[color:var(--color-fg-muted)]" />
              <Input
                placeholder="Search integrations..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="connected">Connected</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="error">Action needed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((integration) => (
          <Card key={integration.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--color-surface-2)] text-xs font-semibold">
                    {integration.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-base">{integration.name}</CardTitle>
                    <CardDescription className="text-xs">{integration.category}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {statusIcon(integration.status)}
                  {statusBadge(integration.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
              <p className="text-sm text-[color:var(--color-fg-muted)]">{integration.description}</p>
              <div className="flex flex-wrap gap-2">
                {integration.actions.map((action) => (
                  <Badge key={action} variant="subtle">
                    {action}
                  </Badge>
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between gap-2">
                <Button variant="outline" size="sm">
                  Manage
                </Button>
                <Button variant="ghost" size="sm">
                  View docs
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-[color:var(--color-fg-muted)]">
            No integrations match your filters.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
