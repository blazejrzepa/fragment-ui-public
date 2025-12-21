/**
 * Custom hook for managing UI projects with localStorage persistence
 */

import { useState, useEffect, useCallback } from "react";
import { useDebouncedLocalStorage } from "./use-debounced-local-storage";

import type { GenerationMetadata } from "../types/generation";
import type { UiDsl } from "../../app/studio/dsl/types";
import type { Patch } from "../../app/studio/dsl/patch";

/**
 * Patch history entry with metadata
 */
export interface PatchHistoryEntry {
  dsl: UiDsl; // DSL state after patches were applied
  patches: Patch[]; // Patches that were applied
  timestamp: number; // Unix timestamp
  prompt?: string; // User prompt that generated these patches
  userId?: string; // Optional user ID (for multi-user scenarios)
}

export interface UIProject {
  id: string;
  title: string;
  code: string;
  generationMetadata: GenerationMetadata | null;
  chatSessionId: string; // Required - every project must belong to a session
  createdAt: Date;
  dsl?: UiDsl | null; // Optional DSL for conversational editing
  patchHistory?: PatchHistoryEntry[]; // History of patch operations with metadata
  isOpen?: boolean; // Whether the project tab is open (default: true)
  folderId?: string | null; // Optional folder ID for grouping components
  order?: number; // Order within parent (for drag & drop sorting)
  isFavorite?: boolean; // Whether the component is marked as favorite/selected
  shareableId?: string; // Unique ID for sharing (generated when first shared)
  // Removed: logs, a11yResults - these belong to ChatSession, not UIProject
}

export interface ComponentFolder {
  id: string;
  name: string;
  createdAt: Date;
  parentFolderId?: string | null; // For nested folders (null = in Projects root)
  order?: number; // Order within parent (for drag & drop sorting)
}

const PROJECTS_KEY = "fragment-ui-playground-projects";
const ACTIVE_PROJECT_KEY = "fragment-ui-playground-active-project-id";

export function useUIProjects() {
  const [uiProjects, setUiProjects] = useState<UIProject[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Mark as mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    try {
      const savedProjects = localStorage.getItem(PROJECTS_KEY);
      const savedActiveId = localStorage.getItem(ACTIVE_PROJECT_KEY);

      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        const projectsWithDates = parsed.map((project: any) => {
          // Parse DSL if it's a string (from localStorage serialization)
          let dsl = project.dsl;
          if (dsl && typeof dsl === 'string') {
            try {
              dsl = JSON.parse(dsl);
            } catch (e) {
              if (process.env.NODE_ENV === "development") {
              console.warn("Failed to parse DSL from localStorage:", e);
              }
              dsl = null;
            }
          }
          
          const finalProject = {
            ...project,
            createdAt: new Date(project.createdAt),
            // Ensure chatSessionId exists (migration for old projects)
            chatSessionId: project.chatSessionId || "standalone",
            dsl: dsl || null, // Ensure DSL is properly parsed
            // Ensure isOpen exists (default to true for backward compatibility)
            isOpen: project.isOpen !== undefined ? project.isOpen : true,
          };
          
          // Only log in development mode and only first few projects to avoid spam
          if (process.env.NODE_ENV === "development" && parsed.indexOf(project) < 3) {
          console.log("[useUIProjects] Loaded project:", {
            projectId: finalProject.id,
            hasDsl: !!finalProject.dsl,
            dslType: finalProject.dsl ? (finalProject.dsl as any).type : null,
          });
          }
          
          return finalProject;
        });
        setUiProjects(projectsWithDates);

        if (savedActiveId && projectsWithDates.find((p: UIProject) => p.id === savedActiveId)) {
          setActiveProjectId(savedActiveId);
        }
      }
    } catch (error) {
      // Error loading projects - handled silently
      if (process.env.NODE_ENV === "development") {
        console.error("Error loading projects from localStorage:", error);
      }
    }
  }, [mounted]);

  // Debounced save to localStorage whenever projects change
  useDebouncedLocalStorage(PROJECTS_KEY, uiProjects, 500);
  
  // Save active project ID immediately (no debounce needed, it's just a string)
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    try {
      if (activeProjectId) {
        localStorage.setItem(ACTIVE_PROJECT_KEY, activeProjectId);
      } else {
        localStorage.removeItem(ACTIVE_PROJECT_KEY);
      }
    } catch (error) {
      // Error saving active project ID - handled silently
      if (process.env.NODE_ENV === "development") {
        console.error("Error saving active project ID to localStorage:", error);
      }
    }
  }, [activeProjectId, mounted]);

  const updateProject = useCallback((projectId: string, updates: Partial<UIProject>) => {
    setUiProjects((prev) =>
      prev.map((project) => (project.id === projectId ? { ...project, ...updates } : project))
    );
  }, []);

  const addProject = useCallback((project: UIProject) => {
    setUiProjects((prev) => [...prev, project]);
  }, []);

  const removeProject = useCallback((projectId: string) => {
    setUiProjects((prev) => prev.filter((project) => project.id !== projectId));
    if (activeProjectId === projectId) {
      setActiveProjectId(null);
    }
  }, [activeProjectId]);

  return {
    uiProjects,
    activeProjectId,
    setUiProjects,
    setActiveProjectId,
    updateProject,
    addProject,
    removeProject,
    mounted,
  };
}

