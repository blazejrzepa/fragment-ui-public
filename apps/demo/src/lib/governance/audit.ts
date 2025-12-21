/**
 * Audit Logging
 * 
 * EPIC F: F4 - Ownership + Exceptions
 * 
 * Tracks all governance actions for audit purposes
 */

export type AuditAction =
  | "rule_executed"
  | "rule_violation"
  | "exception_requested"
  | "exception_approved"
  | "exception_rejected"
  | "owner_assigned"
  | "owner_removed"
  | "policy_applied"
  | "enforcement_blocked";

export interface AuditLogEntry {
  id: string;
  timestamp: string; // ISO 8601
  action: AuditAction;
  userId: string;
  entityType: "component" | "submission" | "rule" | "policy";
  entityId: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Audit Logger
 * 
 * Simple in-memory implementation.
 * In production, this would write to persistent storage (DB, file, etc.)
 */
class AuditLogger {
  private logs: AuditLogEntry[] = [];
  private maxLogs = 10000; // Keep last 10k entries in memory

  /**
   * Log an audit event
   */
  log(entry: Omit<AuditLogEntry, "id" | "timestamp">): void {
    const logEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    this.logs.push(logEntry);

    // Keep only last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  /**
   * Get logs for an entity
   */
  getLogsForEntity(entityType: string, entityId: string): AuditLogEntry[] {
    return this.logs.filter(
      (log) => log.entityType === entityType && log.entityId === entityId
    );
  }

  /**
   * Get logs for an action
   */
  getLogsForAction(action: AuditAction): AuditLogEntry[] {
    return this.logs.filter((log) => log.action === action);
  }

  /**
   * Get logs for a user
   */
  getLogsForUser(userId: string): AuditLogEntry[] {
    return this.logs.filter((log) => log.userId === userId);
  }

  /**
   * Get all logs (for admin/debugging)
   */
  getAllLogs(): AuditLogEntry[] {
    return [...this.logs];
  }

  /**
   * Clear logs (for testing)
   */
  clear(): void {
    this.logs = [];
  }
}

// Singleton instance
export const auditLogger = new AuditLogger();

/**
 * Helper function to log audit events
 */
export function logAudit(entry: Omit<AuditLogEntry, "id" | "timestamp">): void {
  auditLogger.log(entry);
}

