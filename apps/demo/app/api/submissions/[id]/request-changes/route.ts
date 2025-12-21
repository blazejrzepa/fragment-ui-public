/**
 * Submissions API - Request Changes endpoint
 * 
 * POST /api/submissions/[id]/request-changes
 * 
 * Requests changes on a submission (rejects and returns to draft)
 * Phase 2: D3 - Review Interface
 */

import { NextRequest, NextResponse } from "next/server";
import { findById, upsert } from "../../../../submissions/store";
import { normalizeSubmissionStatus, isValidSubmissionTransition } from "../../../../submissions/types";
import { randomUUID } from "crypto";
import type { Submission, SubmissionStatus, RequestChangesPayload, ReviewComment } from "../../../../submissions/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: RequestChangesPayload = await request.json();
    
    if (!body.comment) {
      return NextResponse.json(
        { error: "Comment is required when requesting changes" },
        { status: 400 }
      );
    }
    
    // Find submission
    const submission = await findById(id);
    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }
    
    // Normalize status to new format
    const currentStatus = normalizeSubmissionStatus(submission.status);
    
    // Validate state transition (can reject from submitted status)
    if (!isValidSubmissionTransition(currentStatus, "rejected")) {
      return NextResponse.json(
        { 
          error: `Cannot request changes on submission in "${currentStatus}" status. Submission must be in "submitted" status.`,
          currentStatus,
        },
        { status: 400 }
      );
    }
    
    // Get user ID from request (in real app, from auth context)
    const userId = request.headers.get("x-user-id") || "system";
    
    // Prepare review comments
    const newComments: ReviewComment[] = [
      {
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        createdBy: userId,
        content: body.comment,
      },
      ...(body.comments || []).map(comment => ({
        ...comment,
        id: comment.id || randomUUID(),
        createdAt: comment.createdAt || new Date().toISOString(),
        createdBy: comment.createdBy || userId,
      })),
    ];
    
    // Update submission with rejection and comments
    const updated: Submission = {
      ...submission,
      status: "rejected" as SubmissionStatus,
      rejectedAt: new Date().toISOString(),
      rejectedBy: userId,
      rejectionReason: body.comment,
      updatedAt: new Date().toISOString(),
      reviewComments: [
        ...(submission.reviewComments || []),
        ...newComments,
      ],
    };
    
    const saved = await upsert(updated);
    
    return NextResponse.json({
      ...saved,
      message: "Changes requested. Submission returned to draft status.",
    });
  } catch (error: any) {
    console.error("[Submissions Request Changes API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

