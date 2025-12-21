"use client";

import React, { useMemo, useEffect } from "react";
import { ResizablePanel, ResizableHandle } from "@fragment_ui/ui";
import dynamic from "next/dynamic";
import type { TreeNode } from "@fragment_ui/ui";
import type { ChatSession } from "@/types/chat";
import type { Message } from "@/types/chat";
import type { UIProject } from "@/hooks/use-ui-projects";

// Dynamic import for PlaygroundCopilotInspector
const PlaygroundCopilotInspector = dynamic(() => import("./playground-copilot-inspector").then(mod => ({ default: mod.PlaygroundCopilotInspector })), {
  ssr: false,
});

interface PlaygroundRightSidebarWrapperProps {
  currentTab: string | null;
  isVisible: boolean;
  // Copilot Inspector props
  activeCopilotTab: "copilot" | "inspector" | "governance";
  setActiveCopilotTab: (tab: "copilot" | "inspector" | "governance") => void;
  messages: Message[];
  inputMessage: string;
  isGenerating: boolean;
  isCurrentlyGenerating: boolean;
  setInputMessage: (value: string) => void;
  handleSendMessage: (prompt?: string, createNewSession?: boolean) => void;
  handleStopGeneration: (() => void) | undefined;
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  code: string;
  activeProjectId: string | null;
  activeDsComponentTab: string | null;
  uiProjects: UIProject[];
  getActiveProject: () => UIProject | null;
  getShareableLink: (projectId?: string) => string | null;
  updateProject: (id: string, updates: Partial<UIProject>) => void;
  toast: typeof import("@fragment_ui/ui").toast;
  // Chat history props
  chatSessions: ChatSession[];
  selectedIds: string[];
  expandedChatIds: string[];
  treeNodes: TreeNode[];
  setExpandedChatIds: (ids: string[]) => void;
  setActiveSessionId: (sessionId: string) => void;
  handleAddToFavourites: (nodeId: string) => void;
  handleDeleteSession: (nodeId: string) => void;
  handleVariantsGenerated: (variants: any[]) => void;
  handleNewChat: () => void;
  handleClearChat: () => void;
  // Component selection props
  componentRenderer?: any;
  componentGenerator?: any;
  registry?: any;
  dsComponentTabs: Map<string, { name: string; code: string }>;
  setActiveDsComponentTab: (tabId: string | null) => void;
  setDsComponentTabs: React.Dispatch<React.SetStateAction<Map<string, { name: string; code: string }>>>;
  setCode: (code: string) => void;
  setActiveProjectId: (id: string | null) => void;
  setActiveSystemTab: (tab: "history" | "settings" | "keyboard" | "components" | "testing" | null) => void;
  setActivePreviewTab: (tab: "new-component" | "preview" | "code") => void;
  codeProjectIdRef: React.MutableRefObject<string | null>;
  loadedProjectDataRef: React.MutableRefObject<{ projectId: string | null; code: string; dsl: any }>;
  lastCodeRef: React.MutableRefObject<string>;
  // Inspector update props
  updateActiveProject: (updates: Partial<UIProject>) => void;
  addCommit: (code: string, metadata?: { message?: string; author?: "user" | "ai" | "system"; type?: "generation" | "edit" | "patch" | "manual"; }) => void;
  activeSessionId: string | null;
  updateActiveSession: (updates: Partial<ChatSession>) => void;
  // Patch operations
  applyPatches: (dsl: any, patches: any[]) => any;
  // Sidebar visibility
  isRightSidebarVisible: boolean;
  setIsRightSidebarVisible: (visible: boolean) => void;
}

