---
title: Testing Guide - Comprehensive Checks
---

A complete guide to running all tests in the Fragment UI project.

## 📋 Test types

The project includes these test types:

1. **A11y Tests** – Accessibility checks (38 components)
2. **Unit Tests** – Component unit tests
3. **Performance Tests** – Lighthouse CI
4. **Visual Regression Tests** – Chromatic
5. **Bundle Size Tests** – Bundle size analysis

## 🚀 Quick start – run everything

```bash
# Run all tests
pnpm test

# Run all tests + build
pnpm test && pnpm build

# Full verification (tests + build + bundle analysis)
pnpm test && pnpm build && pnpm bundle:analyze
```

## ♿ A11y Tests

Accessibility tests use `vitest-axe` and `axe-core` to check WCAG 2.1 compliance.

### How to run

```bash
# A11y tests for all components
pnpm test:a11y

# A11y tests for a specific file
pnpm test packages/ui/src/a11y.test.tsx
```

### Location

```
packages/ui/src/a11y.test.tsx
```

### Coverage

A11y tests cover 38 components:

- All core UI components
- Form components
- Navigation components
- Feedback components

## 🧪 Unit Tests

Unit tests use `Vitest` and `React Testing Library`.

### How to run

```bash
# All unit tests
pnpm test

# Watch mode
pnpm test:watch

# With coverage
pnpm test:coverage
```

### Location

Unit tests live in `*.test.tsx` files next to components.

## ⚡ Performance Tests

Performance tests use `Lighthouse CI` to monitor Core Web Vitals and enforce budgets.

### How to run

```bash
# Run Lighthouse CI locally
pnpm --filter @fragment_ui/www start &
lhci autorun

# Check bundle size
pnpm bundle:analyze
```

### Configuration

Lighthouse CI config:

```
lighthouserc.js
```

### Performance budgets

- **First Contentful Paint (FCP):** < 1.8s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Time to Interactive (TTI):** < 3.8s
- **Total Blocking Time (TBT):** < 200ms
- **Cumulative Layout Shift (CLS):** < 0.1

## 🎨 Visual Regression Tests

Visual tests use `Chromatic` to compare component screenshots.

### How to run

```bash
# Run Storybook and Chromatic
pnpm storybook
npx chromatic --project-token=YOUR_TOKEN

# In CI/CD Chromatic runs automatically (GitHub Actions)
```

### Configuration

Chromatic config: `packages/ui/.storybook/preview.ts` and `.github/workflows/chromatic.yml`.

### Features

- Multiple viewports (mobile, tablet, desktop)
- Multiple themes (light, dark, high-contrast)
- Automatic visual diffing
- Review changes before merge

## 📦 Bundle Size Tests

Bundle analysis checks component sizes and limits.

### How to run

```bash
# Bundle size analysis
pnpm bundle:analyze

# Check limits
pnpm bundle:check
```

### Limits

- **Max component size:** 50KB (source)
- **Max gzipped:** 15KB
- **Alert threshold:** 80% of limit

## 🔄 CI/CD Integration

All tests run automatically in GitHub Actions.

### Workflow files

- `.github/workflows/ci.yml` – Unit tests, build, bundle size
- `.github/workflows/performance.yml` – Lighthouse CI
- `.github/workflows/chromatic.yml` – Visual regression tests

### When they run

- **Push to main:** all tests
- **Pull Request:** unit tests, build, bundle size
- **Merge to main:** performance tests, Chromatic

## 📝 Best Practices

- **Before commit:** run `pnpm test` locally
- **Before PR:** run all tests and check bundle size
- **After visual changes:** review Chromatic results
- **After performance changes:** check Lighthouse CI
- **When adding components:** add A11y and unit tests

## 🐛 Troubleshooting

### A11y tests failing

- Verify ARIA attributes
- Ensure all interactive elements are keyboard accessible
- Check color contrast

### Performance tests failing

- Check bundle size limits
- Optimize heavy components (code splitting, lazy loading)
- Remove unnecessary dependencies

### Visual regression tests failing

- Verify if changes are intentional
- If yes, accept updates in Chromatic
- Confirm viewport and theme are correct

## 🔗 Links

- [Visual Regression Testing](/docs/testing/visual-regression)
- [Performance Tests](/docs/testing/performance-tests)
- [GitHub Actions](https://github.com/blazejrzepa/fragment-ui/actions)

