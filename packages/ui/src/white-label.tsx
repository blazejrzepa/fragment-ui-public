/**
 * White-Label Branding System
 * 
 * Provides complete brand customization including:
 * - Logo replacement
 * - Custom color schemes
 * - Custom typography
 * - Brand asset management
 */

import * as React from "react";

export interface BrandAssets {
  logo?: {
    light?: string;
    dark?: string;
    favicon?: string;
    alt?: string;
  };
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    [key: string]: string | undefined;
  };
  typography?: {
    fontFamily?: string;
    headingFont?: string;
    bodyFont?: string;
  };
  metadata?: {
    name?: string;
    tagline?: string;
    website?: string;
    supportEmail?: string;
  };
}

export interface WhiteLabelContextValue {
  brand: BrandAssets | null;
  setBrand: (brand: BrandAssets) => void;
  updateBrand: (updates: Partial<BrandAssets>) => void;
  resetBrand: () => void;
}

const WhiteLabelContext = React.createContext<WhiteLabelContextValue | undefined>(
  undefined
);

export interface WhiteLabelProviderProps {
  children: React.ReactNode;
  defaultBrand?: BrandAssets;
  onBrandChange?: (brand: BrandAssets) => void;
}

export function WhiteLabelProvider({
  children,
  defaultBrand,
  onBrandChange,
}: WhiteLabelProviderProps) {
  const [brand, setBrandState] = React.useState<BrandAssets | null>(
    defaultBrand || null
  );

  const setBrand = React.useCallback(
    (newBrand: BrandAssets) => {
      setBrandState(newBrand);
      onBrandChange?.(newBrand);
    },
    [onBrandChange]
  );

  const updateBrand = React.useCallback(
    (updates: Partial<BrandAssets>) => {
      setBrandState((prev) => {
        const updated = { ...prev, ...updates };
        onBrandChange?.(updated as BrandAssets);
        return updated as BrandAssets;
      });
    },
    [onBrandChange]
  );

  const resetBrand = React.useCallback(() => {
    setBrandState(defaultBrand || null);
    if (defaultBrand) {
      onBrandChange?.(defaultBrand);
    }
  }, [defaultBrand, onBrandChange]);

  // Apply brand to document
  React.useEffect(() => {
    if (!brand) return;

    const root = document.documentElement;

    // Apply logo
    if (brand.logo) {
      if (brand.logo.light) {
        root.style.setProperty("--brand-logo-light", `url(${brand.logo.light})`);
      }
      if (brand.logo.dark) {
        root.style.setProperty("--brand-logo-dark", `url(${brand.logo.dark})`);
      }
      if (brand.logo.favicon) {
        const link =
          document.querySelector('link[rel="icon"]') ||
          document.createElement("link");
        link.setAttribute("rel", "icon");
        link.setAttribute("href", brand.logo.favicon);
        if (!document.querySelector('link[rel="icon"]')) {
          document.head.appendChild(link);
        }
      }
    }

    // Apply colors
    if (brand.colors) {
      Object.entries(brand.colors).forEach(([key, value]) => {
        if (value) {
          root.style.setProperty(`--brand-${key}`, value);
        }
      });
    }

    // Apply typography
    if (brand.typography) {
      if (brand.typography.fontFamily) {
        root.style.setProperty("--font-family", brand.typography.fontFamily);
      }
      if (brand.typography.headingFont) {
        root.style.setProperty("--font-heading", brand.typography.headingFont);
      }
      if (brand.typography.bodyFont) {
        root.style.setProperty("--font-body", brand.typography.bodyFont);
      }
    }

    // Apply metadata
    if (brand.metadata) {
      if (brand.metadata.name) {
        root.setAttribute("data-brand-name", brand.metadata.name);
        document.title = brand.metadata.name;
      }
      if (brand.metadata.tagline) {
        root.setAttribute("data-brand-tagline", brand.metadata.tagline);
      }
    }
  }, [brand]);

  const value: WhiteLabelContextValue = {
    brand,
    setBrand,
    updateBrand,
    resetBrand,
  };

  return (
    <WhiteLabelContext.Provider value={value}>
      {children}
    </WhiteLabelContext.Provider>
  );
}

/**
 * Hook to access white-label context
 */
export function useWhiteLabel() {
  const context = React.useContext(WhiteLabelContext);
  if (!context) {
    throw new Error("useWhiteLabel must be used within WhiteLabelProvider");
  }
  return context;
}

/**
 * Brand Logo Component
 */
export interface BrandLogoProps {
  className?: string;
  variant?: "light" | "dark" | "auto";
  alt?: string;
}

export function BrandLogo({
  className,
  variant = "auto",
  alt,
}: BrandLogoProps) {
  const { brand } = useWhiteLabel();

  if (!brand?.logo) {
    return null;
  }

  const logoSrc =
    variant === "auto"
      ? brand.logo.light || brand.logo.dark
      : variant === "light"
      ? brand.logo.light
      : brand.logo.dark;

  if (!logoSrc) {
    return null;
  }

  return (
    <img
      src={logoSrc}
      alt={alt || brand.logo.alt || brand.metadata?.name || "Logo"}
      className={className}
    />
  );
}

