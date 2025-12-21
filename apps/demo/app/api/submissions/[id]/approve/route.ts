/**
 * Submissions API - Approve endpoint
 * 
 * POST /api/submissions/[id]/approve
 * 
 * Approves a submission for release
 * Phase 2: D3 - Review Interface
 */

import { NextRequest, NextResponse } from "next/server";
import { findById, upsert } from "../../../../submissions/store";
import { normalizeSubmissionStatus, isValidSubmissionTransition } from "../../../../submissions/types";
import type { Submission, SubmissionStatus, ApprovePayload } from "../../../../submissions/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: ApprovePayload = await request.json();
    
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
    
    // Validate state transition
    if (!isValidSubmissionTransition(currentStatus, "approved")) {
      return NextResponse.json(
        { 
          error: `Cannot approve submission in "${currentStatus}" status. Submission must be in "submitted" status.`,
          currentStatus,
        },
        { status: 400 }
      );
    }
    
    // Get user ID from request (in real app, from auth context)
    const userId = request.headers.get("x-user-id") || "system";
    
    // Update submission with approval
    const updated: Submission = {
      ...submission,
      status: "approved" as SubmissionStatus,
      approvedAt: new Date().toISOString(),
      approvedBy: userId,
      updatedAt: new Date().toISOString(),
      // Add approval comment if provided
      reviewComments: body.comment ? [
        ...(submission.reviewComments || []),
        {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          createdAt: new Date().toISOString(),
          createdBy: userId,
          content: body.comment,
        },
      ] : submission.reviewComments,
    };
    
    const saved = await upsert(updated);
    
    return NextResponse.json(saved);
  } catch (error: any) {
    console.error("[Submissions Approve API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

