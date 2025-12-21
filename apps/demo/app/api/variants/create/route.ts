/**
 * Variants Creation API
 * 
 * POST /api/variants/create
 * 
 * Generates multiple variants of a UI-DSL page with different emphasis:
 * - layout: Changes layout structure
 * - copy: Changes text content
 * - datasource: Changes data presentation
 */

import { NextRequest, NextResponse } from "next/server";
import type { UiPage } from "@fragment_ui/ui-dsl";
import { generateVariants } from "@/lib/variant-generator";
import { scoreVariant } from "@/lib/variant-scorer";

export interface CreateVariantsRequest {
  dsl: UiPage;
  count?: number; // Default: 3
  emphasis?: "layout" | "copy" | "datasource";
}

export interface CreateVariantsResponse {
  variants: Array<{
    dsl: UiPage;
    score?: {
      score: number;
      breakdown: {
        clarity: number;
        hierarchy: number;
        a11y: number;
        tokenCompliance: number;
      };
      notes: string[];
    };
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateVariantsRequest = await request.json();
    
    if (!body.dsl) {
      return NextResponse.json(
        { error: "Missing required field: dsl" },
        { status: 400 }
      );
    }
    
    // Validate DSL structure
    if (body.dsl.type !== "page") {
      return NextResponse.json(
        { error: "DSL must be a page type" },
        { status: 400 }
      );
    }
    
    const count = body.count || 3;
    if (count < 1 || count > 10) {
      return NextResponse.json(
        { error: "Count must be between 1 and 10" },
        { status: 400 }
      );
    }
    
    // Generate variants
    const variants = generateVariants(
      body.dsl,
      count,
      body.emphasis
    );
    
    // Score each variant
    const scoredVariants = variants.map((variant, idx) => {
      const score = scoreVariant(variant, idx);
      return {
        dsl: variant,
        score: {
          score: score.score,
          breakdown: score.breakdown,
          notes: score.notes,
        },
      };
    });
    
    // Sort by score (highest first)
    scoredVariants.sort((a, b) => (b.score?.score || 0) - (a.score?.score || 0));
    
    return NextResponse.json({
      variants: scoredVariants,
    } as CreateVariantsResponse);
  } catch (error: any) {
    console.error("[Variants Create API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

