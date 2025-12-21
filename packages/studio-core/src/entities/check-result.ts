/**
 * CheckResult entity - quality check results
 */

export type CheckType = 
  | "a11y" 
  | "lint" 
  | "tokens" 
  | "forbiddenHtml" 
  | "bundle" 
  | "perfBudget";

export type CheckStatus = "pass" | "fail" | "warning" | "error";

export interface CheckViolation {
  rule: string;
  severity: "error" | "warning" | "info";
  message: string;
  location?: {
    file?: string;
    line?: number;
    column?: number;
  };
  fix?: string;                  // Suggested fix
}

export interface CheckResult {
  checkId: string;               // UUID v4
  revisionId: string;           // References Revision.revisionId
  checkType: CheckType;
  status: CheckStatus;
  message?: string;
  violations?: CheckViolation[];
  metadata?: Record<string, any>;
  createdAt: string;             // ISO 8601
  checkDuration?: number;         // milliseconds
}

