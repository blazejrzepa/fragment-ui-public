/**
 * Route handler for highlight.css
 * 
 * Serves the highlight CSS file for iframe preview
 */

import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function GET() {
  try {
    const cssPath = join(process.cwd(), "app/playground/runtime/highlight.css");
    const css = await readFile(cssPath, "utf-8");
    
    return new NextResponse(css, {
      headers: {
        "Content-Type": "text/css",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("[Highlight CSS] Error reading file:", error);
    return new NextResponse("/* Highlight CSS not found */", {
      status: 404,
      headers: {
        "Content-Type": "text/css",
      },
    });
  }
}

