"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Settings, Keyboard, PanelLeft, PanelRight, PanelBottom, BookOpen, Grid2x2, Box } from "lucide-react";
import { foregroundMix } from "@/lib/styles";
import { Tooltip } from "@fragment_ui/ui";


interface PlaygroundTopBarProps {
  isLeftSidebarVisible: boolean;
  isRightSidebarVisible: boolean;
  isTerminalVisible: boolean;
  onToggleLeftSidebar: () => void;
  onToggleRightSidebar: () => void;
  onToggleTerminal: () => void;
  onOpenSettings?: () => void;
  onOpenKeyboardShortcuts?: () => void;
  onOpenTesting?: () => void;
  onRunAllTests?: () => void;
  runningTests?: boolean;
  undoRedoControls?: React.ReactNode;
}

export const PlaygroundTopBar = React.memo(function PlaygroundTopBar({
  isLeftSidebarVisible,
  isRightSidebarVisible,
  isTerminalVisible,
  onToggleLeftSidebar,
  onToggleRightSidebar,
  onToggleTerminal,
  onOpenSettings,
  onOpenKeyboardShortcuts,
  onOpenTesting,
  onRunAllTests,
  runningTests = false,
  undoRedoControls,
}: PlaygroundTopBarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Check active state for navigation links
  const isPlaygroundActive = pathname === "/studio" && !searchParams.get("tab");
  const isLibraryActive = pathname === "/studio" && (searchParams.get("tab") === "library" || searchParams.get("tab") === "components" || searchParams.get("tab") === "blocks");
  const isDraftsActive = pathname === "/studio" && searchParams.get("tab") === "drafts";
  const isReleasesActive = pathname === "/studio" && searchParams.get("tab") === "releases";
  const isExperimentsActive = pathname === "/studio" && searchParams.get("tab") === "experiments";
  const isGovernanceActive = pathname === "/studio" && searchParams.get("tab") === "governance";
  
  // Hide pane toggle buttons for Library, Drafts, Releases, Experiments, and Governance tabs
  const shouldHidePaneButtons = isLibraryActive || isDraftsActive || isReleasesActive || isExperimentsActive || isGovernanceActive;
  
  return (
    <header 
      className="fixed top-0 left-0 right-0 z-[100] border-b bg-[color:var(--background-primary)] flex-shrink-0" 
      style={{ 
        height: "60px",
        borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
        borderBottomWidth: "1px",
        backgroundColor: "var(--background-primary)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
      }}
    >
      <div 
        className="flex w-full items-center justify-between px-4 lg:px-6 relative"
        style={{ 
          height: "60px",
        }}
      >
        <div className="flex items-center gap-4">
          <Link 
            href="http://localhost:3000/docs/get-started/introduction"
            className="hover:opacity-80 transition-opacity"
            style={{ marginLeft: "8px" }}
          >
            <Box 
              className="h-[20px] w-[20px]"
              style={{ width: "20px", height: "20px", color: "var(--foreground-primary)" }}
            />
          </Link>
          <span 
            className="text-sm"
            style={{ color: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)" }}
          >
            /
          </span>
          <h1 className="text-base font-medium">Fragment UI Studio</h1>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-2 ml-4">
            <Link
              href="/studio"
              className="text-sm font-normal rounded-md px-2 py-1 transition-colors"
              style={{ 
                color: "var(--foreground-primary)",
                backgroundColor: isPlaygroundActive ? "color-mix(in srgb, var(--foreground-primary) 5%, transparent)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isPlaygroundActive) {
                  e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--foreground-primary) 5%, transparent)";
                  e.currentTarget.style.color = "var(--foreground-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isPlaygroundActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--foreground-primary)";
                } else {
                  e.currentTarget.style.color = "var(--foreground-primary)";
                }
              }}
            >
              Studio
            </Link>
            <Link
              href="/studio?tab=library"
              className="text-sm font-normal rounded-md px-2 py-1 transition-colors"
              style={{ 
                color: "var(--foreground-primary)",
                backgroundColor: isLibraryActive ? "color-mix(in srgb, var(--foreground-primary) 5%, transparent)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isLibraryActive) {
                  e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--foreground-primary) 5%, transparent)";
                  e.currentTarget.style.color = "var(--foreground-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLibraryActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--foreground-primary)";
                } else {
                  e.currentTarget.style.color = "var(--foreground-primary)";
                }
              }}
            >
              Library
            </Link>
            <Link
              href="/studio?tab=drafts"
              className="text-sm font-normal rounded-md px-2 py-1 transition-colors"
              style={{ 
                color: "var(--foreground-primary)",
                backgroundColor: isDraftsActive ? "color-mix(in srgb, var(--foreground-primary) 5%, transparent)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isDraftsActive) {
                  e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--foreground-primary) 5%, transparent)";
                  e.currentTarget.style.color = "var(--foreground-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isDraftsActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--foreground-primary)";
                } else {
                  e.currentTarget.style.color = "var(--foreground-primary)";
                }
              }}
            >
              Drafts
            </Link>
            <Link
              href="/studio?tab=releases"
              className="text-sm font-normal rounded-md px-2 py-1 transition-colors"
              style={{ 
                color: "var(--foreground-primary)",
                backgroundColor: isReleasesActive ? "color-mix(in srgb, var(--foreground-primary) 5%, transparent)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isReleasesActive) {
                  e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--foreground-primary) 5%, transparent)";
                  e.currentTarget.style.color = "var(--foreground-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isReleasesActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--foreground-primary)";
                } else {
                  e.currentTarget.style.color = "var(--foreground-primary)";
                }
              }}
            >
              Releases
            </Link>
            <Link
              href="/studio?tab=experiments"
              className="text-sm font-normal rounded-md px-2 py-1 transition-colors"
              style={{ 
                color: "var(--foreground-primary)",
                backgroundColor: isExperimentsActive ? "color-mix(in srgb, var(--foreground-primary) 5%, transparent)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isExperimentsActive) {
                  e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--foreground-primary) 5%, transparent)";
                  e.currentTarget.style.color = "var(--foreground-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isExperimentsActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--foreground-primary)";
                } else {
                  e.currentTarget.style.color = "var(--foreground-primary)";
                }
              }}
            >
              Experiments
            </Link>
            <Link
              href="/studio?tab=governance"
              className="text-sm font-normal rounded-md px-2 py-1 transition-colors"
              style={{ 
                color: "var(--foreground-primary)",
                backgroundColor: isGovernanceActive ? "color-mix(in srgb, var(--foreground-primary) 5%, transparent)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isGovernanceActive) {
                  e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--foreground-primary) 5%, transparent)";
                  e.currentTarget.style.color = "var(--foreground-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isGovernanceActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--foreground-primary)";
                } else {
                  e.currentTarget.style.color = "var(--foreground-primary)";
                }
              }}
            >
              Governance
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Undo/Redo Controls */}
          {undoRedoControls}
          {undoRedoControls && !shouldHidePaneButtons && (
            <div 
              className="h-4 border-l"
              style={{
                borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
                borderLeftWidth: "1px",
              }}
            />
          )}
          {/* Toggle buttons for sidebars and terminal - hidden for Library, Drafts, Releases, Experiments, and Governance */}
          {!shouldHidePaneButtons && (
            <>
              <Tooltip content={isLeftSidebarVisible ? "Hide left sidebar" : "Show left sidebar"}>
                <button
                  onClick={onToggleLeftSidebar}
                  className="inline-flex items-center justify-center w-8 h-8 rounded transition-colors"
                  style={{
                    color: isLeftSidebarVisible ? "var(--foreground-secondary)" : "var(--foreground-tertiary)",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = foregroundMix(5);
                    e.currentTarget.style.color = "var(--foreground-primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = isLeftSidebarVisible ? "var(--foreground-secondary)" : "var(--foreground-tertiary)";
                  }}
                >
                  <PanelLeft className="w-4 h-4" />
                </button>
              </Tooltip>
              <Tooltip content={isRightSidebarVisible ? "Hide right sidebar" : "Show right sidebar"}>
                <button
                  onClick={onToggleRightSidebar}
                  className="inline-flex items-center justify-center w-8 h-8 rounded transition-colors"
                  style={{
                    color: isRightSidebarVisible ? "var(--foreground-secondary)" : "var(--foreground-tertiary)",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = foregroundMix(5);
                    e.currentTarget.style.color = "var(--foreground-primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = isRightSidebarVisible ? "var(--foreground-secondary)" : "var(--foreground-tertiary)";
                  }}
                >
                  <PanelRight className="w-4 h-4" />
                </button>
              </Tooltip>
              <Tooltip content={isTerminalVisible ? "Hide terminal" : "Show terminal"}>
                <button
                  onClick={onToggleTerminal}
                  className="inline-flex items-center justify-center w-8 h-8 rounded transition-colors"
                  style={{
                    color: isTerminalVisible ? "var(--foreground-secondary)" : "var(--foreground-tertiary)",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = foregroundMix(5);
                    e.currentTarget.style.color = "var(--foreground-primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = isTerminalVisible ? "var(--foreground-secondary)" : "var(--foreground-tertiary)";
                  }}
                >
                  <PanelBottom className="w-4 h-4" />
                </button>
              </Tooltip>
            </>
          )}
          {onOpenKeyboardShortcuts && !shouldHidePaneButtons && (
            <>
              <div 
                className="h-4 border-l"
                style={{
                  borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
                  borderLeftWidth: "1px",
                }}
              />
              <Tooltip content="Keyboard Shortcuts (Cmd+?)">
                <button
                  onClick={onOpenKeyboardShortcuts}
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
                  <Keyboard className="w-4 h-4" />
                </button>
              </Tooltip>
            </>
          )}
          {!shouldHidePaneButtons && (
            <>
              <div 
                className="h-4 border-l"
                style={{
                  borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
                  borderLeftWidth: "1px",
                }}
              />
              <Tooltip content="API Documentation">
                <a
                  href="http://localhost:3000/docs/api"
                  target="_blank"
                  rel="noopener noreferrer"
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
                  <BookOpen className="w-4 h-4" />
                </a>
              </Tooltip>
            </>
          )}
          {onOpenSettings && !shouldHidePaneButtons && (
            <>
              <div 
                className="h-4 border-l"
                style={{
                  borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
                  borderLeftWidth: "1px",
                }}
              />
              <Tooltip content="AI Copilot Settings">
                <button
                  onClick={onOpenSettings}
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
                  <Settings className="w-4 h-4" />
                </button>
              </Tooltip>
            </>
          )}
        </div>
      </div>
    </header>
  );
});

