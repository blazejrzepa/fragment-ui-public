/**
 * Tests Rule
 * 
 * Enforces test presence (story, unit, or both)
 */

import type { PolicyRule } from "../policy-registry";
import type { RuleViolation, RuleExecutionResult } from "../rule-engine";
import { hasStorybookStory } from "./test-presence-utils";

/**
 * Execute tests rule
 */
export function executeTestsRule(
  rule: PolicyRule,
  storiesCode?: string,
  componentName?: string
): RuleExecutionResult {
  const violations: RuleViolation[] = [];

  const config = rule.config || {};
  const requireStory = config.requireStory === true;
  const requireUnit = config.requireUnit === true;
  const requireEither = config.requireEither !== false; // Default true

  // Check if component has Storybook story:
  // 1. First check if storiesCode was provided (explicit story code)
  // 2. If not, check if component is known to have a storybook story in the system
  const hasStoryFromCode = !!storiesCode && storiesCode.trim().length > 0;
  const hasStoryFromSystem = componentName ? hasStorybookStory(componentName) : false;
  const hasStory = hasStoryFromCode || hasStoryFromSystem;
  
  const hasUnit = false; // Unit tests detection would need file system access

  // Check requirements
  if (requireStory && !hasStory) {
    violations.push({
      ruleId: rule.id,
      ruleName: rule.name,
      severity: rule.severity as "error" | "warning" | "info",
      message: "Component must have a Storybook story",
      location: {
        file: "stories.tsx",
      },
      fix: {
        description: "Create a Storybook story for this component",
        autoFixable: false,
      },
    });
  }

  if (requireUnit && !hasUnit) {
    violations.push({
      ruleId: rule.id,
      ruleName: rule.name,
      severity: rule.severity as "error" | "warning" | "info",
      message: "Component must have unit tests",
      location: {
        file: `${componentName || "component"}.test.tsx`,
      },
      fix: {
        description: "Create unit tests for this component",
        autoFixable: false,
      },
    });
  }

  if (requireEither && !hasStory && !hasUnit) {
    violations.push({
      ruleId: rule.id,
      ruleName: rule.name,
      severity: rule.severity as "error" | "warning" | "info",
      message: "Component must have either a Storybook story or unit tests",
      location: {
        file: "tests",
      },
      fix: {
        description: "Add either a Storybook story or unit tests",
        autoFixable: false,
      },
    });
  }

  return {
    ruleId: rule.id,
    passed: violations.length === 0,
    violations,
    metadata: {
      hasStory,
      hasUnit,
    },
  };
}

