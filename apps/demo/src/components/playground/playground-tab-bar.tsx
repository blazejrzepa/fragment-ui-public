"use client";

import * as React from "react";
import { X, GitBranch, Settings, Box, Component, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@fragment_ui/ui";
import type { UIProject } from "@/hooks/use-ui-projects";

interface PlaygroundTabBarProps {
  // Current tab
  currentTab: string | null;
  
  // Projects and tabs data
  uiProjects: UIProject[];
  dsComponentTabs: Map<string, { name: string; code: string }>;
  code: string;
  
  // Active states
  activeProjectId: string | null;
  activeSystemTab: "history" | "settings" | "keyboard" | "components" | "testing" | null;
  activeSystemTabs: Set<"history" | "settings" | "keyboard" | "components" | "testing">;
  activeDsComponentTab: string | null;
  
  // Handlers
  handleSwitchProject: (projectId: string) => void;
  handleCloseProject: (projectId: string, e: React.MouseEvent) => void;
  handleCloseAllTabs: () => void;
  setActiveSystemTab: React.Dispatch<React.SetStateAction<"history" | "settings" | "keyboard" | "components" | "testing" | null>>;
  setActiveSystemTabs: React.Dispatch<React.SetStateAction<Set<"history" | "settings" | "keyboard" | "components" | "testing">>>;
  setActiveDsComponentTab: (tab: string | null) => void;
  setActivePreviewTab: (tab: "new-component" | "preview" | "code") => void;
  setCode: (code: string) => void;
  setDsComponentTabs: React.Dispatch<React.SetStateAction<Map<string, { name: string; code: string }>>>;
  setActiveProjectId: (id: string | null) => void;
}

export function PlaygroundTabBar({
  currentTab,
  uiProjects,
  dsComponentTabs,
  code,
  activeProjectId,
  activeSystemTab,
  activeSystemTabs,
  activeDsComponentTab,
  handleSwitchProject,
  handleCloseProject,
  handleCloseAllTabs,
  setActiveSystemTab,
  setActiveSystemTabs,
  setActiveDsComponentTab,
  setActivePreviewTab,
  setCode,
  setDsComponentTabs,
  setActiveProjectId,
}: PlaygroundTabBarProps) {
  // Only show for playground tab
  if (currentTab !== "playground" && currentTab !== null) {
    return null;
  }

  // Check if we should show the tab bar
  const hasTabs = uiProjects.filter(p => p.isOpen !== false).length > 0 || 
                  dsComponentTabs.size > 0 || 
                  code || 
                  activeSystemTabs.size > 0;

  if (!hasTabs) {
    return null;
  }

  return (
    <div className="flex-shrink-0 border-b" style={{ borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)", borderBottomWidth: "1px", height: "40px", position: "relative", zIndex: 10 }}>
      <div className="flex items-center overflow-x-auto h-full" style={{ scrollbarWidth: "thin", position: "relative", zIndex: 10 }}>
        {/* UI Project Tabs */}
        {uiProjects.filter(p => p.isOpen !== false).map((project) => {
          const isProjectActive = activeProjectId === project.id;
          const isSystemTabOpen = activeSystemTab !== null && activeSystemTabs.size > 0;
          const isActive = isProjectActive && !isSystemTabOpen;
          
          return (
            <div
              key={project.id}
              data-project-tab="true"
              data-active={isActive ? "true" : "false"}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setActiveSystemTab(null);
                setActiveDsComponentTab(null);
                handleSwitchProject(project.id);
                setActivePreviewTab(project.code ? "preview" : "new-component");
              }}
              className="inline-flex items-center cursor-pointer flex-shrink-0 h-full transition-colors"
              style={{
                display: "inline-flex",
                padding: "var(--spacing-xs, 6px) var(--spacing-lg, 12px)",
                alignItems: "center",
                gap: "var(--spacing-sm, 8px)",
                borderRight: "1px solid color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                color: isActive 
                  ? "var(--foreground-primary, #FAFAFA)" 
                  : (isSystemTabOpen ? "var(--foreground-tertiary)" : "var(--foreground-secondary, #737373)"),
                fontFamily: "Geist, sans-serif",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "160%",
                backgroundColor: isActive 
                  ? "var(--background-primary)" 
                  : (isSystemTabOpen ? "var(--background-primary)" : "var(--color-surface-base)"),
                position: "relative",
                zIndex: isActive 
                  ? 3 
                  : (isSystemTabOpen ? 2 : 1),
                pointerEvents: "auto",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--foreground-primary) 2%, transparent)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "var(--color-surface-base)";
                }
              }}
            >
              <Box 
                className="w-4 h-4 flex-shrink-0" 
                style={{ color: isActive ? "var(--foreground-primary)" : (isSystemTabOpen ? "var(--foreground-tertiary)" : "var(--foreground-secondary)") }}
              />
              <span 
                className="truncate max-w-[120px]"
                title={project.title}
              >
                {project.title}
              </span>
              <button
                onClick={(e) => handleCloseProject(project.id, e)}
                className="flex-shrink-0 w-4 h-4 flex items-center justify-center rounded hover:bg-[color:var(--color-surface-2)] transition-colors"
                aria-label="Close project"
              >
                <X className="w-3 h-3" style={{ color: "var(--foreground-secondary)" }} />
              </button>
            </div>
          );
        })}

        {/* DS Component Tabs */}
        {Array.from(dsComponentTabs.entries()).map(([tabId, tab]) => {
          const isDsTabActive = activeDsComponentTab === tabId;
          const isSystemTabOpen = activeSystemTab !== null && activeSystemTabs.size > 0;
          const isActive = isDsTabActive && !isSystemTabOpen;
          
          return (
            <div
              key={tabId}
              data-ds-component-tab="true"
              data-active={isActive ? "true" : "false"}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setActiveDsComponentTab(tabId);
                setCode(tab.code);
                console.log(`[DS Components] Activated tab "${tab.name}", code length: ${tab.code.length}`, {
                  hasDefaultExport: tab.code.includes('export default'),
                  codePreview: tab.code.substring(0, 150) + '...'
                });
                setActiveProjectId(null);
                setActiveSystemTab(null);
                setActivePreviewTab("preview");
              }}
              className="inline-flex items-center cursor-pointer flex-shrink-0 h-full transition-colors"
              style={{
                display: "inline-flex",
                padding: "var(--spacing-xs, 6px) var(--spacing-lg, 12px)",
                alignItems: "center",
                gap: "var(--spacing-sm, 8px)",
                borderRight: "1px solid color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                color: isActive 
                  ? "var(--foreground-primary, #FAFAFA)" 
                  : (isSystemTabOpen ? "var(--foreground-tertiary)" : "var(--foreground-secondary, #737373)"),
                fontFamily: "Geist, sans-serif",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "160%",
                backgroundColor: isActive 
                  ? "var(--background-primary)" 
                  : (isSystemTabOpen ? "var(--background-primary)" : "var(--color-surface-base)"),
                position: "relative",
                zIndex: isActive 
                  ? 3 
                  : (isSystemTabOpen ? 2 : 1),
                pointerEvents: "auto",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--foreground-primary) 2%, transparent)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "var(--color-surface-base)";
                }
              }}
            >
              <Component 
                className="w-4 h-4 flex-shrink-0" 
                style={{ color: isActive ? "var(--foreground-primary)" : (isSystemTabOpen ? "var(--foreground-tertiary)" : "var(--foreground-secondary)") }}
              />
              <span 
                className="truncate max-w-[120px]"
                title={tab.name}
              >
                {tab.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDsComponentTabs(prev => {
                    const next = new Map(prev);
                    next.delete(tabId);
                    return next;
                  });
                  if (activeDsComponentTab === tabId) {
                    setActiveDsComponentTab(null);
                    setCode("");
                    setActivePreviewTab("new-component");
                  }
                }}
                className="flex-shrink-0 w-4 h-4 flex items-center justify-center rounded hover:bg-[color:var(--color-surface-2)] transition-colors"
                aria-label="Close component"
              >
                <X className="w-3 h-3" style={{ color: "var(--foreground-secondary)" }} />
              </button>
            </div>
          );
        })}

        {/* System Tabs */}
        {activeSystemTabs.has("history") && (
          <div
            data-system-tab="history"
            className="inline-flex items-center flex-shrink-0 h-full transition-colors cursor-pointer"
            style={{
              display: "inline-flex",
              padding: "var(--spacing-xs, 6px) var(--spacing-lg, 12px)",
              alignItems: "center",
              gap: "var(--spacing-sm, 8px)",
              borderRight: "1px solid color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
              color: activeSystemTab === "history" ? "var(--foreground-primary, #FAFAFA)" : "var(--foreground-tertiary)",
              fontFamily: "Geist, sans-serif",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "160%",
              backgroundColor: "var(--background-primary)",
              position: "relative",
              zIndex: activeSystemTab === "history" ? 2 : 1,
              pointerEvents: "auto",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setActiveSystemTab("history");
            }}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>History</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveSystemTabs((prev: Set<"history" | "settings" | "keyboard" | "components" | "testing">) => {
                  const next = new Set(prev);
                  next.delete("history");
                  setActiveSystemTab((current: "history" | "settings" | "keyboard" | "components" | "testing" | null) => current === "history" ? (next.size > 0 ? (Array.from(next)[0] as "history" | "settings" | "keyboard" | "components" | "testing") : null) : current);
                  return next;
                });
              }}
              className="flex-shrink-0 w-4 h-4 flex items-center justify-center rounded hover:bg-[color:var(--color-surface-2)] transition-colors"
              aria-label="Close history"
            >
              <X className="w-3 h-3" style={{ color: "var(--foreground-secondary)" }} />
            </button>
          </div>
        )}

        {activeSystemTabs.has("keyboard") && (
          <div
            data-system-tab="keyboard"
            className="inline-flex items-center flex-shrink-0 h-full transition-colors cursor-pointer"
            style={{
              display: "inline-flex",
              padding: "var(--spacing-xs, 6px) var(--spacing-lg, 12px)",
              alignItems: "center",
              gap: "var(--spacing-sm, 8px)",
              borderRight: "1px solid color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
              color: activeSystemTab === "keyboard" ? "var(--foreground-primary, #FAFAFA)" : "var(--foreground-tertiary)",
              fontFamily: "Geist, sans-serif",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "160%",
              backgroundColor: "var(--background-primary)",
              position: "relative",
              zIndex: activeSystemTab === "keyboard" ? 2 : 1,
              pointerEvents: "auto",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setActiveSystemTab("keyboard");
            }}
          >
            <span>Keyboard</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveSystemTabs((prev: Set<"history" | "settings" | "keyboard" | "components" | "testing">) => {
                  const next = new Set(prev);
                  next.delete("keyboard");
                  setActiveSystemTab((current: "history" | "settings" | "keyboard" | "components" | "testing" | null) => current === "keyboard" ? (next.size > 0 ? (Array.from(next)[0] as "history" | "settings" | "keyboard" | "components" | "testing") : null) : current);
                  return next;
                });
              }}
              className="flex-shrink-0 w-4 h-4 flex items-center justify-center rounded hover:bg-[color:var(--color-surface-2)] transition-colors"
              aria-label="Close keyboard"
            >
              <X className="w-3 h-3" style={{ color: "var(--foreground-secondary)" }} />
            </button>
          </div>
        )}

        {activeSystemTabs.has("settings") && (
          <div
            data-system-tab="settings"
            className="inline-flex items-center flex-shrink-0 h-full transition-colors cursor-pointer"
            style={{
              display: "inline-flex",
              padding: "var(--spacing-xs, 6px) var(--spacing-lg, 12px)",
              alignItems: "center",
              gap: "var(--spacing-sm, 8px)",
              borderRight: "1px solid color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
              color: activeSystemTab === "settings" ? "var(--foreground-primary, #FAFAFA)" : "var(--foreground-tertiary)",
              fontFamily: "Geist, sans-serif",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "160%",
              backgroundColor: "var(--background-primary)",
              position: "relative",
              zIndex: activeSystemTab === "settings" ? 2 : 1,
              pointerEvents: "auto",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setActiveSystemTab("settings");
            }}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveSystemTabs((prev: Set<"history" | "settings" | "keyboard" | "components" | "testing">) => {
                  const next = new Set(prev);
                  next.delete("settings");
                  setActiveSystemTab((current: "history" | "settings" | "keyboard" | "components" | "testing" | null) => current === "settings" ? (next.size > 0 ? (Array.from(next)[0] as "history" | "settings" | "keyboard" | "components" | "testing") : null) : current);
                  return next;
                });
              }}
              className="flex-shrink-0 w-4 h-4 flex items-center justify-center rounded hover:bg-[color:var(--color-surface-2)] transition-colors"
              aria-label="Close settings"
            >
              <X className="w-3 h-3" style={{ color: "var(--foreground-secondary)" }} />
            </button>
          </div>
        )}

        {activeSystemTabs.has("components") && (
          <div
            data-system-tab="components"
            className="inline-flex items-center flex-shrink-0 h-full transition-colors cursor-pointer"
            style={{
              display: "inline-flex",
              padding: "var(--spacing-xs, 6px) var(--spacing-lg, 12px)",
              alignItems: "center",
              gap: "var(--spacing-sm, 8px)",
              borderRight: "1px solid color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
              color: activeSystemTab === "components" ? "var(--foreground-primary, #FAFAFA)" : "var(--foreground-tertiary)",
              fontFamily: "Geist, sans-serif",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "160%",
              backgroundColor: "var(--background-primary)",
              position: "relative",
              zIndex: activeSystemTab === "components" ? 2 : 1,
              pointerEvents: "auto",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setActiveSystemTab("components");
            }}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Components</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveSystemTabs((prev: Set<"history" | "settings" | "keyboard" | "components" | "testing">) => {
                  const next = new Set(prev);
                  next.delete("components");
                  setActiveSystemTab((current: "history" | "settings" | "keyboard" | "components" | "testing" | null) => current === "components" ? (next.size > 0 ? (Array.from(next)[0] as "history" | "settings" | "keyboard" | "components" | "testing") : null) : current);
                  return next;
                });
              }}
              className="flex-shrink-0 w-4 h-4 flex items-center justify-center rounded hover:bg-[color:var(--color-surface-2)] transition-colors"
              aria-label="Close components"
            >
              <X className="w-3 h-3" style={{ color: "var(--foreground-secondary)" }} />
            </button>
          </div>
        )}

        {/* Close All Menu Button */}
        {(uiProjects.filter(p => p.isOpen !== false).length > 0 || dsComponentTabs.size > 0 || activeSystemTabs.size > 0) && (
          <div className="flex-shrink-0 ml-auto px-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded hover:bg-[color:var(--color-surface-2)] transition-colors"
                  aria-label="Tab menu"
                  style={{ color: "var(--foreground-secondary)" }}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end"
                className="border-0 rounded-[6px] min-w-[180px]"
                style={{ border: "none", borderRadius: "6px", minWidth: "180px" }}
              >
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseAllTabs();
                  }}
                >
                  <X className="w-4 h-4 mr-2" style={{ color: "var(--foreground-secondary)" }} />
                  Close All
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
}
