/**
 * Enforcement Points
 * 
 * EPIC F: F3 - Enforcement Points
 * 
 * Provides enforcement at different points:
 * - Studio: Soft warnings (P0 blocks)
 * - Submissions: Hard gates
 * - Releases: Final gates
 */

import type { PolicyBundle } from "./policy-registry";
import type { RuleExecutionResult, RuleExecutionContext } from "./rule-engine";
import { getRulesFromBundles, executeRules } from "./index";

export type EnforcementPoint = "studio" | "submissions" | "releases";

export interface EnforcementResult {
  passed: boolean;
  errors: number;
  warnings: number;
  violations: Array<{
    ruleId: string;
    ruleName: string;
    severity: "error" | "warning" | "info";
    message: string;
    location?: any;
  }>;
  blocksApproval: boolean;
}

/**
 * Get policy bundles for an enforcement point
 */
function getBundlesForEnforcementPoint(point: EnforcementPoint): PolicyBundle[] {
  switch (point) {
    case "studio":
      return ["core-ds"]; // Only core rules in Studio (soft warnings)
    case "submissions":
      return ["core-ds", "enterprise"]; // Full enforcement in Submissions
    case "releases":
      return ["core-ds", "enterprise"]; // Full enforcement in Releases
    default:
      return ["core-ds"];
  }
}

/**
 * Enforce rules at a specific point
 */
export async function enforceAtPoint(
  point: EnforcementPoint,
  context: RuleExecutionContext,
  customBundles?: PolicyBundle[]
): Promise<EnforcementResult> {
  const bundles = customBundles || getBundlesForEnforcementPoint(point);
  const rules = getRulesFromBundles(bundles);

  // Execute all rules
  const results = await executeRules(rules, context);

  // Extract violations
  const allViolations = results.flatMap((r) =>
    r.violations.map((v) => ({
      ruleId: v.ruleId,
      ruleName: v.ruleName,
      severity: v.severity,
      message: v.message,
      location: v.location,
    }))
  );

  const errors = allViolations.filter((v) => v.severity === "error").length;
  const warnings = allViolations.filter((v) => v.severity === "warning").length;

  // Determine if approval is blocked
  // Studio: Never blocks (soft warnings only)
  // Submissions/Releases: Blocks on errors
  const blocksApproval =
    point !== "studio" && errors > 0;

  const passed = errors === 0;

  return {
    passed,
    errors,
    warnings,
    violations: allViolations,
    blocksApproval,
  };
}

/**
 * Enforce at Studio point (soft warnings)
 */
export async function enforceStudio(
  context: RuleExecutionContext,
  customBundles?: PolicyBundle[]
): Promise<EnforcementResult> {
  return enforceAtPoint("studio", context, customBundles);
}

/**
 * Enforce at Submissions point (hard gates)
 */
export async function enforceSubmissions(
  context: RuleExecutionContext,
  bundles?: PolicyBundle[]
): Promise<EnforcementResult> {
  return enforceAtPoint("submissions", context, bundles);
}

/**
 * Enforce at Releases point (final gates)
 */
export async function enforceReleases(
  context: RuleExecutionContext,
  bundles?: PolicyBundle[]
): Promise<EnforcementResult> {
  return enforceAtPoint("releases", context, bundles);
}

