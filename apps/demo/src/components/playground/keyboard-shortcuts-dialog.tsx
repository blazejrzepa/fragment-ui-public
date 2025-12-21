"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@fragment_ui/ui";
import { Keyboard } from "lucide-react";

interface KeyboardShortcut {
  keys: string[];
  description: string;
  category: "general" | "editing" | "navigation" | "actions";
}

const SHORTCUTS: KeyboardShortcut[] = [
  // General
  {
    keys: ["Cmd", "Z"],
    description: "Undo last change",
    category: "general",
  },
  {
    keys: ["Cmd", "Shift", "Z"],
    description: "Redo last change",
    category: "general",
  },
  {
    keys: ["Cmd", "Y"],
    description: "Redo last change (alternative)",
    category: "general",
  },
  {
    keys: ["Cmd", "?"],
    description: "Show keyboard shortcuts",
    category: "general",
  },
  {
    keys: ["Cmd", "K"],
    description: "Show keyboard shortcuts (alternative)",
    category: "general",
  },
  // Actions
  {
    keys: ["Enter"],
    description: "Send message",
    category: "actions",
  },
  {
    keys: ["Shift", "Enter"],
    description: "New line in message",
    category: "actions",
  },
  // Navigation
  {
    keys: ["Alt", "T"],
    description: "Toggle notifications",
    category: "navigation",
  },
];

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Format single key for display
 */
function formatKey(key: string): string {
  const isMac = typeof window !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  
  if (key === "Cmd") {
    return isMac ? "⌘" : "Ctrl";
  }
  if (key === "Shift") {
    return isMac ? "⇧" : "Shift";
  }
  if (key === "Alt") {
    return isMac ? "⌥" : "Alt";
  }
  if (key === "Enter") {
    return "↵";
  }
  if (key === "?") {
    return "?";
  }
  return key;
}

/**
 * Keyboard Shortcuts Dialog - displays all available keyboard shortcuts
 */
export const KeyboardShortcutsDialog = React.memo(function KeyboardShortcutsDialog({
  open,
  onOpenChange,
}: KeyboardShortcutsDialogProps) {
  const shortcutsByCategory = React.useMemo(() => {
    const grouped: Record<string, KeyboardShortcut[]> = {
      general: [],
      editing: [],
      navigation: [],
      actions: [],
    };
    
    SHORTCUTS.forEach(shortcut => {
      grouped[shortcut.category].push(shortcut);
    });
    
    return grouped;
  }, []);

  const categoryLabels: Record<string, string> = {
    general: "General",
    editing: "Editing",
    navigation: "Navigation",
    actions: "Actions",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            All available keyboard shortcuts in the Playground
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {Object.entries(shortcutsByCategory).map(([category, shortcuts]) => {
            if (shortcuts.length === 0) return null;
            
            return (
              <div key={category}>
                <h3 className="text-sm font-semibold text-[color:var(--foreground-primary)] mb-3">
                  {categoryLabels[category]}
                </h3>
                <div className="space-y-2">
                  {shortcuts.map((shortcut, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 px-3 rounded"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--foreground-primary) 3%, transparent)",
                      }}
                    >
                      <span className="text-sm text-[color:var(--foreground-secondary)]">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIdx) => (
                          <React.Fragment key={keyIdx}>
                            <kbd
                              className="px-2 py-1 text-xs font-mono rounded"
                              style={{
                                backgroundColor: "var(--color-surface-2)",
                                border: "1px solid color-mix(in srgb, var(--foreground-primary) 10%, transparent)",
                                color: "var(--foreground-primary)",
                                minWidth: "24px",
                                textAlign: "center",
                              }}
                            >
                              {formatKey(key)}
                            </kbd>
                            {keyIdx < shortcut.keys.length - 1 && (
                              <span className="text-xs text-[color:var(--foreground-tertiary)] mx-1">
                                +
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
});

