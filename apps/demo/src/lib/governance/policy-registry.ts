/**
 * Policy Registry
 * 
 * EPIC F: F1 - Policy Registry
 * 
 * Defines policy bundles (Core DS, Enterprise, Marketing) and rule types.
 * Policies can be queried, bundled, and applied at different enforcement points.
 */

export type RuleType = "lint" | "a11y" | "bundle" | "forbidden-deps" | "tokens" | "tests";

export type PolicyBundle = "core-ds" | "enterprise" | "marketing";

export type RuleSeverity = "error" | "warning" | "info";

export interface PolicyRule {
  id: string;
  type: RuleType;
  severity: RuleSeverity;
  name: string;
  description: string;
  enabled: boolean;
  config?: Record<string, any>;
}

export interface Policy {
  id: string;
  bundle: PolicyBundle;
  name: string;
  description: string;
  rules: PolicyRule[];
  enabled: boolean;
}

/**
 * Core Design System Policy
 * Enforces fundamental design system rules for all components
 */
export const CORE_DS_POLICY: Policy = {
  id: "core-ds",
  bundle: "core-ds",
  name: "Core Design System",
  description: "Fundamental design system rules for all components",
  enabled: true,
  rules: [
    {
      id: "no-raw-elements",
      type: "lint",
      severity: "error",
      name: "No Raw HTML Elements",
      description: "Must use Fragment UI components, no raw HTML elements",
      enabled: true,
      config: {
        allowedElements: ["div", "span", "br"], // Minimal exceptions
      },
    },
    {
      id: "design-system-imports-only",
      type: "forbidden-deps",
      severity: "error",
      name: "Design System Imports Only",
      description: "Only import from @fragment_ui/ui or @fragment_ui/blocks",
      enabled: true,
      config: {
        allowed: ["@fragment_ui/ui", "@fragment_ui/blocks", "lucide-react"],
        forbidden: ["react", "@radix-ui/react-*"], // Except when used by Fragment UI
      },
    },
    {
      id: "no-hardcoded-colors",
      type: "tokens",
      severity: "error",
      name: "No Hardcoded Colors",
      description: "Must use design tokens, no hardcoded color values",
      enabled: true,
    },
    {
      id: "a11y-critical",
      type: "a11y",
      severity: "error",
      name: "No Critical A11y Violations",
      description: "No critical accessibility violations (WCAG 2.1 Level AA)",
      enabled: true,
      config: {
        level: "AA",
        failOnCritical: true,
      },
    },
    {
      id: "test-presence",
      type: "tests",
      severity: "warning",
      name: "Test Presence",
      description: "Components should have at least story or unit test",
      enabled: true,
      config: {
        requireStory: false,
        requireUnit: false,
        requireEither: true,
      },
    },
  ],
};

/**
 * Enterprise Policy
 * Additional rules for enterprise/security-focused applications
 */
export const ENTERPRISE_POLICY: Policy = {
  id: "enterprise",
  bundle: "enterprise",
  name: "Enterprise",
  description: "Additional rules for enterprise applications (security, compliance)",
  enabled: true,
  rules: [
    {
      id: "bundle-size-limit",
      type: "bundle",
      severity: "error",
      name: "Bundle Size Limit",
      description: "Component bundle size must be under 50KB (gzipped)",
      enabled: true,
      config: {
        maxSize: 50 * 1024, // 50KB in bytes
        maxGzipped: 15 * 1024, // 15KB gzipped
      },
    },
    {
      id: "a11y-aa-strict",
      type: "a11y",
      severity: "error",
      name: "Strict A11y Compliance",
      description: "All A11y checks must pass (no warnings allowed)",
      enabled: true,
      config: {
        level: "AA",
        failOnWarnings: true,
      },
    },
    {
      id: "no-external-deps",
      type: "forbidden-deps",
      severity: "error",
      name: "No External Dependencies",
      description: "No external dependencies beyond design system",
      enabled: true,
      config: {
        allowed: ["@fragment_ui/ui", "@fragment_ui/blocks", "lucide-react"],
        forbidden: ["*"],
      },
    },
    {
      id: "test-coverage",
      type: "tests",
      severity: "warning",
      name: "Test Coverage",
      description: "Components should have both story and unit tests",
      enabled: true,
      config: {
        requireStory: true,
        requireUnit: true,
        requireEither: false,
      },
    },
  ],
};

