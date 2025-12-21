/**
 * Custom hook for managing component folders with localStorage persistence
 */

import { useState, useEffect, useCallback } from "react";
import { useDebouncedLocalStorage } from "./use-debounced-local-storage";
import type { ComponentFolder } from "./use-ui-projects";

const FOLDERS_KEY = "fragment-ui-playground-component-folders";

export function useComponentFolders() {
  const [folders, setFolders] = useState<ComponentFolder[]>([]);
  const [mounted, setMounted] = useState(false);

  // Mark as mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    try {
      const savedFolders = localStorage.getItem(FOLDERS_KEY);

      if (savedFolders) {
        const parsed = JSON.parse(savedFolders);
        const foldersWithDates = parsed.map((folder: any) => ({
          ...folder,
          createdAt: new Date(folder.createdAt),
        }));
        setFolders(foldersWithDates);
      }
    } catch (error) {
      // Error loading folders - handled silently
      if (process.env.NODE_ENV === "development") {
        console.error("Error loading folders from localStorage:", error);
      }
    }
  }, [mounted]);

  // Debounced save to localStorage whenever folders change
  useDebouncedLocalStorage(FOLDERS_KEY, folders, 500);

  const addFolder = useCallback((folder: ComponentFolder) => {
    setFolders((prev) => [...prev, folder]);
  }, []);

  const updateFolder = useCallback((folderId: string, updates: Partial<ComponentFolder>) => {
    setFolders((prev) =>
      prev.map((folder) => (folder.id === folderId ? { ...folder, ...updates } : folder))
    );
  }, []);

  const removeFolder = useCallback((folderId: string) => {
    setFolders((prev) => prev.filter((folder) => folder.id !== folderId));
  }, []);

  return {
    folders,
    setFolders,
    addFolder,
    updateFolder,
    removeFolder,
    mounted,
  };
}

