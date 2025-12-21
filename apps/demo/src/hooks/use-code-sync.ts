/**
 * Custom hook for synchronizing code between UIProject and local state
 * Consolidates multiple useEffect hooks into a single, optimized hook
 */

import { useEffect, useRef, useCallback } from "react";
import type { UIProject } from "./use-ui-projects";
import type { UiDsl } from "../../app/studio/dsl/types";
import { logger } from "@/lib/logger";

interface CodeSyncState {
  projectId: string | null;
  code: string;
  dsl: UiDsl | null;
}

interface UseCodeSyncOptions {
  activeProjectId: string | null;
  activeProject: UIProject | null;
  code: string;
  setCode: (code: string) => void;
  setGenerationMetadata: (metadata: any) => void;
  setActivePreviewTab: (tab: "new-component" | "preview" | "code") => void;
  mounted: boolean;
}

export function useCodeSync({
  activeProjectId,
  activeProject,
  code,
  setCode,
  setGenerationMetadata,
  setActivePreviewTab,
  mounted,
}: UseCodeSyncOptions) {
  // Track which project's data we've loaded to prevent infinite loops
  const loadedProjectDataRef = useRef<CodeSyncState>({
    projectId: null,
    code: "",
    dsl: null,
  });

  // Track which project the current code belongs to
  const codeProjectIdRef = useRef<string | null>(null);

  // Check if code belongs to current project
  const codeBelongsToProject = useCallback((projectId: string | null) => {
    return codeProjectIdRef.current === projectId && code.length > 0;
  }, [code]);

  // Parse DSL from project (handles both string and object formats)
  const parseProjectDsl = useCallback((dsl: any): UiDsl | null => {
    if (!dsl) return null;
    if (typeof dsl === 'string') {
      try {
        return JSON.parse(dsl);
      } catch (e) {
        logger.warn("Failed to parse DSL from string:", e);
        return null;
      }
    }
    return dsl;
  }, []);

  // Load project data into local state
  const loadProjectData = useCallback((project: UIProject) => {
    const projectDsl = parseProjectDsl(project.dsl);
    
    if (project.code) {
      setCode(project.code);
      codeProjectIdRef.current = project.id;
      loadedProjectDataRef.current = {
        projectId: project.id,
        code: project.code,
        dsl: projectDsl,
      };
      setActivePreviewTab("preview");
      
      if (process.env.NODE_ENV === "development") {
        logger.debug("[CodeSync] Loaded project code:", {
          projectId: project.id,
          codeLength: project.code.length,
        });
      }
    } else {
      // Clear code if project has no code
      setCode("");
      codeProjectIdRef.current = null;
      loadedProjectDataRef.current = {
        projectId: project.id,
        code: "",
        dsl: projectDsl,
      };
      setActivePreviewTab("new-component");
      
      if (process.env.NODE_ENV === "development") {
        logger.debug("[CodeSync] Cleared code (project has no code):", {
          projectId: project.id,
        });
      }
    }
    
    setGenerationMetadata(project.generationMetadata || null);
  }, [setCode, setGenerationMetadata, setActivePreviewTab, parseProjectDsl]);

  // Main synchronization effect
  useEffect(() => {
    if (!mounted) return;

    // Clear refs when no project is active
    if (!activeProjectId || !activeProject) {
      if (loadedProjectDataRef.current.projectId !== null) {
        loadedProjectDataRef.current = { projectId: null, code: "", dsl: null };
        codeProjectIdRef.current = null;
      }
      return;
    }

    const isDifferentProject = loadedProjectDataRef.current.projectId !== activeProjectId;
    const projectCodeChanged = activeProject.code !== loadedProjectDataRef.current.code;
    const projectDsl = parseProjectDsl(activeProject.dsl);
    const projectDslChanged = JSON.stringify(projectDsl) !== JSON.stringify(loadedProjectDataRef.current.dsl);
    const codeBelongsToThisProject = codeBelongsToProject(activeProjectId);

    // Determine if we need to load project data
    const shouldLoad = 
      isDifferentProject || 
      (projectCodeChanged && !codeBelongsToThisProject) || 
      (projectDslChanged && !codeBelongsToThisProject);

    if (shouldLoad) {
      loadProjectData(activeProject);
    } else if (process.env.NODE_ENV === "development") {
      logger.debug("[CodeSync] Skipped loading (already loaded):", {
        projectId: activeProjectId,
        codeBelongsToThisProject,
        isDifferentProject,
        projectCodeChanged,
      });
    }
  }, [activeProjectId, activeProject, mounted, codeBelongsToProject, loadProjectData, parseProjectDsl]);

  // Return utilities for external use
  return {
    codeProjectIdRef,
    loadedProjectDataRef,
    codeBelongsToProject,
    markCodeAsBelongingToProject: useCallback((projectId: string) => {
      codeProjectIdRef.current = projectId;
    }, []),
    clearCodeOwnership: useCallback(() => {
      codeProjectIdRef.current = null;
    }, []),
  };
}

