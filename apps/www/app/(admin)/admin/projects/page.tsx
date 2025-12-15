"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@fragment_ui/ui";
import { Search } from "lucide-react";

type Priority = "high" | "medium" | "low";

type Project = {
  title: string;
  start: string;
  end: string;
  priority: Priority;
  members: number;
};

const DAYS: string[] = ["Mon 08", "Tue 09", "Wed 10", "Thu 11", "Fri 12", "Sat 13", "Sun 14"];

const PROJECTS: Project[] = [
  { title: "Backend Refactoring", start: "Mon 08", end: "Thu 11", priority: "medium", members: 3 },
  { title: "Code Review", start: "Fri 12", end: "Sat 13", priority: "low", members: 3 },
  { title: "Project Management", start: "Mon 08", end: "Fri 12", priority: "high", members: 3 },
  { title: "Content Management", start: "Mon 08", end: "Fri 12", priority: "high", members: 2 },
  { title: "Analytics Dashboard", start: "Tue 09", end: "Wed 10", priority: "low", members: 3 },
  { title: "System Maintenance", start: "Tue 09", end: "Sun 14", priority: "low", members: 3 },
  { title: "Mobile App Development", start: "Thu 11", end: "Fri 12", priority: "medium", members: 2 },
  { title: "API Integration", start: "Thu 11", end: "Fri 12", priority: "medium", members: 3 },
  { title: "Update Employee Record", start: "Thu 11", end: "Sun 14", priority: "low", members: 4 },
];

function PriorityBadge({ priority }: { priority: Priority }) {
  if (priority === "high") return <Badge variant="solid" color="destructive">High</Badge>;
  if (priority === "medium") return <Badge variant="solid">Medium</Badge>;
  return <Badge variant="subtle">Low</Badge>;
}

function dayIndex(day: string) {
  return DAYS.indexOf(day);
}

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState<Priority | "all">("all");

  const filtered = useMemo(() => {
    return PROJECTS.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchesPriority = priority === "all" || p.priority === priority;
      return matchesSearch && matchesPriority;
    });
  }, [search, priority]);

  return (
    <div className="space-y-6 px-2 sm:px-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-medium">Projects</h1>
          <p className="mt-1 text-sm text-[color:var(--color-fg-muted)]">
            Manage project timelines and priorities.
          </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Filter</Button>
            <Button variant="outline" size="sm">Customize</Button>
            <Button variant="solid" size="sm">Today</Button>
          </div>
        </div>

        {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="min-w-[220px] flex-1">
            <Input
              leadingIcon={<Search className="h-4 w-4" />}
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        <div className="flex flex-wrap gap-2">
          <Select value={priority} onValueChange={(val) => setPriority(val as Priority | "all")}>
            <SelectTrigger className="h-9 w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Timeline */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-7 text-center text-sm text-[color:var(--color-fg-muted)]">
            {DAYS.map((d) => (
              <div key={d} className="border-b border-[color:var(--color-border-muted)] py-2">
                {d}
              </div>
              ))}
            </div>

            <div className="space-y-3">
            {filtered.map((project) => {
              const startIdx = dayIndex(project.start);
              const endIdx = dayIndex(project.end);
              const colStart = Math.max(1, startIdx + 1);
              const colSpan = Math.max(1, endIdx - startIdx + 1);
                return (
                <div key={project.title} className="relative">
                  <div className="grid grid-cols-7 gap-2 items-stretch">
                      <div
                      className="rounded-lg border border-[color:var(--color-border-base)] bg-[color:var(--color-surface-1)] shadow-sm overflow-hidden"
                      style={{ gridColumnStart: colStart, gridColumnEnd: colStart + colSpan }}
                      >
                        <div className="flex items-center justify-between px-4 py-3">
                          <div>
                          <div className="text-sm font-medium">{project.title}</div>
                          <div className="text-xs text-[color:var(--color-fg-muted)]">
                            {project.start} - {project.end}
                          </div>
                          </div>
                          <div className="flex items-center gap-3">
                          <PriorityBadge priority={project.priority} />
                          <div className="flex items-center">
                            <span className="text-xs text-[color:var(--color-fg-muted)]">
                              +{project.members}
                            </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
