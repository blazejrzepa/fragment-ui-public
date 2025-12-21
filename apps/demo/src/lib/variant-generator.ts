/**
 * Variant Generator for UI-DSL v2
 * 
 * Generates variants of a UI-DSL page with different emphasis:
 * - layout: Changes layout structure (columns, grids, sections)
 * - copy: Changes text content, labels, descriptions
 * - datasource: Changes data presentation (table → cards, metrics → charts)
 */

import type { UiPage, UiNode, UiSection, UiGrid, UiComponent } from "@fragment_ui/ui-dsl";

/**
 * Generate UUID v4 (same as in dsl-generator.ts)
 */
function randomUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Variant emphasis type
 */
export type VariantEmphasis = "layout" | "copy" | "datasource";

/**
 * Generate variants from a base DSL page
 */
export function generateVariants(
  baseDsl: UiPage,
  count: number = 3,
  emphasis?: VariantEmphasis
): UiPage[] {
  const variants: UiPage[] = [];
  
  // If no emphasis specified, generate one of each type
  const emphases: VariantEmphasis[] = emphasis 
    ? [emphasis]
    : ["layout", "copy", "datasource"];
  
  for (let i = 0; i < count; i++) {
    const emphasisType = emphases[i % emphases.length];
    let variant: UiPage;
    
    switch (emphasisType) {
      case "layout":
        variant = generateLayoutVariant(baseDsl);
        break;
      case "copy":
        variant = generateCopyVariant(baseDsl);
        break;
      case "datasource":
        variant = generateDatasourceVariant(baseDsl);
        break;
      default:
        variant = generateLayoutVariant(baseDsl);
    }
    
    // Ensure unique IDs
    variant.id = randomUUID();
    variant = ensureUniqueIds(variant);
    
    variants.push(variant);
  }
  
  return variants;
}

/**
 * Generate layout variant - changes structure
 */
function generateLayoutVariant(baseDsl: UiPage): UiPage {
  const variant = JSON.parse(JSON.stringify(baseDsl)) as UiPage;
  
  // Transform sections based on current layout
  variant.children = variant.children.map((child) => {
    if (child.type === "section") {
      return transformSectionLayout(child);
    } else if (child.type === "grid") {
      return transformGridLayout(child);
    }
    return child;
  });
  
  // Add or remove sections to create different structure
  if (variant.children.length > 0) {
    // If single column, try to create two-column layout
    const firstSection = variant.children[0];
    if (firstSection.type === "section" && !hasGridChildren(firstSection)) {
      // Split section into two columns
      const splitSection = splitSectionIntoColumns(firstSection);
      if (splitSection) {
        variant.children[0] = splitSection;
      }
    }
  }
  
  return variant;
}

/**
 * Generate copy variant - changes text content
 */
function generateCopyVariant(baseDsl: UiPage): UiPage {
  const variant = JSON.parse(JSON.stringify(baseDsl)) as UiPage;
  
  // Transform text content in components
  variant.children = variant.children.map((child) => {
    return transformNodeCopy(child);
  });
  
  return variant;
}

/**
 * Generate datasource variant - changes data presentation
 */
function generateDatasourceVariant(baseDsl: UiPage): UiPage {
  const variant = JSON.parse(JSON.stringify(baseDsl)) as UiPage;
  
  // Transform data presentation
  variant.children = variant.children.map((child) => {
    if (child.type === "section") {
      return transformSectionDatasource(child);
    }
    return child;
  });
  
  // Update datasources if present
  if (variant.dataSources) {
    variant.dataSources = variant.dataSources.map((ds) => {
      if (ds.kind === "placeholder") {
        // Change shape (table → cards, metrics → list, etc.)
        const shapes: Array<"table" | "cards" | "metrics" | "list"> = ["table", "cards", "metrics", "list"];
        const currentIndex = shapes.indexOf(ds.shape || "table");
        const nextShape = shapes[(currentIndex + 1) % shapes.length];
        return { ...ds, shape: nextShape };
      }
      return ds;
    });
  }
  
  return variant;
}

/**
 * Transform section layout
 */
function transformSectionLayout(section: UiSection): UiSection {
  const transformed = { ...section };
  
  // If section has many children, try to create a grid
  if (transformed.children.length > 2 && !hasGridChildren(transformed)) {
    // Create a grid inside the section
    const grid: UiGrid = {
      id: randomUUID(),
      type: "grid",
      columns: 2,
      children: transformed.children.slice(0, 4), // Take first 4 children
    };
    transformed.children = [grid, ...transformed.children.slice(4)];
  } else if (hasGridChildren(transformed)) {
    // If has grid, flatten to single column
    const flattened: UiNode[] = [];
    transformed.children.forEach((child) => {
      if (child.type === "grid") {
        flattened.push(...child.children);
      } else {
        flattened.push(child);
      }
    });
    transformed.children = flattened;
  }
  
  return transformed;
}

