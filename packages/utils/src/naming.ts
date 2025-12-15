/**
 * Naming utilities for converting between different naming conventions
 * 
 * Centralized implementation to avoid duplication across the codebase.
 * Supports conversion between:
 * - kebab-case: "my-component-name"
 * - camelCase: "myComponentName"
 * - PascalCase: "MyComponentName"
 * 
 * Handles special cases:
 * - Acronyms (KPI, API, UI, ID, URL, etc.)
 * - Already-formatted strings (idempotent operations)
 */

/**
 * Map of common acronyms that should be preserved in uppercase
 */
const ACRONYM_MAP: Record<string, string> = {
  "kpi": "KPI",
  "api": "API",
  "ui": "UI",
  "id": "ID",
  "url": "URL",
  "http": "HTTP",
  "https": "HTTPS",
  "html": "HTML",
  "css": "CSS",
  "js": "JS",
  "ts": "TS",
  "json": "JSON",
  "xml": "XML",
  "csv": "CSV",
  "pdf": "PDF",
  "svg": "SVG",
  "rss": "RSS",
  "gql": "GQL",
  "rest": "REST",
  "soap": "SOAP",
  "dom": "DOM",
  "ajax": "AJAX",
  "xhr": "XHR",
};

/**
 * Convert component name to kebab-case
 * Handles PascalCase, camelCase, and kebab-case
 * 
 * @param name - Component name in any format
 * @returns kebab-case string
 * 
 * @example
 * toKebabCase("Button") // "button"
 * toKebabCase("DataTable") // "data-table"
 * toKebabCase("data-table") // "data-table"
 * toKebabCase("activityFeed") // "activity-feed"
 * toKebabCase("KPICard") // "kpi-card"
 */
export function toKebabCase(name: string): string {
  if (!name) return "";
  
  // If already kebab-case, return as is
  if (name.includes("-") && !/[A-Z]/.test(name)) {
    return name.toLowerCase();
  }
  
  // Convert PascalCase/camelCase to kebab-case
  return name
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2') // Insert hyphen before uppercase letters
    .toLowerCase()
    .replace(/^-+/, ""); // Remove leading hyphens
}

/**
 * Convert string to camelCase
 * 
 * @param str - String to convert
 * @returns camelCase string
 * 
 * @example
 * toCamelCase("my-component") // "myComponent"
 * toCamelCase("MyComponent") // "myComponent"
 * toCamelCase("kpi-card") // "kpiCard"
 */
export function toCamelCase(str: string): string {
  if (!str) return "";
  
  // Normalize PascalCase / camelCase without separators to kebab, then camelize
  const normalized = (!str.includes("-") && !str.includes("_") && !/\s/.test(str))
    ? toKebabCase(str)
    : str;
  
  return normalized
    .split(/[-_\s]+/)
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      const lowerWord = word.toLowerCase();
      // Check for acronyms
      if (ACRONYM_MAP[lowerWord]) {
        return ACRONYM_MAP[lowerWord];
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
}

/**
 * Convert string to PascalCase for component names in JSX
 * 
 * @param str - String to convert
 * @returns PascalCase string
 * 
 * @example
 * toPascalCase("my-component") // "MyComponent"
 * toPascalCase("button") // "Button"
 * toPascalCase("kpi-card") // "KPICard"
 * toPascalCase("data-table") // "DataTable"
 */
export function toPascalCase(str: string): string {
  if (!str) return "";
  
  // If already in PascalCase (no hyphens and starts with uppercase), return as-is
  if (!str.includes('-') && !str.includes('_') && /^[A-Z]/.test(str)) {
    return str;
  }
  
  return str
    .split(/[-_\s]+/)
    .map((word) => {
      const lowerWord = word.toLowerCase();
      // Handle acronyms
      if (ACRONYM_MAP[lowerWord]) {
        return ACRONYM_MAP[lowerWord];
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
}

/**
 * Normalize component name to a standard format
 * Tries to detect the input format and normalize to kebab-case
 * 
 * @param name - Component name in any format
 * @returns Normalized kebab-case name
 * 
 * @example
 * normalizeComponentName("Button") // "button"
 * normalizeComponentName("data-table") // "data-table"
 * normalizeComponentName("MyComponent") // "my-component"
 */
export function normalizeComponentName(name: string): string {
  return toKebabCase(name);
}

/**
 * Convert component name to display format (PascalCase)
 * Useful for showing component names in UI
 * 
 * @param name - Component name in any format
 * @returns PascalCase display name
 * 
 * @example
 * toDisplayName("data-table") // "DataTable"
 * toDisplayName("button") // "Button"
 */
export function toDisplayName(name: string): string {
  return toPascalCase(name);
}

