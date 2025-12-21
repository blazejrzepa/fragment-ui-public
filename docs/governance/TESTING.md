# Governance Module - Testing Guide

**Version:** 1.0  
**Last Updated:** 2025-01-XX

---

## 📋 Overview

This guide covers testing strategies for the Governance module, including unit tests, integration tests, and E2E tests.

---

## 🧪 Unit Tests

### Location
- `apps/demo/src/lib/governance/__tests__/`

### Test Files

#### Policy Registry Tests (`policy-registry.test.ts`)
Tests for policy registration, retrieval, and bundling:
- Policy registration and retrieval
- Rule bundling from policy bundles
- Policy querying methods
- Enabled/disabled policies and rules

```bash
pnpm test apps/demo/src/lib/governance/__tests__/policy-registry.test.ts
```

#### Rule Engine Tests (`rule-engine.test.ts`)
Tests for rule execution:
- Single rule execution
- Multiple rule execution
- Violation extraction
- Error/warning filtering
- Missing context handling

```bash
pnpm test apps/demo/src/lib/governance/__tests__/rule-engine.test.ts
```

#### Enforcement Points Tests (`enforcement.test.ts`)
Tests for enforcement at different points:
- Studio enforcement (soft warnings, non-blocking)
- Submissions enforcement (hard gates, blocking)
- Releases enforcement (final gates, blocking)
- Custom policy bundle selection
- Violation counting

```bash
pnpm test apps/demo/src/lib/governance/__tests__/enforcement.test.ts
```

---

## 🎭 E2E Tests

### Location
- `apps/demo/e2e/governance-warnings.spec.ts`

### Test Coverage

#### 1. Governance Warnings Panel Visibility
Tests that the Governance Warnings panel appears in the Studio Inspector:
- Panel is visible when component is generated
- Soft warnings label is displayed
- Non-blocking nature is indicated

#### 2. Violations Display
Tests that violations are displayed correctly:
- Violation count badge appears
- Violation details are shown
- Panel structure is correct

#### 3. All Checks Passed State
Tests the "all checks passed" state:
- Shows success message when no violations
- Or panel is hidden (both valid)

#### 4. Violation Severity
Tests that violation severity is displayed:
- Error violations are marked
- Warning violations are marked
- Info violations are marked

#### 5. Code Change Updates
Tests that warnings update when code changes:
- Warnings update after component edit
- Debounced checks work correctly

#### 6. Policy Bundles Information
Tests that policy bundle info is displayed:
- Policy bundles are shown
- Bundle names are visible

### Running E2E Tests

```bash
# Run all Governance E2E tests
pnpm test:e2e governance-warnings

# Run with UI mode (headed browser)
pnpm test:e2e governance-warnings --ui

# Run with debug mode
pnpm test:e2e governance-warnings --debug
```

### Test Data Attributes

The Governance Warnings component uses the following `data-testid` attributes for testing:

- `governance-warnings-panel` - Main panel container
- `governance-violations-count` - Violation count badge
- `governance-soft-warning-label` - Soft warnings label
- `governance-all-passed` - "All checks passed" message
- `governance-policy-bundles` - Policy bundles information
- `governance-violation-error` - Error violation item
- `governance-violation-warning` - Warning violation item
- `governance-violation-info` - Info violation item

---

## 🔧 Test Utilities

### Mock Context

```typescript
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
  storiesCode: "export default { component: TestComponent };",
  componentName: "TestComponent",
};
```

### Mock Violations

```typescript
const mockViolations: RuleViolation[] = [
  {
    ruleId: "no-raw-elements",
    ruleName: "No Raw HTML Elements",
    severity: "error",
    message: "Raw HTML element found",
    location: {
      file: "component.tsx",
      line: 10,
    },
    fix: {
      description: "Use Fragment UI components",
      autoFixable: false,
    },
  },
];
```

---

## 📊 Test Coverage Goals

- **Unit Tests**: 80%+ coverage
- **E2E Tests**: Critical user flows covered
- **Integration Tests**: API integration points tested

---

## 🚀 Running All Tests

```bash
# Run all Governance tests
pnpm test governance

# Run with coverage
pnpm test governance --coverage

# Run in watch mode
pnpm test governance --watch
```

---

## 📝 Writing New Tests

### Unit Test Template

```typescript
import { describe, it, expect } from "vitest";
import { functionToTest } from "../module";

describe("Module Name", () => {
  it("should do something", () => {
    const result = functionToTest(input);
    expect(result).toBe(expected);
  });
});
```

### E2E Test Template

```typescript
import { test, expect } from "@playwright/test";

test.describe("Feature Name", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/studio");
    // Setup...
  });

  test("should do something", async ({ page }) => {
    // Test steps...
    await expect(element).toBeVisible();
  });
});
```

---

## 🐛 Debugging Tests

### Unit Tests

```bash
# Run specific test file
pnpm test policy-registry.test.ts

# Run with verbose output
pnpm test --reporter=verbose

# Debug in VS Code
# Use "JavaScript Debug Terminal" and run tests
```

### E2E Tests

```bash
# Run with headed browser
pnpm test:e2e governance-warnings --headed

# Run with slow motion
pnpm test:e2e governance-warnings --slowMo=1000

# Run with debug mode (Playwright Inspector)
pnpm test:e2e governance-warnings --debug

# Run specific test
pnpm test:e2e governance-warnings -g "should show Governance Warnings panel"
```

### E2E Debug Tips

1. Use `page.pause()` in test to pause execution
2. Use `page.screenshot()` to capture screenshots
3. Use `console.log()` in page context: `await page.evaluate(() => console.log(...))`
4. Use Playwright Inspector for step-by-step debugging

---

## ✅ Test Checklist

When adding new Governance features:

- [ ] Unit tests for new functions
- [ ] Unit tests for new rule executors
- [ ] Integration tests for API changes
- [ ] E2E tests for UI changes
- [ ] Test data attributes added (`data-testid`)
- [ ] Test coverage maintained (80%+)
- [ ] All tests passing locally
- [ ] CI tests passing

---

## 🔗 Related Documentation

- [Usage Guide](./USAGE.md)
- [Implementation Summary](./SUMMARY.md)
- [Playwright Documentation](https://playwright.dev/)
- [Vitest Documentation](https://vitest.dev/)

---

**Happy Testing!** 🧪

