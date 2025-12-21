"use client";

import { Badge, Button } from "@fragment_ui/ui";
import { CheckCircle2, Code2, History, X } from "lucide-react";
import { useState } from "react";

interface PatchesBadgeProps {
  patchesApplied?: number;
  revisionId?: string;
  onViewDetails?: () => void;
  onViewHistory?: () => void;
}

/**
 * Badge showing applied patches status
 */
export function PatchesBadge({
  patchesApplied,
  revisionId,
  onViewDetails,
  onViewHistory,
}: PatchesBadgeProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (!patchesApplied || patchesApplied === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="outline"
        className="flex items-center gap-1.5 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
      >
        <CheckCircle2 className="w-3 h-3" />
        <span>{patchesApplied} patch{patchesApplied > 1 ? "es" : ""} applied</span>
      </Badge>
      
      {revisionId && (
        <Badge
          variant="outline"
          className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
        >
          <Code2 className="w-3 h-3" />
          <span className="text-xs">Revision saved</span>
        </Badge>
      )}

      {(onViewDetails || onViewHistory) && (
        <div className="flex items-center gap-1">
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowDetails(!showDetails);
                onViewDetails?.();
              }}
              className="h-6 px-2 text-xs"
              data-action-id="view-patches-details"
              data-action-kind="view"
            >
              Details
            </Button>
          )}
          {onViewHistory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewHistory}
              className="h-6 px-2 text-xs"
              data-action-id="view-patches-history"
              data-action-kind="view"
            >
              <History className="w-3 h-3 mr-1" />
              History
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

