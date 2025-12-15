"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
  Input,
} from "@fragment_ui/ui";
import {
  Calendar as CalendarIcon,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
  Upload,
  Zap,
} from "lucide-react";

type Task = {
  title: string;
  description: string;
  tags: string[];
  date: string;
  stats: Record<string, string | number | undefined>;
  color?: string;
};

type Column = {
  id:
    | "backlog"
    | "todo"
    | "inprogress"
    | "review"
    | "paused"
    | "completed";
  title: string;
  tasks: Task[];
};

const columns: Column[] = [
  {
    id: "backlog",
    title: "Backlog",
    tasks: [
      {
        title: "Mobile app redesign",
        description: "Complete redesign of mobile application for better UX",
        tags: ["Design"],
        date: "Feb 10",
        stats: { comments: 2, attachments: 5, links: 3 },
        color: "cyan",
      },
      {
        title: "API documentation update",
        description: "Update API docs with latest endpoints and examples",
        tags: ["Product"],
        date: "Feb 15",
        stats: { links: 8 },
        color: "magenta",
      },
      {
        title: "Accessibility improvements",
        description: "Enhance accessibility for screen readers and keyboard navigation",
        tags: ["Design", "New releases"],
        date: "Feb 20",
        stats: { comments: 1, attachments: 2, links: 5 },
        color: "orange",
      },
    ],
  },
  {
    id: "todo",
    title: "Todo",
    tasks: [
      {
        title: "Design system update",
        description: "Enhance design system for consistency and usability",
        tags: ["Design", "New releases"],
        date: "Jan 25",
        stats: { comments: 4, progress: "1/4" },
      },
      {
        title: "Retention rate by 23%",
        description: "Improve retention through campaigns and feature updates",
        tags: ["Marketing", "Product"],
        date: "Jan 25",
        stats: { comments: 4, views: 33, files: 12 },
      },
      {
        title: "Icon system",
        description: "Develop scalable icons for cohesive platform visuals",
        tags: ["Design"],
        date: "Jan 25",
        stats: { comments: 4, progress: "1/4" },
      },
      {
        title: "Task automation",
        description: "Automate repetitive tasks to improve productivity",
        tags: ["Product"],
        date: "Jan 28",
        stats: { comments: 2, attachments: 5, links: 3, progress: "0/3" },
      },
    ],
  },
  {
    id: "inprogress",
    title: "In Progress",
    tasks: [
      {
        title: "Search features",
        description: "Upgrade search for faster, accurate user results",
        tags: ["Product"],
        date: "Jan 25",
        stats: { comments: 12 },
      },
      {
        title: "Checkout flow design",
        description: "Optimize checkout process to improve conversion rates",
        tags: ["Design"],
        date: "Jan 25",
        stats: { comments: 12, progress: "2/4" },
      },
    ],
  },
  {
    id: "review",
    title: "Technical Review",
    tasks: [
      {
        title: "Payment gateway integration",
        description: "Integrate Stripe payment system for subscriptions",
        tags: ["Product"],
        date: "Jan 20",
        stats: { comments: 8, attachments: 5, progress: "3/4" },
      },
      {
        title: "Security audit fixes",
        description: "Implement fixes from recent security audit report",
        tags: ["Product"],
        date: "Jan 22",
        stats: { comments: 3, links: 7, progress: "2/3" },
      },
      {
        title: "Code review optimizations",
        description: "Review and optimize codebase for better performance",
        tags: ["Product", "New releases"],
        date: "Jan 21",
        stats: { comments: 10, links: 7, progress: "1/2" },
      },
    ],
  },
  {
    id: "paused",
    title: "Paused",
    tasks: [
      {
        title: "Third-party API upgrade",
        description: "Waiting for vendor to release new API version",
        tags: ["Product"],
        date: "Jan 18",
        stats: { comments: 6, links: 3, progress: "1/4" },
      },
      {
        title: "Database migration",
        description: "Paused pending infrastructure team approval",
        tags: ["Product", "Marketing"],
        date: "Jan 15",
        stats: { comments: 12, attachments: 15, progress: "0/5" },
      },
      {
        title: "Server upgrade",
        description: "Waiting for budget approval from management",
        tags: ["Product"],
        date: "Jan 12",
        stats: { comments: 8, attachments: 5, progress: "2/3" },
      },
      {
        title: "Legal compliance review",
        description: "Paused pending legal team review and approval",
        tags: ["Marketing"],
        date: "Jan 10",
        stats: { comments: 15, attachments: 20, progress: "2/4" },
      },
    ],
  },
  {
    id: "completed",
    title: "Completed",
    tasks: [
      {
        title: "Increase conversion rate by 25%",
        description: "Boost conversions through better onboarding and experience",
        tags: ["Marketing"],
        date: "Jan 25",
        stats: { comments: 4, progress: "4/4" },
      },
      {
        title: "Improve team efficiency",
        description: "Achieved efficiency improvements with tools and workflows",
        tags: [],
        date: "Jan 23",
        stats: { comments: 33, files: 12, progress: "4/4" },
      },
    ],
  },
];

