/**
 * Governance Module
 * 
 * EPIC F: Governance (Policies + Enforcement)
 * 
 * Exports all governance-related functionality
 */

export * from "./policy-registry";
export * from "./rule-engine";
export * from "./enforcement";
export * from "./ownership";
export * from "./exceptions";
export * from "./audit";
export * from "./integration";

export { executeRule, executeRules, getAllViolations, getErrors, hasErrors } from "./rule-engine";
export { enforceStudio, enforceSubmissions, enforceReleases } from "./enforcement";
export { ownershipRegistry } from "./ownership";
export { auditLogger, logAudit } from "./audit";
export { requestException, approveException, rejectException, hasApprovedException } from "./exceptions";

export type { PolicyRule, Policy, PolicyBundle, RuleType, RuleSeverity } from "./policy-registry";
export type { RuleViolation, RuleExecutionResult, RuleExecutionContext } from "./rule-engine";
export type { EnforcementResult, EnforcementPoint } from "./enforcement";
export type { ComponentOwner, ExceptionRequest } from "./ownership";
export type { AuditAction, AuditLogEntry } from "./audit";

