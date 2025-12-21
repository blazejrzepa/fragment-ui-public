/**
 * Governance Integration
 * 
 * Helper functions to integrate Governance with existing quality checks
 */

import type { SubmissionChecks } from "../../../app/submissions/types";
import type { RuleExecutionResult, RuleExecutionContext } from "./rule-engine";
import type { PolicyBundle } from "./policy-registry";
import { executeRules } from "./rule-engine";
import { getRulesFromBundles } from "./index";

/**
 * Calculate bundle size from TSX code
 */
export function calculateBundleSize(tsx: string): { size: number; gzipped: number } {
  const size = new Blob([tsx]).size;
  // Rough gzip estimate (typically 30-35% of original)
  const gzipped = Math.floor(tsx.length * 0.35);
  return { size, gzipped };
}

/**
 * Extract component name from TSX code
 */
export function extractComponentName(tsx: string): string | undefined {
  const match = tsx.match(/export\s+(?:default\s+)?(?:function|const)\s+(\w+)/);
  return match ? match[1] : undefined;
}

/**
 * Convert Governance Rule Execution Results to SubmissionChecks format
 */
export function convertGovernanceResultsToSubmissionChecks(
  results: RuleExecutionResult[],
  existingChecks?: SubmissionChecks
): Partial<SubmissionChecks> {
  const checks: Partial<SubmissionChecks> = existingChecks ? { ...existingChecks } : {};

  // Group violations by rule type
  const violationsByType: Record<string, RuleExecutionResult[]> = {};

  for (const result of results) {
    // Extract rule type from ruleId (e.g., "no-raw-elements" -> "lint")
    const ruleType = result.ruleId.includes("raw") || result.ruleId.includes("imports")
      ? "lint"
      : result.ruleId.includes("a11y")
      ? "a11y"
      : result.ruleId.includes("bundle")
      ? "bundle"
      : result.ruleId.includes("test")
      ? "tests"
      : "lint";

    if (!violationsByType[ruleType]) {
      violationsByType[ruleType] = [];
    }
    violationsByType[ruleType].push(result);
  }

  // Update lint checks
  if (violationsByType.lint) {
    const lintViolations = violationsByType.lint.flatMap((r) => r.violations);
    const errors = lintViolations.filter((v) => v.severity === "error").length;
    const warnings = lintViolations.filter((v) => v.severity === "warning").length;

    checks.lint = {
      ...(checks.lint || { errors: 0, warnings: 0, issues: [], passed: true }),
      errors: (checks.lint?.errors || 0) + errors,
      warnings: (checks.lint?.warnings || 0) + warnings,
      issues: [
        ...(checks.lint?.issues || []),
        ...lintViolations.map((v) => ({
          line: v.location?.line || 0,
          column: v.location?.column,
          message: v.message,
          rule: v.ruleId,
        })),
      ],
      passed: errors === 0 && (checks.lint?.passed !== false),
    };
  }

  // Update a11y checks
  if (violationsByType.a11y) {
    const a11yViolations = violationsByType.a11y.flatMap((r) => r.violations);

    checks.a11y = {
      ...(checks.a11y || { violations: 0, issues: [], passed: true }),
      violations: (checks.a11y?.violations || 0) + a11yViolations.length,
      issues: [
        ...(checks.a11y?.issues || []),
        ...a11yViolations.map((v) => ({
          id: v.ruleId,
          impact: v.severity === "error" ? "critical" : "moderate",
          description: v.message,
          help: v.fix?.description,
        })),
      ],
      passed: a11yViolations.filter((v) => v.severity === "error").length === 0 && (checks.a11y?.passed !== false),
    };
  }

  // Update bundle checks
  if (violationsByType.bundle) {
    const bundleViolations = violationsByType.bundle.flatMap((r) => r.violations);

    checks.bundle = {
      ...(checks.bundle || { violations: 0, issues: [], passed: true }),
      violations: (checks.bundle?.violations || 0) + bundleViolations.filter((v) => v.severity === "error").length,
      issues: [
        ...(checks.bundle?.issues || []),
        ...bundleViolations.map((v) => ({
          rule: v.ruleId,
          message: v.message,
          severity: v.severity as "error" | "warning",
          location: v.location,
        })),
      ],
      passed: bundleViolations.filter((v) => v.severity === "error").length === 0 && (checks.bundle?.passed !== false),
    };
  }

  // Update tests checks
  if (violationsByType.tests) {
    const testsViolations = violationsByType.tests.flatMap((r) => r.violations);

    checks.tests = {
      ...(checks.tests || { violations: 0, issues: [], passed: true }),
      violations: (checks.tests?.violations || 0) + testsViolations.length,
      issues: [
        ...(checks.tests?.issues || []),
        ...testsViolations.map((v) => ({
          type: "unit" as const,
          component: v.location?.file || "unknown",
          message: v.message,
        })),
      ],
      passed: testsViolations.length === 0 && (checks.tests?.passed !== false),
      hasStory: (checks.tests?.hasStory || false) && testsViolations.length === 0,
      hasUnit: (checks.tests?.hasUnit || false) && testsViolations.length === 0,
    };
  }

  return checks;
}

/**
 * Run Governance checks and merge with existing SubmissionChecks
 */
export async function runGovernanceChecks(
  dsl: any,
  tsx: string,
  storiesCode: string | undefined,
  bundles: PolicyBundle[] = ["core-ds"],
  existingChecks?: SubmissionChecks
): Promise<{ checks: SubmissionChecks; governanceResults: RuleExecutionResult[] }> {
  // Get rules from bundles
  const rules = getRulesFromBundles(bundles);

  // Calculate bundle size
  const { size, gzipped } = calculateBundleSize(tsx);

  // Extract component name
  const componentName = extractComponentName(tsx);

  // Create execution context
  const context: RuleExecutionContext = {
    dsl,
    tsx,
    bundleSize: size,
    bundleGzipped: gzipped,
    storiesCode,
    componentName,
  };

  // Execute all rules
  const governanceResults = await executeRules(rules, context);

  // Convert to SubmissionChecks format
  const governanceChecks = convertGovernanceResultsToSubmissionChecks(
    governanceResults,
    existingChecks
  );

  // Merge with existing checks
  const mergedChecks: SubmissionChecks = {
    a11y: governanceChecks.a11y || existingChecks?.a11y || {
      violations: 0,
      issues: [],
      passed: true,
    },
    lint: governanceChecks.lint || existingChecks?.lint || {
      errors: 0,
      warnings: 0,
      issues: [],
      passed: true,
    },
    bundle: governanceChecks.bundle || existingChecks?.bundle || {
      violations: 0,
      issues: [],
      passed: true,
      size,
      gzipped,
    },
    tests: governanceChecks.tests || existingChecks?.tests || {
      violations: 0,
      issues: [],
      passed: true,
    },
    acl: existingChecks?.acl || {
      violations: 0,
      issues: [],
      passed: true,
    },
    synthetic: existingChecks?.synthetic || {
      score: 100,
      failures: [],
      passed: true,
    },
  };

  return {
    checks: mergedChecks,
    governanceResults,
  };
}

