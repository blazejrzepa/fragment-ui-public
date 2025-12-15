---
title: Policy Bundles
description: Documentation of available policy bundles, their rules, and test execution details
---

# Policy Bundles

**Purpose:** Documentation of available policy bundles and their rules  
**Audience:** Engineers using Governance module, Design System maintainers  
**Last Updated:** 2025-01-XX

---

## 📋 Overview

Policy bundles group related governance rules together and can be applied at different enforcement points (Studio, Submissions, Releases). Each bundle contains a set of rules that enforce specific quality standards.

**Location:** `apps/demo/src/lib/governance/policy-registry.ts`

---

## 🎯 Available Policy Bundles

### 1. Core Design System (`core-ds`)

**Purpose:** Fundamental design system rules for all components

**When to use:**
- Applied by default in Studio (soft warnings)
- Always included in Submissions and Releases
- Minimum quality standards for all components

**Rules:**

#### No Raw HTML Elements
- **Type:** `lint`
- **Severity:** `error`
- **Description:** Must use Fragment UI components, no raw HTML elements
- **Config:**
  - Allowed elements: `["div", "span", "br"]` (minimal exceptions)
- **How it's tested:** Code analysis checks for raw HTML elements (button, input, etc.) and flags them as violations

#### Design System Imports Only
- **Type:** `forbidden-deps`
- **Severity:** `error`
- **Description:** Only import from `@fragment_ui/ui` or `@fragment_ui/blocks`
- **Config:**
  - Allowed: `["@fragment_ui/ui", "@fragment_ui/blocks", "lucide-react"]`
  - Forbidden: `["react", "@radix-ui/react-*"]` (except when used by Fragment UI)
- **How it's tested:** Static analysis of import statements in component code

#### No Hardcoded Colors
- **Type:** `tokens`
- **Severity:** `error`
- **Description:** Must use design tokens, no hardcoded color values
- **How it's tested:** Code analysis searches for hardcoded color values (hex, rgb, rgba) and flags them

#### No Critical A11y Violations
- **Type:** `a11y`
- **Severity:** `error`
- **Description:** No critical accessibility violations (WCAG 2.1 Level AA)
- **Config:**
  - Level: `AA`
  - Fail on critical: `true`
- **How it's tested:** 
  - **A11y Tests:** Automated accessibility testing using Vitest and axe-core
  - Checks for: missing ARIA labels, keyboard navigation, color contrast, semantic HTML
  - Runs during component testing phase

#### Test Presence
- **Type:** `tests`
- **Severity:** `warning`
- **Description:** Components should have at least story or unit test
- **Config:**
  - Require story: `false`
  - Require unit: `false`
  - Require either: `true` (must have at least one)
- **How it's tested:** Checks for presence of Storybook stories or unit test files

---

## 🧪 Test Categories in Governance

When you run "Run Test" in Governance tab, the following test categories are executed:

### 1. **A11y (Accessibility)**
- **What it tests:** WCAG 2.1 Level AA compliance
- **Tools:** Vitest + axe-core
- **Checks:**
  - ARIA attributes and roles
  - Keyboard navigation
  - Color contrast ratios
  - Semantic HTML structure
  - Screen reader compatibility
- **Status:** ✅ Implemented (runs via Vitest)

### 2. **Unit Tests**
- **What it tests:** Component functionality and logic
- **Tools:** Vitest
- **Checks:**
  - Component renders correctly
  - Props handling
  - Event handlers
  - State management
- **Status:** ✅ Implemented (runs via Vitest)

### 3. **E2E (End-to-End)**
- **What it tests:** Full user workflows and interactions
- **Tools:** Playwright
- **Checks:**
  - User interactions (clicks, typing, navigation)
  - Component behavior in real browser
  - Integration with other components
- **Status:** ⚠️ Not currently implemented (requires additional setup)

### 4. **Visual Regression**
- **What it tests:** Visual appearance and consistency
- **Tools:** Chromatic / Storybook
- **Checks:**
  - Component visual appearance
  - Screenshot comparisons
  - Visual regressions
- **Status:** ✅ Implemented (runs via Visual tests)

### 5. **Performance (Perf)**
- **What it tests:** Component performance metrics
- **Tools:** Lighthouse
- **Checks:**
  - Bundle size
  - Load time
  - Runtime performance
  - Memory usage
- **Status:** ⚠️ Not currently implemented (requires additional setup)

### 6. **Responsive (RWD)**
- **What it tests:** Responsive design across breakpoints
- **Tools:** Playwright (viewport testing)
- **Checks:**
  - Mobile, tablet, desktop layouts
  - Breakpoint behavior
  - Responsive utilities
