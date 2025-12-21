/**
 * Custom hook for managing playground UI state
 * Consolidates all UI-related state into a single hook
 */

import { useState, useCallback, useEffect } from "react";
import type { A11yResults } from "@/types/preview";
import type { LogEntry } from "@/types/chat";
import type { GenerationMetadata } from "@/types/generation";

export interface PlaygroundUIState {
  // Preview and tabs
  activeTab: "terminal" | "accessibility";
  activeCopilotTab: "copilot" | "inspector" | "governance";
  activePreviewTab: "new-component" | "preview" | "code" | "inspect";
  activeSystemTabs: Set<"history" | "settings" | "keyboard" | "components" | "testing">;
  activeSystemTab: "history" | "settings" | "keyboard" | "components" | "testing" | null;
  previewZoom: number;
  
  // Sidebar visibility
  isTerminalVisible: boolean;
  isLeftSidebarVisible: boolean;
  isRightSidebarVisible: boolean;
  
  // Expanded items
  expandedChatIds: string[];
  expandedComponentIds: string[];
  activeLeftSidebarSection: "chat" | "components" | "ds-components";
  
  // Dialog visibility
  showClearHistoryDialog: boolean;
  showGitHubConfigDialog: boolean;
  showCopilotSettingsDialog: boolean;
  showFileDialog: boolean;
  showNewComponentDialog: boolean;
  showNewFolderDialog: boolean;
  newFolderName: string;
  showFavourites: boolean;
  
  // Other UI state
  filePath: string;
  selectedElementId: string | null;
  pendingGenerationPrompt: string | null;
  pendingCreateNewSession: boolean;
  lastViewedLogsCount: number;
  lastViewedA11yResults: A11yResults | null;
  
  // DS Components and tree selection
  selectedDsComponent: string | null;
  activeDsComponentTab: string | null;
  selectedTreeItemId: string | null;
}

const DEFAULT_UI_STATE: PlaygroundUIState = {
  activeTab: "terminal",
  activeCopilotTab: "copilot",
  activePreviewTab: "new-component",
  activeSystemTabs: new Set(),
  activeSystemTab: null,
  previewZoom: 100,
  isTerminalVisible: true,
  isLeftSidebarVisible: true,
  isRightSidebarVisible: true,
  expandedChatIds: [],
  expandedComponentIds: [],
  activeLeftSidebarSection: "components",
  showClearHistoryDialog: false,
  showGitHubConfigDialog: false,
  showCopilotSettingsDialog: false,
  showFileDialog: false,
  showNewComponentDialog: false,
  showNewFolderDialog: false,
  newFolderName: "",
  showFavourites: false,
  filePath: "",
  selectedElementId: null,
  pendingGenerationPrompt: null,
  pendingCreateNewSession: false,
  lastViewedLogsCount: 0,
  lastViewedA11yResults: null,
  selectedDsComponent: null,
  activeDsComponentTab: null,
  selectedTreeItemId: null,
};

const STORAGE_KEY = "playground-ui-state";

function loadStateFromStorage(): Partial<PlaygroundUIState> | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert activeSystemTabs array back to Set
      if (parsed.activeSystemTabs && Array.isArray(parsed.activeSystemTabs)) {
        parsed.activeSystemTabs = new Set(parsed.activeSystemTabs);
      }
      return parsed;
    }
  } catch (error) {
    console.error("[PlaygroundState] Error loading from localStorage:", error);
  }
  return null;
}

