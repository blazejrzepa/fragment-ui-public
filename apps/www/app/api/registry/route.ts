import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

/**
 * Registry API Endpoint
 * 
 * Returns Fragment UI component registry in various formats:
 * - GET /api/registry - Full registry JSON
 * - GET /api/registry?format=v0 - v0-compatible format
 * - GET /api/registry?format=shadcn - shadcn-compatible format
 */

// Path to registry.json (relative to this file)
const registryPath = path.join(
  process.cwd(),
  "..",
  "..",
  "packages",
  "registry",
  "registry.json"
);

// Cache registry in memory (refresh on server restart)
let cachedRegistry: any = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getRegistry() {
  const now = Date.now();
  
  // Return cached registry if still valid
  if (cachedRegistry && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedRegistry;
  }
  
  // Read and cache registry
  try {
    const registryContent = fs.readFileSync(registryPath, "utf-8");
    cachedRegistry = JSON.parse(registryContent);
    cacheTimestamp = now;
    return cachedRegistry;
  } catch (error) {
    console.error("Error reading registry:", error);
    throw new Error("Failed to load registry");
  }
}

/**
 * Extract CSS variables from tokens.css
 */
function extractCSSVariables() {
  const tokensPath = path.join(
    process.cwd(),
    "..",
    "..",
    "packages",
    "tokens",
    "dist",
    "tokens.css"
  );
  
  try {
    const tokensCSS = fs.readFileSync(tokensPath, "utf-8");
    
    // Extract CSS variables using regex
    const variableRegex = /--([^:]+):\s*([^;]+);/g;
    const variables: Record<string, string> = {};
    let match;
    
    while ((match = variableRegex.exec(tokensCSS)) !== null) {
      const [, name, value] = match;
      variables[name.trim()] = value.trim();
    }
    
    // Group variables by category
    const grouped = {
      color: {} as Record<string, string>,
      space: {} as Record<string, string>,
      motion: {} as Record<string, string>,
      radius: {} as Record<string, string>,
      shadow: {} as Record<string, string>,
      typography: {} as Record<string, string>,
      density: {} as Record<string, string>,
      i18n: {} as Record<string, string>,
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
  } catch (error) {
    console.warn("Failed to extract CSS variables:", error);
    return {
      color: {},
      space: {},
      motion: {},
      radius: {},
      shadow: {},
      typography: {},
      density: {},
      i18n: {},
    };
  }
}

/**
 * Convert Fragment UI registry to v0-compatible format
 */
function convertToV0Format(registry: any) {
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
    registry: Object.entries(components).map(([name, config]: [string, any]) => {
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
    }).filter(Boolean),
  };
  
  return v0Registry;
}

/**
 * Convert to shadcn-compatible format
 */
function convertToShadcnFormat(registry: any) {
  // Similar to v0 but with shadcn-specific structure
  return convertToV0Format(registry);
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get("format") || "default";
    
    const registry = getRegistry();
    
    // Return in requested format
    switch (format) {
      case "v0":
      case "shadcn":
        return NextResponse.json(convertToV0Format(registry), {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          },
        });
      
      case "default":
      default:
        return NextResponse.json(registry, {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          },
        });
    }
  } catch (error) {
    console.error("Registry API error:", error);
    return NextResponse.json(
      {
        error: "Failed to load registry",
        message: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

