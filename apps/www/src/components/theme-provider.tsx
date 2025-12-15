"use client";

import * as React from "react";
import { initializeTheme, getInitialTheme, type Theme, setTheme as setThemeUtil, useTheme } from "../lib/theme";
import { Sun, Moon } from "lucide-react";
import { Button } from "@fragment_ui/ui";

/**
 * ThemeProvider - Initializes theme on mount and handles system preference changes
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    initializeTheme();

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

  // During SSR, render a placeholder to avoid hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        aria-label="Toggle theme"
        disabled
      >
        <Sun className="h-4 w-4 text-[color:var(--foreground-primary)]" />
      </Button>
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
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-8 w-8 p-0"
      aria-label={effectiveTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={effectiveTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {effectiveTheme === "dark" ? (
        <Sun className="h-4 w-4 text-[color:var(--foreground-primary)]" />
      ) : (
        <Moon className="h-4 w-4 text-[color:var(--foreground-primary)]" />
      )}
    </Button>
  );
}

