"use client";

import * as React from "react";
import { initializeTheme, getInitialTheme, type Theme, setTheme as setThemeUtil, useTheme } from "../lib/theme";
import { initializeStyling } from "../lib/styling";
import { Sun, Moon } from "lucide-react";

/**
 * ThemeProvider - Initializes theme, density, motion, and contrast on mount
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    initializeTheme();
    initializeStyling();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        const currentTheme = getInitialTheme();
        if (currentTheme === "system") {
          setThemeUtil("system");
        }
      };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return <>{children}</>;
}

/**
 * ThemeToggle - Button component to switch between themes
 */
export function ThemeToggle() {
  const { theme, setTheme, effectiveTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="flex items-center justify-center h-8 w-8 rounded-[var(--Corner-Radius-2xs,6px)] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        aria-label="Toggle theme"
        disabled
      >
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  const toggleTheme = () => {
    if (effectiveTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center h-8 w-8 rounded-[var(--Corner-Radius-2xs,6px)] hover:bg-[color:var(--color-surface-2)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      aria-label={effectiveTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={effectiveTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {effectiveTheme === "dark" ? (
        <Sun className="h-4 w-4 text-[color:var(--foreground-primary)]" />
      ) : (
        <Moon className="h-4 w-4 text-[color:var(--foreground-primary)]" />
      )}
    </button>
  );
}

