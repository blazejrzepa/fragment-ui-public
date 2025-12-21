/**
 * Forbidden Dependencies Rule
 * 
 * Enforces allowed/forbidden imports
 */

import type { PolicyRule } from "../policy-registry";
import type { RuleViolation, RuleExecutionResult } from "../rule-engine";

/**
 * Execute forbidden deps rule
 */
export function executeForbiddenDepsRule(
  rule: PolicyRule,
  tsx: string
): RuleExecutionResult {
  const violations: RuleViolation[] = [];

  const config = rule.config || {};
  const allowed = config.allowed || ["@fragment_ui/ui", "@fragment_ui/blocks"];
  const forbidden = config.forbidden || [];

  // Extract import statements
  const importRegex = /^import\s+.*?\s+from\s+['"]([^'"]+)['"]/gm;
  const lines = tsx.split("\n");

  lines.forEach((line, lineIndex) => {
    const matches = Array.from(line.matchAll(importRegex));
    
    for (const match of matches) {
      const importPath = match[1];
      
      // Check if import is allowed
      const isAllowed = allowed.some((pattern: string) => {
        if (pattern.endsWith("*")) {
          const prefix = pattern.slice(0, -1);
          return importPath.startsWith(prefix);
        }
        return importPath === pattern;
      });

      // Check if import is forbidden
      const isForbidden = forbidden.some((pattern: string) => {
        if (pattern === "*") {
          // All imports are forbidden except allowed
          return !isAllowed;
        }
        if (pattern.endsWith("*")) {
          const prefix = pattern.slice(0, -1);
          return importPath.startsWith(prefix);
        }
        return importPath === pattern;
      });

      if (isForbidden || (!isAllowed && forbidden.length === 0)) {
        violations.push({
          ruleId: rule.id,
          ruleName: rule.name,
          severity: rule.severity as "error" | "warning" | "info",
          message: `Forbidden import: ${importPath}. Allowed imports: ${allowed.join(", ")}`,
          location: {
            file: "submission.tsx",
            line: lineIndex + 1,
          },
          fix: {
            description: `Remove or replace import from ${importPath}`,
            autoFixable: false,
          },
        });
      }
    }
  });

  return {
    ruleId: rule.id,
    passed: violations.length === 0,
    violations,
  };
}

