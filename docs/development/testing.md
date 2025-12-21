# Testing

**Purpose:** Testing strategy and standards  
**Audience:** Engineers writing tests  
**When to read:** When writing or updating tests

---

## Overview

Fragment UI uses multiple testing strategies to ensure quality:

- **Unit Tests:** Vitest for component logic
- **E2E Tests:** Playwright for user flows
- **Visual Regression:** Chromatic for visual testing
- **Accessibility:** axe-core for a11y testing
- **Performance:** Lighthouse CI for performance budgets

---

## Testing Structure

### Unit Tests

**Location:** `packages/*/src/**/*.test.tsx`

**Framework:** Vitest

**Example:**
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

### E2E Tests

**Location:** `apps/*/e2e/**/*.spec.ts`

**Framework:** Playwright

**Example:**
```typescript
import { test, expect } from '@playwright/test'

test('studio generates UI', async ({ page }) => {
  await page.goto('/studio')
  await page.fill('[data-testid="prompt-input"]', 'Create a login form')
  await page.click('[data-testid="generate-button"]')
  await expect(page.locator('form')).toBeVisible()
})
```

### Visual Regression

**Location:** Storybook stories

**Framework:** Chromatic

**Example:**
```typescript
export const Default: Story = {
  render: () => <Button>Click me</Button>
}
```

---

## Testing Standards

### Component Testing

- **Coverage:** Minimum 80% coverage
- **Accessibility:** All components must pass axe-core
- **Variants:** Test all variants
- **Edge Cases:** Test error states, loading states

### E2E Testing

- **Critical Paths:** Test main user flows
- **Studio:** Test generation, editing, submissions
- **Portal:** Test navigation, component browsing

---

## Running Tests

### Unit Tests

```bash
# Run all unit tests
pnpm test

# Run tests for specific package
pnpm --filter @fragment_ui/ui test

# Watch mode
pnpm test --watch
```

### E2E Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run specific test file
pnpm test:e2e apps/demo/e2e/studio.spec.ts

# Debug mode
pnpm test:e2e --debug
```

### Visual Regression

```bash
# Run Chromatic
pnpm chromatic

# Or via Storybook
pnpm storybook
```

---

## Test Data

### Fixtures

**Location:** `apps/demo/e2e/fixtures/`

**Usage:**
```typescript
import { fixtures } from './fixtures'

test('uses fixture data', async ({ page }) => {
  await page.goto('/studio')
  // Use fixture data
})
```

---

## Gotchas

- **Test Isolation:** Each test should be independent
- **Async Operations:** Use proper async/await
- **Timeouts:** Set appropriate timeouts for E2E tests
- **Flakiness:** Avoid flaky tests (use proper selectors)

---

## Next Steps

- [Component Implementation](./component-implementation.md) - Build components
- [Testing Documentation](../testing/) - Detailed testing guides

---

**Last Updated:** 2025-01-XX

