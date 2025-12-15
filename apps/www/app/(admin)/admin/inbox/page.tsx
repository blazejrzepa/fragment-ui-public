"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from "@fragment_ui/ui";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@fragment_ui/ui";
import { Check, Filter, Search, Calendar } from "lucide-react";

type InboxItem = {
  id: string;
  title: string;
  snippet: string;
  time: string;
  status: "open" | "closed";
  color:
    | "amber"
    | "purple"
    | "indigo"
    | "pink"
    | "gray"
    | "blue"
    | "cyan"
    | "green"
    | "teal";
};

const items: InboxItem[] = [
  {
    id: "LNUI-101",
    title: "Refactor Button component for full accessibility compliance",
    snippet: "I've attached the new design mockup",
    time: "10h",
    status: "open",
    color: "amber",
  },
  {
    id: "LNUI-204",
    title: "Optimize animations for smoother UI transitions",
    snippet: "Section renamed from Animations to UI Transitions",
    time: "4d",
    status: "open",
    color: "purple",
  },
  {
    id: "LNUI-309",
    title: "Implement dark mode toggle with system preferences support",
    snippet: "Reopened by GitHub",
    time: "6d",
    status: "open",
    color: "indigo",
  },
  {
    id: "LNUI-415",
    title: "Design new modal system with focus trapping",
    snippet: "https://github.com/ln-dev7/circle",
    time: "13d",
    status: "open",
    color: "pink",
  },
  {
    id: "LNUI-501",
    title: "Enhance responsiveness of Navbar",
    snippet: "Retested on mobile and it works perfectly now",
    time: "18d",
    status: "open",
    color: "gray",
  },
  {
    id: "LNUI-502",
    title: "Optimize loading time of Footer",
    snippet: "Updated performance metrics in the documentation",
    time: "18d",
    status: "open",
    color: "blue",
  },
  {
    id: "LNUI-503",
    title: "Refactor Sidebar for better accessibility",
    snippet: "Closed by Linear",
    time: "4w",
    status: "closed",
    color: "cyan",
  },
  {
    id: "LNUI-504",
    title: "Implement new Card component design",
    snippet: "Closed by Linear",
    time: "4w",
    status: "closed",
    color: "green",
  },
  {
    id: "LNUI-505",
    title: "Improve Tooltip interactivity",
    snippet: "Closed by Linear",
    time: "4w",
    status: "closed",
    color: "purple",
  },
  {
    id: "LNUI-506",
    title: "Fix Dropdown menu positioning",
    snippet: "Bug not reproducible on my Firefox mobile...",
    time: "1mo",
    status: "open",
    color: "blue",
  },
  {
    id: "LNUI-507",
    title: "Implement annotation tools for PDF viewer",
    snippet: "Marked as completed by idriss.ben",
    time: "5w",
    status: "closed",
    color: "teal",
  },
];

function colorDot(color: InboxItem["color"]) {
  const map: Record<InboxItem["color"], string> = {
    amber: "bg-amber-400",
    purple: "bg-purple-400",
    indigo: "bg-indigo-400",
    pink: "bg-pink-400",
    gray: "bg-slate-400",
    blue: "bg-sky-400",
    cyan: "bg-cyan-400",
    green: "bg-emerald-400",
    teal: "bg-teal-400",
  };
  return map[color] || "bg-[color:var(--color-border-base)]";
}

export default function InboxPage() {
  const [selected, setSelected] = React.useState<InboxItem>(items[0]);
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.snippet.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="space-y-6 px-2 sm:px-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-medium">Inbox</h1>
          <p className="text-sm text-[color:var(--color-fg-muted)] mt-1">
            Review updates and notifications across issues.
          </p>
          </div>
          <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leadingIcon={<Check className="h-4 w-4" />}>
            Mark as read
          </Button>
          <Button variant="outline" size="sm" leadingIcon={<Filter className="h-4 w-4" />}>
            Filter
          </Button>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-[280px] max-w-full">
          <Input
            leadingIcon={<Search className="h-4 w-4" />}
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          </div>
        </div>

        {/* Content */}
      <Sheet open={open} onOpenChange={setOpen}>
        <div className="grid grid-cols-1 gap-4">
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Inbox</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-[color:var(--color-border-muted)] p-0 w-full">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelected(item);
                    setOpen(true);
                  }}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-[color:var(--color-surface-2)] ${
                    selected.id === item.id ? "bg-[color:var(--color-surface-2)]" : ""
                  }`}
                >
                  <span className={`mt-1 h-2 w-2 rounded-full ${colorDot(item.color)}`} />
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono text-[color:var(--color-fg-muted)]">
                        {item.id}
                      </span>
                      <span className="text-[11px] text-[color:var(--color-fg-muted)]">
                        {item.time}
                      </span>
                    </div>
                    <div className="text-sm font-medium truncate">{item.title}</div>
                    <div className="text-xs text-[color:var(--color-fg-muted)] truncate">
                      {item.snippet}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-[color:var(--color-fg-muted)]">
                      <Calendar className="h-3 w-3" aria-hidden />
                      <span>{item.time}</span>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
              </div>

        <SheetContent
          side="right"
          className="sm:max-w-md border-l border-[color:var(--color-border-base)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right data-[state=open]:duration-300 data-[state=closed]:duration-200"
        >
          <SheetHeader>
            <SheetTitle className="text-base">{selected.title}</SheetTitle>
            <SheetDescription className="text-xs">{selected.id}</SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-4">
              <p className="text-sm text-[color:var(--color-fg-base)]">{selected.snippet}</p>
            <div className="flex items-center gap-2 text-xs text-[color:var(--color-fg-muted)]">
              <Calendar className="h-3 w-3" aria-hidden />
              <span>{selected.time}</span>
            </div>
              <div className="pt-2 border-t border-[color:var(--color-border-muted)]">
                <Input placeholder="Leave a comment..." />
              </div>
            <div className="flex justify-end">
              <SheetClose asChild>
                <Button variant="outline" size="sm">
                  Close
                </Button>
              </SheetClose>
        </div>
      </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
