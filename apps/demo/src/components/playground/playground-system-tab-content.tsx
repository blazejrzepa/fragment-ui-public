"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { toast } from "@fragment_ui/ui";
import type { Registry } from "@/types/registry";

// Dynamic imports for system tab views
const CodeHistoryView = dynamic(() => import("@/components/playground/code-history-view").then(mod => ({ default: mod.CodeHistoryView })), {
  loading: () => <div className="flex items-center justify-center h-full"><div className="text-sm" style={{ color: "var(--foreground-secondary)" }}>Loading...</div></div>,
  ssr: false,
});

const KeyboardShortcutsView = dynamic(() => import("@/components/playground/keyboard-shortcuts-view").then(mod => ({ default: mod.KeyboardShortcutsView })), {
  loading: () => <div className="flex items-center justify-center h-full"><div className="text-sm" style={{ color: "var(--foreground-secondary)" }}>Loading...</div></div>,
  ssr: false,
});

const CopilotSettingsView = dynamic(() => import("@/components/playground/copilot-settings-view").then(mod => ({ default: mod.CopilotSettingsView })), {
  loading: () => <div className="flex items-center justify-center h-full"><div className="text-sm" style={{ color: "var(--foreground-secondary)" }}>Loading...</div></div>,
  ssr: false,
});

const ComponentLibraryBrowser = dynamic(() => import("@/components/playground/component-library-browser").then(mod => ({ default: mod.ComponentLibraryBrowser })), {
  loading: () => <div className="flex items-center justify-center h-full"><div className="text-sm" style={{ color: "var(--foreground-secondary)" }}>Loading...</div></div>,
  ssr: false,
});

interface CodeHistoryState {
  past: Array<{
    id: string;
    code: string;
    timestamp: number;
    message?: string;
    author?: "user" | "ai" | "system";
    type?: "generation" | "edit" | "patch" | "manual";
  }>;
  present: {
    id: string;
    code: string;
    timestamp: number;
    message?: string;
    author?: "user" | "ai" | "system";
    type?: "generation" | "edit" | "patch" | "manual";
  } | null;
  future: Array<{
    id: string;
    code: string;
    timestamp: number;
    message?: string;
    author?: "user" | "ai" | "system";
    type?: "generation" | "edit" | "patch" | "manual";
  }>;
}

interface PlaygroundSystemTabContentProps {
  activeSystemTab: "history" | "settings" | "keyboard" | "components" | "testing" | null;
  activeSystemTabs: Set<"history" | "settings" | "keyboard" | "components" | "testing">;
  
  // History tab props
  codeHistoryState?: CodeHistoryState;
  onSelectCommit?: (commitId: string) => void;
  
  // Components tab props
  registry?: Registry | null;
  selectedDsComponent?: string | null;
  setCode?: React.Dispatch<React.SetStateAction<string>>;
  addCommit?: (code: string, metadata?: { message?: string; author?: "user" | "ai" | "system"; type?: "generation" | "edit" | "patch" | "manual" }) => void;
}

export function PlaygroundSystemTabContent({
  activeSystemTab,
  activeSystemTabs,
  codeHistoryState,
  onSelectCommit,
  registry,
  selectedDsComponent,
  setCode,
  addCommit,
}: PlaygroundSystemTabContentProps) {
  // History tab
  if (activeSystemTab === "history" && activeSystemTabs.has("history")) {
    if (!codeHistoryState || !onSelectCommit) return null;
    
    return (
      <div style={{ position: "relative", zIndex: 0, pointerEvents: "auto" }}>
        <CodeHistoryView
          history={codeHistoryState}
          currentCommitId={codeHistoryState.present?.id}
          onSelectCommit={onSelectCommit}
        />
      </div>
    );
  }

  // Keyboard tab
  if (activeSystemTab === "keyboard" && activeSystemTabs.has("keyboard")) {
    return (
      <div style={{ position: "relative", zIndex: 0, pointerEvents: "auto" }}>
        <KeyboardShortcutsView />
      </div>
    );
  }

  // Settings tab
  if (activeSystemTab === "settings" && activeSystemTabs.has("settings")) {
    return (
      <div style={{ position: "relative", zIndex: 0, pointerEvents: "auto" }}>
        <CopilotSettingsView
          onSave={(settings) => {
            toast.success("Settings saved");
          }}
        />
      </div>
    );
  }

  // Components tab
  if (activeSystemTab === "components" && activeSystemTabs.has("components") && registry) {
    if (!setCode || !addCommit) return null;
    
    return (
      <div style={{ position: "relative", zIndex: 0, pointerEvents: "auto", height: "100%" }}>
        <ComponentLibraryBrowser
          registry={registry}
          initialSelectedComponent={selectedDsComponent || undefined}
          onInsertCode={(code) => {
            // Insert code at cursor position or append to current code
            if (code) {
              const newCode = code.trim();
              setCode(prev => {
                const updatedCode = prev ? prev + "\n\n" + newCode : newCode;
                // Add commit to history
                addCommit(updatedCode, {
                  message: "Inserted component from library",
                  author: "user",
                  type: "manual",
                });
                return updatedCode;
              });
            }
          }}
        />
      </div>
    );
  }

  return null;
}

