import { TokenDefinition } from "../components/theme-builder/token-editor";

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
  radius: { sm: 8, md: 12, lg: 16 },
  typography: { size: { xs: 12, intro: 15, sm: 14, md: 16, lg: 18, xl: 20, "2xl": 22 } },
} as const;

/**
 * Define editable tokens for the theme builder
 */
export const THEME_TOKENS: TokenDefinition[] = [
  // Colors - Background
  {
    path: "color.bg.base",
    label: "Background Base",
    type: "color",
    description: "Main background color",
  },
  {
    path: "color.bg.inverse",
    label: "Background Inverse",
    type: "color",
    description: "Inverse background color",
  },
  // Colors - Foreground
  {
    path: "color.fg.base",
    label: "Foreground Base",
    type: "color",
    description: "Main text color",
  },
  {
    path: "color.fg.muted",
    label: "Foreground Muted",
    type: "color",
    description: "Muted/secondary text color",
  },
  // Colors - Brand
  {
    path: "color.brand.primary",
    label: "Brand Primary",
    type: "color",
    description: "Primary brand color",
  },
  {
    path: "color.brand.primary-600",
    label: "Brand Primary 600",
    type: "color",
    description: "Darker brand primary variant",
  },
  // Colors - Surface
  {
    path: "color.surface.1",
    label: "Surface 1",
    type: "color",
    description: "First surface level",
  },
  {
    path: "color.surface.2",
    label: "Surface 2",
    type: "color",
    description: "Second surface level",
  },
  // Colors - Accent
  {
    path: "color.accent.green",
    label: "Accent Green",
    type: "color",
    description: "Success/green accent color",
  },
  {
    path: "color.accent.red",
    label: "Accent Red",
    type: "color",
    description: "Error/red accent color",
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
    path: "radius.sm",
    label: "Radius Small",
    type: "number",
    unit: "px",
    description: "Small border radius",
  },
  {
    path: "radius.md",
    label: "Radius Medium",
    type: "number",
    unit: "px",
    description: "Medium border radius",
  },
  {
    path: "radius.lg",
    label: "Radius Large",
    type: "number",
    unit: "px",
    description: "Large border radius",
  },
  // Typography
  {
    path: "typography.size.xs",
    label: "Font Size XS",
    type: "number",
    unit: "px",
  },
  {
    path: "typography.size.intro",
    label: "Font Size Intro",
    type: "number",
    unit: "px",
  },
  {
    path: "typography.size.sm",
    label: "Font Size Small",
    type: "number",
    unit: "px",
  },
  {
    path: "typography.size.md",
    label: "Font Size Medium",
    type: "number",
    unit: "px",
  },
  {
    path: "typography.size.lg",
    label: "Font Size Large",
    type: "number",
    unit: "px",
  },
  {
    path: "typography.size.xl",
    label: "Font Size XL",
    type: "number",
    unit: "px",
  },
  {
    path: "typography.size.2xl",
    label: "Font Size 2XL",
    type: "number",
    unit: "px",
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
 */
export function tokensToCSS(tokens: Record<string, string | number>): Record<string, string> {
  const css: Record<string, string> = {};
  Object.entries(tokens).forEach(([path, value]) => {
    const varName = `--${path.replace(/\./g, "-")}`;
    css[varName] = String(value);
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

