/**
 * Custom hook for debounced localStorage saves
 */

import { useEffect, useRef } from "react";

export function useDebouncedLocalStorage<T>(
  key: string,
  value: T,
  delay: number = 500
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error(`Error saving to localStorage key "${key}":`, error);
        }
      }
    }, delay);

    // Cleanup on unmount - save immediately before unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Save immediately on unmount to prevent data loss
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error(`Error saving to localStorage key "${key}" on unmount:`, error);
        }
      }
    };
  }, [key, value, delay]);
}

