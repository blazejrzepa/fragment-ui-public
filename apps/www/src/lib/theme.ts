"use client";

import React from "react";

/**
 * Theme management utilities
 * Handles theme switching, system preference detection, and persistence
 */

export type Theme = "light" | "dark" | "high-contrast" | "system";

const THEME_STORAGE_KEY = "fragment-ui-theme";

/**
 * Get the current theme from localStorage or system preference
 */
export function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    // Prefer system by default; CSS handles prefers-color-scheme when data-theme is not set.
    return "system";
  }

  const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
  if (stored && ["light", "dark", "high-contrast", "system"].includes(stored)) {
    return stored;
  }

  // Default: follow system preference
  return "system";
}

/**
 * Get the effective theme (resolves "system" to actual theme)
 */
export function getEffectiveTheme(theme: Theme): "light" | "dark" | "high-contrast" {
  if (theme === "system") {
    if (typeof window === "undefined") {
      return "dark"; // Default for SSR
    }
    // Default to dark mode if system preference is not available
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: Theme) {
  if (typeof window === "undefined") {
    return;
  }

  const html = document.documentElement;

  // If theme is "system", remove data-theme attribute to let media queries handle it
  if (theme === "system") {
    html.removeAttribute("data-theme");
  } else {
    // For explicit themes, set data-theme attribute
    const effectiveTheme = getEffectiveTheme(theme);
    html.setAttribute("data-theme", effectiveTheme);
  }

  // Save to localStorage (always save the user's choice, even if "system")
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

/**
 * Set theme and persist to localStorage
 */
export function setTheme(theme: Theme) {
  applyTheme(theme);
}

/**
 * Initialize theme on page load
 */
export function initializeTheme() {
  const theme = getInitialTheme();
  applyTheme(theme);

  // Listen for system theme changes
  if (typeof window !== "undefined" && theme === "system") {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      applyTheme("system");
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }
}

/**
 * React hook for theme management
 */
export function useTheme() {
  if (typeof window === "undefined") {
    return {
      theme: "dark" as Theme,
      setTheme: () => {},
      effectiveTheme: "dark" as const,
    };
  }

  const [theme, setThemeState] = React.useState<Theme>(() => getInitialTheme());

  React.useEffect(() => {
    // Initialize theme on mount
    initializeTheme();
    setThemeState(getInitialTheme());

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const currentTheme = getInitialTheme();
      if (currentTheme === "system") {
        applyTheme("system");
        // Force re-render to update effective theme
        setThemeState("system");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const updateTheme = React.useCallback((newTheme: Theme) => {
    // Apply theme immediately to DOM
    applyTheme(newTheme);
    // Update state to trigger re-render
    setThemeState(newTheme);
  }, []);

  return {
    theme,
    setTheme: updateTheme,
    effectiveTheme: getEffectiveTheme(theme),
  };
}

