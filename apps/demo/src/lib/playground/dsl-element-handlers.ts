/**
 * DSL Element Handlers
 * 
 * Factory functions for creating handler functions for DSL element operations.
 * These handlers are used by the Preview Area to update, delete, and duplicate elements.
 */

import * as React from "react";
import { applyPatches, type Patch } from "../../../app/studio/dsl/patch";
import type { UIProject } from "@/hooks/use-ui-projects";
import { toast } from "@fragment_ui/ui";

export interface DSLElementHandlerDependencies {
  getActiveProject: () => UIProject | null;
  updateActiveProject: (updates: Partial<UIProject>) => void;
  updateProject: (projectId: string, updates: Partial<UIProject>) => void;
  setCode: (code: string) => void;
  codeProjectIdRef: React.MutableRefObject<string | null>;
  loadedProjectDataRef: React.MutableRefObject<{ projectId: string | null; code: string; dsl: any } | null>;
  lastCodeRef: React.MutableRefObject<string>;
  addCommit: (code: string, metadata?: { message?: string; author?: "user" | "ai" | "system"; type?: "generation" | "edit" | "patch" | "manual"; }) => void;
  setSelectedElementId: (id: string | null) => void;
}

/**
 * Create handler for updating text in a DSL element
 */
export function createUpdateTextHandler(deps: DSLElementHandlerDependencies) {
  return async (elementId: string, newText: string, path: string): Promise<void> => {
    try {
      const currentProject = deps.getActiveProject();
      if (!currentProject) {
        toast.error("No active project to update");
        return;
      }

      // Get current DSL
      const currentDsl = currentProject.dsl;
      if (!currentDsl) {
        toast.error("DSL not available for this project");
        return;
      }

      // Parse DSL if it's a string
      const parsedDsl = typeof currentDsl === 'string' ? JSON.parse(currentDsl) : currentDsl;

      // Create setCopy patch
      const patch: Patch = {
        op: "setCopy",
        target: { type: "byId" as const, id: elementId },
        path: path,
        value: newText,
      };

      // Apply patch
      const updatedDsl = applyPatches(parsedDsl, [patch]);

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
      deps.updateActiveProject({
        dsl: updatedDsl,
        code: regeneratedCode,
      });

      // Update local state
      deps.setCode(regeneratedCode);
      deps.codeProjectIdRef.current = currentProject.id;
      deps.loadedProjectDataRef.current = { 
        projectId: currentProject.id, 
        code: regeneratedCode, 
        dsl: updatedDsl 
      };

      toast.success("Text updated successfully!");
    } catch (error) {
      console.error("Error updating text:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update text");
    }
  };
}

/**
 * Create handler for deleting a DSL element
 */
export function createDeleteElementHandler(deps: DSLElementHandlerDependencies) {
  return async (elementId: string): Promise<void> => {
    try {
      const currentProject = deps.getActiveProject();
      if (!currentProject || !currentProject.dsl) {
        toast.error("No active project or DSL not available");
        return;
      }

      // Parse DSL
      const dsl = typeof currentProject.dsl === 'string' 
        ? JSON.parse(currentProject.dsl) 
        : currentProject.dsl;

      // Create removeNode patch
      const patches: Patch[] = [{
        op: "removeNode",
        target: { type: "byId", id: elementId }
      }];

      // Apply patches
      const updatedDsl = applyPatches(dsl, patches);

      // Regenerate code
      const regenerateResponse = await fetch("/api/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dsl: updatedDsl }),
      });

      if (!regenerateResponse.ok) {
        throw new Error("Failed to regenerate code");
      }

      const regenerateData = await regenerateResponse.json();
      const regeneratedCode = regenerateData.code;

      // Update project
      deps.updateActiveProject({ dsl: updatedDsl, code: regeneratedCode });
      deps.setCode(regeneratedCode);
      deps.codeProjectIdRef.current = currentProject.id;
      deps.loadedProjectDataRef.current = { 
        projectId: currentProject.id, 
        code: regeneratedCode, 
        dsl: updatedDsl 
      };

      // Add commit for delete
      deps.lastCodeRef.current = regeneratedCode;
      deps.addCommit(regeneratedCode, {
        message: "Deleted element",
        author: "user",
        type: "edit",
      });

      // Clear selection
      deps.setSelectedElementId(null);
      toast.success("Element deleted successfully");
    } catch (error) {
      console.error("Error deleting element:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete element");
    }
  };
}

