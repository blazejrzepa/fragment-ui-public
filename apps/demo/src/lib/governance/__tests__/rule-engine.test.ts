/**
 * Tests for Rule Engine
 */

import { describe, it, expect } from "vitest";
import {
  executeRule,
  executeRules,
  getAllViolations,
  getErrors,
  getWarnings,
  hasErrors,
} from "../rule-engine";
import { getRulesFromBundle } from "../policy-registry";
import type { PolicyRule, RuleExecutionContext } from "../rule-engine";

describe("Rule Engine", () => {
  const mockContext: RuleExecutionContext = {
    tsx: `
      import { Button } from "@fragment_ui/ui";
      
      export function TestComponent() {
        return <Button>Click me</Button>;
      }
    `,
    dsl: {
      type: "page",
      id: "test-page",
      sections: [],
    },
    bundleSize: 5000,
    bundleGzipped: 2000,
    storiesCode: `
      export default {
        component: TestComponent,
      };
    `,
    componentName: "TestComponent",
  };

  it("should execute a rule", async () => {
    const rules = getRulesFromBundle("core-ds");
    expect(rules.length).toBeGreaterThan(0);
    
    const result = await executeRule(rules[0], mockContext);
    expect(result).toBeDefined();
    expect(result.ruleId).toBe(rules[0].id);
    expect(result.passed).toBeDefined();
    expect(Array.isArray(result.violations)).toBe(true);
  });

  it("should execute multiple rules", async () => {
    const rules = getRulesFromBundle("core-ds");
    const results = await executeRules(rules.slice(0, 3), mockContext);
    
    expect(results.length).toBe(3);
    results.forEach((result) => {
      expect(result.ruleId).toBeDefined();
      expect(result.passed).toBeDefined();
      expect(Array.isArray(result.violations)).toBe(true);
    });
  });

  it("should extract all violations", async () => {
    const rules = getRulesFromBundle("core-ds");
    const results = await executeRules(rules.slice(0, 2), mockContext);
    const violations = getAllViolations(results);
    
    expect(Array.isArray(violations)).toBe(true);
    violations.forEach((violation) => {
      expect(violation.ruleId).toBeDefined();
      expect(violation.message).toBeDefined();
      expect(violation.severity).toBeDefined();
    });
  });

  it("should extract only errors", async () => {
    const rules = getRulesFromBundle("core-ds");
    const results = await executeRules(rules.slice(0, 2), mockContext);
    const errors = getErrors(results);
    
    expect(Array.isArray(errors)).toBe(true);
    errors.forEach((error) => {
      expect(error.severity).toBe("error");
    });
  });

  it("should extract only warnings", async () => {
    const rules = getRulesFromBundle("core-ds");
    const results = await executeRules(rules.slice(0, 2), mockContext);
    const warnings = getWarnings(results);
    
    expect(Array.isArray(warnings)).toBe(true);
    warnings.forEach((warning) => {
      expect(["warning", "info"]).toContain(warning.severity);
    });
  });

  it("should detect if errors exist", async () => {
    const rules = getRulesFromBundle("core-ds");
    const results = await executeRules(rules.slice(0, 2), mockContext);
    const hasErrs = hasErrors(results);
    
    expect(typeof hasErrs).toBe("boolean");
  });

  it("should handle missing context gracefully", async () => {
    const rules = getRulesFromBundle("core-ds");
    const emptyContext: RuleExecutionContext = {};
    
    // Should not throw, but may return violations for missing data
    const results = await executeRules(rules.slice(0, 1), emptyContext);
    expect(results.length).toBe(1);
    expect(results[0].violations).toBeDefined();
  });
});

