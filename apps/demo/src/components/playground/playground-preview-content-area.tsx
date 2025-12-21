"use client";

import * as React from "react";
import { PlaygroundWelcome } from "./playground-welcome";
import { PlaygroundPreviewCode } from "./playground-preview-code";
import type { UIProject } from "@/hooks/use-ui-projects";
import type { A11yResults } from "@/types/preview";
import {
  createUpdateTextHandler,
  createDeleteElementHandler,
  createDuplicateElementHandler,
  type DSLElementHandlerDependencies,
} from "@/lib/playground/dsl-element-handlers";

interface PlaygroundPreviewContentAreaProps {
  // Current tab state
  currentTab: string | null;
  activeSystemTab: "history" | "settings" | "keyboard" | "components" | "testing" | null;
  activeDsComponentTab: string | null;
  activePreviewTab: "new-component" | "preview" | "code" | "inspect";
  
  // Projects and code
  uiProjects: UIProject[];
  code: string;
  activeProjectId: string | null;
  activeProject: UIProject | null;
  
  // State and setters
  isRightSidebarVisible: boolean;
  setIsRightSidebarVisible: (value: boolean | ((prev: boolean) => boolean)) => void;
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleSendMessage: (prompt?: string, createNewSession?: boolean) => void;
  
  // Preview state
  previewZoom: number;
  setPreviewZoom: (value: number) => void;
  isGenerating: boolean;
  isCurrentlyGenerating: boolean;
  selectedElementId: string | null;
  setSelectedElementId: (value: string | null) => void;
  setActiveCopilotTab: (tab: "chat" | "inspector") => void;
  
  // Code history
  canUndoCode: boolean;
  canRedoCode: boolean;
  handleUndo: () => void;
  handleRedo: () => void;
  
  // Handlers
  handleCopyCode: () => void;
  handlePreviewError: (error: Error) => void;
  handleA11yResults: (results: A11yResults) => void;
  handleExportCode: () => void;
  handleCopyDSL: () => void;
  handleShareLink: () => void;
  handleDownloadZIP: () => void;
  handleSubmit: () => void;
  handleToggleFavorite: () => void;
  setActivePreviewTab: (tab: "new-component" | "preview" | "code" | "inspect") => void;
  
  // DSL Element Handlers
  dslElementHandlers: {
    onUpdateText: (elementId: string, newText: string, path: string) => Promise<void>;
    onDeleteElement: (elementId: string) => Promise<void>;
    onDuplicateElement: (elementId: string) => Promise<void>;
  };
  
  // Project management
  updateActiveProject: (updates: Partial<UIProject>) => void;
  updateProject: (projectId: string, updates: Partial<UIProject>) => void;
  addCommit: (code: string, metadata?: { message?: string; author?: "user" | "ai" | "system"; type?: "generation" | "edit" | "patch" | "manual" }) => void;
  
  // Refs
  codeProjectIdRef: React.MutableRefObject<string | null>;
  getActiveProject: () => UIProject | null;
}

export function PlaygroundPreviewContentArea({
  currentTab,
  activeSystemTab,
  activeDsComponentTab,
  activePreviewTab,
  uiProjects,
  code,
  activeProjectId,
  activeProject,
  isRightSidebarVisible,
  setIsRightSidebarVisible,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  previewZoom,
  setPreviewZoom,
  isGenerating,
  isCurrentlyGenerating,
  selectedElementId,
  setSelectedElementId,
  setActiveCopilotTab,
  canUndoCode,
  canRedoCode,
  handleUndo,
  handleRedo,
  handleCopyCode,
  handlePreviewError,
  handleA11yResults,
  handleExportCode,
  handleCopyDSL,
  handleShareLink,
  handleDownloadZIP,
  handleSubmit,
  handleToggleFavorite,
  setActivePreviewTab,
  dslElementHandlers,
  updateActiveProject,
  updateProject,
  addCommit,
  codeProjectIdRef,
  getActiveProject,
}: PlaygroundPreviewContentAreaProps) {
  // Show Welcome screen condition
  const shouldShowWelcome =
    (currentTab === "playground" || !currentTab) &&
    activeSystemTab === null &&
    activeDsComponentTab === null &&
    (activePreviewTab === "new-component" ||
      (uiProjects.filter((p) => p.isOpen !== false).length === 0 && !code));

  // Show Preview/Code condition
  const shouldShowPreviewCode =
    (currentTab === "playground" || !currentTab) &&
    code &&
    activeSystemTab === null &&
    activePreviewTab !== "new-component" &&
    (activePreviewTab === "preview" || activePreviewTab === "code" || activePreviewTab === "inspect") &&
    (activeDsComponentTab !== null || activeProjectId !== null) &&
    (codeProjectIdRef.current === activeProjectId ||
      (activeProject?.code && activeProject.code.trim() !== ""));

  return (
    <>
      {/* New Component - Welcome screen - only for playground tab */}
      {shouldShowWelcome && (
        <PlaygroundWelcome
          onPromptClick={(prompt) => {
            setInputMessage(prompt);
            // Open right pane if it was closed
            if (!isRightSidebarVisible) {
              setIsRightSidebarVisible(true);
            }
            handleSendMessage(prompt, true); // true = create new session
          }}
          showGrid={activePreviewTab === "new-component" && activeProjectId !== null}
          isGenerating={isGenerating || isCurrentlyGenerating}
        />
      )}

      {/* Preview and Code Content with Tabs - only show when tab is playground or not set */}
      {shouldShowPreviewCode && (
        <PlaygroundPreviewCode
          code={code}
          activePreviewTab={activePreviewTab}
          previewZoom={previewZoom}
          isGenerating={isGenerating}
          onPreviewTabChange={(tab) => {
            setActivePreviewTab(tab);
          }}
          onZoomChange={setPreviewZoom}
          onCopyCode={handleCopyCode}
          onPreviewError={handlePreviewError}
          onA11yResults={handleA11yResults}
          selectedElementId={selectedElementId}
          onSelectionChange={setSelectedElementId}
          dsl={getActiveProject()?.dsl || null}
          onExportCode={handleExportCode}
          onCopyDSL={handleCopyDSL}
          onShareLink={handleShareLink}
          onDownloadZIP={handleDownloadZIP}
          onSubmit={handleSubmit}
          isFavorite={getActiveProject()?.isFavorite || false}
          onToggleFavorite={handleToggleFavorite}
          isFromProjects={activeProjectId !== null}
          canUndo={canUndoCode}
          canRedo={canRedoCode}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onEditElement={(elementId) => {
            // Switch to Inspector tab when editing
            setActiveCopilotTab("inspector");
            setSelectedElementId(elementId);
          }}
          onUpdateText={dslElementHandlers.onUpdateText}
          onDeleteElement={dslElementHandlers.onDeleteElement}
          onDuplicateElement={dslElementHandlers.onDuplicateElement}
        />
      )}
    </>
  );
}
