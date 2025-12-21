/**
 * Import Planner
 * 
 * Determines optimal imports based on registry and component usage.
 * Prefers blocks over components when available.
 */

export interface ComponentInfo {
  name: string;
  package: "@fragment_ui/ui" | "@fragment_ui/blocks";
  importPath?: string;
}

export interface ImportPlan {
  uiImports: Set<string>;
  blockImports: Set<string>;
  allComponents: ComponentInfo[];
}

/**
 * Section kind to block mapping (preferred blocks)
 */
const SECTION_TO_BLOCK_MAP: Record<string, string> = {
  hero: "HeroSection",
  pricing: "PricingTable",
  featureGrid: "FeatureGridSection",
  stats: "StatsSection",
  testimonials: "TestimonialsSection",
  faq: "FAQSection",
  cta: "CTASection",
  dataTable: "DataTable",
};

/**
 * Component to block alternatives (when block is preferred)
 */
const COMPONENT_TO_BLOCK_ALTERNATIVES: Record<string, string[]> = {
  // Dashboard components can use blocks
  MetricCard: ["MetricCard"], // Keep as UI component, but can be used in DashboardWidgets
  ActivityFeed: ["ActivityFeed"], // Keep as UI component
  QuickActions: ["QuickActions"], // Keep as UI component
  FilterBar: ["FilterBar"], // Keep as UI component
  Chart: ["Chart"], // Keep as UI component
};

/**
 * Block components that should always come from @fragment_ui/blocks
 */
const BLOCK_COMPONENTS = new Set([
  "HeroSection",
  "PricingTable",
  "FeatureGridSection",
  "StatsSection",
  "TestimonialsSection",
  "FAQSection",
  "CTASection",
  "DataTable",
  "DashboardLayout",
  "DashboardWidgets",
  "WidgetContainer",
  "CardGrid",
  "AuthenticationBlock",
  "NavigationHeader",
  "SettingsScreen",
]);

/**
 * Plan imports based on registry and component usage
 */
export function planImports(
  componentNames: Set<string>,
  registry: any
): ImportPlan {
  const uiImports = new Set<string>();
  const blockImports = new Set<string>();
  const allComponents: ComponentInfo[] = [];

  componentNames.forEach((componentName) => {
    // Check if it's a known block component
    if (BLOCK_COMPONENTS.has(componentName)) {
      blockImports.add(componentName);
      allComponents.push({
        name: componentName,
        package: "@fragment_ui/blocks",
      });
      return;
    }

    // Check registry for component info
    // Try exact match first, then kebab-case (registry uses kebab-case keys)
    let componentInfo = registry?.components?.[componentName];
    if (!componentInfo) {
      // Try kebab-case version (e.g., "MetricCard" -> "metric-card")
      const kebabCase = componentName
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase()
        .replace(/^-/, "");
      componentInfo = registry?.components?.[kebabCase];
    }
    
    if (componentInfo) {
      const importPath = componentInfo.import;
      if (importPath?.includes("@fragment_ui/blocks")) {
        blockImports.add(componentName);
        allComponents.push({
          name: componentName,
          package: "@fragment_ui/blocks",
          importPath,
        });
      } else {
        uiImports.add(componentName);
        allComponents.push({
          name: componentName,
          package: "@fragment_ui/ui",
          importPath,
        });
      }
    } else {
      // Default to @fragment_ui/ui if not in registry
      uiImports.add(componentName);
      allComponents.push({
        name: componentName,
        package: "@fragment_ui/ui",
      });
    }
  });

  // Add Card sub-components if Card is used
  if (uiImports.has("Card") || componentNames.has("Card")) {
    uiImports.add("CardHeader");
    uiImports.add("CardTitle");
    uiImports.add("CardContent");
    uiImports.add("CardDescription");
    uiImports.add("CardFooter");
  }

  return {
    uiImports,
    blockImports,
    allComponents,
  };
}

/**
 * Get block component for section kind
 */
export function getBlockForSectionKind(kind: string): string | null {
  return SECTION_TO_BLOCK_MAP[kind] || null;
}

/**
 * Check if component should use block alternative
 */
export function getBlockAlternative(componentName: string): string[] | null {
  return COMPONENT_TO_BLOCK_ALTERNATIVES[componentName] || null;
}

/**
 * Generate import statements from plan
 */
export function generateImportStatements(plan: ImportPlan): string {
  const importLines: string[] = [];

  if (plan.uiImports.size > 0) {
    const sortedImports = Array.from(plan.uiImports).sort();
    importLines.push(
      `import { ${sortedImports.join(", ")} } from "@fragment_ui/ui";`
    );
  }

  if (plan.blockImports.size > 0) {
    const sortedImports = Array.from(plan.blockImports).sort();
    importLines.push(
      `import { ${sortedImports.join(", ")} } from "@fragment_ui/blocks";`
    );
  }

  importLines.push('import * as React from "react";');

  return importLines.join("\n");
}

