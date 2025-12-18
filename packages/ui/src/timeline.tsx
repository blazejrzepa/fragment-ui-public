"use client";

import * as React from "react";
import clsx from "clsx";
import { CheckCircle2, Circle, Clock, XCircle } from "lucide-react";

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  status?: "completed" | "current" | "upcoming" | "error";
  icon?: React.ReactNode;
}

export interface TimelineProps {
  events: TimelineEvent[];
  orientation?: "vertical" | "horizontal";
  className?: string;
  showTimestamps?: boolean;
}

const defaultIcon = {
  completed: <CheckCircle2 className="w-5 h-5" />,
  current: <Clock className="w-5 h-5" />,
  upcoming: <Circle className="w-5 h-5" />,
  error: <XCircle className="w-5 h-5" />,
};

export const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  function Timeline(
    {
      events,
      orientation = "vertical",
      className,
      showTimestamps = true,
    },
    ref
  ) {
    const isVertical = orientation === "vertical";

    return (
      <div
        ref={ref}
        className={clsx(
          "relative",
          isVertical ? "flex flex-col" : "flex flex-row",
          className
        )}
      >
        {/* Timeline Line */}
        <div
          className={clsx(
            "absolute bg-[color:var(--color-fg-muted)]",
            isVertical
              ? "left-[var(--space-5)] top-0 bottom-0 w-0.5"
              : "top-[var(--space-5)] left-0 right-0 h-0.5"
          )}
        />

        {/* Events */}
        {events.map((event, index) => {
          const status = event.status || (index === 0 ? "current" : "upcoming");
          const icon = event.icon || defaultIcon[status];

          return (
            <div
              key={event.id}
              className={clsx(
                "relative flex",
                isVertical ? "flex-row items-start pb-[var(--space-8)]" : "flex-col items-start pr-[var(--space-8)]",
                index === events.length - 1 && (isVertical ? "pb-0" : "pr-0")
              )}
            >
              {/* Icon/Marker */}
              <div
                className={clsx(
                  "relative z-10 flex items-center justify-center rounded-full border-2 bg-[color:var(--color-surface-1)]",
                  status === "completed" &&
                    "border-brand text-brand",
                  status === "current" &&
                    "border-brand text-brand ring-2 ring-brand ring-offset-2",
                  status === "upcoming" &&
                    "border-[color:var(--color-fg-muted)] text-[color:var(--color-fg-muted)]",
                  status === "error" &&
                    "border-[color:var(--color-accent-red)] text-[color:var(--color-accent-red)]",
                  isVertical ? "w-10 h-10" : "w-10 h-10"
                )}
              >
                {icon}
              </div>

              {/* Content */}
              <div className={clsx(isVertical ? "ml-[var(--space-4)] flex-1" : "mt-[var(--space-4)] w-48")}>
                {showTimestamps && event.timestamp && (
                  <div className="text-xs text-[color:var(--color-fg-muted)] mb-[var(--space-1)]">
                    {event.timestamp}
                  </div>
                )}
                <div
                  className={clsx(
                    "font-medium",
                    status === "completed" &&
                      "text-[color:var(--color-fg-base)]",
                    status === "current" &&
                      "text-brand",
                    status === "upcoming" &&
                      "text-[color:var(--color-fg-muted)]",
                    status === "error" &&
                      "text-[color:var(--color-accent-red)]"
                  )}
                >
                  {event.title}
                </div>
                {event.description && (
                  <div className="text-sm text-[color:var(--color-fg-muted)] mt-[var(--space-1)]">
                    {event.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

