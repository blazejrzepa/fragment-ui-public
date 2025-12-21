/**
 * Types for Submissions API
 * 
 * Submissions represent candidate components/blocks/screens that go through
 * a workflow: draft → submitted → approved → rejected
 * 
 * Enhanced with Phase 2 requirements:
 * - Links to Revision entity
 * - Experiment tracking for A/B testing
 * - Artifact hash for deduplication
 */

import { createHash, randomUUID } from "crypto";
import type { UiDsl } from "../studio/dsl/types";

export type SubmissionStatus = 
  | "draft"        // Created in Studio, not yet submitted
  | "submitted"    // Submitted for review
  | "approved"     // Approved for release
  | "rejected";    // Rejected (with reason)

// Legacy statuses for backward compatibility
export type LegacySubmissionStatus = "DRAFT" | "CHECKING" | "APPROVED" | "NEEDS_CHANGES" | "REJECTED" | "verifying" | "verified" | "promoted";

export type SubmissionType = "component" | "block" | "screen";

/**
 * Origin Type - tracks how the submission was created
 * Used for metrics, governance, and workflow tracking
 */
export type SubmissionOriginType = 
  | "product"      // Product → System: reusable component from product team
  | "design"       // Design-driven: designer introduces new pattern
  | "copilot"      // AI/Copilot-assisted: generated via Copilot prompt
  | "audit"        // Refactoring audit / tech debt: standardization of existing components
  | "r&d";         // Experimental / R&D: experimental component without long-term support guarantee

export interface SubmissionChecks {
  a11y: {
    violations: number;
    issues: Array<{ id: string; impact: string; description: string; help?: string; helpUrl?: string }>;
    passed: boolean;
  };
  lint: {
    errors: number;
    warnings: number;
    issues: Array<{ line: number; column?: number; message: string; rule: string }>;
    passed: boolean;
  };
  bundle: {
    violations: number;
    issues: Array<{ rule: string; message: string; severity: "error" | "warning"; location?: { line?: number; column?: number } }>;
    passed: boolean;
    size?: number; // Bundle size in bytes
    gzipped?: number; // Gzipped size in bytes
  };
  tests: {
    violations: number;
    issues: Array<{ type: "story" | "unit"; component: string; message: string }>;
    passed: boolean;
    hasStory?: boolean;
    hasUnit?: boolean;
  };
  acl: {
    violations: number;
    issues: Array<{ element: string; missing: string[]; message: string }>;
    passed: boolean;
  };
  synthetic: {
    score: number;
    failures: string[];
    passed: boolean;
  };
}

export interface SubmissionResult {
  lint: {
    errors: number;
    warnings: number;
    issues: Array<{ line: number; column?: number; message: string; rule: string }>;
  };
  a11y: {
    violations: number;
    issues: Array<{ id: string; impact: string; description: string; help?: string; helpUrl?: string }>;
  };
  visual?: {
    passed: boolean;
    diffUrl?: string;
  };
  tokens: {
    violations: number;
    issues: Array<{ line: number; code: string; suggestion: string }>;
  };
  figma: {
    coverage: number;
    missing: Array<{ variant: string; prop: string }>;
  };
  score: number;
  suggestions: string[];
  // New checks for Milestone 6.3
  checks?: SubmissionChecks;
}

/**
 * Submission state machine transitions
 */
export function isValidSubmissionTransition(
  from: SubmissionStatus,
  to: SubmissionStatus
): boolean {
  const validTransitions: Record<SubmissionStatus, SubmissionStatus[]> = {
    draft: ["submitted"],
    submitted: ["approved", "rejected", "draft"], // Can return to draft after submission
    approved: [], // Approved is terminal (leads to release)
    rejected: ["draft"], // Can resubmit after rejection
  };
  
  return validTransitions[from]?.includes(to) ?? false;
}

/**
 * Convert legacy submission status to new status format
 */
export function normalizeSubmissionStatus(
  status: SubmissionStatus | LegacySubmissionStatus
): SubmissionStatus {
  const legacyMap: Record<string, SubmissionStatus> = {
    "DRAFT": "draft",
    "CHECKING": "submitted",
    "verifying": "submitted",
    "APPROVED": "approved",
    "NEEDS_CHANGES": "rejected",
    "REJECTED": "rejected",
    "verified": "approved",
    "promoted": "approved",
  };
  
  return legacyMap[status] ?? (status as SubmissionStatus);
}

