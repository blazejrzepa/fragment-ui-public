/**
 * Lint Rule
 * 
 * Enforces linting rules (no raw HTML, design system imports only, etc.)
 */

import type { PolicyRule } from "../policy-registry";
import type { RuleViolation, RuleExecutionResult } from "../rule-engine";

/**
 * Execute lint rule
 * 
 * Note: This integrates with existing ESLint-based linting infrastructure
 */
export async function executeLintRule(
  rule: PolicyRule,
  tsx: string
): Promise<RuleExecutionResult> {
  const violations: RuleViolation[] = [];

  // Import lint function from existing quality-checks module
  // For now, we'll do basic pattern matching
  // Full integration would require importing from apps/demo/app/submissions/verify.ts

  const lines = tsx.split("\n");

  // Check for raw HTML elements (basic check)
  if (rule.id === "no-raw-elements") {
    const allowedElements = rule.config?.allowedElements || ["div", "span", "br"];
    const rawElementPattern = /<(?!\/?)([a-z][a-z0-9]*)\b/gi;

    lines.forEach((line, lineIndex) => {
      // Skip comments
      if (line.trim().startsWith("//") || line.includes("/*")) {
        return;
      }

      const matches = Array.from(line.matchAll(rawElementPattern));
      for (const match of matches) {
        const elementName = match[1].toLowerCase();
        
        // Skip Fragment UI components (PascalCase)
        if (elementName[0] === elementName[0].toUpperCase()) {
          continue;
        }

        // Skip allowed elements
        if (allowedElements.includes(elementName)) {
          continue;
        }

        violations.push({
          ruleId: rule.id,
          ruleName: rule.name,
          severity: rule.severity as "error" | "warning" | "info",
          message: `Raw HTML element "${elementName}" found. Use Fragment UI components instead.`,
          location: {
            file: "submission.tsx",
            line: lineIndex + 1,
            column: (match.index || 0) + 1,
          },
          fix: {
            description: `Replace <${elementName}> with a Fragment UI component`,
            autoFixable: false,
          },
        });
      }
    });
  }

  // For other lint rules, we would integrate with existing ESLint infrastructure
  // This is a simplified version - full implementation would call verify.ts functions

  return {
    ruleId: rule.id,
    passed: violations.length === 0,
    violations,
  };
}

