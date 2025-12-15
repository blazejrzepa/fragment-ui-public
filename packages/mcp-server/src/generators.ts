/**
 * Code generation helpers
 */

import { getComponentInfo } from "./components.js";

/**
 * Generate component code
 */
export async function generateComponentCode(
  componentName: string,
  props?: Record<string, any>,
  variant?: string
): Promise<string> {
  const info = await getComponentInfo(componentName);
  
  if (!info) {
    throw new Error(`Component ${componentName} not found`);
  }

  // Build props string
  const propsString = props
    ? Object.entries(props)
        .map(([key, value]) => {
          if (typeof value === "string") {
            return `${key}="${value}"`;
          }
          return `${key}={${JSON.stringify(value)}}`;
        })
        .join(" ")
    : "";

  // Add variant if provided
  const variantProp = variant ? `variant="${variant}"` : "";
  const allProps = [variantProp, propsString].filter(Boolean).join(" ");

  // Generate import
  const importStatement = `import { ${componentName.charAt(0).toUpperCase() + componentName.slice(1)} } from "${info.importPath}";`;

  // Generate component usage
  const componentTag = componentName.charAt(0).toUpperCase() + componentName.slice(1);
  const usage = `<${componentTag}${allProps ? ` ${allProps}` : ""}>\n  {/* Your content here */}\n</${componentTag}>`;

  return `${importStatement}\n\n${usage}`;
}

