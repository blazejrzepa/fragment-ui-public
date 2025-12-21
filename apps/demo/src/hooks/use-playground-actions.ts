/**
 * Custom hook for all playground actions
 * Consolidates all handler functions into a single hook for better organization and testing
 */

import { useCallback } from "react";
import type { Message, ChatSession, LogEntry } from "@/types/chat";
import type { GenerationMetadata } from "@/types/generation";
import type { A11yResults } from "@/types/preview";
import type { UIProject } from "./use-ui-projects";
import type { UiDsl } from "../../app/studio/dsl/types";
import { logger } from "@/lib/logger";
import { toast } from "@fragment_ui/ui";
import { parseIntent } from "../../app/studio/dsl/patch-parser";
import { applyPatches } from "../../app/studio/dsl/patch";
import {
  getActiveProject as getActiveProjectUtil,
  getActiveSession as getActiveSessionUtil,
  isGenerationRequest,
  isNewComponentRequest,
  isPatchCommand,
  extractComponentName,
  createProjectTitle,
} from "@/lib/playground-utils";
import {
  getGitHubConfig,
  hasGitHubConfig,
  createPullRequest,
  createOrUpdateFile,
  createBranch,
} from "@/lib/github-utils";
import { generateStoryFile, getStoryPath, type StoryConfig } from "@/lib/storybook-utils";

interface UsePlaygroundActionsOptions {
  // State
  code: string;
  messages: Message[];
  inputMessage: string;
  isGenerating: boolean;
  generationMetadata: GenerationMetadata | null;
  logs: LogEntry[];
  a11yResults: A11yResults | null;
  activeProjectId: string | null;
  activeSessionId: string | null;
  selectedElementId: string | null;
  
  // Setters
  setCode: (code: string) => void;
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  setInputMessage: (input: string) => void;
  setIsGenerating: (generating: boolean) => void;
  setGenerationMetadata: (metadata: GenerationMetadata | null) => void;
  setLogs: (logs: LogEntry[] | ((prev: LogEntry[]) => LogEntry[])) => void;
  setA11yResults: (results: A11yResults | null) => void;
  setActiveProjectId: (id: string | null) => void;
  setActivePreviewTab: (tab: "new-component" | "preview" | "code") => void;
  setActiveSystemTab: (tab: "history" | "settings" | "keyboard" | "components" | null) => void;
  
  // Hooks data
  chatSessions: ChatSession[];
  uiProjects: UIProject[];
  updateSession: (id: string, updates: Partial<ChatSession>) => void;
  updateProject: (id: string, updates: Partial<UIProject>) => void;
  addProject: (project: UIProject) => void;
  addSession: (session: ChatSession) => void;
  removeSession: (id: string) => void;
  setChatSessions: (sessions: ChatSession[] | ((prev: ChatSession[]) => ChatSession[])) => void;
  setActiveSessionId: (id: string | null) => void;
  setUiProjects: (projects: UIProject[] | ((prev: UIProject[]) => UIProject[])) => void;
  
  // Refs
  abortControllerRef: React.MutableRefObject<AbortController | null>;
  codeProjectIdRef: React.MutableRefObject<string | null>;
  loadedProjectDataRef: React.MutableRefObject<{ projectId: string | null; code: string; dsl: UiDsl | null }>;
  lastCodeRef: React.MutableRefObject<string>;
  lastA11yResultsRef: React.MutableRefObject<string | null>;
  shouldReplaceCurrentComponentRef: React.MutableRefObject<boolean>;
  
  // Helpers
  addLog: (step: LogEntry["step"], status: LogEntry["status"], message: string) => LogEntry;
  getActiveProject: () => UIProject | null;
  getActiveSession: () => ChatSession;
  createNewProject: (title?: string, sessionId?: string) => UIProject;
  updateActiveProject: (updates: Partial<UIProject>) => void;
  updateActiveSession: (updates: Partial<ChatSession>) => void;
  addCommit: (code: string, metadata?: any) => void;
  
