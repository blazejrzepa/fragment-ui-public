/**
 * Variant Scorer for UI-DSL v2
 * 
 * Scores variants based on:
 * - Clarity: How clear and readable the layout is
 * - Hierarchy: Information hierarchy and visual flow
 * - A11y: Accessibility compliance
 * - Token Compliance: Adherence to design tokens
 */

import type { UiPage, UiNode, UiComponent, UiSection, UiGrid } from "@fragment_ui/ui-dsl";
import { validatePage } from "@fragment_ui/ui-dsl";

/**
 * Scoring criteria
 */
export type ScoringCriteria = "clarity" | "hierarchy" | "a11y" | "tokenCompliance";

/**
 * Variant score result
 */
export interface VariantScore {
  idx: number;
  score: number; // 0-100
  breakdown: {
    clarity: number;
    hierarchy: number;
    a11y: number;
    tokenCompliance: number;
  };
  notes: string[];
}

/**
 * Score a variant
 */
export function scoreVariant(
  variant: UiPage,
  idx: number,
  criteria?: ScoringCriteria[]
): VariantScore {
  const allCriteria: ScoringCriteria[] = criteria || ["clarity", "hierarchy", "a11y", "tokenCompliance"];
  
  const clarity = allCriteria.includes("clarity") ? scoreClarity(variant) : 50;
  const hierarchy = allCriteria.includes("hierarchy") ? scoreHierarchy(variant) : 50;
  const a11y = allCriteria.includes("a11y") ? scoreA11y(variant) : 50;
  const tokenCompliance = allCriteria.includes("tokenCompliance") ? scoreTokenCompliance(variant) : 50;
  
  const overallScore = (clarity + hierarchy + a11y + tokenCompliance) / 4;
  
  const notes: string[] = [];
  
  // Generate notes based on scores
  if (clarity < 60) {
    notes.push("Layout could be clearer - consider simplifying structure");
  }
  if (hierarchy < 60) {
    notes.push("Information hierarchy needs improvement - add visual emphasis");
  }
  if (a11y < 60) {
    notes.push("Accessibility issues detected - add ARIA labels and roles");
  }
  if (tokenCompliance < 60) {
    notes.push("Token compliance issues - check spacing, colors, and sizes");
  }
  
  // Validation notes
  try {
    const validation = validatePage(variant);
    if (!validation.valid) {
      const errorCount = validation.diagnostics?.filter((d) => d.level === "error").length || 0;
      if (errorCount > 0) {
        notes.push(`Validation issues: ${errorCount} errors found`);
      }
    }
  } catch (error) {
    notes.push("Validation failed - check DSL structure");
  }
  
  return {
    idx,
    score: Math.round(overallScore),
    breakdown: {
      clarity: Math.round(clarity),
      hierarchy: Math.round(hierarchy),
      a11y: Math.round(a11y),
      tokenCompliance: Math.round(tokenCompliance),
    },
    notes,
  };
}

/**
 * Score clarity (layout readability)
 */
