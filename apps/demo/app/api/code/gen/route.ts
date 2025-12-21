/**
 * Code Generation API
 * 
 * Generates TSX code from UI-DSL v2
 * 
 * POST /api/code/gen
 * Body: { dsl: UiPage, registry?: ComponentRegistry, options?: CodeGenOptions }
 * Response: { code: string, storybook?: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { generateCodeFromDSL, type CodeGenOptions } from "@/lib/dsl-codegen";
import { validatePage, type ComponentRegistry } from "@fragment_ui/ui-dsl";
import type { UiPage } from "@fragment_ui/ui-dsl";

export const runtime = "nodejs";

interface CodeGenRequest {
  dsl: UiPage;
  registry?: ComponentRegistry;
  options?: CodeGenOptions;
}

/**
 * Load registry from API or use provided one
 */
async function loadRegistry(providedRegistry?: ComponentRegistry): Promise<ComponentRegistry> {
  if (providedRegistry) {
    return providedRegistry;
  }
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3002";
    const response = await fetch(`${baseUrl}/api/registry`);
    if (response.ok) {
      const registry = await response.json();
      return {
        components: registry.components || {},
      };
    }
  } catch (error) {
    console.error("[Code Gen] Failed to load registry:", error);
  }
  
  // Return empty registry as fallback
  return { components: {} };
}

export async function POST(request: NextRequest) {
  try {
    const body: CodeGenRequest = await request.json();
    const { dsl, registry: providedRegistry, options = {} } = body;

    if (!dsl) {
      return NextResponse.json(
        {
          error: "DSL is required",
        },
        { status: 400 }
      );
    }

    // Validate DSL
    const registry = await loadRegistry(providedRegistry);
    const validationResult = validatePage(dsl, registry);
    
    if (!validationResult.valid) {
      const errors = validationResult.diagnostics.filter((d) => d.level === "error");
      if (errors.length > 0) {
        return NextResponse.json(
          {
            error: "DSL validation failed",
            diagnostics: validationResult.diagnostics,
          },
          { status: 400 }
        );
      }
    }

    // Generate code
    const code = generateCodeFromDSL(dsl, registry, options);
    
    // Generate Storybook story if requested
    const storybook = options.generateStorybook
      ? generateCodeFromDSL(dsl, registry, { ...options, generateStorybook: true })
      : undefined;

    return NextResponse.json({
      code,
      storybook,
      metadata: {
        generatedAt: new Date().toISOString(),
        componentName: options.componentName || "GeneratedPage",
      },
    });
  } catch (error) {
    console.error("[Code Gen] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate code",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

