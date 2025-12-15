"use client";

import * as React from "react";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import clsx from "clsx";

export interface ActivityItem {
  id: string;
  type: "action" | "update" | "comment" | "system";
  title: string;
  description?: string;
  timestamp: Date | string;
  user?: {
    name: string;
    avatar?: string;
  };
  icon?: React.ReactNode;
  metadata?: Record<string, any>;
}

export interface ActivityFeedProps {
  items: ActivityItem[];
  maxItems?: number;
  showTimestamps?: boolean;
  className?: string;
}

export const ActivityFeed = React.memo(
  React.forwardRef<HTMLDivElement, ActivityFeedProps>(
    function ActivityFeed(
      { items = [], maxItems, showTimestamps = true, className },
      ref
    ) {
      // Ensure items is always an array
      const safeItems = Array.isArray(items) ? items : [];
      const displayItems = maxItems ? safeItems.slice(0, maxItems) : safeItems;

      const formatTimestamp = (timestamp: Date | string) => {
        const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
      };

      const getTypeColor = (type: ActivityItem["type"]) => {
        switch (type) {
          case "action":
            return "bg-[color:var(--color-brand-primary)]";
          case "update":
            return "bg-[color:var(--color-status-info-base)]";
          case "comment":
            return "bg-[color:var(--color-status-warning-base)]";
          case "system":
            return "bg-[color:var(--color-fg-muted)]";
          default:
            return "bg-[color:var(--color-fg-muted)]";
        }
      };

      return (
        <div ref={ref} className={clsx("space-y-4", className)}>
          {displayItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 items-start pb-4 border-b border-[color:var(--color-border-base)] last:border-0 last:pb-0"
            >
              {item.user?.avatar ? (
                <Avatar src={item.user.avatar} alt={item.user.name} />
              ) : item.icon ? (
                <div
                  className={clsx(
                    "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm",
                    getTypeColor(item.type)
                  )}
                >
                  {item.icon}
                </div>
              ) : (
                <Avatar>
                  {item.user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "?"}
                </Avatar>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-[color:var(--color-fg-base)]">
                    {item.title}
                  </span>
                  <Badge variant="outline" size="sm">
                    {item.type}
                  </Badge>
                </div>
                {item.description && (
                  <p className="text-sm text-[color:var(--color-fg-muted)] mb-1">
                    {item.description}
                  </p>
                )}
                {showTimestamps && (
                  <p className="text-xs text-[color:var(--color-fg-muted)]">
                    {formatTimestamp(item.timestamp)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }
  )
);

ActivityFeed.displayName = "ActivityFeed";

