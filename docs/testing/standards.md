# Component Testing Standards

**Purpose:** Comprehensive testing standards for Fragment UI components  
**Audience:** Engineers writing component tests  
**When to read:** When writing or reviewing component tests

---

## Overview

Every component in Fragment UI should pass the following test categories:

1. **Accessibility Tests (A11y)** - WCAG 2.1 compliance
2. **Unit Tests** - Functionality and logic
3. **E2E Tests** - Integration in Playground environment
4. **Visual Regression Tests** - Chromatic snapshots
5. **Performance Tests** - Bundle size and runtime performance
6. **Responsive Tests** - Different viewports and devices
7. **Interaction Tests** - Keyboard navigation, focus management
8. **State Tests** - Loading, error, disabled, hover, focus

---

## 1. Accessibility Tests (A11y)

### Standard: WCAG 2.1 Level AA

### Tools:
- `vitest-axe` + `axe-core` for automated tests
- Storybook A11y addon for manual review
- Playwright accessibility snapshots

### What We Test:

#### 1.1. Automated A11y Tests (axe-core)

```typescript
// packages/ui/src/a11y.test.tsx
it("Component should have no A11y violations", async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results.violations).toHaveLength(0);
});
```

**Checked Aspects:**
- ✅ No WCAG 2.1 violations
- ✅ Correct ARIA roles
- ✅ Labels and `aria-*` attributes
- ✅ Color contrast (4.5:1 for text)
- ✅ Semantic HTML elements
- ✅ Focus management
- ✅ Keyboard navigation

#### 1.2. Manual A11y Review

- Use Storybook A11y addon
- Test with screen readers
- Test keyboard navigation
- Verify focus indicators

---

## 2. Unit Tests

### Framework: Vitest + React Testing Library

### What We Test:

- **Rendering:** Component renders correctly
- **Props:** Props work as expected
- **Variants:** All variants render correctly
- **Events:** Event handlers work
- **State:** Component state management

### Example:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
  
  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    screen.getByText('Click me').click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

---

## 3. E2E Tests

### Framework: Playwright

### What We Test:

- **User Flows:** Complete user workflows
- **Integration:** Component integration in apps
- **Studio:** UI generation and editing
- **Portal:** Component browsing and documentation

### Example:

```typescript
import { test, expect } from '@playwright/test'

test('studio generates UI', async ({ page }) => {
  await page.goto('/studio')
  await page.fill('[data-testid="prompt-input"]', 'Create a login form')
  await page.click('[data-testid="generate-button"]')
  await expect(page.locator('form')).toBeVisible()
})
```

---

## 4. Visual Regression Tests

### Framework: Chromatic

### What We Test:

- **Visual Appearance:** Component looks correct
- **Variants:** All variants render correctly
- **States:** Loading, error, disabled states
- **Responsive:** Different viewport sizes

### Example:

```typescript
// Storybook story
export const Default: Story = {
  render: () => <Button>Click me</Button>
}

export const Variants: Story = {
  render: () => (
    <div>
      <Button variant="default">Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  )
}
```

---

## 5. Performance Tests

### What We Test:

- **Bundle Size:** Component bundle size
- **Runtime Performance:** Component render time
- **Lighthouse:** Performance budgets

### Example:

```typescript
import { checkBundleSize } from '@fragment_ui/quality-checks'

it('meets bundle size budget', async () => {
  const size = await checkBundleSize(componentCode)
  expect(size).toBeLessThan(50000) // 50KB
})
```

---

## 6. Responsive Tests

### What We Test:

- **Viewports:** Mobile, tablet, desktop
- **Breakpoints:** All breakpoints work
- **Layout:** Layout adapts correctly

### Example:

```typescript
test('responsive layout', async ({ page }) => {
  // Mobile
  await page.setViewportSize({ width: 375, height: 667 })
  await expect(page.locator('.component')).toHaveCSS('flex-direction', 'column')
  
  // Desktop
  await page.setViewportSize({ width: 1920, height: 1080 })
  await expect(page.locator('.component')).toHaveCSS('flex-direction', 'row')
})
```

---

## 7. Interaction Tests

### What We Test:

- **Keyboard Navigation:** Tab, Enter, Escape
- **Focus Management:** Focus moves correctly
- **ARIA:** ARIA attributes work

### Example:

```typescript
test('keyboard navigation', async ({ page }) => {
  await page.goto('/components/button')
  await page.keyboard.press('Tab')
  await expect(page.locator('button:focus')).toBeVisible()
})
```

---

## 8. State Tests

### What We Test:

- **Loading State:** Loading indicator shows
- **Error State:** Error message displays
- **Disabled State:** Component is disabled
- **Hover State:** Hover styles apply
- **Focus State:** Focus styles apply

### Example:

```typescript
it('shows loading state', () => {
  render(<Button loading>Click me</Button>)
  expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
})
```

---

## Test Coverage Requirements

- **Minimum Coverage:** 80% code coverage
- **Critical Paths:** 100% coverage for critical paths
- **A11y:** 100% of components must pass a11y tests
- **E2E:** All critical user flows must have E2E tests

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
```

### Visual Regression

```bash
# Run Chromatic
pnpm chromatic
```

---

## Gotchas

- **Test Isolation:** Each test should be independent
- **Async Operations:** Use proper async/await
- **Timeouts:** Set appropriate timeouts for E2E tests
- **Flakiness:** Avoid flaky tests (use proper selectors)

---

## Next Steps

- [Testing Guide](./guide.md) - Detailed testing guide
- [Development - Testing](../development/testing.md) - Testing strategy

---

**Last Updated:** 2025-01-XX
