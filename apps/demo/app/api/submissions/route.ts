/**
 * Submissions API - Main endpoint
 * 
 * POST /api/submissions - Create a new submission
 * GET /api/submissions - List all submissions (optional, for admin)
 */

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { list, upsert } from "../../submissions/store";
import type { Submission, SubmissionType, SubmissionStatus, SubmissionOriginType } from "../../submissions/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { type, dsl, tsx, stories, author, prompt, runChecks, originType } = body;
    
    // Validate required fields
    if (!type || !dsl || !tsx || !author) {
      return NextResponse.json(
        { error: "Missing required fields: type, dsl, tsx, author" },
        { status: 400 }
      );
    }
    
    // Validate type
    if (!["component", "block", "screen"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid type. Must be 'component', 'block', or 'screen'" },
        { status: 400 }
      );
    }
    
    // Validate originType if provided
    if (originType && !["product", "design", "copilot", "audit", "r&d"].includes(originType)) {
      return NextResponse.json(
        { error: "Invalid originType. Must be 'product', 'design', 'copilot', 'audit', or 'r&d'" },
        { status: 400 }
      );
    }
    
    // Auto-detect originType from context if not provided
    let detectedOriginType = originType;
    if (!detectedOriginType) {
      // If prompt is provided, it's likely from Copilot
      if (prompt) {
        detectedOriginType = "copilot";
      }
      // Default to product (most common)
      else {
        detectedOriginType = "product";
      }
    }
    
    // Create submission
    const submission: Submission = {
      id: randomUUID(),
      type: type as SubmissionType,
      dsl,
      tsx,
      stories: stories || undefined,
      status: "DRAFT" as SubmissionStatus,
      author,
      prompt: prompt || undefined, // Optional prompt (Milestone 6.3)
      originType: detectedOriginType as SubmissionOriginType, // Track origin
      createdAt: new Date().toISOString(),
    };
    
    // Save to storage
    const saved = await upsert(submission);
    
    // If runChecks is true, automatically run checks (Milestone 6.3)
    if (runChecks) {
      try {
        const checksResponse = await fetch(`${request.nextUrl.origin}/api/submissions/${saved.id}/run-checks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (checksResponse.ok) {
          const checkedSubmission = await checksResponse.json();
          return NextResponse.json(checkedSubmission, { status: 201 });
        }
      } catch (checkError) {
        console.error("[Submissions API] Error running checks:", checkError);
        // Continue without checks if they fail
      }
    }
    
    return NextResponse.json(saved, { status: 201 });
  } catch (error: any) {
    console.error("[Submissions API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const submissions = await list();
    return NextResponse.json(submissions);
  } catch (error: any) {
    console.error("[Submissions API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Example cURL commands:
 * 
 * # Create a new submission
 * curl -X POST http://localhost:3002/api/submissions \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "type": "component",
 *     "dsl": { "type": "form", "fields": [] },
 *     "tsx": "export function MyComponent() { return <div>Test</div>; }",
 *     "author": "user@example.com"
 *   }'
 * 
 * # List all submissions
 * curl http://localhost:3002/api/submissions
 * 
 * # Verify a submission (replace {id} with actual submission ID)
 * curl -X POST http://localhost:3002/api/submissions/{id}/verify
 * 
 * # Promote a submission (replace {id} with actual submission ID)
 * curl -X POST http://localhost:3002/api/submissions/{id}/promote
 */

