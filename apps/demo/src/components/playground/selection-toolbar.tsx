"use client";

import React from "react";
import { Edit, Trash2, Copy, X } from "lucide-react";
import { Button, Tooltip } from "@fragment_ui/ui";
import { foregroundMix } from "@/lib/styles";

interface SelectionToolbarProps {
  selectedElementId: string | null;
  componentName: string | null;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onClear?: () => void;
}

/**
 * Selection Toolbar - displays selected element info with quick actions
 * 
 * Shows when an element is selected in the preview.
 * Displays component name, element ID, and provides quick actions:
 * - Edit: Opens element inspector
 * - Delete: Removes the element
 * - Duplicate: Creates a copy of the element
 * - Clear: Deselects the element
 */
export const SelectionToolbar = React.memo(function SelectionToolbar({
  selectedElementId,
  componentName,
  onEdit,
  onDelete,
  onDuplicate,
  onClear,
}: SelectionToolbarProps) {
  if (!selectedElementId) {
    return null;
  }

  return (
    <div
      className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg border"
      style={{
        backgroundColor: "var(--background-primary)",
        borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)",
        borderWidth: "1px",
      }}
    >
      {/* Element Info - removed text labels, keeping only ID */}
      <div className="flex items-center gap-3 pr-3 border-r" style={{ borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)" }}>
        <code className="text-xs font-mono text-[color:var(--foreground-tertiary)]">
          {selectedElementId.length > 20 ? `${selectedElementId.substring(0, 20)}...` : selectedElementId}
        </code>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-1">
        {onEdit && (
          <Tooltip content="Edit element">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-8 w-8 p-0"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </Tooltip>
        )}
        {onDuplicate && (
          <Tooltip content="Duplicate element">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDuplicate}
              className="h-8 w-8 p-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip content="Delete element">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </Tooltip>
        )}
        {onClear && (
          <Tooltip content="Clear selection">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-8 px-2 ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  );
});

