/**
 * Lifecycle state machine for Assets and Revisions
 */

export type LifecycleState = 
  | "draft"           // Created in Studio, not yet submitted
  | "submitted"       // Submitted for review
  | "approved"        // Approved for release
  | "published"       // Published in Releases
  | "deprecated";     // Superseded by newer version

export interface LifecycleTransition {
  from: LifecycleState;
  to: LifecycleState;
  timestamp: string;  // ISO 8601
  userId: string;
  reason?: string;
}

export const LIFECYCLE_STATES: LifecycleState[] = [
  "draft",
  "submitted",
  "approved",
  "published",
  "deprecated"
];

export function isValidTransition(
  from: LifecycleState,
  to: LifecycleState
): boolean {
  const validTransitions: Record<LifecycleState, LifecycleState[]> = {
    draft: ["submitted"],
    submitted: ["approved", "draft"],
    approved: ["published"],
    published: ["deprecated"],
    deprecated: []
  };
  
  return validTransitions[from]?.includes(to) ?? false;
}

