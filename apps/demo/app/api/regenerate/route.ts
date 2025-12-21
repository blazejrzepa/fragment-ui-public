import { NextRequest, NextResponse } from "next/server";
import { generateTSX } from "../../studio/dsl/generator";
import type { UiDsl } from "../../studio/dsl/types";

/**
 * API Route for regenerating TSX code from DSL
 * 
 * Used for conversational editing - applies patches to DSL and regenerates code
 * Uses generateTSX which supports all DSL types (form, page, table, dashboard)
 * and can handle simple components like single buttons
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dsl } = body;

    if (!dsl) {
      return NextResponse.json(
        { error: "DSL is required" },
        { status: 400 }
      );
    }

    // Validate DSL structure
    if (!dsl.type || !dsl.id) {
      return NextResponse.json(
        { error: "Invalid DSL structure" },
        { status: 400 }
      );
    }

    // Regenerate code from DSL using generateTSX which supports all DSL types
    // This function can handle simple components (like single buttons) in pages
    const code = generateTSX(dsl as UiDsl, {
      includeImports: true,
      includeValidation: false, // Don't include validation for simple components
      useFormEnhanced: true,
    });

    return NextResponse.json({
      success: true,
      code,
    });
  } catch (error) {
    console.error("Error regenerating code from DSL:", error);
    return NextResponse.json(
      { 
        error: "Failed to regenerate code from DSL",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

