/**
 * API Route: Generate code from UI-DSL
 * 
 * This endpoint:
 * 1. Parses prompt to UI-DSL (or accepts UI-DSL directly)
 * 2. Validates UI-DSL
 * 3. Generates TSX code using generator
 * 4. Returns generated code
 */

import { NextRequest, NextResponse } from "next/server";
import { parsePrompt } from "../../studio/dsl/parser";
import { validateUiDsl } from "../../studio/dsl/schema";
import { generateTSX } from "../../studio/dsl/generator";
import type { UiDsl } from "../../studio/dsl/types";
import { classifyIntent, selectRecipe, fillRecipeSlots } from "../../studio/dsl/recipes";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, dsl } = body;

    // If DSL is provided directly, use it; otherwise parse from prompt
    let uiDsl: UiDsl;
    let parseResult;

    if (dsl) {
      // Use provided DSL
      uiDsl = dsl as UiDsl;
    } else if (prompt) {
      // Try recipe-based generation first
      const intent = classifyIntent(prompt);
      const recipe = selectRecipe(intent, prompt);
      
      if (recipe) {
        // Use recipe to generate DSL
        uiDsl = fillRecipeSlots(recipe, prompt);
        parseResult = {
          dsl: uiDsl,
          confidence: 0.9, // High confidence for recipe-based generation
        };
      } else {
        // Fallback to regular parsing
      parseResult = parsePrompt(prompt);
      uiDsl = parseResult.dsl;
      }
    } else {
      return NextResponse.json(
        { error: "Either 'prompt' or 'dsl' must be provided" },
        { status: 400 }
      );
    }

    // Validate DSL
    if (!validateUiDsl(uiDsl)) {
      return NextResponse.json(
        { error: "Invalid UI-DSL structure", dsl: uiDsl },
        { status: 400 }
      );
    }

    // Generate TSX code
    const code = generateTSX(uiDsl, {
      includeImports: true,
      includeValidation: true,
      useFormEnhanced: true,
    });

    return NextResponse.json({
      code,
      dsl: uiDsl,
      metadata: {
        method: parseResult?.confidence === 0.9 ? "recipe-based" : "dsl-generator",
        confidence: parseResult?.confidence || 1.0,
        type: uiDsl.type,
        recipe: parseResult?.confidence === 0.9 ? "used" : undefined,
      },
    });
  } catch (error) {
    console.error("Error generating code from DSL:", error);
    return NextResponse.json(
      {
        error: "Failed to generate code",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

