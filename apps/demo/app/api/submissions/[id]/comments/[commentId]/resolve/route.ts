/**
 * Submissions API - Resolve Comment endpoint
 * 
 * POST /api/submissions/[id]/comments/[commentId]/resolve
 * 
 * Resolve a review comment
 * Phase 2: D3 - Review Interface
 */

import { NextRequest, NextResponse } from "next/server";
import { findById, upsert } from "../../../../../../submissions/store";
import type { Submission } from "../../../../../../submissions/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { id, commentId } = await params;
    
    // Find submission
    const submission = await findById(id);
    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }
    
    // Find and resolve comment
    const updated: Submission = {
      ...submission,
      reviewComments: (submission.reviewComments || []).map((comment) => {
        if (comment.id === commentId && !comment.resolved) {
          return {
            ...comment,
            resolved: true,
            resolvedAt: new Date().toISOString(),
            resolvedBy: request.headers.get("x-user-id") || "system",
          };
        }
        return comment;
      }),
      updatedAt: new Date().toISOString(),
    };
    
    const saved = await upsert(updated);
    
    return NextResponse.json(saved);
  } catch (error: any) {
    console.error("[Submissions Resolve Comment API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

