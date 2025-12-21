# Governance Module - Usage Guide

**Version:** 1.0  
**Last Updated:** 2025-01-XX  
**Status:** Implementation Complete

---

## 📋 Overview

The Governance module provides policy enforcement, rule execution, and compliance checking for Fragment UI Studio. It enforces design system standards, accessibility requirements, bundle size limits, and other quality gates throughout the development workflow.

---

## 🎯 Key Concepts

### Policy Bundles

Policy bundles group related rules together:

- **core-ds**: Core Design System rules (applied everywhere)
- **enterprise**: Enterprise/security rules (stricter enforcement)
- **marketing**: Marketing page rules (relaxed enforcement)

### Enforcement Points

Rules are enforced at different stages:

- **Studio**: Soft warnings (non-blocking during development)
- **Submissions**: Hard gates (blocks approval if errors exist)
- **Releases**: Final gates (blocks publication if errors exist)

### Rule Types

- `lint`: Code quality and structure
- `a11y`: Accessibility compliance
- `bundle`: Bundle size limits
- `forbidden-deps`: Dependency restrictions
- `tokens`: Design token usage
- `tests`: Test presence requirements

---

## 🚀 Basic Usage

### Running Governance Checks

```typescript
import { enforceStudio, enforceSubmissions } from "@/lib/governance";

// Studio enforcement (soft warnings)
const result = await enforceStudio({
  dsl: myDsl,
  tsx: myCode,
  storiesCode: myStories,
  componentName: "MyComponent",
});

console.log(`Errors: ${result.errors}, Warnings: ${result.warnings}`);
console.log(`Blocks approval: ${result.blocksApproval}`);

// Submissions enforcement (hard gates)
const submissionResult = await enforceSubmissions(
  {
    dsl: myDsl,
    tsx: myCode,
    storiesCode: myStories,
    componentName: "MyComponent",
  },
  ["core-ds", "enterprise"] // Custom policy bundles
);
```

### Using Policy Registry

```typescript
import {
  getPolicy,
  getRulesFromBundle,
  getRulesFromBundles,
} from "@/lib/governance";

// Get a specific policy
const corePolicy = getPolicy("core-ds");

// Get all rules from a bundle
const coreRules = getRulesFromBundle("core-ds");

// Get rules from multiple bundles
const allRules = getRulesFromBundles(["core-ds", "enterprise"]);
```

### Executing Rules Directly

```typescript
import { executeRule, executeRules } from "@/lib/governance";

// Execute a single rule
const result = await executeRule(rule, {
  dsl: myDsl,
  tsx: myCode,
  bundleSize: 5000,
  bundleGzipped: 2000,
});

// Execute multiple rules
const results = await executeRules(rules, context);
```

---

## 📦 Integration Examples

### Integration with Submissions API

Governance is automatically integrated with the Submissions run-checks API:

```typescript
// POST /api/submissions/:id/run-checks
// Governance checks run automatically during submission verification
// Results are merged with existing quality checks

// Optional: Specify custom policy bundles in request body
{
  "policyBundles": ["core-ds", "enterprise"]
}
```

### Integration with Studio UI

Governance warnings are displayed in the Studio Inspector:

```typescript
import { GovernanceWarnings } from "@/components/playground/governance-warnings";

<GovernanceWarnings
  code={componentCode}
  dsl={componentDsl}
  storiesCode={storiesCode}
  policyBundles={["core-ds"]}
/>
```

---

## 🔧 Creating Custom Policies

### Define a Policy

```typescript
import { Policy, PolicyRule } from "@/lib/governance";

const myCustomPolicy: Policy = {
  id: "custom-policy",
  bundle: "custom",
  name: "Custom Policy",
  description: "My custom policy rules",
  enabled: true,
  rules: [
    {
      id: "custom-rule",
      type: "lint",
      severity: "error",
      name: "Custom Rule",
      description: "Enforces custom requirement",
      enabled: true,
      config: {
        // Rule-specific configuration
      },
    },
  ],
};

// Register the policy
policyRegistry.register(myCustomPolicy);
```

### Creating Custom Rule Executors

```typescript
import type { PolicyRule } from "@/lib/governance";
import type { RuleViolation, RuleExecutionResult } from "@/lib/governance";

export function executeCustomRule(
  rule: PolicyRule,
  context: RuleExecutionContext
): RuleExecutionResult {
  const violations: RuleViolation[] = [];
  
  // Your custom rule logic here
  // Check code, DSL, or other context properties
  
  if (/* violation detected */) {
    violations.push({
      ruleId: rule.id,
      ruleName: rule.name,
      severity: rule.severity as "error" | "warning" | "info",
      message: "Violation message",
      location: {
        file: "component.tsx",
        line: 42,
      },
      fix: {
        description: "How to fix this",
        autoFixable: false,
      },
    });
  }
  
  return {
    ruleId: rule.id,
    passed: violations.length === 0,
    violations,
  };
}
```

---