/**
 * Marketing Policy
 * Relaxed rules for marketing pages (more flexibility, focus on visual quality)
 */
export const MARKETING_POLICY: Policy = {
  id: "marketing",
  bundle: "marketing",
  name: "Marketing",
  description: "Relaxed rules for marketing pages (visual quality focus)",
  enabled: true,
  rules: [
    {
      id: "a11y-basic",
      type: "a11y",
      severity: "warning",
      name: "Basic A11y",
      description: "Basic accessibility (WCAG 2.1 Level A)",
      enabled: true,
      config: {
        level: "A",
        failOnCritical: true,
        failOnWarnings: false,
      },
    },
    {
      id: "bundle-size-marketing",
      type: "bundle",
      severity: "warning",
      name: "Marketing Bundle Size",
      description: "Marketing pages can be larger (100KB gzipped)",
      enabled: true,
      config: {
        maxSize: 200 * 1024, // 200KB
        maxGzipped: 100 * 1024, // 100KB gzipped
      },
    },
    {
      id: "test-optional",
      type: "tests",
      severity: "info",
      name: "Tests Optional",
      description: "Tests are optional for marketing pages",
      enabled: false,
    },
  ],
};

/**
 * Policy Registry
 * Central registry for all policies
 */
class PolicyRegistry {
  private policies: Map<string, Policy> = new Map();

  constructor() {
    // Register default policies
    this.register(CORE_DS_POLICY);
    this.register(ENTERPRISE_POLICY);
    this.register(MARKETING_POLICY);
  }

  /**
   * Register a policy
   */
  register(policy: Policy): void {
    this.policies.set(policy.id, policy);
  }

  /**
   * Get policy by ID
   */
  get(id: string): Policy | undefined {
    return this.policies.get(id);
  }

  /**
   * Get all policies in a bundle
   */
  getByBundle(bundle: PolicyBundle): Policy[] {
    return Array.from(this.policies.values()).filter(
      (p) => p.bundle === bundle && p.enabled
    );
  }

  /**
   * Get all enabled rules from a bundle
   */
  getRulesFromBundle(bundle: PolicyBundle): PolicyRule[] {
    const policies = this.getByBundle(bundle);
    return policies.flatMap((p) => p.rules.filter((r) => r.enabled));
  }

  /**
   * Get all enabled rules from multiple bundles
   */
  getRulesFromBundles(bundles: PolicyBundle[]): PolicyRule[] {
    const allRules: PolicyRule[] = [];
    const seen = new Set<string>();

    for (const bundle of bundles) {
      const rules = this.getRulesFromBundle(bundle);
      for (const rule of rules) {
        if (!seen.has(rule.id)) {
          seen.add(rule.id);
          allRules.push(rule);
        }
      }
    }

    return allRules;
  }

  /**
   * Get rule by ID
   */
  getRule(ruleId: string): PolicyRule | undefined {
    for (const policy of this.policies.values()) {
      const rule = policy.rules.find((r) => r.id === ruleId);
      if (rule) return rule;
    }
    return undefined;
  }

  /**
   * List all policies
   */
  list(): Policy[] {
    return Array.from(this.policies.values());
  }

  /**
   * List all enabled policies
   */
  listEnabled(): Policy[] {
    return Array.from(this.policies.values()).filter((p) => p.enabled);
  }
}

// Singleton instance
export const policyRegistry = new PolicyRegistry();

// Export for convenience
export function getPolicy(id: string): Policy | undefined {
  return policyRegistry.get(id);
}

export function getRulesFromBundle(bundle: PolicyBundle): PolicyRule[] {
  return policyRegistry.getRulesFromBundle(bundle);
}

export function getRulesFromBundles(bundles: PolicyBundle[]): PolicyRule[] {
  return policyRegistry.getRulesFromBundles(bundles);
}

