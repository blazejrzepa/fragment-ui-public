# Enterprise Features Guide

Guide for using Fragment UI enterprise features: Multi-Tenant Support, Advanced Theming, and White-Label Options.

## Table of Contents

1. [Multi-Tenant Support](#multi-tenant-support)
2. [Advanced Theming System](#advanced-theming-system)
3. [White-Label Options](#white-label-options)
4. [Combining Features](#combining-features)

---

## Multi-Tenant Support

Multi-tenant support allows you to manage multiple themes/brands in a single application, perfect for SaaS applications and white-label solutions.

### Basic Usage

```tsx
import { MultiTenantThemeProvider, useMultiTenantTheme } from "@fragment_ui/ui/multi-tenant-theme";

function App() {
  const tenants = [
    {
      tenantId: "client-a",
      themeId: "brand-a",
      theme: {
        brand: { primary: "#0066cc" },
        colors: { background: "#ffffff" },
      },
      brand: {
        name: "Client A",
        logo: "/logos/client-a.svg",
      },
    },
    {
      tenantId: "client-b",
      themeId: "brand-b",
      theme: {
        brand: { primary: "#22c55e" },
        colors: { background: "#f5f5f5" },
      },
      brand: {
        name: "Client B",
        logo: "/logos/client-b.svg",
      },
    },
  ];

  return (
    <MultiTenantThemeProvider
      defaultTenant="client-a"
      tenants={tenants}
      onTenantChange={(tenantId) => {
        console.log("Switched to tenant:", tenantId);
      }}
    >
      <YourApp />
    </MultiTenantThemeProvider>
  );
}
```

### Switching Tenants

```tsx
import { useMultiTenantTheme } from "@fragment_ui/ui/multi-tenant-theme";

function TenantSwitcher() {
  const { currentTenant, setTenant, tenants } = useMultiTenantTheme();

  return (
    <Select
      value={currentTenant || ""}
      onValueChange={setTenant}
    >
      {Array.from(tenants.keys()).map((tenantId) => (
        <SelectItem key={tenantId} value={tenantId}>
          {tenants.get(tenantId)?.brand?.name || tenantId}
        </SelectItem>
      ))}
    </Select>
  );
}
```

### Dynamic Tenant Registration

```tsx
function App() {
  const { registerTenant, setTenant } = useMultiTenantTheme();

  useEffect(() => {
    // Load tenant from API
    fetchTenant("client-c").then((tenantData) => {
      registerTenant({
        tenantId: "client-c",
        themeId: "brand-c",
        theme: tenantData.theme,
        brand: tenantData.brand,
      });
      setTenant("client-c");
    });
  }, []);

  return <YourApp />;
}
```

---

## Advanced Theming System

Advanced theming provides dynamic token generation, theme composition, and runtime theme loading.

### Basic Usage

```tsx
import { AdvancedThemingProvider, useAdvancedTheming } from "@fragment_ui/ui/advanced-theming";

function App() {
  const themes = [
    {
      id: "custom-theme",
      name: "Custom Theme",
      variant: "light",
      tokens: [
        { name: "primary", value: "#0066cc", type: "color" },
        { name: "spacing-md", value: "16px", type: "spacing" },
      ],
    },
  ];

  return (
    <AdvancedThemingProvider defaultTheme="custom-theme" themes={themes}>
      <YourApp />
    </AdvancedThemingProvider>
  );
}
```

### Theme Composition

```tsx
import { useAdvancedTheming } from "@fragment_ui/ui/advanced-theming";

function ThemeComposer() {
  const { composeTheme, registerTheme, setTheme } = useAdvancedTheming();

  const handleCompose = () => {
    const composed = composeTheme({
      base: {
        primary: "#0066cc",
        spacing: { md: "16px" },
      },
      variants: {
        dark: {
          primary: "#4d9fff",
          background: "#0a0a0a",
        },
      },
      overrides: {
        primary: "#ff6600", // Override base
      },
    });

    registerTheme(composed);
    setTheme(composed.id);
  };

  return <Button onClick={handleCompose}>Compose Theme</Button>;
}
```

### Dynamic Token Generation

```tsx
function TokenGenerator() {
  const { generateTokens, registerTheme, setTheme } = useAdvancedTheming();

  const handleGenerate = () => {
    const baseTheme = {
      colors: {
        primary: "#0066cc",
        secondary: "#22c55e",
      },
      spacing: {
        sm: "8px",
        md: "16px",
        lg: "24px",
      },
    };

    const tokens = generateTokens(baseTheme);

    const theme = {
      id: "generated-theme",
      name: "Generated Theme",
      variant: "light",
      tokens,
    };

    registerTheme(theme);
    setTheme(theme.id);
  };

  return <Button onClick={handleGenerate}>Generate Theme</Button>;
}
```

### Runtime Theme Loading

```tsx
function ThemeLoader() {
  const { loadTheme } = useAdvancedTheming();

  const handleLoad = async () => {
    // Load from URL
    await loadTheme("/api/themes/custom-theme.json");

    // Or load from object
    await loadTheme({
      id: "loaded-theme",
      name: "Loaded Theme",
      variant: "light",
      tokens: [
        { name: "primary", value: "#0066cc", type: "color" },
      ],
    });
  };

  return <Button onClick={handleLoad}>Load Theme</Button>;
}
```

### Export Themes

```tsx
function ThemeExporter() {
  const { exportTheme, currentTheme } = useAdvancedTheming();

  const handleExport = () => {
    if (!currentTheme) return;

    // Export as CSS
    const css = exportTheme(currentTheme.id, "css");
    console.log(css);

    // Export as JavaScript
    const js = exportTheme(currentTheme.id, "js");
    console.log(js);

    // Export as JSON
    const json = exportTheme(currentTheme.id, "json");
    console.log(json);
  };

  return <Button onClick={handleExport}>Export Theme</Button>;
}
```

---

## White-Label Options

White-label options provide complete brand customization including logos, colors, typography, and metadata.

### Basic Usage

```tsx
import { WhiteLabelProvider, useWhiteLabel, BrandLogo } from "@fragment_ui/ui/white-label";

function App() {
  const brand = {
    logo: {
      light: "/logos/logo-light.svg",
      dark: "/logos/logo-dark.svg",
      favicon: "/favicon.ico",
      alt: "Company Logo",
    },
    colors: {
      primary: "#0066cc",
      secondary: "#22c55e",
    },
    typography: {
      fontFamily: "Inter, sans-serif",
      headingFont: "Poppins, sans-serif",
    },
    metadata: {
      name: "My Company",
      tagline: "Building amazing products",
      website: "https://example.com",
    },
  };

  return (
    <WhiteLabelProvider defaultBrand={brand}>
      <YourApp />
    </WhiteLabelProvider>
  );
}
```

### Using Brand Logo

```tsx
import { BrandLogo } from "@fragment_ui/ui/white-label";

function Header() {
  return (
    <header>
      <BrandLogo className="h-8" variant="auto" />
    </header>
  );
}
```

### Dynamic Brand Updates

```tsx
function BrandManager() {
  const { brand, setBrand, updateBrand } = useWhiteLabel();

  const handleUpdate = () => {
    updateBrand({
      colors: {
        primary: "#ff6600", // Update primary color
      },
    });
  };

  return (
    <div>
      <p>Current brand: {brand?.metadata?.name}</p>
      <Button onClick={handleUpdate}>Update Brand</Button>
    </div>
  );
}
```

---

## Combining Features

You can combine all enterprise features for maximum flexibility:

```tsx
import {
  MultiTenantThemeProvider,
  AdvancedThemingProvider,
  WhiteLabelProvider,
} from "@fragment_ui/ui";

function EnterpriseApp() {
  return (
    <MultiTenantThemeProvider
      defaultTenant="client-a"
      tenants={tenants}
    >
      <AdvancedThemingProvider
        defaultTheme="custom-theme"
        themes={themes}
      >
        <WhiteLabelProvider defaultBrand={brand}>
          <YourApp />
        </WhiteLabelProvider>
      </AdvancedThemingProvider>
    </MultiTenantThemeProvider>
  );
}
```

### Example: SaaS Application

```tsx
function SaaSApp() {
  const [tenant, setTenant] = useState("client-a");

  // Load tenant configuration
  const tenantConfig = useMemo(() => {
    return loadTenantConfig(tenant);
  }, [tenant]);

  return (
    <MultiTenantThemeProvider
      defaultTenant={tenant}
      tenants={[tenantConfig]}
      onTenantChange={setTenant}
    >
      <WhiteLabelProvider
        defaultBrand={tenantConfig.brand}
      >
        <AdvancedThemingProvider
          defaultTheme={tenantConfig.themeId}
          themes={tenantConfig.themes}
        >
          <AppContent />
        </AdvancedThemingProvider>
      </WhiteLabelProvider>
    </MultiTenantThemeProvider>
  );
}
```

---

## Best Practices

### 1. Lazy Load Tenant Configurations

```tsx
const tenantConfig = useMemo(() => {
  return lazyLoadTenantConfig(tenantId);
}, [tenantId]);
```

### 2. Cache Theme Data

```tsx
const themeCache = new Map();

function getTheme(themeId: string) {
  if (themeCache.has(themeId)) {
    return themeCache.get(themeId);
  }
  const theme = loadTheme(themeId);
  themeCache.set(themeId, theme);
  return theme;
}
```

### 3. Validate Theme Data

```tsx
function validateTheme(theme: AdvancedTheme): boolean {
  return (
    theme.id &&
    theme.name &&
    Array.isArray(theme.tokens) &&
    theme.tokens.every((token) => token.name && token.value)
  );
}
```

---

## Migration Guide

### From Basic Theming to Advanced Theming

1. Replace `ThemeProvider` with `AdvancedThemingProvider`
2. Convert theme objects to `AdvancedTheme` format
3. Update theme switching logic

### Adding Multi-Tenant Support

1. Wrap app with `MultiTenantThemeProvider`
2. Define tenant configurations
3. Implement tenant switching logic

---

*Last updated: 2025-01-05*

