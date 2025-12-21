/**
 * Bundle Rule
 * 
 * Enforces bundle size limits
 */

import type { PolicyRule } from "../policy-registry";
import type { RuleViolation, RuleExecutionResult } from "../rule-engine";

/**
 * Execute bundle rule
 */
export function executeBundleRule(
  rule: PolicyRule,
  bundleSize: number,
  bundleGzipped?: number
): RuleExecutionResult {
  const violations: RuleViolation[] = [];

  const config = rule.config || {};
  const maxSize = config.maxSize || 100 * 1024; // Default 100KB
  const maxGzipped = config.maxGzipped || 50 * 1024; // Default 50KB

  // Check bundle size
  if (bundleSize > maxSize) {
    const sizeKB = (bundleSize / 1024).toFixed(2);
    const maxKB = (maxSize / 1024).toFixed(2);
    
    violations.push({
      ruleId: rule.id,
      ruleName: rule.name,
      severity: rule.severity as "error" | "warning" | "info",
      message: `Bundle size ${sizeKB}KB exceeds limit of ${maxKB}KB`,
      location: {
        file: "bundle",
      },
      fix: {
        description: `Reduce bundle size by ${(bundleSize - maxSize) / 1024}KB`,
        autoFixable: false,
      },
    });
  }

  // Check gzipped size if available
  if (bundleGzipped !== undefined && bundleGzipped > maxGzipped) {
    const gzippedKB = (bundleGzipped / 1024).toFixed(2);
    const maxGzippedKB = (maxGzipped / 1024).toFixed(2);
    
    violations.push({
      ruleId: rule.id,
      ruleName: rule.name,
      severity: rule.severity as "error" | "warning" | "info",
      message: `Gzipped bundle size ${gzippedKB}KB exceeds limit of ${maxGzippedKB}KB`,
      location: {
        file: "bundle",
      },
      fix: {
        description: `Reduce gzipped bundle size by ${(bundleGzipped - maxGzipped) / 1024}KB`,
        autoFixable: false,
      },
    });
  }

  return {
    ruleId: rule.id,
    passed: violations.length === 0,
    violations,
    metadata: {
      bundleSize,
      bundleGzipped,
      maxSize,
      maxGzipped,
    },
  };
}

