/**
 * Storybook configuration
 * 
 * Production: Set NEXT_PUBLIC_STORYBOOK_URL environment variable in Vercel
 * - If deployed to Chromatic: https://your-chromatic-project.chromatic.com
 * - If deployed to Netlify/Vercel: your-storybook-deployment-url
 * 
 * Default production URL: Chromatic Storybook
 * Development: Defaults to localhost:6006 if running locally
 */
const DEFAULT_CHROMATIC_URL = "https://6908c46a37e9c1c1fe40b48d-wvgljbvydh.chromatic.com";

function getStorybookBaseUrl(): string {
  // Check environment variable first (highest priority)
  if (process.env.NEXT_PUBLIC_STORYBOOK_URL) {
    return process.env.NEXT_PUBLIC_STORYBOOK_URL;
  }
  
  // In browser, check if we're on localhost
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      // Try to detect Storybook port from environment or use default
      // Default to 6006 as that's the standard Storybook port
      const storybookPort = process.env.NEXT_PUBLIC_STORYBOOK_PORT || "6006";
      return `http://localhost:${storybookPort}`;
    }
    
    // Production in browser without env var - use default Chromatic URL
    return DEFAULT_CHROMATIC_URL;
  }
  
  // Server-side: check if in development mode
  if (process.env.NODE_ENV === "development") {
    // Try to detect Storybook port from environment or use default
    // Default to 6006 as that's the standard Storybook port
    const storybookPort = process.env.NEXT_PUBLIC_STORYBOOK_PORT || "6006";
    return `http://localhost:${storybookPort}`;
  }
  
  // Production server-side without env var - use default Chromatic URL
  return DEFAULT_CHROMATIC_URL;
}

// Use function instead of constant to avoid SSR issues
// This ensures fresh calculation on each call
export function getStorybookUrlValue(): string {
  return getStorybookBaseUrl();
}

// Keep for backward compatibility but make it a function call
export const STORYBOOK_URL = typeof window !== "undefined" 
  ? getStorybookBaseUrl() 
  : "https://6908c46a37e9c1c1fe40b48d-wvgljbvydh.chromatic.com";

/**
 * Generate Storybook URL with optional path
 * Returns empty string if STORYBOOK_URL is not configured (links will be disabled)
 * 
 * Storybook URLs use query parameter format: ?path=/docs/... or ?path=/story/...
 * 
 * IMPORTANT: Storybook requires ?path= query parameter format, not direct path.
 * Example: ?path=/docs/core-button--docs (NOT /docs/core-button--docs/)
 */
export function getStorybookUrl(path?: string): string {
  // Always get fresh URL to avoid SSR/cache issues
  const baseUrl = getStorybookBaseUrl();
  
  if (!baseUrl) {
    return ""; // Return empty string if not configured - links won't work
  }
  
  if (path) {
    // Always use query parameter format for Storybook paths
    // Remove leading slash if present (will be added in path)
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    // Ensure we use ?path= format (required by Storybook)
    return `${baseUrl}?path=${encodeURIComponent(cleanPath)}`;
  }
  return baseUrl;
}

/**
 * Check if Storybook is configured
 */
export function isStorybookConfigured(): boolean {
  return !!STORYBOOK_URL;
}

