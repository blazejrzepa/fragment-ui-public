"use client";

import * as React from "react";
import { Checkbox } from "./checkbox";
import clsx from "clsx";
import { ChevronRight, Folder, File, FolderOpen } from "lucide-react";

export interface TreeNode {
  id: string;
  label: string | React.ReactNode;
  children?: TreeNode[];
  icon?: React.ReactNode | ((isSelected: boolean) => React.ReactNode);
  disabled?: boolean;
  data?: Record<string, any>;
  className?: string;
  alwaysExpanded?: boolean;
  hideChevron?: boolean;
}

export interface TreeViewProps {
  nodes?: TreeNode[];
  selectedIds?: string[];
  renderNodeActions?: (node: TreeNode) => React.ReactNode;
  expandedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  onExpansionChange?: (expandedIds: string[]) => void;
  onNodeClick?: (node: TreeNode) => void;
  onNodeDoubleClick?: (node: TreeNode) => void;
  showCheckboxes?: boolean;
  showIcons?: boolean;
  defaultExpanded?: boolean;
  className?: string;
  indentSize?: number;
}

function TreeNodeComponent({
  node,
  level = 0,
  selectedIds = [],
  expandedIds = [],
  onSelectionChange,
  onExpansionChange,
  onNodeClick,
  onNodeDoubleClick,
  showCheckboxes = false,
  showIcons = true,
  defaultExpanded = false,
  indentSize = 20,
  renderNodeActions,
}: {
  node: TreeNode;
  level?: number;
  selectedIds: string[];
  expandedIds: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  onExpansionChange?: (expandedIds: string[]) => void;
  onNodeClick?: (node: TreeNode) => void;
  onNodeDoubleClick?: (node: TreeNode) => void;
  showCheckboxes?: boolean;
  showIcons?: boolean;
  defaultExpanded?: boolean;
  indentSize?: number;
  renderNodeActions?: (node: TreeNode) => React.ReactNode;
}) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = node.alwaysExpanded || expandedIds.includes(node.id);
  const isSelected = selectedIds.includes(node.id);
  const shouldShowChevron = hasChildren && !node.hideChevron;
  const isIndeterminate = React.useMemo(() => {
    if (!hasChildren || !showCheckboxes) return false;
    const childIds = getAllChildIds(node);
    const selectedChildren = childIds.filter((id) => selectedIds.includes(id));
    return selectedChildren.length > 0 && selectedChildren.length < childIds.length;
  }, [node, selectedIds, hasChildren, showCheckboxes]);

  const handleToggle = React.useCallback(() => {
    if (node.disabled) return;
    if (onExpansionChange) {
      if (isExpanded) {
        onExpansionChange(expandedIds.filter((id) => id !== node.id));
      } else {
        onExpansionChange([...expandedIds, node.id]);
      }
    } else {
      // Uncontrolled mode - use internal state
      // This is handled by the parent TreeView component
    }
  }, [node, isExpanded, expandedIds, onExpansionChange]);

  const handleCheckboxChange = React.useCallback((checked: boolean) => {
    if (node.disabled || !onSelectionChange) return;
    const childIds = getAllChildIds(node);
    if (checked) {
      // Select this node and all children
      const newSelected = [...new Set([...selectedIds, node.id, ...childIds])];
      onSelectionChange(newSelected);
    } else {
      // Deselect this node and all children
      const newSelected = selectedIds.filter((id) => id !== node.id && !childIds.includes(id));
      onSelectionChange(newSelected);
    }
  }, [node, selectedIds, onSelectionChange]);

  const handleNodeClick = React.useCallback(() => {
    if (node.disabled) return;
    onNodeClick?.(node);
    if (hasChildren) {
      handleToggle();
    }
  }, [node, hasChildren, handleToggle, onNodeClick]);

  const handleNodeDoubleClick = React.useCallback(() => {
    if (node.disabled) return;
    onNodeDoubleClick?.(node);
  }, [node, onNodeDoubleClick]);

  const defaultIcon = hasChildren ? (
    isExpanded ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />
  ) : (
    <File className="h-4 w-4" />
  );

  return (
    <div className={clsx("tree-node", node.className)} data-node-id={node.id} role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined} aria-selected={isSelected}>
      <div
        className={clsx(
          "group flex items-center gap-[var(--space-2)] py-[var(--space-1)] px-[var(--space-2)] rounded-[var(--radius-sm)]",
          "hover:bg-[color:var(--color-surface-2)]",
          "cursor-pointer select-none",
          "transition-colors duration-[var(--motion-duration-base)]",
          isSelected && "bg-[color:var(--color-surface-2)]",
          node.disabled && "opacity-50 cursor-not-allowed"
        )}
        style={{ 
          paddingLeft: level === 0 && node.hideChevron 
            ? `0px` // Projects root: no padding
            : level === 0 && node.data?.isProjectsRoot
            ? `0px` // Projects root without hideChevron - no padding
            : `${level * indentSize + 8}px` 
        }}
        draggable={!!node.data?.onDragStart}
        onClick={handleNodeClick}
        onDoubleClick={handleNodeDoubleClick}
        onContextMenu={node.data?.onContextMenu}
        onDragStart={node.data?.onDragStart}
        onDragEnd={node.data?.onDragEnd}
        onDragOver={node.data?.onDragOver}
        onDragLeave={node.data?.onDragLeave}
        onDrop={node.data?.onDrop}
      >
        {showCheckboxes && (
          <div className="relative">
            <Checkbox
              checked={isSelected || isIndeterminate}
              onCheckedChange={handleCheckboxChange}
              onClick={(e) => e.stopPropagation()}
              disabled={node.disabled}
              className={clsx(isIndeterminate && "data-[state=checked]:bg-brand/50")}
            />
            {isIndeterminate && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-2 h-0.5 bg-white" />
              </div>
            )}
          </div>
        )}
        {shouldShowChevron ? (
          <button
            type="button"
            className="flex items-center justify-center w-4 h-4 p-0 hover:bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              if (!node.alwaysExpanded) {
                handleToggle();
              }
            }}
            aria-label={isExpanded ? `Collapse ${node.label}` : `Expand ${node.label}`}
            aria-expanded={isExpanded}
            aria-controls={`tree-node-${node.id}`}
            disabled={node.alwaysExpanded}
            style={{ opacity: node.alwaysExpanded ? 0 : 1 }}
          >
            <ChevronRight
              className={clsx(
                "h-4 w-4 transition-transform duration-[var(--motion-duration-base)]",
                isExpanded && "rotate-90"
              )}
            />
          </button>
        ) : null}
        {showIcons && (
          <div className="flex-shrink-0" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: 'auto', height: 'auto' }}>
            {typeof node.icon === 'function' 
              ? node.icon(isSelected) 
              : (node.icon || defaultIcon)}
          </div>
        )}
        <span className={clsx(
          "flex-1 text-sm truncate whitespace-nowrap overflow-hidden",
          "text-[color:var(--color-fg-base)]"
        )}>{node.label}</span>
        {renderNodeActions && (() => {
          const actions = renderNodeActions(node);
          if (!actions) return null;
          return (
            <div className="tree-node-actions opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--motion-duration-base)] flex-shrink-0 ml-[var(--space-2)]" style={{ minWidth: '24px' }}>
              {actions}
            </div>
          );
        })()}
      </div>
      {hasChildren && isExpanded && (
        <div
          id={`tree-node-${node.id}`}
          role="group"
          className="tree-node-children"
        >
          {node.children!.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              selectedIds={selectedIds}
              expandedIds={expandedIds}
              onSelectionChange={onSelectionChange}
              onExpansionChange={onExpansionChange}
              onNodeClick={onNodeClick}
              onNodeDoubleClick={onNodeDoubleClick}
              showCheckboxes={showCheckboxes}
              showIcons={showIcons}
              defaultExpanded={defaultExpanded}
              indentSize={indentSize}
              renderNodeActions={renderNodeActions}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function getAllChildIds(node: TreeNode): string[] {
  const ids: string[] = [];
  if (node.children) {
    node.children.forEach((child) => {
      ids.push(child.id);
      ids.push(...getAllChildIds(child));
    });
  }
  return ids;
}

export const TreeView = React.forwardRef<HTMLDivElement, TreeViewProps>(
  function TreeView(
    {
      nodes,
      selectedIds = [],
      expandedIds,
      onSelectionChange,
      onExpansionChange,
      onNodeClick,
      onNodeDoubleClick,
      showCheckboxes = false,
      showIcons = true,
      defaultExpanded = false,
      className,
      indentSize = 20,
      renderNodeActions,
    },
    ref
  ) {
    // Ensure nodes is always an array
    const safeNodes = React.useMemo(() => {
      if (!nodes || !Array.isArray(nodes)) {
        return [];
      }
      return nodes;
    }, [nodes]);

    // Track if expandedIds was explicitly passed as a prop
    const expandedIdsRef = React.useRef(expandedIds);
    React.useEffect(() => {
      expandedIdsRef.current = expandedIds;
    }, [expandedIds]);
    const wasExpandedIdsProvided = expandedIdsRef.current !== undefined;
    
    // Initialize with defaultExpanded if no expandedIds provided
    const initialExpandedIds = React.useMemo(() => {
      if (wasExpandedIdsProvided && expandedIds && expandedIds.length > 0) return expandedIds;
      if (defaultExpanded) {
        // Get all node IDs recursively
        const getAllNodeIds = (nodes: TreeNode[]): string[] => {
          const ids: string[] = [];
          nodes.forEach(node => {
            ids.push(node.id);
            if (node.children) {
              ids.push(...getAllNodeIds(node.children));
            }
          });
          return ids;
        };
        return getAllNodeIds(safeNodes);
      }
      return [];
    }, [safeNodes, defaultExpanded, wasExpandedIdsProvided, expandedIds]);

    // Use controlled or uncontrolled mode based on whether expandedIds or onExpansionChange is provided
    // If expandedIds prop was explicitly provided, it's controlled (even without onExpansionChange)
    // If onExpansionChange is provided, it's also controlled
    const isControlled = wasExpandedIdsProvided || onExpansionChange !== undefined;
    const [internalExpandedIds, setInternalExpandedIds] = React.useState<string[]>(initialExpandedIds);
    const [internalSelectedIds, setInternalSelectedIds] = React.useState<string[]>(selectedIds);

    // For controlled mode, use expandedIds directly; for uncontrolled, use internal state
    const effectiveExpandedIds = isControlled ? (expandedIds ?? []) : internalExpandedIds;
    const effectiveSelectedIds = selectedIds;
    
    // Sync expandedIds with internal state when controlled (for rerenders)
    const prevExpandedIdsRef = React.useRef<string>(JSON.stringify(expandedIds || []));
    
    React.useEffect(() => {
      if (isControlled && expandedIds !== undefined) {
        const prevIds = prevExpandedIdsRef.current;
        const newIds = JSON.stringify(expandedIds);
        
        // Only update if the arrays are actually different
        if (prevIds !== newIds) {
          setInternalExpandedIds(expandedIds);
          prevExpandedIdsRef.current = newIds;
        }
      }
    }, [expandedIds, isControlled]);

    // Sync selectedIds with internal state (always needed for rendering)
    const prevSelectedIdsRef = React.useRef<string>(JSON.stringify(selectedIds));
    
    React.useEffect(() => {
      const prevIds = prevSelectedIdsRef.current;
      const newIds = JSON.stringify(selectedIds);
      
      // Only update if the arrays are actually different
      if (prevIds !== newIds) {
        setInternalSelectedIds(selectedIds);
        prevSelectedIdsRef.current = newIds;
      }
    }, [selectedIds]);

    const handleExpansionChange = React.useCallback(
      (newExpandedIds: string[]) => {
        if (isControlled && onExpansionChange) {
          // In controlled mode with handler, just call the parent handler
          // Don't update internal state - let the parent control it
          onExpansionChange(newExpandedIds);
        } else if (!isControlled) {
          // In uncontrolled mode, update internal state
          setInternalExpandedIds(newExpandedIds);
        }
        // If controlled but no handler (expandedIds provided but no onExpansionChange),
        // do nothing - parent controls via expandedIds prop
      },
      [onExpansionChange, isControlled]
    );

    const handleSelectionChange = React.useCallback(
      (newSelectedIds: string[]) => {
        setInternalSelectedIds(newSelectedIds);
        onSelectionChange?.(newSelectedIds);
      },
      [onSelectionChange]
    );

    return (
      <div
        ref={ref}
        className={clsx(
          "tree-view w-full border border-[color:var(--color-border-base)] rounded-[var(--radius-md)] p-[var(--space-2)]",
          "bg-[color:var(--color-surface-1)]",
          className
        )}
        role="tree"
        aria-label="Tree view"
      >
        {safeNodes.map((node) => (
          <TreeNodeComponent
            key={node.id}
            node={node}
            level={0}
            selectedIds={effectiveSelectedIds}
            expandedIds={effectiveExpandedIds}
            onSelectionChange={handleSelectionChange}
            onExpansionChange={handleExpansionChange}
            onNodeClick={onNodeClick}
            onNodeDoubleClick={onNodeDoubleClick}
            showCheckboxes={showCheckboxes}
            showIcons={showIcons}
            defaultExpanded={defaultExpanded}
            indentSize={indentSize}
            renderNodeActions={renderNodeActions}
          />
        ))}
      </div>
    );
  }
);

TreeView.displayName = "TreeView";