function tagVariant(tag: string) {
  const lower = tag.toLowerCase();
  if (lower.includes("design")) return "solid" as const;
  if (lower.includes("product")) return "subtle" as const;
  if (lower.includes("marketing")) return "outline" as const;
  if (lower.includes("new")) return "outline" as const;
  return "outline" as const;
}

function StatRow({ stats }: { stats: Record<string, string | number | undefined> }) {
  const items = Object.entries(stats).filter(([, v]) => v !== undefined);
  if (!items.length) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-3 text-xs text-[color:var(--color-fg-muted)]">
      {items.map(([key, val]) => (
        <div key={key} className="flex items-center gap-1">
          <span className="capitalize text-[color:var(--color-fg-muted)]">{key}</span>
          <span className="font-medium text-[color:var(--color-fg-base)]">{val}</span>
        </div>
      ))}
    </div>
  );
}

export default function TasksPage() {
  return (
    <div className="space-y-6 px-2 sm:px-3">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-medium">Task</h1>
            <p className="mt-1 text-sm text-[color:var(--color-fg-muted)]">
              Manage and track work across teams.
            </p>
            </div>
            <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" leadingIcon={<Upload className="h-4 w-4" />}>
              Import / Export
            </Button>
            <Button variant="solid" size="sm">
              Request task
            </Button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" leadingIcon={<Filter className="h-4 w-4" />}>
            Filter
          </Button>
          <Button variant="outline" size="sm" leadingIcon={<SlidersHorizontal className="h-4 w-4" />}>
            Sort
          </Button>
          <Button variant="outline" size="sm" leadingIcon={<Zap className="h-4 w-4" />}>
            Automate
          </Button>
          <Button variant="outline" size="sm" leadingIcon={<CalendarIcon className="h-4 w-4" />}>
            Sep 7, 2024
          </Button>
            <div className="flex-1 min-w-[240px]" />
            <div className="w-[240px]">
              <Input leadingIcon={<Search className="h-4 w-4" />} placeholder="Search in tasks" />
            </div>
          </div>
        </div>

        {/* Board */}
        <div className="flex gap-4 overflow-x-auto pb-6" style={{ scrollSnapType: "x mandatory" }}>
          {columns.map((col) => (
          <div
            key={col.id}
            className="w-[320px] flex-shrink-0 space-y-3"
            style={{ scrollSnapAlign: "start" }}
          >
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span>{col.title}</span>
                  <span className="text-[color:var(--color-fg-muted)]">{col.tasks.length}</span>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {col.tasks.map((task, idx) => (
              <Card key={`${col.id}-${idx}`} className="shadow-sm">
                <CardContent className="pb-4 pt-4">
                  <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 space-y-1">
                      <h3 className="text-sm font-semibold">{task.title}</h3>
                        <p className="text-sm text-[color:var(--color-fg-muted)]">{task.description}</p>
                      </div>
                    </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                      {task.tags.map((tag) => (
                      <Badge key={`${task.title}-${tag}`} variant={tagVariant(tag)}>
                        {tag}
                      </Badge>
                      ))}
                    </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[color:var(--color-fg-muted)]">
                      <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" aria-hidden />
                        <span>{task.date}</span>
                      </div>
                    </div>
                    <StatRow stats={task.stats} />
                  </CardContent>
                </Card>
              ))}

              <Button variant="ghost" size="sm" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" /> Add task
              </Button>
            </div>
          ))}
        </div>
      </div>
  );
}
