/**
 * Test Presence Utilities
 * 
 * Helper functions to detect if components have Storybook stories or unit tests
 */

/**
 * List of components that have Storybook stories
 * This should match the mapping in apps/www/src/lib/storybook-mapping.ts
 * 
 * Components with Storybook stories (based on storybook-mapping.ts):
 */
export const COMPONENTS_WITH_STORIES = new Set([
  // Core components
  "accordion",
  "aspect-ratio",
  "alert",
  "alert-dialog",
  "avatar",
  "badge",
  "breadcrumbs",
  "button",
  "calendar",
  "card",
  "carousel",
  "checkbox",
  "collapsible",
  "combobox",
  "command-palette",
  "context-menu",
  "date-picker",
  "dialog",
  "dropdown-menu",
  "form-field",
  "hover-card",
  "input",
  "menubar",
  "multi-select",
  "navigation-menu",
  "pagination",
  "popover",
  "progress",
  "radio",
  "resizable",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "skeleton",
  "slider",
  "spinner",
  "stepper",
  "switch",
  "table",
  "tabs",
  "textarea",
  "timeline",
  "toast",
  "tree-view",
  "color-picker",
  "toggle",
  "toggle-group",
  "segmented-control",
  "rating",
  "file-upload",
  "split-button",
  "tag-input",
  "tooltip",
  "virtual-list",
  "virtual-table",
  
  // Blocks
  "data-table",
  "pricing-table",
  "authentication-block",
]);

/**
 * Convert component name to kebab-case
 * Handles PascalCase, camelCase, and kebab-case
 * 
 * Examples:
 * - "Button" -> "button"
 * - "DataTable" -> "data-table"
 * - "data-table" -> "data-table"
 * - "activityFeed" -> "activity-feed"
 */
function toKebabCase(name: string): string {
  if (!name) return "";
  
  // If already kebab-case, return as is
  if (name.includes("-")) {
    return name.toLowerCase();
  }
  
  // Convert PascalCase/camelCase to kebab-case
  return name
    .replace(/([A-Z])/g, "-$1") // Insert hyphen before uppercase letters
    .toLowerCase()
    .replace(/^-+/, ""); // Remove leading hyphens
}

/**
 * Check if a component has a Storybook story
 * 
 * @param componentName - Component name in any format (PascalCase, camelCase, or kebab-case)
 * @returns true if component has a Storybook story
 */
export function hasStorybookStory(componentName: string): boolean {
  if (!componentName) return false;
  
  // Normalize component name to kebab-case
  const normalizedName = toKebabCase(componentName);
  
  // Check if it's in our list
  if (COMPONENTS_WITH_STORIES.has(normalizedName)) {
    return true;
  }
  
  // Also check without common suffixes/prefixes
  // E.g., "ButtonExample" -> "button"
  const withoutSuffix = normalizedName.replace(/-?(example|preview|component)$/, "");
  if (withoutSuffix !== normalizedName && COMPONENTS_WITH_STORIES.has(withoutSuffix)) {
    return true;
  }
  
  return false;
}

/**
 * Get list of all components with Storybook stories
 */
export function getComponentsWithStories(): string[] {
  return Array.from(COMPONENTS_WITH_STORIES);
}

