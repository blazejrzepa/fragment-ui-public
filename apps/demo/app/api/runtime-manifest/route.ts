import { NextRequest, NextResponse } from "next/server";
import * as path from "path";
import * as fs from "fs";
import type { RuntimeManifest } from "@/types/runtime-manifest";

/**
 * API endpoint to serve the runtime manifest
 * 
 * Returns the generated runtime-manifest.json file, or generates a default one
 * if the file doesn't exist (for development).
 */
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const appDir = process.cwd();
    const manifestPath = path.resolve(appDir, "public/runtime-manifest.json");
    
    // Try to read the generated manifest
    if (fs.existsSync(manifestPath)) {
      const manifestContent = fs.readFileSync(manifestPath, "utf-8");
      const manifest: RuntimeManifest = JSON.parse(manifestContent);
      
      return NextResponse.json(manifest, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
      });
    }
    
    // Fallback: Generate a default manifest if file doesn't exist (development)
    console.warn("[runtime-manifest] Manifest file not found, generating default...");
    
    const defaultManifest: RuntimeManifest = {
      version: "1.0.0",
      generatedAt: new Date().toISOString(),
      dependencies: {
        react: "18.3.0",
        "react-dom": "18.3.0",
      },
      importmap: {
        imports: {
          "react": "https://esm.sh/react@18.3.0",
          "react-dom": "https://esm.sh/react-dom@18.3.0",
          "react/jsx-runtime": "https://esm.sh/react@18.3.0/jsx-runtime",
          "react/jsx-dev-runtime": "https://esm.sh/react@18.3.0/jsx-dev-runtime",
          "@fragment_ui/ui": "/api/bundle",
          "@fragment_ui/blocks": "/api/bundle-blocks",
        },
      },
      css: {
        bundle: "/api/bundle-css",
      },
      features: {
        a11y: true,
        devMode: process.env.NODE_ENV === "development",
        telemetry: false,
      },
      endpoints: {
        bundle: "/api/bundle",
        "bundle-blocks": "/api/bundle-blocks",
        "bundle-css": "/api/bundle-css",
        "runtime-manifest": "/api/runtime-manifest",
      },
    };
    
    return NextResponse.json(defaultManifest, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("[runtime-manifest] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to load runtime manifest",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

