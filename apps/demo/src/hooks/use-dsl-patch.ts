/**
 * use-dsl-patch Hook
 * 
 * Hook for managing DSL patch operations with undo/redo support
 */

import { useState, useCallback, useRef } from "react";
import type { UiPage, Patch, Diagnostic } from "@fragment_ui/ui-dsl";

export interface PatchHistoryEntry {
  dsl: UiPage;
  patches: Patch[];
  timestamp: number;
  prompt?: string; // User prompt that generated these patches
  userId?: string; // Optional user ID (for multi-user scenarios)
}

export interface UseDslPatchOptions {
  initialDsl?: UiPage;
  maxHistorySize?: number;
  onPatchApplied?: (dsl: UiPage, patches: Patch[]) => void;
  onError?: (error: Error, diagnostics: Diagnostic[]) => void;
}

export interface PatchMetadata {
  prompt?: string; // User prompt that generated these patches
  userId?: string; // Optional user ID (for multi-user scenarios)
}

export interface UseDslPatchReturn {
  dsl: UiPage | null;
  history: PatchHistoryEntry[];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  applyPatches: (patches: Patch[], metadata?: PatchMetadata) => Promise<boolean>;
  undo: () => void;
  redo: () => void;
  reset: (dsl: UiPage) => void;
  clearHistory: () => void;
}

/**
 * Hook for managing DSL patch operations
 */
export function useDslPatch(options: UseDslPatchOptions = {}): UseDslPatchReturn {
  const { initialDsl, maxHistorySize = 50, onPatchApplied, onError } = options;
  
  const [dsl, setDsl] = useState<UiPage | null>(initialDsl || null);
  const [history, setHistory] = useState<PatchHistoryEntry[]>(
    initialDsl ? [{ dsl: initialDsl, patches: [], timestamp: Date.now() }] : []
  );
  const [historyIndex, setHistoryIndex] = useState(0);
  const isApplyingRef = useRef(false);

  /**
   * Apply patches to DSL via API
   */
  const applyPatches = useCallback(
    async (patches: Patch[], metadata?: PatchMetadata): Promise<boolean> => {
      if (!dsl || patches.length === 0 || isApplyingRef.current) {
        return false;
      }

      isApplyingRef.current = true;

      try {
        const response = await fetch("/api/dsl/patch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dsl,
            patches,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const result = await response.json();

        if (result.error) {
          const diagnostics = result.diagnostics || [];
          onError?.(new Error(result.error), diagnostics);
          return false;
        }

        const newDsl = result.dsl as UiPage;

        // Update DSL
        setDsl(newDsl);

        // Add to history (remove any future history if we're not at the end)
        setHistory((prev) => {
          const newHistory = prev.slice(0, historyIndex + 1);
          newHistory.push({
            dsl: newDsl,
            patches,
            timestamp: Date.now(),
            prompt: metadata?.prompt,
            userId: metadata?.userId,
          });

          // Limit history size
          if (newHistory.length > maxHistorySize) {
            return newHistory.slice(-maxHistorySize);
          }

          return newHistory;
        });

        setHistoryIndex((prev) => {
          const newIndex = prev + 1;
          // History size is managed in setHistory callback above
          return newIndex;
        });

        onPatchApplied?.(newDsl, patches);
        return true;
      } catch (error) {
        console.error("[useDslPatch] Failed to apply patches:", error);
        onError?.(error as Error, []);
        return false;
      } finally {
        isApplyingRef.current = false;
      }
    },
    [dsl, historyIndex, maxHistorySize, onPatchApplied, onError]
  );

  /**
   * Undo last patch operation
   */
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const entry = history[newIndex];
      setDsl(entry.dsl);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  /**
   * Redo last undone patch operation
   */
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const entry = history[newIndex];
      setDsl(entry.dsl);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  /**
   * Reset DSL and history
   */
  const reset = useCallback(
    (newDsl: UiPage) => {
      setDsl(newDsl);
      setHistory([{ dsl: newDsl, patches: [], timestamp: Date.now() }]);
      setHistoryIndex(0);
    },
    []
  );

  /**
   * Clear history (keep current DSL)
   */
  const clearHistory = useCallback(() => {
    if (dsl) {
      setHistory([{ dsl, patches: [], timestamp: Date.now() }]);
      setHistoryIndex(0);
    }
  }, [dsl]);

  return {
    dsl,
    history,
    historyIndex,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    applyPatches,
    undo,
    redo,
    reset,
    clearHistory,
  };
}

