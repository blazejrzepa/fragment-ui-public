/**
 * Tests for Policy Registry
 */

import { describe, it, expect } from "vitest";
import {
  policyRegistry,
  getPolicy,
  getRulesFromBundle,
  getRulesFromBundles,
  CORE_DS_POLICY,
  ENTERPRISE_POLICY,
  MARKETING_POLICY,
} from "../policy-registry";
import type { PolicyBundle } from "../policy-registry";

describe("Policy Registry", () => {
  it("should register and retrieve policies", () => {
    const policy = getPolicy("core-ds");
    expect(policy).toBeDefined();
    expect(policy?.id).toBe("core-ds");
    expect(policy?.bundle).toBe("core-ds");
  });

  it("should list all policies", () => {
    const policies = policyRegistry.list();
    expect(policies.length).toBeGreaterThan(0);
    expect(policies.some((p) => p.id === "core-ds")).toBe(true);
  });

  it("should get rules from a bundle", () => {
    const rules = getRulesFromBundle("core-ds");
    expect(rules.length).toBeGreaterThan(0);
    expect(rules.every((r) => r.enabled)).toBe(true);
  });

  it("should get rules from multiple bundles", () => {
    const rules = getRulesFromBundles(["core-ds", "enterprise"]);
    expect(rules.length).toBeGreaterThan(0);
    
    // Should have rules from both bundles
    const coreRules = rules.filter((r) => 
      CORE_DS_POLICY.rules.some((cr) => cr.id === r.id)
    );
    const enterpriseRules = rules.filter((r) =>
      ENTERPRISE_POLICY.rules.some((er) => er.id === r.id)
    );
    
    expect(coreRules.length).toBeGreaterThan(0);
    expect(enterpriseRules.length).toBeGreaterThan(0);
  });

  it("should not duplicate rules when combining bundles", () => {
    const rules = getRulesFromBundles(["core-ds", "core-ds"]);
    const ruleIds = new Set(rules.map((r) => r.id));
    expect(ruleIds.size).toBe(rules.length);
  });

  it("should only return enabled policies and rules", () => {
    const policies = policyRegistry.listEnabled();
    expect(policies.every((p) => p.enabled)).toBe(true);
    
    const rules = getRulesFromBundle("core-ds");
    expect(rules.every((r) => r.enabled)).toBe(true);
  });

  it("should have correct policy bundles", () => {
    expect(CORE_DS_POLICY.bundle).toBe("core-ds");
    expect(ENTERPRISE_POLICY.bundle).toBe("enterprise");
    expect(MARKETING_POLICY.bundle).toBe("marketing");
  });

  it("should have rules with required fields", () => {
    const rules = getRulesFromBundle("core-ds");
    rules.forEach((rule) => {
      expect(rule.id).toBeDefined();
      expect(rule.type).toBeDefined();
      expect(rule.severity).toBeDefined();
      expect(rule.name).toBeDefined();
      expect(rule.description).toBeDefined();
      expect(["error", "warning", "info"]).toContain(rule.severity);
    });
  });
});

