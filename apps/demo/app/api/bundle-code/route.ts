import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/server-logger";

/**
 * API endpoint to bundle user code for preview
 * 
 * This endpoint bundles user-provided code using esbuild,
 * similar to what worker.ts does, but as an API endpoint
 * Legacy endpoint - not currently used (ReactLiveRenderer handles code directly).
 */
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Code is required and must be a string" },
        { status: 400 }
      );
    }

    // Use the same bundling logic as worker.ts
    // We'll use esbuild-wasm in the browser or esbuild on server
    // For now, we'll use a simpler approach - return code as-is
    // and let the client handle bundling
    
    // TODO: Implement server-side bundling with esbuild
    // Legacy endpoint - return code as-is (not used by ReactLiveRenderer)
    // using the same approach as iframe (client-side bundling)
    
    return NextResponse.json({
      bundledCode: code, // Placeholder - will be implemented with esbuild
      message: "Bundling will be handled client-side for now",
    });
  } catch (error) {
    logger.error("Error in bundle-code endpoint:", error);
    return NextResponse.json(
      {
        error: "Failed to bundle code",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

