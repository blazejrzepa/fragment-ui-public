/**
 * Exception Management
 * 
 * EPIC F: F4 - Ownership + Exceptions
 * 
 * Manages exception requests and approvals
 */

import { ownershipRegistry, type ExceptionRequest } from "./ownership";
import { logAudit } from "./audit";

/**
 * Request an exception for a rule violation
 */
export function requestException(
  componentId: string,
  ruleId: string,
  reason: string,
  userId: string
): ExceptionRequest {
  const exception = ownershipRegistry.requestException(
    componentId,
    ruleId,
    reason,
    userId
  );

  logAudit({
    action: "exception_requested",
    userId,
    entityType: "component",
    entityId: componentId,
    metadata: {
      ruleId,
      reason,
      exceptionId: exception.id,
    },
  });

  return exception;
}

/**
 * Approve an exception
 */
export function approveException(
  exceptionId: string,
  reviewedBy: string,
  reviewComment?: string
): ExceptionRequest | undefined {
  const exception = ownershipRegistry.reviewException(
    exceptionId,
    "approved",
    reviewedBy,
    reviewComment
  );

  if (exception) {
    logAudit({
      action: "exception_approved",
      userId: reviewedBy,
      entityType: "component",
      entityId: exception.componentId,
      metadata: {
        ruleId: exception.ruleId,
        exceptionId: exception.id,
        reviewComment,
      },
    });
  }

  return exception;
}

/**
 * Reject an exception
 */
export function rejectException(
  exceptionId: string,
  reviewedBy: string,
  reviewComment?: string
): ExceptionRequest | undefined {
  const exception = ownershipRegistry.reviewException(
    exceptionId,
    "rejected",
    reviewedBy,
    reviewComment
  );

  if (exception) {
    logAudit({
      action: "exception_rejected",
      userId: reviewedBy,
      entityType: "component",
      entityId: exception.componentId,
      metadata: {
        ruleId: exception.ruleId,
        exceptionId: exception.id,
        reviewComment,
      },
    });
  }

  return exception;
}

/**
 * Check if component has approved exception for a rule
 */
export function hasApprovedException(
  componentId: string,
  ruleId: string
): boolean {
  const exception = ownershipRegistry.getApprovedException(componentId, ruleId);
  return exception !== undefined;
}

/**
 * Get all exceptions for a component
 */
export function getExceptionsForComponent(
  componentId: string
): ExceptionRequest[] {
  return ownershipRegistry.getExceptionsForComponent(componentId);
}