/**
 * Transform grid layout
 */
function transformGridLayout(grid: UiGrid): UiGrid {
  const transformed = { ...grid };
  
  // Change column count
  if (transformed.columns === 2) {
    transformed.columns = 3;
  } else if (transformed.columns === 3) {
    transformed.columns = 4;
  } else {
    transformed.columns = 2;
  }
  
  return transformed;
}

/**
 * Transform node copy (text content)
 */
function transformNodeCopy(node: UiNode): UiNode {
  if (node.type === "component") {
    const component = { ...node } as UiComponent;
    
    // Transform copy prop if present
    if (component.copy) {
      component.copy = transformText(component.copy);
    }
    
    // Transform children recursively
    if (component.children) {
      component.children = component.children.map(transformNodeCopy);
    }
    
    return component;
  } else if (node.type === "section") {
    const section = { ...node } as UiSection;
    if (section.title) {
      section.title = transformText(section.title);
    }
    section.children = section.children.map(transformNodeCopy);
    return section;
  } else if (node.type === "grid") {
    const grid = { ...node } as UiGrid;
    grid.children = grid.children.map(transformNodeCopy);
    return grid;
  }
  
  return node;
}

/**
 * Transform text content (simplified - in real implementation would use AI)
 */
function transformText(text: string): string {
  // Simple transformations - in production, this would use AI to generate variations
  const transformations: Record<string, string[]> = {
    "Get Started": ["Begin Now", "Start Here", "Get Going"],
    "Sign Up": ["Create Account", "Join Now", "Register"],
    "Learn More": ["Discover", "Explore", "Find Out"],
    "Submit": ["Send", "Submit", "Confirm"],
    "Cancel": ["Close", "Cancel", "Back"],
  };
  
  for (const [key, variants] of Object.entries(transformations)) {
    if (text.includes(key)) {
      return text.replace(key, variants[Math.floor(Math.random() * variants.length)]);
    }
  }
  
  return text;
}

/**
 * Transform section datasource presentation
 */
function transformSectionDatasource(section: UiSection): UiSection {
  const transformed = { ...section };
  
  // Find components that might represent data (Table, Card lists, etc.)
  transformed.children = transformed.children.map((child) => {
    if (child.type === "component") {
      const component = child as UiComponent;
      
      // If it's a Table, try to convert to Cards
      if (component.component === "Table" || component.component === "DataTable") {
        return {
          ...component,
          component: "Card",
          // In real implementation, would restructure data binding
        } as UiComponent;
      }
      
      // If it's Cards, try to convert to Table
      if (component.component === "Card" && component.children && component.children.length > 0) {
        return {
          ...component,
          component: "Table",
        } as UiComponent;
      }
    }
    
    return child;
  });
  
  return transformed;
}

/**
 * Split section into columns
 */
function splitSectionIntoColumns(section: UiSection): UiGrid | null {
  if (section.children.length < 2) {
    return null;
  }
  
  const midPoint = Math.ceil(section.children.length / 2);
  const leftChildren = section.children.slice(0, midPoint);
  const rightChildren = section.children.slice(midPoint);
  
  // Create a grid with two columns
  const grid: UiGrid = {
    id: randomUUID(),
    type: "grid",
    columns: 2,
    children: [
      {
        ...section,
        id: randomUUID(),
        children: leftChildren,
      } as UiSection,
      {
        ...section,
        id: randomUUID(),
        children: rightChildren,
      } as UiSection,
    ],
  };
  
  return grid;
}

/**
 * Check if section has grid children
 */
function hasGridChildren(section: UiSection): boolean {
  return section.children.some((child) => child.type === "grid");
}

/**
 * Ensure all IDs in the DSL are unique
 */
function ensureUniqueIds(page: UiPage): UiPage {
  const idMap = new Map<string, string>();
  
  function remapIds(node: UiNode): UiNode {
    const newId = randomUUID();
    idMap.set(node.id, newId);
    
    const newNode = { ...node, id: newId };
    
    if (newNode.type === "page") {
      return {
        ...newNode,
        children: newNode.children.map(remapIds),
      };
    } else if (newNode.type === "section") {
      return {
        ...newNode,
        children: newNode.children.map(remapIds),
      };
    } else if (newNode.type === "grid") {
      return {
        ...newNode,
        children: newNode.children.map(remapIds),
      };
    } else if (newNode.type === "component") {
      return {
        ...newNode,
        children: newNode.children?.map(remapIds) || [],
      };
    }
    
    return newNode;
  }
  
  return remapIds(page) as UiPage;
}

