/**
 * Submissions API - Promote endpoint
 * 
 * POST /api/submissions/[id]/promote
 * 
 * Promotes a verified submission by creating a PR (via PR-bot)
 */

import { NextRequest, NextResponse } from "next/server";
import { findById, upsert } from "../../../../submissions/store";
import { promoteSubmission } from "../../../../submissions/promote";
import type { Submission } from "../../../../submissions/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Find submission
    const submission = await findById(id);
    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }
    
    // Check if submission is verified
    if (submission.status !== "verified") {
      return NextResponse.json(
        { error: `Submission must be verified before promotion. Current status: ${submission.status}` },
        { status: 400 }
      );
    }
    
    // Promote submission (create PR)
    const { prUrl, prNumber } = await promoteSubmission(submission);
    
    // Update submission status
    const updated: Submission = {
      ...submission,
      status: "promoted",
      updatedAt: new Date().toISOString(),
    };
    
    const saved = await upsert(updated);
    
    return NextResponse.json({
      ...saved,
      prUrl,
      prNumber,
    });
  } catch (error: any) {
    console.error("[Submissions Promote API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

