"use client";

import { useState, useRef, useEffect, useCallback, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { X, ChevronDown, ChevronUp, GitBranch, Settings, Box, Component, MessageSquare, Folder, FolderOpen, Layers, Grid2x2, Star, MoreHorizontal } from "lucide-react";

import type { A11yResults } from "@/types/preview";
import { ThemeToggle } from "@/components/theme-provider";
import { useTheme } from "@/lib/theme";
import { foregroundMix, borderColors, backgroundColors } from "@/lib/styles";
import { useChatSessions } from "@/hooks/use-chat-sessions";
import { useUIProjects, type UIProject, type ComponentFolder } from "@/hooks/use-ui-projects";
import { useComponentFolders } from "@/hooks/use-component-folders";
import type { Message, ChatSession, LogEntry } from "@/types/chat";
import type { GenerationMetadata } from "@/types/generation";
import { logger } from "@/lib/logger";
import { useDebounce } from "@/hooks/use-debounce";
import { ErrorBoundary } from "@/components/error-boundary";
import { PlaygroundTopBar } from "@/components/playground/playground-top-bar";
import { PlaygroundLeftSidebar } from "@/components/playground/playground-left-sidebar";
import { PlaygroundLeftSidebarWrapper } from "@/components/playground/playground-left-sidebar-wrapper";
import { PlaygroundRightSidebarWrapper } from "@/components/playground/playground-right-sidebar-wrapper";
import { UndoRedoControls } from "@/components/playground/undo-redo-controls";
import { QuickActionsToolbar } from "@/components/playground/quick-actions-toolbar";
import { useCodeHistory } from "@/hooks/use-code-history";
import { usePlaygroundState } from "@/hooks/use-playground-state";
import { ReactLiveRenderer } from "@/components/react-live-renderer";
import { useCodeSync } from "@/hooks/use-code-sync";
import { usePlaygroundActions } from "@/hooks/use-playground-actions";
import { PlaygroundDialogs } from "@/components/playground/playground-dialogs";
import { PlaygroundTabBar } from "@/components/playground/playground-tab-bar";
import { PlaygroundSystemTabContent } from "@/components/playground/playground-system-tab-content";
import { PlaygroundTabViews } from "@/components/playground/playground-tab-views";
import { PlaygroundPreviewArea } from "@/components/playground/playground-preview-area";
import { PlaygroundTerminal } from "@/components/playground/playground-terminal";
import {
  createUpdateTextHandler,
  createDeleteElementHandler,
  createDuplicateElementHandler,
  type DSLElementHandlerDependencies,
} from "@/lib/playground/dsl-element-handlers";
import { QualityDashboard, type QualityDashboardRef } from "@/components/quality/QualityDashboard";
import { ComponentsGallery } from "@/components/playground/components-gallery";
import {
  getActiveProject as getActiveProjectUtil,
  getActiveSession as getActiveSessionUtil,
  parseProjectDsl,
  isGenerationRequest,
  isNewComponentRequest,
  isPatchCommand,
  extractComponentName,
  createProjectTitle,
} from "@/lib/playground-utils";
// Dynamic imports for heavy components that are only loaded when needed
import dynamic from "next/dynamic";

// Dynamic imports for dialogs and inspector
const GitHubConfigDialog = dynamic(() => import("@/components/playground/github-config-dialog").then(mod => ({ default: mod.GitHubConfigDialog })), {
  ssr: false,
});

const CopilotSettingsDialog = dynamic(() => import("@/components/playground/copilot-settings-dialog").then(mod => ({ default: mod.CopilotSettingsDialog })), {
  ssr: false,
});

import { applyPatches, type Patch } from "./dsl/patch";
import type { UiDsl } from "./dsl/types";
import type { ParseResult } from "./dsl/patch-parser";
import { 
  getGitHubConfig, 
  hasGitHubConfig, 
  createPullRequest,
  createOrUpdateFile,
  createBranch,
  type GitHubConfig 
} from "@/lib/github-utils";
import { generateStoryFile, getStoryPath, type StoryConfig } from "@/lib/storybook-utils";
import { 
  Button, 
  Input,
  Textarea,
  Badge,
  Resizable,
  ResizableHandle,
  ResizablePanel,
  TreeView,
  type TreeNode,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@fragment_ui/ui";
import { Toaster, toast } from "@fragment_ui/ui";
import { ComponentCodeGenerator } from "@/lib/component-code-generator";
import { ComponentRenderer } from "@/lib/component-renderer";
import type { Registry } from "@/types/registry";

// Types are now imported from shared modules

function PlaygroundPage() {
  const { effectiveTheme } = useTheme();
  const qualityDashboardRef = useRef<QualityDashboardRef>(null);
  const [runningTests, setRunningTests] = useState(false);
  
  // Core state (not UI-related)
  const [code, setCode] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationMetadata, setGenerationMetadata] = useState<GenerationMetadata | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [a11yResults, setA11yResults] = useState<A11yResults | null>(null);
  const [registry, setRegistry] = useState<Registry | null>(null);
  // Initialize component generator and renderer
  const componentGenerator = useMemo(() => {
    return registry ? new ComponentCodeGenerator(registry) : null;
  }, [registry]);
  const componentRenderer = useMemo(() => {
    return componentGenerator ? new ComponentRenderer(componentGenerator) : null;
  }, [componentGenerator]);
  
  // UI state managed by custom hook (must be declared before using it)
  const uiState = usePlaygroundState();
  
  // DS Components tabs - separate from Projects (stored in localStorage via usePlaygroundState)
  const [dsComponentTabs, setDsComponentTabs] = useState<Map<string, { name: string; code: string }>>(new Map());
  
  // Get DS component state from UI state hook
  const selectedDsComponent = uiState.selectedDsComponent;
  const activeDsComponentTab = uiState.activeDsComponentTab;
  const selectedTreeItemId = uiState.selectedTreeItemId;
  
  const [editingItemId, setEditingItemId] = useState<string | null>(null); // ID of item being edited (component or folder)
  const [editingItemType, setEditingItemType] = useState<"component" | "folder" | null>(null); // Type of item being edited
  const [editingItemName, setEditingItemName] = useState<string>(""); // Current name being edited
  const [showVariantsDialog, setShowVariantsDialog] = useState(false); // Show variants selection dialog
  const [generatedVariants, setGeneratedVariants] = useState<any[]>([]); // Generated variants from document upload
  const abortControllerRef = useRef<AbortController | null>(null);
  const shouldReplaceCurrentComponentRef = useRef<boolean>(false);
  const lastA11yResultsRef = useRef<string | null>(null);
  
  // Extract UI state values for convenience
  const {
    activeTab,
    setActiveTab,
    activeCopilotTab,
    setActiveCopilotTab,
    activePreviewTab,
    setActivePreviewTab,
    activeSystemTab,
    setActiveSystemTab,
    activeSystemTabs,
    setActiveSystemTabs,
    toggleSystemTab,
    closeSystemTab,
    isTerminalVisible,
    isLeftSidebarVisible,
    isRightSidebarVisible,
    expandedChatIds,
    expandedComponentIds,
    activeLeftSidebarSection,
    showClearHistoryDialog,
    previewZoom,
    showGitHubConfigDialog,
    showCopilotSettingsDialog,
    showFileDialog,
    filePath,
    selectedElementId,
    showNewComponentDialog,
    pendingGenerationPrompt,
    pendingCreateNewSession,
    showFavourites,
    lastViewedLogsCount,
    lastViewedA11yResults,
    updateUIState,
    updateUIStates,
  } = uiState;
  
  // Helper setters for UI state (for backward compatibility)
  // These can accept both values and functions (like useState setters)
  const setIsTerminalVisible = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    updateUIState("isTerminalVisible", value as any);
  }, [updateUIState]);
  const setIsLeftSidebarVisible = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    updateUIState("isLeftSidebarVisible", value as any);
  }, [updateUIState]);
  const setIsRightSidebarVisible = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    updateUIState("isRightSidebarVisible", value as any);
  }, [updateUIState]);
  const setExpandedChatIds = useCallback((value: string[] | ((prev: string[]) => string[])) => {
    updateUIState("expandedChatIds", value as any);
  }, [updateUIState]);
  const setExpandedComponentIds = useCallback((value: string[] | ((prev: string[]) => string[])) => {
    updateUIState("expandedComponentIds", value as any);
  }, [updateUIState]);
  
  const [expandedFavouritesIds, setExpandedFavouritesIds] = useState<string[]>([]);
  
  // Setters for DS component state
  const setSelectedDsComponent = useCallback((value: string | null) => {
    updateUIState("selectedDsComponent", value);
  }, [updateUIState]);
  
  const setActiveDsComponentTab = useCallback((value: string | null) => {
    updateUIState("activeDsComponentTab", value);
  }, [updateUIState]);
  
  const setSelectedTreeItemId = useCallback((value: string | null) => {
    updateUIState("selectedTreeItemId", value);
  }, [updateUIState]);
  
  const setActiveLeftSidebarSection = useCallback((value: "chat" | "components" | "ds-components") => {
    updateUIState("activeLeftSidebarSection", value as any);
  }, [updateUIState]);
  const setShowClearHistoryDialog = useCallback((value: boolean) => {
    updateUIState("showClearHistoryDialog", value);
  }, [updateUIState]);
  const setPreviewZoom = useCallback((value: number) => {
    updateUIState("previewZoom", value);
  }, [updateUIState]);
  const setShowGitHubConfigDialog = useCallback((value: boolean) => {
    updateUIState("showGitHubConfigDialog", value);
  }, [updateUIState]);
  const setShowCopilotSettingsDialog = useCallback((value: boolean) => {
    updateUIState("showCopilotSettingsDialog", value);
  }, [updateUIState]);
  const setShowFileDialog = useCallback((value: boolean) => {
    updateUIState("showFileDialog", value);
  }, [updateUIState]);
  const setFilePath = useCallback((value: string) => {
    updateUIState("filePath", value);
  }, [updateUIState]);
  const setSelectedElementId = useCallback((value: string | null) => {
    updateUIState("selectedElementId", value);
  }, [updateUIState]);
  const setShowNewComponentDialog = useCallback((value: boolean) => {
    updateUIState("showNewComponentDialog", value);
  }, [updateUIState]);
  const setShowNewFolderDialog = useCallback((value: boolean) => {
    updateUIState("showNewFolderDialog", value);
  }, [updateUIState]);
  const setNewFolderName = useCallback((value: string) => {
    updateUIState("newFolderName", value);
  }, [updateUIState]);
  const setPendingGenerationPrompt = useCallback((value: string | null) => {
    updateUIState("pendingGenerationPrompt", value);
  }, [updateUIState]);
  const setPendingCreateNewSession = useCallback((value: boolean) => {
    updateUIState("pendingCreateNewSession", value);
  }, [updateUIState]);
  const setShowFavourites = useCallback((value: boolean) => {
    updateUIState("showFavourites", value);
  }, [updateUIState]);
  const setLastViewedLogsCount = useCallback((value: number) => {
    updateUIState("lastViewedLogsCount", value);
  }, [updateUIState]);
  const setLastViewedA11yResults = useCallback((value: A11yResults | null) => {
    updateUIState("lastViewedA11yResults", value);
  }, [updateUIState]);
  
  // Code History with metadata
  const {
    history: codeHistoryState,
    addCommit,
    undo: undoCode,
    redo: redoCode,
    goToCommit,
    canUndo: canUndoCode,
    canRedo: canRedoCode,
    getCurrentCode,
  } = useCodeHistory(code, 50);
  
  // Track if we're applying undo/redo to prevent loops
  const isApplyingHistoryRef = useRef(false);
  const lastCodeRef = useRef<string>(code);
  
  // Sync code with history (only when undo/redo is called)
  useEffect(() => {
    if (isApplyingHistoryRef.current) {
      const historyCode = getCurrentCode();
      if (historyCode !== code) {
        setCode(historyCode);
        lastCodeRef.current = historyCode;
      }
      isApplyingHistoryRef.current = false;
    }
  }, [codeHistoryState.present, getCurrentCode]);
  
  // Update history when code changes (debounced, but not when applying history)
  const debouncedCodeForHistory = useDebounce(code, 500);
  useEffect(() => {
    if (!isApplyingHistoryRef.current && debouncedCodeForHistory && debouncedCodeForHistory !== lastCodeRef.current) {
      // Determine commit metadata based on context
      const metadata: { message?: string; author?: "user" | "ai" | "system"; type?: "generation" | "edit" | "patch" | "manual" } = {};
      
      // Check if this is from generation
      if (isGenerating || generationMetadata) {
        metadata.author = "ai";
        metadata.type = "generation";
        metadata.message = "AI generation";
      } else {
        metadata.author = "user";
        metadata.type = "edit";
        metadata.message = "Code edit";
      }
      
      addCommit(debouncedCodeForHistory, metadata);
      lastCodeRef.current = debouncedCodeForHistory;
    }
  }, [debouncedCodeForHistory, addCommit, isGenerating, generationMetadata]);
  
  // Use custom hooks for chat sessions and UI projects (must be before usePlaygroundActions)
  const {
    chatSessions,
    activeSessionId,
    setChatSessions,
    setActiveSessionId,
    updateSession,
    addSession,
    removeSession,
    mounted: chatMounted,
  } = useChatSessions();
  
  const {
    uiProjects,
    activeProjectId,
    setUiProjects,
    setActiveProjectId,
    updateProject,
    addProject,
    removeProject,
    mounted: projectsMounted,
  } = useUIProjects();
  
  // Component folders
  const {
    folders: componentFolders,
    addFolder: addComponentFolder,
    updateFolder: updateComponentFolder,
    removeFolder: removeComponentFolder,
  } = useComponentFolders();
  
  const mounted = chatMounted && projectsMounted;

  // Add log helper function (needed before usePlaygroundActions)
  const addLog = (step: LogEntry["step"], status: LogEntry["status"], message: string) => {
    const log: LogEntry = {
      id: `log-${Date.now()}-${Math.random()}`,
      step,
      status,
      message,
      timestamp: new Date(),
    };
    setLogs(prev => [...prev, log]);
    return log;
  };

  // Memoize active project to detect changes (needed before usePlaygroundActions)
  const activeProject = useMemo(() => {
    if (!activeProjectId) return null;
    return uiProjects.find((p) => p.id === activeProjectId) || null;
  }, [activeProjectId, uiProjects]);
  
  // Use code sync hook to handle synchronization between project and local state
  const codeSync = useCodeSync({
    activeProjectId,
    activeProject,
    code,
    setCode,
    setGenerationMetadata,
    setActivePreviewTab,
    mounted,
  });
  
  // Extract refs from codeSync for backward compatibility
  const codeProjectIdRef = codeSync.codeProjectIdRef;
  const loadedProjectDataRef = codeSync.loadedProjectDataRef;
  
  // Get or create active session
  const getActiveSession = useCallback((): ChatSession => {
    const session = getActiveSessionUtil(chatSessions, activeSessionId);
    if (session) return session;
    
    // Create new session if none exists
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      logs: [],
      a11yResults: null,
    };
    
    setChatSessions(prev => [...prev, newSession]);
    setActiveSessionId(newSession.id);
    return newSession;
  }, [chatSessions, activeSessionId, setChatSessions, setActiveSessionId]);

  // Get or create active project
  const getActiveProject = (): UIProject | null => {
    if (activeProjectId) {
      const project = uiProjects.find(p => p.id === activeProjectId);
      if (project) {
        // If project doesn't have DSL but loadedProjectDataRef does, merge it
        let finalProject = project;
        if (loadedProjectDataRef.current && !project.dsl && loadedProjectDataRef.current.projectId === activeProjectId && loadedProjectDataRef.current.dsl) {
          finalProject = { ...project, dsl: loadedProjectDataRef.current.dsl };
        }
        if (loadedProjectDataRef.current && !finalProject.code && loadedProjectDataRef.current.projectId === activeProjectId && loadedProjectDataRef.current.code) {
          finalProject = { ...finalProject, code: loadedProjectDataRef.current.code };
        }
        return finalProject;
      }
    }
    return null;
  };

  // Create new project
  const createNewProject = (title: string = "New Project", sessionId?: string): UIProject => {
    const projectSessionId = sessionId || activeSessionId || "standalone";
    
    const newProject: UIProject = {
      id: `project-${Date.now()}`,
      title,
      code: "",
      generationMetadata: null,
      chatSessionId: projectSessionId,
      createdAt: new Date(),
      folderId: null, // Will be set by caller if needed
      order: 0, // Will be set by caller if needed
    };
    
    setUiProjects(prev => [...prev, newProject]);
    setActiveProjectId(newProject.id);
    setLogs([]);
    setA11yResults(null);
    return newProject;
  };

  // Update active project
  const updateActiveProject = (updates: Partial<UIProject>) => {
    if (!activeProjectId) return;
    updateProject(activeProjectId, updates);
  };
  
  // Update active session wrapper
  const updateActiveSession = useCallback((updates: Partial<ChatSession>) => {
    if (!activeSessionId) return;
    updateSession(activeSessionId, updates);
  }, [activeSessionId, updateSession]);
  
  // Use playground actions hook for all actions (after all dependencies are defined)
  const actions = usePlaygroundActions({
    code,
    setCode,
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    isGenerating,
    setIsGenerating,
    generationMetadata,
    setGenerationMetadata,
    logs,
    setLogs,
    a11yResults,
    setA11yResults,
    uiProjects,
    activeProjectId,
    activeProject,
    setActiveProjectId,
    updateActiveProject,
    createNewProject,
    chatSessions,
    activeSessionId,
    setChatSessions,
    setActiveSessionId,
    updateSession,
    updateProject,
    addProject,
    setUiProjects,
    updateActiveSession,
    addSession,
    removeSession,
    selectedElementId,
    setSelectedElementId,
    setActivePreviewTab,
    setActiveSystemTab,
    setShowNewComponentDialog,
    setPendingGenerationPrompt,
    setPendingCreateNewSession,
    setShowFileDialog,
    setFilePath,
    setShowGitHubConfigDialog,
    setShowClearHistoryDialog,
    addCommit,
    undoCode,
    redoCode,
    goToCommit,
    canUndoCode,
    canRedoCode,
    getCurrentCode,
    abortControllerRef,
    shouldReplaceCurrentComponentRef,
    codeProjectIdRef,
    loadedProjectDataRef,
    lastCodeRef,
    lastA11yResultsRef,
    isApplyingHistoryRef,
    getActiveProject,
    getActiveSession,
    addLog,
  });

  // DSL Element Handlers
  const onUpdateText = useMemo(() => createUpdateTextHandler({
    getActiveProject,
    updateActiveProject,
    updateProject,
    setCode,
    codeProjectIdRef,
    loadedProjectDataRef,
    lastCodeRef,
    addCommit,
    setSelectedElementId,
  }), [getActiveProject, updateActiveProject, updateProject, setCode, codeProjectIdRef, loadedProjectDataRef, lastCodeRef, addCommit, setSelectedElementId]);

  const onDeleteElement = useMemo(() => createDeleteElementHandler({
    getActiveProject,
    updateActiveProject,
    updateProject,
    setCode,
    codeProjectIdRef,
    loadedProjectDataRef,
    lastCodeRef,
    addCommit,
    setSelectedElementId,
  }), [getActiveProject, updateActiveProject, updateProject, setCode, codeProjectIdRef, loadedProjectDataRef, lastCodeRef, addCommit, setSelectedElementId]);

  const onDuplicateElement = useMemo(() => createDuplicateElementHandler({
    getActiveProject,
    updateActiveProject,
    updateProject,
    setCode,
    codeProjectIdRef,
    loadedProjectDataRef,
    lastCodeRef,
    addCommit,
    setSelectedElementId,
  }), [getActiveProject, updateActiveProject, updateProject, setCode, codeProjectIdRef, loadedProjectDataRef, lastCodeRef, addCommit, setSelectedElementId]);

  // Code history handlers (from useCodeHistory, not from actions)
  const handleUndo = useCallback(() => {
    isApplyingHistoryRef.current = true;
    undoCode();
  }, [undoCode]);
  
  const handleRedo = useCallback(() => {
    isApplyingHistoryRef.current = true;
    redoCode();
  }, [redoCode]);
  
  const handleSelectCommit = useCallback((commitId: string) => {
    isApplyingHistoryRef.current = true;
    goToCommit(commitId);
  }, [goToCommit]);

  // Extract actions for convenience
  const {
    handlePreviewError,
    handleA11yResults,
    handleCloseProject: handleCloseProjectFromActions,
    handleSwitchProject: handleSwitchProjectFromActions,
    handleStopGeneration,
    handleCopyCode,
    handleExportCode,
    handleCopyDSL,
    handleShareLink,
    handleDownloadZIP,
    getShareableLink,
    handleToggleFavorite,
    handleAddToFavourites: handleAddToFavouritesFromActions,
    handleDeleteSession: handleDeleteSessionFromActions,
    handleClearChat: handleClearChatFromActions,
    handleNewComponent: handleNewComponentFromActions,
    handleNewChat: handleNewChatFromActions,
    handleClearHistory: handleClearHistoryFromActions,
    handleApplyDiff,
    handleApplyDiffConfirm,
    handleCreateStory,
    handleOpenPR,
  } = actions;
  
  // Wrap handleSwitchProject to pass updateActiveProject
  const handleSwitchProject = useCallback((projectId: string) => {
    handleSwitchProjectFromActions(projectId, updateActiveProject);
  }, [handleSwitchProjectFromActions, updateActiveProject]);
  
  // Wrap handleCloseProject (already in actions, but we need to use it directly)
  const handleCloseProject = handleCloseProjectFromActions;
  
  // Close all tabs
  const handleCloseAllTabs = useCallback(() => {
    // Close all UI Projects
    uiProjects.forEach(project => {
      updateProject(project.id, { isOpen: false });
    });
    
    // Close all DS Component tabs
    setDsComponentTabs(new Map());
    
    // Close all System tabs
    setActiveSystemTabs(new Set());
    
    // Clear all state
    setActiveProjectId(null);
    setActiveDsComponentTab(null);
    setActiveSystemTab(null);
    setCode("");
    setGenerationMetadata(null);
    setLogs([]);
    setA11yResults(null);
    codeProjectIdRef.current = null;
    setActivePreviewTab("new-component");
  }, [uiProjects, updateProject, setActiveProjectId, setActiveDsComponentTab, setActiveSystemTabs, setActiveSystemTab, setCode, setGenerationMetadata, setLogs, setA11yResults, codeProjectIdRef, setActivePreviewTab]);
  
  // Handle Submit to Submissions (Milestone 6.3)
  const handleSubmit = useCallback(async () => {
    try {
      const activeProject = getActiveProject();
      console.log("[Submit] Active project:", JSON.stringify({
        hasProject: !!activeProject,
        projectId: activeProject?.id,
        projectTitle: activeProject?.title,
        hasProjectCode: !!activeProject?.code,
        projectCodeLength: activeProject?.code?.length || 0,
        hasProjectDsl: !!activeProject?.dsl,
        projectDslType: activeProject?.dsl ? (activeProject.dsl as any).type : null,
      }, null, 2));
      
      if (!activeProject) {
        toast.error("No active project to submit");
        return;
      }
      
      // Get code from state or from project
      // Prefer code from state (most up-to-date), fallback to project code
      const codeFromState = code || "";
      const codeFromProject = activeProject.code || "";
      const codeToSubmit = codeFromState || codeFromProject;
      const dslToSubmit = activeProject.dsl;
      
      // Also check loadedProjectDataRef as fallback (used during generation)
      const codeFromRef = loadedProjectDataRef.current?.code || "";
      const dslFromRef = loadedProjectDataRef.current?.dsl || null;
      const finalCode = codeToSubmit || codeFromRef;
      let finalDsl = dslToSubmit || dslFromRef;
      
      // If DSL is still missing, create a minimal DSL from code (fallback)
      if (!finalDsl && finalCode) {
        console.log("[Submit] DSL missing, creating minimal DSL from code");
        const { generateId } = await import("./dsl/types");
        
        // Try to detect component type from code
        const hasForm = /form|Form|handleSubmit|onSubmit/i.test(finalCode);
        const hasTable = /table|Table|thead|tbody/i.test(finalCode);
        const hasDashboard = /dashboard|Dashboard|kpi|chart/i.test(finalCode);
        const hasDecision = /compare|recommendation|tradeoff|review/i.test(finalCode);
        
        // Extract component name
        const componentNameMatch = finalCode.match(/(?:export\s+(?:default\s+)?(?:function|const)\s+(\w+)|function\s+(\w+))/);
        const componentName = componentNameMatch ? (componentNameMatch[1] || componentNameMatch[2]) : "Component";
        
        // Create minimal DSL based on detected type
        if (hasForm) {
          finalDsl = {
            id: generateId(),
            type: "form",
            fields: [],
            title: componentName,
          } as UiDsl;
        } else if (hasTable) {
          finalDsl = {
            id: generateId(),
            type: "table",
            columns: [],
            dataSource: "placeholder",
            title: componentName,
          } as UiDsl;
        } else if (hasDashboard) {
          finalDsl = {
            id: generateId(),
            type: "dashboard",
            sections: [],
            title: componentName,
            widgets: [],
          } as UiDsl;
        } else if (hasDecision) {
          finalDsl = {
            id: generateId(),
            type: "decision",
            pattern: "compare-3",
            options: [],
            title: componentName,
          } as UiDsl;
        } else {
          // Default to page DSL
          finalDsl = {
            id: generateId(),
            type: "page",
            sections: [],
            title: componentName,
          } as UiDsl;
        }
        
        console.log("[Submit] Created minimal DSL:", {
          type: finalDsl.type,
          title: (finalDsl as any).title,
        });
      }
      
      console.log("[Submit] Code sources:", JSON.stringify({
        hasCodeState: !!codeFromState,
        codeStateLength: codeFromState.length,
        codeStatePreview: codeFromState.substring(0, 100),
        hasCodeProject: !!codeFromProject,
        codeProjectLength: codeFromProject.length,
        codeProjectPreview: codeFromProject.substring(0, 100),
        hasCodeRef: !!codeFromRef,
        codeRefLength: codeFromRef.length,
        codeRefPreview: codeFromRef.substring(0, 100),
        finalCodeLength: finalCode.length,
        hasDsl: !!finalDsl,
        dslType: finalDsl ? (finalDsl as any).type : null,
        dslFromProject: !!dslToSubmit,
        dslFromRef: !!dslFromRef,
      }, null, 2));
      
      if (!finalCode || !finalDsl) {
        console.error("[Submit] Missing data:", {
          hasCode: !!finalCode,
          hasDsl: !!finalDsl,
          codeLength: finalCode.length,
          projectId: activeProject.id,
          projectTitle: activeProject.title,
          projectCode: activeProject.code ? activeProject.code.substring(0, 100) : "none",
          projectDsl: activeProject.dsl ? JSON.stringify(activeProject.dsl).substring(0, 100) : "none",
          refCode: codeFromRef ? codeFromRef.substring(0, 100) : "none",
          refDsl: dslFromRef ? JSON.stringify(dslFromRef).substring(0, 100) : "none",
        });
        toast.error("Missing code or DSL to submit. Please generate a component first.");
        return;
      }
      
      // Get prompt from active session (first user message)
      const activeSession = getActiveSession();
      const prompt = activeSession?.messages?.find((m: Message) => m.role === "user")?.content || undefined;
      
      // Determine submission type from finalDsl (not activeProject.dsl which might be null)
      let type: "component" | "block" | "screen" = "component";
      if (finalDsl.type === "decision" || finalDsl.type === "dashboard" || finalDsl.type === "table") {
        type = "screen";
      } else if (finalDsl.type === "form" && (finalDsl as any).fields?.length > 5) {
        type = "screen";
      }
      
      // Submit to API with auto-run checks using toast.promise for loading state
      // Auto-detect originType: if prompt exists, it's from Copilot
      const originType = prompt ? "copilot" : "product";
      
      const submitPromise = fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          dsl: finalDsl,
          tsx: finalCode,
          author: "user@example.com", // TODO: Get from auth
          prompt,
          originType, // Track how submission was created
          runChecks: true, // Automatically run checks
        }),
      }).then(async (response) => {
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to submit");
        }
        return response.json();
      });
      
      toast.promise(submitPromise, {
        loading: "Submitting for review...",
        success: (submission: any) => {
          // Show result based on status
          if (submission.status === "APPROVED") {
            return `Submission approved! Score: ${submission.result?.score || "N/A"}`;
          } else if (submission.status === "NEEDS_CHANGES") {
            return `Submission needs changes. Score: ${submission.result?.score || "N/A"}`;
          } else if (submission.status === "REJECTED") {
            return `Submission rejected. Score: ${submission.result?.score || "N/A"}`;
          } else {
            return "Submission created successfully";
          }
        },
        error: (error: Error) => error.message || "Failed to submit",
      });
      
      // Optionally navigate to Submissions tab
      // router.push("/studio?tab=drafts");
    } catch (error: any) {
      console.error("[Submit] Error:", error);
      toast.error(error.message || "Failed to submit", { id: "submit" });
    }
  }, [code, getActiveProject, getActiveSession]);
  
  // Load registry.json with localStorage cache
  useEffect(() => {
    const loadRegistry = async () => {
      try {
        // Try to load from cache first
        const cacheKey = "fragment-ui-registry-cache";
        const cacheTimestampKey = "fragment-ui-registry-cache-timestamp";
        const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
        
        if (typeof window !== "undefined") {
          try {
            const cached = localStorage.getItem(cacheKey);
            const cachedTimestamp = localStorage.getItem(cacheTimestampKey);
            
            if (cached && cachedTimestamp) {
              const age = Date.now() - parseInt(cachedTimestamp, 10);
              if (age < CACHE_DURATION) {
                const data = JSON.parse(cached);
                setRegistry(data);
                // Load in background to update cache
                fetch("/api/registry")
                  .then(res => res.ok ? res.json() : null)
                  .then(data => {
                    if (data) {
                      localStorage.setItem(cacheKey, JSON.stringify(data));
                      localStorage.setItem(cacheTimestampKey, Date.now().toString());
                      setRegistry(data);
                    }
                  })
                  .catch(() => {
                    // Ignore background update errors
                  });
                return;
              }
            }
          } catch (e) {
            // Ignore cache errors, continue to fetch
          }
        }
        
        // Fetch fresh data
        const response = await fetch("/api/registry", {
          cache: "force-cache", // Use Next.js cache
        });
        if (response.ok) {
          const data = await response.json();
          setRegistry(data);
          
          // Cache in localStorage
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(cacheKey, JSON.stringify(data));
              localStorage.setItem(cacheTimestampKey, Date.now().toString());
            } catch (e) {
              // Ignore localStorage errors
            }
          }
          
          // Debug: check if Accordion is in registry
          if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
            const hasAccordion = data.components && (data.components['Accordion'] || data.components['accordion']);
            console.log('[PlaygroundPage] Registry loaded. Has Accordion:', hasAccordion);
            console.log('[PlaygroundPage] Total components in registry:', Object.keys(data.components || {}).length);
            if (!hasAccordion) {
              console.warn('[PlaygroundPage] Accordion not found in registry!');
              console.warn('[PlaygroundPage] Available components (first 10):', Object.keys(data.components || {}).slice(0, 10));
            }
          }
        } else {
          console.warn("Failed to load registry from API, using empty registry");
          setRegistry({ version: "1.0.0", components: {}, aliases: {} });
        }
      } catch (error) {
        console.error("Failed to load registry:", error);
        setRegistry({ version: "1.0.0", components: {}, aliases: {} });
      }
    };
    loadRegistry();
  }, []);
  
  // Load and persist right sidebar visibility state
  const rightSidebarVisibilityRef = useRef<boolean | null>(null);
  const isRightSidebarLoadedRef = useRef(false);
  
  useEffect(() => {
    if (typeof window === "undefined" || isRightSidebarLoadedRef.current) return;
    
    // Load on mount only
    try {
      const saved = localStorage.getItem("fragment-ui-playground-right-sidebar-visible");
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        rightSidebarVisibilityRef.current = parsed;
        setIsRightSidebarVisible(parsed);
        isRightSidebarLoadedRef.current = true;
      } else {
        isRightSidebarLoadedRef.current = true;
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        logger.error("Error loading right sidebar visibility:", error);
      }
      isRightSidebarLoadedRef.current = true;
    }
  }, []); // Only run on mount
  
  // Save right sidebar visibility state on change (but not on initial load)
  useEffect(() => {
    if (typeof window === "undefined" || !isRightSidebarLoadedRef.current) return;
    
    // Only save if value actually changed
    if (rightSidebarVisibilityRef.current !== isRightSidebarVisible) {
      try {
        localStorage.setItem("fragment-ui-playground-right-sidebar-visible", JSON.stringify(isRightSidebarVisible));
        rightSidebarVisibilityRef.current = isRightSidebarVisible;
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          logger.error("Error saving right sidebar visibility:", error);
        }
      }
    }
  }, [isRightSidebarVisible]); // Only save when state changes
  
  // Memoize tree nodes to avoid recalculating on every render
  const treeNodes = useMemo(() => {
    if (chatSessions.length === 0) return [];

    // Filter sessions based on favourites view
    const filteredSessions = showFavourites 
      ? chatSessions.filter(session => session.isFavourite === true)
      : chatSessions;

    if (filteredSessions.length === 0) return [];

    // Group sessions by date
    const sessionsByDate = filteredSessions.reduce((acc, session) => {
      const dateKey = new Date(session.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(session);
      return acc;
    }, {} as Record<string, ChatSession[]>);

    // Convert to tree structure
    return Object.entries(sessionsByDate)
      .sort(([dateA], [dateB]) => {
        // Sort dates descending (newest first)
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      })
      .map(([date, sessions]) => ({
        id: `date-${date}`,
        label: date,
        icon: (
          <div className="w-4 h-4 flex-shrink-0" style={{ color: "var(--foreground-secondary)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
        ),
        children: sessions
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((session): TreeNode => {
            const isActive = activeSessionId === session.id;
            return {
              id: session.id,
              label: session.title,
              icon: (
                <MessageSquare 
                  className="h-4 w-4 flex-shrink-0" 
                  style={{ color: isActive ? "var(--foreground-primary)" : "var(--foreground-secondary)" }}
                />
              ),
              data: { session, isActive },
            };
          }),
          }));
  }, [chatSessions, activeSessionId, showFavourites]);

  // Auto-expand date nodes when sessions change
  const prevChatSessionsLengthRef = useRef<number>(chatSessions.length);
  const prevDateNodeIdsRef = useRef<string>("");
  
  useEffect(() => {
    if (chatSessions.length === 0) {
      if (prevChatSessionsLengthRef.current !== 0) {
        prevChatSessionsLengthRef.current = 0;
        prevDateNodeIdsRef.current = "";
        setExpandedChatIds([]);
      }
      return;
    }
    
    // Only run if the number of sessions actually changed
    if (chatSessions.length === prevChatSessionsLengthRef.current) {
      return;
    }
    
    // Calculate date node IDs from chatSessions directly
    const dateKeys = new Set<string>();
    chatSessions.forEach(session => {
      const dateKey = new Date(session.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      dateKeys.add(`date-${dateKey}`);
    });
    
    const dateNodeIds = Array.from(dateKeys).sort();
    const dateNodeIdsStr = dateNodeIds.join(',');
    
    // Only update if date node IDs actually changed
    if (dateNodeIdsStr === prevDateNodeIdsRef.current) {
      return;
    }
    
    prevDateNodeIdsRef.current = dateNodeIdsStr;
    prevChatSessionsLengthRef.current = chatSessions.length;
    
    setExpandedChatIds(prev => {
      // Only update if there are new date node IDs to add
      const hasNewIds = dateNodeIds.some(id => !prev.includes(id));
      if (!hasNewIds) {
        return prev; // Return same reference to prevent unnecessary re-renders
      }
      const newIds = [...new Set([...prev, ...dateNodeIds])];
      return newIds;
    });
  }, [chatSessions.length]);
  
  // Stabilize selectedIds to prevent unnecessary re-renders
  const selectedIds = useMemo(() => {
    return activeSessionId ? [activeSessionId] : [];
  }, [activeSessionId]);

  // Memoize component tree nodes
  const componentTreeNodes = useMemo(() => {
    // Always show "Projects" as the root node
    const projectsRootId = "projects-root";
    
    // Separate components with and without folders (folders = null parentFolderId)
    const componentsInFolders = uiProjects.filter(p => p.folderId);
    const componentsWithoutFolders = uiProjects.filter(p => !p.folderId);
    
    // Get top-level folders (parentFolderId is null, meaning they're in Projects root)
    const topLevelFolders = componentFolders
      .filter(folder => !folder.parentFolderId)
      .sort((a, b) => {
        // Sort by order if available, otherwise by creation date
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    
    // Get components without folders, sorted by order
    const sortedComponentsWithoutFolders = componentsWithoutFolders
      .sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    
    // Helper function to build folder tree recursively
    const buildFolderNode = (folder: typeof componentFolders[0]): TreeNode => {
      const folderComponents = componentsInFolders
        .filter(p => p.folderId === folder.id)
        .sort((a, b) => {
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      
      // Get nested folders
      const nestedFolders = componentFolders
        .filter(f => f.parentFolderId === folder.id)
        .sort((a, b) => {
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        })
        .map(buildFolderNode);
      
      const componentNodes = folderComponents.map((project) => {
        const isActive = activeProjectId === project.id;
        return {
          id: project.id,
          label: project.title,
          icon: (
            <Box className="w-4 h-4" style={{ color: "var(--foreground-secondary)" }} />
          ),
          data: { project, isActive },
        };
      });
      
      return {
        id: folder.id,
        label: folder.name,
        icon: (
          <Folder className="w-4 h-4" style={{ color: "var(--foreground-secondary)" }} />
        ),
        data: { folder },
        children: [...nestedFolders, ...componentNodes],
      };
    };
    
    // Build folder nodes
    const folderNodes = topLevelFolders.map(buildFolderNode);
    
    // Build component nodes (without folders)
    const componentNodes = sortedComponentsWithoutFolders.map((project) => {
      const isActive = activeProjectId === project.id;
      return {
        id: project.id,
        label: project.title,
        icon: (
          <Box className="w-4 h-4" style={{ color: "var(--foreground-secondary)" }} />
        ),
        data: { project, isActive },
      };
    });
    
    // Create "Projects" root node with folders and components as children
    return [{
      id: projectsRootId,
      label: "Projects",
      icon: (
        <Layers className="w-4 h-4" style={{ color: "var(--foreground-secondary)" }} />
      ),
      data: { isProjectsRoot: true },
      children: [...folderNodes, ...componentNodes],
    }];
  }, [uiProjects, componentFolders, activeProjectId]);

  // Memoize favourites tree nodes (only components with isFavorite: true)
  const favouritesTreeNodes = useMemo(() => {
    const favouritesRootId = "favourites-root";
    
    // Filter only favorite components
    const favouriteComponents = uiProjects.filter(p => p.isFavorite === true);
    
    if (favouriteComponents.length === 0) {
      return [];
    }
    
    // Sort by creation date (newest first)
    const sortedFavourites = favouriteComponents.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    // Build component nodes
    const componentNodes = sortedFavourites.map((project) => {
      const isActive = activeProjectId === project.id;
      return {
        id: project.id,
        label: project.title,
        icon: (
          <Box className="w-4 h-4" style={{ color: "var(--foreground-secondary)" }} />
        ),
        data: { project, isActive },
      };
    });
    
    // Create "Favourites" root node with components as children
    return [{
      id: favouritesRootId,
      label: "Favourites",
      icon: (
        <Star className="w-4 h-4 fill-yellow-400" style={{ color: "var(--color-status-warning-base)" }} />
      ),
      data: { isFavouritesRoot: true },
      children: componentNodes,
    }];
  }, [uiProjects, activeProjectId]);


  // Auto-expand component date nodes when components change
  const prevComponentsLengthRef = useRef<number>(uiProjects.length);
  
  useEffect(() => {
    if (uiProjects.length === 0) {
      if (prevComponentsLengthRef.current !== 0) {
        prevComponentsLengthRef.current = 0;
        setExpandedComponentIds([]);
      }
      return;
    }
    
    if (uiProjects.length === prevComponentsLengthRef.current) {
      return;
    }
    
    const dateKeys = new Set<string>();
    uiProjects.forEach(project => {
      const dateKey = new Date(project.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      dateKeys.add(`component-date-${dateKey}`);
    });
    
    const dateNodeIds = Array.from(dateKeys).sort();
    
    prevComponentsLengthRef.current = uiProjects.length;
    
    setExpandedComponentIds(prev => {
      const hasNewIds = dateNodeIds.some(id => !prev.includes(id));
      if (!hasNewIds) {
        return prev;
      }
      return [...new Set([...prev, ...dateNodeIds])];
    });
  }, [uiProjects.length]);

  // Ensure "Projects" root and all folders are expanded by default
  useEffect(() => {
    const projectsRootId = "projects-root";
    const allFolderIds = componentFolders.map(f => f.id);
    const idsToAdd = [projectsRootId, ...allFolderIds].filter(id => !expandedComponentIds.includes(id));
    if (idsToAdd.length > 0) {
      setExpandedComponentIds(prev => [...prev, ...idsToAdd]);
    }
  }, [componentFolders.length]); // Run when folders change

  // Auto-expand favourites root when favourites change
  useEffect(() => {
    const favouritesRootId = "favourites-root";
    if (favouritesTreeNodes.length > 0 && !expandedFavouritesIds.includes(favouritesRootId)) {
      setExpandedFavouritesIds(prev => [...prev, favouritesRootId]);
    }
  }, [favouritesTreeNodes.length, expandedFavouritesIds]);

  // Stabilize selectedComponentIds
  const selectedComponentIds = useMemo(() => {
    return activeProjectId ? [activeProjectId] : [];
  }, [activeProjectId]);
  

  // Calculate if currently generating from session state (source of truth)
  const isCurrentlyGenerating = useMemo(() => {
    if (!activeSessionId) return false;
    const session = chatSessions.find(s => s.id === activeSessionId);
    const result = session?.isGenerating === true;
    if (process.env.NODE_ENV === "development") {
      logger.debug("[Playground] isCurrentlyGenerating:", result, "session.isGenerating:", session?.isGenerating, "sessionId:", activeSessionId);
    }
    return result;
  }, [activeSessionId, chatSessions]);

  const codeEditorRef = useRef<HTMLTextAreaElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get current tab from URL (with backward compatibility)
  // Use useMemo to avoid calling searchParams.get() during render if searchParams is not ready
  const currentTab = useMemo(() => {
    if (!searchParams) return "playground";
  const rawTab = searchParams.get("tab") || "playground";
    return rawTab === "submissions" ? "drafts" : rawTab;
  }, [searchParams]);
  
  // Get library sub-tab (components or blocks)
  const librarySubTab = useMemo(() => {
    if (!searchParams) return "components";
    return searchParams.get("libraryTab") || "components";
  }, [searchParams]);

  // Handle component links from URL
  useEffect(() => {
    if (!mounted || !searchParams) return;
    
    const componentId = searchParams.get("component");
    if (componentId) {
      // Find project by shareableId
      const project = uiProjects.find(p => p.shareableId === componentId);
      if (project) {
        // Open the component
        setActiveProjectId(project.id);
        // Clear URL parameter after opening
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.delete("component");
        const newUrl = newSearchParams.toString() 
          ? `${window.location.pathname}?${newSearchParams.toString()}`
          : window.location.pathname;
        router.replace(newUrl);
      } else {
        console.warn("[Playground] Component not found for shareableId:", componentId);
      }
    }
  }, [mounted, searchParams, uiProjects, setActiveProjectId, router]);

  // localStorage is now handled by custom hooks (useChatSessions, useUIProjects)
  // addLog is already defined above (line 311)

  // Note: handleA11yResults and handlePreviewError are now in usePlaygroundActions
  // But we need to override handleA11yResults to use the ref
  const handleA11yResultsWithRef = useCallback((results: A11yResults) => {
    // Create a hash of results to detect if they're the same
    const resultsHash = JSON.stringify({
      violations: results.violations.length,
      passes: results.passes,
      inapplicable: results.inapplicable,
      violationIds: results.violations.map(v => v.id).sort(),
    });
    
    // Only log if results are different from last time
    const isNewResults = lastA11yResultsRef.current !== resultsHash;
    
    setA11yResults(results);
    
    if (isNewResults) {
      lastA11yResultsRef.current = resultsHash;
      
    if (results.violations.length > 0) {
      addLog("a11y", "error", `Found ${results.violations.length} accessibility violations`);
      const criticalCount = results.violations.filter(v => v.impact === "critical" || v.impact === "serious").length;
      if (criticalCount > 0) {
        addLog("a11y", "error", `${criticalCount} critical/serious violations detected`);
      }
    } else {
      addLog("a11y", "success", `Accessibility check passed (${results.passes} checks passed, ${results.inapplicable} inapplicable)`);
      }
    }
    
    // Send stats to telemetry API
    const critical = results.violations.filter(v => v.impact === "critical").length;
    const serious = results.violations.filter(v => v.impact === "serious").length;
    const moderate = results.violations.filter(v => v.impact === "moderate").length;
    const minor = results.violations.filter(v => v.impact === "minor").length;
    
    const violationsByRule: Record<string, number> = {};
    results.violations.forEach((v) => {
      violationsByRule[v.id] = (violationsByRule[v.id] || 0) + 1;
    });
    
    // Send to API (fire and forget)
    fetch("/api/a11y-stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        viewId: activeProject?.id,
        violations: results.violations.length,
        critical,
        serious,
        moderate,
        minor,
        passes: results.passes,
        incomplete: results.incomplete,
        inapplicable: results.inapplicable,
        violationsByRule,
      }),
    }).catch((error) => {
      // Silently fail - telemetry should not break the app
      if (process.env.NODE_ENV === "development") {
        console.warn("[A11y Telemetry] Failed to send stats:", error);
      }
    });
  }, [activeProject]);

  // Track which session's messages we've loaded to prevent infinite loops
  const loadedMessagesSessionIdRef = useRef<string | null>(null);
  const loadedMessagesRef = useRef<Message[]>([]);

  // Load active session when it changes
  useEffect(() => {
    // Only load session data if mounted (data loaded from localStorage)
    if (!mounted) return;
    
    if (activeSessionId) {
      const session = chatSessions.find(s => s.id === activeSessionId);
      if (session) {
        // Always load messages from session on mount or when session changes
        // This ensures messages persist after page refresh
        if (session.messages && Array.isArray(session.messages)) {
          // Only load if this is a different session or messages have changed
          const isDifferentSession = loadedMessagesSessionIdRef.current !== activeSessionId;
          const messagesChanged = isDifferentSession || 
            session.messages.length !== loadedMessagesRef.current.length ||
            session.messages.some((msg, idx) => 
              msg.id !== loadedMessagesRef.current[idx]?.id || 
              msg.content !== loadedMessagesRef.current[idx]?.content
            );
          
          if (messagesChanged) {
            if (session.messages.length > 0) {
              // Always load messages from session if they exist
              // This ensures messages persist after page refresh
              if (process.env.NODE_ENV === "development") {
                logger.debug("[Playground] Loading messages from session:", {
                  sessionMessagesCount: session.messages.length,
                  loadedMessagesCount: loadedMessagesRef.current.length,
                  isDifferentSession
                });
              }
              setMessages(session.messages);
              loadedMessagesRef.current = session.messages;
              loadedMessagesSessionIdRef.current = activeSessionId;
            } else if (isDifferentSession) {
              // Only clear messages if this is a different session with empty messages
              setMessages([]);
              loadedMessagesRef.current = [];
              loadedMessagesSessionIdRef.current = activeSessionId;
            }
          }
        } else if (!session.messages && loadedMessagesSessionIdRef.current !== activeSessionId) {
          // If session has no messages and this is a different session, clear messages
          setMessages([]);
          loadedMessagesRef.current = [];
          loadedMessagesSessionIdRef.current = activeSessionId;
        }
        // Code and generationMetadata are now only in UIProject, not in ChatSession
        // They will be loaded from the active project in the project useEffect
        // isGenerating is now calculated via useMemo (isCurrentlyGenerating) - no need to sync here
        
        // Load logs from session
        // Always load logs from session to ensure they persist when refreshing or switching projects
        if (session.logs && Array.isArray(session.logs)) {
          if (session.logs.length > 0) {
            // Use shallow comparison to avoid unnecessary updates
            const logsChanged = session.logs.length !== logs.length ||
              session.logs.some((log, idx) => 
                log.id !== logs[idx]?.id || 
                log.message !== logs[idx]?.message ||
                (log.timestamp && logs[idx]?.timestamp && log.timestamp.getTime() !== logs[idx]?.timestamp.getTime())
              );
            if (logsChanged) {
              // Only update if local logs are empty or session logs are longer (more complete)
              // This prevents overwriting newly added logs with stale session data
              if (logs.length === 0 || session.logs.length >= logs.length) {
                // Always load logs from session - they are tied to the chat session
                // This ensures logs persist when refreshing the page or switching projects
                setLogs(session.logs);
              }
            }
          } else if (session.logs.length === 0) {
            // Only clear logs if session explicitly has empty array AND local logs are also empty
            // This prevents clearing logs that were just added
            if (logs.length === 0) {
              setLogs([]);
            }
          }
        }
        // Load a11y results from session
        if (session.a11yResults !== a11yResults) {
          setA11yResults(session.a11yResults || null);
        }
      }
    } else if (chatSessions.length === 0) {
      // Initialize with empty state if no sessions
      setMessages([]);
      setCode("");
      setGenerationMetadata(null);
      setLogs([]);
      setA11yResults(null);
    }
  }, [activeSessionId, chatSessions, mounted]);

  // Removed useEffect for syncing isGenerating - we now use useMemo to calculate it directly from session
  // This prevents infinite loops and ensures spinner stops immediately when session.isGenerating becomes false

  // Debounce project updates to avoid excessive saves
  const debouncedCode = useDebounce(code, 500);
  const debouncedMetadata = useDebounce(generationMetadata, 500);
  const debouncedLogs = useDebounce(logs, 500);
  const debouncedA11yResults = useDebounce(a11yResults, 500);

  // Combined useEffect for syncing all project changes with debounce
  // Only sync if the code actually belongs to the active project
  useEffect(() => {
    if (activeProjectId) {
      const activeProject = uiProjects.find((p) => p.id === activeProjectId);
      // Only update if:
      // 1. Project exists
      // 2. Code belongs to this project (codeProjectIdRef.current === activeProjectId)
      // This prevents overwriting code from other projects
      if (activeProject && (codeProjectIdRef.current === activeProjectId || !codeProjectIdRef.current)) {
        updateActiveProject({ 
          code: debouncedCode,
          generationMetadata: debouncedMetadata,
        });
      }
    }
  }, [debouncedCode, debouncedMetadata, activeProjectId]); // Removed uiProjects and unused deps to prevent infinite loop

  // Sync session data (logs, a11y results, messages) to active session (combined)
  useEffect(() => {
    if (!activeSessionId) return;
    
    const updates: Partial<ChatSession> = {};
    
    // Sync debounced logs and a11y results
    if (debouncedLogs.length > 0 || debouncedA11yResults) {
      updates.logs = debouncedLogs;
      updates.a11yResults = debouncedA11yResults;
    }
    
    // Sync messages immediately (no debounce for messages to ensure they're saved before page refresh)
    if (messages.length > 0) {
      updates.messages = messages;
      // Update ref to track that we've saved these messages
      loadedMessagesRef.current = messages;
      loadedMessagesSessionIdRef.current = activeSessionId;
    }
    
    // Only update if there are changes
    if (Object.keys(updates).length > 0) {
      updateActiveSession(updates);
    }
  }, [debouncedLogs, debouncedA11yResults, messages, activeSessionId, updateActiveSession]);

  const handleSendMessage = async (customPrompt?: string, createNewSession?: boolean) => {
    const promptToSend = customPrompt || inputMessage.trim();
    
    console.log("[Playground] handleSendMessage called:", {
      hasPrompt: !!promptToSend,
      promptLength: promptToSend?.length,
      isGenerating,
      createNewSession,
      customPrompt: !!customPrompt
    });
    
    if (!promptToSend) {
      console.warn("[Playground] handleSendMessage: No prompt to send");
      return;
    }
    
    if (isGenerating) {
      console.warn("[Playground] handleSendMessage: Already generating, skipping");
      return;
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    // Create new session if requested (e.g., when clicking example prompts)
    let session: ChatSession;
    if (createNewSession) {
      // Create new session with prompt as title and set generating state
      const sessionTitle = promptToSend.length > 40 
        ? promptToSend.substring(0, 40) + "..." 
        : promptToSend;
      const newSession: ChatSession = {
        id: `session-${Date.now()}`,
        title: sessionTitle,
        messages: [],
        createdAt: new Date(),
        isGenerating: true, // Mark as generating immediately
        logs: [],
        a11yResults: null,
      };
      setChatSessions(prev => [...prev, newSession]);
      setActiveSessionId(newSession.id);
      // Don't clear messages here - they will be set when user message is added
      // setMessages([]);
      // Don't clear code immediately when creating new session for generation
      // This prevents iframe from being cleared and reloaded unnecessarily
      // Code will be set when generation completes
      // setCode("");
      setGenerationMetadata(null);
      setLogs([]);
      setA11yResults(null);
      
      // Check if this is a new component request
      const trimmedPrompt = promptToSend.trim();
      const isNewCompRequest = isNewComponentRequest(trimmedPrompt);
      
      // If it's a new component request, create project immediately and open its tab with loading
      if (isNewCompRequest) {
        const promptTitle = promptToSend.length > 30 
          ? promptToSend.substring(0, 30).trim() + "..." 
          : promptToSend.trim();
        const newProject = createNewProject(promptTitle, newSession.id);
        // Open the project tab and show preview (which will show loading spinner)
        setActiveProjectId(newProject.id);
        setActivePreviewTab("preview");
        // Hide system tabs content to show the component
        setActiveSystemTab(null);
      } else {
        // For other requests, just activate welcome screen
        setActiveProjectId(null);
        setActivePreviewTab("new-component");
      }
      
      session = newSession;
    } else {
      // Ensure we have an active session
      session = getActiveSession();
    }

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: promptToSend,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    
    // Update session title if this is the first message
    // Use messages.length instead of session.messages.length to ensure we check the current state
    if (messages.length === 0 || createNewSession) {
      const title = promptToSend.length > 40 
        ? promptToSend.substring(0, 40) + "..." 
        : promptToSend;
      updateActiveSession({ title, messages: newMessages });
    } else {
      updateActiveSession({ messages: newMessages });
    }
    
    setInputMessage("");
    setIsGenerating(true);
    // Update session to show generating state
    if (session) {
      updateActiveSession({ isGenerating: true });
    }
    setLogs([]); // Clear previous logs
    setA11yResults(null); // Clear previous a11y results
    lastA11yResultsRef.current = null; // Reset to allow new a11y results to be logged

    // Check if this is a generation/modification request using utility function
    const trimmedPrompt = promptToSend.trim();
    const isGenRequest = isGenerationRequest(trimmedPrompt);
    const isNewCompRequest = isNewComponentRequest(trimmedPrompt);
    
    // If there's an active project with code and user requests a new component, show confirmation dialog
    // Check code from active project directly, not from state (state may not be synced yet)
    const currentProject = getActiveProjectUtil(uiProjects, activeProjectId);
    const hasActiveCode = currentProject?.code && currentProject.code.trim() !== "";
    if (isGenRequest && isNewCompRequest && activeProjectId && hasActiveCode) {
      setPendingGenerationPrompt(promptToSend);
      setPendingCreateNewSession(createNewSession || false);
      setShowNewComponentDialog(true);
      setIsGenerating(false);
      // Revert the user message since we're showing a dialog
      setMessages(messages);
      setInputMessage(promptToSend);
      return;
    }
    
    // Check if this is a patch command using utility function
    const isPatchCmd = isPatchCommand(promptToSend);
    
    console.log("[Patch Command] Checking:", { 
      isPatchCommand: isPatchCmd, 
      hasCode: !!code, 
      codeLength: code?.length || 0,
      prompt: promptToSend.trim().substring(0, 50),
      activeProjectId
    });
    logger.debug("[Patch Command] Checking:", { 
      isPatchCommand: isPatchCmd, 
      hasCode: !!code, 
      codeLength: code?.length || 0,
      prompt: promptToSend.trim().substring(0, 50),
      activeProjectId
    });
    
    // Try to handle patch command if detected
    // Get code from active project if not available in state
    const codeToUse = code || getActiveProjectUtil(uiProjects, activeProjectId)?.code || "";
    console.log("[Patch Command] Code check:", {
      isPatchCmd,
      hasCodeToUse: !!codeToUse,
      codeToUseLength: codeToUse.length,
      willEnterPatchBlock: isPatchCmd && !!codeToUse
    });
    if (isPatchCmd && codeToUse) {
      console.log("[Patch Command] Patch command detected, processing...");
      logger.debug("[Patch Command] Patch command detected, processing...");
      try {
        // Get current project and DSL
        const currentProject = getActiveProjectUtil(uiProjects, activeProjectId);
        if (!currentProject) {
          logger.warn("[Patch Command] No active project found");
          throw new Error("No active project");
        }

        logger.debug("[Patch Command] Active project found:", { 
          projectId: currentProject.id, 
          hasDsl: !!currentProject.dsl 
        });
        console.log("[Patch Command] Active project found:", { 
          projectId: currentProject.id, 
          hasDsl: !!currentProject.dsl,
          dslType: currentProject.dsl ? (currentProject.dsl as any).type : null,
          dslStringified: currentProject.dsl ? JSON.stringify(currentProject.dsl).substring(0, 100) : null,
          dslIsString: typeof currentProject.dsl === 'string',
          dslIsObject: typeof currentProject.dsl === 'object' && currentProject.dsl !== null,
          allProjects: uiProjects.map(p => ({ id: p.id, hasDsl: !!p.dsl, dslType: p.dsl ? (p.dsl as any).type : null }))
        });

        // Check if we have DSL stored in the project
        // DSL might be stored as a string in localStorage, so we need to parse it
        let dsl: UiDsl | undefined;
        if (currentProject.dsl) {
          if (typeof currentProject.dsl === 'string') {
            try {
              dsl = JSON.parse(currentProject.dsl);
              // DSL was a string, parsed successfully
              if (process.env.NODE_ENV === "development" && dsl) {
                logger.debug("[Patch Command] DSL was a string, parsed successfully:", { type: dsl.type });
              }
            } catch (e) {
              logger.error("[Patch Command] Failed to parse DSL string:", e);
              dsl = undefined;
            }
          } else {
            dsl = currentProject.dsl as UiDsl;
          }
        }
        // Parse the command using AI
        // If DSL doesn't exist, AI will analyze code and generate DSL + patches in one call
        addLog("generate", "pending", "Using AI to analyze code and understand your command...");
        let parseResult: ParseResult = { patches: [], confidence: 0 };
        let generatedDsl: UiDsl | null = null;
        
        try {
          // Extract element context (subtree + allowed props) if element is selected
          let elementContext: {
            subtree?: any;
            allowedProps?: Record<string, any>;
            componentName?: string;
          } | undefined = undefined;

          if (selectedElementId && dsl) {
            try {
              const { extractSubtreeSnapshot, getAllowedProps, extractComponentNameFromCode } = await import("@/lib/element-context");
              
              const subtree = extractSubtreeSnapshot(dsl, selectedElementId);
              const componentName = codeToUse ? extractComponentNameFromCode(codeToUse, selectedElementId) : null;
              const allowedProps = componentName ? getAllowedProps(componentName) : null;

              if (subtree || allowedProps) {
                elementContext = {
                  subtree: subtree || undefined,
                  allowedProps: allowedProps || undefined,
                  componentName: componentName || undefined,
                };
              }
            } catch (error) {
              console.warn("[Patch Command] Failed to extract element context:", error);
            }
          }

          const aiParseResponse = await fetch("/api/parse-intent", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              command: promptToSend,
              dsl: dsl || null, // Can be null - AI will analyze code
              selectedElementId: selectedElementId || undefined,
              elementContext: elementContext,
              context: {
                code: codeToUse,
                messages: newMessages.slice(-4),
              },
            }),
            signal,
          });

          if (aiParseResponse.ok) {
            const aiParseData = await aiParseResponse.json();
            
            // If AI generated DSL from code analysis, use it
            if (aiParseData.dsl && !dsl) {
              generatedDsl = aiParseData.dsl as UiDsl;
              dsl = generatedDsl;
              updateActiveProject({ dsl });
              console.log("[Patch Command] AI generated DSL from code analysis:", {
                dslType: dsl.type,
                dslId: dsl.id
              });
              logger.info("[Patch Command] AI generated DSL from code analysis:", {
                dslType: dsl.type,
                dslId: dsl.id
              });
            }
            
            if (aiParseData.patches && aiParseData.patches.length > 0 && aiParseData.confidence > 0.3) {
              // Ensure all addNode patches have proper node IDs
              const processedPatches = aiParseData.patches.map((patch: any) => {
                if (patch.op === "addNode" && patch.node && !patch.node.id) {
                  // Generate UUID for node if missing
                  function generateId(): string {
                    if (typeof crypto !== "undefined" && crypto.randomUUID) {
                      return crypto.randomUUID();
                    }
                    return `node-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
                  }
                  patch.node.id = generateId();
                }
                return patch;
              });
              
              console.log("[Patch Command] AI parsing succeeded:", {
                patchesCount: processedPatches.length,
                confidence: aiParseData.confidence,
                dslGenerated: !!generatedDsl,
                dslType: dsl?.type
              });
              logger.debug("[Patch Command] AI parsing succeeded:", {
                patchesCount: processedPatches.length,
                confidence: aiParseData.confidence,
                dslGenerated: !!generatedDsl,
                dslType: dsl?.type
              });
              parseResult = {
                patches: processedPatches,
                confidence: aiParseData.confidence,
                error: aiParseData.error || undefined,
              };
            } else {
              console.log("[Patch Command] AI parsing returned no patches or low confidence");
              logger.debug("[Patch Command] AI parsing returned no patches or low confidence");
              parseResult = {
                patches: [],
                confidence: 0,
                error: aiParseData.error || "AI could not understand the command",
              };
            }
          } else {
            const errorData = await aiParseResponse.json().catch(() => ({}));
            const errorMessage = errorData.error || errorData.message || "AI parsing failed";
            console.warn("[Patch Command] AI parsing API failed:", aiParseResponse.status, errorMessage);
            logger.warn("[Patch Command] AI parsing API failed:", aiParseResponse.status, errorMessage);
            
            // AI not available - show error message
            parseResult = {
              patches: [],
              confidence: 0,
              error: errorData.fallback 
                ? "AI parsing is not available. Please configure OPENAI_API_KEY environment variable to use patch commands."
                : `AI parsing failed: ${errorMessage}`,
            };
          }
        } catch (aiParseError) {
          console.warn("[Patch Command] AI parsing error:", aiParseError);
          logger.warn("[Patch Command] AI parsing error:", aiParseError);
          
          // AI parsing failed - show error message
          parseResult = {
            patches: [],
            confidence: 0,
            error: `AI parsing error: ${aiParseError instanceof Error ? aiParseError.message : "Unknown error"}. Please check your OPENAI_API_KEY configuration.`,
          };
        }
        
        logger.debug("[Patch Command] Parse result:", {
          patchesCount: parseResult.patches.length,
          confidence: parseResult.confidence,
          error: parseResult.error,
          dslGenerated: !!generatedDsl,
          dslType: dsl?.type,
          dslId: dsl?.id
        });
        console.log("[Patch Command] Parse result:", {
          patchesCount: parseResult.patches.length,
          confidence: parseResult.confidence,
          error: parseResult.error,
          patches: parseResult.patches,
          dslGenerated: !!generatedDsl,
          dslType: dsl?.type,
          dslId: dsl?.id
        });
        
        // Validate DSL before applying patches
        if (!dsl || !dsl.type || !dsl.id) {
          const errorMsg = `Invalid DSL structure before applying patches: ${JSON.stringify({ hasDsl: !!dsl, hasType: !!dsl?.type, hasId: !!dsl?.id })}`;
          logger.error("[Patch Command] DSL validation failed:", errorMsg);
          throw new Error(errorMsg);
        }
        
        if (parseResult.error || parseResult.patches.length === 0) {
          const errorMsg = parseResult.error || "Could not parse command into patch operations";
          logger.warn("[Patch Command] Parse failed:", { error: errorMsg, parseResult });
          const assistantMessage: Message = {
            id: `msg-${Date.now() + 1}`,
            role: "assistant",
            content: `❌ ${errorMsg}\n\nTry commands like:\n- "change title to 'New Title'"\n- "add button with text 'Submit'"\n- "remove element" (select element first)\n- "change variant to primary" (select element first)`,
            timestamp: new Date(),
          };
          const updatedMessages = [...newMessages, assistantMessage];
          setMessages(updatedMessages);
          updateActiveSession({ 
            messages: updatedMessages,
            isGenerating: false
          });
          addLog("generate", "error", errorMsg);
          setIsGenerating(false);
          return;
        }

        logger.debug("[Patch Command] Applying patches to DSL...", {
          patchesCount: parseResult.patches.length,
          patches: parseResult.patches.map(p => {
            const patchInfo: any = { op: p.op };
            if ('target' in p) patchInfo.target = p.target;
            if ('parent' in p) patchInfo.parent = p.parent;
            return patchInfo;
          })
        });

        // Validate patches before applying
        if (parseResult.patches.length === 0) {
          const errorMsg = parseResult.error || "No patches generated from command";
          logger.warn("[Patch Command] No patches to apply:", { error: errorMsg });
          const assistantMessage: Message = {
            id: `msg-${Date.now() + 1}`,
            role: "assistant",
            content: `❌ ${errorMsg}\n\nTry commands like:\n- "add button with text 'Submit'"\n- "change title to 'New Title'"\n- "remove element" (select element first)`,
            timestamp: new Date(),
          };
          const updatedMessages = [...newMessages, assistantMessage];
          setMessages(updatedMessages);
          updateActiveSession({ 
            messages: updatedMessages,
            isGenerating: false
          });
          addLog("generate", "error", errorMsg);
          setIsGenerating(false);
          return;
        }

        // Apply patches to DSL
        addLog("generate", "pending", `Applying ${parseResult.patches.length} patch operation(s)...`);
        logger.debug("[Patch Command] Applying patches:", {
          patchesCount: parseResult.patches.length,
          patches: parseResult.patches.map((p: any) => ({ 
            op: p.op, 
            prop: 'prop' in p ? p.prop : undefined, 
            target: p.target,
            parent: p.parent,
            node: p.node ? { id: p.node.id, type: p.node.type } : undefined,
          })),
          dslType: dsl.type,
          dslId: dsl.id
        });
        
        let updatedDsl: UiDsl;
        try {
          updatedDsl = applyPatches(dsl, parseResult.patches);
          
          // Validate updated DSL
          if (!updatedDsl || !updatedDsl.type || !updatedDsl.id) {
            throw new Error("Patches resulted in invalid DSL structure - missing type or id");
          }
        } catch (patchError) {
          const errorMessage = patchError instanceof Error 
            ? patchError.message 
            : typeof patchError === 'string' 
            ? patchError 
            : JSON.stringify(patchError);
          
          const errorDetails = {
            error: errorMessage,
            errorType: patchError instanceof Error ? patchError.constructor.name : typeof patchError,
            errorStack: patchError instanceof Error ? patchError.stack : undefined,
            patches: parseResult.patches.map((p: any) => ({
              op: p.op,
              target: p.target,
              parent: p.parent,
              prop: p.prop,
              value: p.value,
              node: p.node ? { id: p.node.id, type: p.node.type } : undefined,
            })),
            dslType: dsl.type,
            dslId: dsl.id,
            dslPreview: JSON.stringify(dsl).substring(0, 500),
          };
          
          console.error("[Patch Command] Error applying patches:", errorDetails);
          logger.error("[Patch Command] Error applying patches:", errorDetails);
          
          // Create a more user-friendly error message
          const userFriendlyError = new Error(
            `Failed to apply changes: ${errorMessage}. Please try a different command or check if the component structure is correct.`
          );
          throw userFriendlyError;
        }
        
        logger.debug("[Patch Command] Patches applied, regenerating code...", {
          updatedDslType: updatedDsl.type,
          updatedDslId: updatedDsl.id
        });

        // Regenerate TSX code from updated DSL via API
        addLog("generate", "pending", "Regenerating code from DSL...");
        logger.debug("[Patch Command] Calling /api/regenerate...");
        const regenerateResponse = await fetch("/api/regenerate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dsl: updatedDsl }),
          signal,
        });

        if (!regenerateResponse.ok) {
          const errorData = await regenerateResponse.json();
          logger.error("[Patch Command] Regenerate API failed:", { 
            status: regenerateResponse.status, 
            error: errorData 
          });
          throw new Error(errorData.error || "Failed to regenerate code from DSL");
        }

        const regenerateData = await regenerateResponse.json();
        const regeneratedCode = regenerateData.code;
        
        logger.debug("[Patch Command] Code regenerated successfully:", {
          codeLength: regeneratedCode.length,
          codePreview: regeneratedCode.substring(0, 100)
        });

        // Update project with new DSL and code
        const activeProject = getActiveProject();
        if (activeProject) {
          // Add patch history entry with metadata
          const patchHistoryEntry = {
            dsl: updatedDsl,
            patches: parseResult.patches,
            timestamp: Date.now(),
            prompt: promptToSend,
            // userId can be added later if user authentication is implemented
          };
          
          const existingHistory = activeProject.patchHistory || [];
          const newHistory = [...existingHistory, patchHistoryEntry];
          
          // Limit history size to last 50 entries
          const limitedHistory = newHistory.length > 50 
            ? newHistory.slice(-50) 
            : newHistory;
          
          updateActiveProject({
            dsl: updatedDsl,
            code: regeneratedCode,
            patchHistory: limitedHistory,
          });
        } else {
          // Fallback if project not found
          updateActiveProject({
            dsl: updatedDsl,
            code: regeneratedCode,
          });
        }

        // Update local state
        setCode(regeneratedCode);
        lastCodeRef.current = regeneratedCode;
        codeProjectIdRef.current = currentProject.id;
        loadedProjectDataRef.current = { projectId: currentProject.id, code: regeneratedCode, dsl: updatedDsl };

        // Hide system tabs content to show the component
        setActiveSystemTab(null);
        // Switch to preview tab to show the updated component
        setActivePreviewTab("preview");

        // Add commit for patch
        addCommit(regeneratedCode, {
          message: "Applied patch",
          author: "user",
          type: "patch",
        });

        // Success message
        const assistantMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: `✅ Applied ${parseResult.patches.length} patch operation(s) successfully! The component has been updated.`,
          timestamp: new Date(),
        };
        const updatedMessages = [...newMessages, assistantMessage];
        setMessages(updatedMessages);
        updateActiveSession({ 
          messages: updatedMessages,
          isGenerating: false
        });
        logger.info("[Patch Command] Patch applied successfully!");
        addLog("generate", "success", `Applied ${parseResult.patches.length} patch operation(s)`);
        setIsGenerating(false);
        return;
      } catch (patchError) {
        logger.error("[Patch Command] Error processing patch command:", patchError);
        const errorMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: `❌ Error applying patch: ${patchError instanceof Error ? patchError.message : "Unknown error"}. Falling back to normal generation.`,
          timestamp: new Date(),
        };
        const updatedMessages = [...newMessages, errorMessage];
        setMessages(updatedMessages);
        updateActiveSession({ 
          messages: updatedMessages,
          isGenerating: false
        });
        addLog("generate", "error", `Patch error: ${patchError instanceof Error ? patchError.message : "Unknown"}`);
        setIsGenerating(false);
        // Fall through to normal chat/generation flow
      }
    }

    // Check if this is a question/chat message (not a generation request)
    const isQuestion = !isGenRequest && !isPatchCmd && (
      /^(what|how|why|when|where|can you|tell me|explain|help|hello|hi|hey|cze[śs][ćc]|witaj|czy|jak|co|dlaczego|pomoc|tak|yes|nie|no)/i.test(promptToSend.trim()) ||
      /(?:can you|tell me|explain|help|hello|hi|hey)/i.test(promptToSend.trim()) ||
      promptToSend.trim().endsWith('?') ||
      (code && promptToSend.length < 50 && !isGenRequest) // Short messages without generation keywords are likely questions
    );

    // If it's a question, use chat API only (no code generation)
    if (isQuestion) {
      addLog("chat", "pending", "Processing your question...");
      try {
        const chatResponse = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: promptToSend,
            sessionId: currentProject?.id || `session-${Date.now()}`,
            context: {
              code: code || "",
              messages: newMessages.slice(-6), // Last 3 exchanges for context
              dsl: currentProject?.dsl,
              assetId: currentProject?.id,
            },
          }),
          signal,
        });

        if (chatResponse.ok) {
          const chatData = await chatResponse.json();
          const assistantMessage: Message = {
            id: `msg-${Date.now() + 1}`,
            role: "assistant",
            content: chatData.message || "I'm here to help! What would you like to know?",
            timestamp: new Date(),
          };
          const updatedMessages = [...newMessages, assistantMessage];
          setMessages(updatedMessages);
          updateActiveSession({ 
            messages: updatedMessages,
            isGenerating: false
          });
          addLog("chat", "success", "Response generated");
          setIsGenerating(false);
          return;
        } else {
          // Handle non-OK responses (e.g., 503 when OpenAI API key is not configured)
          const errorData = await chatResponse.json().catch(() => ({}));
          const errorMessage: Message = {
            id: `msg-${Date.now() + 1}`,
            role: "assistant",
            content: errorData.message || errorData.error || "AI chat is not available. Please configure OPENAI_API_KEY to use this feature.",
            timestamp: new Date(),
          };
          const updatedMessages = [...newMessages, errorMessage];
          setMessages(updatedMessages);
          updateActiveSession({ 
            messages: updatedMessages,
            isGenerating: false
          });
          addLog("chat", "error", errorData.error || "Chat API unavailable");
          setIsGenerating(false);
          return;
        }
      } catch (chatError) {
        logger.warn("Chat API error:", chatError);
        // If chat fails, show error and return
        const errorMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: "Sorry, I couldn't process your message. Please try again.",
          timestamp: new Date(),
        };
        const updatedMessages = [...newMessages, errorMessage];
        setMessages(updatedMessages);
        updateActiveSession({ 
          messages: updatedMessages,
          isGenerating: false
        });
        setIsGenerating(false);
        return;
      }
    }

    // Only generate code if explicitly requested
    if (!isGenRequest) {
      // If not a question and not a generation request, treat as question
      addLog("chat", "pending", "Processing your message...");
      try {
        const chatResponse = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: promptToSend,
            context: {
              code: code || "",
              messages: newMessages.slice(-6),
            },
          }),
          signal,
        });

        if (chatResponse.ok) {
          const chatData = await chatResponse.json();
          const assistantMessage: Message = {
            id: `msg-${Date.now() + 1}`,
            role: "assistant",
            content: chatData.message || "I'm here to help! What would you like to know?",
            timestamp: new Date(),
          };
          const updatedMessages = [...newMessages, assistantMessage];
          setMessages(updatedMessages);
          updateActiveSession({ 
            messages: updatedMessages,
            isGenerating: false
          });
          addLog("chat", "success", "Response generated");
          setIsGenerating(false);
          return;
        } else {
          // Handle non-OK responses (e.g., 503 when OpenAI API key is not configured)
          const errorData = await chatResponse.json().catch(() => ({}));
          const errorMessage: Message = {
            id: `msg-${Date.now() + 1}`,
            role: "assistant",
            content: errorData.message || errorData.error || "AI chat is not available. Please configure OPENAI_API_KEY to use this feature.",
            timestamp: new Date(),
          };
          const updatedMessages = [...newMessages, errorMessage];
          setMessages(updatedMessages);
          updateActiveSession({ 
            messages: updatedMessages,
            isGenerating: false
          });
          addLog("chat", "error", errorData.error || "Chat API unavailable");
          setIsGenerating(false);
          return;
        }
      } catch (chatError) {
        logger.warn("Chat API error:", chatError);
        // If chat fails, show error and return
        const errorMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: "Sorry, I couldn't process your message. Please try again.",
          timestamp: new Date(),
        };
        const updatedMessages = [...newMessages, errorMessage];
        setMessages(updatedMessages);
        updateActiveSession({ 
          messages: updatedMessages,
          isGenerating: false
        });
        setIsGenerating(false);
        return;
      }
    }

    // This is a generation request - proceed with code generation
    addLog("generate", "pending", `Starting AI generation for: "${promptToSend.substring(0, 50)}${promptToSend.length > 50 ? '...' : ''}"`);

    try {
      const userPrompt = promptToSend;
      const prompt = code 
        ? `Modify the existing component: ${userPrompt}\n\nCurrent code:\n\`\`\`typescript\n${code}\n\`\`\``
        : userPrompt;

      // Always use AI API for generation
      addLog("generate", "pending", "Using AI to generate component...");
      
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, demoName: "playground-generated" }),
        signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate code");
      }

      const data = await response.json();
      const generatedCode = data.code;
      const dsl = data.dsl as UiDsl | undefined; // DSL from API response (if available)
      
      console.log("[Playground] API Response received:", {
        hasCode: !!generatedCode,
        hasDsl: !!dsl,
        dslType: dsl?.type,
        method: data.metadata?.method,
        metadataHasDsl: !!data.metadata?.dsl
      });
      
      setGenerationMetadata(data.metadata || null);
      addLog("generate", "success", `AI generated ${generatedCode.split('\n').length} lines of code (method: ${data.metadata?.method || 'openai'})${dsl ? ' with DSL' : ''}`);

      // Get or create project
      // If this is a request for a NEW component, create a new project/tab UNLESS user chose to replace current
      // OR if project was already created when sending the prompt (for new component requests)
      let currentProject = getActiveProject();
      const shouldReplace = shouldReplaceCurrentComponentRef.current;
      const isNewCompRequest = isNewComponentRequest(promptToSend);
      const isPatchCmd = isPatchCommand(promptToSend);
      
      console.log("[Playground] handleSendMessage: Project decision:", {
        hasCurrentProject: !!currentProject,
        shouldReplace,
        isNewCompRequest,
        isPatchCmd,
        currentProjectId: currentProject?.id
      });
      
      // If we have DSL and it's a patch command, we should edit existing component, not create new
      const hasDsl = currentProject?.dsl;
      const shouldEditExisting = hasDsl && isPatchCmd;
      
      // Check if project was already created when sending prompt (has empty code and is active)
      const wasProjectCreatedEarly = currentProject && 
        currentProject.code === "" && 
        activeProjectId === currentProject.id &&
        isNewCompRequest;
      
      // Don't create new project if we have DSL and it's a patch command
      if (!currentProject || (isNewCompRequest && !shouldReplace && !wasProjectCreatedEarly && !shouldEditExisting)) {
        // Extract component name from code or use prompt (shortened)
        const componentNameMatch = generatedCode.match(/(?:function|const|export\s+(?:default\s+)?function)\s+(\w+)/);
        const promptTitle = promptToSend.length > 30 
          ? promptToSend.substring(0, 30).trim() + "..." 
          : promptToSend.trim();
        const componentName = componentNameMatch 
          ? componentNameMatch[1] 
          : promptTitle || "Component";
        currentProject = createNewProject(componentName, activeSessionId || undefined);
        // Ensure activeProjectId is set when creating new project - MUST be set before code
        setActiveProjectId(currentProject.id);
        // Switch to preview tab to show the new component
        setActivePreviewTab("preview");
        // Hide system tabs content to show the component
        setActiveSystemTab(null);
      } else {
        // Update project title with prompt if it's still "New Project"
        if (currentProject.title === "New Project" || currentProject.title === "Component") {
          const promptTitle = promptToSend.length > 30 
            ? promptToSend.substring(0, 30).trim() + "..." 
            : promptToSend.trim();
          updateActiveProject({ title: promptTitle });
        }
        // Ensure activeProjectId is set to current project
        if (activeProjectId !== currentProject.id) {
          setActiveProjectId(currentProject.id);
        }
        // Hide system tabs content to show the component
        setActiveSystemTab(null);
      }

      // Update code (preview will happen automatically)
      // IMPORTANT: Update session FIRST to ensure it's saved before switching tabs
      const componentNameMatch = generatedCode.match(/(?:function|const|export\s+(?:default\s+)?function)\s+(\w+)/);
      const componentName = componentNameMatch 
        ? componentNameMatch[1] 
        : currentProject.title;
      
      // Code and generationMetadata are now only in UIProject, not in ChatSession
      // Update session to mark as not generating anymore - DO THIS IMMEDIATELY after code generation
      // Don't wait for chat API response
      updateActiveSession({ 
        isGenerating: false // Mark as not generating anymore
      });
      
      // Stop generating spinner immediately
      setIsGenerating(false);
      
      // Update project with generated code and DSL immediately (no debounce for initial save)
      // This ensures code is saved to localStorage before any potential page refresh
      console.log("[Playground] Updating project with DSL:", { 
        projectId: currentProject.id, 
        hasDsl: !!dsl,
        dslType: dsl?.type,
        method: data.metadata?.method,
        dslPreview: dsl ? JSON.stringify(dsl).substring(0, 200) : null
      });
      // Update loadedProjectDataRef FIRST to ensure getActiveProject() can access DSL
      loadedProjectDataRef.current = { projectId: currentProject.id, code: generatedCode, dsl: dsl || null };
      
      updateActiveProject({ 
        code: generatedCode, 
        generationMetadata: data.metadata || null,
        dsl: dsl || null, // Store DSL if available (for conversational editing)
        title: componentName !== "New Project" ? componentName : currentProject.title
      });
      
      // Verify DSL was saved
      const updatedProject = getActiveProject();
      console.log("[Playground] Verified DSL in project after update:", { 
        projectId: updatedProject?.id, 
        hasDsl: !!updatedProject?.dsl,
        dslType: updatedProject?.dsl ? (updatedProject.dsl as any).type : null
      });
      
      // Force immediate save to localStorage for code (critical data)
      // Use setUiProjects with updater function to get latest state
      // This ensures we have the latest project data including DSL
      if (typeof window !== "undefined") {
        try {
          setUiProjects(prevProjects => {
            const updatedProjects = prevProjects.map(p => {
              if (p.id === currentProject.id) {
                // Merge with existing project data to preserve any updates from updateActiveProject
                // Always use new DSL if provided (dsl !== undefined), otherwise keep existing
                const finalDsl = dsl !== undefined ? (dsl || null) : (p.dsl || null);
                const mergedProject = { 
                  ...p, 
                  code: generatedCode, 
                  generationMetadata: data.metadata || null, 
                  dsl: finalDsl,
                  title: componentName !== "New Project" ? componentName : currentProject.title 
                };
                console.log("[Playground] Merging project for localStorage:", {
                  projectId: p.id,
                  hasNewDsl: dsl !== undefined,
                  newDslType: dsl?.type,
                  hasExistingDsl: !!p.dsl,
                  existingDslType: p.dsl ? (p.dsl as any).type : null,
                  finalDslType: finalDsl ? (finalDsl as any).type : null
                });
                return mergedProject;
              }
              return p;
            });
            // Save to localStorage immediately
            localStorage.setItem("fragment-ui-playground-projects", JSON.stringify(updatedProjects));
            console.log("[Playground] Saved to localStorage:", {
              projectId: currentProject.id,
              hasDsl: !!updatedProjects.find(p => p.id === currentProject.id)?.dsl,
              dslType: updatedProjects.find(p => p.id === currentProject.id)?.dsl ? (updatedProjects.find(p => p.id === currentProject.id)!.dsl as any).type : null
            });
            return updatedProjects;
          });
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            logger.error("[Playground] Error saving code to localStorage:", error);
          }
        }
      }
      
      // Then update local state - MUST be after activeProjectId is set
      setCode(generatedCode);
      lastCodeRef.current = generatedCode;
      // Add commit for generation
      addCommit(generatedCode, {
        message: `Generated: ${componentName}`,
        author: "ai",
        type: "generation",
      });
      // Reset a11y results ref to allow new results to be logged after generation
      lastA11yResultsRef.current = null;
      // Mark that this code belongs to the current project
      codeProjectIdRef.current = currentProject.id;
      // loadedProjectDataRef was already updated above before getActiveProject() call
      
      // Switch to preview tab when code is generated - MUST be after code is set
      setActivePreviewTab("preview");
      // Hide system tabs content to show the component
      setActiveSystemTab(null);
      
      if (process.env.NODE_ENV === "development") {
        logger.debug("[Playground] Code generated and set:", {
          codeLength: generatedCode.length,
          codePreview: generatedCode.substring(0, 100) + "...",
          projectId: currentProject.id,
          projectTitle: currentProject.title,
          activeProjectId: currentProject.id,
          activePreviewTab: "preview"
        });
      }
      
      if (process.env.NODE_ENV === "development") {
        logger.debug("[Playground] Switched to preview tab");
      }
      
      addLog("preview", "pending", "Rendering preview...");
      addLog("preview", "success", "Code updated, preview will render automatically");

      // IMPORTANT: Set isGenerating to false IMMEDIATELY after code generation
      // Don't wait for chat API response - component generation is complete
      // Update both local state and session state immediately
      setIsGenerating(false);
      
      // Find the session ID to update - use activeSessionId if available, otherwise use session.id
      const sessionIdToUpdate = activeSessionId || session?.id;
      if (sessionIdToUpdate) {
        updateSession(sessionIdToUpdate, { isGenerating: false });
        if (process.env.NODE_ENV === "development") {
          logger.debug("[Playground] Set isGenerating to false after code generation, sessionId:", sessionIdToUpdate);
        }
      } else {
        if (process.env.NODE_ENV === "development") {
          logger.warn("[Playground] Cannot set isGenerating to false - no activeSessionId and no session.id");
        }
      }

      // Get AI chat response (this can take time, but we don't want to show spinner during this)
      let assistantContent = `I've generated a component based on your request using AI.`;
      
      try {
        const chatResponse = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Component generated. Provide a brief one-sentence summary: component name and main Fragment UI components used.`,
            context: {
              code: generatedCode,
              messages: newMessages.slice(-4), // Last 2 exchanges for context
            },
          }),
          signal,
        });

        if (chatResponse.ok) {
          const chatData = await chatResponse.json();
          if (chatData.message && !chatData.fallback) {
            assistantContent = chatData.message;
          }
        }
      } catch (chatError) {
        // Silently fall back to default message if chat API fails
        logger.warn("Chat API error:", chatError);
      }

      // Create assistant message
      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: assistantContent,
        timestamp: new Date(),
      };

      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
      // Update session with messages (isGenerating is already false)
      updateActiveSession({ 
        messages: updatedMessages
      });
      
      // Force a small delay to ensure state is updated before useEffect runs
      // This prevents the useEffect from overwriting messages with stale session data
      await new Promise(resolve => setTimeout(resolve, 10));
      addLog("generate", "success", `Component generation completed`);
      // Toast removed - component generation is already indicated by the UI
    } catch (error) {
      // Don't log or show error if request was aborted by user
      if (error instanceof Error && error.name === 'AbortError') {
        logger.debug("Generation aborted by user");
        return;
      }
      
      logger.error("Error generating code:", error);
      addLog("generate", "error", `AI generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      
      const errorMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please make sure OPENAI_API_KEY is configured and try again.`,
        timestamp: new Date(),
      };

      const updatedMessages = [...newMessages, errorMessage];
      setMessages(updatedMessages);
      updateActiveSession({ 
        messages: updatedMessages,
        isGenerating: false // Mark as not generating anymore
      });
      toast.error(error instanceof Error ? error.message : "Failed to generate code");
    } finally {
      setIsGenerating(false);
      // Also update session to clear generating state
      // Use session.id if available, otherwise use activeSessionId
      const sessionIdToUpdate = session?.id || activeSessionId;
      if (sessionIdToUpdate) {
        updateSession(sessionIdToUpdate, { isGenerating: false });
        if (process.env.NODE_ENV === "development") {
          logger.debug("[Playground] Set isGenerating to false in finally block, sessionId:", sessionIdToUpdate);
        }
      } else {
        if (process.env.NODE_ENV === "development") {
          logger.warn("[Playground] Cannot set isGenerating to false in finally - no session.id and no activeSessionId");
        }
      }
    }
  };

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Handle new component generation choice
  const handleReplaceCurrentComponent = useCallback(async () => {
    if (!pendingGenerationPrompt) {
      console.warn("[Playground] handleReplaceCurrentComponent: No pending prompt");
      return;
    }
    
    const prompt = pendingGenerationPrompt;
    const createNewSession = pendingCreateNewSession;
    
    console.log("[Playground] handleReplaceCurrentComponent: Starting", {
      prompt: prompt.substring(0, 50),
      createNewSession,
      isGenerating
    });
    
    // Close dialog immediately using setTimeout to ensure it happens after event propagation
    setTimeout(() => {
      setShowNewComponentDialog(false);
    }, 0);
    
    setPendingGenerationPrompt(null);
    setPendingCreateNewSession(false);
    
    // Set flag to indicate we should replace, not create new project
    // MUST be set BEFORE calling handleSendMessage
    shouldReplaceCurrentComponentRef.current = true;
    console.log("[Playground] handleReplaceCurrentComponent: Set shouldReplaceCurrentComponentRef.current = true");
    
    // Ensure isGenerating is false before calling handleSendMessage
    if (isGenerating) {
      console.warn("[Playground] handleReplaceCurrentComponent: isGenerating is true, resetting...");
      setIsGenerating(false);
      // Also reset session state
      if (activeSessionId) {
        updateActiveSession({ isGenerating: false });
      }
    }
    
    // Generate in current tab - replace existing component
    // Use await to ensure it completes, but don't block UI
    try {
      await handleSendMessage(prompt, createNewSession);
    } catch (error) {
      console.error("[Playground] handleReplaceCurrentComponent: Error in handleSendMessage:", error);
      setIsGenerating(false);
      if (activeSessionId) {
        updateActiveSession({ isGenerating: false });
      }
    } finally {
      // Reset flag after generation
      shouldReplaceCurrentComponentRef.current = false;
      console.log("[Playground] handleReplaceCurrentComponent: Reset shouldReplaceCurrentComponentRef.current = false");
    }
  }, [pendingGenerationPrompt, pendingCreateNewSession, handleSendMessage, setShowNewComponentDialog, isGenerating, setIsGenerating, activeSessionId, updateActiveSession]);

  const handleCreateNewTab = useCallback(async () => {
    if (!pendingGenerationPrompt) {
      console.warn("[Playground] handleCreateNewTab: No pending prompt");
      return;
    }
    
    const prompt = pendingGenerationPrompt;
    
    console.log("[Playground] handleCreateNewTab: Starting", {
      prompt: prompt.substring(0, 50),
      isGenerating
    });
    
    // Close dialog immediately using setTimeout to ensure it happens after event propagation
    setTimeout(() => {
      setShowNewComponentDialog(false);
    }, 0);
    
    setPendingGenerationPrompt(null);
    setPendingCreateNewSession(false);
    
    // Don't set replace flag - will create new project
    shouldReplaceCurrentComponentRef.current = false;
    
    // Ensure isGenerating is false before calling handleSendMessage
    if (isGenerating) {
      console.warn("[Playground] handleCreateNewTab: isGenerating is true, resetting...");
      setIsGenerating(false);
      // Also reset session state
      if (activeSessionId) {
        updateActiveSession({ isGenerating: false });
      }
    }
    
    // Generate in new tab - always create new session and new project
    try {
      await handleSendMessage(prompt, true);
    } catch (error) {
      console.error("[Playground] handleCreateNewTab: Error in handleSendMessage:", error);
      setIsGenerating(false);
      if (activeSessionId) {
        updateActiveSession({ isGenerating: false });
      }
    }
  }, [pendingGenerationPrompt, handleSendMessage, setShowNewComponentDialog, isGenerating, setIsGenerating, activeSessionId, updateActiveSession]);

  // Handle A11y Quick Fix
  const handleA11yFix = useCallback(async (violationId: string, fix: any) => {
    try {
      const currentProject = getActiveProject();
      if (!currentProject) {
        toast.error("No active project to update");
        return;
      }

      // Get current DSL
      const dsl = currentProject.dsl;
      if (!dsl) {
        toast.error("DSL not available for this project");
        return;
      }

      // Parse DSL if it's a string
      const parsedDsl = typeof dsl === 'string' ? JSON.parse(dsl) : dsl;

      // If fix has a patch, apply it
      if (fix.patch) {
        // Try to find element by data-ui-id from violation
        // For now, we'll need to map violation target to data-ui-id
        // This is a simplified approach - in production, we'd need better mapping
        const patches: Patch[] = [fix.patch];
        const updatedDsl = applyPatches(parsedDsl, patches);

        // Regenerate code from updated DSL
        const regenerateResponse = await fetch("/api/regenerate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dsl: updatedDsl }),
        });

        if (!regenerateResponse.ok) {
          const errorData = await regenerateResponse.json();
          throw new Error(errorData.error || "Failed to regenerate code");
        }

        const regenerateData = await regenerateResponse.json();
        const regeneratedCode = regenerateData.code;

        // Update project with new DSL and code
        updateActiveProject({
          dsl: updatedDsl,
          code: regeneratedCode,
        });

        // Update local state
        setCode(regeneratedCode);
        codeProjectIdRef.current = currentProject.id;
        loadedProjectDataRef.current = {
          projectId: currentProject.id,
          code: regeneratedCode,
          dsl: updatedDsl,
        };

        // Add commit for A11y fix
        lastCodeRef.current = regeneratedCode;
        addCommit(regeneratedCode, {
          message: `Applied A11y fix: ${fix.description}`,
          author: "user",
          type: "patch",
        });

        toast.success(`Applied fix: ${fix.description}`);
      } else {
        // For fixes without automatic patch, show info
        toast.info(`Manual fix required: ${fix.description}. See documentation for details.`);
      }
    } catch (error) {
      console.error("Error applying A11y fix:", error);
      toast.error(`Failed to apply fix: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }, [getActiveProject, updateActiveProject, setCode, addCommit]);

  // isClearingHistoryRef for handleClearHistory
  const isClearingHistoryRef = useRef(false);
  
  // Wrap handlers that need additional parameters
  const handleDeleteSession = useCallback((sessionId: string) => {
    handleDeleteSessionFromActions(sessionId, removeSession);
  }, [handleDeleteSessionFromActions, removeSession]);
  
  const handleClearHistory = useCallback(() => {
    handleClearHistoryFromActions(isClearingHistoryRef);
  }, [handleClearHistoryFromActions]);
  
  // Use handlers directly from actions (no wrapping needed)
  const handleAddToFavourites = handleAddToFavouritesFromActions;
  const handleClearChat = handleClearChatFromActions;
  // Override handleNewComponent to create a new project with proper folder/order logic
  const handleNewComponent = useCallback(() => {
    // Check if a folder or component is selected in tree
    const selectedId = selectedTreeItemId;
    
    let targetFolderId: string | null = null;
    let order = 0;
    
    if (selectedId && selectedId !== "projects-root") {
      // Check if selected is a folder
      const selectedFolder = componentFolders.find(f => f.id === selectedId);
      if (selectedFolder) {
        // Selected is a folder - create component in this folder
        targetFolderId = selectedId;
        // Calculate order (add to end of folder)
        const maxOrder = uiProjects
          .filter(p => p.folderId === selectedId)
          .reduce((max, project) => Math.max(max, project.order || 0), -1);
        order = maxOrder + 1;
      } else {
        // Selected is a component - create component at end of same parent
        const selectedProject = uiProjects.find(p => p.id === selectedId);
        if (selectedProject) {
          targetFolderId = selectedProject.folderId || null;
          // Calculate order (add to end of same parent)
          const targetItems = targetFolderId
            ? uiProjects.filter(p => p.folderId === targetFolderId)
            : uiProjects.filter(p => !p.folderId);
          const maxOrder = targetItems.reduce((max, project) => Math.max(max, project.order || 0), -1);
          order = maxOrder + 1;
        } else {
          // Fallback: add to Projects root
          const maxOrder = uiProjects
            .filter(p => !p.folderId)
            .reduce((max, project) => Math.max(max, project.order || 0), -1);
          order = maxOrder + 1;
        }
      }
    } else {
      // Nothing selected or Projects root selected - add to Projects root
      const maxOrder = uiProjects
        .filter(p => !p.folderId)
        .reduce((max, project) => Math.max(max, project.order || 0), -1);
      order = maxOrder + 1;
    }
    
    // Create new project with title "New Component"
    const newProject = createNewProject("New Component");
    
    // Update folder and order
    updateProject(newProject.id, { folderId: targetFolderId, order });
    
    // Clear code ownership before switching projects
    codeSync.clearCodeOwnership();
    
    // Clear other state BEFORE setting active project
    setCode("");
    setGenerationMetadata(null);
    setMessages([]);
    setLogs([]);
    setA11yResults(null);
    
    // Set as active and switch to new-component tab
    setActiveProjectId(newProject.id);
    setActivePreviewTab("new-component");
    
    // Select the new component in tree
    setSelectedTreeItemId(newProject.id);
  }, [selectedTreeItemId, componentFolders, uiProjects, createNewProject, updateProject, setActiveProjectId, setActivePreviewTab, setCode, setGenerationMetadata, setMessages, setLogs, setA11yResults, codeSync]);
  
  // Handle creating a new folder
  const handleNewFolder = useCallback(() => {
    setShowNewFolderDialog(true);
    setNewFolderName("");
  }, [setShowNewFolderDialog, setNewFolderName]);
  
  // Handle saving edit (component or folder name)
  const handleSaveEdit = useCallback(() => {
    if (!editingItemId || !editingItemType) return;
    
    const newName = editingItemName.trim();
    if (!newName) {
      toast.error("Name cannot be empty");
      return;
    }
    
    if (editingItemType === "component") {
      updateProject(editingItemId, { title: newName });
      toast.success("Component renamed");
    } else if (editingItemType === "folder") {
      updateComponentFolder(editingItemId, { name: newName });
      toast.success("Folder renamed");
    }
    
    setEditingItemId(null);
    setEditingItemType(null);
    setEditingItemName("");
  }, [editingItemId, editingItemType, editingItemName, updateProject, updateComponentFolder]);
  
  // Handle confirming folder creation
  const handleConfirmNewFolder = useCallback(() => {
    const folderName = (uiState.newFolderName || "").trim();
    if (!folderName) {
      toast.error("Folder name cannot be empty");
      return;
    }
    
    // Calculate order for new folder (add to end of Projects root)
    const maxOrder = componentFolders
      .filter(f => !f.parentFolderId)
      .reduce((max, folder) => Math.max(max, folder.order || 0), -1);
    
    const newFolder: ComponentFolder = {
      id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: folderName,
      createdAt: new Date(),
      parentFolderId: null, // null = in Projects root
      order: maxOrder + 1,
    };
    
    addComponentFolder(newFolder);
    toast.success(`Folder "${folderName}" created`);
    setShowNewFolderDialog(false);
    setNewFolderName("");
  }, [uiState.newFolderName, addComponentFolder, setShowNewFolderDialog, setNewFolderName]);
  
  // Handle reordering items (drag & drop within same parent)
  const handleReorderItem = useCallback((itemId: string, itemType: "component" | "folder", newIndex: number, parentId: string | null) => {
    if (itemType === "component") {
      const targetItems = parentId 
        ? uiProjects.filter(p => p.folderId === parentId).sort((a, b) => (a.order || 0) - (b.order || 0))
        : uiProjects.filter(p => !p.folderId).sort((a, b) => (a.order || 0) - (b.order || 0));
      
      const itemIndex = targetItems.findIndex(p => p.id === itemId);
      if (itemIndex === -1) return;
      
      // Remove item from old position
      const [movedItem] = targetItems.splice(itemIndex, 1);
      // Insert at new position
      targetItems.splice(newIndex, 0, movedItem);
      
      // Update orders
      targetItems.forEach((item, index) => {
        if (item.order !== index) {
          updateProject(item.id, { order: index });
        }
      });
      
      toast.success("Order updated");
    } else {
      const targetFolders = componentFolders.filter(f => 
        parentId ? f.parentFolderId === parentId : !f.parentFolderId
      ).sort((a, b) => (a.order || 0) - (b.order || 0));
      
      const itemIndex = targetFolders.findIndex(f => f.id === itemId);
      if (itemIndex === -1) return;
      
      // Remove item from old position
      const [movedFolder] = targetFolders.splice(itemIndex, 1);
      // Insert at new position
      targetFolders.splice(newIndex, 0, movedFolder);
      
      // Update orders
      targetFolders.forEach((folder, index) => {
        if (folder.order !== index) {
          updateComponentFolder(folder.id, { order: index });
        }
      });
      
      toast.success("Order updated");
    }
  }, [uiProjects, componentFolders, updateProject, updateComponentFolder]);
  
  // Helper functions for tree operations (defined before use in handleMoveFolder)
  const findNodeById = useCallback((id: string, nodes: TreeNode[]): TreeNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(id, node.children);
        if (found) return found;
      }
    }
    return null;
  }, []);
  
  const checkIfChild = useCallback((parentNode: TreeNode, childId: string, allNodes: TreeNode[]): boolean => {
    if (parentNode.id === childId) return true;
    if (!parentNode.children) return false;
    
    for (const child of parentNode.children) {
      if (child.id === childId) return true;
      if (checkIfChild(child, childId, allNodes)) {
        return true;
      }
    }
    
    return false;
  }, []);
  
  // Handle moving a component to a folder (drag & drop)
  const handleMoveComponent = useCallback((componentId: string, folderId: string | null, insertIndex?: number) => {
    const project = uiProjects.find(p => p.id === componentId);
    if (!project) return;
    
    // Check if it's a reorder (same parent) or move (different parent)
    const isReorder = project.folderId === folderId;
    
    if (isReorder && insertIndex !== undefined) {
      // Reorder within same parent
      handleReorderItem(componentId, "component", insertIndex, folderId);
    } else {
      // Move to different parent
      let order = 0;
      if (insertIndex !== undefined) {
        order = insertIndex;
      } else {
        // Find max order in target location
        const targetItems = folderId 
          ? uiProjects.filter(p => p.folderId === folderId)
          : uiProjects.filter(p => !p.folderId);
        const maxOrder = targetItems.reduce((max, item) => Math.max(max, item.order || 0), -1);
        order = maxOrder + 1;
      }
      
      updateProject(componentId, { folderId, order });
      toast.success("Component moved");
      
      // Auto-expand folder if component was moved to a folder
      if (folderId && !expandedComponentIds.includes(folderId)) {
        setExpandedComponentIds(prev => [...prev, folderId]);
      }
    }
  }, [updateProject, uiProjects, handleReorderItem, expandedComponentIds, setExpandedComponentIds]);
  
  // Handle moving a folder to another folder (drag & drop)
  const handleMoveFolder = useCallback((folderId: string, targetFolderId: string | null, insertIndex?: number) => {
    const folder = componentFolders.find(f => f.id === folderId);
    if (!folder) return;
    
    // Check if it's a reorder (same parent) or move (different parent)
    const isReorder = folder.parentFolderId === targetFolderId;
    
    if (isReorder && insertIndex !== undefined) {
      // Reorder within same parent
      handleReorderItem(folderId, "folder", insertIndex, targetFolderId);
    } else {
      // Move to different parent
      // Prevent dropping folder into itself or its children
      const draggedNode = componentTreeNodes.find(n => n.id === folderId);
      if (draggedNode && targetFolderId) {
        const targetNode = findNodeById(targetFolderId, componentTreeNodes);
        if (targetNode && checkIfChild(draggedNode, targetFolderId, componentTreeNodes)) {
          toast.error("Cannot move folder into its own child");
          return;
        }
      }
      
      let order = 0;
      if (insertIndex !== undefined) {
        order = insertIndex;
      } else {
        // Find max order in target location
        const targetFolders = componentFolders.filter(f => 
          targetFolderId ? f.parentFolderId === targetFolderId : !f.parentFolderId
        );
        const maxOrder = targetFolders.reduce((max, f) => Math.max(max, f.order || 0), -1);
        order = maxOrder + 1;
      }
      
      updateComponentFolder(folderId, { parentFolderId: targetFolderId, order });
      toast.success("Folder moved");
      
      // Auto-expand target folder if folder was moved to another folder
      if (targetFolderId && !expandedComponentIds.includes(targetFolderId)) {
        setExpandedComponentIds(prev => [...prev, targetFolderId]);
      }
    }
  }, [updateComponentFolder, componentFolders, componentTreeNodes, handleReorderItem, findNodeById, checkIfChild, expandedComponentIds, setExpandedComponentIds]);
  
  const handleNewChat = handleNewChatFromActions;
  
  // Handle variants generated from document upload
  const handleVariantsGenerated = useCallback(async (variants: any[]) => {
    try {
      console.log("[Variants Handler] Received variants:", variants);
      
      if (variants.length > 0) {
        // Store variants and show dialog
        setGeneratedVariants(variants);
        setShowVariantsDialog(true);
        
        const bestVariant = variants[0];
        toast.success(`Generated ${variants.length} variants. Best score: ${bestVariant.score?.score || "N/A"}/100. Choose a variant to use.`);
      } else {
        toast.error("No variants were generated");
      }
    } catch (error) {
      console.error("Error handling variants:", error);
      toast.error("Failed to process variants");
    }
  }, []);
  
  // Handle variant selection
  const handleSelectVariant = useCallback(async (variant: any, index: number) => {
    try {
      if (variant.dsl && variant.tsx) {
        const variantCode = variant.tsx;
        
        // Create new project with selected variant
        const newProject = createNewProject(`Variant ${index + 1} (Score: ${variant.score?.score || "N/A"})`);
        updateProject(newProject.id, {
          dsl: variant.dsl,
          code: variantCode,
        });
        
        // Set as active
        setActiveProjectId(newProject.id);
        setCode(variantCode);
        
        // Close dialog
        setShowVariantsDialog(false);
        setGeneratedVariants([]);
        
        toast.success(`Variant ${index + 1} selected and project created`);
      }
    } catch (error) {
      console.error("Error selecting variant:", error);
      toast.error("Failed to create project from variant");
    }
  }, [createNewProject, updateProject, setActiveProjectId, setCode]);

  // All export/share/download/GitHub handlers are already in usePlaygroundActions hook

  // Handle global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+? or Cmd+K to open keyboard shortcuts
      if ((e.metaKey || e.ctrlKey) && (e.key === "?" || e.key === "k")) {
        e.preventDefault();
        setActiveSystemTabs((prev: Set<"history" | "settings" | "keyboard" | "components" | "testing">) => {
          const next = new Set(prev);
          if (next.has("keyboard")) {
            next.delete("keyboard");
          } else {
            next.add("keyboard");
          }
          return next;
        });
        setActiveSystemTab(prev => prev === "keyboard" ? null : "keyboard");
        setActivePreviewTab("new-component");
      }
      // Cmd+H to open code history
      if ((e.metaKey || e.ctrlKey) && e.key === "h") {
        e.preventDefault();
        setActiveSystemTabs((prev: Set<"history" | "settings" | "keyboard" | "components" | "testing">) => {
          const next = new Set(prev);
          if (next.has("history")) {
            next.delete("history");
          } else {
            next.add("history");
          }
          return next;
        });
        setActiveSystemTab(prev => prev === "history" ? null : "history");
        setActivePreviewTab("new-component");
      }
      // Cmd+N to create new agent
      if ((e.metaKey || e.ctrlKey) && e.key === "n" && !e.shiftKey) {
        e.preventDefault();
        handleNewChat();
      }
      // Cmd+Shift+N to create new component
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === "N" || e.key === "n")) {
        e.preventDefault();
        handleNewComponent();
      }
      // Cmd+, to open settings
      if ((e.metaKey || e.ctrlKey) && e.key === ",") {
        e.preventDefault();
        setActiveSystemTabs((prev: Set<"history" | "settings" | "keyboard" | "components" | "testing">) => {
          const next = new Set(prev);
          if (next.has("settings")) {
            next.delete("settings");
          } else {
            next.add("settings");
          }
          return next;
        });
        setActiveSystemTab(prev => prev === "settings" ? null : "settings");
        setActivePreviewTab("new-component");
      }
      // Cmd+B to open component library
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setActiveSystemTabs((prev: Set<"history" | "settings" | "keyboard" | "components" | "testing">) => {
          const next = new Set(prev);
          if (next.has("components")) {
            next.delete("components");
          } else {
            next.add("components");
          }
          return next;
        });
        setActiveSystemTab(prev => prev === "components" ? null : "components");
        setActivePreviewTab("new-component");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNewChat, handleNewComponent]);

  // Prevent hydration errors by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="playground-container fixed inset-0 flex flex-col bg-[color:var(--background-primary)]">
      <Toaster 
        position="bottom-right"
        theme="dark"
        closeButton={false}
        toastOptions={{
          style: {
            background: "var(--color-surface-2)",
            color: "var(--foreground-primary)",
            border: "1px solid color-mix(in srgb, var(--foreground-primary) 10%, transparent)",
          },
        }}
      />
      
      {/* Header */}
      <PlaygroundTopBar
        isLeftSidebarVisible={isLeftSidebarVisible}
        isRightSidebarVisible={isRightSidebarVisible}
        isTerminalVisible={isTerminalVisible}
        onToggleLeftSidebar={() => setIsLeftSidebarVisible(!isLeftSidebarVisible)}
        onToggleRightSidebar={() => {
          const newValue = !isRightSidebarVisible;
          setIsRightSidebarVisible(newValue);
        }}
        onToggleTerminal={() => setIsTerminalVisible(!isTerminalVisible)}
        onOpenSettings={() => {
          setActiveSystemTabs((prev: Set<"history" | "settings" | "keyboard" | "components" | "testing">) => {
            const next = new Set(prev);
            if (next.has("settings")) {
              next.delete("settings");
              setActiveSystemTab(current => current === "settings" ? (next.size > 0 ? (Array.from(next)[0] as "history" | "settings" | "keyboard" | "components" | "testing") : null) : current);
            } else {
              next.add("settings");
              setActiveSystemTab("settings");
            }
            return next;
          });
          setActivePreviewTab("new-component");
        }}
        onOpenKeyboardShortcuts={() => {
          setActiveSystemTabs((prev: Set<"history" | "settings" | "keyboard" | "components" | "testing">) => {
            const next = new Set(prev);
            if (next.has("keyboard")) {
              next.delete("keyboard");
              setActiveSystemTab(current => current === "keyboard" ? (next.size > 0 ? (Array.from(next)[0] as "history" | "settings" | "keyboard" | "components" | "testing") : null) : current);
            } else {
              next.add("keyboard");
              setActiveSystemTab("keyboard");
            }
            return next;
          });
          setActivePreviewTab("new-component");
        }}
        onRunAllTests={async () => {
          if (qualityDashboardRef.current) {
            setRunningTests(true);
            await qualityDashboardRef.current.runAllTests();
            // Note: runningTests will be updated by polling in QualityDashboard
          }
        }}
        runningTests={runningTests}
      />

      {/* Main Content - Two Columns Layout */}
      <div className="flex-1 flex overflow-hidden pt-[60px]">
        <Resizable direction="horizontal" className="flex-1 min-h-0">
          {/* Left Sidebar - History List - only show for playground tab */}
          <PlaygroundLeftSidebarWrapper
            currentTab={currentTab}
            isVisible={isLeftSidebarVisible}
                  chatSessions={chatSessions}
                  selectedIds={selectedIds}
                  expandedChatIds={expandedChatIds}
                  treeNodes={treeNodes}
                  onExpansionChange={setExpandedChatIds}
                  onNewChat={handleNewChat}
                  showFavourites={showFavourites}
                  onAddToFavourites={handleAddToFavourites}
                  onDeleteSession={handleDeleteSession}
                  components={uiProjects}
                  componentTreeNodes={componentTreeNodes}
                  favouritesTreeNodes={favouritesTreeNodes}
                  expandedComponentIds={expandedComponentIds}
                  expandedFavouritesIds={expandedFavouritesIds}
                  selectedComponentIds={selectedComponentIds}
                  onComponentExpansionChange={setExpandedComponentIds}
                  onFavouritesExpansionChange={setExpandedFavouritesIds}
                  editingItemId={editingItemId}
                  editingItemType={editingItemType}
                  editingItemName={editingItemName}
                  onEditingItemNameChange={setEditingItemName}
                  onSaveEdit={handleSaveEdit}
                  onDeleteFolder={(folderId) => {
                    // Move components from folder to Projects root before deleting
                    const componentsInFolder = uiProjects.filter(p => p.folderId === folderId);
                    componentsInFolder.forEach(component => {
                      updateProject(component.id, { folderId: null });
                    });
                    removeComponentFolder(folderId);
                    toast.success("Folder deleted");
                  }}
                  onNewComponent={handleNewComponent}
                  onNewFolder={handleNewFolder}
                  onMoveComponent={handleMoveComponent}
                  onMoveFolder={handleMoveFolder}
                  onReorderItem={handleReorderItem}
                  activeSection={activeLeftSidebarSection}
                  onSectionChange={setActiveLeftSidebarSection}
                  registry={registry || undefined}
            setActiveSessionId={setActiveSessionId}
            updateUIState={updateUIState}
            setSelectedTreeItemId={setSelectedTreeItemId}
            updateProject={updateProject}
            handleSwitchProject={handleSwitchProject}
            setActiveSystemTab={setActiveSystemTab}
            setEditingItemId={setEditingItemId}
            setEditingItemType={setEditingItemType}
            setEditingItemName={setEditingItemName}
            removeProject={removeProject}
            activeProjectId={activeProjectId}
            setActiveProjectId={setActiveProjectId}
            setCode={setCode}
            setActivePreviewTab={setActivePreviewTab}
            toast={toast}
            componentRenderer={componentRenderer}
            componentGenerator={componentGenerator}
            dsComponentTabs={dsComponentTabs}
            setActiveDsComponentTab={setActiveDsComponentTab}
            setDsComponentTabs={setDsComponentTabs}
            codeProjectIdRef={codeProjectIdRef}
            loadedProjectDataRef={loadedProjectDataRef}
          />
          
          {/* Main Content Area - Preview/Code with Terminal */}
          <ResizablePanel defaultSize={undefined} minSize={40} className="flex flex-col bg-[color:var(--background-primary)] min-h-0">
            <div className="flex-1 flex flex-col min-h-0">
                <Resizable direction="vertical" className="flex-1 flex flex-col min-h-0">
                  <ResizablePanel defaultSize={undefined} minSize={50} maxSize={isTerminalVisible ? 90 : 100} className="flex flex-col min-h-0 overflow-hidden">
                    {/* Tab Bar - UI Projects, DS Components, and System Tabs */}
                    <PlaygroundTabBar
                      currentTab={currentTab}
                      uiProjects={uiProjects}
                      dsComponentTabs={dsComponentTabs}
                      code={code}
                      activeProjectId={activeProjectId}
                      activeSystemTab={activeSystemTab}
                      activeSystemTabs={activeSystemTabs}
                      activeDsComponentTab={activeDsComponentTab}
                      handleSwitchProject={handleSwitchProject}
                      handleCloseProject={handleCloseProject}
                      handleCloseAllTabs={handleCloseAllTabs}
                      setActiveSystemTab={setActiveSystemTab}
                      setActiveSystemTabs={setActiveSystemTabs}
                      setActiveDsComponentTab={setActiveDsComponentTab}
                      setActivePreviewTab={setActivePreviewTab}
                      setCode={setCode}
                      setDsComponentTabs={setDsComponentTabs}
                      setActiveProjectId={setActiveProjectId}
                    />
                    
                    {/* System Tab Content */}
                    <PlaygroundSystemTabContent
                      activeSystemTab={activeSystemTab}
                      activeSystemTabs={activeSystemTabs}
                      codeHistoryState={codeHistoryState}
                          onSelectCommit={handleSelectCommit}
                          registry={registry}
                      selectedDsComponent={selectedDsComponent}
                      setCode={setCode}
                      addCommit={addCommit}
                    />
                    
                    {/* Render different views based on URL tab parameter */}
                    <Suspense fallback={null}>
                      <PlaygroundTabViews
                        currentTab={currentTab}
                        qualityDashboardRef={qualityDashboardRef}
                          runningTests={runningTests}
                          registry={registry}
                        librarySubTab={librarySubTab}
                        setActiveLeftSidebarSection={setActiveLeftSidebarSection}
                        setSelectedDsComponent={setSelectedDsComponent}
                        componentRenderer={componentRenderer}
                        componentGenerator={componentGenerator}
                        dsComponentTabs={dsComponentTabs}
                        setActiveDsComponentTab={setActiveDsComponentTab}
                        setDsComponentTabs={setDsComponentTabs}
                      />
                    </Suspense>
                    {/* Preview Area - Welcome, Preview/Code, and Terminal */}
                    <PlaygroundPreviewArea
                      currentTab={currentTab}
                      activeSystemTab={activeSystemTab}
                      activeDsComponentTab={activeDsComponentTab}
                        activePreviewTab={activePreviewTab}
                      uiProjects={uiProjects}
                      code={code}
                        isGenerating={isGenerating}
                      isCurrentlyGenerating={isCurrentlyGenerating}
                      setInputMessage={setInputMessage}
                      isRightSidebarVisible={isRightSidebarVisible}
                      setIsRightSidebarVisible={setIsRightSidebarVisible}
                      handleSendMessage={handleSendMessage}
                      activeProjectId={activeProjectId}
                      previewZoom={previewZoom}
                        selectedElementId={selectedElementId}
                      codeProjectIdRef={codeProjectIdRef}
                      loadedProjectDataRef={loadedProjectDataRef}
                      lastCodeRef={lastCodeRef}
                      activeProject={activeProject}
                      getActiveProject={getActiveProject}
                      setCode={setCode}
                      setActivePreviewTab={setActivePreviewTab}
                      setPreviewZoom={setPreviewZoom}
                      handleCopyCode={handleCopyCode}
                      handlePreviewError={handlePreviewError}
                      handleA11yResults={handleA11yResults}
                      setSelectedElementId={setSelectedElementId}
                      handleExportCode={handleExportCode}
                      handleCopyDSL={handleCopyDSL}
                      handleShareLink={handleShareLink}
                      handleDownloadZIP={handleDownloadZIP}
                      handleSubmit={handleSubmit}
                      handleToggleFavorite={handleToggleFavorite}
                      canUndoCode={canUndoCode}
                      canRedoCode={canRedoCode}
                      handleUndo={handleUndo}
                      handleRedo={handleRedo}
                      setActiveCopilotTab={setActiveCopilotTab}
                      onUpdateText={onUpdateText}
                      onDeleteElement={onDeleteElement}
                      onDuplicateElement={onDuplicateElement}
                      updateActiveProject={updateActiveProject}
                      updateProject={updateProject}
                      addCommit={addCommit}
                    />
                  </ResizablePanel>
                  {isTerminalVisible && (
                    <>
                      <ResizableHandle className="hover:bg-zinc-500" />
                      <ResizablePanel defaultSizePx={280} minSizePx={150} maxSize={50} className="flex flex-col bg-[color:var(--background-primary)] min-h-0">
                        <PlaygroundTerminal
                          activeTab={activeTab}
                          logs={logs}
                          a11yResults={a11yResults}
                          onTabChange={setActiveTab}
                          onLogsViewed={(count) => updateUIState("lastViewedLogsCount", count)}
                          onA11yResultsViewed={(results) => updateUIState("lastViewedA11yResults", results)}
                          onHideTerminal={() => setIsTerminalVisible(false)}
                          onA11yFix={handleA11yFix}
                          onClearOutput={() => {
                            setLogs([]);
                            setA11yResults(null);
                          }}
                        />
                      </ResizablePanel>
                    </>
                  )}
                </Resizable>
            </div>
          </ResizablePanel>
          {isRightSidebarVisible && (
            <PlaygroundRightSidebarWrapper
                currentTab={currentTab}
                isVisible={isRightSidebarVisible}
                activeCopilotTab={activeCopilotTab}
                setActiveCopilotTab={setActiveCopilotTab}
                messages={messages}
                inputMessage={inputMessage}
                isGenerating={isGenerating}
                isCurrentlyGenerating={isCurrentlyGenerating}
                setInputMessage={setInputMessage}
                handleSendMessage={handleSendMessage}
                handleStopGeneration={handleStopGeneration}
                selectedElementId={selectedElementId}
                setSelectedElementId={setSelectedElementId}
                code={code}
                activeProjectId={activeProjectId}
                activeDsComponentTab={activeDsComponentTab}
                uiProjects={uiProjects}
                getActiveProject={getActiveProject}
                getShareableLink={getShareableLink}
                updateProject={updateProject}
                toast={toast}
                chatSessions={chatSessions}
                selectedIds={selectedIds}
                expandedChatIds={expandedChatIds}
                treeNodes={treeNodes}
                setExpandedChatIds={setExpandedChatIds}
                setActiveSessionId={setActiveSessionId}
                handleAddToFavourites={handleAddToFavourites}
                handleDeleteSession={handleDeleteSession}
                handleVariantsGenerated={handleVariantsGenerated}
                handleNewChat={handleNewChat}
                handleClearChat={handleClearChat}
                componentRenderer={componentRenderer}
                componentGenerator={componentGenerator}
                registry={registry || undefined}
                dsComponentTabs={dsComponentTabs}
                setActiveDsComponentTab={setActiveDsComponentTab}
                setDsComponentTabs={setDsComponentTabs}
                setCode={setCode}
                setActiveProjectId={setActiveProjectId}
                setActiveSystemTab={setActiveSystemTab}
                setActivePreviewTab={setActivePreviewTab}
                codeProjectIdRef={codeProjectIdRef}
                loadedProjectDataRef={loadedProjectDataRef}
                lastCodeRef={lastCodeRef}
                updateActiveProject={updateActiveProject}
                addCommit={addCommit}
                activeSessionId={activeSessionId}
                updateActiveSession={updateActiveSession}
                applyPatches={applyPatches}
                isRightSidebarVisible={isRightSidebarVisible}
                setIsRightSidebarVisible={setIsRightSidebarVisible}
              />
          )}
        </Resizable>
      </div>
      
      <PlaygroundDialogs
        // File Path Dialog
        showFileDialog={showFileDialog}
        setShowFileDialog={setShowFileDialog}
        filePath={filePath}
        setFilePath={setFilePath}
        onApplyDiffConfirm={handleApplyDiffConfirm}
        // New Folder Dialog
        showNewFolderDialog={uiState.showNewFolderDialog}
        setShowNewFolderDialog={setShowNewFolderDialog}
        newFolderName={uiState.newFolderName}
        setNewFolderName={setNewFolderName}
        onConfirmNewFolder={handleConfirmNewFolder}
        // New Component Confirmation Dialog
        showNewComponentDialog={showNewComponentDialog}
        setShowNewComponentDialog={setShowNewComponentDialog}
        onReplaceCurrentComponent={handleReplaceCurrentComponent}
        onCreateNewTab={handleCreateNewTab}
        onCancelNewComponent={() => {
              setShowNewComponentDialog(false);
              setPendingGenerationPrompt(null);
              setPendingCreateNewSession(false);
              setIsGenerating(false);
        }}
        // Variants Selection Dialog
        showVariantsDialog={showVariantsDialog}
        setShowVariantsDialog={setShowVariantsDialog}
        generatedVariants={generatedVariants}
        setGeneratedVariants={setGeneratedVariants}
        onSelectVariant={handleSelectVariant}
      />
      
    </div>
    </ErrorBoundary>
  );
}

// Wrap with Suspense to handle useSearchParams
function PlaygroundPageWithSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlaygroundPage />
    </Suspense>
  );
}

export default PlaygroundPageWithSuspense;