/**
 * Create handler for duplicating a DSL element
 */
export function createDuplicateElementHandler(deps: DSLElementHandlerDependencies) {
  return async (elementId: string): Promise<void> => {
    try {
      const currentProject = deps.getActiveProject();
      if (!currentProject || !currentProject.dsl) {
        toast.error("No active project or DSL not available");
        return;
      }

      // Parse DSL
      const dsl = typeof currentProject.dsl === 'string' 
        ? JSON.parse(currentProject.dsl) 
        : currentProject.dsl;

      // Import patch functions
      const { findNode, findParent, applyPatch } = await import("../../../app/studio/dsl/patch");
      const { generateId } = await import("../../../app/studio/dsl/types");
      
      // Find the node to duplicate
      const nodeToDuplicate = findNode(dsl, { type: "byId", id: elementId });
      
      if (!nodeToDuplicate) {
        toast.error("Element not found");
        return;
      }

      // Find parent node
      const parent = findParent(dsl, { type: "byId", id: elementId });
      
      if (!parent) {
        toast.error("Cannot duplicate root element");
        return;
      }

      // Determine which array contains the node and find its index
      let parentArray: any[] | null = null;
      let nodeIndex = -1;
      
      if (parent.fields) {
        nodeIndex = parent.fields.findIndex((f: any) => f.id === elementId);
        if (nodeIndex !== -1) parentArray = parent.fields;
      } else if (parent.actions) {
        nodeIndex = parent.actions.findIndex((a: any) => a.id === elementId);
        if (nodeIndex !== -1) parentArray = parent.actions;
      } else if (parent.sections) {
        nodeIndex = parent.sections.findIndex((s: any) => s.id === elementId);
        if (nodeIndex !== -1) parentArray = parent.sections;
      } else if (parent.columns) {
        nodeIndex = parent.columns.findIndex((c: any) => c.id === elementId);
        if (nodeIndex !== -1) parentArray = parent.columns;
      } else if (parent.widgets) {
        nodeIndex = parent.widgets.findIndex((w: any) => w.id === elementId);
        if (nodeIndex !== -1) parentArray = parent.widgets;
      }

      if (!parentArray || nodeIndex === -1) {
        toast.error("Cannot find element in parent structure");
        return;
      }

      // Deep clone the node and generate new ID
      const duplicatedNode = JSON.parse(JSON.stringify(nodeToDuplicate));
      duplicatedNode.id = generateId();
      
      // Recursively update IDs in nested structures
      function updateIds(node: any) {
        if (node.id) {
          node.id = generateId();
        }
        if (node.fields) {
          node.fields.forEach(updateIds);
        }
        if (node.actions) {
          node.actions.forEach(updateIds);
        }
        if (node.sections) {
          node.sections.forEach(updateIds);
        }
        if (node.columns) {
          node.columns.forEach(updateIds);
        }
        if (node.widgets) {
          node.widgets.forEach(updateIds);
        }
        if (node.content) {
          node.content.forEach(updateIds);
        }
      }
      updateIds(duplicatedNode);

      // Apply patch to add duplicated node right after the original
      const newDsl = applyPatch(dsl, {
        op: "addNode",
        parent: { type: "byId", id: parent.id },
        index: nodeIndex + 1, // Insert right after original
        node: duplicatedNode,
      });

      // Update project with new DSL
      deps.updateProject(currentProject.id, {
        dsl: newDsl,
      });

      // Regenerate code
      const { generateTSX } = await import("../../../app/studio/dsl/generator");
      const newCode = generateTSX(newDsl);
      deps.setCode(newCode);
      
      // Add to history
      deps.addCommit(newCode, {
        message: "Duplicated element",
        author: "user",
        type: "edit",
      });

      toast.success("Element duplicated successfully");
    } catch (error) {
      console.error("Error duplicating element:", error);
      toast.error(error instanceof Error ? error.message : "Failed to duplicate element");
    }
  };
}
