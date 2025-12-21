"use client";

import React from "react";
import { Eye, Code2 } from "lucide-react";
import { Tooltip } from "@fragment_ui/ui";

interface PreviewCodeTabsProps {
  activePreviewTab: "preview" | "code" | "new-component";
  onPreviewTabChange: (tab: "preview" | "code") => void;
  hasCode?: boolean;
}

export const PreviewCodeTabs = React.memo(function PreviewCodeTabs({
  activePreviewTab,
  onPreviewTabChange,
  hasCode = false,
}: PreviewCodeTabsProps) {
  if (!hasCode || !activePreviewTab || (activePreviewTab !== "preview" && activePreviewTab !== "code")) {
    return null;
  }

  return (
    <div 
      className="fixed left-1/2 transform -translate-x-1/2"
      style={{
        bottom: "32px",
        zIndex: 9999,
        pointerEvents: "auto",
      }}
    >
      <div 
        className="flex gap-1 bg-[color:var(--color-surface-base)] border rounded-lg shadow-lg" 
        style={{ 
          backgroundColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)", 
          borderRadius: "6px", 
          padding: "2px", 
          borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)" 
        }}
      >
        <Tooltip content="Preview - View the generated component">
          <button
            onClick={() => onPreviewTabChange("preview")}
            className="flex items-center justify-center gap-2 rounded transition-colors min-w-0"
            style={{
              backgroundColor: activePreviewTab === "preview" ? "var(--background-primary)" : "transparent",
              color: activePreviewTab === "preview" ? "var(--foreground-primary)" : "var(--foreground-secondary)",
              padding: "6px 12px",
            }}
          >
            <Eye className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">Preview</span>
          </button>
        </Tooltip>
        <Tooltip content="Code - View and copy the generated code">
          <button
            onClick={() => onPreviewTabChange("code")}
            className="flex items-center justify-center gap-2 rounded transition-colors min-w-0"
            style={{
              backgroundColor: activePreviewTab === "code" ? "var(--background-primary)" : "transparent",
              color: activePreviewTab === "code" ? "var(--foreground-primary)" : "var(--foreground-secondary)",
              padding: "6px 12px",
            }}
          >
            <Code2 className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">Code</span>
          </button>
        </Tooltip>
      </div>
    </div>
  );
});