## 📊 Rule Execution Context

The `RuleExecutionContext` provides all necessary data for rule execution:

```typescript
interface RuleExecutionContext {
  dsl?: UiDsl;              // Component DSL structure
  tsx?: string;             // Component TSX code
  bundleSize?: number;      // Component bundle size (bytes)
  bundleGzipped?: number;   // Gzipped bundle size (bytes)
  storiesCode?: string;     // Storybook stories code
  componentName?: string;   // Component name
}
```

---

## 🎨 Violations and Fixes

### Violation Structure

```typescript
interface RuleViolation {
  ruleId: string;
  ruleName: string;
  severity: "error" | "warning" | "info";
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
```

### Working with Violations

```typescript
import { getAllViolations, getErrors, getWarnings, hasErrors } from "@/lib/governance";

const results = await executeRules(rules, context);

// Get all violations
const allViolations = getAllViolations(results);

// Get only errors (blocking)
const errors = getErrors(results);

// Get only warnings (non-blocking)
const warnings = getWarnings(results);

// Check if any errors exist
if (hasErrors(results)) {
  console.log("Submission blocked due to governance errors");
}
```

---

## 🔍 Audit Logging

All governance actions are automatically logged:

```typescript
import { logAudit } from "@/lib/governance";

logAudit({
  action: "rule_executed",
  userId: "user123",
  entityType: "component",
  entityId: "component-id",
  metadata: {
    ruleId: "no-raw-elements",
    violations: 2,
  },
});
```

### Querying Audit Logs

```typescript
import { auditLogger } from "@/lib/governance";

// Get logs for a specific entity
const logs = auditLogger.getLogsForEntity("component", "component-id");

// Get logs for a user
const userLogs = auditLogger.getLogsForUser("user123");

// Get logs for an action
const ruleLogs = auditLogger.getLogsForAction("rule_executed");
```

---

## 🛡️ Ownership and Exceptions

### Assigning Owners

```typescript
import { ownershipRegistry } from "@/lib/governance";

ownershipRegistry.assignOwner(
  "component-id",
  "owner-user-id",
  "assigned-by-user-id",
  "Owner Name"
);

// Get owner
const owner = ownershipRegistry.getOwner("component-id");
```

### Requesting Exceptions

```typescript
import { requestException, approveException } from "@/lib/governance";

// Request an exception
const exception = requestException(
  "component-id",
  "rule-id",
  "Reason for exception",
  "requester-user-id"
);

// Approve exception (admin)
approveException(
  exception.id,
  "reviewer-user-id",
  "Approval comment"
);

// Check if exception exists
const hasException = hasApprovedException("component-id", "rule-id");
```

---

## 📝 Default Policy Bundles

For detailed documentation of all policy bundles, their rules, configuration, and usage, see the [Policy Bundles documentation](./POLICY_BUNDLES.md).

### Quick Reference

- **`core-ds`**: Core Design System rules (applied everywhere)
- **`enterprise`**: Enterprise/security rules (stricter enforcement)
- **`marketing`**: Marketing page rules (relaxed enforcement)

---

## 🎯 Best Practices

1. **Use appropriate policy bundles** for different component types
   - Core components: `core-ds` + `enterprise`
   - Marketing pages: `core-ds` + `marketing`
   - Internal tools: `core-ds` only

2. **Address errors before submission**
   - Studio shows soft warnings (non-blocking)
   - Submissions enforce hard gates (blocking)
   - Fix errors early to avoid submission failures

3. **Use exceptions sparingly**
   - Request exceptions only when necessary
   - Document the reason clearly
   - Get approval from governance team

4. **Monitor audit logs**
   - Review rule execution logs regularly
   - Identify patterns in violations
   - Update policies based on common issues

5. **Customize for your team**
   - Create custom policies for team-specific rules
   - Adjust severity levels as needed
   - Add auto-fix suggestions where possible

---

## 🔗 Related Documentation

- [Policy Bundles](./POLICY_BUNDLES.md) - Detailed documentation of all policy bundles and their rules
- [Policy Registry API](./POLICY_REGISTRY.md)
- [Rule Engine API](./RULE_ENGINE.md)
- [Enforcement Points](./ENFORCEMENT.md)
- [Submissions Workflow](../studio/submissions/SUBMISSIONS_FLOW.md)

---

## ❓ FAQ

**Q: Can I disable a policy?**  
A: Yes, policies and rules can be disabled by setting `enabled: false`.

**Q: How do I add a new rule type?**  
A: Create a new rule executor function and add it to the rule engine switch statement.

**Q: Are violations cached?**  
A: No, violations are calculated on-demand. Consider caching for performance if needed.

**Q: Can rules be customized per component?**  
A: Yes, you can specify different policy bundles per component or use custom rules.

**Q: How do I test governance rules?**  
A: See the test files in `apps/demo/src/lib/governance/__tests__/` for examples.

---

**For more details, see the source code in `apps/demo/src/lib/governance/`**

