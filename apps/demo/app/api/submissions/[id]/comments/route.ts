/**
 * Submissions API - Comments endpoint
 * 
 * POST /api/submissions/[id]/comments
 * 
 * Add a review comment to a submission
 * Phase 2: D3 - Review Interface
 */

import { NextRequest, NextResponse } from "next/server";
import { findById, upsert } from "../../../../submissions/store";
import type { Submission, ReviewComment } from "../../../../submissions/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: { comment: ReviewComment } = await request.json();
    
    // Find submission
    const submission = await findById(id);
    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }
    
    // Add comment to submission
    const updated: Submission = {
      ...submission,
      reviewComments: [
        ...(submission.reviewComments || []),
        body.comment,
      ],
      updatedAt: new Date().toISOString(),
    };
    
    const saved = await upsert(updated);
    
    return NextResponse.json(saved);
  } catch (error: any) {
    console.error("[Submissions Comments API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