/**
 * Generate artifact hash from DSL and TSX code for deduplication
 */
export function generateArtifactHash(dsl: UiDsl, tsx: string): string {
  const content = JSON.stringify({ dsl, tsx });
  return createHash("sha256").update(content).digest("hex");
}

export interface Submission {
  id: string;
  type: SubmissionType;
  dsl: UiDsl;
  tsx: string;
  stories?: string;
  status: SubmissionStatus | LegacySubmissionStatus; // Support both new and legacy statuses
  author: string;
  createdAt: string;
  updatedAt?: string;
  result?: SubmissionResult;
  checks?: SubmissionChecks; // New checks object for Milestone 6.3
  prompt?: string; // Optional prompt that generated this submission
  
  // Phase 2: Enhanced Submission Model
  revisionId?: string;        // Link to Revision entity (from studio-core)
  experimentId?: string;      // Link to Experiment for A/B testing
  variantKey?: string;        // Variant identifier for A/B testing (e.g., "control", "variant-a")
  artifactHash?: string;      // Hash of DSL+TSX for deduplication (SHA-256)
  
  // Phase 3: Origin Type - tracks how submission was created
  originType?: SubmissionOriginType;  // product | design | copilot | audit | r&d
  
  // Rejection tracking
  rejectedAt?: string;        // ISO 8601 timestamp
  rejectedBy?: string;        // User ID who rejected
  rejectionReason?: string;   // Reason for rejection
  
  // Approval tracking
  approvedAt?: string;        // ISO 8601 timestamp
  approvedBy?: string;        // User ID who approved
  
  // Phase 2: D3 - Review Interface
  reviewComments?: ReviewComment[];  // Inline comments on DSL/TSX
}

/**
 * Review Comment - inline comment on specific location in code/DSL
 * Phase 2: D3 - Review Interface
 */
export interface ReviewComment {
  id: string;
  createdAt: string;          // ISO 8601
  createdBy: string;          // User ID
  content: string;            // Comment text
  location?: {                // Optional location in code/DSL
    type: "code" | "dsl";     // Whether comment is on TSX code or DSL
    path?: string;            // JSONPath or line number
    line?: number;            // Line number (for code)
    column?: number;          // Column number (for code)
    startOffset?: number;     // Character offset start
    endOffset?: number;       // Character offset end
    selectedText?: string;    // Selected code snippet
  };
  resolved?: boolean;         // Whether comment is resolved
  resolvedAt?: string;        // ISO 8601
  resolvedBy?: string;        // User ID who resolved
  replies?: ReviewComment[];  // Nested replies
}

/**
 * Request Changes payload
 * Phase 2: D3 - Review Interface
 */
export interface RequestChangesPayload {
  comment: string;            // Main comment explaining requested changes
  comments?: ReviewComment[]; // Inline comments
  suggestions?: Array<{      // Optional patch suggestions
    type: "patch";
    patch: any;               // Patch operation
    description?: string;
  }>;
}

/**
 * Approve payload
 * Phase 2: D3 - Review Interface
 */
export interface ApprovePayload {
  comment?: string;           // Optional approval comment
}

/**
 * Create a new Submission with automatic artifact hash generation
 */
export function createSubmission(params: {
  type: SubmissionType;
  dsl: UiDsl;
  tsx: string;
  author: string;
  revisionId?: string;
  experimentId?: string;
  variantKey?: string;
  stories?: string;
  prompt?: string;
  originType?: SubmissionOriginType;  // Track how submission was created
}): Submission {
  const artifactHash = generateArtifactHash(params.dsl, params.tsx);
  
  // Auto-detect originType from context if not provided
  let originType = params.originType;
  if (!originType) {
    // If prompt is provided, it's likely from Copilot
    if (params.prompt) {
      originType = "copilot";
    }
    // If experimentId is provided, it's from R&D
    else if (params.experimentId) {
      originType = "r&d";
    }
    // Default to product (most common)
    else {
      originType = "product";
    }
  }
  
  return {
    id: randomUUID(),
    type: params.type,
    dsl: params.dsl,
    tsx: params.tsx,
    status: "draft",
    author: params.author,
    createdAt: new Date().toISOString(),
    artifactHash,
    revisionId: params.revisionId,
    experimentId: params.experimentId,
    variantKey: params.variantKey,
    stories: params.stories,
    prompt: params.prompt,
    originType,
  };
}