  // UI state setters
  setPendingGenerationPrompt: (prompt: string | null) => void;
  setPendingCreateNewSession: (create: boolean) => void;
  setShowNewComponentDialog: (show: boolean) => void;
  setShowGitHubConfigDialog: (show: boolean) => void;
  setShowFileDialog: (show: boolean) => void;
  setFilePath: (path: string) => void;
  setSelectedElementId: (id: string | null) => void;
  setShowClearHistoryDialog: (show: boolean) => void;
  // Code History
  undoCode: () => void;
  redoCode: () => void;
  goToCommit: (commitId: string) => string | null;
  canUndoCode: boolean;
  canRedoCode: boolean;
  getCurrentCode: () => string;
  isApplyingHistoryRef: React.MutableRefObject<boolean>;
  activeProject: UIProject | null;
}

export function usePlaygroundActions(options: UsePlaygroundActionsOptions) {
  const {
    code,
    messages,
    inputMessage,
    isGenerating,
    generationMetadata,
    logs,
    a11yResults,
    activeProjectId,
    activeSessionId,
    selectedElementId,
    setCode,
    setMessages,
    setInputMessage,
    setIsGenerating,
    setGenerationMetadata,
    setLogs,
    setA11yResults,
    setActiveProjectId,
    setActivePreviewTab,
    setActiveSystemTab,
    chatSessions,
    uiProjects,
    updateSession,
    updateProject: updateProjectFromOptions,
    addProject,
    setChatSessions,
    setActiveSessionId,
    setUiProjects,
    abortControllerRef,
    setActiveProjectId: setActiveProjectIdFromOptions,
    codeProjectIdRef,
    loadedProjectDataRef,
    lastCodeRef,
    lastA11yResultsRef,
    shouldReplaceCurrentComponentRef,
    addLog,
    getActiveProject,
    getActiveSession,
    createNewProject,
    updateActiveProject,
    updateActiveSession,
    addCommit,
    updateProject: updateProjectFromOptions2,
    setPendingGenerationPrompt,
    setPendingCreateNewSession,
    setShowNewComponentDialog,
    setShowGitHubConfigDialog,
    setShowFileDialog,
    setFilePath,
    setShowClearHistoryDialog,
    activeProject,
  } = options;

  // Stop generation
  const handleStopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
    const sessionIdToUpdate = activeSessionId;
    if (sessionIdToUpdate) {
      updateSession(sessionIdToUpdate, { isGenerating: false });
    }
    addLog("generate", "error", "Generation stopped by user");
  }, [activeSessionId, abortControllerRef, setIsGenerating, updateSession, addLog]);

  // Copy code
  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  }, [code]);

  // Export code
  const handleExportCode = useCallback(() => {
    if (!code) {
      toast.error("No code to export");
      return;
    }

    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeProject?.title || "component"}.tsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Code exported successfully!");
  }, [code, activeProject]);

  // Copy DSL
  const handleCopyDSL = useCallback(() => {
    const currentProject = getActiveProject();
    if (!currentProject || !currentProject.dsl) {
      toast.error("No DSL available");
      return;
    }

    const dslString = typeof currentProject.dsl === 'string' 
      ? currentProject.dsl 
      : JSON.stringify(currentProject.dsl, null, 2);
    navigator.clipboard.writeText(dslString);
    toast.success("DSL copied to clipboard!");
  }, [getActiveProject]);

  // Share link - generates a shareable link using project ID
  const handleShareLink = useCallback(() => {
    const currentProject = getActiveProject();
    if (!currentProject || !code) {
      toast.error("No component to share");
      return;
    }

    // Generate or use existing shareableId
    let shareableId = currentProject.shareableId;
    if (!shareableId) {
      // Generate a short, URL-friendly ID
      shareableId = `comp-${currentProject.id.substring(0, 8)}-${Date.now().toString(36)}`;
      // Save shareableId to project
      updateProjectFromOptions(currentProject.id, { shareableId });
    }

    const shareableUrl = `${window.location.origin}/playground?component=${shareableId}`;
    navigator.clipboard.writeText(shareableUrl);
    toast.success("Shareable link copied to clipboard!");
  }, [code, getActiveProject, updateProjectFromOptions]);

  // Toggle favorite status for current component
  const handleToggleFavorite = useCallback(() => {
    const currentProject = getActiveProject();
    if (!currentProject) {
      toast.error("No component selected");
      return;
    }

    const newFavoriteStatus = !currentProject.isFavorite;
    updateProjectFromOptions(currentProject.id, { isFavorite: newFavoriteStatus });
    toast.success(newFavoriteStatus ? "Component added to favorites!" : "Component removed from favorites!");
  }, [getActiveProject, updateProjectFromOptions]);

  // Get shareable link for a component (without copying)
  const getShareableLink = useCallback((projectId?: string): string | null => {
    const targetProject = projectId 
      ? uiProjects.find(p => p.id === projectId)
      : getActiveProject();
    
    if (!targetProject) return null;

    let shareableId = targetProject.shareableId;
    if (!shareableId) {
      // Generate a short, URL-friendly ID
      shareableId = `comp-${targetProject.id.substring(0, 8)}-${Date.now().toString(36)}`;
      // Save shareableId to project
      updateProjectFromOptions(targetProject.id, { shareableId });
    }

    return `${window.location.origin}/playground?component=${shareableId}`;
  }, [uiProjects, getActiveProject, updateProjectFromOptions]);

  // Download ZIP
  const handleDownloadZIP = useCallback(async () => {
    if (!code) {
      toast.error("No code to download");
      return;
    }

    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      const currentProject = getActiveProject();
      const projectName = currentProject?.title || "component";
      const sanitizedName = projectName.replace(/[^a-z0-9]/gi, "-").toLowerCase();

      zip.file(`${sanitizedName}.tsx`, code);

      if (currentProject?.dsl) {
        const dslString = typeof currentProject.dsl === 'string' 
          ? currentProject.dsl 
          : JSON.stringify(currentProject.dsl, null, 2);
        zip.file(`${sanitizedName}.dsl.json`, dslString);
      }

      const readme = `# ${projectName}

This component was generated using Fragment UI Playground.

## Files

- \`${sanitizedName}.tsx\` - React component code
${currentProject?.dsl ? `- \`${sanitizedName}.dsl.json\` - UI-DSL definition\n` : ''}
## Usage

\`\`\`tsx
import { ${sanitizedName} } from './${sanitizedName}';

export default function App() {
  return <${sanitizedName} />;
}
\`\`\`

## Dependencies

This component requires:
- \`@fragment_ui/ui\` - Fragment UI Design System
- \`react\` - React 18.3.0+
- \`react-dom\` - React DOM 18.3.0+

## Generated

Generated on ${new Date().toLocaleString()}
`;
      zip.file("README.md", readme);

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${sanitizedName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("ZIP file downloaded successfully!");
    } catch (error) {
      logger.error("Failed to create ZIP:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create ZIP file");
    }
  }, [code, getActiveProject]);

  // Apply diff
  const handleApplyDiff = useCallback(() => {
    if (!code) {
      toast.error("No code to apply");
      return;
    }

    if (!hasGitHubConfig()) {
      setShowGitHubConfigDialog(true);
      return;
    }

    setShowFileDialog(true);
  }, [code, setShowGitHubConfigDialog, setShowFileDialog]);

  // Apply diff confirm
  const handleApplyDiffConfirm = useCallback(async () => {
    // This will be implemented with filePath from UI state
    // For now, return a function that can be called with filePath
    return async (filePath: string) => {
      if (!filePath || !code) {
        toast.error("Please enter a file path");
        return;
      }

      const config = getGitHubConfig();
      if (!config) {
        toast.error("GitHub configuration not found");
        return;
      }

      try {
        const branchName = `fragment-ui-apply-${Date.now()}`;
        await createBranch(config, branchName, config.branch || "main");
        await createOrUpdateFile(
          config,
          filePath,
          code,
          `Apply generated component: ${activeProject?.title || "Component"}`,
          branchName
        );
        
        toast.success(`Changes applied to ${filePath} in branch ${branchName}`);
        setShowFileDialog(false);
        setFilePath("");
      } catch (error) {
        logger.error("Failed to apply diff:", error);
        toast.error(error instanceof Error ? error.message : "Failed to apply diff");
      }
    };
  }, [code, activeProject, setShowFileDialog, setFilePath]);

  // Create story
  const handleCreateStory = useCallback(() => {
    if (!code) {
      toast.error("No code to create story from");
      return;
    }

    const componentName = activeProject?.title || "Component";
    const storyConfig: StoryConfig = {
      componentName,
      componentPath: `src/components/${componentName}.tsx`,
    };

    const storyContent = generateStoryFile(code, storyConfig);
    const storyPath = getStoryPath(storyConfig.componentPath);

    const blob = new Blob([storyContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = storyPath.split("/").pop() || "component.stories.tsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Story file downloaded: ${storyPath}`);
  }, [code, activeProject]);

  // Open PR
  const handleOpenPR = useCallback(async () => {
    if (!code) {
      toast.error("No code to create PR for");
      return;
    }

    if (!hasGitHubConfig()) {
      setShowGitHubConfigDialog(true);
      return;
    }

    const config = getGitHubConfig();
    if (!config) {
      toast.error("GitHub configuration not found");
      return;
    }

    // This will need filePath from UI state - return a function
    return async (filePath: string) => {
      if (!filePath) {
        setShowFileDialog(true);
        return;
      }

      try {
        const branchName = `fragment-ui-pr-${Date.now()}`;
        const baseBranch = config.branch || "main";

        const pr = await createPullRequest(config, {
          title: `Add component: ${activeProject?.title || "Component"}`,
          body: `This PR adds a new component generated by Fragment UI Copilot.\n\n**Component:** ${activeProject?.title || "Component"}\n**Generated:** ${new Date().toISOString()}`,
          head: branchName,
          base: baseBranch,
          files: [
            {
              path: filePath,
              content: code,
              mode: "100644",
            },
          ],
        });

        toast.success(`PR created: #${pr.number}`);
        window.open(pr.url, "_blank");
      } catch (error) {
        logger.error("Failed to create PR:", error);
        toast.error(error instanceof Error ? error.message : "Failed to create PR");
      }
    };
  }, [code, activeProject, setShowGitHubConfigDialog, setShowFileDialog]);

  // New component
  const handleNewComponent = useCallback(() => {
    setActiveProjectIdFromOptions(null);
    setCode("");
    setGenerationMetadata(null);
    setMessages([]);
    setLogs([]);
    setA11yResults(null);
    setActivePreviewTab("new-component");
  }, [setActiveProjectIdFromOptions, setCode, setGenerationMetadata, setMessages, setLogs, setA11yResults, setActivePreviewTab]);

  // New chat
  const handleNewChat = useCallback(() => {
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
    setMessages([]);
    setInputMessage("");
    setCode("");
    setGenerationMetadata(null);
    setLogs([]);
    setA11yResults(null);
    setActiveProjectIdFromOptions(null);
    setActivePreviewTab("new-component");
  }, [setChatSessions, setActiveSessionId, setMessages, setInputMessage, setCode, setGenerationMetadata, setLogs, setA11yResults, setActiveProjectIdFromOptions, setActivePreviewTab]);

  // Clear chat
  const handleClearChat = useCallback(() => {
    if (!activeSessionId) return;
    updateSession(activeSessionId, { messages: [], isGenerating: false });
    setMessages([]);
    setIsGenerating(false);
  }, [activeSessionId, updateSession, setMessages, setIsGenerating]);

  // Add to favourites
  const handleAddToFavourites = useCallback((sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      const newFavouriteStatus = !session.isFavourite;
      updateSession(sessionId, { isFavourite: newFavouriteStatus });
      toast.success(newFavouriteStatus ? "Added to favourites" : "Removed from favourites");
    }
  }, [chatSessions, updateSession]);

  // Delete session - needs removeSession passed as parameter
  const handleDeleteSession = useCallback((
    sessionId: string,
    removeSession: (id: string) => void
  ) => {
    removeSession(sessionId);
    
    if (activeSessionId === sessionId) {
      const remaining = chatSessions.filter(s => s.id !== sessionId);
      if (remaining.length > 0) {
        setActiveSessionId(remaining[remaining.length - 1].id);
      } else {
        setActiveSessionId(null);
        setMessages([]);
        setCode("");
        setGenerationMetadata(null);
        setLogs([]);
        setA11yResults(null);
        setUiProjects([]);
        setActiveProjectIdFromOptions(null);
        setActivePreviewTab("new-component");
      }
    }
  }, [chatSessions, activeSessionId, setActiveSessionId, setMessages, setCode, setGenerationMetadata, setLogs, setA11yResults, setUiProjects, setActiveProjectIdFromOptions, setActivePreviewTab]);

  // Key press handler
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>, onSendMessage: () => void) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  }, []);

  // Clear history - needs isClearingHistoryRef passed as parameter
  const handleClearHistory = useCallback((
    isClearingHistoryRef: React.MutableRefObject<boolean>
  ) => {
    if (isClearingHistoryRef.current) {
      return;
    }
    isClearingHistoryRef.current = true;
    
    setChatSessions(() => []);
    setActiveSessionId(null);
    setMessages(() => []);
    setCode("");
    setGenerationMetadata(null);
    setLogs(() => []);
    setA11yResults(null);
    setUiProjects(() => []);
    setActiveProjectId(null);
    setActivePreviewTab("new-component");
    
    // Clear localStorage
    try {
      localStorage.removeItem("fragment-ui-playground-chat-sessions");
      localStorage.removeItem("fragment-ui-playground-active-session-id");
      localStorage.removeItem("fragment-ui-playground-ui-projects");
      localStorage.removeItem("fragment-ui-playground-active-project-id");
    } catch (error) {
      logger.error("Error clearing localStorage:", error);
    }
    
    toast.success("Chat history cleared");
    setShowClearHistoryDialog(false);
    
    setTimeout(() => {
      isClearingHistoryRef.current = false;
    }, 100);
  }, [setChatSessions, setActiveSessionId, setMessages, setCode, setGenerationMetadata, setLogs, setA11yResults, setUiProjects, setActiveProjectIdFromOptions, setActivePreviewTab, setShowClearHistoryDialog]);

  // Replace current component
  const handleReplaceCurrentComponent = useCallback(async (
    pendingPrompt: string | null,
    createNewSession: boolean,
    onSendMessage: (prompt: string, createNew?: boolean) => Promise<void>
  ) => {
    if (!pendingPrompt) return;
    setShowNewComponentDialog(false);
    const prompt = pendingPrompt;
    setPendingGenerationPrompt(null);
    setPendingCreateNewSession(false);
    
    shouldReplaceCurrentComponentRef.current = true;
    await onSendMessage(prompt, createNewSession);
  }, [setShowNewComponentDialog, setPendingGenerationPrompt, setPendingCreateNewSession, shouldReplaceCurrentComponentRef]);

  // Create new tab
  const handleCreateNewTab = useCallback(async (
    pendingPrompt: string | null,
    createNewSession: boolean,
    onSendMessage: (prompt: string, createNew?: boolean) => Promise<void>
  ) => {
    if (!pendingPrompt) return;
    setShowNewComponentDialog(false);
    const prompt = pendingPrompt;
    setPendingGenerationPrompt(null);
    setPendingCreateNewSession(false);
    
    shouldReplaceCurrentComponentRef.current = false;
    await onSendMessage(prompt, createNewSession);
  }, [setShowNewComponentDialog, setPendingGenerationPrompt, setPendingCreateNewSession, shouldReplaceCurrentComponentRef]);

  // Close project
  const handleCloseProject = useCallback((projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateProjectFromOptions(projectId, { isOpen: false });
    
    const openProjects = uiProjects.filter(p => p.id !== projectId && (p.isOpen !== false));
    
    if (activeProjectId === projectId) {
      if (openProjects.length > 0) {
        setActiveProjectIdFromOptions(openProjects[openProjects.length - 1].id);
        const project = openProjects[openProjects.length - 1];
        setCode(project.code || "");
        setGenerationMetadata(project.generationMetadata);
        codeProjectIdRef.current = project.code ? openProjects[openProjects.length - 1].id : null;
      } else {
        setActiveProjectIdFromOptions(null);
        setCode("");
        setGenerationMetadata(null);
        setLogs([]);
        setA11yResults(null);
        codeProjectIdRef.current = null;
        setActivePreviewTab("new-component");
      }
    }
  }, [uiProjects, activeProjectId, updateProjectFromOptions, setActiveProjectIdFromOptions, setCode, setGenerationMetadata, setLogs, setA11yResults, codeProjectIdRef, setActivePreviewTab]);

  // Switch project
  const handleSwitchProject = useCallback((projectId: string, updateActiveProject: (updates: Partial<UIProject>) => void) => {
    if (process.env.NODE_ENV === "development") {
      logger.debug("[Playground] handleSwitchProject called:", { from: activeProjectId, to: projectId });
    }
    
    if (activeProjectId && activeProjectId !== projectId && codeProjectIdRef.current === activeProjectId) {
      updateActiveProject({ code, generationMetadata });
      if (process.env.NODE_ENV === "development") {
        logger.debug("[Playground] Saved current project before switching:", activeProjectId);
      }
    }
    
    setActiveProjectIdFromOptions(projectId);
    const project = uiProjects.find(p => p.id === projectId);
    if (project) {
      const projectCode = project.code || "";
      setCode(projectCode);
      setGenerationMetadata(project.generationMetadata);
      codeProjectIdRef.current = projectCode ? projectId : null;
      const projectDsl = project?.dsl ? (typeof project.dsl === 'string' ? JSON.parse(project.dsl) : project.dsl) : null;
      loadedProjectDataRef.current = { projectId, code: projectCode, dsl: projectDsl };
      if (projectCode) {
        setActivePreviewTab("preview");
      } else {
        setActivePreviewTab("new-component");
      }
    }
  }, [activeProjectId, code, generationMetadata, uiProjects, codeProjectIdRef, loadedProjectDataRef, setActiveProjectIdFromOptions, setCode, setGenerationMetadata, setActivePreviewTab]);

  // Preview error
  const handlePreviewError = useCallback((error: Error) => {
    addLog("preview", "error", error.message);
    toast.error(`Preview error: ${error.message}`);
  }, [addLog]);

  // A11y results (with ref check)
  const handleA11yResults = useCallback((results: A11yResults) => {
    const resultsHash = JSON.stringify({
      violations: results.violations.length,
      passes: results.passes,
      inapplicable: results.inapplicable,
      violationIds: results.violations.map(v => v.id).sort(),
    });
    
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
    
    // Send stats to telemetry API (fire and forget)
    const critical = results.violations.filter(v => v.impact === "critical").length;
    const serious = results.violations.filter(v => v.impact === "serious").length;
    const moderate = results.violations.filter(v => v.impact === "moderate").length;
    const minor = results.violations.filter(v => v.impact === "minor").length;
    
    const violationsByRule: Record<string, number> = {};
    results.violations.forEach((v) => {
      violationsByRule[v.id] = (violationsByRule[v.id] || 0) + 1;
    });
    
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
      if (process.env.NODE_ENV === "development") {
        console.warn("[A11y Telemetry] Failed to send stats:", error);
      }
    });
  }, [setA11yResults, lastA11yResultsRef, addLog, activeProject]);

  // A11y fix
  const handleA11yFix = useCallback(async (violationId: string, fix: any) => {
    try {
      const currentProject = getActiveProject();
      if (!currentProject) {
        toast.error("No active project to update");
        return;
      }

      const dsl = currentProject.dsl;
      if (!dsl) {
        toast.error("DSL not available for this project");
        return;
      }

      const parsedDsl = typeof dsl === 'string' ? JSON.parse(dsl) : dsl;

      if (fix.patch) {
        const patches = [fix.patch];
        const updatedDsl = applyPatches(parsedDsl, patches);

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

        updateActiveProject({
          dsl: updatedDsl,
          code: regeneratedCode,
        });

        setCode(regeneratedCode);
        codeProjectIdRef.current = currentProject.id;
        loadedProjectDataRef.current = {
          projectId: currentProject.id,
          code: regeneratedCode,
          dsl: updatedDsl,
        };

        lastCodeRef.current = regeneratedCode;
        addCommit(regeneratedCode, {
          message: `Applied A11y fix: ${fix.description}`,
          author: "user",
          type: "patch",
        });

        toast.success(`Applied fix: ${fix.description}`);
      } else {
        toast.info(`Manual fix required: ${fix.description}. See documentation for details.`);
      }
    } catch (error) {
      logger.error("Error applying A11y fix:", error);
      toast.error(`Failed to apply fix: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }, [getActiveProject, updateActiveProject, setCode, addCommit, codeProjectIdRef, loadedProjectDataRef, lastCodeRef]);

  return {
    // Generation
    handleStopGeneration,
    
    // Export/Share
    handleCopyCode,
    handleExportCode,
    handleCopyDSL,
    handleShareLink,
    handleDownloadZIP,
    getShareableLink,
    
    // Favorites
    handleToggleFavorite,
    
    // GitHub
    handleApplyDiff,
    handleApplyDiffConfirm,
    handleCreateStory,
    handleOpenPR,
    
    // Navigation
    handleNewComponent,
    handleNewChat,
    handleClearChat,
    handleClearHistory,
    
    // Component management
    handleReplaceCurrentComponent,
    handleCreateNewTab,
    handleCloseProject,
    handleSwitchProject,
    
    // Preview/A11y
    handlePreviewError,
    handleA11yResults,
    handleA11yFix,
    
    // Sessions
    handleAddToFavourites,
    handleDeleteSession,
    
    // Keyboard
    handleKeyPress,
  };
}
