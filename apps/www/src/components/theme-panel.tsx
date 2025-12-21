"use client";

import * as React from "react";
import {
  Button,
  ScrollArea,
  SegmentedControl,
} from "@fragment_ui/ui";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import clsx from "clsx";
import { Palette, Type, Square, Gauge, Sun, Moon, Copy, RotateCcw } from "lucide-react";
import {
  THEME_TOKENS,
  getDefaultTokenValues,
  tokensToCSS,
  applyThemeToDocument,
  resetTheme,
} from "../lib/theme-tokens";
import { ColorPicker } from "./theme-builder/color-picker";
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@fragment_ui/ui";
import { useTheme } from "../lib/theme";

const STORAGE_KEY = "fragment-ui-theme-customizations";

// Popular Google Fonts
const GOOGLE_FONTS = [
  "Geist",
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Source Sans Pro",
  "Poppins",
  "Raleway",
  "Nunito",
  "Ubuntu",
  "Playfair Display",
  "Merriweather",
  "Oswald",
  "Lora",
  "Roboto Slab",
  "Dancing Script",
  "Crimson Text",
  "PT Sans",
  "PT Serif",
  "Fira Sans",
  "Work Sans",
  "Libre Baskerville",
  "Cabin",
  "Noto Sans",
  "Noto Serif",
  "Bitter",
  "Quicksand",
  "Muli",
  "Titillium Web",
  "Arimo",
];

