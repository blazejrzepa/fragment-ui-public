"use client";

import React from "react";
import { ResizablePanel, ResizableHandle } from "@fragment_ui/ui";
import { PlaygroundLeftSidebar } from "./playground-left-sidebar";
import type { TreeNode } from "@fragment_ui/ui";
import type { ChatSession } from "@/types/chat";
import type { UIProject } from "@/hooks/use-ui-projects";
import type { Registry } from "@/types/registry";
import type { PlaygroundUIState } from "@/hooks/use-playground-state";

interface PlaygroundLeftSidebarWrapperProps {
  currentTab: string | null;
  isVisible: boolean;
  // Chat session props
  chatSessions: ChatSession[];
  selectedIds: string[];
  expandedChatIds: string[];
  treeNodes: TreeNode[];
  onExpansionChange: (ids: string[]) => void;
  onNewChat: () => void;
  showFavourites: boolean;
  onAddToFavourites: (nodeId: string) => void;
  onDeleteSession: (nodeId: string) => void;
  // Component props
  components: UIProject[];
  componentTreeNodes: TreeNode[];
  favouritesTreeNodes: TreeNode[];
  expandedComponentIds: string[];
  expandedFavouritesIds: string[];
  selectedComponentIds: string[];
  onComponentExpansionChange: (ids: string[]) => void;
  onFavouritesExpansionChange: (ids: string[]) => void;
  editingItemId: string | null;
  editingItemType: "component" | "folder" | null;
  editingItemName: string;
  onEditingItemNameChange: (name: string) => void;
  onSaveEdit: () => void;
  onDeleteFolder: (folderId: string) => void;
  onNewComponent: () => void;
  onNewFolder: () => void;
  onMoveComponent: (componentId: string, folderId: string | null, insertIndex?: number) => void;
  onMoveFolder: (folderId: string, targetFolderId: string | null, insertIndex?: number) => void;
  onReorderItem: (itemId: string, itemType: "component" | "folder", newIndex: number, parentId: string | null) => void;
  activeSection: "chat" | "components" | "ds-components";
  onSectionChange: (section: "chat" | "components" | "ds-components") => void;
  registry?: Registry;
  // Handler dependencies - passed as props to avoid inline handler creation
  setActiveSessionId: (sessionId: string) => void;
  updateUIState: <K extends keyof PlaygroundUIState>(
    key: K,
    value: PlaygroundUIState[K] | ((prev: PlaygroundUIState[K]) => PlaygroundUIState[K])
  ) => void;
  setSelectedTreeItemId: (id: string) => void;
  updateProject: (id: string, updates: Partial<UIProject>) => void;
  handleSwitchProject: (projectId: string) => void;
  setActiveSystemTab: (tab: "history" | "settings" | "keyboard" | "components" | "testing" | null) => void;
  setEditingItemId: (id: string | null) => void;
  setEditingItemType: (type: "component" | "folder" | null) => void;
  setEditingItemName: (name: string) => void;
  removeProject: (id: string) => void;
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
  setCode: (code: string) => void;
  setActivePreviewTab: (tab: "new-component" | "preview" | "code") => void;
  toast: typeof import("@fragment_ui/ui").toast;
  componentRenderer?: any;
  componentGenerator?: any;
  dsComponentTabs: Map<string, { name: string; code: string }>;
  setActiveDsComponentTab: (tabId: string | null) => void;
  setDsComponentTabs: React.Dispatch<React.SetStateAction<Map<string, { name: string; code: string }>>>;
  codeProjectIdRef: React.MutableRefObject<string | null>;
  loadedProjectDataRef: React.MutableRefObject<{ projectId: string | null; code: string; dsl: any }>;
}

