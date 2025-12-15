"use client";

import { Badge } from "./badge";

export type StabilityLevel = "stable" | "experimental" | "deprecated";

export interface StabilityBadgeProps {
  stability?: StabilityLevel;
  deprecationVersion?: string;
  deprecationRemovalVersion?: string;
}

export function StabilityBadge({
  stability = "stable",
  deprecationVersion,
  deprecationRemovalVersion,
}: StabilityBadgeProps) {
  const badgeConfig = {
    stable: {
      label: "Stable",
      variant: "solid" as const,
      className: "bg-green-500/10 text-green-600 border-green-500/20",
    },
    experimental: {
      label: "Experimental",
      variant: "outline" as const,
      className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    },
    deprecated: {
      label: "Deprecated",
      variant: "outline" as const,
      className: "bg-red-500/10 text-red-600 border-red-500/20",
    },
  };

  const config = badgeConfig[stability];

  return (
    <div className="flex items-center gap-2">
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
      {stability === "deprecated" && (
        <span className="text-sm text-muted-foreground">
          {deprecationVersion && `Deprecated in v${deprecationVersion}`}
          {deprecationRemovalVersion && ` • Will be removed in v${deprecationRemovalVersion}`}
        </span>
      )}
      {stability === "experimental" && (
        <span className="text-sm text-muted-foreground">
          May change without migration guarantees
        </span>
      )}
    </div>
  );
}

