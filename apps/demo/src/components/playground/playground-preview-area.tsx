"use client";

import * as React from "react";
import { PlaygroundWelcome } from "@/components/playground/playground-welcome";
import { PlaygroundPreviewCode } from "@/components/playground/playground-preview-code";
import type { A11yResults } from "@/types/preview";
import type { UIProject } from "@/hooks/use-ui-projects";

interface PlaygroundPreviewAreaProps {
  // Tab state
  currentTab: string | null;
  activeSystemTab: "history" | "settings" | "keyboard" | "components" | "testing" | null;
  activeDsComponentTab: string | null;
  activePreviewTab: "new-component" | "preview" | "code" | "inspect";
  
  // Welcome props
  uiProjects: UIProject[];
  code: string;
  isGenerating: boolean;
  isCurrentlyGenerating: boolean;
  setInputMessage: (message: string) => void;
  isRightSidebarVisible: boolean;
  setIsRightSidebarVisible: (visible: boolean) => void;
  handleSendMessage: (message: string, createNewSession?: boolean) => void;
  activeProjectId: string | null;
  
  // Preview/Code props
  previewZoom: number;
  selectedElementId: string | null;
  codeProjectIdRef: React.MutableRefObject<string | null>;
  loadedProjectDataRef: React.MutableRefObject<{ projectId: string | null; code: string; dsl: any } | null>;
  lastCodeRef: React.MutableRefObject<string>;
  activeProject: UIProject | null;
  getActiveProject: () => UIProject | null;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  setActivePreviewTab: (tab: "new-component" | "preview" | "code" | "inspect") => void;
  setPreviewZoom: (zoom: number) => void;
  handleCopyCode: () => void;
  handlePreviewError: (error: Error) => void;
  handleA11yResults: (results: A11yResults) => void;
  setSelectedElementId: (id: string | null) => void;
  handleExportCode: () => void;
  handleCopyDSL: () => void;
  handleShareLink: () => void;
  handleDownloadZIP: () => void;
  handleSubmit: () => void;
  handleToggleFavorite: () => void;
  canUndoCode: boolean;
  canRedoCode: boolean;
  handleUndo: () => void;
  handleRedo: () => void;
  setActiveCopilotTab: (tab: "copilot" | "inspector") => void;
  
  // Handler functions for Preview/Code
  onUpdateText: (elementId: string, newText: string, path: string) => Promise<void>;
  onDeleteElement: (elementId: string) => Promise<void>;
  onDuplicateElement: (elementId: string) => Promise<void>;
  
  // Additional dependencies for handlers
  updateActiveProject: (updates: Partial<UIProject>) => void;
  updateProject: (projectId: string, updates: Partial<UIProject>) => void;
  addCommit: (code: string, metadata?: { message?: string; author?: "user" | "ai" | "system"; type?: "generation" | "edit" | "patch" | "manual"; }) => void;
}

export function PlaygroundPreviewArea({
  currentTab,
  activeSystemTab,
  activeDsComponentTab,
  activePreviewTab,
  uiProjects,
  code,
  isGenerating,
  isCurrentlyGenerating,
  setInputMessage,
  isRightSidebarVisible,
  setIsRightSidebarVisible,
  handleSendMessage,
  activeProjectId,
  previewZoom,
  selectedElementId,
  codeProjectIdRef,
  loadedProjectDataRef,
  lastCodeRef,
  activeProject,
  getActiveProject,
  setCode,
  setActivePreviewTab,
  setPreviewZoom,
  handleCopyCode,
  handlePreviewError,
  handleA11yResults,
  setSelectedElementId,
  handleExportCode,
  handleCopyDSL,
  handleShareLink,
  handleDownloadZIP,
  handleSubmit,
  handleToggleFavorite,
  canUndoCode,
  canRedoCode,
  handleUndo,
  handleRedo,
  setActiveCopilotTab,
  onUpdateText,
  onDeleteElement,
  onDuplicateElement,
  updateActiveProject,
  updateProject,
  addCommit,
}: PlaygroundPreviewAreaProps) {
  return (
    <>
      {/* New Component - Welcome screen - only for playground tab */}
      {(currentTab === "playground" || !currentTab) && activeSystemTab === null && activeDsComponentTab === null && (
        activePreviewTab === "new-component" ||
        (uiProjects.filter(p => p.isOpen !== false).length === 0 && !code)
      ) && (
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
      {(currentTab === "playground" || !currentTab) && code && activeSystemTab === null && activePreviewTab !== "new-component" && (activePreviewTab === "preview" || activePreviewTab === "code" || activePreviewTab === "inspect") && (activeDsComponentTab !== null || activeProjectId !== null) && (codeProjectIdRef.current === activeProjectId || (activeProject?.code && activeProject.code.trim() !== "")) && (
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
          isDSComponent={activeDsComponentTab !== null}
          canUndo={canUndoCode}
          canRedo={canRedoCode}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onEditElement={(elementId) => {
            // Switch to Inspector tab when editing
            setActiveCopilotTab("inspector");
            setSelectedElementId(elementId);
          }}
          onUpdateText={onUpdateText}
          onDeleteElement={onDeleteElement}
          onDuplicateElement={onDuplicateElement}
        />
      )}
    </>
  );
}