function scoreClarity(page: UiPage): number {
  let score = 50; // Base score
  
  // Check for clear section structure
  const sections = page.children.filter((c) => c.type === "section");
  
  // Bonus for dashboards with proper structure (metrics + data)
  const isDashboard = page.title?.toLowerCase().includes("dashboard") || 
                      page.description?.toLowerCase().includes("dashboard") ||
                      sections.some(s => s.type === "section" && 
                        (s.title?.toLowerCase().includes("metric") || 
                         s.title?.toLowerCase().includes("data")));
  
  if (isDashboard && sections.length >= 2) {
    score += 20; // Dashboard with multiple sections is clearer
  }
  if (sections.length > 0 && sections.length <= 5) {
    score += 10; // Good number of sections
  } else if (sections.length > 5) {
    score -= 10; // Too many sections
  }
  
  // Check for grid usage (good for clarity)
  const grids = page.children.filter((c) => c.type === "grid");
  if (grids.length > 0) {
    score += 5; // Grids help with clarity
  }
  
  // Check for component density (too many components = less clear)
  const totalComponents = countComponents(page);
  if (totalComponents > 20) {
    score -= 15; // Too many components
  } else if (totalComponents > 10) {
    score -= 5; // Many components
  } else if (totalComponents > 0) {
    score += 10; // Good component count
  }
  
  // Check for titles and descriptions (help clarity)
  if (page.title) {
    score += 5;
  }
  if (page.description) {
    score += 5;
  }
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Score hierarchy (information flow)
 */
function scoreHierarchy(page: UiPage): number {
  let score = 50; // Base score
  
  // Check for section titles (help hierarchy)
  const sections = page.children.filter((c) => c.type === "section") as UiSection[];
  const sectionsWithTitles = sections.filter((s) => s.title).length;
  if (sectionsWithTitles > 0) {
    score += (sectionsWithTitles / sections.length) * 20; // Up to +20 for all sections having titles
  }
  
  // Check for hero sections (strong hierarchy)
  const heroSections = sections.filter((s) => s.variant === "hero");
  if (heroSections.length > 0) {
    score += 10;
  }
  
  // Check for card sections (good for hierarchy)
  const cardSections = sections.filter((s) => s.variant === "card");
  if (cardSections.length > 0) {
    score += 5;
  }
  
  // Check for layout structure (grids help hierarchy)
  const grids = page.children.filter((c) => c.type === "grid") as UiGrid[];
  if (grids.length > 0) {
    score += 5;
  }
  
  // Bonus for dashboards with metrics grid (proper hierarchy)
  const hasMetricsGrid = page.children.some((c) => {
    if (c.type === "section") {
      return c.children.some((child) => child.type === "grid" && 
        child.children.some((gc: any) => gc.component === "Card"));
    }
    return false;
  });
  
  if (hasMetricsGrid) {
    score += 15; // Metrics grid shows good hierarchy
  }
  
  // Check component order (buttons at end = good hierarchy)
  const components = getAllComponents(page);
  const buttons = components.filter((c) => c.component === "Button" || c.component === "ButtonGroup");
  if (buttons.length > 0) {
    // Check if buttons are near the end
    const lastComponent = components[components.length - 1];
    if (lastComponent && (lastComponent.component === "Button" || lastComponent.component === "ButtonGroup")) {
      score += 5; // Buttons at end = good flow
    }
  }
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Score accessibility
 */
function scoreA11y(page: UiPage): number {
  let score = 50; // Base score
  
  // Check for ARIA labels
  const components = getAllComponents(page);
  const componentsWithA11y = components.filter((c) => c.a11y?.ariaLabel || c.a11y?.role).length;
  if (components.length > 0) {
    score += (componentsWithA11y / components.length) * 30; // Up to +30 for all components having a11y
  }
  
  // Check for form components (need labels)
  const formComponents = components.filter((c) => 
    ["Input", "Select", "Textarea", "Checkbox", "Radio", "Switch"].includes(c.component)
  );
  const formComponentsWithLabels = formComponents.filter((c) => 
    c.copy || c.a11y?.ariaLabel || c.a11y?.ariaLabelledBy
  ).length;
  if (formComponents.length > 0) {
    score += (formComponentsWithLabels / formComponents.length) * 20; // Up to +20 for all form components having labels
  }
  
  // Check for buttons (should have labels)
  const buttons = components.filter((c) => c.component === "Button");
  const buttonsWithLabels = buttons.filter((c) => c.copy || c.a11y?.ariaLabel).length;
  if (buttons.length > 0) {
    score += (buttonsWithLabels / buttons.length) * 10; // Up to +10 for all buttons having labels
  }
  
  // Validation check
  try {
    const validation = validatePage(page);
    if (validation.valid) {
      score += 10; // Valid DSL = better a11y
    } else {
      const errorCount = validation.diagnostics?.filter((d) => d.level === "error").length || 0;
      score -= errorCount * 2; // Penalize for errors
    }
  } catch {
    // Ignore validation errors for scoring
  }
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Score token compliance
 */
function scoreTokenCompliance(page: UiPage): number {
  let score = 50; // Base score
  
  // Check for layout tokens
  const hasLayoutTokens = page.layout !== undefined;
  if (hasLayoutTokens) {
    score += 10;
  }
  
  // Check components for token usage
  const components = getAllComponents(page);
  let tokenCompliantComponents = 0;
  
  components.forEach((component) => {
    let isCompliant = true;
    
    // Check for layout tokens
    if (component.layout) {
      tokenCompliantComponents++;
    }
    
    // Check for size props (should use tokens: sm, md, lg, xl)
    if (component.props) {
      const sizeProps = ["size", "width", "height", "padding", "margin"];
      for (const prop of sizeProps) {
        if (component.props[prop]) {
          const value = component.props[prop];
          // Check if it's a token value (string) or hardcoded number
          if (typeof value === "number") {
            isCompliant = false;
          } else if (typeof value === "string" && ["sm", "md", "lg", "xl"].includes(value)) {
            tokenCompliantComponents++;
          }
        }
      }
    }
  });
  
  if (components.length > 0) {
    score += (tokenCompliantComponents / components.length) * 40; // Up to +40 for all components using tokens
  }
  
  // Check sections for token usage
  const sections = page.children.filter((c) => c.type === "section") as UiSection[];
  const sectionsWithTokens = sections.filter((s) => s.layout !== undefined).length;
  if (sections.length > 0) {
    score += (sectionsWithTokens / sections.length) * 10; // Up to +10 for all sections using tokens
  }
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Count total components in page
 */
function countComponents(page: UiPage): number {
  return getAllComponents(page).length;
}

/**
 * Get all components from page recursively
 */
function getAllComponents(page: UiPage): UiComponent[] {
  const components: UiComponent[] = [];
  
  function traverse(node: UiNode) {
    if (node.type === "component") {
      components.push(node);
    }
    
    if (node.type === "page" || node.type === "section" || node.type === "grid") {
      node.children.forEach(traverse);
    } else if (node.type === "component" && node.children) {
      node.children.forEach(traverse);
    }
  }
  
  page.children.forEach(traverse);
  
  return components;
}