export function PlaygroundRightSidebarWrapper({
  currentTab,
  isVisible,
  activeCopilotTab,
  setActiveCopilotTab,
  messages,
  inputMessage,
  isGenerating,
  isCurrentlyGenerating,
  setInputMessage,
  handleSendMessage,
  handleStopGeneration,
  selectedElementId,
  setSelectedElementId,
  code,
  activeProjectId,
  activeDsComponentTab,
  uiProjects,
  getActiveProject,
  getShareableLink,
  updateProject,
  toast,
  chatSessions,
  selectedIds,
  expandedChatIds,
  treeNodes,
  setExpandedChatIds,
  setActiveSessionId,
  handleAddToFavourites,
  handleDeleteSession,
  handleVariantsGenerated,
  handleNewChat,
  handleClearChat,
  componentRenderer,
  componentGenerator,
  registry,
  dsComponentTabs,
  setActiveDsComponentTab,
  setDsComponentTabs,
  setCode,
  setActiveProjectId,
  setActiveSystemTab,
  setActivePreviewTab,
  codeProjectIdRef,
  loadedProjectDataRef,
  lastCodeRef,
  updateActiveProject,
  addCommit,
  activeSessionId,
  updateActiveSession,
  applyPatches,
  isRightSidebarVisible,
  setIsRightSidebarVisible,
}: PlaygroundRightSidebarWrapperProps) {
  // Get active project (hooks must be called before conditional returns)
  const activeProject = useMemo(() => getActiveProject(), [getActiveProject, activeProjectId, uiProjects]);

  // Calculate shareableLink without updating state during render
  const shareableLink = useMemo(() => {
    if (!activeProjectId || !activeProject) return null;
    
    // If shareableId exists, use it to generate link
    if (activeProject.shareableId) {
      return `${typeof window !== 'undefined' ? window.location.origin : ''}/playground?component=${activeProject.shareableId}`;
    }
    
    // Return null if shareableId doesn't exist yet (will be generated in useEffect)
    return null;
  }, [activeProjectId, activeProject]);

  // Generate shareableId if it doesn't exist (outside of render)
  useEffect(() => {
    if (!activeProjectId || !activeProject || activeProject.shareableId) return;
    
    // Generate a short, URL-friendly ID
    const shareableId = `comp-${activeProject.id.substring(0, 8)}-${Date.now().toString(36)}`;
    // Save shareableId to project (this will trigger a re-render)
    updateProject(activeProject.id, { shareableId });
  }, [activeProjectId, activeProject, updateProject]);

  // Only render for playground tab (after all hooks)
  if (currentTab !== "playground" && currentTab !== null) {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  // Create inline handlers
  const handleChatNodeClick = (node: TreeNode) => {
    // Only set active session if clicking on a session node (not a date node)
    if (node.data?.session) {
      const sessionId = node.id;
      setActiveSessionId(sessionId);
    }
  };

  const handleUpdateProjectName = (newName: string) => {
    if (activeProjectId) {
      updateProject(activeProjectId, { title: newName });
      toast.success("Component name updated");
    }
  };

  const handleComponentSelect = async (componentName: string) => {
    if (!componentRenderer || !registry) {
      toast.error("Component system not initialized. Please refresh the page.");
      return;
    }

    try {
      // Use new component renderer system
      const componentCode = await componentRenderer.render(componentName, {
        code: '',
        metadata: componentGenerator!.resolveComponent(componentName),
        onError: (error: any) => {
          console.error(`[DS Components] Render error for "${componentName}":`, error);
          toast.error(`Failed to render component: ${error.message}`);
        },
        onSuccess: () => {
          console.log(`[DS Components] Successfully generated code for "${componentName}"`);
        }
      });

      // Check if a tab for this component already exists
      let existingTabId: string | null = null;
      for (const [tabId, tab] of dsComponentTabs.entries()) {
        if (tab.name === componentName) {
          existingTabId = tabId;
          break;
        }
      }
      
      // Determine the final tab ID (either existing or new)
      const finalTabId = existingTabId || `ds-${componentName}-${Date.now()}`;
      
      if (existingTabId) {
        // Tab already exists, activate it instead of creating a new one
        setActiveDsComponentTab(existingTabId);
        setDsComponentTabs(prev => {
          const next = new Map(prev);
          next.set(existingTabId!, { name: componentName, code: componentCode });
          return next;
        });
        setCode(componentCode);
      } else {
        // Create a new DS Component tab
        setDsComponentTabs(prev => {
          const next = new Map(prev);
          next.set(finalTabId, { name: componentName, code: componentCode });
          return next;
        });
        
        setActiveDsComponentTab(finalTabId);
        setCode(componentCode);
      }
      
      // Clear project references
      setActiveProjectId(null);
      codeProjectIdRef.current = null;
      loadedProjectDataRef.current = {
        projectId: null,
        code: componentCode,
        dsl: null,
      };
      
      setActiveSystemTab(null);
      setActivePreviewTab("preview");
      
      toast.success(`Opened ${componentName} in a new tab.`);
    } catch (error) {
      console.error(`[DS Components] Error rendering component "${componentName}":`, error);
      toast.error(`Failed to render component: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleUpdateInspector = async (patch: any) => {
    try {
      console.log("[Inspector] onUpdateInspector called:", { patch });
      
      const currentProject = getActiveProject();
      if (!currentProject) {
        console.error("[Inspector] No active project");
        toast.error("No active project to update");
        return;
      }

      // Get current DSL
      let dsl = currentProject.dsl;
      
      if (!dsl && currentProject.code) {
        console.warn("[Inspector] DSL not available. Component needs to be regenerated to enable Inspector editing.");
        toast.error("DSL not available. Please regenerate the component first to enable Inspector editing.");
        return;
      }
      
      if (!dsl) {
        console.error("[Inspector] DSL not available for project:", currentProject.id);
        toast.error("DSL not available for this project. Please regenerate the component first.");
        return;
      }

      // Parse DSL if it's a string
      const parsedDsl = typeof dsl === 'string' ? JSON.parse(dsl) : dsl;
      
      // Check if this is UI-DSL v2 (has type: "page")
      const isV2 = parsedDsl?.type === "page";
      
      if (!isV2) {
        console.warn("[Inspector] Old DSL format detected. Using legacy patch system.");
        // Fallback to old system for v1 DSL
        if (!parsedDsl || !parsedDsl.type || !parsedDsl.id) {
          console.error("[Inspector] Invalid DSL structure:", parsedDsl);
          toast.error("Invalid DSL structure. Please regenerate the component.");
          return;
        }
        const patches = Array.isArray(patch) ? patch : [patch];
        const updatedDsl = applyPatches(parsedDsl, patches);
        
        // Regenerate code from updated DSL
        const regenerateResponse = await fetch("/api/regenerate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dsl: updatedDsl }),
        });

        if (!regenerateResponse.ok) {
          const errorData = await regenerateResponse.json();
          throw new Error(errorData.error || "Failed to regenerate code");
        }

        const regenerateData = await regenerateResponse.json();
        const regeneratedCode = regenerateData.code;
        
        updateActiveProject({ dsl: updatedDsl, code: regeneratedCode });
        setCode(regeneratedCode);
        codeProjectIdRef.current = currentProject.id;
        lastCodeRef.current = regeneratedCode;
        addCommit(regeneratedCode, {
          message: "Updated element properties",
          author: "user",
          type: "edit",
        });
        toast.success("Component updated successfully!");
        return;
      }

      // UI-DSL v2: Convert patch format and use new API
      const targetId = patch.target?.id;
      if (!targetId) {
        console.error("[Inspector] Patch missing target ID");
        toast.error("Invalid patch: missing target ID");
        return;
      }

      // Convert patch to UI-DSL v2 format
      const v2Patch: any = {
        targetId,
        op: patch.op,
        args: {},
      };

      // Map patch args based on operation
      if (patch.op === "setProp" && 'prop' in patch) {
        v2Patch.args = {
          path: `props.${patch.prop}`,
          value: patch.value,
        };
      } else if (patch.op === "setToken" && 'token' in patch) {
        v2Patch.args = {
          path: `layout.${patch.token}`,
          value: patch.value,
        };
      } else if (patch.op === "toggleVariant" && 'variant' in patch) {
        v2Patch.args = {
          variant: patch.variant,
        };
      } else {
        // For other operations, pass through args
        v2Patch.args = { ...patch };
        delete v2Patch.args.op;
        delete v2Patch.args.target;
      }

      console.log("[Inspector] Applying v2 patch:", v2Patch);

      // Call new DSL Patch API
      const patchResponse = await fetch("/api/dsl/patch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dsl: parsedDsl,
          patch: v2Patch,
          generateInverse: true, // For undo support
        }),
      });

      if (!patchResponse.ok) {
        const errorData = await patchResponse.json();
        console.error("[Inspector] Patch failed:", errorData);
        throw new Error(errorData.error || "Failed to apply patch");
      }

      const patchResult = await patchResponse.json();
      
      if (patchResult.error) {
        const diagnostics = patchResult.diagnostics || [];
        const errorMsg = diagnostics.find((d: any) => d.level === "error")?.message || patchResult.error;
        throw new Error(errorMsg);
      }

      const updatedDsl = patchResult.dsl;
      const inversePatch = patchResult.inversePatch;
      
      console.log("[Inspector] Patch applied, generating code...");

      // Generate code from updated DSL
      const codeResponse = await fetch("/api/code/gen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dsl: updatedDsl }),
      });

      if (!codeResponse.ok) {
        const errorData = await codeResponse.json();
        console.error("[Inspector] Code generation failed:", errorData);
        throw new Error(errorData.error || "Failed to generate code");
      }

      const codeResult = await codeResponse.json();
      const regeneratedCode = codeResult.code;
      
      console.log("[Inspector] Code generated successfully");

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
        dsl: updatedDsl 
      };

      // Add commit for inspector update
      lastCodeRef.current = regeneratedCode;
      addCommit(regeneratedCode, {
        message: "Updated element properties",
        author: "user",
        type: "edit",
      });

      // C4: Integrate with chat session - track patch in history
      if (activeSessionId && currentProject?.chatSessionId === activeSessionId) {
        try {
          // Import session manager functions
          const { getOrCreateSession, addPatchToHistory, addMessageToHistory } = await import("@/lib/chat/session-manager");
          
          // Get or create session
          const session = getOrCreateSession(activeSessionId);
          
          // Update session with latest DSL and code
          session.currentDSL = updatedDsl;
          session.currentCode = regeneratedCode;
          
          // Add patch to history
          addPatchToHistory(
            activeSessionId,
            v2Patch,
            `Updated ${patch.op} on element ${targetId}`,
            targetId,
            parsedDsl,
            updatedDsl
          );
          
          // Add message to conversation history
          const patchDescription = patch.op === "setProp" 
            ? `Changed ${patch.prop} to ${JSON.stringify(patch.value)}`
            : patch.op === "setToken"
            ? `Updated ${patch.token} token to ${patch.value}`
            : `Applied ${patch.op} operation`;
          
          addMessageToHistory(activeSessionId, "user", `[Inspector] ${patchDescription}`, "patch");
          
          // Update chat session in UI (if session exists)
          const sessionInUI = chatSessions.find(s => s.id === activeSessionId);
          if (sessionInUI) {
            updateActiveSession({
              messages: [
                ...(sessionInUI.messages || []),
                {
                  id: `msg-${Date.now()}`,
                  role: "user" as const,
                  content: `[Inspector] ${patchDescription}`,
                  timestamp: new Date(),
                },
              ],
            });
          }
        } catch (sessionError) {
          console.warn("[Inspector] Failed to track patch in chat session:", sessionError);
          // Don't fail the whole operation if session tracking fails
        }
      }

      toast.success("Component updated successfully!");
    } catch (error) {
      console.error("Error applying patch:", error);
      toast.error(error instanceof Error ? error.message : "Failed to apply patch");
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInputMessage(prompt);
    // Open right pane if it was closed
    if (!isRightSidebarVisible) {
      setIsRightSidebarVisible(true);
    }
    handleSendMessage(prompt, true); // true = create new session
  };

  return (
    <>
      <ResizableHandle className="hover:bg-zinc-500" />
      <ResizablePanel defaultSizePx={320} minSizePx={200} maxSize={30} className="flex flex-col bg-[color:var(--background-primary)] min-h-0">
        <PlaygroundCopilotInspector
          activeTab={activeCopilotTab}
          onTabChange={setActiveCopilotTab}
          messages={messages}
          inputMessage={inputMessage}
          isGenerating={isGenerating}
          isCurrentlyGenerating={isCurrentlyGenerating}
          onInputChange={setInputMessage}
          onSendMessage={() => handleSendMessage()}
          onStopGeneration={handleStopGeneration || (() => {})}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          selectedElementId={selectedElementId}
          code={code}
          dsl={getActiveProject()?.dsl || null}
          shareableLink={shareableLink}
          projectTitle={activeProjectId ? getActiveProject()?.title || null : null}
          onUpdateProjectName={handleUpdateProjectName}
          isDSComponent={activeDsComponentTab !== null}
          onCloseInspector={() => setSelectedElementId(null)}
          chatSessions={chatSessions}
          selectedChatIds={selectedIds}
          expandedChatIds={expandedChatIds}
          chatTreeNodes={treeNodes}
          onChatExpansionChange={setExpandedChatIds}
          onChatNodeClick={handleChatNodeClick}
          onAddToFavourites={handleAddToFavourites}
          onDeleteSession={handleDeleteSession}
          onVariantsGenerated={handleVariantsGenerated}
          onComponentSelect={handleComponentSelect}
          onUpdateInspector={handleUpdateInspector}
          hasProjects={uiProjects.length > 0}
          onNewChat={handleNewChat}
          onClearChat={handleClearChat}
          onPromptClick={handlePromptClick}
        />
      </ResizablePanel>
    </>
  );
}
