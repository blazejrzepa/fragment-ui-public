/**
 * Rule Engine
 * 
 * EPIC F: F2 - Rule Engine
 * 
 * Executes rules on DSL/TSX, returns violations, supports auto-fix suggestions.
 */

import type { PolicyRule } from "./policy-registry";
import type { UiDsl } from "../../../app/studio/dsl/types";
import { executeLintRule } from "./rules/lint-rule";
import { executeA11yRule } from "./rules/a11y-rule";
import { executeBundleRule } from "./rules/bundle-rule";
import { executeForbiddenDepsRule } from "./rules/forbidden-deps-rule";
import { executeTokensRule } from "./rules/tokens-rule";
import { executeTestsRule } from "./rules/tests-rule";

export type ViolationSeverity = "error" | "warning" | "info";

export interface RuleViolation {
  ruleId: string;
  ruleName: string;
  severity: ViolationSeverity;
  message: string;
  location?: {
    file?: string;
    line?: number;
    column?: number;
    path?: string; // JSONPath for DSL
  };
  fix?: {
    description: string;
    patch?: any; // Patch operation or code fix
    autoFixable: boolean;
  };
}

export interface RuleExecutionResult {
  ruleId: string;
  passed: boolean;
  violations: RuleViolation[];
  metadata?: Record<string, any>;
}

export interface RuleExecutionContext {
  dsl?: UiDsl;
  tsx?: string;
  bundleSize?: number;
  bundleGzipped?: number;
  storiesCode?: string;
  componentName?: string;
}

/**
 * Execute a single rule
 */
export async function executeRule(
  rule: PolicyRule,
  context: RuleExecutionContext
): Promise<RuleExecutionResult> {
  const violations: RuleViolation[] = [];

  try {
    switch (rule.type) {
      case "lint":
        if (context.tsx) {
          const result = await executeLintRule(rule, context.tsx);
          violations.push(...result.violations);
        }
        break;

      case "a11y":
        if (context.tsx && context.dsl) {
          const result = await executeA11yRule(rule, context.tsx, context.dsl);
          violations.push(...result.violations);
        }
        break;

      case "bundle":
        if (context.bundleSize !== undefined) {
          const result = executeBundleRule(rule, context.bundleSize, context.bundleGzipped);
          violations.push(...result.violations);
        }
        break;

      case "forbidden-deps":
        if (context.tsx) {
          const result = executeForbiddenDepsRule(rule, context.tsx);
          violations.push(...result.violations);
        }
        break;

      case "tokens":
        if (context.tsx) {
          const result = executeTokensRule(rule, context.tsx);
          violations.push(...result.violations);
        }
        break;

      case "tests":
        const result = executeTestsRule(rule, context.storiesCode, context.componentName);
        violations.push(...result.violations);
        break;

      default:
        console.warn(`[Rule Engine] Unknown rule type: ${rule.type}`);
    }
  } catch (error: any) {
    console.error(`[Rule Engine] Error executing rule ${rule.id}:`, error);
    violations.push({
      ruleId: rule.id,
      ruleName: rule.name,
      severity: "error",
      message: `Rule execution failed: ${error.message}`,
    });
  }

  // Determine if rule passed (no errors, warnings may be allowed)
  const hasErrors = violations.some((v) => v.severity === "error");
  const passed = !hasErrors && violations.length === 0;

  return {
    ruleId: rule.id,
    passed,
    violations,
  };
}

/**
 * Execute multiple rules
 */
export async function executeRules(
  rules: PolicyRule[],
  context: RuleExecutionContext
): Promise<RuleExecutionResult[]> {
  const results = await Promise.all(
    rules.map((rule) => executeRule(rule, context))
  );
  return results;
}

/**
 * Get all violations from rule execution results
 */
export function getAllViolations(results: RuleExecutionResult[]): RuleViolation[] {
  return results.flatMap((r) => r.violations);
}

/**
 * Get errors only (blocking violations)
 */
export function getErrors(results: RuleExecutionResult[]): RuleViolation[] {
  return getAllViolations(results).filter((v) => v.severity === "error");
}

/**
 * Get warnings
 */
export function getWarnings(results: RuleExecutionResult[]): RuleViolation[] {
  return getAllViolations(results).filter((v) => v.severity === "warning");
}

/**
 * Check if any errors exist (blocks approval)
 */
export function hasErrors(results: RuleExecutionResult[]): boolean {
  return getErrors(results).length > 0;
}

/**
 * Get auto-fixable violations
 */
export function getAutoFixableViolations(results: RuleExecutionResult[]): RuleViolation[] {
  return getAllViolations(results).filter(
    (v) => v.fix?.autoFixable === true
  );
}

