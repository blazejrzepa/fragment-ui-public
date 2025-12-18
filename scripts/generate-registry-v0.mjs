// Script to generate static registry.json in v0 format for public folder
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, "..");
const registryDir = path.join(rootDir, "packages/registry");
const registryPath = path.join(registryDir, "registry.json");
const publicDir = path.join(rootDir, "apps/www/public");
const outputPath = path.join(publicDir, "registry.json");

// Read registry
const registry = JSON.parse(fs.readFileSync(registryPath, "utf-8"));

// Extract CSS variables from tokens.css
function extractCSSVariables() {
  const tokensPath = path.join(rootDir, "packages/tokens/dist/tokens.css");
  const tokensCSS = fs.readFileSync(tokensPath, "utf-8");
  
  // Extract CSS variables using regex
  const variableRegex = /--([^:]+):\s*([^;]+);/g;
  const variables = {};
  let match;
  
  while ((match = variableRegex.exec(tokensCSS)) !== null) {
    const [, name, value] = match;
    variables[name.trim()] = value.trim();
  }
  
  // Group variables by category
  const grouped = {
    color: {},
    space: {},
    motion: {},
    radius: {},
    shadow: {},
    typography: {},
    density: {},
    i18n: {},
  };
  
  for (const [name, value] of Object.entries(variables)) {
    if (name.startsWith("color-")) {
      grouped.color[name] = value;
    } else if (name.startsWith("space-")) {
      grouped.space[name] = value;
    } else if (name.startsWith("motion-")) {
      grouped.motion[name] = value;
    } else if (name.startsWith("radius-")) {
      grouped.radius[name] = value;
    } else if (name.startsWith("shadow-")) {
      grouped.shadow[name] = value;
    } else if (name.startsWith("typography-")) {
      grouped.typography[name] = value;
    } else if (name.startsWith("density-")) {
      grouped.density[name] = value;
    } else if (name.startsWith("i18n-")) {
      grouped.i18n[name] = value;
    }
  }
  
  return grouped;
}

// Convert to v0 format
function convertToV0Format(registry) {
  const components = registry.components || {};
  const cssVariables = extractCSSVariables();
  
  const v0Registry = {
    $schema: "https://ui.shadcn.com/schema.json",
    style: "fragment-ui",
    rsc: true,
    tsx: true,
    tailwind: {
      config: "tailwind.config.js",
      css: "app/globals.css",
      baseColor: "slate",
      cssVariables: true,
    },
    aliases: {
      components: "@/components/ui",
      utils: "@/lib/utils",
    },
    cssVariables: cssVariables,
    registry: Object.entries(components)
      .map(([name, config]) => {
        if (!config || typeof config !== "object") {
          return null;
        }
        
        // Extract component name from import path
        const importPath = config.import || "";
        const componentName = importPath.split("/").pop() || name.toLowerCase();
        
        return {
          name: componentName.toLowerCase(),
          type: name.includes("-") ? "registry:block" : "registry:component",
          dependencies: ["react", "react-dom", "@fragment_ui/ui"],
          registryDependencies: config.related || [],
          files: [], // Files would be loaded from /r/{name}.json
          metadata: {
            import: config.import,
            description: config.description,
            props: config.props,
            variants: config.variants,
            slots: config.slots,
            stability: config.stability,
          },
        };
      })
      .filter(Boolean),
  };
  
  return v0Registry;
}

// Generate v0 format registry
const v0Registry = convertToV0Format(registry);

// Ensure public directory exists
fs.mkdirSync(publicDir, { recursive: true });

// Write to public folder
fs.writeFileSync(outputPath, JSON.stringify(v0Registry, null, 2));

console.log(`✔ Generated ${outputPath}`);
console.log(`  Total components: ${v0Registry.registry.length}`);

