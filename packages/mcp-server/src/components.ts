/**
 * Component information and suggestions
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { getRepoRoot } from "./root.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = getRepoRoot();

export interface ComponentInfo {
  name: string;
  description: string;
  category: "ui" | "block";
  props: ComponentProp[];
  variants?: string[];
  examples: string[];
  importPath: string;
  documentationUrl?: string;
  storybookUrl?: string;
}

export interface ComponentProp {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description?: string;
}

export interface ComponentSuggestion {
  component: string;
  confidence: number;
  reason: string;
  useCase: string;
}

/**
 * Get component information from registry
 */
export async function getComponentInfo(
  componentName: string
): Promise<ComponentInfo | null> {
  try {
    const registryPath = path.join(ROOT, "packages/registry/registry.json");
    const registry = JSON.parse(await fs.readFile(registryPath, "utf-8"));

    const component = registry[componentName];
    if (!component) {
      return null;
    }

    // Try to read component file for more details
    let componentPath: string;
    if (component.files && Array.isArray(component.files) && component.files.length > 0) {
      const firstFile = component.files[0];
      // Handle both object format {from: "...", to: "..."} and string format
      const filePath = typeof firstFile === "string" ? firstFile : firstFile.from;
      componentPath = path.join(ROOT, filePath);
    } else if (typeof component.files === "string") {
      componentPath = path.join(ROOT, component.files);
    } else {
      componentPath = path.join(ROOT, `packages/ui/src/${componentName}.tsx`);
    }

    let props: ComponentProp[] = [];
    let examples: string[] = [];

    try {
      const componentCode = await fs.readFile(componentPath, "utf-8");
      
      // Extract props from TypeScript interface
      const propsMatch = componentCode.match(/interface\s+\w+Props\s*\{([^}]+)\}/s);
      if (propsMatch) {
        const propsText = propsMatch[1];
        const propLines = propsText.split("\n").filter((line) => line.trim());
        
        props = propLines.map((line) => {
          const match = line.match(/(\w+)(\??):\s*([^;]+)/);
          if (match) {
            return {
              name: match[1],
              type: match[3].trim(),
              required: !match[2],
            };
          }
          return null;
        }).filter((p): p is ComponentProp => p !== null);
      }

      // Extract examples from stories
      const storiesPath = path.join(
        ROOT,
        `packages/ui/src/${componentName}.stories.tsx`
      );
      try {
        const storiesCode = await fs.readFile(storiesPath, "utf-8");
        const exampleMatches = storiesCode.matchAll(/<(\w+)[^>]*>/g);
        examples = Array.from(exampleMatches)
          .slice(0, 3)
          .map((match) => match[0]);
      } catch {
        // Stories file doesn't exist
      }
    } catch {
      // Component file doesn't exist or can't be read
    }

    return {
      name: componentName,
      description: component.description || `Fragment UI ${componentName} component`,
      category: component.category || "ui",
      props,
      examples,
      importPath: component.files?.[0]
        ? `@fragment_ui/${component.category || "ui"}/${componentName}`
        : `@fragment_ui/ui/${componentName}`,
      documentationUrl: `https://fragment-ui.dev/docs/components/${componentName}`,
      storybookUrl: `https://fragment-ui.dev/storybook/?path=/story/${componentName}`,
    };
  } catch (error) {
    console.error("Error getting component info:", error);
    return null;
  }
}

/**
 * Suggest components based on description
 */
export async function suggestComponent(
  description: string
): Promise<ComponentSuggestion[]> {
  const registryPath = path.join(ROOT, "packages/registry/registry.json");
  const registry = JSON.parse(await fs.readFile(registryPath, "utf-8"));

  const suggestions: ComponentSuggestion[] = [];
  const lowerDescription = description.toLowerCase();

  // Simple keyword matching (can be enhanced with ML/NLP)
  const keywords: Record<string, string[]> = {
    button: ["button", "click", "action", "submit", "primary"],
    input: ["input", "text", "field", "form", "type"],
    dialog: ["dialog", "modal", "popup", "overlay"],
    select: ["select", "dropdown", "choose", "pick"],
    card: ["card", "container", "box", "panel"],
    table: ["table", "grid", "data", "list", "rows"],
    form: ["form", "submit", "validation", "fields"],
    alert: ["alert", "notification", "message", "warning"],
    tabs: ["tabs", "navigation", "sections"],
    accordion: ["accordion", "collapse", "expand"],
  };

  for (const [componentName, componentKeywords] of Object.entries(keywords)) {
    if (registry[componentName]) {
      const matches = componentKeywords.filter((keyword) =>
        lowerDescription.includes(keyword)
      );
      if (matches.length > 0) {
        suggestions.push({
          component: componentName,
          confidence: matches.length / componentKeywords.length,
          reason: `Matches keywords: ${matches.join(", ")}`,
          useCase: description,
        });
      }
    }
  }

  // Sort by confidence
  suggestions.sort((a, b) => b.confidence - a.confidence);

  return suggestions.slice(0, 5);
}

