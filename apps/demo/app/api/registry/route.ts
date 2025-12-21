import { NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { access } from "fs/promises";
import { constants } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cache for registry path and content
let cachedRegistryPath: string | null = null;
let cachedRegistry: any = null;
let cachedRegistryMtime: number = 0;
let cachedRegistrySize: number = 0;

// Find registry path once and cache it
async function findRegistryPath(): Promise<string | null> {
  // Return cached path if it still exists
  if (cachedRegistryPath) {
    try {
      await access(cachedRegistryPath, constants.F_OK | constants.R_OK);
      return cachedRegistryPath;
    } catch {
      // Path no longer exists, clear cache and search again
      cachedRegistryPath = null;
    }
  }

    // Try multiple possible paths - prefer packages/registry/registry.json first (source of truth)
    const possiblePaths = [
      join(process.cwd(), "packages/registry/registry.json"),
      join(process.cwd(), "../../packages/registry/registry.json"),
      join(__dirname, "../../../../packages/registry/registry.json"),
      join(process.cwd(), "apps/demo/registry.json"), // Fallback to local registry if exists
      join(__dirname, "../../../registry.json"), // Relative to this API route
    ];
    
    for (const path of possiblePaths) {
      try {
        // Check if file exists and is readable
        await access(path, constants.F_OK | constants.R_OK);
      cachedRegistryPath = path;
      if (process.env.NODE_ENV === "development") {
        console.log(`[Registry API] Found registry at: ${cachedRegistryPath}`);
      }
      return cachedRegistryPath;
      } catch (error: any) {
        // Try next path
        continue;
      }
    }
  
  return null;
}

export async function GET() {
  try {
    const registryPath = await findRegistryPath();
    
    if (!registryPath) {
      throw new Error("Registry file not found in any expected location");
    }
    
    // Check if file has changed (using mtime and size)
    const stats = await stat(registryPath);
    const hasChanged = 
      stats.mtimeMs !== cachedRegistryMtime || 
      stats.size !== cachedRegistrySize;
    
    // Return cached registry if file hasn't changed
    if (!hasChanged && cachedRegistry) {
      return NextResponse.json(cachedRegistry, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      });
    }
    
    // Read and parse registry
    const registryContent = await readFile(registryPath, "utf8");
    const registry = JSON.parse(registryContent);
    
    // Update cache
    cachedRegistry = registry;
    cachedRegistryMtime = stats.mtimeMs;
    cachedRegistrySize = stats.size;
    
    return NextResponse.json(registry, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error: any) {
    console.error("[Registry API] Failed to load registry:", error);
    // Return empty registry instead of error to prevent UI breakage
    return NextResponse.json({
      $schema: "https://json-schema.org/draft-07/schema#",
      version: "1.0.0",
      components: {},
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=60',
      },
    });
  }
}


