/**
 * DSL Generation API
 * 
 * Generates UI-DSL v2 from prompts using layout-first approach
 * 
 * POST /api/dsl/generate
 * Body: { prompt: string, registry?: ComponentRegistry }
 * Response: { dsl: UiPage, diagnostics: Diagnostic[] }
 */

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { generateDSL } from "@/lib/dsl-generator";
import { validatePage, type ComponentRegistry } from "@fragment_ui/ui-dsl";
import type { UiPage } from "@fragment_ui/ui-dsl";
import type { DocumentAnalysis } from "@/lib/docs/ingest";

export const runtime = "nodejs";

interface GenerateRequest {
  prompt: string;
  intent?: "page" | "dashboard" | "form" | "landing"; // Optional intent hint
  constraints?: {
    maxWidth?: "sm" | "md" | "lg" | "xl";
    theme?: string;
  };
  registry?: ComponentRegistry;
  documentAnalysis?: DocumentAnalysis; // Optional document analysis
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
    console.error("[DSL Generate] Failed to load registry:", error);
  }
  
  // Return empty registry as fallback
  return { components: {} };
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { prompt, intent: providedIntent, constraints, registry: providedRegistry, documentAnalysis } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        {
          error: "Prompt is required",
          diagnostics: [
            {
              level: "error",
              message: "Prompt must be a non-empty string",
              code: "MISSING_PROMPT",
            },
          ],
        },
        { status: 400 }
      );
    }

    // Load registry
    const registry = await loadRegistry(providedRegistry);
    
    // Generate DSL from prompt (with optional intent and constraints)
    const { dsl, diagnostics: generationDiagnostics } = generateDSL(
      prompt, 
      registry, 
      documentAnalysis,
      providedIntent,
      constraints
    );
    
    // Validate generated DSL
    const validationResult = validatePage(dsl, registry);
    
    // Log validation result for debugging
    if (!validationResult.valid) {
      console.log("[DSL Generate] Validation found issues:", {
        errorCount: validationResult.diagnostics.filter(d => d.level === "error").length,
        warningCount: validationResult.diagnostics.filter(d => d.level === "warning").length,
        diagnostics: validationResult.diagnostics.slice(0, 5), // First 5 diagnostics
      });
    }
    
    // Combine diagnostics
    const allDiagnostics = [
      ...generationDiagnostics,
      ...(validationResult?.diagnostics || []),
    ];
    
    // Only return error if there are critical generation errors (not validation errors)
    const criticalErrors = allDiagnostics.filter(
      (d) => d.level === "error" && 
             ("code" in d ? d.code !== "SCHEMA_VALIDATION_ERROR" && d.code !== "UNKNOWN_ERROR" : true) &&
             !d.message.includes("Cannot read properties")
    );
    if (criticalErrors.length > 0) {
      return NextResponse.json(
        {
          error: "DSL generation failed",
          dsl,
          diagnostics: allDiagnostics,
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      dsl,
      diagnostics: allDiagnostics,
      metadata: {
        generatedAt: new Date().toISOString(),
        prompt: prompt.substring(0, 200), // Truncate for response
        registryVersion: registry.components ? Object.keys(registry.components).length : 0,
      },
    });
  } catch (error) {
    console.error("[DSL Generate] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate DSL",
        message: error instanceof Error ? error.message : String(error),
        diagnostics: [
          {
            level: "error",
            message: error instanceof Error ? error.message : "Unknown error",
            code: "GENERATION_ERROR",
          },
        ],
      },
      { status: 500 }
    );
  }
}

