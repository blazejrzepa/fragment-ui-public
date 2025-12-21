/**
 * Submissions API - Run Checks endpoint
 * 
 * POST /api/submissions/:id/run-checks
 * 
 * Runs all quality checks (a11y, lint, ACL, synthetic) and updates submission status
 * Part of Milestone 6.3: Submissions jako Quality Gate + Synthetic Testing
 * Phase 2: D2 - Enhanced with Governance Rule Engine integration
 */

import { NextRequest, NextResponse } from "next/server";
import { findById, upsert } from "../../../../submissions/store";
import { verifySubmission } from "../../../../submissions/verify";
import { normalizeSubmissionStatus } from "../../../../submissions/types";
import type { Submission, SubmissionStatus, LegacySubmissionStatus } from "../../../../submissions/types";
import type { UiDsl } from "../../../../studio/dsl/types";
import { runGovernanceChecks } from "@/lib/governance";
import { enforceSubmissions } from "@/lib/governance";
import { logAudit } from "@/lib/governance";
import type { PolicyBundle } from "@/lib/governance";

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
    
    // Update status to submitted (new format) or CHECKING (legacy)
    const updated: Submission = {
      ...submission,
      status: normalizeSubmissionStatus(submission.status) === "draft" ? "submitted" as SubmissionStatus : ("CHECKING" as LegacySubmissionStatus),
      updatedAt: new Date().toISOString(),
    };
    await upsert(updated);
    
    // Run verification with DSL (for ACL and synthetic checks)
    // Phase 2: D2 - Enhanced with bundle policy and test presence checks
    const dsl = submission.dsl as UiDsl;
    const result = await verifySubmission(submission.tsx, dsl, submission.stories);
    
    // Phase 2: EPIC F - Run Governance checks
    // Get policy bundles from request body (default to core-ds + enterprise)
    let policyBundles: PolicyBundle[] = ["core-ds", "enterprise"];
    try {
      const body = await request.json();
      if (body && Array.isArray(body.policyBundles)) {
        policyBundles = body.policyBundles;
      }
    } catch {
      // No body provided, use defaults
    }
    
    // Run Governance checks and merge with existing checks
    const { checks: governanceChecks, governanceResults } = await runGovernanceChecks(
      dsl,
      submission.tsx,
      submission.stories,
      policyBundles,
      result.checks
    );
    
    // Run enforcement at Submissions point (hard gates)
    const enforcementResult = await enforceSubmissions(
      {
        dsl,
        tsx: submission.tsx,
        storiesCode: submission.stories,
        componentName: submission.id,
      },
      policyBundles
    );
    
    // Log audit event
    logAudit({
      action: "rule_executed",
      userId: submission.author,
      entityType: "submission",
      entityId: submission.id,
      metadata: {
        policyBundles,
        violations: enforcementResult.violations.length,
        errors: enforcementResult.errors,
        warnings: enforcementResult.warnings,
      },
    });
    
    // Determine final status based on checks (using new status format)
    let finalStatus: SubmissionStatus = "approved";
    
    // Use merged checks (existing + governance)
    const mergedChecks = governanceChecks;
    
    // Check if any check failed
    // Phase 2: D2 - Enhanced with bundle policy and test presence checks
    // Phase 2: EPIC F - Enhanced with Governance enforcement
    if (mergedChecks) {
      const hasFailures = 
        !mergedChecks.a11y.passed ||
        !mergedChecks.lint.passed ||
        !mergedChecks.bundle.passed ||
        !mergedChecks.tests.passed ||
        !mergedChecks.acl.passed ||
        !mergedChecks.synthetic.passed;
      
      // Governance enforcement blocks approval if errors exist
      const governanceBlocksApproval = enforcementResult.blocksApproval;
      
      if (hasFailures || governanceBlocksApproval) {
        // Check if it's a hard blocker (hard action without confirmation, bundle errors, missing tests)
        const hasHardBlocker = 
          mergedChecks.synthetic.failures.some((f: string) => 
            f.includes('Hard action') && f.includes('must require confirmation')
          ) ||
          mergedChecks.bundle.violations > 0 ||
          mergedChecks.tests.violations > 0 ||
          enforcementResult.errors > 0; // Governance errors block
        
        if (hasHardBlocker || result.score < 60) {
          finalStatus = "rejected";
        } else {
          // For non-critical failures, allow resubmission
          finalStatus = "rejected";
        }
      }
    } else {
      // Fallback to old scoring system if checks not available
      if (result.score < 80) {
        finalStatus = result.score < 60 ? "rejected" : "rejected";
      }
    }
    
    // Update with result and checks (merged with governance)
    const final: Submission = {
      ...updated,
      status: finalStatus,
      result,
      checks: mergedChecks, // Include merged checks (existing + governance)
      updatedAt: new Date().toISOString(),
    };
    
    const saved = await upsert(final);
    
    return NextResponse.json(saved);
  } catch (error: any) {
    console.error("[Submissions Run Checks API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

