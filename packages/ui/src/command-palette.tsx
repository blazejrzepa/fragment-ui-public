"use client";

import * as React from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./command";
import { Button } from "./button";

export interface CommandPaletteAction {
  id: string;
  label: string;
  keywords?: string[];
  shortcut?: string;
  icon?: React.ReactNode;
  onSelect?: () => void;
  group?: string;
  children?: CommandPaletteAction[]; // Nested commands
}

export interface CommandPaletteProps {
  actions?: CommandPaletteAction[];
  trigger?: React.ReactNode;
  placeholder?: string;
  emptyText?: string;
  showRecentCommands?: boolean;
  maxRecentCommands?: number;
  recentCommandsStorageKey?: string;
}

export function CommandPalette({
  actions = [],
  trigger,
  placeholder = "Type a command or search...",
  emptyText = "No results found.",
  showRecentCommands = true,
  maxRecentCommands = 5,
  recentCommandsStorageKey = "command-palette-recent",
}: CommandPaletteProps) {
  // Ensure actions is always an array
  const safeActions = React.useMemo(() => {
    if (!actions || !Array.isArray(actions)) {
      return [];
    }
    return actions;
  }, [actions]);
  
  const [open, setOpen] = React.useState(false);
  const [recentCommands, setRecentCommands] = React.useState<string[]>([]);

  // Load recent commands from localStorage
  React.useEffect(() => {
    if (showRecentCommands && typeof window !== "undefined") {
      const stored = localStorage.getItem(recentCommandsStorageKey);
      if (stored) {
        try {
          setRecentCommands(JSON.parse(stored));
        } catch {
          // Invalid JSON, ignore
        }
      }
    }
  }, [showRecentCommands, recentCommandsStorageKey]);

  // Save recent commands to localStorage
  const saveRecentCommand = React.useCallback(
    (commandId: string) => {
      if (!showRecentCommands) return;
      setRecentCommands((prev) => {
        const filtered = prev.filter((id) => id !== commandId);
        const updated = [commandId, ...filtered].slice(0, maxRecentCommands);
        if (typeof window !== "undefined") {
          localStorage.setItem(recentCommandsStorageKey, JSON.stringify(updated));
        }
        return updated;
      });
    },
    [showRecentCommands, maxRecentCommands, recentCommandsStorageKey]
  );

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Flatten nested commands
  const flattenActions = React.useCallback((actions: CommandPaletteAction[] | undefined): CommandPaletteAction[] => {
    try {
    if (!actions || !Array.isArray(actions) || actions.length === 0) {
      return [];
    }
    const flattened: CommandPaletteAction[] = [];
      if (Array.isArray(actions)) {
    actions.forEach((action) => {
          if (!action) return; // Skip null/undefined actions
          if (action.children && Array.isArray(action.children) && action.children.length > 0) {
        // Add parent as a category
        flattened.push({ ...action, children: undefined });
        // Add children with parent prefix
            if (Array.isArray(action.children)) {
        action.children.forEach((child) => {
                if (child) { // Skip null/undefined children
          flattened.push({
            ...child,
            label: `${action.label} > ${child.label}`,
            group: action.group || child.group,
          });
                }
        });
            }
      } else {
        flattened.push(action);
      }
    });
      }
      return flattened || [];
    } catch (error) {
      console.error("[CommandPalette] Error flattening actions:", error);
      return [];
    }
  }, []);

  const groupedActions = React.useMemo(() => {
    try {
    if (!safeActions || !Array.isArray(safeActions) || safeActions.length === 0) {
      return {};
    }
    const flattened = flattenActions(safeActions);
      if (!flattened || !Array.isArray(flattened) || flattened.length === 0) {
        return {};
      }
    const groups: Record<string, CommandPaletteAction[]> = {};
      if (Array.isArray(flattened)) {
    flattened.forEach((action) => {
          if (!action) return; // Skip null/undefined actions
      const group = action.group || "General";
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(action);
    });
      }
    return groups;
    } catch (error) {
      console.error("[CommandPalette] Error grouping actions:", error);
      return {};
    }
  }, [safeActions, flattenActions]);

  // Get recent command actions
  const recentCommandActions = React.useMemo(() => {
    if (!showRecentCommands || recentCommands.length === 0 || !safeActions || !Array.isArray(safeActions) || safeActions.length === 0) return [];
    const flattened = flattenActions(safeActions);
    if (!flattened || !Array.isArray(flattened) || flattened.length === 0) return [];
    const allActionsMap = new Map(flattened.map((a) => [a.id, a]));
    return recentCommands
      .map((id) => allActionsMap.get(id))
      .filter((action): action is CommandPaletteAction => action !== undefined);
  }, [safeActions, recentCommands, showRecentCommands, flattenActions]);

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : (
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="w-full justify-between"
        >
          Search...{" "}
          <span className="text-xs text-[color:var(--color-fg-muted)]">
            ⌘K
          </span>
        </Button>
      )}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={placeholder} />
        <CommandList>
          <CommandEmpty>{emptyText}</CommandEmpty>
          {showRecentCommands && recentCommandActions.length > 0 && (
            <CommandGroup heading="Recent">
              {recentCommandActions.map((action) => (
                <CommandItem
                  key={action.id}
                  value={`${action.label} ${action.keywords?.join(" ") || ""}`}
                  onSelect={() => {
                    action.onSelect?.();
                    saveRecentCommand(action.id);
                    setOpen(false);
                  }}
                >
                  {action.icon}
                  <span>{action.label}</span>
                  {action.shortcut && (
                    <CommandShortcut>{action.shortcut}</CommandShortcut>
                  )}
                </CommandItem>
              ))}
              <CommandSeparator />
            </CommandGroup>
          )}
          {Object.entries(groupedActions).map(([groupName, groupActions]) => (
            <CommandGroup key={groupName} heading={groupName}>
              {groupActions.map((action) => (
                <CommandItem
                  key={action.id}
                  value={`${action.label} ${action.keywords?.join(" ") || ""}`}
                  onSelect={() => {
                    action.onSelect?.();
                    saveRecentCommand(action.id);
                    setOpen(false);
                  }}
                >
                  {action.icon}
                  <span>{action.label}</span>
                  {action.shortcut && (
                    <CommandShortcut>{action.shortcut}</CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}


