/**
 * Chat Apply Patches API
 * 
 * Applies patches from chat to DSL, regenerates code, and updates session
 * 
 * POST /api/chat/apply-patches
 * Body: { sessionId: string, patches: Patch[], dsl?: UiPage }
 * Response: { dsl: UiPage, code: string, diagnostics: Diagnostic[] }
 */

import { NextRequest, NextResponse } from "next/server";
import { applyPatch } from "@/lib/dsl-patch";
import { generateCodeFromDSL } from "@/lib/dsl-codegen";
import {
  getSession,
  getOrCreateSession,
  updateSessionAsset,
  addPatchToHistory,
} from "@/lib/chat/session-manager";
import { validatePage, type ComponentRegistry } from "@fragment_ui/ui-dsl";
import type { UiPage, Patch, Diagnostic } from "@fragment_ui/ui-dsl";

export const runtime = "nodejs";

interface ApplyPatchesRequest {
  sessionId: string;
  patches: Patch[];
  dsl?: UiPage; // Optional - will use session DSL if not provided
  registry?: ComponentRegistry;
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
    console.error("[Apply Patches] Failed to load registry:", error);
  }
  
  return { components: {} };
}

export async function POST(request: NextRequest) {
  try {
    const body: ApplyPatchesRequest = await request.json();
    const { sessionId, patches, dsl: providedDSL, registry: providedRegistry } = body;

    if (!sessionId) {
      return NextResponse.json(
        {
          error: "Session ID is required",
          diagnostics: [
            {
              level: "error",
              message: "Session ID must be provided",
              code: "MISSING_SESSION_ID",
            },
          ],
        },
        { status: 400 }
      );
    }

    if (!patches || !Array.isArray(patches) || patches.length === 0) {
      return NextResponse.json(
        {
          error: "Patches are required",
          diagnostics: [
            {
              level: "error",
              message: "At least one patch must be provided",
              code: "MISSING_PATCHES",
            },
          ],
        },
        { status: 400 }
      );
    }

    // Get or create session (allow creating if doesn't exist)
    const session = getSession(sessionId) || getOrCreateSession(sessionId);

    // Get DSL from provided or session
    const dsl = providedDSL || session.currentDSL;
    if (!dsl) {
      return NextResponse.json(
        {
          error: "DSL not found",
          diagnostics: [
            {
              level: "error",
              message: "DSL must be provided or available in session",
              code: "MISSING_DSL",
            },
          ],
        },
        { status: 400 }
      );
    }

    // Load registry
    const registry = await loadRegistry(providedRegistry);

    // Apply patches sequentially
    let currentDSL = dsl as UiPage;
    const allDiagnostics: Diagnostic[] = [];
    const dslBefore = JSON.parse(JSON.stringify(currentDSL)); // Deep clone for history

    for (const patch of patches) {
      const result = applyPatch(currentDSL, patch, registry);
      currentDSL = result.dsl;
      allDiagnostics.push(...result.diagnostics);

      // Add to patch history
      addPatchToHistory(
        sessionId,
        patch,
        `Applied ${patch.op} to ${patch.targetId}`,
        patch.targetId,
        dslBefore,
        currentDSL
      );
    }

    // Validate final DSL
    const finalValidation = validatePage(currentDSL, registry);
    allDiagnostics.push(...finalValidation.diagnostics);

    // Check for critical errors
    const errors = allDiagnostics.filter((d) => d.level === "error");
    if (errors.length > 0) {
      return NextResponse.json(
        {
          error: "Patch application resulted in errors",
          dsl: currentDSL,
          code: null,
          diagnostics: allDiagnostics,
        },
        { status: 400 }
      );
    }

    // Regenerate code from patched DSL
    let generatedCode: string;
    try {
      generatedCode = generateCodeFromDSL(currentDSL, registry, {
        includeImports: true,
        componentName: "PatchedComponent",
      });
    } catch (error) {
      console.error("[Apply Patches] Code generation error:", error);
      return NextResponse.json(
        {
          error: "Failed to regenerate code",
          dsl: currentDSL,
          code: null,
          diagnostics: [
            ...allDiagnostics,
            {
              level: "error",
              message: error instanceof Error ? error.message : "Code generation failed",
              code: "CODE_GENERATION_ERROR",
            },
          ],
        },
        { status: 500 }
      );
    }

    // Update session with new DSL and code
    if (session.currentAssetId && session.currentRevisionId) {
      updateSessionAsset(
        sessionId,
        session.currentAssetId,
        session.currentRevisionId,
        currentDSL,
        generatedCode
      );
    } else {
      // Update DSL and code even without Asset/Revision IDs
      const updatedSession = getSession(sessionId);
      if (updatedSession) {
        updatedSession.currentDSL = currentDSL;
        updatedSession.currentCode = generatedCode;
      }
    }

    return NextResponse.json({
      dsl: currentDSL,
      code: generatedCode,
      diagnostics: allDiagnostics,
      metadata: {
        patchesApplied: patches.length,
        sessionId,
        assetId: session.currentAssetId,
        revisionId: session.currentRevisionId,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[Apply Patches] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to apply patches",
        message: error instanceof Error ? error.message : String(error),
        diagnostics: [
          {
            level: "error",
            message: error instanceof Error ? error.message : "Unknown error",
            code: "PATCH_ERROR",
          },
        ],
      },
      { status: 500 }
    );
  }
}

