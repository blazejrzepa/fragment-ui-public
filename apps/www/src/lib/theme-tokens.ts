// Token definition type (moved from theme-builder/token-editor)
export type TokenValue = string | number;

export interface TokenDefinition {
  path: string;
  label: string;
  type: "color" | "number" | "string";
  unit?: string;
  description?: string;
}

// Default token values - matching tokens.json structure
const DEFAULT_TOKENS = {
  color: {
    bg: { base: "#0B0B0C", inverse: "#FFFFFF" },
    fg: { base: "#EDEDF0", muted: "#B5B8BE" },
    brand: { primary: "#6366F1", "primary-600": "#EEF2FF" },
    surface: { "1": "#121214", "2": "#19191B" },
    accent: { green: "#22C55E", red: "#EF4444" },
  },
  space: { "1": 4, "2": 8, "4": 16 },
  radius: { base: "medium" }, // none: 0, small: 4, medium: 8, large: 16, full: 9999
  typography: { fontFamily: "Geist" },
  iconLibrary: "lucide", // lucide | tabler | hugeicons | phosphor
} as const;

/**
 * Define editable tokens for the theme builder
 */
export const THEME_TOKENS: TokenDefinition[] = [
  // Colors - Brand
  {
    path: "color.brand.primary",
    label: "Brand Primary",
    type: "color",
    description: "Primary brand color",
  },
  // Spacing
  {
    path: "space.1",
    label: "Space 1",
    type: "number",
    unit: "px",
    description: "Base spacing unit",
  },
  {
    path: "space.2",
    label: "Space 2",
    type: "number",
    unit: "px",
  },
  {
    path: "space.4",
    label: "Space 4",
    type: "number",
    unit: "px",
  },
  // Radius
  {
    path: "radius.base",
    label: "Border Radius",
    type: "string",
    description: "Select border radius size",
  },
  // Typography
  {
    path: "typography.fontFamily",
    label: "Font Family",
    type: "string",
    description: "Select a font from Google Fonts",
  },
  // Icon Library
  {
    path: "iconLibrary",
    label: "Icon Library",
    type: "string",
    description: "Select icon library",
  },
];

/**
 * Get default token values
 */
export function getDefaultTokenValues(): Record<string, string | number> {
  const values: Record<string, string | number> = {};
  THEME_TOKENS.forEach((token) => {
    const parts = token.path.split(".");
    let current: any = DEFAULT_TOKENS;
    for (const part of parts) {
      current = current?.[part];
    }
    if (current !== undefined) {
      values[token.path] = current;
    }
  });
  return values;
}

/**
 * Convert token values to CSS custom properties
 * Maps token paths to actual CSS variable names used in the design system
 */
export function tokensToCSS(tokens: Record<string, string | number>): Record<string, string> {
  const css: Record<string, string> = {};
  Object.entries(tokens).forEach(([path, value]) => {
    // Special handling for radius.base - map to all radius tokens
    if (path === "radius.base") {
      const radiusValue = String(value || "medium");
      let radiusPx: string;
      switch (radiusValue) {
        case "none":
          radiusPx = "0px";
          break;
        case "small":
          radiusPx = "4px";
          break;
        case "medium":
          radiusPx = "8px";
          break;
        case "large":
          radiusPx = "16px";
          break;
        case "full":
          radiusPx = "9999px";
          break;
        default:
          radiusPx = "8px"; // default to medium
      }
      // Apply to all radius tokens (sm, md, lg) for backward compatibility
      css["--radius-sm"] = radiusPx;
      css["--radius-md"] = radiusPx;
      css["--radius-lg"] = radiusPx;
      return; // Skip default processing for radius
    }
    
    // Map token paths to CSS variable names
    let varName: string;
    
    if (path.startsWith("color.")) {
      // color.bg.base -> --color-bg-base
      // color.brand.primary -> --color-brand-primary
      // color.brand.primary-600 -> --color-brand-primary-600
      varName = `--color-${path.replace(/^color\./, "").replace(/\./g, "-")}`;
    } else if (path.startsWith("space.")) {
      // space.1 -> --space-1
      varName = `--space-${path.replace(/^space\./, "")}`;
    } else if (path.startsWith("radius.")) {
      // radius.sm -> --radius-sm (for backward compatibility, but should use radius.base now)
      varName = `--radius-${path.replace(/^radius\./, "")}`;
    } else if (path.startsWith("typography.")) {
      // typography.fontFamily -> --typography-font-sans
      if (path === "typography.fontFamily") {
        varName = "--typography-font-sans";
      } else {
        // typography.size.xs -> --typography-size-xs (for backward compatibility)
        varName = `--typography-${path.replace(/^typography\./, "").replace(/\./g, "-")}`;
      }
    } else if (path === "iconLibrary") {
      // iconLibrary -> --icon-library
      varName = "--icon-library";
    } else {
      // Fallback: convert dots to dashes
      varName = `--${path.replace(/\./g, "-")}`;
    }
    
    // Add unit for numeric values
    const stringValue = String(value);
    if (typeof value === "number" && !stringValue.includes("px") && !stringValue.includes("%")) {
      css[varName] = `${value}px`;
    } else {
      css[varName] = stringValue;
    }
  });
  return css;
}

/**
 * Apply CSS custom properties to document root
 */
export function applyThemeToDocument(css: Record<string, string>) {
  const root = document.documentElement;
  Object.entries(css).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
}

/**
 * Reset theme to defaults
 */
export function resetTheme() {
  const defaultCSS = tokensToCSS(getDefaultTokenValues());
  applyThemeToDocument(defaultCSS);
}

