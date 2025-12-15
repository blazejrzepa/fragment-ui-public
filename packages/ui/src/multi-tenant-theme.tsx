/**
 * Multi-Tenant Theme Provider
 * 
 * Supports multiple themes/brands in a single application
 * Perfect for SaaS applications and white-label solutions
 */

import * as React from "react";
import clsx from "clsx";

export type TenantId = string;
export type ThemeId = string;

export interface TenantTheme {
  tenantId: TenantId;
  themeId: ThemeId;
  theme: Record<string, any>;
  brand?: {
    logo?: string;
    name?: string;
    colors?: Record<string, string>;
    typography?: Record<string, any>;
  };
}

export interface MultiTenantThemeContextValue {
  currentTenant: TenantId | null;
  currentTheme: ThemeId | null;
  tenants: Map<TenantId, TenantTheme>;
  setTenant: (tenantId: TenantId) => void;
  setTheme: (tenantId: TenantId, themeId: ThemeId) => void;
  getTenantTheme: (tenantId: TenantId) => TenantTheme | undefined;
  registerTenant: (tenant: TenantTheme) => void;
  unregisterTenant: (tenantId: TenantId) => void;
}

const MultiTenantThemeContext = React.createContext<
  MultiTenantThemeContextValue | undefined
>(undefined);

export interface MultiTenantThemeProviderProps {
  children: React.ReactNode;
  defaultTenant?: TenantId;
  tenants?: TenantTheme[];
  onTenantChange?: (tenantId: TenantId) => void;
  onThemeChange?: (tenantId: TenantId, themeId: ThemeId) => void;
}

export function MultiTenantThemeProvider({
  children,
  defaultTenant,
  tenants: initialTenants = [],
  onTenantChange,
  onThemeChange,
}: MultiTenantThemeProviderProps) {
  const [currentTenant, setCurrentTenantState] = React.useState<TenantId | null>(
    defaultTenant || null
  );
  const [tenants, setTenants] = React.useState<Map<TenantId, TenantTheme>>(
    () => {
      const map = new Map();
      initialTenants.forEach((tenant) => {
        map.set(tenant.tenantId, tenant);
      });
      return map;
    }
  );

  const currentTheme = React.useMemo(() => {
    if (!currentTenant) return null;
    const tenant = tenants.get(currentTenant);
    return tenant?.themeId || null;
  }, [currentTenant, tenants]);

  const setTenant = React.useCallback(
    (tenantId: TenantId) => {
      if (!tenants.has(tenantId)) {
        console.warn(`Tenant "${tenantId}" not found`);
        return;
      }
      setCurrentTenantState(tenantId);
      onTenantChange?.(tenantId);
    },
    [tenants, onTenantChange]
  );

  const setTheme = React.useCallback(
    (tenantId: TenantId, themeId: ThemeId) => {
      const tenant = tenants.get(tenantId);
      if (!tenant) {
        console.warn(`Tenant "${tenantId}" not found`);
        return;
      }

      setTenants((prev) => {
        const next = new Map(prev);
        const updatedTenant = { ...tenant, themeId };
        next.set(tenantId, updatedTenant);
        return next;
      });

      onThemeChange?.(tenantId, themeId);
    },
    [tenants, onThemeChange]
  );

  const getTenantTheme = React.useCallback(
    (tenantId: TenantId) => {
      return tenants.get(tenantId);
    },
    [tenants]
  );

  const registerTenant = React.useCallback((tenant: TenantTheme) => {
    setTenants((prev) => {
      const next = new Map(prev);
      next.set(tenant.tenantId, tenant);
      return next;
    });
  }, []);

  const unregisterTenant = React.useCallback((tenantId: TenantId) => {
    setTenants((prev) => {
      const next = new Map(prev);
      next.delete(tenantId);
      return next;
    });
  }, []);

  // Apply theme to document
  React.useEffect(() => {
    if (!currentTenant) return;

    const tenant = tenants.get(currentTenant);
    if (!tenant) return;

    // Apply theme CSS variables
    const root = document.documentElement;
    Object.entries(tenant.theme).forEach(([key, value]) => {
      if (typeof value === "object") {
        Object.entries(value).forEach(([subKey, subValue]) => {
          root.style.setProperty(`--${key}-${subKey}`, String(subValue));
        });
      } else {
        root.style.setProperty(`--${key}`, String(value));
      }
    });

    // Apply tenant class
    root.setAttribute("data-tenant", currentTenant);
    root.setAttribute("data-theme", tenant.themeId);

    // Apply brand styles if available
    if (tenant.brand) {
      if (tenant.brand.logo) {
        root.style.setProperty("--brand-logo", `url(${tenant.brand.logo})`);
      }
      if (tenant.brand.name) {
        root.setAttribute("data-brand-name", tenant.brand.name);
      }
    }
  }, [currentTenant, tenants]);

  const value: MultiTenantThemeContextValue = {
    currentTenant,
    currentTheme,
    tenants,
    setTenant,
    setTheme,
    getTenantTheme,
    registerTenant,
    unregisterTenant,
  };

  return (
    <MultiTenantThemeContext.Provider value={value}>
      {children}
    </MultiTenantThemeContext.Provider>
  );
}

/**
 * Hook to access multi-tenant theme context
 */
export function useMultiTenantTheme() {
  const context = React.useContext(MultiTenantThemeContext);
  if (!context) {
    throw new Error(
      "useMultiTenantTheme must be used within MultiTenantThemeProvider"
    );
  }
  return context;
}

/**
 * Hook to get current tenant theme
 */
export function useCurrentTenantTheme() {
  const { currentTenant, getTenantTheme } = useMultiTenantTheme();
  return React.useMemo(() => {
    if (!currentTenant) return null;
    return getTenantTheme(currentTenant);
  }, [currentTenant, getTenantTheme]);
}

