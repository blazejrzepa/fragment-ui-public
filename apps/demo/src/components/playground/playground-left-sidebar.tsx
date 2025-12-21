"use client";

import React, { useState, useMemo } from "react";
import { Plus, Star, MoreHorizontal, Trash, MessageSquare, Component, Folder, FolderPlus, Edit, Search, Package, X } from "lucide-react";
import { TreeView, type TreeNode, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, Tooltip, Input, ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from "@fragment_ui/ui";
import clsx from "clsx";
import type { ChatSession } from "@/types/chat";
import type { UIProject } from "@/hooks/use-ui-projects";

// List of all available components (matching DS Portal)
// This is the source of truth for all components with documentation pages
const ALL_COMPONENTS = [
  "accordion",
  "activity-feed",
  "alert",
  "aspect-ratio",
  "avatar",
  "badge",
  "breadcrumbs",
  "button",
  "calendar",
  "card",
  "carousel",
  "chart",
  "checkbox",
  "collapsible",
  "color-picker",
  "combobox",
  "command-palette",
  "context-menu",
  "data-table",
  "date-picker",
  "dialog",
  "dropdown-menu",
  "file-upload",
  "filter-bar",
  "form-field",
  "hover-card",
  "input",
  "kbd",
  "menubar",
  "metric-card",
  "multi-select",
  "navigation-menu",
  "notification-list",
  "pagination",
  "popover",
  "progress",
  "quick-actions",
  "radio",
  "rating",
  "resizable",
  "scroll-area",
  "segmented-control",
  "select",
  "separator",
  "sheet",
  "skeleton",
  "slider",
  "spinner",
  "split-button",
  "stepper",
  "switch",
  "table",
  "tabs",
  "tag-input",
  "textarea",
  "timeline",
  "toast",
  "toggle",
  "toggle-group",
  "tooltip",
  "tree-view",
];

// List of known blocks (matching DS Portal)
const KNOWN_BLOCKS = [
  "authentication-block",
  "card-grid",
  "dashboard-layout",
  "form-container",
  "navigation-header",
  "pricing-table",
  "settings-screen",
  "hero-section",
  "feature-grid-section",
  "stats-section",
  "testimonials-section",
  "faq-section",
  "cta-section",
  "widget-container",
  "dashboard-widgets",
  "benefits-section",
  "comparison-section",
  "footer-section",
  "kpi-dashboard",
  "analytics-dashboard",
];

// UI components exceptions (components with hyphens that are UI components, not blocks)
// These should appear in the "Components" tab, not "Blocks" tab
const uiComponentExceptions = [
  "multi-select",
  "command-palette",
  "date-picker",
  "toggle-group",
  "tree-view",
  "color-picker",
  "segmented-control",
  "rating",
  "file-upload",
  "split-button",
  "tag-input",
  "activity-feed",
  "quick-actions",
  "filter-bar",
  "notification-list",
  "metric-card",
  "chart",
  "dropdown-menu",
  "context-menu",
  "hover-card",
  "navigation-menu",
  "scroll-area",
  "aspect-ratio",
  "data-table",
  "form-field",
];

interface PlaygroundLeftSidebarProps {
  chatSessions: ChatSession[];
  selectedIds: string[];
  expandedChatIds: string[];
  treeNodes: TreeNode[];
  onExpansionChange: (ids: string[]) => void;
  onNodeClick: (node: TreeNode) => void;
  onNewChat: () => void;
  onFavourites?: () => void;
  showFavourites?: boolean;
  onAddToFavourites?: (nodeId: string) => void;
  onDeleteSession?: (nodeId: string) => void;
  // Components section props
  components?: UIProject[];
  componentTreeNodes?: TreeNode[];
  favouritesTreeNodes?: TreeNode[];
  expandedComponentIds?: string[];
  expandedFavouritesIds?: string[];
  selectedComponentIds?: string[];
  onComponentExpansionChange?: (ids: string[]) => void;
  onFavouritesExpansionChange?: (ids: string[]) => void;
  onComponentClick?: (node: TreeNode) => void;
  onComponentDoubleClick?: (node: TreeNode) => void;
  onNewComponent?: () => void;
  onNewFolder?: () => void;
  onRenameComponent?: (componentId: string, newName: string) => void;
  onRenameFolder?: (folderId: string, newName: string) => void;
  editingItemId?: string | null;
  editingItemType?: "component" | "folder" | null;
  editingItemName?: string;
  onEditingItemNameChange?: (name: string) => void;
  onSaveEdit?: () => void;
  onCancelEdit?: () => void;
  onDeleteComponent?: (componentId: string) => void;
  onDeleteFolder?: (folderId: string) => void;
  onToggleComponentFavorite?: (componentId: string) => void;
  onMoveComponent?: (componentId: string, folderId: string | null, insertIndex?: number) => void;
  onMoveFolder?: (folderId: string, targetFolderId: string | null, insertIndex?: number) => void;
  onReorderItem?: (itemId: string, itemType: "component" | "folder", newIndex: number, parentId: string | null) => void;
  activeSection?: "chat" | "components" | "ds-components";
  onSectionChange?: (section: "chat" | "components" | "ds-components") => void;
  // DS Components section props
  registry?: {
    components?: Record<string, {
      import?: string;
      props?: Record<string, any>;
      note?: string;
    }>;
    aliases?: Record<string, string>;
  };
  onComponentSelect?: (componentName: string) => void;
}

export const PlaygroundLeftSidebar = React.memo(function PlaygroundLeftSidebar({
  chatSessions,
  selectedIds,
  expandedChatIds,
  treeNodes,
  onExpansionChange,
  onNodeClick,
  onNewChat,
  onFavourites,
  showFavourites = false,
  onAddToFavourites,
  onDeleteSession,
  components = [],
  componentTreeNodes = [],
  favouritesTreeNodes = [],
  expandedComponentIds = [],
  expandedFavouritesIds = [],
  selectedComponentIds = [],
  onComponentExpansionChange,
  onFavouritesExpansionChange,
  onComponentClick,
  onComponentDoubleClick,
  onNewComponent,
  onNewFolder,
  onRenameComponent,
  onRenameFolder,
  editingItemId,
  editingItemType,
  editingItemName,
  onEditingItemNameChange,
  onSaveEdit,
  onCancelEdit,
  onDeleteComponent,
  onDeleteFolder,
  onToggleComponentFavorite,
  onMoveComponent,
  onMoveFolder,
  onReorderItem,
  activeSection = "components",
  onSectionChange,
  registry,
  onComponentSelect,
}: PlaygroundLeftSidebarProps) {
  const [dsSearchQuery, setDsSearchQuery] = useState("");

  // Filter DS components based on search query, subcategory, and hide subcomponents
  // Use registry as the single source of truth
  const filteredDsComponents = useMemo(() => {
    const registryComponents = registry?.components || {};
    
    // Build a set of all subcomponents (components that are required by other components)
    const subcomponents = new Set<string>();
    for (const [name, component] of Object.entries(registryComponents)) {
      if ((component as any).requiresSubcomponents) {
        for (const subcomponent of (component as any).requiresSubcomponents) {
          subcomponents.add(subcomponent);
        }
      }
    }
    
    // Build a set of all aliases (components that are aliases for other components)
    const aliases = new Set<string>();
    if (registry?.aliases) {
      for (const alias of Object.keys(registry.aliases)) {
        aliases.add(alias);
      }
    }
    
    // Get all component names from registry
    const allRegistryComponents = Object.keys(registryComponents);
    
    // Filter components: those without hyphens OR those in uiComponentExceptions
    let uiComponents = allRegistryComponents
      .filter((name) => {
        const normalized = name.toLowerCase();
        // Include if it doesn't have a hyphen, or if it's in exceptions
        return !normalized.includes("-") || uiComponentExceptions.includes(normalized);
      })
      .filter((name) => {
        // Don't show if it's a subcomponent
        if (subcomponents.has(name)) {
          return false;
        }
        // Don't show if it's an alias (aliases are shown through their main component)
        if (aliases.has(name)) {
          return false;
        }
        // Only show if it exists in registry
        if (!registryComponents[name]) {
          return false;
        }
        return true;
      });
    
    // Debug: log if Accordion is in the list (only if registry is loaded)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && registry && allRegistryComponents.length > 0) {
      const accordionInList = uiComponents.includes('Accordion');
      if (!accordionInList) {
        console.warn('[Left Sidebar] Accordion not found in uiComponents. Total components:', uiComponents.length);
        console.warn('[Left Sidebar] First 10 components:', uiComponents.slice(0, 10));
        console.warn('[Left Sidebar] Registry has Accordion:', !!registryComponents['Accordion']);
        console.warn('[Left Sidebar] All registry components count:', allRegistryComponents.length);
      }
    }
    
    // Filter blocks: those with hyphens that are NOT in uiComponentExceptions
    let allBlocks = allRegistryComponents
      .filter((k) => {
        const normalized = k.toLowerCase();
        return normalized.includes("-") && !uiComponentExceptions.includes(normalized);
      })
      .filter((name) => {
        // Don't show if it's a subcomponent
        if (subcomponents.has(name)) {
          return false;
        }
        // Don't show if it's an alias
        if (aliases.has(name)) {
          return false;
        }
        // Only show if it exists in registry
        if (!registryComponents[name]) {
          return false;
        }
        return true;
      });
    
    // Apply search filter if query exists
    if (dsSearchQuery.trim()) {
      const query = dsSearchQuery.toLowerCase();
      uiComponents = uiComponents.filter(name => {
        const component = registryComponents[name];
        const componentInfo = component as any;
        return (
          name.toLowerCase().includes(query) ||
          component?.import?.toLowerCase().includes(query) ||
          component?.note?.toLowerCase().includes(query) ||
          componentInfo?.description?.toLowerCase().includes(query)
        );
      });
      
      allBlocks = allBlocks.filter(name => {
        const component = registryComponents[name];
        const componentInfo = component as any;
        return (
          name.toLowerCase().includes(query) ||
          component?.import?.toLowerCase().includes(query) ||
          component?.note?.toLowerCase().includes(query) ||
          componentInfo?.description?.toLowerCase().includes(query)
        );
      });
    }
    
    // Always return both components and blocks combined
      const combined = [...uiComponents, ...allBlocks];
      const unique = Array.from(new Set(combined));
      return unique.sort((a, b) => a.localeCompare(b));
  }, [dsSearchQuery, registry?.components, registry?.aliases]);
  const [draggedNodeId, setDraggedNodeId] = React.useState<string | null>(null);
  const [draggedNodeType, setDraggedNodeType] = React.useState<"component" | "folder" | null>(null);
  const [dragOverFolderId, setDragOverFolderId] = React.useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);
  const [dragOverNodeId, setDragOverNodeId] = React.useState<string | null>(null);
  const [dragOverPosition, setDragOverPosition] = React.useState<"before" | "after" | "inside" | null>(null);
  const [contextMenuNodeId, setContextMenuNodeId] = React.useState<string | null>(null);
  const [isLeftPaneHovered, setIsLeftPaneHovered] = React.useState<boolean>(false);
  return (
    <div 
      className="flex-shrink-0 w-full h-full"
      onMouseEnter={() => setIsLeftPaneHovered(true)}
      onMouseLeave={() => setIsLeftPaneHovered(false)}
      style={{ minWidth: 0, maxWidth: "100%", overflow: "hidden" }}
    >
      <div className="flex flex-col h-full overflow-hidden" style={{ minWidth: 0, maxWidth: "100%" }}>
        {/* Header with Components button */}
        <div 
          className="border-b px-2 flex-shrink-0 bg-[color:var(--color-surface-base)]" 
          style={{ 
            borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
            height: "40px",
          }}
        >
          <div className="flex items-center justify-between gap-2 h-full">
            <div className="flex items-center gap-1">
              <Tooltip content="Playground - View and manage your generated components">
                <button
                  onClick={() => onSectionChange?.("components")}
                  className={clsx(
                    "inline-flex items-center justify-center whitespace-nowrap text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                    activeSection === "components" 
                      ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)]" 
                      : "bg-transparent hover:bg-[color:var(--color-surface-2)] text-[color:var(--foreground-secondary)]"
                  )}
                  style={{ borderRadius: "4px", padding: "6px 8px" }}
                >
                  Playground
                </button>
              </Tooltip>
              <Tooltip content="Library - View all Design System components and blocks">
                <button
                  onClick={() => onSectionChange?.("ds-components")}
                  className={clsx(
                    "inline-flex items-center justify-center whitespace-nowrap text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                    activeSection === "ds-components" 
                      ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-base)]" 
                      : "bg-transparent hover:bg-[color:var(--color-surface-2)] text-[color:var(--foreground-secondary)]"
                  )}
                  style={{ borderRadius: "4px", padding: "6px 8px" }}
                >
                  Library
                </button>
              </Tooltip>
            </div>
            {onNewFolder && onNewComponent && (
              <div className="flex items-center gap-1">
                <Tooltip content="New Folder">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNewFolder();
                    }}
                    className="flex items-center justify-center w-6 h-6 rounded hover:bg-[color:var(--color-surface-2)] transition-colors"
                    style={{ color: "var(--foreground-secondary)" }}
                    title="New Folder"
                  >
                    <FolderPlus className="w-4 h-4" />
                  </button>
                </Tooltip>
                <Tooltip content="New Component">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNewComponent();
                    }}
                    className="flex items-center justify-center w-6 h-6 rounded hover:bg-[color:var(--color-surface-2)] transition-colors"
                    style={{ color: "var(--foreground-secondary)" }}
                    title="New Component"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </Tooltip>
              </div>
            )}
          </div>
        </div>

        {/* Components Section (Projects) */}
        {activeSection === "components" && (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Projects Tree View */}
            <div className="flex-1 overflow-y-auto pr-1 pt-2 pb-2 component-tree-view" style={{ scrollbarWidth: "thin", minHeight: 0 }}>
              <style dangerouslySetInnerHTML={{__html: `
                .component-tree-view .tree-node > div {
                  padding-top: 3px !important;
                  padding-bottom: 3px !important;
                  margin-bottom: 1px !important;
                  min-width: 0;
                  overflow: hidden;
                }
                .component-tree-view .tree-node {
                  margin-bottom: 1px !important;
                }
                .component-tree-view .tree-node-label {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  min-width: 0;
                  flex: 1;
                }
                .component-tree-view .tree-node > div > span {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  min-width: 0;
                  flex: 1;
                }
                .component-tree-view .tree-node[draggable="true"] {
                  cursor: move;
                }
                .component-tree-view .tree-node[draggable="true"]:hover {
                  opacity: 0.8;
                }
                .component-tree-view .tree-node.drag-over {
                  background-color: color-mix(in srgb, var(--foreground-primary) 10%, transparent) !important;
                  border-radius: 4px;
                }
                .component-tree-view .tree-node.dragging {
                  opacity: 0.5;
                  transform: scale(0.95);
                  transition: opacity 0.2s, transform 0.2s;
                }
                .component-tree-view .tree-node.drag-over-folder {
                  background-color: color-mix(in srgb, var(--color-brand-primary) 15%, transparent) !important;
                  border: 1px dashed color-mix(in srgb, var(--color-brand-primary) 50%, transparent) !important;
                  border-radius: 4px;
                  box-shadow: 0 0 8px color-mix(in srgb, var(--color-brand-primary) 20%, transparent);
                }
                .component-tree-view .tree-node.drag-over-folder .tree-node-label {
                  font-weight: 500;
                }
                .component-tree-view .tree-node[data-node-id="projects-root"] > div {
                  padding-left: 0px !important;
                  padding-right: 12px !important;
                }
                /* Hover: only the hovered node's text becomes foreground-primary */
                .component-tree-view .tree-node:hover > div > span {
                  color: var(--foreground-primary) !important;
                }
                .component-tree-view .tree-node.drag-drop-before > div::before {
                  content: "";
                  position: absolute;
                  left: 0;
                  right: 0;
                  top: -1px;
                  height: 2px;
                  background-color: var(--color-brand-primary);
                  pointer-events: none;
                  z-index: 10;
                  box-shadow: 0 0 4px var(--color-brand-primary);
                }
                .component-tree-view .tree-node.drag-drop-after > div::after {
                  content: "";
                  position: absolute;
                  left: 0;
                  right: 0;
                  bottom: -1px;
                  height: 2px;
                  background-color: var(--color-brand-primary);
                  pointer-events: none;
                  z-index: 10;
                  box-shadow: 0 0 4px var(--color-brand-primary);
                }
                .component-tree-view .tree-node > div {
                  position: relative;
                }
              `}} />
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedNodeId && onMoveComponent) {
                    // Drop outside any folder - remove from folder
                    onMoveComponent(draggedNodeId, null);
                    setDraggedNodeId(null);
                    setDragOverFolderId(null);
                  }
                }}
              >
                {componentTreeNodes.length > 0 ? (
                  <ContextMenu>
                    <ContextMenuTrigger asChild>
                      <div
                        onContextMenu={(e) => {
                          // Always try to find and set the node ID from the clicked element
                          // This ensures contextMenuNodeId is set even if node.data.onContextMenu doesn't fire
                          const target = e.target as HTMLElement;
                          // Try to find .tree-node starting from the target and going up the DOM tree
                          let current: HTMLElement | null = target;
                          let nodeId: string | null = null;
                          
                          while (current && !nodeId) {
                            // Check if current element is a tree-node
                            if (current.classList.contains('tree-node')) {
                              nodeId = current.getAttribute('data-node-id');
                              if (nodeId) {
                                break;
                              }
                            }
                            // Check if current element has data-node-id attribute
                            const foundId = current.getAttribute('data-node-id');
                            if (foundId) {
                              nodeId = foundId;
                              break;
                            }
                            // Move to parent
                            current = current.parentElement;
                            // Stop if we've gone too far up (beyond the tree view container)
                            if (current && !current.closest('.component-tree-view')) {
                              break;
                            }
                          }
                          
                          if (nodeId) {
                            setContextMenuNodeId(nodeId);
                            if (process.env.NODE_ENV === 'development') {
                              console.log('[ContextMenu] Node ID set from div onContextMenu:', nodeId);
                            }
                          } else {
                            if (process.env.NODE_ENV === 'development') {
                              console.warn('[ContextMenu] Could not find node ID for target:', {
                                target: target.tagName,
                                classList: Array.from(target.classList || []),
                                hasDataNodeId: target.hasAttribute('data-node-id'),
                                parentHasDataNodeId: target.parentElement?.hasAttribute('data-node-id')
                              });
                            }
                          }
                          // Don't prevent default - let the node's onContextMenu handle it if it exists
                        }}
                      >
                        <TreeView
                          nodes={componentTreeNodes.map(node => {
                      // Handle inline editing - replace label with input if editing
                      const isEditing = editingItemId === node.id && editingItemType;
                      if (isEditing) {
                        return {
                          ...node,
                          label: (
                            <Input
                              value={editingItemName || ""}
                              onChange={(e) => onEditingItemNameChange?.(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.stopPropagation();
                                  onSaveEdit?.();
                                } else if (e.key === "Escape") {
                                  e.stopPropagation();
                                  onCancelEdit?.();
                                }
                              }}
                              onBlur={() => {
                                onSaveEdit?.();
                              }}
                              onClick={(e) => e.stopPropagation()}
                              autoFocus
                              className="h-6 text-sm"
                              style={{ minWidth: "100px", maxWidth: "200px" }}
                            />
                          ),
                        };
                      }
                      
                      // Add drag handlers and context menu for all nodes
                      if (node.data?.folder || node.data?.project || node.data?.isProjectsRoot) {
                        const existingData = node.data || {};
                        const isComponent = !!node.data?.project;
                        const isFolder = !!node.data?.folder;
                        
                        return {
                          ...node,
                          data: {
                            ...existingData,
                            // Add drag start/end for component nodes
                            ...(isComponent ? {
                              onDragStart: (e: React.DragEvent) => {
                                console.log('[Drag] Component node drag start:', node.id);
                                setDraggedNodeId(node.id);
                                setDraggedNodeType("component");
                                e.dataTransfer.effectAllowed = "move";
                                e.dataTransfer.setData("text/plain", node.id);
                                e.stopPropagation();
                              },
                              onDragEnd: (e: React.DragEvent) => {
                                console.log('[Drag] Component node drag end:', node.id);
                                setDraggedNodeId(null);
                                setDraggedNodeType(null);
                                setDragOverFolderId(null);
                                setDragOverNodeId(null);
                                setDragOverPosition(null);
                              },
                            } : {}),
                            onContextMenu: (e: React.MouseEvent) => {
                              // Set the node ID immediately so we know which node was clicked
                              setContextMenuNodeId(node.id);
                              if (process.env.NODE_ENV === 'development') {
                                console.log('Folder onContextMenu called for:', node.id);
                              }
                              // Don't prevent default - let ContextMenuTrigger handle it
                            },
                            onDragOver: (e: React.DragEvent) => {
                              if (draggedNodeId && draggedNodeId !== node.id) {
                                e.preventDefault();
                                e.stopPropagation();
                                
                                // Calculate position (before, after, or inside)
                                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                const y = e.clientY - rect.top;
                                const height = rect.height;
                                const midpoint = height / 2;
                                
                                // For folders and Projects root, allow dropping inside
                                if (node.data?.folder || node.data?.isProjectsRoot) {
                                  // If dragging over a folder, check if we're in the upper or lower half
                                  if (y < midpoint * 0.3) {
                                    setDragOverNodeId(node.id);
                                    setDragOverPosition("before");
                                  } else if (y > midpoint * 1.7) {
                                    setDragOverNodeId(node.id);
                                    setDragOverPosition("after");
                                  } else {
                                    setDragOverNodeId(node.id);
                                    setDragOverPosition("inside");
                                  }
                                } else {
                                  // For components, only before/after
                                  if (y < midpoint) {
                                    setDragOverNodeId(node.id);
                                    setDragOverPosition("before");
                                  } else {
                                    setDragOverNodeId(node.id);
                                    setDragOverPosition("after");
                                  }
                                }
                              }
                            },
                            onDragLeave: (e: React.DragEvent) => {
                              // Only clear if we're actually leaving the node
                              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                              const x = e.clientX;
                              const y = e.clientY;
                              if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
                                if (dragOverNodeId === node.id) {
                                  setDragOverNodeId(null);
                                  setDragOverPosition(null);
                                }
                              }
                            },
                          },
                        };
                      }
                      
                      // Add drag & drop handlers to folder nodes and projects root
                      if (node.data?.folder || node.data?.isProjectsRoot) {
                        const isFolder = !!node.data?.folder;
                        return {
                          ...node,
                          data: {
                            ...node.data,
                            className: dragOverFolderId === node.id ? "drag-over-folder" : "",
                            onContextMenu: (e: React.MouseEvent) => {
                              // Set the node ID immediately so we know which node was clicked
                              setContextMenuNodeId(node.id);
                              if (process.env.NODE_ENV === 'development') {
                                console.log('Folder onContextMenu called for:', node.id);
                              }
                              // Don't prevent default - let ContextMenuTrigger handle it
                            },
                            onDragOver: (e: React.DragEvent) => {
                              if (draggedNodeId && draggedNodeId !== node.id) {
                                // Prevent dropping folder into itself or its children
                                if (draggedNodeType === "folder" && isFolder) {
                                  // Check if target folder is a child of dragged folder (prevent circular reference)
                                  const draggedNode = findNodeById(draggedNodeId, componentTreeNodes);
                                  if (draggedNode && checkIfChild(draggedNode, node.id, componentTreeNodes)) {
                                    e.dataTransfer.dropEffect = "none";
                                    setDragOverFolderId(null);
                                    setDragOverNodeId(null);
                                    setDragOverPosition(null);
                                    return;
                                  }
                                }
                                e.preventDefault();
                                e.stopPropagation();
                                e.dataTransfer.dropEffect = "move";
                                setDragOverFolderId(node.id);
                                
                                // Calculate position for drop indicator
                                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                const y = e.clientY - rect.top;
                                const height = rect.height;
                                const midpoint = height / 2;
                                
                                // For folders and Projects root, allow dropping inside
                                if (y < midpoint * 0.3) {
                                  setDragOverNodeId(node.id);
                                  setDragOverPosition("before");
                                } else if (y > midpoint * 1.7) {
                                  setDragOverNodeId(node.id);
                                  setDragOverPosition("after");
                                } else {
                                  setDragOverNodeId(node.id);
                                  setDragOverPosition("inside");
                                }
                              }
                            },
                            onDragLeave: (e: React.DragEvent) => {
                              // Only clear if we're actually leaving the node (not entering a child)
                              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                              const x = e.clientX;
                              const y = e.clientY;
                              if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
                                setDragOverFolderId(null);
                                if (dragOverNodeId === node.id) {
                                  setDragOverNodeId(null);
                                  setDragOverPosition(null);
                                }
                              }
                            },
                            onDrop: (e: React.DragEvent) => {
                              console.log('[Drop] onDrop called:', {
                                draggedNodeId,
                                draggedNodeType,
                                targetNodeId: node.id,
                                isProjectsRoot: node.data?.isProjectsRoot,
                                isFolder,
                                hasOnMoveComponent: !!onMoveComponent,
                                hasOnMoveFolder: !!onMoveFolder
                              });
                              
                              if (draggedNodeId && draggedNodeId !== node.id) {
                                e.preventDefault();
                                e.stopPropagation();
                                
                                if (draggedNodeType === "component" && onMoveComponent) {
                                  const targetFolderId = node.data?.isProjectsRoot ? null : node.id;
                                  console.log('[Drop] Moving component:', draggedNodeId, 'to folder:', targetFolderId);
                                  onMoveComponent(draggedNodeId, targetFolderId);
                                  
                                  // Auto-expand folder if it's a folder (not Projects root)
                                  if (targetFolderId && onComponentExpansionChange && expandedComponentIds) {
                                    if (!expandedComponentIds.includes(targetFolderId)) {
                                      onComponentExpansionChange([...expandedComponentIds, targetFolderId]);
                                    }
                                  }
                                } else if (draggedNodeType === "folder" && onMoveFolder && isFolder) {
                                  // Prevent dropping folder into itself or its children
                                  const draggedNode = findNodeById(draggedNodeId, componentTreeNodes);
                                  if (draggedNode && !checkIfChild(draggedNode, node.id, componentTreeNodes)) {
                                    onMoveFolder(draggedNodeId, node.id);
                                    
                                    // Auto-expand target folder
                                    if (onComponentExpansionChange && expandedComponentIds) {
                                      if (!expandedComponentIds.includes(node.id)) {
                                        onComponentExpansionChange([...expandedComponentIds, node.id]);
                                      }
                                    }
                                  }
                                }
                                
                                setDraggedNodeId(null);
                                setDraggedNodeType(null);
                                setDragOverFolderId(null);
                                setDragOverNodeId(null);
                                setDragOverPosition(null);
                              }
                            },
                          },
                        };
                      }
                      // Add dragging class to dragged nodes
                      if (draggedNodeId === node.id) {
                        return {
                          ...node,
                          className: clsx((node as any).className, "dragging"),
                        };
                      }
                      // Add drag-over class to folders being hovered
                      if ((node.data?.folder || node.data?.isProjectsRoot) && dragOverFolderId === node.id) {
                        return {
                          ...node,
                          className: clsx((node as any).className, "drag-over-folder"),
                        };
                      }
                      // Add drag drop indicator class
                      if (dragOverNodeId === node.id && dragOverPosition && dragOverPosition !== "inside") {
                        return {
                          ...node,
                          className: clsx((node as any).className, `drag-drop-${dragOverPosition}`),
                        };
                      }
                      return node;
                    }) as TreeNode[]}
                    selectedIds={selectedComponentIds}
                    expandedIds={expandedComponentIds}
                    onExpansionChange={onComponentExpansionChange || (() => {})}
                    onNodeClick={onComponentClick || (() => {})}
                    onNodeDoubleClick={onComponentDoubleClick || (() => {})}
                    showCheckboxes={false}
                    showIcons={true}
                    className="border-0 bg-transparent p-0"
                    indentSize={16}
                    renderNodeActions={(node) => {
                      // Show drag handle for component nodes
                      if (node.data?.project) {
                        return (
                          <div
                            draggable
                            onDragStart={(e) => {
                              console.log('[Drag] Component drag start:', node.id);
                              setDraggedNodeId(node.id);
                              setDraggedNodeType("component");
                              e.dataTransfer.effectAllowed = "move";
                              e.dataTransfer.setData("text/plain", node.id);
                              // Stop propagation to prevent node click
                              e.stopPropagation();
                              // Create a custom drag image
                              const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
                              dragImage.style.opacity = "0.8";
                              dragImage.style.transform = "rotate(5deg)";
                              document.body.appendChild(dragImage);
                              dragImage.style.position = "absolute";
                              dragImage.style.top = "-1000px";
                              e.dataTransfer.setDragImage(dragImage, 0, 0);
                              setTimeout(() => document.body.removeChild(dragImage), 0);
                              // Add visual feedback
                              e.currentTarget.style.opacity = "0.5";
                              e.currentTarget.style.transform = "scale(0.95)";
                            }}
                            onDragEnd={(e) => {
                              console.log('[Drag] Component drag end:', node.id);
                              setDraggedNodeId(null);
                              setDraggedNodeType(null);
                              setDragOverFolderId(null);
                              setDragOverNodeId(null);
                              setDragOverPosition(null);
                              e.currentTarget.style.opacity = "1";
                              e.currentTarget.style.transform = "scale(1)";
                            }}
                            className="flex-shrink-0 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
                            style={{ 
                              backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23737373%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cline x1=%223%22 y1=%2212%22 x2=%2221%22 y2=%2212%22%3E%3C/line%3E%3Cline x1=%223%22 y1=%226%22 x2=%2221%22 y2=%226%22%3E%3C/line%3E%3Cline x1=%223%22 y1=%2218%22 x2=%2221%22 y2=%2218%22%3E%3C/line%3E%3C/svg%3E')",
                              backgroundSize: "contain",
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "center",
                              color: "var(--foreground-secondary)",
                              filter: "opacity(0.6)"
                            }}
                            title="Drag to move"
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                          />
                        );
                      }
                      // Show drag handle for folder nodes (but not for Projects root)
                      if (node.data?.folder && !node.data?.isProjectsRoot) {
                        return (
                          <div
                            draggable
                            onDragStart={(e) => {
                              setDraggedNodeId(node.id);
                              setDraggedNodeType("folder");
                              e.dataTransfer.effectAllowed = "move";
                              e.dataTransfer.setData("text/plain", node.id);
                              // Create a custom drag image
                              const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
                              dragImage.style.opacity = "0.8";
                              dragImage.style.transform = "rotate(5deg)";
                              document.body.appendChild(dragImage);
                              dragImage.style.position = "absolute";
                              dragImage.style.top = "-1000px";
                              e.dataTransfer.setDragImage(dragImage, 0, 0);
                              setTimeout(() => document.body.removeChild(dragImage), 0);
                              // Add visual feedback
                              e.currentTarget.style.opacity = "0.5";
                              e.currentTarget.style.transform = "scale(0.95)";
                            }}
                            onDragEnd={(e) => {
                              setDraggedNodeId(null);
                              setDraggedNodeType(null);
                              setDragOverFolderId(null);
                              setDragOverNodeId(null);
                              setDragOverPosition(null);
                              e.currentTarget.style.opacity = "1";
                              e.currentTarget.style.transform = "scale(1)";
                            }}
                            className="flex-shrink-0 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
                            style={{ 
                              backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23737373%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cline x1=%223%22 y1=%2212%22 x2=%2221%22 y2=%2212%22%3E%3C/line%3E%3Cline x1=%223%22 y1=%226%22 x2=%2221%22 y2=%226%22%3E%3C/line%3E%3Cline x1=%223%22 y1=%2218%22 x2=%2221%22 y2=%2218%22%3E%3C/line%3E%3C/svg%3E')",
                              backgroundSize: "contain",
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "center",
                              color: "var(--foreground-secondary)",
                              filter: "opacity(0.6)"
                            }}
                            title="Drag to move folder"
                            onClick={(e) => e.stopPropagation()}
                          />
                        );
                      }
                      // Show drop zone indicator for folders and Projects root
                      if ((node.data?.folder || node.data?.isProjectsRoot) && dragOverFolderId === node.id) {
                        return (
                          <div
                            className="flex-shrink-0 w-2 h-2 rounded-full bg-brand"
                            style={{ marginRight: "4px" }}
                          />
                        );
                      }
                      return null;
                    }}
                  />
                  </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent
                    style={{
                      borderColor: "var(--foreground-tertiary)",
                      backgroundColor: "var(--color-surface-1)",
                      color: "var(--color-fg-base)",
                    }}
                  >
                    {(() => {
                      // Helper function to find node recursively in tree
                      const findNodeRecursively = (nodes: TreeNode[], targetId: string): TreeNode | null => {
                        for (const node of nodes) {
                          if (node.id === targetId) {
                            return node;
                          }
                          if (node.children) {
                            const found = findNodeRecursively(node.children, targetId);
                            if (found) return found;
                          }
                        }
                        return null;
                      };
                      
                      // Find the node that was right-clicked
                      let selectedNode = null;
                      
                      // First try to find by contextMenuNodeId (recursively)
                      if (contextMenuNodeId) {
                        selectedNode = findNodeRecursively(componentTreeNodes, contextMenuNodeId);
                        if (process.env.NODE_ENV === 'development') {
                          console.log('[ContextMenu] Looking for node by contextMenuNodeId:', contextMenuNodeId, 'Found:', selectedNode ? 'yes' : 'no');
                          if (!selectedNode) {
                            console.log('[ContextMenu] Available node IDs (first 10):', 
                              componentTreeNodes.map(n => n.id).slice(0, 10)
                            );
                          }
                        }
                      }
                      
                      // If not found, try to find by selectedComponentIds (recursively)
                      if (!selectedNode && selectedComponentIds && selectedComponentIds.length > 0) {
                        for (const selectedId of selectedComponentIds) {
                          selectedNode = findNodeRecursively(componentTreeNodes, selectedId);
                          if (selectedNode) {
                            if (process.env.NODE_ENV === 'development') {
                              console.log('[ContextMenu] Found node by selectedComponentIds:', selectedId);
                            }
                            break;
                          }
                        }
                        if (process.env.NODE_ENV === 'development' && !selectedNode) {
                          console.log('[ContextMenu] Tried selectedComponentIds:', selectedComponentIds, 'Found: no');
                        }
                      }
                      
                      // If still not found, try to use selectedComponentIds as fallback
                      // This handles cases where contextMenuNodeId wasn't set but we have a selection
                      if (!selectedNode && selectedComponentIds && selectedComponentIds.length > 0) {
                        // Try to find by first selected ID
                        selectedNode = findNodeRecursively(componentTreeNodes, selectedComponentIds[0]);
                        if (process.env.NODE_ENV === 'development' && selectedNode) {
                          console.log('[ContextMenu] Found node via selectedComponentIds fallback:', selectedComponentIds[0]);
                        }
                      }
                      
                      // If still not found, return null (no menu items)
                      if (!selectedNode) {
                        // Only log in development if there's actually a contextMenuNodeId but no node found
                        if (process.env.NODE_ENV === 'development' && contextMenuNodeId) {
                          console.warn('[ContextMenu] Node not found for contextMenuNodeId:', {
                            contextMenuNodeId,
                            componentTreeNodesLength: componentTreeNodes.length,
                            selectedComponentIds,
                            availableIds: componentTreeNodes.map(n => n.id).slice(0, 5)
                          });
                        }
                        return null;
                      }
                      
                      // Determine node type - check multiple possible properties
                      // Check various possible data structures
                      const isComponent = !!(
                        selectedNode.data?.project || 
                        selectedNode.data?.component ||
                        selectedNode.data?.type === 'component' ||
                        (selectedNode.data && !selectedNode.data.folder && !selectedNode.data.isFolder && !selectedNode.data.isProjectsRoot)
                      );
                      const isFolder = !!(
                        selectedNode.data?.folder || 
                        selectedNode.data?.isFolder ||
                        selectedNode.data?.type === 'folder'
                      );
                      
                      // Don't show menu for Projects root
                      const isProjectsRoot = !!(
                        selectedNode.data?.isProjectsRoot ||
                        selectedNode.id === 'projects-root' ||
                        selectedNode.id === 'root'
                      );
                      
                      if (process.env.NODE_ENV === 'development') {
                        console.log('[ContextMenu] Node found:', {
                          id: selectedNode.id,
                          label: selectedNode.label,
                          isComponent,
                          isFolder,
                          isProjectsRoot,
                          data: selectedNode.data,
                          contextMenuNodeId,
                          hasSelectedComponentIds: !!selectedComponentIds?.length
                        });
                      }
                      
                      // Don't show menu for Projects root
                      if (isProjectsRoot) {
                        if (process.env.NODE_ENV === 'development') {
                          console.log('[ContextMenu] Node is Projects root, skipping menu');
                        }
                        return null;
                      }
                      
                      // Always show menu if we have a valid node (not root)
                      // This ensures menu shows even if type detection fails
                      // We'll show appropriate options based on detected type, or fallback to generic options
                      
                      // Build menu items based on node type
                      const menuItems: React.ReactNode[] = [];
                      
                      // Edit option - show for components and folders
                      if (isComponent || isFolder || !isProjectsRoot) {
                        menuItems.push(
                          <ContextMenuItem
                            key="edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              setContextMenuNodeId(null); // Clear after action
                              // Start editing
                              if (isComponent && onComponentDoubleClick) {
                                onComponentDoubleClick(selectedNode);
                              } else if (isFolder && onComponentDoubleClick) {
                                // For folders, we might want different behavior
                                onComponentDoubleClick(selectedNode);
                              } else if (onComponentDoubleClick) {
                                // Fallback: try to edit anyway
                                onComponentDoubleClick(selectedNode);
                              }
                            }}
                            style={{
                              color: "var(--color-fg-base)",
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" style={{ color: "var(--foreground-secondary)" }} />
                            <span>Edit</span>
                          </ContextMenuItem>
                        );
                      }
                      
                      // Add to Favourites option - show only for components
                      if (isComponent && onToggleComponentFavorite) {
                        // Find component to check if it's already favorite
                        const component = components.find(c => c.id === selectedNode.id);
                        const isFavorite = component?.isFavorite || false;
                        
                        menuItems.push(
                          <ContextMenuItem
                            key="favorite"
                            onClick={(e) => {
                              e.stopPropagation();
                              setContextMenuNodeId(null); // Clear after action
                              onToggleComponentFavorite(selectedNode.id);
                            }}
                            style={{
                              color: "var(--color-fg-base)",
                            }}
                          >
                            <Star className={`w-4 h-4 mr-2 ${isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} style={{ color: isFavorite ? "var(--color-status-warning-base)" : "var(--foreground-secondary)" }} />
                            <span>{isFavorite ? "Remove from Favourites" : "Add to Favourites"}</span>
                          </ContextMenuItem>
                        );
                      }
                      
                      // Delete option - show for components and folders
                      if ((isComponent && onDeleteComponent) || (isFolder && onDeleteFolder) || (!isProjectsRoot && (onDeleteComponent || onDeleteFolder))) {
                        menuItems.push(
                          <ContextMenuItem
                            key="delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              setContextMenuNodeId(null); // Clear after action
                              if (isComponent && onDeleteComponent) {
                                onDeleteComponent(selectedNode.id);
                              } else if (isFolder && onDeleteFolder) {
                                onDeleteFolder(selectedNode.id);
                              } else if (onDeleteComponent) {
                                // Fallback: try to delete as component if type is unclear
                                onDeleteComponent(selectedNode.id);
                              } else if (onDeleteFolder) {
                                // Fallback: try to delete as folder
                                onDeleteFolder(selectedNode.id);
                              }
                            }}
                            style={{
                              color: "var(--color-fg-base)",
                            }}
                          >
                            <Trash className="w-4 h-4 mr-2" style={{ color: "var(--foreground-secondary)" }} />
                            <span>Delete</span>
                          </ContextMenuItem>
                        );
                      }
                      
                      // If no menu items, show a placeholder (shouldn't happen, but just in case)
                      if (menuItems.length === 0) {
                        if (process.env.NODE_ENV === 'development') {
                          console.warn('[ContextMenu] No menu items generated for node:', {
                            id: selectedNode.id,
                            isComponent,
                            isFolder,
                            hasDeleteComponent: !!onDeleteComponent,
                            hasDeleteFolder: !!onDeleteFolder,
                            hasDoubleClick: !!onComponentDoubleClick
                          });
                        }
                        // Show at least a placeholder item
                        menuItems.push(
                          <ContextMenuItem
                            key="no-actions"
                            disabled
                            style={{
                              color: "var(--color-fg-muted)",
                            }}
                          >
                            <span>No actions available</span>
                          </ContextMenuItem>
                        );
                      }
                      
                      return <>{menuItems}</>;
                    })()}
                  </ContextMenuContent>
                </ContextMenu>
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[200px] px-3 text-center text-xs" style={{ color: "var(--foreground-secondary)" }}>
                    No components yet
                  </div>
                )}
              </div>
            </div>
            
            {/* Favourites Tree View - separate section with spacing */}
            <div className="border-t flex-shrink-0 mt-4" style={{ borderTopColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)", borderTopWidth: "1px" }}>
              {favouritesTreeNodes && favouritesTreeNodes.length > 0 ? (
                <div className="overflow-y-auto pr-1 pt-2 pb-2 component-tree-view" style={{ scrollbarWidth: "thin", maxHeight: "300px" }}>
                  <TreeView
                    nodes={favouritesTreeNodes.map(node => {
                      // Handle inline editing - replace label with input if editing
                      const isEditing = editingItemId === node.id && editingItemType;
                      if (isEditing && editingItemName !== undefined) {
                        return {
                          ...node,
                          label: (
                            <input
                              type="text"
                              value={editingItemName}
                              onChange={(e) => onEditingItemNameChange?.(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  onSaveEdit?.();
                                } else if (e.key === "Escape") {
                                  onCancelEdit?.();
                                }
                              }}
                              onBlur={() => onSaveEdit?.()}
                              autoFocus
                              className="px-1 py-0.5 text-sm rounded border"
                              style={{
                                backgroundColor: "var(--background-primary)",
                                color: "var(--foreground-primary)",
                                borderColor: "var(--color-brand-primary)",
                                width: "100%",
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          ),
                        };
                      }
                      return node;
                    }) as TreeNode[]}
                    selectedIds={selectedComponentIds}
                    expandedIds={expandedFavouritesIds}
                    onExpansionChange={onFavouritesExpansionChange || (() => {})}
                    onNodeClick={onComponentClick || (() => {})}
                    onNodeDoubleClick={onComponentDoubleClick || (() => {})}
                    showCheckboxes={false}
                    showIcons={true}
                    className="border-0 bg-transparent p-0"
                    indentSize={16}
                  />
                </div>
              ) : (
                <div 
                  className="px-4 py-3 text-xs text-center" 
                  style={{ 
                    color: "var(--foreground-tertiary)",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    minWidth: 0,
                    maxWidth: "100%",
                  }}
                >
                  No favorites yet. Right-click a component and select "Add to Favourites".
                </div>
              )}
            </div>
          </div>
        )}

        {/* DS Components Section */}
        {activeSection === "ds-components" && (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Search Bar */}
            <div className="px-4 py-2 border-b flex-shrink-0" style={{ borderColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)" }}>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 z-10" style={{ color: "var(--foreground-tertiary)" }} />
                <Input
                  type="text"
                  placeholder="Search components..."
                  value={dsSearchQuery}
                  onChange={(e) => setDsSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)",
                    color: dsSearchQuery ? "var(--foreground-primary)" : "var(--foreground-tertiary)",
                    borderColor: "var(--foreground-tertiary)",
                    paddingRight: dsSearchQuery ? "2rem" : undefined,
                  }}
                />
                {dsSearchQuery && (
                  <button
                    onClick={() => setDsSearchQuery("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded transition-colors z-10"
                    style={{
                      color: "var(--foreground-tertiary)",
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--foreground-primary)";
                      e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--foreground-primary) 5%, transparent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--foreground-tertiary)";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <style dangerouslySetInnerHTML={{__html: `
                  input[placeholder="Search components..."]::placeholder {
                    color: var(--foreground-tertiary) !important;
                  }
                `}} />
              </div>
            </div>


            {/* Components List */}
            <div 
              className="flex-1 overflow-y-auto pr-1 pt-3 pb-2 [&::-webkit-scrollbar]:hidden" 
              style={{ 
                scrollbarWidth: "none", 
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch"
              }}
            >
              {!registry?.components ? (
                <div className="flex items-center justify-center h-full min-h-[200px] px-3 text-center text-xs" style={{ color: "var(--foreground-secondary)" }}>
                  Loading components...
                </div>
              ) : filteredDsComponents.length === 0 ? (
                <div className="flex items-center justify-center h-full min-h-[200px] px-3 text-center text-xs" style={{ color: "var(--foreground-secondary)" }}>
                  No components found
                </div>
              ) : (
                <div className="space-y-0.5 px-2">
                  {filteredDsComponents.map((name) => {
                    const component = registry.components![name];
                    return (
                      <button
                        key={name}
                        onClick={() => onComponentSelect?.(name)}
                        className="w-full text-left px-2 py-1 rounded transition-colors"
                        style={{
                          backgroundColor: "transparent",
                          color: "var(--foreground-secondary)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--foreground-primary) 5%, transparent)";
                          e.currentTarget.style.color = "var(--foreground-primary)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "var(--foreground-secondary)";
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Component className="w-4 h-4 flex-shrink-0" style={{ color: "var(--foreground-tertiary)" }} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-normal truncate" title={name}>
                              {name}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// Helper function to find a node by ID in the tree
function findNodeById(id: string, nodes: TreeNode[]): TreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(id, node.children);
      if (found) return found;
    }
  }
  return null;
}

// Helper function to check if a node contains another node as a child (prevent circular references)
function checkIfChild(parentNode: TreeNode, childId: string, allNodes: TreeNode[]): boolean {
  if (parentNode.id === childId) return true;
  if (!parentNode.children) return false;
  
  for (const child of parentNode.children) {
    if (child.id === childId) return true;
    if (checkIfChild(child, childId, allNodes)) {
      return true;
    }
  }
  
  return false;
}

