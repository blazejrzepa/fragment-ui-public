/**
 * Ownership Management
 * 
 * EPIC F: F4 - Ownership + Exceptions
 * 
 * Manages component ownership and exception requests
 */

export interface ComponentOwner {
  componentId: string;
  ownerId: string;
  ownerName?: string;
  assignedAt: string; // ISO 8601
  assignedBy: string; // User ID
}

export interface ExceptionRequest {
  id: string;
  componentId: string;
  ruleId: string;
  reason: string;
  requestedBy: string; // User ID
  requestedAt: string; // ISO 8601
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string; // User ID
  reviewedAt?: string; // ISO 8601
  reviewComment?: string;
}

/**
 * Ownership Registry (simple in-memory implementation)
 * In production, this would be persisted
 */
class OwnershipRegistry {
  private owners: Map<string, ComponentOwner> = new Map();
  private exceptions: Map<string, ExceptionRequest> = new Map();

  /**
   * Assign owner to component
   */
  assignOwner(componentId: string, ownerId: string, assignedBy: string, ownerName?: string): void {
    this.owners.set(componentId, {
      componentId,
      ownerId,
      ownerName,
      assignedAt: new Date().toISOString(),
      assignedBy,
    });
  }

  /**
   * Get owner for component
   */
  getOwner(componentId: string): ComponentOwner | undefined {
    return this.owners.get(componentId);
  }

  /**
   * Remove owner from component
   */
  removeOwner(componentId: string): void {
    this.owners.delete(componentId);
  }

  /**
   * Request exception for a rule
   */
  requestException(
    componentId: string,
    ruleId: string,
    reason: string,
    requestedBy: string
  ): ExceptionRequest {
    const exception: ExceptionRequest = {
      id: `exc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      componentId,
      ruleId,
      reason,
      requestedBy,
      requestedAt: new Date().toISOString(),
      status: "pending",
    };

    this.exceptions.set(exception.id, exception);
    return exception;
  }

  /**
   * Get exception request
   */
  getException(exceptionId: string): ExceptionRequest | undefined {
    return this.exceptions.get(exceptionId);
  }

  /**
   * Get exceptions for component
   */
  getExceptionsForComponent(componentId: string): ExceptionRequest[] {
    return Array.from(this.exceptions.values()).filter(
      (exc) => exc.componentId === componentId
    );
  }

  /**
   * Get approved exceptions for component and rule
   */
  getApprovedException(componentId: string, ruleId: string): ExceptionRequest | undefined {
    return Array.from(this.exceptions.values()).find(
      (exc) =>
        exc.componentId === componentId &&
        exc.ruleId === ruleId &&
        exc.status === "approved"
    );
  }

  /**
   * Review exception request
   */
  reviewException(
    exceptionId: string,
    status: "approved" | "rejected",
    reviewedBy: string,
    reviewComment?: string
  ): ExceptionRequest | undefined {
    const exception = this.exceptions.get(exceptionId);
    if (!exception) return undefined;

    exception.status = status;
    exception.reviewedBy = reviewedBy;
    exception.reviewedAt = new Date().toISOString();
    exception.reviewComment = reviewComment;

    return exception;
  }
}

// Singleton instance
export const ownershipRegistry = new OwnershipRegistry();

