"use client";

import { useState, useEffect, useMemo } from "react";
import type { EnhancedComponentInfo } from "../types";

/**
 * Hook to access component registry
 * 
 * This hook provides a unified way to access component registry data
 * across all apps (www and demo).
 */
export interface UseComponentRegistryOptions {
  registryUrl?: string;
  initialRegistry?: any;
}

export interface UseComponentRegistryReturn {
  registry: any | null;
  loading: boolean;
  error: Error | null;
  getComponent: (name: string) => Partial<EnhancedComponentInfo> | null;
  getAllComponents: () => Array<{ name: string; info: Partial<EnhancedComponentInfo> }>;
  getComponentsByPackage: (pkg: "@fragment_ui/ui" | "@fragment_ui/blocks") => Array<{ name: string; info: Partial<EnhancedComponentInfo> }>;
}

export function useComponentRegistry(
  options: UseComponentRegistryOptions = {}
): UseComponentRegistryReturn {
  const { registryUrl = "/api/registry", initialRegistry } = options;
  const [registry, setRegistry] = useState<any | null>(initialRegistry || null);
  const [loading, setLoading] = useState(!initialRegistry);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (initialRegistry) {
      setRegistry(initialRegistry);
      setLoading(false);
      return;
    }

    // Fetch registry from API
    const fetchRegistry = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(registryUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch registry: ${response.statusText}`);
        }
        const data = await response.json();
        setRegistry(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        // Set empty registry on error
        setRegistry({ components: {}, version: "1.0.0" });
      } finally {
        setLoading(false);
      }
    };

    fetchRegistry();
  }, [registryUrl, initialRegistry]);

  const getComponent = useMemo(() => {
    return (name: string): Partial<EnhancedComponentInfo> | null => {
      if (!registry?.components) {
        return null;
      }

      // Check if it's an alias
      const actualName = registry.aliases?.[name] || name;
      const component = registry.components[actualName];

      if (!component) {
        return null;
      }

      // Determine package
      const packageName = (!actualName.includes("-") || 
        ["scroll-area", "aspect-ratio", "data-table", "form-field"].includes(actualName))
        ? "@fragment_ui/ui"
        : "@fragment_ui/blocks";

      return {
        name: actualName,
        import: component.import || actualName,
        package: packageName,
        note: component.note,
        description: component.description,
        examples: component.examples,
        variants: component.variants,
        features: component.features,
        accessibility: component.a11y ? {
          role: component.a11y.role,
          notes: component.a11y.notes,
          wcag: component.a11y.wcag,
        } : undefined,
        props: component.props,
        slots: component.slots,
        related: component.related,
        stability: component.stability,
        deprecationVersion: component.deprecationVersion,
        deprecationRemovalVersion: component.deprecationRemovalVersion,
      };
    };
  }, [registry]);

  const getAllComponents = useMemo(() => {
    return (): Array<{ name: string; info: Partial<EnhancedComponentInfo> }> => {
      if (!registry?.components) {
        return [];
      }

      return Object.keys(registry.components)
        .filter(name => {
          // Filter out aliases and subcomponents
          if (registry.aliases?.[name]) {
            return false;
          }
          return true;
        })
        .map(name => ({
          name,
          info: getComponent(name) || {},
        }));
    };
  }, [registry, getComponent]);

  const getComponentsByPackage = useMemo(() => {
    return (pkg: "@fragment_ui/ui" | "@fragment_ui/blocks"): Array<{ name: string; info: Partial<EnhancedComponentInfo> }> => {
      return getAllComponents().filter(({ info }) => info.package === pkg);
    };
  }, [getAllComponents]);

  return {
    registry,
    loading,
    error,
    getComponent,
    getAllComponents,
    getComponentsByPackage,
  };
}

