/**
 * Submissions API - Verify endpoint
 * 
 * POST /api/submissions/[id]/verify
 * 
 * Runs verification (lint, a11y, tokens) and updates submission status
 */

import { NextRequest, NextResponse } from "next/server";
import { findById, upsert } from "../../../../submissions/store";
import { verifySubmission } from "../../../../submissions/verify";
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
    
    // Update status to verifying
    const updated: Submission = {
      ...submission,
      status: "verifying",
      updatedAt: new Date().toISOString(),
    };
    await upsert(updated);
    
    // Run verification
    const result = await verifySubmission(submission.tsx);
    
    // Determine final status based on score
    // Score >= 80: verified, otherwise REJECTED
    const finalStatus = result.score >= 80 ? "verified" : "REJECTED";
    
    // Update with result
    const final: Submission = {
      ...updated,
      status: finalStatus,
      result,
      updatedAt: new Date().toISOString(),
    };
    
    const saved = await upsert(final);
    
    return NextResponse.json(saved);
  } catch (error: any) {
    console.error("[Submissions Verify API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