- **Status:** ⚠️ Not currently implemented (requires additional setup)

### 7. **Interactions**
- **What it tests:** User interaction patterns
- **Tools:** Vitest
- **Checks:**
  - Click handlers
  - Hover states
  - Focus management
  - Keyboard interactions
- **Status:** ✅ Implemented (runs via Vitest)

### 8. **States**
- **What it tests:** Component state variations
- **Tools:** Vitest
- **Checks:**
  - Loading states
  - Error states
  - Disabled states
  - Empty states
- **Status:** ✅ Implemented (runs via Vitest)

---

## 📊 Test Execution Flow

When you click "Run Test" in Governance:

1. **Test Trigger:** Component name is sent to `/api/tests/run`
2. **Test Execution:** Tests run asynchronously in the background
3. **Test Categories:**
   - **Fast tests (always run):** A11y, Unit, Interactions, States (via Vitest)
   - **Slow tests (skipped for single component):** E2E, Performance, Visual, Responsive
4. **Results Collection:** Test results are collected and mapped to Governance format
5. **Display:** Results shown in Governance tab with:
   - Pass Rate
   - Total Rules (8 categories)
   - Passed/Failed counts
   - Detailed rule results

---

## 🎯 Policy Bundle Test Mapping

The `core-ds` policy bundle maps to these test categories:

| Policy Rule | Test Category | Status |
|------------|--------------|--------|
| No Raw HTML Elements | Unit | ✅ Implemented |
| Design System Imports Only | Unit | ✅ Implemented |
| No Hardcoded Colors | Unit | ✅ Implemented |
| No Critical A11y Violations | A11y | ✅ Implemented |
| Test Presence | Unit | ✅ Implemented |

**Note:** Not all policy rules have direct test category mappings. Some rules (like "No Hardcoded Colors") are checked via static code analysis during the Unit test phase.

---

### 2. Enterprise (`enterprise`)

**Purpose:** Additional rules for enterprise/security-focused applications

**When to use:**
- Applied in Submissions (hard gates)
- Applied in Releases (final gates)
- For applications requiring strict compliance and security

**Rules:**

#### Bundle Size Limit
- **Type:** `bundle`
- **Severity:** `error`
- **Description:** Component bundle size must be under 50KB (gzipped)
- **Config:**
  - Max size: `50KB` (uncompressed)
  - Max gzipped: `15KB`

#### Strict A11y Compliance
- **Type:** `a11y`
- **Severity:** `error`
- **Description:** All A11y checks must pass (no warnings allowed)
- **Config:**
  - Level: `AA`
  - Fail on warnings: `true`

#### No External Dependencies
- **Type:** `forbidden-deps`
- **Severity:** `error`
- **Description:** No external dependencies beyond design system
- **Config:**
  - Allowed: `["@fragment_ui/ui", "@fragment_ui/blocks", "lucide-react"]`
  - Forbidden: `["*"]` (everything else)

#### Test Coverage
- **Type:** `tests`
- **Severity:** `warning`
- **Description:** Components should have both story and unit tests
- **Config:**
  - Require story: `true`
  - Require unit: `true`
  - Require either: `false` (must have both)

---

### 3. Marketing (`marketing`)

**Purpose:** Relaxed rules for marketing pages (more flexibility, focus on visual quality)

**When to use:**
- For marketing/landing pages
- When visual quality is more important than strict compliance
- Pages that are less frequently updated

**Rules:**

#### Basic A11y
- **Type:** `a11y`
- **Severity:** `warning`
- **Description:** Basic accessibility (WCAG 2.1 Level A)
- **Config:**
  - Level: `A` (less strict than AA)
  - Fail on critical: `true`
  - Fail on warnings: `false`

#### Marketing Bundle Size
- **Type:** `bundle`
- **Severity:** `warning`
- **Description:** Marketing pages can be larger (100KB gzipped)
- **Config:**
  - Max size: `200KB` (uncompressed)
  - Max gzipped: `100KB`

#### Tests Optional
- **Type:** `tests`
- **Severity:** `info`
- **Description:** Tests are optional for marketing pages
- **Status:** `disabled` (not enforced)

---

## 🔄 Enforcement Points

Different policy bundles are applied at different enforcement points:

### Studio (Development)
- **Bundles:** `["core-ds"]`
- **Mode:** Soft warnings (non-blocking)
- **Purpose:** Real-time feedback during development

### Submissions (Review)
- **Bundles:** `["core-ds", "enterprise"]`
- **Mode:** Hard gates (blocks approval if errors)
- **Purpose:** Quality gates before component approval

