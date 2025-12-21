/**
 * Quality Run API
 * 
 * Runs all quality gates: a11y, bundle size, lint DS, E2E, visual
 * 
 * POST /api/quality/run
 * Body: { code: string, html?: string, dsl?: UiPage }
 * Response: { results: QualityResult, passed: boolean, diagnostics: Diagnostic[] }
 */

import { NextRequest, NextResponse } from "next/server";
import { runQualityChecks, type QualityResult } from "@/lib/quality-checks";
import { generateCodeFromDSL } from "@/lib/dsl-codegen";
import { validatePage, type ComponentRegistry } from "@fragment_ui/ui-dsl";
import type { UiPage, Diagnostic } from "@fragment_ui/ui-dsl";

export const runtime = "nodejs";

interface QualityRunRequest {
  code?: string;
  html?: string;
  dsl?: UiPage;
  registry?: ComponentRegistry;
  checks?: Array<"a11y" | "bundleSize" | "lintDS" | "e2e" | "visual">;
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
    console.error("[Quality Run] Failed to load registry:", error);
  }
  
  return { components: {} };
}

export async function POST(request: NextRequest) {
  try {
    const body: QualityRunRequest = await request.json();
    const { code, html, dsl, registry: providedRegistry, checks } = body;

    let finalCode = code;
    let finalHtml = html;
    const diagnostics: Diagnostic[] = [];

    // If DSL is provided, generate code from it
    if (dsl && !code) {
      const registry = await loadRegistry(providedRegistry);
      
      // Validate DSL
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
      
      // Generate code from DSL
      finalCode = generateCodeFromDSL(dsl, registry);
    }

    if (!finalCode) {
      return NextResponse.json(
        {
          error: "Either 'code' or 'dsl' must be provided",
        },
        { status: 400 }
      );
    }

    // Determine which checks to run
    const checksToRun = checks || ["a11y", "bundleSize", "lintDS", "e2e", "visual"];

    // Run quality checks
    const results = await runQualityChecks(finalCode, finalHtml);

    // Filter results based on requested checks
    const filteredResults: QualityResult = {};
    if (checksToRun.includes("a11y") && results.a11y) {
      filteredResults.a11y = results.a11y;
    }
    if (checksToRun.includes("bundleSize") && results.bundleSize) {
      filteredResults.bundleSize = results.bundleSize;
    }
    if (checksToRun.includes("lintDS") && results.lintDS) {
      filteredResults.lintDS = results.lintDS;
    }
    if (checksToRun.includes("e2e") && results.e2e) {
      filteredResults.e2e = results.e2e;
    }
    if (checksToRun.includes("visual") && results.visual) {
      filteredResults.visual = results.visual;
    }

    // Convert results to diagnostics
    if (filteredResults.a11y && !filteredResults.a11y.passed) {
      filteredResults.a11y.violations.forEach((violation) => {
        diagnostics.push({
          level: violation.impact === "critical" || violation.impact === "serious" ? "error" : "warning",
          message: violation.description,
          code: violation.id,
        });
      });
    }

    if (filteredResults.bundleSize && !filteredResults.bundleSize.passed) {
      diagnostics.push({
        level: "error",
        message: `Bundle size ${filteredResults.bundleSize.size} bytes exceeds limit of ${filteredResults.bundleSize.limit} bytes`,
        code: "BUNDLE_SIZE_EXCEEDED",
      });
    }

    if (filteredResults.lintDS && !filteredResults.lintDS.passed) {
      filteredResults.lintDS.errors.forEach((error) => {
        diagnostics.push({
          level: "error",
          message: error.message,
          path: error.line ? `line:${error.line}` : undefined,
          code: error.rule,
        });
      });
    }

    if (filteredResults.e2e && !filteredResults.e2e.passed) {
      filteredResults.e2e.tests
        .filter((test) => !test.passed)
        .forEach((test) => {
          diagnostics.push({
            level: "error",
            message: `E2E test failed: ${test.name}${test.error ? ` - ${test.error}` : ""}`,
            code: "E2E_TEST_FAILED",
          });
        });
    }

    if (filteredResults.visual && !filteredResults.visual.passed) {
      diagnostics.push({
        level: "error",
        message: `Visual regression detected: ${filteredResults.visual.changed} changed, ${filteredResults.visual.added} added, ${filteredResults.visual.removed} removed`,
        code: "VISUAL_REGRESSION",
      });
    }

    // Determine overall pass status
    const passed =
      (!filteredResults.a11y || filteredResults.a11y.passed) &&
      (!filteredResults.bundleSize || filteredResults.bundleSize.passed) &&
      (!filteredResults.lintDS || filteredResults.lintDS.passed) &&
      (!filteredResults.e2e || filteredResults.e2e.passed) &&
      (!filteredResults.visual || filteredResults.visual.passed);

    return NextResponse.json({
      results: filteredResults,
      passed,
      diagnostics,
      metadata: {
        checksRun: checksToRun,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[Quality Run] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to run quality checks",
        message: error instanceof Error ? error.message : String(error),
        diagnostics: [
          {
            level: "error",
            message: error instanceof Error ? error.message : "Unknown error",
            code: "QUALITY_CHECK_ERROR",
          },
        ],
      },
      { status: 500 }
    );
  }
}

