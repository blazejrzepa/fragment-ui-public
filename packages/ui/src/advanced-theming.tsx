/**
 * Advanced Theming System
 * 
 * Provides advanced theming capabilities including:
 * - Dynamic token generation
 * - Theme composition
 * - Theme variants
 * - Runtime theme loading
 */

import * as React from "react";

export type ThemeVariant = "light" | "dark" | "high-contrast" | string;
export type ThemeFormat = "css" | "js" | "json";

export interface ThemeToken {
  name: string;
  value: string | number;
  type: "color" | "spacing" | "typography" | "shadow" | "border" | "other";
  description?: string;
}

export interface ThemeComposition {
  base: Record<string, any>;
  variants?: Record<ThemeVariant, Record<string, any>>;
  overrides?: Record<string, any>;
}

export interface AdvancedTheme {
  id: string;
  name: string;
  variant: ThemeVariant;
  tokens: ThemeToken[];
  composition?: ThemeComposition;
  metadata?: {
    author?: string;
    version?: string;
    description?: string;
  };
}

export interface AdvancedThemingContextValue {
  themes: Map<string, AdvancedTheme>;
  currentTheme: AdvancedTheme | null;
  setTheme: (themeId: string) => void;
  registerTheme: (theme: AdvancedTheme) => void;
  unregisterTheme: (themeId: string) => void;
  composeTheme: (composition: ThemeComposition) => AdvancedTheme;
  generateTokens: (baseTheme: Record<string, any>) => ThemeToken[];
  exportTheme: (themeId: string, format: ThemeFormat) => string;
  loadTheme: (themeData: AdvancedTheme | string) => Promise<void>;
}

const AdvancedThemingContext = React.createContext<
  AdvancedThemingContextValue | undefined
>(undefined);

export interface AdvancedThemingProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  themes?: AdvancedTheme[];
  onThemeChange?: (theme: AdvancedTheme) => void;
}

export function AdvancedThemingProvider({
  children,
  defaultTheme,
  themes: initialThemes = [],
  onThemeChange,
}: AdvancedThemingProviderProps) {
  const [themes, setThemes] = React.useState<Map<string, AdvancedTheme>>(() => {
    const map = new Map();
    initialThemes.forEach((theme) => {
      map.set(theme.id, theme);
    });
    return map;
  });

  const [currentThemeId, setCurrentThemeId] = React.useState<string | null>(
    defaultTheme || null
  );

  const currentTheme = React.useMemo(() => {
    if (!currentThemeId) return null;
    return themes.get(currentThemeId) || null;
  }, [currentThemeId, themes]);

  const setTheme = React.useCallback(
    (themeId: string) => {
      if (!themes.has(themeId)) {
        console.warn(`Theme "${themeId}" not found`);
        return;
      }
      setCurrentThemeId(themeId);
      const theme = themes.get(themeId);
      if (theme) {
        onThemeChange?.(theme);
      }
    },
    [themes, onThemeChange]
  );

  const registerTheme = React.useCallback((theme: AdvancedTheme) => {
    setThemes((prev) => {
      const next = new Map(prev);
      next.set(theme.id, theme);
      return next;
    });
  }, []);

  const unregisterTheme = React.useCallback((themeId: string) => {
    setThemes((prev) => {
      const next = new Map(prev);
      next.delete(themeId);
      return next;
    });
  }, []);

  const composeTheme = React.useCallback(
    (composition: ThemeComposition): AdvancedTheme => {
      let composed = { ...composition.base };

      // Apply variant if specified
      if (composition.variants && currentTheme?.variant) {
        const variantOverrides = composition.variants[currentTheme.variant];
        if (variantOverrides) {
          composed = { ...composed, ...variantOverrides };
        }
      }

      // Apply overrides
      if (composition.overrides) {
        composed = { ...composed, ...composition.overrides };
      }

      return {
        id: `composed-${Date.now()}`,
        name: "Composed Theme",
        variant: currentTheme?.variant || "light",
        tokens: generateTokensFromObject(composed),
        composition,
      };
    },
    [currentTheme]
  );

  const generateTokens = React.useCallback(
    (baseTheme: Record<string, any>): ThemeToken[] => {
      return generateTokensFromObject(baseTheme);
    },
    []
  );

  const exportTheme = React.useCallback(
    (themeId: string, format: ThemeFormat): string => {
      const theme = themes.get(themeId);
      if (!theme) {
        throw new Error(`Theme "${themeId}" not found`);
      }

      switch (format) {
        case "css":
          return exportAsCSS(theme);
        case "js":
          return exportAsJS(theme);
        case "json":
          return JSON.stringify(theme, null, 2);
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
    },
    [themes]
  );

  const loadTheme = React.useCallback(
    async (themeData: AdvancedTheme | string): Promise<void> => {
      let theme: AdvancedTheme;

      if (typeof themeData === "string") {
        // Load from URL or file
        const response = await fetch(themeData);
        theme = await response.json();
      } else {
        theme = themeData;
      }

      registerTheme(theme);
      setTheme(theme.id);
    },
    [registerTheme, setTheme]
  );

  // Apply theme to document
  React.useEffect(() => {
    if (!currentTheme) return;

    const root = document.documentElement;
    currentTheme.tokens.forEach((token) => {
      root.style.setProperty(`--${token.name}`, String(token.value));
    });

    root.setAttribute("data-theme", currentTheme.id);
    root.setAttribute("data-theme-variant", currentTheme.variant);
  }, [currentTheme]);

  const value: AdvancedThemingContextValue = {
    themes,
    currentTheme,
    setTheme,
    registerTheme,
    unregisterTheme,
    composeTheme,
    generateTokens,
    exportTheme,
    loadTheme,
  };

  return (
    <AdvancedThemingContext.Provider value={value}>
      {children}
    </AdvancedThemingContext.Provider>
  );
}

/**
 * Hook to access advanced theming context
 */
export function useAdvancedTheming() {
  const context = React.useContext(AdvancedThemingContext);
  if (!context) {
    throw new Error(
      "useAdvancedTheming must be used within AdvancedThemingProvider"
    );
  }
  return context;
}

// Helper functions

function generateTokensFromObject(obj: Record<string, any>): ThemeToken[] {
  const tokens: ThemeToken[] = [];

  function traverse(
    obj: Record<string, any>,
    prefix: string = "",
    type: ThemeToken["type"] = "other"
  ) {
    Object.entries(obj).forEach(([key, value]) => {
      const name = prefix ? `${prefix}-${key}` : key;

      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        // Determine type from key
        const newType: ThemeToken["type"] =
          key.includes("color") || key.includes("Color")
            ? "color"
            : key.includes("spacing") || key.includes("Spacing")
            ? "spacing"
            : key.includes("font") || key.includes("typography")
            ? "typography"
            : key.includes("shadow")
            ? "shadow"
            : key.includes("border")
            ? "border"
            : type;

        traverse(value, name, newType);
      } else {
        tokens.push({
          name,
          value: String(value),
          type,
        });
      }
    });
  }

  traverse(obj);
  return tokens;
}

function exportAsCSS(theme: AdvancedTheme): string {
  const lines: string[] = [":root {"];
  theme.tokens.forEach((token) => {
    lines.push(`  --${token.name}: ${token.value};`);
  });
  lines.push("}");
  return lines.join("\n");
}

function exportAsJS(theme: AdvancedTheme): string {
  const obj: Record<string, string> = {};
  theme.tokens.forEach((token) => {
    obj[token.name] = String(token.value);
  });
  return `export const theme = ${JSON.stringify(obj, null, 2)};`;
}