### Releases (Publication)
- **Bundles:** `["core-ds", "enterprise"]`
- **Mode:** Final gates (blocks publication if errors)
- **Purpose:** Final quality check before public release

---

## 🛠️ Usage

### Default Enforcement

```typescript
import { enforceStudio, enforceSubmissions } from "@/lib/governance";

// Studio uses core-ds by default (soft warnings)
const studioResult = await enforceStudio({
  dsl: myDsl,
  tsx: myCode,
  componentName: "MyComponent",
});

// Submissions use core-ds + enterprise by default (hard gates)
const submissionResult = await enforceSubmissions(
  {
    dsl: myDsl,
    tsx: myCode,
    componentName: "MyComponent",
  }
);
```

### Custom Policy Bundles

```typescript
import { enforceSubmissions } from "@/lib/governance";
import type { PolicyBundle } from "@/lib/governance";

// Use custom bundles
const result = await enforceSubmissions(
  {
    dsl: myDsl,
    tsx: myCode,
    componentName: "MyComponent",
  },
  ["core-ds", "marketing"] // Custom bundle selection
);
```

### Direct Policy Registry Access

```typescript
import {
  getPolicy,
  getRulesFromBundle,
  getRulesFromBundles,
} from "@/lib/governance";

// Get specific policy
const coreDsPolicy = getPolicy("core-ds");
console.log(coreDsPolicy?.name); // "Core Design System"

// Get rules from a bundle
const coreDsRules = getRulesFromBundle("core-ds");
console.log(coreDsRules.length); // Number of rules

// Get rules from multiple bundles
const allRules = getRulesFromBundles(["core-ds", "enterprise"]);
```

---

## 📊 Bundle Comparison

| Feature | core-ds | enterprise | marketing |
|---------|---------|------------|-----------|
| **A11y Level** | AA | AA (strict) | A (basic) |
| **Bundle Size** | No limit | 15KB gzipped | 100KB gzipped |
| **Dependencies** | Design system only | Design system only | Flexible |
| **Tests** | Either story or unit | Both required | Optional |
| **Raw HTML** | Error | Error | Allowed |
| **Hardcoded Colors** | Error | Error | Allowed |

---

## 🔧 Configuration

Policy bundles are configured in `apps/demo/src/lib/governance/policy-registry.ts`:

```typescript
export const CORE_DS_POLICY: Policy = {
  id: "core-ds",
  bundle: "core-ds",
  name: "Core Design System",
  description: "Fundamental design system rules for all components",
  enabled: true,
  rules: [
    // ... rule definitions
  ],
};
```

### Adding a New Policy Bundle

1. Define the policy in `policy-registry.ts`:

```typescript
export const MY_NEW_POLICY: Policy = {
  id: "my-new-policy",
  bundle: "my-new-policy",
  name: "My New Policy",
  description: "Description of the policy",
  enabled: true,
  rules: [
    // ... rule definitions
  ],
};
```

2. Add to PolicyBundle type:

```typescript
export type PolicyBundle = "core-ds" | "enterprise" | "marketing" | "my-new-policy";
```

3. Register in PolicyRegistry constructor:

```typescript
constructor() {
  this.register(CORE_DS_POLICY);
  this.register(ENTERPRISE_POLICY);
  this.register(MARKETING_POLICY);
  this.register(MY_NEW_POLICY); // Add here
}
```

---

## 📝 Rule Types

Each rule in a policy bundle can be one of the following types:

- **`lint`**: Code quality and structure (e.g., no raw HTML elements)
- **`a11y`**: Accessibility compliance (WCAG levels)
- **`bundle`**: Bundle size limits
- **`forbidden-deps`**: Dependency restrictions
- **`tokens`**: Design token usage
- **`tests`**: Test presence requirements

---

## ✅ Best Practices

1. **Always use `core-ds`** - It's the minimum standard for all components
2. **Use `enterprise` for production** - Stricter enforcement for public releases
3. **Use `marketing` sparingly** - Only for true marketing/landing pages
4. **Test locally first** - Run governance checks before submitting
5. **Fix errors, not warnings** - Errors block approval, warnings are recommendations

---

## 🔗 Related Documentation

- [Governance Usage Guide](./USAGE.md) - How to use Governance module
- [Governance Testing Guide](./TESTING.md) - Testing Governance features
- [Governance Summary](./SUMMARY.md) - Overview of Governance module

---

## 📚 References

- **Policy Registry:** `apps/demo/src/lib/governance/policy-registry.ts`
- **Enforcement Points:** `apps/demo/src/lib/governance/enforcement.ts`
- **Rule Engine:** `apps/demo/src/lib/governance/rule-engine.ts`