function saveStateToStorage(state: PlaygroundUIState) {
  if (typeof window === "undefined") return;
  try {
    // Convert Set to Array for JSON serialization
    const serializable = {
      ...state,
      activeSystemTabs: Array.from(state.activeSystemTabs),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  } catch (error) {
    console.error("[PlaygroundState] Error saving to localStorage:", error);
  }
}

export function usePlaygroundState() {
  const [uiState, setUIState] = useState<PlaygroundUIState>(() => {
    const stored = loadStateFromStorage();
    const merged = stored ? { ...DEFAULT_UI_STATE, ...stored } : DEFAULT_UI_STATE;
    // Always default to "components" (Projects) section on initial load
    // unless explicitly set to something else by user action
    if (!stored || !stored.activeLeftSidebarSection) {
      merged.activeLeftSidebarSection = "components";
    }
    return merged;
  });
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveStateToStorage(uiState);
  }, [uiState]);

  // Helper to update specific state (supports both value and function)
  const updateUIState = useCallback(<K extends keyof PlaygroundUIState>(
    key: K,
    value: PlaygroundUIState[K] | ((prev: PlaygroundUIState[K]) => PlaygroundUIState[K])
  ) => {
    setUIState((prev) => ({
      ...prev,
      [key]: typeof value === "function" ? (value as (prev: PlaygroundUIState[K]) => PlaygroundUIState[K])(prev[key]) : value,
    }));
  }, []);

  // Helper to update multiple states at once
  const updateUIStates = useCallback((updates: Partial<PlaygroundUIState>) => {
    setUIState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Specific setters for convenience
  const setActiveTab = useCallback((tab: "terminal" | "accessibility") => {
    updateUIState("activeTab", tab);
  }, [updateUIState]);

  const setActiveCopilotTab = useCallback((tab: "copilot" | "inspector" | "governance") => {
    updateUIState("activeCopilotTab", tab);
  }, [updateUIState]);

  const setActivePreviewTab = useCallback((tab: "new-component" | "preview" | "code" | "inspect") => {
    updateUIState("activePreviewTab", tab);
  }, [updateUIState]);

  const setActiveSystemTab = useCallback((
    tab: "history" | "settings" | "keyboard" | "components" | "testing" | null | ((prev: "history" | "settings" | "keyboard" | "components" | "testing" | null) => "history" | "settings" | "keyboard" | "components" | "testing" | null)
  ) => {
    updateUIState("activeSystemTab", tab as any);
  }, [updateUIState]);

  const toggleSystemTab = useCallback((tab: "history" | "settings" | "keyboard" | "components" | "testing") => {
    setUIState((prev) => {
      const newTabs = new Set(prev.activeSystemTabs);
      if (newTabs.has(tab)) {
        newTabs.delete(tab);
        return {
          ...prev,
          activeSystemTabs: newTabs,
          activeSystemTab: prev.activeSystemTab === tab ? null : prev.activeSystemTab,
        };
      } else {
        newTabs.add(tab);
        return {
          ...prev,
          activeSystemTabs: newTabs,
          activeSystemTab: tab,
        };
      }
    });
  }, []);

  const closeSystemTab = useCallback((tab: "history" | "settings" | "keyboard" | "components" | "testing") => {
    setUIState((prev) => {
      const newTabs = new Set(prev.activeSystemTabs);
      newTabs.delete(tab);
      return {
        ...prev,
        activeSystemTabs: newTabs,
        activeSystemTab: prev.activeSystemTab === tab ? null : prev.activeSystemTab,
      };
    });
  }, []);

  const setActiveSystemTabs = useCallback((value: Set<"history" | "settings" | "keyboard" | "components" | "testing"> | ((prev: Set<"history" | "settings" | "keyboard" | "components" | "testing">) => Set<"history" | "settings" | "keyboard" | "components" | "testing">)) => {
    updateUIState("activeSystemTabs", value as any);
  }, [updateUIState]);

  return {
    uiState,
    setUIState,
    updateUIState,
    updateUIStates,
    // Specific setters
    setActiveTab,
    setActiveCopilotTab,
    setActivePreviewTab,
    setActiveSystemTab,
    setActiveSystemTabs,
    toggleSystemTab,
    closeSystemTab,
    // Direct access to common states
    activeTab: uiState.activeTab,
    activeCopilotTab: uiState.activeCopilotTab,
    activePreviewTab: uiState.activePreviewTab,
    activeSystemTab: uiState.activeSystemTab,
    activeSystemTabs: uiState.activeSystemTabs,
    previewZoom: uiState.previewZoom,
    isTerminalVisible: uiState.isTerminalVisible,
    isLeftSidebarVisible: uiState.isLeftSidebarVisible,
    isRightSidebarVisible: uiState.isRightSidebarVisible,
    expandedChatIds: uiState.expandedChatIds,
    expandedComponentIds: uiState.expandedComponentIds,
    activeLeftSidebarSection: uiState.activeLeftSidebarSection,
    showClearHistoryDialog: uiState.showClearHistoryDialog,
    showGitHubConfigDialog: uiState.showGitHubConfigDialog,
    showCopilotSettingsDialog: uiState.showCopilotSettingsDialog,
    showFileDialog: uiState.showFileDialog,
    showNewComponentDialog: uiState.showNewComponentDialog,
    showNewFolderDialog: uiState.showNewFolderDialog,
    newFolderName: uiState.newFolderName,
    showFavourites: uiState.showFavourites,
    filePath: uiState.filePath,
    selectedElementId: uiState.selectedElementId,
    pendingGenerationPrompt: uiState.pendingGenerationPrompt,
    pendingCreateNewSession: uiState.pendingCreateNewSession,
    lastViewedLogsCount: uiState.lastViewedLogsCount,
    lastViewedA11yResults: uiState.lastViewedA11yResults,
    selectedDsComponent: uiState.selectedDsComponent,
    activeDsComponentTab: uiState.activeDsComponentTab,
    selectedTreeItemId: uiState.selectedTreeItemId,
  };
}

