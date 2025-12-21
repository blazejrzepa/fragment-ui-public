/**
 * DSL Patch Operations API
 * 
 * Applies patch operations to UI-DSL v2 structures
 * 
 * POST /api/dsl/patch
 * Body: { dsl: UiPage, patch: Patch | Patch[], registry?: ComponentRegistry }
 * Response: { dsl: UiPage, diagnostics: Diagnostic[], inversePatch?: Patch }
 */

import { NextRequest, NextResponse } from "next/server";
import { applyPatch, generateInversePatch } from "@/lib/dsl-patch";
import type { ComponentRegistry } from "@fragment_ui/ui-dsl";
import { validatePatch, validatePage } from "@fragment_ui/ui-dsl";
import type { UiPage, Patch, Diagnostic } from "@fragment_ui/ui-dsl";
import { generateCodeFromDSL } from "@/lib/dsl-codegen";
import { createRevision, FileRevisionRepository } from "@fragment_ui/studio-core";

export const runtime = "nodejs";

interface PatchRequest {
  dsl: UiPage;
  patch: Patch | Patch[];
  registry?: ComponentRegistry;
  generateInverse?: boolean;
  // Optional: Create revision after patch
  createRevision?: {
    assetId: string;
    parentRevisionId?: string;
    chatSessionId?: string;
    createdBy?: string;
    prompt?: string;
  };
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
    console.error("[DSL Patch] Failed to load registry:", error);
  }
  
  // Return empty registry as fallback
  return { components: {} };
}

export async function POST(request: NextRequest) {
  try {
    const body: PatchRequest = await request.json();
    const { dsl, patch, registry: providedRegistry, generateInverse = false } = body;

    if (!dsl) {
      return NextResponse.json(
        {
          error: "DSL is required",
          diagnostics: [
            {
              level: "error",
              message: "DSL must be provided",
              code: "MISSING_DSL",
            },
          ],
        },
        { status: 400 }
      );
    }

    if (!patch) {
      return NextResponse.json(
        {
          error: "Patch is required",
          diagnostics: [
            {
              level: "error",
              message: "Patch must be provided",
              code: "MISSING_PATCH",
            },
          ],
        },
        { status: 400 }
      );
    }

    // Load registry
    const registry = await loadRegistry(providedRegistry);
    
    // Normalize patch to array
    const patches = Array.isArray(patch) ? patch : [patch];
    
    // Validate all patches
    const validationResults = patches.map((p) => validatePatch(p));
    const validationErrors = validationResults
      .flatMap((r) => r.diagnostics)
      .filter((d) => d.level === "error");
    
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: "Patch validation failed",
          diagnostics: validationErrors,
        },
        { status: 400 }
      );
    }
    
    // Apply patches sequentially
    let currentDsl = dsl;
    const allDiagnostics: Diagnostic[] = [];
    const inversePatches: Patch[] = [];
    
    for (const p of patches) {
      const result = applyPatch(currentDsl, p, registry);
      currentDsl = result.dsl;
      allDiagnostics.push(...result.diagnostics);
      
      // Generate inverse patch if requested
      if (generateInverse) {
        const inverse = generateInversePatch(dsl, p);
        if (inverse) {
          inversePatches.push(inverse);
        }
      }
    }
    
    // Validate final DSL
    const finalValidation = validatePage(currentDsl, registry);
    allDiagnostics.push(...finalValidation.diagnostics);
    
    // Check for errors
    const errors = allDiagnostics.filter((d) => d.level === "error");
    if (errors.length > 0) {
      return NextResponse.json(
        {
          error: "Patch application resulted in errors",
          dsl: currentDsl,
          diagnostics: allDiagnostics,
        },
        { status: 400 }
      );
    }
    
    // Optionally create revision
    let revisionId: string | undefined;
    if (body.createRevision) {
      try {
        // Generate TSX code from patched DSL
        const tsxCode = generateCodeFromDSL(currentDsl, registry, {
          includeImports: true,
        });
        
        // Create revision
        const revision = createRevision({
          assetId: body.createRevision.assetId,
          dslJson: currentDsl,
          tsxCode,
          createdBy: body.createRevision.createdBy || "system",
          parentRevisionId: body.createRevision.parentRevisionId,
          patches: patches,
          prompt: body.createRevision.prompt,
          chatSessionId: body.createRevision.chatSessionId,
          metadata: {
            patchesApplied: patches.length,
            generatedAt: new Date().toISOString(),
          },
        });
        
        // Save revision to repository
        const revisionRepo = new FileRevisionRepository();
        await revisionRepo.create(revision);
        revisionId = revision.revisionId;
      } catch (error) {
        console.error("[DSL Patch] Failed to create revision:", error);
        // Don't fail the patch operation if revision creation fails
        allDiagnostics.push({
          level: "warning",
          message: `Failed to create revision: ${error instanceof Error ? error.message : String(error)}`,
          code: "REVISION_CREATION_FAILED",
        });
      }
    }
    
    return NextResponse.json({
      dsl: currentDsl,
      diagnostics: allDiagnostics,
      inversePatch: generateInverse && inversePatches.length > 0 
        ? (inversePatches.length === 1 ? inversePatches[0] : inversePatches)
        : undefined,
      revisionId,
      metadata: {
        patchesApplied: patches.length,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[DSL Patch] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to apply patch",
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