// Load Google Font dynamically
function loadGoogleFont(fontFamily: string) {
  if (typeof window === "undefined") return;
  
  // Geist is a system font, don't load from Google Fonts
  if (fontFamily === "Geist") {
    // Just set the CSS variable to use Geist with fallbacks (same as default)
    document.documentElement.style.setProperty("--typography-font-sans", "Geist, ui-sans-serif, system-ui, sans-serif");
    return;
  }
  
  const fontName = fontFamily.replace(/\s+/g, "+");
  const linkId = `google-font-${fontName}`;
  
  // Remove existing link if any
  const existingLink = document.getElementById(linkId);
  if (existingLink) {
    existingLink.remove();
  }
  
  // Create new link
  const link = document.createElement("link");
  link.id = linkId;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@300;400;500;600;700&display=swap`;
  document.head.appendChild(link);
  
  // Update CSS variable
  document.documentElement.style.setProperty("--typography-font-sans", `"${fontFamily}", sans-serif`);
}

interface ThemePanelProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ThemePanel({ open, onOpenChange }: ThemePanelProps) {
  const { theme, setTheme, effectiveTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  
  const [tokenValues, setTokenValues] = React.useState<Record<string, string | number>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return getDefaultTokenValues();
        }
      }
    }
    return getDefaultTokenValues();
  });

  // Handle mounting to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Helper function to calculate primary-600 variant (lighter/softer version for text on brand background)
  // In Tailwind scale, 600 is typically darker, but in our tokens primary-600 is lighter (like indigo-50)
  // We'll create a lighter, more muted version suitable for text on brand-primary backgrounds
  const calculatePrimary600 = React.useCallback((color: string): string => {
    // Remove # if present
    const hex = color.replace('#', '');
    if (hex.length !== 6) {
      return color; // Return original if invalid hex
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    
    // Create a lighter, more pastel version (mix with white ~90%)
    // This creates a very light tint suitable for text on brand backgrounds
    const lightR = Math.min(255, Math.floor(r * 0.1 + 255 * 0.9));
    const lightG = Math.min(255, Math.floor(g * 0.1 + 255 * 0.9));
    const lightB = Math.min(255, Math.floor(b * 0.1 + 255 * 0.9));
    
    return `#${lightR.toString(16).padStart(2, '0')}${lightG.toString(16).padStart(2, '0')}${lightB.toString(16).padStart(2, '0')}`;
  }, []);

  // Remove inline color styles when theme changes to allow CSS data-theme to take effect
  // But preserve brand-primary colors if they are customized
  React.useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      const root = document.documentElement;
      // Get all possible color token paths from THEME_TOKENS
      const allColorPaths = THEME_TOKENS.filter(token => token.path.startsWith("color.")).map(token => token.path);
      
      // Remove all color-related CSS variables from inline styles
      // This allows the data-theme attribute to control colors via CSS
      // BUT preserve brand-primary if it's customized
      const brandPrimaryValue = tokenValues["color.brand.primary"];
      allColorPaths.forEach(path => {
        // Convert token path to CSS variable name
        const varName = `--color-${path.replace(/^color\./, "").replace(/\./g, "-")}`;
        // Don't remove brand-primary colors if they are customized
        if (path === "color.brand.primary" && brandPrimaryValue) {
          return; // Skip removing brand-primary if it has a custom value
        }
        root.style.removeProperty(varName);
      });
      
      // If brand-primary is customized, reapply it and its 600 variant
      if (brandPrimaryValue) {
        const primaryColor = String(brandPrimaryValue);
        root.style.setProperty("--color-brand-primary", primaryColor);
        const primary600Variant = calculatePrimary600(primaryColor);
        root.style.setProperty("--color-brand-primary-600", primary600Variant);
      }
    }
  }, [theme, mounted, tokenValues, calculatePrimary600]);

  // Apply tokens to document on mount and when values change
  // Apply brand colors as inline styles for live preview, other colors are controlled by data-theme CSS
  React.useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      const css = tokensToCSS(tokenValues);
      const root = document.documentElement;
      
      // Apply brand primary color if it exists
      if (css["--color-brand-primary"]) {
        root.style.setProperty("--color-brand-primary", css["--color-brand-primary"]);
        
        // Calculate and apply primary-600 variant (lighter version)
        const primaryColor = css["--color-brand-primary"];
        const primary600Variant = calculatePrimary600(primaryColor);
        root.style.setProperty("--color-brand-primary-600", primary600Variant);
      }
      
      // Apply non-color and non-font tokens as inline styles
      // Other colors are controlled by data-theme CSS, fonts are handled by loadGoogleFont
      const nonColorNonFontCSS: Record<string, string> = {};
      Object.entries(css).forEach(([property, value]) => {
        // Skip brand-primary (already applied above), other colors, and font
        if (!property.startsWith("--color-") && property !== "--typography-font-sans") {
          nonColorNonFontCSS[property] = value;
        }
      });
      applyThemeToDocument(nonColorNonFontCSS);
    }
  }, [tokenValues, mounted, calculatePrimary600]);

  // Save to localStorage when values change
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tokenValues));
    }
  }, [tokenValues]);

  // Load Google Font when fontFamily changes
  React.useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      const fontFamily = tokenValues["typography.fontFamily"];
      if (fontFamily && typeof fontFamily === "string") {
        loadGoogleFont(fontFamily);
      }
    }
  }, [tokenValues["typography.fontFamily"], mounted]);

  const handleTokenChange = (path: string, value: string | number) => {
    setTokenValues((prev) => ({
      ...prev,
      [path]: value,
    }));
  };

  const handleCopyTheme = async () => {
    try {
      const themeData = {
        theme: effectiveTheme,
        tokens: tokenValues,
      };
      const jsonString = JSON.stringify(themeData, null, 2);
      await navigator.clipboard.writeText(jsonString);
      // Optional: Show a toast notification
      console.log("Theme copied to clipboard");
    } catch (err) {
      console.error("Failed to copy theme:", err);
    }
  };

  const handleReset = () => {
    // Reset theme to system (default)
    setTheme("system");
    
    // Reset token values to defaults
    const defaults = getDefaultTokenValues();
    setTokenValues(defaults);
    
    // Remove all inline styles for tokens to allow CSS data-theme to take control
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      const allTokenPaths = Object.keys(defaults);
      
      // Remove all inline styles for our custom tokens
      allTokenPaths.forEach(path => {
        // Special handling for radius.base - remove all radius tokens (sm, md, lg)
        if (path === "radius.base") {
          root.style.removeProperty("--radius-sm");
          root.style.removeProperty("--radius-md");
          root.style.removeProperty("--radius-lg");
          return;
        }
        
        let varName: string;
        if (path.startsWith("color.")) {
          // Only remove brand-primary colors that we customize
          // Other color tokens are controlled by CSS data-theme and shouldn't be removed
          if (path === "color.brand.primary") {
            varName = `--color-${path.replace(/^color\./, "").replace(/\./g, "-")}`;
            root.style.removeProperty(varName);
            // Also remove primary-600 variant
            root.style.removeProperty("--color-brand-primary-600");
          }
          // Skip other color paths (they shouldn't be in THEME_TOKENS anyway)
          return;
        } else if (path.startsWith("space.")) {
          varName = `--space-${path.replace(/^space\./, "")}`;
        } else if (path.startsWith("radius.")) {
          varName = `--radius-${path.replace(/^radius\./, "")}`;
        } else if (path.startsWith("typography.")) {
          // Special handling for fontFamily - map to --typography-font-sans
          if (path === "typography.fontFamily") {
            varName = "--typography-font-sans";
          } else {
            varName = `--typography-${path.replace(/^typography\./, "").replace(/\./g, "-")}`;
          }
        } else if (path === "iconLibrary") {
          varName = "--icon-library";
        } else {
          varName = `--${path.replace(/\./g, "-")}`;
        }
        root.style.removeProperty(varName);
      });
      
      // After removing inline styles, restore default font (Geist) if it was reset
      const defaultFontFamily = defaults["typography.fontFamily"];
      if (defaultFontFamily) {
        loadGoogleFont(String(defaultFontFamily));
      }
      
      // Clear localStorage customizations
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const groupedTokens = React.useMemo(() => {
    const groups: Record<string, typeof THEME_TOKENS> = {};
    THEME_TOKENS.forEach((token) => {
      const category = token.path.split(".")[0];
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(token);
    });
    return groups;
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "color":
        return <Palette className="h-4 w-4" />;
      case "space":
        return <Gauge className="h-4 w-4" />;
      case "radius":
        return <Square className="h-4 w-4" />;
      case "typography":
        return <Type className="h-4 w-4" />;
      case "iconLibrary":
        return <Square className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
                className={clsx(
                  "theme-editor-panel fixed z-50 w-[320px] sm:w-[360px] flex flex-col border rounded-lg shadow-xl",
                  "top-4 right-4 bottom-auto left-auto",
                  "bg-[color:var(--color-bg-base)] border-[color:var(--color-border-base)]",
                  "data-[state=open]:animate-in data-[state=closed]:animate-out",
                  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                  "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                  "data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2",
                  "p-0"
                )}
                style={{ 
                  maxHeight: "calc(100vh - 2rem)",
                  height: "auto",
                  left: "auto",
                  top: "4rem",
                  right: "1rem",
                  transform: "none",
                }}
        >
          <div className="flex-shrink-0 px-[var(--space-6)] py-[var(--space-4)] border-b border-[color:var(--color-border-base)]">
            <div className="flex items-center justify-between">
              <div>
                <DialogPrimitive.Title className="text-[length:var(--typography-size-lg)]" style={{ fontWeight: "var(--typography-weight-semibold, 600)" }}>
                  Theme Editor
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="text-[length:var(--typography-size-sm)] text-[color:var(--color-fg-muted)] mt-[var(--space-1)]">
                  Customize design tokens live on the page
                </DialogPrimitive.Description>
              </div>
            </div>
          </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="space-y-[var(--space-6)] px-[var(--space-6)] py-[var(--space-6)]">
            {/* Appearance Section */}
            {mounted && (
              <div className="space-y-[var(--space-4)]">
                <div className="flex items-center gap-[var(--space-2)]">
                  {effectiveTheme === "dark" ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                  <h3 className="text-[length:var(--typography-size-sm)]" style={{ fontWeight: "var(--typography-weight-semibold, 600)" }}>
                    Appearance
                  </h3>
                </div>
                <div className="w-full">
                  <SegmentedControl
                    value={effectiveTheme}
                    onChange={(value) => setTheme(value as "light" | "dark")}
                    options={[
                      {
                        value: "light",
                        label: "Light",
                        icon: <Sun className="h-4 w-4" />,
                      },
                      {
                        value: "dark",
                        label: "Dark",
                        icon: <Moon className="h-4 w-4" />,
                      },
                    ]}
                    variant="default"
                    size="sm"
                    className="w-full"
                  />
                </div>
              </div>
            )}
            
            {Object.entries(groupedTokens).filter(([category]) => category !== "space").map(([category, tokens]) => (
              <div key={category} className={category === "radius" ? "space-y-[var(--space-3)]" : "space-y-[var(--space-4)]"} style={category === "radius" ? { marginTop: "16px" } : undefined}>
                <div className="flex items-center gap-[var(--space-2)]">
                  {getCategoryIcon(category)}
                  <h3 className="text-[length:var(--typography-size-sm)] capitalize" style={{ fontWeight: "var(--typography-weight-semibold, 600)" }}>
                    {category === "color" ? "Colors" : category === "space" ? "Spacing" : category === "radius" ? "Radius" : category === "typography" ? "Typography" : category === "iconLibrary" ? "Icons" : category}
                  </h3>
                </div>
                <div className="space-y-[var(--space-4)]">
                  {tokens.map((token) => {
                    const currentValue = tokenValues[token.path] ?? "";

                    if (token.type === "color") {
                      return (
                        <ColorPicker
                          key={token.path}
                          value={String(currentValue)}
                          onChange={(value) => handleTokenChange(token.path, value)}
                        />
                      );
                    }

                    // Special handling for fontFamily - use Select dropdown
                    if (token.path === "typography.fontFamily") {
                      return (
                        <div key={token.path} className="space-y-[var(--space-2)]">
                          <Select
                            value={String(currentValue || "Geist")}
                            onValueChange={(value) => {
                              handleTokenChange(token.path, value);
                              loadGoogleFont(value);
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a font" />
                            </SelectTrigger>
                            <SelectContent>
                              {GOOGLE_FONTS.map((font) => (
                                <SelectItem key={font} value={font}>
                                  <span style={{ fontFamily: `"${font}", sans-serif` }}>{font}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    }

                    // Special handling for iconLibrary - use Select dropdown
                    if (token.path === "iconLibrary") {
                      const iconLibraryOptions = [
                        { value: "lucide", label: "Lucide Icons" },
                        { value: "tabler", label: "Tabler Icons" },
                        { value: "hugeicons", label: "HugeIcons" },
                        { value: "phosphor", label: "Phosphor Icons" },
                      ];
                      return (
                        <div key={token.path} className="space-y-[var(--space-2)]">
                          <Select
                            value={String(currentValue || "lucide")}
                            onValueChange={(value) => {
                              handleTokenChange(token.path, value);
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select icon library" />
                            </SelectTrigger>
                            <SelectContent>
                              {iconLibraryOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    }

                    // Special handling for radius.base - use Select dropdown
                    if (token.path === "radius.base") {
                      const radiusOptions = [
                        { value: "none", label: "None" },
                        { value: "small", label: "Small" },
                        { value: "medium", label: "Medium" },
                        { value: "large", label: "Large" },
                      ];
                      return (
                        <div key={token.path} className="space-y-[var(--space-2)]" style={{ paddingTop: "8px" }}>
                          <Select
                            value={String(currentValue || "medium")}
                            onValueChange={(value) => {
                              handleTokenChange(token.path, value);
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select radius" />
                            </SelectTrigger>
                            <SelectContent>
                              {radiusOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    }

                    return (
                      <div key={token.path} className="space-y-[var(--space-2)]">
                        <label className="text-[length:var(--typography-size-sm)]" style={{ fontWeight: "var(--typography-weight-medium, 500)" }}>
                          {token.label}
                        </label>
                        <div className="flex gap-[var(--space-2)] items-center">
                          <Input
                            type={token.type === "number" ? "number" : "text"}
                            value={currentValue}
                            onChange={(e) => {
                              const value =
                                token.type === "number"
                                  ? Number(e.target.value)
                                  : e.target.value;
                              handleTokenChange(token.path, value);
                            }}
                            placeholder={token.description}
                            className="flex-1 font-mono text-[length:var(--typography-size-sm)]"
                          />
                          {token.unit && (
                            <span className="text-[length:var(--typography-size-sm)] text-[color:var(--color-fg-muted)] min-w-[2rem]">
                              {token.unit}
                            </span>
                          )}
                        </div>
                        {token.description && (
                          <p className="text-[length:var(--typography-size-xs)] text-[color:var(--color-fg-muted)]">
                            {token.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {/* Footer with action buttons */}
        <div className="flex-shrink-0 px-[var(--space-6)] py-[var(--space-4)] border-t border-[color:var(--color-border-base)] flex items-center gap-[var(--space-2)]">
          <Button
            variant="solid"
            size="sm"
            onClick={handleCopyTheme}
            className="flex-1 flex items-center justify-center gap-[var(--space-2)]"
          >
            <Copy className="h-4 w-4" />
            Copy Theme
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex-1 flex items-center justify-center gap-[var(--space-2)]"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
        
        <DialogPrimitive.Close className="absolute right-[var(--space-4)] top-[var(--space-4)] rounded-[var(--radius-sm)] opacity-70 ring-offset-[color:var(--color-surface-1)] transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-brand-primary)] focus:ring-offset-2 disabled:pointer-events-none">
          ✕
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

