/**
 * Variants Comparison API
 * 
 * POST /api/variants/compare
 * 
 * Compares multiple variants and scores them based on criteria:
 * - clarity: Layout readability
 * - hierarchy: Information hierarchy
 * - a11y: Accessibility compliance
 * - tokenCompliance: Design token adherence
 */

import { NextRequest, NextResponse } from "next/server";
import type { UiPage } from "@fragment_ui/ui-dsl";
import { scoreVariant, type ScoringCriteria } from "@/lib/variant-scorer";

export interface CompareVariantsRequest {
  variants: UiPage[];
  criteria?: ScoringCriteria[];
}

export interface CompareVariantsResponse {
  scores: Array<{
    idx: number;
    score: number;
    breakdown: {
      clarity: number;
      hierarchy: number;
      a11y: number;
      tokenCompliance: number;
    };
    notes: string[];
  }>;
  best: number; // Index of best variant
  summary: {
    avgScore: number;
    highestScore: number;
    lowestScore: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: CompareVariantsRequest = await request.json();
    
    if (!body.variants || !Array.isArray(body.variants)) {
      return NextResponse.json(
        { error: "Missing required field: variants (array)" },
        { status: 400 }
      );
    }
    
    if (body.variants.length < 2) {
      return NextResponse.json(
        { error: "At least 2 variants required for comparison" },
        { status: 400 }
      );
    }
    
    if (body.variants.length > 10) {
      return NextResponse.json(
        { error: "Maximum 10 variants allowed for comparison" },
        { status: 400 }
      );
    }
    
    // Validate all variants
    for (let i = 0; i < body.variants.length; i++) {
      const variant = body.variants[i];
      if (!variant || variant.type !== "page") {
        return NextResponse.json(
          { error: `Variant ${i} is not a valid page` },
          { status: 400 }
        );
      }
    }
    
    // Score all variants
    const scores = body.variants.map((variant, idx) => {
      return scoreVariant(variant, idx, body.criteria);
    });
    
    // Find best variant (highest score)
    const bestIdx = scores.reduce((best, current, idx) => {
      return current.score > scores[best].score ? idx : best;
    }, 0);
    
    // Calculate summary
    const allScores = scores.map((s) => s.score);
    const avgScore = allScores.reduce((sum, score) => sum + score, 0) / allScores.length;
    const highestScore = Math.max(...allScores);
    const lowestScore = Math.min(...allScores);
    
    return NextResponse.json({
      scores: scores.map((s) => ({
        idx: s.idx,
        score: s.score,
        breakdown: s.breakdown,
        notes: s.notes,
      })),
      best: bestIdx,
      summary: {
        avgScore: Math.round(avgScore),
        highestScore,
        lowestScore,
      },
    } as CompareVariantsResponse);
  } catch (error: any) {
    console.error("[Variants Compare API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

