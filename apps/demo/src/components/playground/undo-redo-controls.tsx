"use client";

import React from "react";
import { Button, Tooltip } from "@fragment_ui/ui";
import { Undo2, Redo2, GitBranch } from "lucide-react";
import { foregroundMix } from "@/lib/styles";

interface UndoRedoControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onOpenHistory?: () => void;
}

export const UndoRedoControls = React.memo(function UndoRedoControls({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onOpenHistory,
}: UndoRedoControlsProps) {
  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+Z or Ctrl+Z for undo
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) {
          onUndo();
        }
      }
      // Cmd+Shift+Z or Ctrl+Shift+Z or Cmd+Y for redo
      if (
        ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "z") ||
        ((e.metaKey || e.ctrlKey) && e.key === "y")
      ) {
        e.preventDefault();
        if (canRedo) {
          onRedo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canUndo, canRedo, onUndo, onRedo]);

  return (
    <div className="flex items-center gap-1">
      <Tooltip content="Undo (Cmd+Z)">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="inline-flex items-center justify-center w-8 h-8 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          color: canUndo ? "var(--foreground-primary)" : "var(--foreground-tertiary)",
          backgroundColor: "transparent",
        }}
        onMouseEnter={(e) => {
          if (canUndo) {
            e.currentTarget.style.backgroundColor = foregroundMix(5);
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <Undo2 className="w-4 h-4" />
      </button>
      </Tooltip>
      <Tooltip content="Redo (Cmd+Shift+Z)">
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="inline-flex items-center justify-center w-8 h-8 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          color: canRedo ? "var(--foreground-primary)" : "var(--foreground-tertiary)",
          backgroundColor: "transparent",
        }}
        onMouseEnter={(e) => {
          if (canRedo) {
            e.currentTarget.style.backgroundColor = foregroundMix(5);
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <Redo2 className="w-4 h-4" />
      </button>
      </Tooltip>
      {onOpenHistory && (
        <>
          <div 
            className="h-4 border-l mx-1"
            style={{
              borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)",
            }}
          />
          <Tooltip content="View history (Cmd+H)">
            <button
              onClick={onOpenHistory}
              className="inline-flex items-center justify-center w-8 h-8 rounded transition-colors"
              style={{
                color: "var(--foreground-secondary)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = foregroundMix(5);
                e.currentTarget.style.color = "var(--foreground-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--foreground-secondary)";
              }}
            >
              <GitBranch className="w-4 h-4" />
            </button>
          </Tooltip>
        </>
      )}
    </div>
  );
});

