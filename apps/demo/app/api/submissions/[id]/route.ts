/**
 * Submissions API - Individual submission endpoint
 * 
 * DELETE /api/submissions/[id] - Delete a submission
 */

import { NextRequest, NextResponse } from "next/server";
import { deleteById, findById } from "../../../submissions/store";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const submission = await findById(id);
    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }
    
    const deleted = await deleteById(id);
    if (!deleted) {
      return NextResponse.json({ error: "Failed to delete submission" }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Submissions API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const submission = await findById(id);
    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }
    
    return NextResponse.json(submission);
  } catch (error: any) {
    console.error("[Submissions API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