export function PlaygroundLeftSidebarWrapper({
  currentTab,
  isVisible,
  chatSessions,
  selectedIds,
  expandedChatIds,
  treeNodes,
  onExpansionChange,
  onNewChat,
  showFavourites,
  onAddToFavourites,
  onDeleteSession,
  components,
  componentTreeNodes,
  favouritesTreeNodes,
  expandedComponentIds,
  expandedFavouritesIds,
  selectedComponentIds,
  onComponentExpansionChange,
  onFavouritesExpansionChange,
  editingItemId,
  editingItemType,
  editingItemName,
  onEditingItemNameChange,
  onSaveEdit,
  onDeleteFolder,
  onNewComponent,
  onNewFolder,
  onMoveComponent,
  onMoveFolder,
  onReorderItem,
  activeSection,
  onSectionChange,
  registry,
  // Handler dependencies
  setActiveSessionId,
  updateUIState,
  setSelectedTreeItemId,
  updateProject,
  handleSwitchProject,
  setActiveSystemTab,
  setEditingItemId,
  setEditingItemType,
  setEditingItemName,
  removeProject,
  activeProjectId,
  setActiveProjectId,
  setCode,
  setActivePreviewTab,
  toast,
  componentRenderer,
  componentGenerator,
  dsComponentTabs,
  setActiveDsComponentTab,
  setDsComponentTabs,
  codeProjectIdRef,
  loadedProjectDataRef,
}: PlaygroundLeftSidebarWrapperProps) {
  // Only render for playground tab
  if (currentTab !== "playground" && currentTab !== null) {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  // Create inline handlers
  const handleNodeClick = (node: TreeNode) => {
    // Only set active session if clicking on a session node (not a date node)
    if (node.data?.session) {
      const sessionId = node.id;
      setActiveSessionId(sessionId);
    }
  };

  const handleFavourites = () => {
    updateUIState("showFavourites", (prev: boolean) => !prev);
  };

  const handleComponentClick = (node: TreeNode) => {
    // Cancel editing if clicking on a different node
    if (editingItemId && editingItemId !== node.id) {
      onSaveEdit();
    }
    
    // Set selected tree item (folder or component)
    setSelectedTreeItemId(node.id);
    
    // Only set active project if clicking on a project node (not a folder or Projects root)
    if (node.data?.project) {
      const projectId = node.id;
      
      // Reopen the project if it was closed
      updateProject(projectId, { isOpen: true });
      
      // Use handleSwitchProject which properly loads the code
      // This ensures code is loaded from the latest project data in components
      handleSwitchProject(projectId);
      setActiveSystemTab(null);
    } else if (node.data?.folder || node.data?.isProjectsRoot) {
      // Clicked on folder or Projects root - just select it, don't switch project
      setActiveSystemTab(null);
    }
  };

  const handleComponentDoubleClick = (node: TreeNode) => {
    // Start editing on double click or Edit menu item
    if (node.data?.project) {
      setEditingItemId(node.id);
      setEditingItemType("component");
      // Extract string from label (can be string or ReactNode)
      const labelText = typeof node.label === 'string' ? node.label : (node.data?.project?.title || 'Component');
      setEditingItemName(labelText);
    } else if (node.data?.folder) {
      setEditingItemId(node.id);
      setEditingItemType("folder");
      // Extract string from label (can be string or ReactNode)
      const labelText = typeof node.label === 'string' ? node.label : (node.data?.folder?.name || 'Folder');
      setEditingItemName(labelText);
    }
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditingItemType(null);
    setEditingItemName("");
  };

  const handleDeleteComponent = (componentId: string) => {
    removeProject(componentId);
    if (activeProjectId === componentId) {
      setActiveProjectId(null);
      setCode("");
      setActivePreviewTab("new-component");
    }
    toast.success("Component deleted");
  };

  const handleToggleComponentFavorite = (componentId: string) => {
    // Find component and toggle favorite status
    const component = components.find(p => p.id === componentId);
    if (component) {
      const newFavoriteStatus = !component.isFavorite;
      updateProject(componentId, { isFavorite: newFavoriteStatus });
      toast.success(newFavoriteStatus ? "Component added to favorites!" : "Component removed from favorites!");
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

      // Debug: log generated code
      console.log(`[DS Components] Generated code for "${componentName}":`, {
        codeLength: componentCode.length,
        hasDefaultExport: componentCode.includes('export default'),
        preview: componentCode.substring(0, 200) + '...'
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
        // Update the code in case it changed
        setDsComponentTabs(prev => {
          const next = new Map(prev);
          next.set(existingTabId!, { name: componentName, code: componentCode });
          return next;
        });
        setCode(componentCode);
      } else {
        // Create a new DS Component tab (NOT a project)
        setDsComponentTabs(prev => {
          const next = new Map(prev);
          next.set(finalTabId, { name: componentName, code: componentCode });
          return next;
        });
        
        // Set as active DS component tab
        setActiveDsComponentTab(finalTabId);
        setCode(componentCode);
      }
      
      // Clear project references since this is not a project
      setActiveProjectId(null);
      codeProjectIdRef.current = null;
      loadedProjectDataRef.current = {
        projectId: null,
        code: componentCode,
        dsl: null,
      };
      
      // Close system tabs to show the component preview
      setActiveSystemTab(null);
      setActivePreviewTab("preview");
      
      // Debug: verify code is set
      console.log(`[DS Components] Final state after opening "${componentName}":`, {
        codeLength: componentCode.length,
        activeDsComponentTab: finalTabId,
        activePreviewTab: "preview",
        activeSystemTab: null,
        hasCode: componentCode.length > 0
      });
      
      toast.success(`Opened ${componentName} in a new tab.`);
    } catch (error) {
      console.error(`[DS Components] Error rendering component "${componentName}":`, error);
      toast.error(`Failed to render component: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <>
      <div 
        className="flex flex-col bg-[color:var(--background-primary)] min-h-0"
        style={{
          borderRight: "1px solid color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
          width: "300px", // Force exact width
          flexShrink: 0,
          flexGrow: 0,
        }}
      >
        <ResizablePanel 
          defaultSizePx={300} 
          minSizePx={200} 
          maxSize={35} 
          className="flex flex-col min-h-0"
        >
        <PlaygroundLeftSidebar
          chatSessions={chatSessions}
          selectedIds={selectedIds}
          expandedChatIds={expandedChatIds}
          treeNodes={treeNodes}
          onExpansionChange={onExpansionChange}
          onNodeClick={handleNodeClick}
          onNewChat={onNewChat}
          onFavourites={handleFavourites}
          showFavourites={showFavourites}
          onAddToFavourites={onAddToFavourites}
          onDeleteSession={onDeleteSession}
          components={components}
          componentTreeNodes={componentTreeNodes}
          favouritesTreeNodes={favouritesTreeNodes}
          expandedComponentIds={expandedComponentIds}
          expandedFavouritesIds={expandedFavouritesIds}
          selectedComponentIds={selectedComponentIds}
          onComponentExpansionChange={onComponentExpansionChange}
          onFavouritesExpansionChange={onFavouritesExpansionChange}
          onComponentClick={handleComponentClick}
          onComponentDoubleClick={handleComponentDoubleClick}
          editingItemId={editingItemId}
          editingItemType={editingItemType}
          editingItemName={editingItemName}
          onEditingItemNameChange={onEditingItemNameChange}
          onSaveEdit={onSaveEdit}
          onCancelEdit={handleCancelEdit}
          onDeleteComponent={handleDeleteComponent}
          onDeleteFolder={onDeleteFolder}
          onToggleComponentFavorite={handleToggleComponentFavorite}
          onNewComponent={onNewComponent}
          onNewFolder={onNewFolder}
          onMoveComponent={onMoveComponent}
          onMoveFolder={onMoveFolder}
          onReorderItem={onReorderItem}
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          registry={registry}
          onComponentSelect={handleComponentSelect}
        />
        </ResizablePanel>
      </div>
      <ResizableHandle 
        className="hover:bg-zinc-500"
      />
    </>
  );
}

