/**
 * Code History Hook with metadata
 * 
 * Extended undo/redo system with commit messages and timestamps
 */

import { useState, useCallback, useRef } from "react";

export interface CodeCommit {
  id: string;
  code: string;
  timestamp: number;
  message?: string;
  author?: "user" | "ai" | "system";
  type?: "generation" | "edit" | "patch" | "manual";
}

export interface CodeHistoryState {
  past: CodeCommit[];
  present: CodeCommit | null;
  future: CodeCommit[];
}

export function useCodeHistory(initialCode: string, maxHistory: number = 50): {
  history: CodeHistoryState;
  addCommit: (code: string, metadata?: { message?: string; author?: "user" | "ai" | "system"; type?: "generation" | "edit" | "patch" | "manual" }) => void;
  undo: () => void;
  redo: () => void;
  goToCommit: (commitId: string) => string | null;
  canUndo: boolean;
  canRedo: boolean;
  clear: () => void;
  getCurrentCode: () => string;
} {
  const [history, setHistory] = useState<CodeHistoryState>(() => {
    const initialCommit: CodeCommit = {
      id: generateCommitId(),
      code: initialCode,
      timestamp: Date.now(),
      author: "system",
      type: "manual",
    };
    return {
      past: [],
      present: initialCommit,
      future: [],
    };
  });

  const addCommit = useCallback((code: string, metadata?: { message?: string; author?: "user" | "ai" | "system"; type?: "generation" | "edit" | "patch" | "manual" }) => {
    setHistory((current) => {
      if (!current.present || current.present.code === code) {
        // No change, don't create new commit
        return current;
      }

      const newCommit: CodeCommit = {
        id: generateCommitId(),
        code,
        timestamp: Date.now(),
        message: metadata?.message,
        author: metadata?.author || "user",
        type: metadata?.type || "edit",
      };

      const newPast = current.present ? [...current.past, current.present] : current.past;
      const trimmedPast = newPast.slice(-maxHistory);

      return {
        past: trimmedPast,
        present: newCommit,
        future: [], // Clear future when new commit is added
      };
    });
  }, [maxHistory]);

  const undo = useCallback(() => {
    setHistory((current) => {
      if (current.past.length === 0 || !current.present) {
        return current;
      }
      const previous = current.past[current.past.length - 1];
      const newPast = current.past.slice(0, -1);
      return {
        past: newPast,
        present: previous,
        future: [current.present, ...current.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((current) => {
      if (current.future.length === 0 || !current.present) {
        return current;
      }
      const next = current.future[0];
      const newFuture = current.future.slice(1);
      return {
        past: [...current.past, current.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const goToCommit = useCallback((commitId: string): string | null => {
    let foundCode: string | null = null;
    
    setHistory((current) => {
      // Find commit in past
      const pastIndex = current.past.findIndex(c => c.id === commitId);
      if (pastIndex !== -1) {
        const targetCommit = current.past[pastIndex];
        foundCode = targetCommit.code;
        const newPast = current.past.slice(0, pastIndex);
        const newFuture = [
          ...current.past.slice(pastIndex + 1),
          ...(current.present ? [current.present] : []),
          ...current.future,
        ];
        return {
          past: newPast,
          present: targetCommit,
          future: newFuture,
        };
      }

      // Find commit in future
      const futureIndex = current.future.findIndex(c => c.id === commitId);
      if (futureIndex !== -1) {
        const targetCommit = current.future[futureIndex];
        foundCode = targetCommit.code;
        const newPast = [
          ...current.past,
          ...(current.present ? [current.present] : []),
          ...current.future.slice(0, futureIndex),
        ];
        const newFuture = current.future.slice(futureIndex + 1);
        return {
          past: newPast,
          present: targetCommit,
          future: newFuture,
        };
      }

      // Check if it's current commit
      if (current.present?.id === commitId) {
        foundCode = current.present.code;
        return current;
      }

      return current;
    });

    return foundCode;
  }, []);

  const clear = useCallback(() => {
    const initialCommit: CodeCommit = {
      id: generateCommitId(),
      code: initialCode,
      timestamp: Date.now(),
      author: "system",
      type: "manual",
    };
    setHistory({
      past: [],
      present: initialCommit,
      future: [],
    });
  }, [initialCode]);

  const getCurrentCode = useCallback(() => {
    return history.present?.code || initialCode;
  }, [history.present, initialCode]);

  return {
    history,
    addCommit,
    undo,
    redo,
    goToCommit,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    clear,
    getCurrentCode,
  };
}

function generateCommitId(): string {
  return `commit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

