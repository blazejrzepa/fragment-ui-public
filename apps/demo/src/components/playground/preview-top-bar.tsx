"use client";

import React from "react";
import { Button, Tooltip } from "@fragment_ui/ui";
import { Download, Share2, Star, FileDown, Undo2, Redo2, Eye, Code2, Send, Bot, User, ScanSearch } from "lucide-react";
import { foregroundMix } from "@/lib/styles";

interface PreviewTopBarProps {
  activePreviewTab?: "preview" | "code" | "inspect";
  onPreviewTabChange?: (tab: "preview" | "code" | "inspect") => void;
  onExportCode?: () => void;
  onShareLink?: () => void;
  onToggleFavorite?: () => void;
  onDownloadZIP?: () => void;
  onSubmit?: () => void; // Submit to Submissions (Milestone 6.3)
  isFavorite?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  agentViewEnabled?: boolean;
  onAgentViewChange?: (enabled: boolean) => void;
}

/**
 * Preview Top Bar - horizontal bar at the top of preview with action buttons
 * 
 * Shows for components generated from Projects and DS Components
 */
export const PreviewTopBar = React.memo(function PreviewTopBar({
  activePreviewTab = "preview",
  onPreviewTabChange,
  onExportCode,
  onShareLink,
  onToggleFavorite,
  onDownloadZIP,
  onSubmit,
  isFavorite = false,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  agentViewEnabled = false,
  onAgentViewChange,
}: PreviewTopBarProps) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-3 border rounded-lg shadow-sm"
      style={{
        backgroundColor: "var(--background-primary)",
        borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
        borderWidth: "1px",
        borderRadius: "8px",
        minHeight: "48px",
        width: "fit-content",
      }}
    >
      {/* Preview/Inspect/Code switch */}
      {onPreviewTabChange && (
        <div 
          className="flex gap-1 border rounded-lg" 
          style={{ 
            backgroundColor: "transparent", 
            borderRadius: "6px", 
            padding: "2px", 
            borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
            borderWidth: "1px"
          }}
        >
          <Tooltip content="Preview - Test UI interactions">
            <button
              onClick={() => onPreviewTabChange("preview")}
              className="flex items-center justify-center gap-2 rounded transition-colors min-w-0"
              style={{
                backgroundColor: activePreviewTab === "preview" ? "color-mix(in srgb, var(--foreground-primary) 5%, transparent)" : "transparent",
                color: activePreviewTab === "preview" ? "var(--foreground-primary)" : "var(--foreground-secondary)",
                padding: "6px 12px",
              }}
            >
              <Eye className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">Preview</span>
            </button>
          </Tooltip>
          <Tooltip content="Inspect - Select elements for Inspector">
            <button
              onClick={() => onPreviewTabChange("inspect")}
              className="flex items-center justify-center gap-2 rounded transition-colors min-w-0"
              style={{
                backgroundColor: activePreviewTab === "inspect" ? "color-mix(in srgb, var(--foreground-primary) 5%, transparent)" : "transparent",
                color: activePreviewTab === "inspect" ? "var(--foreground-primary)" : "var(--foreground-secondary)",
                padding: "6px 12px",
              }}
            >
              <ScanSearch className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">Inspect</span>
            </button>
          </Tooltip>
          <Tooltip content="Code">
            <button
              onClick={() => onPreviewTabChange("code")}
              className="flex items-center justify-center gap-2 rounded transition-colors min-w-0"
              style={{
                backgroundColor: activePreviewTab === "code" ? "color-mix(in srgb, var(--foreground-primary) 5%, transparent)" : "transparent",
                color: activePreviewTab === "code" ? "var(--foreground-primary)" : "var(--foreground-secondary)",
                padding: "6px 12px",
              }}
            >
              <Code2 className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">Code</span>
            </button>
          </Tooltip>
        </div>
      )}

      {/* Agent View Toggle */}
      {onAgentViewChange && (
        <Tooltip content={agentViewEnabled ? "Human View" : "Agent View"}>
          <button
            onClick={() => onAgentViewChange(!agentViewEnabled)}
            className="flex items-center justify-center gap-2 rounded transition-colors min-w-0"
            style={{
              backgroundColor: agentViewEnabled ? "color-mix(in srgb, var(--foreground-primary) 5%, transparent)" : "transparent",
              color: agentViewEnabled ? "var(--foreground-primary)" : "var(--foreground-secondary)",
              padding: "6px 12px",
            }}
          >
            {agentViewEnabled ? (
              <>
                <User className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">Human</span>
              </>
            ) : (
              <>
                <Bot className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">Agent</span>
              </>
            )}
          </button>
        </Tooltip>
      )}

      {/* Separator between Preview/Code/Agent View and other buttons */}
      {((onPreviewTabChange || onAgentViewChange) && (onUndo || onRedo || onExportCode || onShareLink || onToggleFavorite || onDownloadZIP || onSubmit)) && (
        <div 
          className="h-4 border-l"
          style={{
            borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)",
            borderLeftWidth: "1px",
          }}
        />
      )}

      {/* Undo/Redo and Action buttons */}
      <div className="flex items-center gap-2">
      {/* Undo/Redo buttons */}
      {onUndo && (
        <Tooltip content="Undo">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="inline-flex items-center justify-center w-8 h-8 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              color: canUndo ? "var(--foreground-secondary)" : "var(--foreground-tertiary)",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              if (canUndo) {
                e.currentTarget.style.backgroundColor = foregroundMix(5);
                const icon = e.currentTarget.querySelector('svg');
                if (icon) {
                  icon.style.color = "var(--foreground-primary)";
                }
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              const icon = e.currentTarget.querySelector('svg');
              if (icon) {
                icon.style.color = canUndo ? "var(--foreground-secondary)" : "var(--foreground-tertiary)";
              }
            }}
          >
            <Undo2 className="w-4 h-4 transition-colors" style={{ color: canUndo ? "var(--foreground-secondary)" : "var(--foreground-tertiary)" }} />
          </button>
        </Tooltip>
      )}
      {onRedo && (
        <Tooltip content="Redo">
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="inline-flex items-center justify-center w-8 h-8 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              color: canRedo ? "var(--foreground-secondary)" : "var(--foreground-tertiary)",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              if (canRedo) {
                e.currentTarget.style.backgroundColor = foregroundMix(5);
                const icon = e.currentTarget.querySelector('svg');
                if (icon) {
                  icon.style.color = "var(--foreground-primary)";
                }
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              const icon = e.currentTarget.querySelector('svg');
              if (icon) {
                icon.style.color = canRedo ? "var(--foreground-secondary)" : "var(--foreground-tertiary)";
              }
            }}
          >
            <Redo2 className="w-4 h-4 transition-colors" style={{ color: canRedo ? "var(--foreground-secondary)" : "var(--foreground-tertiary)" }} />
          </button>
        </Tooltip>
      )}
      
        {/* Separator between undo/redo and action buttons */}
        {(onUndo || onRedo) && (onExportCode || onShareLink || onToggleFavorite || onDownloadZIP || onSubmit) && (
          <div 
            className="h-4 border-l"
            style={{
              borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)",
              borderLeftWidth: "1px",
            }}
          />
        )}

        {/* Action buttons */}
      {onExportCode && (
        <Tooltip content="Export">
          <Button
            variant="ghost"
            size="sm"
            onClick={onExportCode}
            className="h-8 w-8 p-0 flex items-center justify-center group"
            onMouseEnter={(e) => {
              const icon = e.currentTarget.querySelector('svg');
              if (icon) {
                icon.style.color = "var(--foreground-primary)";
              }
            }}
            onMouseLeave={(e) => {
              const icon = e.currentTarget.querySelector('svg');
              if (icon) {
                icon.style.color = "var(--foreground-secondary)";
              }
            }}
          >
            <Download className="w-4 h-4 transition-colors" style={{ color: "var(--foreground-secondary)" }} />
          </Button>
        </Tooltip>
      )}
      
      {onShareLink && (
        <Tooltip content="Share">
          <Button
            variant="ghost"
            size="sm"
            onClick={onShareLink}
            className="h-8 w-8 p-0 flex items-center justify-center group"
            onMouseEnter={(e) => {
              const icon = e.currentTarget.querySelector('svg');
              if (icon) {
                icon.style.color = "var(--foreground-primary)";
              }
            }}
            onMouseLeave={(e) => {
              const icon = e.currentTarget.querySelector('svg');
              if (icon) {
                icon.style.color = "var(--foreground-secondary)";
              }
            }}
          >
            <Share2 className="w-4 h-4 transition-colors" style={{ color: "var(--foreground-secondary)" }} />
          </Button>
        </Tooltip>
      )}
      
      {onToggleFavorite && (
        <Tooltip content={isFavorite ? "Remove from favorites" : "Add to favorites"}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleFavorite}
            className={`h-8 w-8 p-0 flex items-center justify-center group ${isFavorite ? "text-yellow-400" : ""}`}
            onMouseEnter={(e) => {
              if (!isFavorite) {
                const icon = e.currentTarget.querySelector('svg');
                if (icon) {
                  icon.style.color = "var(--foreground-primary)";
                }
              }
            }}
            onMouseLeave={(e) => {
              if (!isFavorite) {
                const icon = e.currentTarget.querySelector('svg');
                if (icon) {
                  icon.style.color = "var(--foreground-secondary)";
                }
              }
            }}
          >
            <Star 
              className={`w-4 h-4 transition-colors ${isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`}
              style={{ color: isFavorite ? "var(--color-status-warning-base)" : "var(--foreground-secondary)" }}
            />
          </Button>
        </Tooltip>
      )}
      
      {onDownloadZIP && (
        <Tooltip content="Download ZIP">
          <Button
            variant="ghost"
            size="sm"
            onClick={onDownloadZIP}
            className="h-8 w-8 p-0 flex items-center justify-center group"
            onMouseEnter={(e) => {
              const icon = e.currentTarget.querySelector('svg');
              if (icon) {
                icon.style.color = "var(--foreground-primary)";
              }
            }}
            onMouseLeave={(e) => {
              const icon = e.currentTarget.querySelector('svg');
              if (icon) {
                icon.style.color = "var(--foreground-secondary)";
              }
            }}
          >
            <FileDown className="w-4 h-4 transition-colors" style={{ color: "var(--foreground-secondary)" }} />
          </Button>
        </Tooltip>
      )}
      
      {/* Submit button (Milestone 6.3) */}
      {onSubmit && (
        <Tooltip content="Submit for Review">
          <Button
            variant="solid"
            size="sm"
            onClick={onSubmit}
            leadingIcon={<Send className="w-4 h-4" />}
            className="h-8 px-3"
            style={{
              backgroundColor: "var(--foreground-primary)",
              color: "var(--background-primary)",
            }}
          >
            Submit
          </Button>
        </Tooltip>
      )}
      </div>
    </div>
  );
});

