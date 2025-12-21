/**
 * Tokens Rule
 * 
 * Enforces use of design tokens instead of hardcoded colors/values
 */

import type { PolicyRule } from "../policy-registry";
import type { RuleViolation, RuleExecutionResult } from "../rule-engine";

/**
 * Execute tokens rule
 */
export function executeTokensRule(
  rule: PolicyRule,
  tsx: string
): RuleExecutionResult {
  const violations: RuleViolation[] = [];

  // Check for hardcoded color values (hex, rgb, rgba)
  const colorPatterns = [
    /#[0-9a-fA-F]{3,6}\b/g, // Hex colors
    /rgb\s*\([^)]+\)/g, // rgb()
    /rgba\s*\([^)]+\)/g, // rgba()
  ];

  const lines = tsx.split("\n");
  
  colorPatterns.forEach((pattern, patternIndex) => {
    lines.forEach((line, lineIndex) => {
      const matches = line.matchAll(pattern);
      for (const match of matches) {
        // Allow colors in comments
        if (line.trim().startsWith("//") || line.includes("/*")) {
          continue;
        }
        
        violations.push({
          ruleId: rule.id,
          ruleName: rule.name,
          severity: rule.severity as "error" | "warning" | "info",
          message: `Hardcoded color value found: ${match[0]}. Use design tokens instead.`,
          location: {
            file: "submission.tsx",
            line: lineIndex + 1,
            column: (match.index || 0) + 1,
          },
          fix: {
            description: `Replace ${match[0]} with a design token`,
            autoFixable: false, // Cannot auto-fix without knowing intent
          },
        });
      }
    });
  });

  return {
    ruleId: rule.id,
    passed: violations.length === 0,
    violations,
  };
}

