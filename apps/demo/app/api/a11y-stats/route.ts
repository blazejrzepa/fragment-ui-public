/**
 * A11y Stats API
 * 
 * POST /api/a11y-stats - Record a11y stats from a render
 * GET /api/a11y-stats - List all a11y stats (with optional filters)
 */

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { add, list, getBySubmissionId, getRecent } from "../../a11y/store";
import type { A11yStats } from "../../a11y/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      submissionId,
      viewId,
      violations,
      critical,
      serious,
      moderate,
      minor,
      passes,
      incomplete,
      inapplicable,
      violationsByRule,
    } = body;
    
    // Validate required fields
    if (typeof violations !== "number" || typeof critical !== "number") {
      return NextResponse.json(
        { error: "Missing required fields: violations, critical" },
        { status: 400 }
      );
    }
    
    // Create stat entry
    const stat: A11yStats = {
      id: randomUUID(),
      submissionId: submissionId || undefined,
      viewId: viewId || undefined,
      timestamp: Date.now(),
      violations: violations || 0,
      critical: critical || 0,
      serious: serious || 0,
      moderate: moderate || 0,
      minor: minor || 0,
      passes: passes || 0,
      incomplete: incomplete || 0,
      inapplicable: inapplicable || 0,
      violationsByRule: violationsByRule || {},
    };
    
    // Save to storage
    const saved = await add(stat);
    
    return NextResponse.json(saved, { status: 201 });
  } catch (error: any) {
    console.error("[A11y Stats API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const submissionId = searchParams.get("submissionId");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    
    let stats: A11yStats[];
    
    if (submissionId) {
      stats = await getBySubmissionId(submissionId);
    } else {
      stats = await getRecent(limit);
    }
    
    return NextResponse.json(stats);
  } catch (error: any) {
    console.error("[A11y Stats API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

