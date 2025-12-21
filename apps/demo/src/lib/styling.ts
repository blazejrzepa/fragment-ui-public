/**
 * Styling utilities for theme, density, motion, and contrast
 */

export type Density = "compact" | "normal" | "comfortable";
export type Motion = "reduced" | "normal";
export type Contrast = "normal" | "high";

const DENSITY_STORAGE_KEY = "fragment-ui-density";
const MOTION_STORAGE_KEY = "fragment-ui-motion";
const CONTRAST_STORAGE_KEY = "fragment-ui-contrast";

/**
 * Get initial density from localStorage or default
 */
export function getInitialDensity(): Density {
  if (typeof window === "undefined") return "normal";
  const stored = localStorage.getItem(DENSITY_STORAGE_KEY);
  if (stored === "compact" || stored === "comfortable") {
    return stored;
  }
  return "normal";
}

/**
 * Get initial motion from localStorage or default
 */
export function getInitialMotion(): Motion {
  if (typeof window === "undefined") return "normal";
  const stored = localStorage.getItem(MOTION_STORAGE_KEY);
  if (stored === "reduced") {
    return stored;
  }
  // Check for prefers-reduced-motion
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "reduced";
  }
  return "normal";
}

/**
 * Get initial contrast from localStorage or default
 */
export function getInitialContrast(): Contrast {
  if (typeof window === "undefined") return "normal";
  const stored = localStorage.getItem(CONTRAST_STORAGE_KEY);
  if (stored === "high") {
    return stored;
  }
  return "normal";
}

/**
 * Apply density to document
 */
export function applyDensity(density: Density) {
  if (typeof window === "undefined") return;
  const html = document.documentElement;
  html.setAttribute("data-density", density);
  localStorage.setItem(DENSITY_STORAGE_KEY, density);
}

/**
 * Apply motion to document
 */
export function applyMotion(motion: Motion) {
  if (typeof window === "undefined") return;
  const html = document.documentElement;
  html.setAttribute("data-motion", motion);
  localStorage.setItem(MOTION_STORAGE_KEY, motion);
}

/**
 * Apply contrast to document (via theme)
 */
export function applyContrast(contrast: Contrast) {
  if (typeof window === "undefined") return;
  const html = document.documentElement;
  const currentTheme = html.getAttribute("data-theme");
  
  if (contrast === "high") {
    // If switching to high contrast, preserve original theme if it exists
    if (currentTheme && currentTheme !== "high-contrast") {
      html.setAttribute("data-original-theme", currentTheme);
    }
    html.setAttribute("data-theme", "high-contrast");
  } else {
    // Restore original theme if it exists
    const originalTheme = html.getAttribute("data-original-theme");
    if (originalTheme) {
      html.setAttribute("data-theme", originalTheme);
      html.removeAttribute("data-original-theme");
    } else if (currentTheme === "high-contrast") {
      // If no original theme, default to system preference
      html.removeAttribute("data-theme");
    }
  }
  
  localStorage.setItem(CONTRAST_STORAGE_KEY, contrast);
}

/**
 * Initialize styling preferences
 */
export function initializeStyling() {
  applyDensity(getInitialDensity());
  applyMotion(getInitialMotion());
  applyContrast(getInitialContrast());
  
  // Listen for prefers-reduced-motion changes
  if (typeof window !== "undefined") {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => {
      if (getInitialMotion() === "normal") {
        applyMotion(mediaQuery.matches ? "reduced" : "normal");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }
}

